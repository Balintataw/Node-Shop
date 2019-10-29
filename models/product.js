const fs = require('fs');
const db = require('../utils/conn');
const path = require('path');
const rootDir = require('../utils/path');

const Cart = require('./cart');
const productsFilePath = path.join(rootDir, 'data', 'products.json');

module.exports = class Product {
  constructor(config = {}) {
    this.id = null;
    this.title = 'New Item';
    this.imageUri = 'https://quittingbydesign.com/wp-content/uploads/2018/09/image-coming-soon-placeholder.jpg';
    this.description = 'New Item';
    this.price = 0;
    config && Object.assign(this, config);
  };

  save = async () => {
    if (this.id) {
      return db.execute(`
        UPDATE products
        SET title = ?, imageUri = ?, description = ?, price = ?)
        WHERE id = ?;`,
        [this.title, this.imageUri, this.description, this.price, this.id]
      ).then(([rows, data]) => {
        return rows;
      }).catch(error => {
        console.log("UPDATE ERROR", error)
      });
    } else {
      return db.execute(`
        INSERT INTO products
        (title, imageUri, description, price)
        VALUES (?, ?, ?, ?);`,
        [this.title, this.imageUri, this.description, this.price]
      ).then(([rows, data]) => {
        return rows;
      }).catch(error => {
        console.log("INSERT ERROR", error)
      });
    }
  };

  static getProducts = () => {
    return db.execute(
      `SELECT * FROM products;`
    ).then(([rows, data]) => {
      return rows;
    }).catch(error => {
      console.log("QUERY ERROR", error)
    });
  };

  static getProductById = (id) => {
    if (!id) throw new Error('No id provided')
    return db.execute(
      `SELECT * 
      FROM products 
      WHERE id = ?;`,
      [id]
    ).then(([rows, data]) => {
      console.log("BY ID", rows[0]);
      return rows[0];
    }).catch(error => {
      console.log("QUERY ERROR", error)
    });
  }

  static deleteById = async (id) => {
    try {
      let products = await getProducts();
      const productForRemoval = products.find(p => p.id === id);
      const updatedProducts = products.filter(p => p.id !== id);
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