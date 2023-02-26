
module.exports.home = (req,res) => {
   console.log("Home controller Of the users controller ********* Now this")
   if(req.isAuthenticated()){
        res.redirect('/users/profile');
    }
    return res.render('home', {
        title: "Home"
    });
}