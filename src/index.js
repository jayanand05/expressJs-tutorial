const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
// require("./strategies/local");
require("./strategies/discord");

const groceriesRoute = require("./routes/groceries");
const marketRoute = require("./routes/markets");
// const authRoute = require("./routes/auth");

require("./database");

const app = express();
const PORT = 3009;

app.use(express.json());
app.use(express.urlencoded());
// app.use("/api/v1/auth", authRoute);

app.use(cookieParser());
app.use(
  session({
    secret: "SISIAXIKSXNSXKSNXJNSKXNSNXBSJXNJNX",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use("/api/v1/groceries", groceriesRoute);
app.use("/api/v1/markets", marketRoute);

app.listen(PORT, () => console.log(`Running express server on Port${PORT}`));
