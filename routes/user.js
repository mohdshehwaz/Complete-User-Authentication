const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');


router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.get('/profile',passport.checkAuthentication,usersController.profile);
router.post('/create-user',usersController.create_user);
// use passport as middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {
        failureRedirect:'/users/sign-in',
        failureFlash:true
    }
),usersController.createSession);
router.get('/reset/:id',passport.checkAuthentication,usersController.reset);
router.post('/reset',passport.checkAuthentication,usersController.resetPass);
router.get('/sign-out', usersController.destroySession);
router.get('/auth/google',passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);

module.exports = router;

