import express from 'express';
const axios = require('axios');
import bodyParser from 'body-parser';
import path from 'path';

import { MongoClient,ObjectId } from "mongodb";
const uri: string = "mongodb+srv://s145347:pokemon@mijncluster.p2xvqbh.mongodb.net/?retryWrites=true&w=majority" //kan verandert worden als nodig
const client= new MongoClient(uri);

interface login{
  _id?: ObjectId,
  naam: string,
  pass:string
}

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

//<% let user= document.getElementById('username'); if(user !="") {%> <a href="/">Register</a> <% } %>

app.get('/sign-up', (req, res) => {
    res.render('sign-up', { title: 'Sign up' });
});
app.post('/sign-up', async(req, res) => {
  try{
    await client.connect();

    let base = client.db('Lambda').collection('login');

    await base.insertOne({
      username: req.body.username,
      password: req.body.password
    });

    res.render('sign-up', { title: 'Sign up' });
  } catch(e){
    console.error(e);
  } finally{
    client.close();
  }
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