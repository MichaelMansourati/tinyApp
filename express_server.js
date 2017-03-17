var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; //default port 8080

app.set("view engine", "ejs")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// const data = {
//   users: [
//     { username: 'monica'},
//     { username: 'khurram'}
//   ]
// }

const users = {
  "aaa111": {
    id: "aaa111",
    email: "john@example.com",
    password: "purplemonkeydinosaur"
  },
 "bbb222": {
    id: "bbb222",
    email: "jane@example.com",
    password: "dishwasherfunk"
  }
}

//------------LISTEN------------//

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//-------------GET-------------//

app.get("/", (req, res) => {
  const currentUsername = req.cookies["username"];
  // console.log(currentUsername);
  res.render("partials/_header.ejs", {username: currentUsername});
  res.end("hello again.....")
});



app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



app.get("/urls/new", (req, res) => {
  const currentUsername = req.cookies["username"];
  res.render("urls_new", {username: currentUsername});
});



app.get("/urls", (req, res) => {
  const currentUsername = req.cookies["username"];

  res.render("urls_index", {username: currentUsername, urls: urlDatabase});
});



app.get("/urls/:id", (req, res) => {
  const currentUsername = req.cookies["username"];
  console.log(req.params.id);
  const templateVars = { username: currentUsername, shortURL: [req.params.id], longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});



app.get(`/u/:id`, (req, res) => {
  console.log(req.params.id);
  const longURL = urlDatabase[req.params.id];
  const shortURL =
  console.log(longURL);

  if(longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send('Sorry, we cannot find that!');
  }
});


app.get("/register", (req, res) => {
  const currentUsername = req.cookies["email"]
  // const email = req.body.email;
  // const password = req.body.password;
  // console.log(req.body);
  res.render("urls_register", {users: currentUsername});
})


//-------------POST-------------//

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
})

// app.post("/login", (req, res) => {
//   const username = req.body.username;       //old and bad username that used "data" object
//   data.users.push({username: username})
//   console.log(data);

//   console.log(username);
//   res.cookie("username", username);
//   res.redirect("/");
// })

app.post("/login", (req, res) => {
let id = generateRandomString()
  let email = req.body.email;
  let password = req.body.password;

  if (email && password) {
    if (validateEmail(users, email) === true) {
      let randomUser = {
          'id': id,
          'email': email,
          'password': password
        }
      users[id] = randomUser;
      // console.log(req.body);
      console.log(users);
      res.cookie("id", id);

      res.redirect("/");
    } else {
      res.statusCode = 400;
      res.end("The email address you have chosen is already in use. Please choose another.");
    };
  } else {
    res.statusCode = 400;
    res.end("Please check to make sure all fields have been filled out appropriately.");
  }
});


app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect("/")
})


app.post("/urls/:id/delete", (req, res) => {
  console.log(delete urlDatabase[req.params.id]);
  res.redirect('/urls');
});


app.post("/register", (req, res) => {
  let id = generateRandomString()
  let email = req.body.email;
  let password = req.body.password;

  if (email && password) {
    if (validateEmail(users, email) === true) {
      let randomUser = {
          'id': id,
          'email': email,
          'password': password
        }
      users[id] = randomUser;
      // console.log(req.body);
      console.log(users);
      res.cookie("id", id);

      res.redirect("/");
    } else {
      res.statusCode = 400;
      res.end("The email address you have chosen is already in use. Please choose another.");
    };
  } else {
    res.statusCode = 400;
    res.end("Please check to make sure all fields have been filled out appropriately.");
  }
});

app.post("/urls", (req, res) => {
  const id = generateRandomString();

  console.log(req.body);  // debug statement to see POST parameters
  res.redirect(`/urls/${id}`);
  urlDatabase[id] = req.body.longURL;
  console.log(urlDatabase);
  console.log(req.body.longURL);
});

//----------/      \----------//

function generateRandomString() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function validateEmail(database, emailAddress) {
  for (let folks in database) {
    if (database[folks].email === emailAddress) {
      return false;
    } else { return true };
  }
}

