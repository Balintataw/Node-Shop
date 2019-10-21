const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

const cartFilePath = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static addProduct = (product) => {
    // fetch current cart
    fs.readFile(cartFilePath, (err, data) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(data);
      }
      // check for existing product
      const existingProductIndex = cart.products.findIndex(p => p.id === product.uid);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // update quantity or add new product
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        // cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: product.uid, qty: 1 };
        cart.products = [ ...cart.products, updatedProduct ];
      }
      cart.totalPrice = +cart.totalPrice + +product.price;
      fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
        if (err) console.error("Error updating cart:", err);
      });
    });
  };

  static deleteProduct = (product) => {
    fs.readFile(cartFilePath, (err, data) => {
      if (err) return;
      const cart = {...JSON.parse(data)};
      const productForRemoval = cart.products.find(p => p.uid === product.uid);
      cart.totalPrice = cart.totalPrice - productForRemoval.price * productForRemoval.qty;
      cart.products.filter(p => p.uid === product.uid);

      fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
        if (err) console.error("Error updating cart:", err);
      });
    });
  };

};