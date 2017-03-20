
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const PORT = process.env.PORT || 8080; //default port 8080

app.set("view engine", "ejs")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const urlDatabase = {
  "aaa111": {
    b2xVn2: "http://www.lighthouselabs.ca"
  },
  "bbb222": {
    "9sm5xK": "http://www.google.com"
  }
}

const urlDatabasePublic = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}



const users = {
  "dummyID": {
    id: "dummyID",
    email: "dummyEmail@fake.com",
    password: "dummyhead"
  }
}

//------------LISTEN------------//

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




//-------------GET-------------//

app.get("/", (req, res) => {
  const currentUser =  users[req.cookies.id];
  if (currentUser) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});


app.get("/urls", (req, res) => {
  const currentUser =  users[req.cookies.id];
  if (currentUser) {
    const templateVars = {
      'user': currentUser,
      'urls': urlDatabase[currentUser.id]
    }
  res.statusCode = 200;
  res.render("urls_index", templateVars);
  } else {
    res.status(401).send("<p>You must be logged in to access this function. <a href='/login'>login here</a></p>");
  }
  console.log(urlDatabasePublic);
});


app.get("/urls/new", (req, res) => {
  const currentUser =  users[req.cookies.id];
  const templateVars = {
    user : currentUser
  }
  if (!currentUser) {
    res.status(401).send("<p>You must be logged in to access this function. <a href='/login'>login here</a></p>");
  } else {
    res.statusCode = 200;
  }
  res.render("urls_new", templateVars);
});

/*
to make user-specific databases, all I have to is go from the url creation point and go forward,
simply pushing each new url into the database of the user who created it. the example urls that
exist already are for test purposes! They can either be deleted or hard-coded into those user-specific
databases. databases should be dynamically created upon the first url creation in each new account.

*/


app.get("/urls/:id", (req, res) => {
  const currentUser =  users[req.cookies.id];
  if (!currentUser) {
    res.status(401).send("<p>You must be logged in to access this function. <a href='/login'>login here</a></p>");
  }

  const templateVars = {
    'id': [req.params.id],
    shortURL: `localhost:8080/u/${[req.params.id]}`,
    user: currentUser
  };
  console.log("req.params.id: ", req.params.id);
  console.log("")
  if (urlDatabase[currentUser.id][req.params.id]) {
    templateVars.longURL = `localhost:8080/u/${req.params.id}`;
    res.render("urls_show", templateVars);
    res.status(200);
  } else if (urlDatabasePublic[req.params.id]) {
    // console.log(urlDatabasePublic[theId]);
    res.status(403).send("This short url belongs to another user and may only be modified them.");
  } else if (!urlDatabase[currentUser.id][req.params.id]) {
    res.status(404).send("This short url does not exist");
  }
});




app.get("/login", (req, res) => {
  const currentUser = users[req.cookies.id];
  const templateVars = {
    user : currentUser
  }

  if (currentUser) {
    res.redirect("/");
  } else {
    res.status(200);
    res.render("urls_login", templateVars);
  }
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



app.get(`/u/:id`, (req, res) => {
  console.log('req.params: ', req.params);
  const longURL = urlDatabasePublic[req.params.id];
  const shortURL = (`http://localhost:8080/u/${req.params.id}`);
  console.log('longURL: ', longURL);

  if(longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send('Sorry, we cannot find that!');
  }
});


app.get("/register", (req, res) => {
  const currentUser = users[req.cookies.id];
  const templateVars = {
    user : currentUser
  }
  if (currentUser) {
    res.redirect("/");
  } else {
    res.status(200);
    res.render("urls_register", templateVars);

  }
})




//-------------POST-------------//

app.post("/urls/:id", (req, res) => {
  const currentUser = users[req.cookies.id];
  console.log(req.params.id);
  urlDatabase[currentUser.id][req.params.id] = req.body.longURL;
  urlDatabasePublic[req.params.id] = req.body.longURL;
  console.log(urlDatabasePublic);
  res.redirect("/urls");
})



app.post("/login", (req, res) => {
  let userEmail = req.body.email;
  let userPassword = req.body.password;
  console.log('req.body: ', req.body);
  let foundUser = checkLogin(users, userEmail, userPassword);

  if (userEmail && userPassword) {
    if (foundUser) {
      res.cookie("id", foundUser.id);
      res.redirect('/');
    } else {
      res.status(403).send("Your email and password do not match. Please try again.")
    }
  } else {
    res.status(403).send("Please check to make sure all fields have been filled out appropriately.");
  }
});



app.post("/logout", (req, res) => {
  res.clearCookie("id")
  res.redirect("/")
})



app.post("/urls/:id/delete", (req, res) => {
  currentUser = users[req.cookies.id];
  console.log(delete urlDatabase[currentUser.id][req.params.id]);
  console.log(delete urlDatabasePublic[req.params.id]);
  res.redirect('/urls');
});


app.post("/register", (req, res) => {
  let id = generateRandomString();
  let email = req.body.email;
  let hashPassword = bcrypt.hashSync(req.body.password, 10);
  console.log("req.body: ", req.body);

  if (email && hashPassword) {
    console.log(`email: ${email} and hashPassword: ${hashPassword}`);
    if (validateEmail(users, email) === true) {
      console.log("emailval successful");
      users[id] = {
          'id': id,
          'email': email,
          'hashPassword': hashPassword
      }
      urlDatabase[id] = {};
      res.cookie("id", id);
      res.redirect("/");
    } else {
      console.log("emailval failed??");
      res.status(400).send("The email address you have chosen is already in use. Please choose another.");
    };
  } else {
    res.status(400).send("Please check to make sure all fields have been filled out appropriately.");
  }
});



app.post("/urls", (req, res) => {
  const currentUser = users[req.cookies.id];
  let urlId = generateRandomString();
  console.log("currentUser.id: ", currentUser.id);
  console.log("req.body.longURL: ", req.body.longURL)
  // console.log("urlDatabase[currentUser[id]]: ", urlDatabase[currentUser[id]])
  if (currentUser) {
    if (!urlDatabase[currentUser.id]) {
      urlDatabase[currentUser.id] = {};
    }
    urlDatabase[currentUser.id][urlId] = req.body.longURL;
    urlDatabasePublic[urlId] = req.body.longURL;
    res.redirect(`/urls/${urlId}`);
    console.log(urlDatabase);
  } else {
    res.status(401).send("<p>You must be logged in to access this function. <a href='/login'>login here</a></p>");
  }
});




//----------/   FUNCTIONS   \----------//

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
    } else {
      return true;
    }
  }
}



function checkLogin (database, userEmail, userPassword) {
  let usersArr = Object.keys(database).map((id) => {
    return database[id];
  })
  console.log("usersArr: ", usersArr);
  let foundUser = usersArr.find((user) => {
    return user.email === userEmail && bcrypt.compareSync(userPassword, user.hashPassword);
  })
  if (foundUser) {
    return foundUser;
  }
}
