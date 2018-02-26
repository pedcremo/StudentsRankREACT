var fs = require('fs');
module.exports = function() {
    var service = {
        deleteFolderRecursive: deleteFolderRecursive
    };
    return service;
  
    function deleteFolderRecursive(path) {
        if( fs.existsSync(path) ) {
          fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
        }
      };
      
  };
  