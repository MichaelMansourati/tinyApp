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

//-------------GET-------------//

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



app.get("/", (req, res) => {
  const currentUsername = req.cookies["username"];

  console.log(currentUsername);
  res.end("Hello!");
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
  const longURL = urlDatabase[req.params.id];
  console.log(longURL);

  if(longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send('Sorry, we cannot find that!');
  }
});

//-----------POST-------------//

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
  const username = req.body.username;
  // const currentUsername = req.cookies["username"];
  res.cookie("username", username);
  res.redirect("/");
})


app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect("/")
})


app.post("/urls/:id/delete", (req, res) => {
  console.log(delete urlDatabase[req.params.id]);
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  const id = generateRandomString();

  console.log(req.body);  // debug statement to see POST parameters
  res.redirect(`/urls/${id}`);
  urlDatabase[id] = req.body.longURL;
});

//----------/      \----------//

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
//------------------------//



// app.get("/hello", (req, res) => {
//   res.end("<html><body>Hello <b>World</b></body></html>\n");
// });


