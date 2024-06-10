const passport =require('passport-google-oauth2');
const { User } = require('../models/user');
const googleStrategy = require('passport-google-oauth2').Strategy
require('dotenv')
passport.use(new googleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : 'http://localhost:3000/auth/google/auth',
    passReqToCallback : true

},
function(req, accessToken, refreshToken, profile, done){
   done(null, profile)
  }

));

passport.serialzeUser((user, done)=>{
    done(null, User)
})
passport.deserialzeUser((user, done)=>{
    done(null, User)
})