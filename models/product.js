const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const createProductUID = require('../utils/uid');

const Cart = require('./cart');
const productsFilePath = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (id) => {
    return new Promise((resolve, reject) => {
      fs.readFile(productsFilePath, (err, data) => {
      if(err) {
        resolve([]);
      }
      let allProducts = JSON.parse(data);
        if(id) {
          resolve(allProducts.find(p => p.uid === id))
        } else {
          resolve(allProducts);
        }
    });
  });
};

module.exports = class Product {
  constructor(config={}) {
    this.uid = null;
    this.title = 'New Book';
    this.image = 'https://quittingbydesign.com/wp-content/uploads/2018/09/image-coming-soon-placeholder.jpg';
    this.description = 'New Book';
    this.price = 0;
    config && Object.assign(this, config);
  };

  save = async () => {
    let products = await getProductsFromFile();
    if (this.uid) {
      const existingProductIndex = products.findIndex(p => p.id = this.uid);
      const updatedProducts = [...products]
      updatedProducts[existingProductIndex] = this;
      fs.writeFile(productsFilePath, JSON.stringify(updatedProducts), (err) => {
        if (err) {
          console.log("ERROR WRITING EDIT:", err);
        }
      });
    } else {
      this.uid = createProductUID();
      products.push(this);
      fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
        if (err) {
          console.log("ERROR WRITING SAVE:", err);
        }
      });
    }
  };

  static getProducts = () => {
    return getProductsFromFile();
  };

  static getProductById = (id) => {
    if (!id) throw new Error('No id provided')
    return getProductsFromFile(id);
  }

  static deleteById = async (id) => {
    try {
      let products = await getProductsFromFile();
      const productForRemoval = products.find(p => p.uid === id);
      const updatedProducts = products.filter(p => p.uid !== id);
      fs.writeFile(productsFilePath, JSON.stringify(updatedProducts), (err) => {
        if (err) {
          console.log("ERROR WRITING Deleted:", err);
        } else {
          Cart.deleteProduct(productForRemoval);
        }
      });
    } catch (error) {
      console.log("ERROR Deleting:", error);
    }
  };

};