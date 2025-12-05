import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback" 
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        await User.updateLastLogin(existingUser.id);
        return done(null, existingUser);
      }

      const preVerifiedStudent = await User.findPreVerifiedStudentByemail(email); 
      if (!preVerifiedStudent) {
        return done(null, false, { message: 'Email not authorized for GradNet.' });
      }

      return done(null, false, { message: 'Please complete signup with USN first.' });

    } catch (err) {
      console.error("Passport Google Strategy Error:", err);
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByUserId(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;