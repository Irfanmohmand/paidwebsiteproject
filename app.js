const express = require('express');
const app = express();
const path = require('path');
const userModel = require("./models/user");
const userorderModel = require("./models/userorder");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());



app.get("/", (req, res) => {
  res.render("mainpage")
});

app.get("/create", (req, res) => {
  res.render("create")
});

app.post("/create", async (req, res) => {
  let { name, rollno, section, email, password, contact } = req.body;
  let user = await userModel.findOne({ email });

  if (user) {
    res.send("User email already registered...");
  }
  else {
    let user = await userModel.create({
      name,
      rollno,
      section,
      email,
      password,
      contact
    });

    let token = jwt.sign({ email }, "paidwebtoken");
    res.cookie("token", token);
    res.redirect("/login");
  };
})

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});


app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });

  if (!user) {
    return res.send("Your email is incorrect..."); // Use return to prevent further execution
  } else if (password === user.password) {
    let token = jwt.sign({ email }, "paidwebtoken");
    res.cookie("token", token);
    return res.redirect("/profile"); // Use return to ensure no further response is sent
  } else {
    return res.send("You cannot login..."); // Use return here too
  }
});


app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

function isLoggedIn(req, res, next) {
  if (!req.cookies.token) {
    return res.send("You need to login..."); // Use return to prevent further execution
  }

  jwt.verify(req.cookies.token, "paidwebtoken", (err, data) => {
    if (err) {
      return res.send("Invalid token."); // Handle invalid token
    }
    req.user = data;
    next(); // Call next if token is valid
  });
};

app.get("/order", (req, res) => {
  res.render("order");
});

app.post("/order", async (req, res) => {
  let { content } = req.body;

  let userorder = await userorderModel.create({
    content
  });
  res.redirect("order");
});



// Find the userOrder
app.get("/userorder", async (req, res) => {
  let post = await userorderModel.find();
  res.send(post)
});

// Find User
app.get("/user", async (req, res) => {
  let user = await userModel.find();
  res.send(user)
})





app.listen(3000);