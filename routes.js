const router = require("express").Router();
const passport = require("passport");
const { body } = require("express-validator");
const {
  homePage,
  register,
  registerPage,
  login,
  loginPage,
} = require("./controllers/userController");

const ifNotLoggedin = (req, res, next) => {
  console.log("NotLogged");
  if (!req.session.userID) {
    return res.redirect("/login");
  }
  next();
};
const ifLoggedin = (req, res, next) => {
  if (req.session.userID) {
    return res.redirect("/");
  }
  next();
};

//GOGLE AUTH
const dbConnection = require("./utils/dbConnection");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.get("/auth/google", passport.authenticate("google"), (req, res) =>
  res.send(200)
);

router.get("/auth/google/callback", (req, res) => {
  passport.authenticate("google", {
    successRedirect: "/auth-success",
    failureRedirect: "/auth-error",
  })(req, res);
});

router.get("/auth-success", isLoggedIn, async (req, res) => {
  console.log("Auth-suc");
  console.log("reqsess" + req.session);
  const [row] = await dbConnection.execute(
    "SELECT * FROM `users`WHERE `email`=?",
    [req.user.email]
  );
  req.session.userID = row[0].id;
  res.redirect("/");
});

router.get("/auth-error", (req, res) => {
  res.send("Something went wrong");
});

//Github auth
router.get("/auth/github", passport.authenticate("github"), (req, res) => {
  console.log("git");
  res.send(200);
});

router.get("/auth/github/callback", (req, res) => {
  passport.authenticate("github", {
    successRedirect: "/git/auth-success",
    failureRedirect: "/git/auth-failure",
  })(req, res);
});

router.get("/git/auth-success", isLoggedIn, async (req, res) => {
  console.log("Auth-suc");
  console.log("reqsess" + req.session);
  const [row] = await dbConnection.execute(
    "SELECT * FROM `users`WHERE `email`=?",
    [req.user.username]
  );
  req.session.userID = row[0].id;
  res.redirect("/");
});

router.get("/git/auth-failure", (req, res) => {
  res.send("Something went wrong");
});

//LOGIN
router.get("/", ifNotLoggedin, homePage);
router.get("/login", ifLoggedin, loginPage);
router.post(
  "/login",
  ifLoggedin,
  [
    body("_email", "Invalid email address")
      .notEmpty()
      .escape()
      .trim()
      .isEmail(),
    body("_password", "The Password must be of minimum 4characters length")
      .notEmpty()
      .trim()
      .isLength({ min: 4 }),
  ],
  login
);

//REGISTER
router.get("/signup", ifLoggedin, registerPage);
router.post(
  "/signup",
  ifLoggedin,
  [
    body("_name", "The name must be of minimum 3 characterslength")
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body("_email", "Invalid email address")
      .notEmpty()
      .escape()
      .trim()
      .isEmail(),
    body("_password", "The Password must be of minimum 4characters length")
      .notEmpty()
      .trim()
      .isLength({ min: 4 }),
  ],
  register
);

//LOGOUT
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    next(err);
  });
  res.redirect("/login");
});
module.exports = router;
