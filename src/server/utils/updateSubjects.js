var fs = require('fs');
var deleteFolder = require('./deleteFolder')();
module.exports = function() {
    var service = {
        updateSubjects: updateSubjects
    };
    return service;
  
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
  };
  