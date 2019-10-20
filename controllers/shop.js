const Product = require('../models/product');

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/add-product', {title: 'Add Product', path: '/admin/add-product'});
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const newProduct = new Product({title});
  newProduct.save();
  res.redirect('/');
};

exports.getProductsListPage = async (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  // const products = [
  //   { title: 'Gardens of the Moon', price: 17.99, image: 'https://images-na.ssl-images-amazon.com/images/I/514xh1DzfpL._SX293_BO1,204,203,200_.jpg' },
  //   { title: 'Deadhouse Gates', price: 17.99, image: 'https://images-na.ssl-images-amazon.com/images/I/51WXykWNzLL._SX295_BO1,204,203,200_.jpg' }]
  try {
    const products = await Product.getProducts();
    res.render('shop/product-list', { products, path: '/products', title: 'All Products' });
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

exports.getProductDetailPage = async (req, res, next) => {
  const id = req.params.uid;
  try {
    const product = await Product.getProductById(id); 
    res.render('shop/product-detail', { title: product.title, path: '', product: product });
  } catch (error) {
    console.error("Error fetching product", error);
  }
};

exports.getIndexPage = async (req, res, next) => {
  try {
    const products = await Product.getProducts();
    res.render('shop/index', { products, path: '/shop', title: 'Shop' });
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

exports.getCartPage = (req, res, next) => {
    res.render('shop/cart', { path: '/cart', title: 'Cart' });
};

exports.getOrdersPage = (req, res, next) => {
    res.render('shop/orders', { path: '/orders', title: 'Orders' });
};

exports.getCheckoutPage = (req, res, next) => {
    res.render('shop/checkout', { path: '/checkout', title: 'Checkout' });
};

exports.postToCart = async (req, res, next) => {
    const productId = req.body.uid;
  try {
    const product = await Product.getProductById(productId); 
    res.redirect('/cart');
    // res.render('shop/product-detail', { title: product.title, path: '', product: product });
  } catch (error) {
    console.error("Error fetching product", error);
  }
};