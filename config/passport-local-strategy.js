const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;
// authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email', 
    },
    async (email,password,done) => {
        // find a user and establish the identity
        try{
            const user = await User.findOne({email:email});
            const result = await bcrypt.compare(password, user.password);
            console.log("Becrypted password is -> ");
            if(!result){
                console.log("Error in finding the user");
                
                return done(null,false,{ message: 'Password entered is incorrect.' });
            }
            return done(null,user);
        }
        catch(err){
            console.log("Error in finding the user");
            return done(err);
        }
    }   
));

// serialize the user to decide which key to be kept in the cookies
passport.serializeUser((user,done) => {
    done(null,user.id);
});

// deserialinzing the user from the key in cookies
passport.deserializeUser(async (id,done) => {
    try{
        const user = await User.findById(id);
        return done(null,user);
    }
    catch(err){
        console.log("Error in finding the user");
        return done(err);
    }

    
});
// check user is authenticated
passport.checkAuthentication = async (req,res,next) => {
    
    if(req.isAuthenticated()){
        return next();
    }
    console.log("In authentication");
    //if the user is not signed in
    return res.redirect('/users/sign-in');
}
passport.setAuthenticatedUser = async (req,res,next) => {
    if(req.isAuthenticated()){ 
        //req.user contains the current signin user from the session cookie

        res.locals.user = req.user;
        
    }
    next();
}
module.exports = passport;
