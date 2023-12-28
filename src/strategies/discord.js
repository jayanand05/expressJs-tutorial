const passport = require("passport");
const { Strategy } = require("passport-discord");
const DiscordUser = require("../database/schemas/DiscordUser");

passport.serializeUser((user, done) => {
  console.log("Serializing User...");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing User...");
  console.log(id);
  try {
    const user = await DiscordUser.findById(id);
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
      clientID: "1177570959738286101",
      clientSecret: "2adW9der5u1ffzMt-vFOilxiMstq7Efn",
      callbackURL: "http://localhost:3009/api/v1/markets/discord/redirect",
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken, refreshToken);
      console.log(profile);
      try {
        const discordUser = await DiscordUser.findOne({
          discordId: profile.id,
        });
        if (discordUser) {
          console.log(`Found User: ${discordUser}`);
          return done(null, discordUser);
        } else {
          const newUser = await DiscordUser.create({
            discordId: profile.id,
          });
          console.log(`Created User: ${newUser}`);
          return done(null, newUser);
        }
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);
