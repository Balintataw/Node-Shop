const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

const cartFilePath = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static addProduct = (product) => {
    // fetch current cart
    fs.readFile(cartFilePath, (err, data = {}) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        try {
          cart = JSON.parse(data);
        } catch (error) {
          cart = { products: [], totalPrice: 0 };
        }
      }
      // check for existing product
      const existingProductIndex = cart.products.findIndex(p => p.id === product.id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // update quantity or add new product
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        // cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: product.id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
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
      const updatedCart = { ...JSON.parse(data) };
      const productForRemoval = updatedCart.products.find(p => p.id === product.id);
      if (!productForRemoval) return;
      const productQty = productForRemoval.qty;
      updatedCart.products = updatedCart.products.filter(p => p.id !== product.id);
      updatedCart.totalPrice = +updatedCart.totalPrice - +productForRemoval.price * productQty;

      fs.writeFile(cartFilePath, JSON.stringify(updatedCart), (err) => {
        if (err) console.error("Error updating cart:", err);
      });
    });
  };

  static getCart = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(cartFilePath, (err, data) => {
        if (err) {
          resolve({ products: [], totalPrice: 0 });
        }
        let cart = JSON.parse(data);
        resolve(cart);
      });
    });
  };

};