import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { Collection } from 'mongodb';


const {MongoClient} = require('mongodb');

const uri: string = "mongodb+srv://asmartiba:1DZx58W3uFct3NC3@lambda.sfb8kon.mongodb.net/"
const client = new MongoClient(uri, {useUnifiedTopology: true});

const axios = require('axios');
const app = express();
const favourites = express();
app.use(bodyParser.json());

interface Favourite {
    quote: {
      dialog: string;
      character: string;
    };
  }
  
  app.post('/favourite', async (req, res) => {
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

  export default favourites;