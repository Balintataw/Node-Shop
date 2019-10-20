const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const createProductUID = require('../utils/uid');

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
    this.title = 'New Book';
    this.image = 'https://quittingbydesign.com/wp-content/uploads/2018/09/image-coming-soon-placeholder.jpg';
    this.description = 'New Book';
    this.price = 0;
    config && Object.assign(this, config);
  }

  save = async () => {
    this.uid = createProductUID();
    let products = await getProductsFromFile();
    products.push(this);
    fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
      console.log("ERROR WRITING SAVE:", err);
    });
  };

  static getProducts = () => {
    return getProductsFromFile();
  };

  static getProductById = (id) => {
    if (!id) throw new Error('No id provided')
    return getProductsFromFile(id);
  }
};