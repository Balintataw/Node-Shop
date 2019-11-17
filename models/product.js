const mongodb = require('mongodb');
const getDb = require('../utils/conn').getDb;
const User = require('../models/user');

class Product {
  constructor(title, price, imageUri, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUri = imageUri
      ? imageUri
      : 'https://playactionbraid.com/cms/wp-content/uploads/2017/05/Product-Image-Coming-Soon.png';
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  async save() {
    try {
      const db = getDb();
      if (this._id) {
        return db
          .collection('products')
          .updateOne({ _id: this._id }, { $set: this });
      } else {
        return db.collection('products').insertOne(this);
      }
    } catch (error) {
      console.log('Error saving product:', error);
    }
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => products)
      .catch(error => console.log('Error fetching products:', error));
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
      .then(product => product)
      .catch(error => console.log(`Error findById ${id}:`, error));
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = Product;
