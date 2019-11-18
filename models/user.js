const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(
    cp => cp.productId.toString() === product._id.toString(),
  );
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = updatedCartItems[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteFromCart = function(id) {
  const updatedCartItems = this.cart.items.filter(
    item => item.productId.toString() !== id.toString(),
  );
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../utils/conn').getDb;

// class User {
//   constructor(username, email, id, cart) {
//     this.username = username;
//     this.email = email;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.cart = cart;
//   }

//   save() {
//     try {
//       const db = getDb();
//       if (this._id) {
//         return db
//           .collection('users')
//           .updateOne({ _id: this._id }, { $set: this });
//       } else {
//         return db.collection('users').insertOne(this);
//       }
//     } catch (error) {
//       console.log('Error saving user:', error);
//     }
//   }

//   addToCart(product) {
//     const db = getDb();
//     const cartProductIndex = this.cart.items.findIndex(
//       cp => cp.productId.toString() === product._id.toString(),
//     );
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0) {
//       newQuantity = updatedCartItems[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } },
//       );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => i.productId);
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         // TODO check if products retrieved match productIds in cart in adjust cart accordingly
//         // Edge case where products are removed from store but still in a users cart
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(
//               i => i.productId.toString() === p._id.toString(),
//             ).quantity,
//           };
//         });
//       });
//   }

//   deleteFromCart(id) {
//     const db = getDb();
//     const updatedCartItems = this.cart.items.filter(
//       item => item.productId.toString() !== id.toString(),
//     );
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } },
//       );
//   }

//   async addOrder() {
//     const db = getDb();
//     const cartProducts = await this.getCart();
//     const order = {
//       items: cartProducts,
//       user: {
//         _id: new mongodb.ObjectId(this._id),
//         username: this.username,
//         email: this.email,
//       },
//     };
//     await db.collection('orders').insertOne(order);
//     this.cart = { items: [] };
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: [] } } },
//       );
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection('orders')
//       .find({ 'user._id': new mongodb.ObjectId(this._id) })
//       .toArray()
//       .then(products => products);
//   }

//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({ _id: new mongodb.ObjectId(id) })
//       .then(user => user)
//       .catch(error => console.log(`Error findById [User]:${id}:`, error));
//   }

//   static findByEmail(email) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({ email })
//       .then(user => user)
//       .catch(error => console.log(`Error findByEmail [User]:`, error));
//   }
// }

// module.exports = User
