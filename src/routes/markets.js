const Router = require("express"); rfrfr
const User = require("../database/schemas/User");
const { hashPassword, comparePassword } = require("../utlis/helper");
const passport = require("passport");

const router = Router();

const marketList = [
  {
    id: 1,
    walmart: 9,
    miles: 0.6,
  },
  {
    id: 1,
    walmart: 9,
    miles: 3,
  },
  {
    id: 2,
    pheonix: 9,
    miles: 3.4,
  },
  {
    id: 3,
    buyone: 9,
    miles: 3.9,
  },
];

router.get("", (request, response) => {
  const { miles } = request.query;
  const parsedMiles = parseInt(miles);
  if (!isNaN(parsedMiles)) {
    const filteredStores = marketList.filter((m) => m.miles <= parsedMiles);
    response.send(filteredStores);
  } else {
    response.send(marketList);
  }
});

// router.post("/login", async (request, response) => {
//   const { email, password } = request.body;
//   if (!email || !password)
//     return response.status(400).send("Email and password required!!");
//   const userDB = await User.findOne({ email });
//   if (!userDB) return response.send(401);
//   const isValid = comparePassword(password, userDB.password);
//   if (isValid) {
//     // request.session.user = userDB;
//     return response.send(200);
//   } else {
//     return response.send(401);
//   }
// });

router.post("/login", passport.authenticate("local"), (request, response) => {
  console.log("logged in");
  response.send(201);
});

router.post("/register", async (request, response) => {
  const { email } = request.body;
  const userDB = await User.findOne({ email });
  if (userDB) {
    response.status(400).send({ msg: "User already exist!" });
  } else {
    const password = hashPassword(request.body.password);
    console.log(password);
    const newUser = await User.create({ username, password, email });
    newUser.save();
  }
});

router.get(
  "/discord",
  passport.authenticate("discord"),
  (request, response) => {
    response.send(200);
  }
);

router.get(
  "/discord/redirect",
  passport.authenticate("discord"),
  (request, response) => {
    response.send(200);
  }
);

module.exports = router;
