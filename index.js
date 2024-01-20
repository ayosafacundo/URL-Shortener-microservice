import dotenv from 'dotenv';
import express, { urlencoded, static as st } from 'express';
import cors from 'cors';
import URLModel from './models/url.model.js';

const app = express();
dotenv.config();
// Database Connection
import mongoose from "mongoose";

const uri = process.env.ATLAS_URI || "";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}
connect();

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('/public', st(`${process.cwd()}/public`));

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

var Database = [];

app.post('/api/shorturl', async (req, res) => {
  if (!validateURL(req.body.url)) return res.json({ error: "invalid url" }); // invalid URL

  let urlExistsInDatabase = await Database.find((e) => e.original_url === req.body.url); // url query to assess if it exists in db

  if (urlExistsInDatabase) {
    return res.json(Database.find((e) => e.original_url = req.body.url));
  } else {

    let index = Database.length;
    Database.push({
      original_url: `https://${req.body.url}`,
      short_url: `localhost:${port}/api/shorturl/` + parseInt(index)
    });

    return res.json(Database[index]);
  }
});

app.get('/urls', (req, res) => {
  res.json({ Database });
})

app.get('/api/shorturl/:url', (req, res) => {
  let urlExistsInDatabase = Database.find((e) => e.short_url === `localhost:${port}/api/shorturl/` + parseInt(req.params.url));
  console.log(urlExistsInDatabase);
  if (urlExistsInDatabase) {
    res.writeHead(302, {
      location: urlExistsInDatabase.original_url
    });
  }
  res.json({
    "error": "Invalid Shorturl"
  })
});