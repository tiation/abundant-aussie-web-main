import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User, IUser } from '../models/User';

// JWT Strategy for API authentication
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'default-secret',
}, async (payload, done) => {
  try {
    const user = await User.findById(payload._id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      // Check if user exists with the same email
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.socialProviders = [...new Set([...user.socialProviders, 'google'])];
          user.isEmailVerified = true; // Google emails are verified
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }
      }

      // Create new user
      const newUser = new User({
        googleId: profile.id,
        name: profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName || 'Google User',
        email,
        isEmailVerified: true,
        socialProviders: ['google'],
        lastLogin: new Date(),
      });

      await newUser.save();
      return done(null, newUser);
    } catch (error) {
      return done(error, false);
    }
  }));
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'displayName'],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Facebook ID
      let user = await User.findOne({ facebookId: profile.id });
      
      if (user) {
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      // Check if user exists with the same email
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          // Link Facebook account to existing user
          user.facebookId = profile.id;
          user.socialProviders = [...new Set([...user.socialProviders, 'facebook'])];
          user.isEmailVerified = true; // Facebook emails are verified
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }
      }

      // Create new user
      const newUser = new User({
        facebookId: profile.id,
        name: profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName || 'Facebook User',
        email,
        isEmailVerified: true,
        socialProviders: ['facebook'],
        lastLogin: new Date(),
      });

      await newUser.save();
      return done(null, newUser);
    } catch (error) {
      return done(error, false);
    }
  }));
}

// Serialize user for session (if using sessions)
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

export default passport;
