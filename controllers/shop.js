const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/add-product', { title: 'Add Product', path: '/admin/add-product' });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const newProduct = new Product({ title });
  newProduct.save();
  res.redirect('/');
};

exports.getProductsListPage = async (req, res, next) => {
  try {
    const products = await Product.getProducts();
    res.render('shop/product-list', { products, path: '/products', title: 'All Products' });
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

exports.getProductDetailPage = async (req, res, next) => {
  const id = req.params.id;
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

exports.getCartPage = async (req, res, next) => {
  try {
    const products = await Product.getProducts();
    const cart = await Cart.getCart()
    const productsInCart = cart.products.map(item => {
      const prod = products.find(product => product.id === item.id)
      if (prod) {
        return { productData: prod, qty: item.qty }
      }
    });
    res.render('shop/cart', { path: '/cart', title: 'Your Cart', products: productsInCart });
  } catch (error) {
    console.error("Error fetching products in cart", error);
  }
};

exports.getOrdersPage = (req, res, next) => {
  res.render('shop/orders', { path: '/orders', title: 'Orders' });
};

exports.getCheckoutPage = (req, res, next) => {
  res.render('shop/checkout', { path: '/checkout', title: 'Checkout' });
};

exports.postToCart = async (req, res, next) => {
  const productId = req.body.id;
  try {
    const product = await Product.getProductById(productId);
    Cart.addProduct(product);
    res.redirect('/cart');
  } catch (error) {
    console.error("Error fetching product", error);
  }
};

exports.postToCartRemoveItem = async (req, res, next) => {
  const productId = req.body.id;
  try {
    const product = await Product.getProductById(productId);
    Cart.deleteProduct(product);
    res.redirect('/cart');
  } catch (error) {
    console.error("Error fetching product", error);
  }
};