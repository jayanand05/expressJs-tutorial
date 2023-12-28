const passport = require("passport");
const { Strategy } = require("passport-local");
const User = require("../database/schemas/User");
const { comparePassword } = require("../utlis/helper");

passport.serializeUser((user, done) => {
  console.log("Serializing User...");
  console.log(User);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing User...");
  console.log(id);
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    console.log(user);
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
});

passport.use(
  new Strategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      console.log(email);
      console.log(password);
      if (!email || !password) {
        throw new Error("Missing Credentials");
      }
      try {
        const userDB = await User.findOne({ email });
        if (!userDB) throw new Error("User not found");
        const isValid = comparePassword(password, userDB.password);
        if (isValid) {
          console.log("Authenticated Successfully");
          done(null, userDB);
        } else {
          console.log("Invalid Authentication ");
          done(null, null);
        }
      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
  )
);
