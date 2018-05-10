let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let TwitterStrategy = require('passport-twitter').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.use(new LocalStrategy(
    function(username, password, done) {
      if (username === 'admin' && password === 'admin') { // stupid example
        let user = readSubjectsUser('343242');
        user.id = '343242';
        user.displayName = 'admin';
        return done(null,user);
      }
      if (username === 'pedcremo' && password === 'hola') { // stupid example
        let user = readSubjectsUser('333342');
        user.id = '333342';
        user.displayName = 'Pere Crespo';
        //return done(null,JSON.stringify(user));
        return done(null,user);
      }
  
      return done(null, false, { message: 'Incorrect username.' });
    }
  ));