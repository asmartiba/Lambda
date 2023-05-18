import app from './app';
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

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});