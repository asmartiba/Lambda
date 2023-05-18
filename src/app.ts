import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { Collection } from 'mongodb';


const {MongoClient} = require('mongodb');

const uri: string = "mongodb+srv://asmartiba:1DZx58W3uFct3NC3@lambda.sfb8kon.mongodb.net/"
const client = new MongoClient(uri, {useUnifiedTopology: true});

const main = async () => {
  try {
    await client.connect();
    let list = await client.db().admin().listDatabases();
    console.log(list);
  }
  catch(e) {
    console.log(e);
  } finally {
    await client.close();
  }
}

main();

const axios = require('axios');
const app = express();
app.use(bodyParser.json());

app.set('views', path.join(__dirname,  'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

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


// favourite page 

interface Favourite {
  quote: {
    dialog: string;
    character: string;
  };
}

app.post('/favourite', async (req, res) => {
  try {
      const { dialog } = req.body;

      if (typeof dialog !== 'string' || dialog === '') {
          throw new Error('Invalid data');
      }

      await client.connect();
      const db = client.db('LotrDB');
      const collection = db.collection('favourites');

      const quoteData = {
          dialog: dialog
      };

      await collection.insertOne(quoteData);

      res.sendStatus(200);
  } catch (error) {
      console.error('Error:', error);
      res.sendStatus(500);
  } finally {
      await client.close();
  }
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