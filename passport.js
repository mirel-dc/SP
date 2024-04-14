const passport = require("passport");
const bcrypt = require("bcryptjs");

const GoogleStrategy = require("passport-google-oauth2").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const dbConnection = require("./utils/dbConnection");

passport.use(
  new GoogleStrategy(
    {
      clientID: "URID",
      clientSecret: "URSECRET",
      callbackURL: "http://localhost:3000/auth/google/callback",
      scope: ["email", "profile"],
    },
    async function (accessToken, refreshToken, profile, done) {
      const [row] = await dbConnection.execute(
        "SELECT * FROM `users`WHERE `email`=?",
        [profile.email]
      );
      console.log(row[0]);
      console.log(row == null);
      if (row[0] == undefined) {
        await dbConnection.execute(
          "INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)",
          [
            profile.displayName,
            profile.email,
            await bcrypt.hash(accessToken, 12),
          ]
        );
      }
      done(null, profile);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: "URID",
      clientSecret: "URSECRET",
      callbackURL: "http://localhost:3000/auth/github/callback",
      scope: ["email", "profile"],
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(JSON.stringify(profile, null, 2));
      console.log(profile.displayName);
      const [row] = await dbConnection.execute(
        "SELECT * FROM `users`WHERE `email`=?",
        [profile.username]
      );
      console.log(row[0]);
      console.log(row == null);
      if (row[0] == undefined) {
        await dbConnection.execute(
          "INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)",
          [
            profile.displayName,
            profile.username,
            await bcrypt.hash(accessToken, 12),
          ]
        );
      }
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
