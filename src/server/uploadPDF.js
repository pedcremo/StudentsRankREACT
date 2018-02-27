var fs = require('fs');
var exec = require('child_process').exec;
var formidable = require('formidable');
var mkdirp = require('mkdirp');
var deleteFolder = require('./utils/deleteFolder')();
module.exports = function() {
    var service = {
        uploadPDF:uploadPDF
    };
    return service;
  
    function uploadPDF(req,res,dbase,dbcode){
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
                                      var surname = fileName[0];
                                      var backFile = fileName[1].split('.');
                                      var name = backFile[0];
                                      finalJSON.push([hashcode(name + surname),{"name":name,"surname":surname,"id":hashcode(name + surname),"attitudeTasks":[]}]);
                                      //Copy pictures to "fotos" from "output" folder
                                      fs.createReadStream('output/'+file).pipe(fs.createWriteStream('src/server/data/fotos/'+hashcode(name + surname)+'.jpg'));
                            
                                    });
                                      //Create folder subject if not exist
                                    mkdirp('src/server/data/' + req.user.id + '/'+fields.subjectName+'/', function (err) {
                                        if (err) console.error(err)
                                        else {
                                          fs.writeFile('src/server/data/' + req.user.id + '/'+ fields.subjectName+'/students.json', JSON.stringify(finalJSON), 'utf8', (err) => {
                                            if (err) {
                                              throw err;
                                           }
                                           updateSubjects(req,res,fields.subjectName);
                                            //Change subects on lowdb
                                            if (!dbase.get('shares').find({'defaultSubject': fields.subjectName}).value()) {
                                              dbase.get('shares')
                                              .push({'defaultSubject':fields.subjectName,'src':'src/server/data/' + req.user.id + '/' + fields.subjectName + '/students.json','hits':0})
                                              .write();
                                              dbcode.get('codes')
                                              .push({'id':makeid(),'idUser':req.user.id,'idSubject': fields.subjectName})
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
      function updateSubjects(req,res,subject='test'){
        //Update subjects.json
        fs.readFile('src/server/data/' + req.user.id + '/subjects.json','utf8', function(err, data) {
          if (err) throw err;
          console.log('OK:');
          let newJSON = JSON.parse(data);
          newJSON.defaultSubject = subject;
          newJSON.subjects.push(subject);
          fs.writeFile('src/server/data/' + req.user.id + '/subjects.json', JSON.stringify(newJSON), 'utf8', (err) => {
            if (err) {
              throw err;
            }
            //Delete temporal folders
            deleteFolder.deleteFolderRecursive('src/server/tmp')
            deleteFolder.deleteFolderRecursive('output')
            res.status(200).send('[]');
            console.log('The file has been saved empty!');
          });
        });
      }
      function hashcode(str) {
        let hash = 0, i, chr;
        if (str.length === 0) {
          return hash;
        }
        for (i = 0; i < str.length; i++) {
          chr   = str.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
        }
        return hash;
      }
      function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }
  };
  