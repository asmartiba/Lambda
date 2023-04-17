import express from 'express';
const axios = require('axios');
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/favourites', (req, res) => {
  res.render('favourites');
});


app.get('/book', async (req, res) => {
  try {
    const response = await axios.get('https://the-one-api.dev/v2/book', {
      headers: { Authorization: 'Bearer OeUeZhk8zm3i_1f4FjF9' } // replace with your API key
    });
    const books = response.data.docs;
    res.render('book', { books });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/movie', (req, res) => {
  res.render('movie');
});

export default app;