const User = require('../models/user');
const sendEmail = require('../mailer/mailer');
const bcrypt = require('bcrypt');
var randomStr = "";
module.exports.profile = function(req, res){
    console.log("In the user profile page")
    return res.render('user_profile', {
        title: 'User Profile',
    });
}


// render the sign up page
module.exports.signUp = function(req, res){
   
    if(req.isAuthenticated()){
        res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
    
    if(req.isAuthenticated()){
        res.redirect('/users/profile');
    }
    
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}
// sign up for the user
module.exports.create_user =async (req,res) => {
    try{
        // first check password is match with the confirm password
        if(req.body.password != req.body.confirm_password){
            req.flash('success','Password does not match');
            return res.redirect('back');
        }
        // find the user by his email id
        const user = await User.findOne({email:req.body.email});
        // if user does not exists in our database than we can regisster this user
        console.log("Already registerd");
        if(!user){
            console.log("users are ->",req.body);
            const hash = await bcrypt.hash(req.body.password, 10);
            req.body.password = hash;
            const newUser = await User.create(req.body);
            if(newUser){
                req.flash('success','User successfully created');
                return res.redirect('/users/sign-in');
            }
            req.flash('success','User not created due to some reason');
            return res.redirect('back');
        }
        req.flash('success','User not created due to some reason');
        return res.redirect('back');
    }
    catch(err){
        return res.redirect('back');
    }
    
}
module.exports.createSession = async (req,res) => {
    // try{
    //     const user =await User.findOne({email:req.body.email});

    //     if(user){
    //         if(user.password != req.body.password){
    //             return res.redirect('back');

    //         }
    //         console.log("In the create session page");
    //         res.cookies('user_id',user.id);
    //         return res.redirect('/users/profile');
    //     }
    //     return res.redirect('back');
    // }
    // catch(err){
    //     return res.redirect('back');
    // }
    req.flash('success','Logged in Successfully');
    return res.redirect('/users/profile');
    

}
module.exports.destroySession =  function(req, res,next){
    req.flash('success','You have Logged out');
    req.session.destroy();
    
    return res.redirect('/users/sign-in');
} 

module.exports.reset = async (req,res) => {
    console.log("Id for the reset pasword of the user is",req.params.id);

    const user = await User.findById(req.params.id);
    if(user){
        let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTYVWXYZ";
        let len = 8;
        randomStr="";
        for(let i=0;i<len;i++){
            let num = Math.floor(Math.random()*chars.length);
            randomStr += chars.substring(num,num+1);
            
        }
        req.flash('success','An Email is sent to the user for Reset Password');
        sendEmail.sendMail(user,randomStr);
        return res.render('reset'); 
        // console.log(user);

    }

    return res.redirect('back');
}
module.exports.resetPass = async (req,res) => {
    console.log(req.user._id);
    console.log(req.body);
    try{
        if(req.body.sendpassword == randomStr){
            if(req.body.password != req.body.confirm_password){
                req.flash('success','Please Enter a valid confirm Password');
                return res.redirect('back');
            }
            const hash = await bcrypt.hash(req.body.password, 10);
            const user = await User.updateOne({_id:req.user._id},{
                $set:{
                    password:hash,
                }
            })
            if(user){
                req.flash('success','Password update successfully');
                return res.redirect('/users/profile');
            }
    
        }
        req.flash('success','Please Enter a valid Password');
        return res.redirect('back');

    }
    catch(err){
        req.flash('success','Please Enter a valid Password');
        return res.redirect('back');
    }
    

}