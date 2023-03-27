require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

const validateURL = (url) => {

  //https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
  let expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  let regex = new RegExp(expression);

  if (url.match(regex)) {
    return true;
  } else {
    return false;
  }
}

const urlDB = []

app.post('/api/shorturl', (req, res) => {

  if (!validateURL(req.body.url)) return res.json({ error: "invalid url" }); // Url validation

  let urlExistsInDatabase = urlDB.find((e) => e.original_url === req.body.url) ? true : false; // url query to assess if it exists in db

  if (urlExistsInDatabase) {
    return res.json(urlDB.find((e) => e.original_url = req.body.url));
  } else {

    let index = urlDB.length;
    urlDB.push({
      original_url: req.body.url,
      short_url: `https://boilerplate-project-urlshortener.ayosafacundo.repl.co/api/shorturl/` + parseInt(index)
    });

    return res.json(urlDB[index]);
  }
});

app.get('/api/shorturl/:url', (req, res) => {
  let urlExistsInDatabase = urlDB.find((e) => e.short_url === parseInt(req.params.url)) ? true : false;
  if (urlExistsInDatabase) {
    res.redirect(urlDB.find((e) => e.short_url === parseInt(req.params.url)).original_url);
  }
  res.json({
    "error": "Invalid Shorturl"
  })
});