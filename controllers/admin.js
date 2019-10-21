const Product = require('../models/product');

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/add-product', {title: 'Add Product', path: '/admin/add-product'});
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const image = req.body.image;
  const description = req.body.description;
  const newProduct = new Product({ uid: null, title, price, image, description });
  newProduct.save();
  res.redirect('/');
};

exports.getShopPage = async (req, res, next) => {
  //   { title: 'Gardens of the Moon', price: 17.99, image: 'https://images-na.ssl-images-amazon.com/images/I/514xh1DzfpL._SX293_BO1,204,203,200_.jpg' },
  //   { title: 'Deadhouse Gates', price: 17.99, image: 'https://images-na.ssl-images-amazon.com/images/I/51WXykWNzLL._SX295_BO1,204,203,200_.jpg' }
  try {
    const products = await Product.getProducts();
    res.render('shop/product-list', { products, path: '/shop', title: 'Shop' });
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

exports.getProductsPage = async (req, res, next) => {
  try {
    const products = await Product.getProducts();
    res.render('admin/products', { products, path: '/admin/products', title: 'ADmin Products' });
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

exports.getEditProductPage = async (req, res, next) => {
  const id = req.params.id;
  try {
    const product = await Product.getProductById(id); 
    res.render('admin/edit-product', { product, path: '/admin/edit_product', title: `Edit ${product.title}` });
  } catch (error) {
    console.error("Error fetching product for editing", error);
  }
};

exports.postEditProduct = (req, res, next) => {
  const uid = req.body.uid;
  const title = req.body.title;
  const price = req.body.price;
  const image = req.body.image;
  const description = req.body.description;
  const newProduct = new Product({uid, title, price, image, description});
  newProduct.save();
  res.redirect('/admin');
};

exports.postDeleteProduct = (req, res, next) => {
  const uid = req.body.uid;
  Product.deleteById(uid);
  res.redirect("/admin/products");
};