import express from 'express';
import path from 'path';


// initialisation

const {MongoClient} = require('mongodb');
const uri: string = "mongodb+srv://asmartiba:1DZx58W3uFct3NC3@lambda.sfb8kon.mongodb.net/"
const client = new MongoClient(uri, {useUnifiedTopology: true});

const axios = require('axios');
const app = express();
app.use(express.json());

app.set('views', path.join(__dirname,  'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// test

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

// main();

// router 

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



// FAVOURITES

interface Favourite {
  quote: {
    dialog: string;
    character: string;
  };
}

app.post('/favouriteFetch', async (req, res) => {
  try {
    const { dialog, character } = req.body;

    if (typeof dialog !== 'string' || dialog === '' || typeof character !== 'string' || character === '') {
      throw new Error('Invalid data');
    }

    await client.connect();
    const db = client.db('LotrDB');
    const collection = db.collection('favourites');

    const quoteData = {
      dialog: dialog,
      character: character
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

app.get('/favourites', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('LotrDB');
    const collection = db.collection('favourites');

    const favorites = await collection.find().toArray();

    res.render('favourites', { favorites });
  } catch (error) {
    console.error('Error:', error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

// BOOKS

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

// CHARACTERS

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

// MOVIES

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