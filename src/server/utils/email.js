var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var sg=require('../sendgrid.json');

exports.sendEmail=function(req,res){
        var emailTo = '';
        var emailFrom = '';
        var subject='';
        var ruta='';
        var body = '';
        console.log(req.body);
            emailTo = req.body.student;
            emailFrom = req.body.teacher;
            subject = req.body.subject;
            body = req.body.text;
        
          var template =
            '<html>' +
            '<head>' +
            '<meta charset="utf-8" />' +
            '<style>' +
            '* { margin: 0; padding: 0;text-align: center;}'+
            'body { margin: 0 auto; width: 600px; height: 300px;}'+
            'header { padding: 20px; background-color: blue; color: white; padding-left: 20px; font-size: 25px;}'+
            'section { padding-top: 50px; padding-left: 50px; margin-top: 3px; margin-bottom: 3px; height: 100px; background-color: ghostwhite;}'+
            'footer { padding: 5px; padding-left: 20px; background-color: blue; color: white;}'+
            '</style>' +
            '</head>'+
            '<body>'+
            '<section>'+ body +'</section>'+
            '<footer> <p> Enviado por ServiOntiTec</p></footer>'+
            '</body>'+
            '</html>';
        
          var email = {
            from: emailFrom,
            to: emailTo,
            subject: subject,
            text: req.body.text,
            html: template
          };
          //Input APIKEY Sendgrid
          var options = {
            auth: {
              api_key: sg.SENDGRID_API_KEY
            }
          };
          var mailer = nodemailer.createTransport(sgTransport(options));
          mailer.sendMail(email, function(error, info) {
            if (error) {
              res.status('401').json({
                err: info
              });
            } else {
              res.status('200').json({
                success: true
              });
            }
          });
    }
