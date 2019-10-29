const Product = require('../models/product');

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/add-product', { title: 'Add Product', path: '/admin/add-product' });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUri = req.body.imageUri;
  const description = req.body.description;
  const newProduct = new Product({ title, price, imageUri, description });
  await newProduct.save()
  res.redirect('/');
};

exports.getShopPage = async (req, res, next) => {
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
    console.log("WE GOT PROD", product);
    res.render('admin/edit-product', { product, path: '/admin/edit_product', title: `Edit ${product.title}` });
  } catch (error) {
    console.error("Error fetching product for editing", error);
  }
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const price = req.body.price;
  const imageUri = req.body.imageUri;
  const description = req.body.description;
  const newProduct = new Product({ id, title, price, imageUri, description });
  newProduct.save();
  res.redirect('/admin');
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.deleteById(id);
  res.redirect("/admin/products");
};