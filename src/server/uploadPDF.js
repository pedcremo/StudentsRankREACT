var fs = require('fs');
var exec = require('child_process').exec;
var formidable = require('formidable');
var hashcode = require('./utils/hashcode')();
var mkdirp = require('mkdirp');
var updateSubjects = require('./utils/updateSubjects')();
module.exports = function() {
    var service = {
        uploadPDF:uploadPDF
    };
    return service;
  
    function uploadPDF(req,res,dbase){
        if (req.isAuthenticated()) {
          var form = new formidable.IncomingForm();
          form.parse(req, function(err, fields, files) {
               var oldPath = files.myFile.path,
                   fileSize = files.myFile.size,
                   fileExt = files.myFile.name.split('.').pop(),
                   index = oldPath.lastIndexOf('/') + 1,
                   fileName = oldPath.substr(index);
      
                   //Create tmp folder
                   if (!fs.existsSync('src/server/tmp')){
                    fs.mkdirSync('src/server/tmp');
                  }
                  
                   //Create temporal PDF
                   fs.readFile(oldPath, function(err, data) {
                    fs.writeFile('src/server/tmp/tempPDF.pdf', data, function(err) {
                        fs.unlink(oldPath, function(err) {
                            if (err) {
                              res.status(500);
                              res.send(err);
                            } else {
      
                              //Execute script
                              exec('./src/server/scripts/pedfextractor.sh src/server/tmp/tempPDF.pdf', function(error, stdout, stderr) {
                                if(error != null) {
                                        console.log('Error during the execution of redeploy: ' + stderr);
                                }
                                var finalJSON = [];
                                  fs.readdir('./output', function (error, files) {
                                    files.forEach( function( file, index ) {
                                      var fileName = file.split(',');
                                      var surname = fileName[0].toLowerCase();
                                      var backFile = fileName[1].split('.');
                                      var name = backFile[0].toLowerCase();
                                      finalJSON.push([hashcode.hashcode(name + surname),{"name":name,"surname":surname,"id":hashcode.hashcode(name + surname),"attitudeTasks":[]}]);
                                      //Copy pictures to "fotos" from "output" folder
                                      fs.createReadStream('output/'+file).pipe(fs.createWriteStream('src/server/data/fotos/'+hashcode.hashcode(name + surname)+'.jpg'));
                            
                                    });
                                      //Create folder subject if not exist
                                    mkdirp('src/server/data/' + req.user.id + '/'+fields.subjectName+'/', function (err) {
                                        if (err) console.error(err)
                                        else {
                                          fs.writeFile('src/server/data/' + req.user.id + '/'+ fields.subjectName+'/students.json', JSON.stringify(finalJSON), 'utf8', (err) => {
                                            if (err) {
                                              throw err;
                                           }
                                           updateSubjects.updateSubjects(req,res,fields.subjectName);
                                            //Change subects on lowdb
                                            if (!dbase.get('shares').find({'defaultSubject': fields.subjectName}).value()) {
                                              dbase.get('shares')
                                              .push({'defaultSubject':fields.subjectName,'src':'src/server/data/' + req.user.id + '/' + fields.subjectName + '/students.json','hits':0})
                                              .write();
                                              req.user.defaultSubject = fields.subjectName;
                                              req.user.subjects.push(fields.subjectName);
                                          }
                                         });   
                                        }
                                      });
                                  });
                              });
                            }
                          });
                      });
                  });
           });
        }
      
      }
  };
  