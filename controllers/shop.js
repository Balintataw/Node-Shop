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
  Product.findAll().then(products => {
    res.render('shop/product-list', { products, path: '/products', title: 'All Products' });
  }).catch(error => {
    console.error("Error fetching products", error);
  });
};

exports.getProductDetailPage = async (req, res, next) => {
  const id = req.params.id;
  Product.findByPk(id).then(product => {
    res.render('shop/product-detail', { title: product.title, path: '', product: product });
  }).catch(err => console.log("ERROR GETTING PRODUCT", err))
};

exports.getIndexPage = async (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/index', { products, path: '/shop', title: 'Shop' });
  }).catch(error => {
    console.error("Error fetching products", error);
  });
};

exports.getCartPage = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const productsInCart = await cart.getProducts();
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
    // get cart for user atached to req
    const cart = await req.user.getCart();
    // get all products from users cart with 'productId'
    const productsInCart = await cart.getProducts({ where: { id: productId } })
    let product;
    // if product is already in cart, grab it
    if (productsInCart.length > 0) {
      product = productsInCart[0];
    }
    // initialize quantity to add at 1
    let newQuantity = 1;
    if (product) {
      // add to quantity if product was already in cart
      const oldQuantity = +product.cartProduct.quantity;
      newQuantity = oldQuantity + 1;
    }
    // get the product to add by it's id
    const productToAdd = await Product.findByPk(productId);
    // add it to cart and update quantity
    cart.addProduct(productToAdd, {
      through: {
        quantity: newQuantity
      }
    });
    res.redirect('/cart');
  } catch (error) {
    console.error("Error fetching product", error);
  }
};

exports.postToCartRemoveItem = async (req, res, next) => {
  const productId = req.body.id;
  try {
    const cart = await req.user.getCart()
    const cartProducts = await cart.getProducts({ where: { id: productId } });
    const product = cartProducts[0];
    await product.cartProduct.destroy()
    res.redirect('/cart');
  } catch (error) {
    console.error("Error fetching product", error);
  }
};