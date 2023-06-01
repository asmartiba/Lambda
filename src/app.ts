import express from 'express';
import path from 'path';
const { MongoClient, ObjectId } = require('mongodb');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { Transform } = require('stream');

// DB initialisation

const uri: string = "mongodb+srv://asmartiba:1DZx58W3uFct3NC3@lambda.sfb8kon.mongodb.net/"
const client = new MongoClient(uri, {useUnifiedTopology: true});

const axios = require('axios');
const app = express();
app.use(express.json());

app.set('views', path.join(__dirname,  'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// router 

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign up' });
});

app.get('/quiz-page', async (req, res) => {
  const username = req.cookies.username;

  try {
    await client.connect();
    const db = client.db('LotrDB');
    const collection = db.collection('score');

    const scores = await collection.find({}).sort({ score: -1 }).toArray();

      res.render('quiz-page', { title: 'The Quiz', username: username, scores: scores });
  } catch (error) {
    console.error(error);
      res.render('quiz-page', { title: 'The Quiz', username: username, scores: [] });
  } finally {
      client.close();
  }
});

app.get('/sudden-death', async (req, res) => {
  const username = req.cookies.username;

  try {
    await client.connect();
    const db = client.db('LotrDB');
    const collection = db.collection('scoreSD');

    const scores = await collection.find({}).sort({ score: -1 }).toArray();

      res.render('sudden-death', { title: 'The Quiz (Sudden Death)', username: username, scores: scores });
  } catch (error) {
    console.error(error);
      res.render('sudden-death', { title: 'The Quiz (Sudden Death)', username: username, scores: [] });
  } finally {
      client.close();
  }
});



app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.get('/home', async(req, res) => {
  const username = req.cookies.username;

  try {
      res.render('home', { title: 'Home', username: username });
  } catch (error) {
    console.error(error);
      res.render('home', { title: 'Home', username: username});
  } finally {
      client.close();
  }
});

// LOGIN

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    await client.connect();
    const db = client.db('LotrDB');
    const signupCollection = db.collection('signup');

    const user = await signupCollection.findOne({ username, password });

    if (user && user.password === password) {
        res.cookie('username', user.username); 
        res.status(200).json({ message: 'Login successful'});
    } else {
        res.status(401).json({ message: 'Invalid login' });
    }
  } catch (error) {
    console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred' });
  } finally {
      await client.close();
  }
});

// SIGN UP


app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    await client.connect();
    const db = client.db('LotrDB');
    const signupCollection = db.collection('signup');

    const signupData = {
      username: username,
      email: email,
      password: password
    };

    await signupCollection.insertOne(signupData);

      res.sendStatus(200);
  } catch (error) {
      console.error('Error:', error);
      res.sendStatus(500);
  } finally {
      await client.close();
  }
});

// FAVOURITES

interface Favourite {
  quote: {
    dialog: string;
    character: string;
  };
}

app.get('/favourites', async (req, res) => {
  try {

    const username = req.cookies.username;
    await client.connect();
    const db = client.db('LotrDB');
    const favouritesCollection = db.collection('favourites');
    const blacklistCollection = db.collection('blacklist');

    const favourites = await favouritesCollection.find({ username: username }).toArray(); 
    const blacklisted = await blacklistCollection.find().toArray();


      res.render('favourites', { favourites, blacklisted, username  });
  } catch (error) {
      console.error('Error:', error);
      res.sendStatus(500);
  } finally {
      await client.close();
  }
});

app.post('/deleteFavourite', async (req, res) => {
  try {
    const { favouriteIds } = req.body;

    await client.connect();
    const db = client.db('LotrDB');
    const collection = db.collection('favourites');

    for (const favouriteId of favouriteIds) {
      await collection.deleteOne({ _id: new ObjectId(favouriteId) });
    }

      res.sendStatus(200);
  } catch (error) {
      console.error('Error deleting favourites:', error);
      res.sendStatus(500);
  } finally {
      await client.close();
  }
});


app.post('/favouriteFetch', async (req, res) => {
  try {
    const { dialog, character, characterId } = req.body;
    const username = req.cookies.username;

    await client.connect();
    const db = client.db('LotrDB');
    const collection = db.collection('favourites');

    const quoteData = {
      dialog: dialog,
      character: character,
      characterId: characterId,
      username: username
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

app.get('/downloadFavourites', async (req, res) => {
  try {
    const username = req.cookies.username;

    await client.connect();
    const db = client.db('LotrDB');
    const collection = db.collection('favourites');

    const favourites = await collection.find({ username: username }).toArray();
    const textContent = favourites.map((favourite: { dialog: any; character: any; }) => `${favourite.dialog} — ${favourite.character}`).join('\n');

    res.set('Content-Type', 'text/plain');
    res.set('Content-Disposition', 'attachment; filename="favourites.txt"');
    res.send(textContent);
  } catch (error) {
    console.error('Error downloading favourites:', error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});


// BLACKLIST

//fetch:
app.post('/blacklistFetch', async (req, res) => {
  try {
    const { dialog, reason } = req.body;
    await client.connect();
    const db = client.db('LotrDB');
    const collection = db.collection('blacklist');

    const quoteData = {
      dialog: dialog,
      reason: reason
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

//edit:
app.post('/editBlacklistReason', async (req, res) => {
  try {
    const { blacklistId, reason } = req.body;

    await client.connect();
    const db = client.db('LotrDB');
    const collection = db.collection('blacklist');

    await collection.updateOne(
      { _id: new ObjectId(blacklistId) },
      { $set: { reason: reason } }
    );

    res.sendStatus(200);
  } catch (error) {
      console.error('Error editing blacklist reason:', error);
      res.sendStatus(500);
  } finally {
      await client.close();
  }
});

//delete:
app.post('/deleteBlacklist', async (req, res) => {
  try {
    const { blacklistId } = req.body;

    await client.connect();
    const db = client.db('LotrDB');
    const collection = db.collection('blacklist');

    await collection.deleteOne({ _id: new ObjectId(blacklistId) });

    res.sendStatus(200);
  } catch (error) {
      console.error('Error deleting from blacklist:', error);
      res.sendStatus(500);
  } finally {
      await client.close();
  }
});

// SCORE

app.post('/scores', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('LotrDB');
    const collection = db.collection('score');

    const { username, score } = req.body;

    const response = {
      username,
      score,
    };


    await collection.insertOne(response);

    res.status(200).json({ message: 'Score stored in MongoDB' });
  } catch (error) {
      console.error('Error storing score in MongoDB:', error);
      res.status(500).json({ error: 'Failed to store score in MongoDB' });
  } finally {
      client.close();
  }
});

app.post('/scoresSD', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('LotrDB');
    const collection = db.collection('scoreSD');

    const { username, score } = req.body;

    const response = {
      username,
      score,
    };


    await collection.insertOne(response);

    res.status(200).json({ message: 'Score stored in MongoDB' });
  } catch (error) {
      console.error('Error storing score in MongoDB:', error);
      res.status(500).json({ error: 'Failed to store score in MongoDB' });
  } finally {
      client.close();
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