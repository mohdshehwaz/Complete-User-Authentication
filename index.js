const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customWare = require('./config/middleware');

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));

app.use(expressLayouts);
// extract styles and scripts of subpages into layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
// ejs engine
app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name:'HABIT TRACKER',
    //TODO change the secret before deployment in production code
    secret:'secret123',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*60)
    },
    store:MongoStore.create({
        mongoUrl:'mongodb://127.0.0.1:27017/HabitData',
       autoRemove:'disabled'
    })
}));

app.use(passport.initialize()); 
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customWare.setFlash);

app.use('/',require('./routes/index'));

app.listen(port,(err) => {
    if(err){
        console.log(err);
        return;
    }
    console.log("Server is running on port", port);
});