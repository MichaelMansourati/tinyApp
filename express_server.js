var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; //default port 8080

app.set("view engine", "ejs")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//----------------------------//

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  res.render("urls_index", {urls: urlDatabase});
});

app.get("/urls/:id", (req, res) => {
  console.log(req.params.id);
  const templateVars = { shortURL: [req.params.id], longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

// app.get("/urls/show", (req, res) => {

//   res.render("urls_show");
// });

app.post("/urls", (req, res) => {
  const id = generateRandomString();

  console.log(req.body);  // debug statement to see POST parameters
  res.redirect(`/urls/${id}`);
  urlDatabase[id] = req.body.longURL;
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL; //<---------------- how do I bring the relevant shortURL id in here?
  res.redirect("/urls");
})

app.get(`/u/:id`, (req, res) => {
  const longURL = urlDatabase[req.params.id];

  if(longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send('Sorry, we cannot find that!');
  }
});

app.post("/urls/:id/delete", (req, res) => {
  console.log(delete urlDatabase[req.params.id]);
  res.redirect('/urls');
});

//------------------------//

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 6; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// app.get("/hello", (req, res) => {
//   res.end("<html><body>Hello <b>World</b></body></html>\n");
// });


