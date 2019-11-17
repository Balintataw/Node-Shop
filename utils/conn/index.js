const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async cb => {
  try {
    const conn = await MongoClient.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-node-shop-dev-5mjt8.mongodb.net/shop?retryWrites=true&w=majority`,
      { useUnifiedTopology: true },
    );
    // _db = conn.db('test');
    _db = conn.db();
    cb();
  } catch (error) {
    console.log('DB CONNECTION ERROR:', error);
    throw new Error(error);
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
