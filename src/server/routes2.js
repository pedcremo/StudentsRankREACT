let router = require('express').Router();
let four0four = require('./utils/404')();
let passport = require('passport');

router.post('/login',passport.authenticate('local'),login);
router.get('/loggedin',loggedIn);
router.get('/loginGoogle',loginGoogle);
router.get('/loginFacebook',logonFacebook);
router.get('/auth/facebook/callback',facebookCalllBack);
router.get('/auth/twitter/callback',twitterCallBack);
router.get('/auth/google/callback',googleCallBack);

router.get('/getStudents', getStudents);
router.get('/getGradedTasks', getGradedTasks);
router.get('/getAttitudeTasks', getAttitudeTasks);
router.get('/getSettings', getSettings);
router.get('/changeSubject', changeSubject);
router.get('/addSubject',addSubject);
router.get('/getSharedGroups',getSharedGroups);
router.get('/getCode', getCode);
router.get('/renameSubject', renameSubject);
router.get('/sendEmail', sendEmail);
router.get('/read/:code',readCode);

router.get('/logout',logout);
router.get('/*', four0four.notFoundMiddleware);

// login using local user
function login(req, res) {
    console.log('login ' + JSON.stringify(req.user));
    console.log('session ' + JSON.stringify(req.session));
    res.send(req.user);
};

