import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const axios = require('axios');
const app = express();

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/sign-up', (req, res) => {
  res.render('sign-up', { title: 'Sign up' });
});

app.get('/quiz-page', (req, res) => {
  res.render('quiz-page', { title: 'The Quiz' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/favourites', (req, res) => {
  res.render('favourites', {});
});


app.get('/book', async (req, res) => {
  try {
    const response = await axios.get('https://the-one-api.dev/v2/book', {
      headers: { Authorization: 'Bearer OeUeZhk8zm3i_1f4FjF9' }
    });
    const books = response.data.docs;
    res.render('book', { books });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/character', async (req, res) => {
  try {
    const response = await axios.get('https://the-one-api.dev/v2/character', {
      headers: { Authorization: 'Bearer OeUeZhk8zm3i_1f4FjF9' } 
    });
    const characters = response.data.docs;
    res.render('character', { characters });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/movie', async (req, res) => {
  try {
    const response = await axios.get('https://the-one-api.dev/v2/movie', {
      headers: { Authorization: 'Bearer OeUeZhk8zm3i_1f4FjF9' } 
    });
    const movies = response.data.docs;
    res.render('movie', { movies });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

export default app;