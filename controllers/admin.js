const Product = require('../models/product');

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/add-product', {
    title: 'Add Product',
    path: '/admin/add-product',
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUri =
    req.body.imageUri ||
    'https://playactionbraid.com/cms/wp-content/uploads/2017/05/Product-Image-Coming-Soon.png';
  const description = req.body.description;
  try {
    const product = new Product({
      title,
      price,
      description,
      imageUri,
      userId: req.user,
    });
    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    res.redirect('/');
    console.error('Error adding product', error);
  }
};

exports.getShopPage = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('shop/product-list', { products, path: '/shop', title: 'Shop' });
  } catch (error) {
    console.error('Error fetching products', error);
  }
};

exports.getProductsPage = async (req, res, next) => {
  try {
    const products = await Product.find().populate('userId', '_id username');
    res.render('admin/products', {
      products,
      path: '/admin/products',
      title: 'Admin Products',
    });
  } catch (error) {
    console.error('Error getting products', error);
  }
};

exports.getEditProductPage = async (req, res, next) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    res.render('admin/edit-product', {
      product,
      path: '/admin/edit_product',
      title: `Edit ${product.title}`,
    });
  } catch (error) {
    res.redirect('/');
    console.error('Error fetching product for editing', error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const price = req.body.price;
  const imageUri = req.body.imageUri;
  const description = req.body.description;
  try {
    let product = await Product.findById(id);
    product.title = title;
    product.price = price;
    product.imageUri = imageUri || product.imageUri;
    product.description = description;
    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    res.redirect('/');
    console.error('Error updating product', error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const id = req.body.id;
  try {
    await Product.findByIdAndRemove(id);
    res.redirect('/admin/products');
  } catch (error) {
    res.redirect('/');
    console.error('Error deleting product', error);
  }
};
