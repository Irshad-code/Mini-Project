const log4js = require("log4js");
const logger = log4js.getLogger("jwt-passport");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/users/dbmodels/user.model"); // Import your User model

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY, // Use your secret key
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      logger.debug("jwtPayload", jwtPayload);
      const user = await User.findById(jwtPayload.id);
      logger.debug("user", user);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  })
);

module.exports = passport;
