const Product = require('../models/product');
const Order = require('../models/order');

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/add-product', {
    title: 'Add Product',
    path: '/admin/add-product',
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const newProduct = new Product({ title });
  newProduct.save();
  res.redirect('/');
};

exports.getProductsListPage = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('shop/product-list', {
      products,
      path: '/products',
      title: 'All Products',
    });
  } catch (error) {
    console.error('Error fetching products', error);
  }
};

exports.getProductDetailPage = async (req, res, next) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    res.render('shop/product-detail', {
      title: product.title,
      path: '',
      product: product,
    });
  } catch (error) {
    console.error('Error fetching product', err);
  }
};

exports.getIndexPage = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('shop/index', { products, path: '/shop', title: 'Shop' });
  } catch (error) {
    console.error('Error fetching products', error);
  }
};

exports.getCartPage = async (req, res, next) => {
  try {
    const userWithCartItems = await req.user
      .populate('cart.items.productId')
      .execPopulate();
    res.render('shop/cart', {
      path: '/cart',
      title: 'Your Cart',
      products: userWithCartItems.cart.items,
    });
  } catch (error) {
    console.error('Error fetching products in cart', error);
  }
};

exports.getCheckoutPage = (req, res, next) => {
  res.render('shop/checkout', { path: '/checkout', title: 'Checkout' });
};

exports.postToCart = async (req, res, next) => {
  const productId = req.body.id;
  try {
    const productToAdd = await Product.findById(productId);
    if (productToAdd) {
      await req.user.addToCart(productToAdd);
    }
    res.redirect('/cart');
  } catch (error) {
    console.error('Error fetching product', error);
  }
};

exports.postToCartRemoveItem = async (req, res, next) => {
  const productId = req.body.id;
  try {
    await req.user.deleteFromCart(productId);
    res.redirect('/cart');
  } catch (error) {
    console.error('Error fetching product', error);
  }
};

exports.getOrdersPage = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id });
    res.render('shop/orders', { path: '/orders', title: 'Orders', orders });
  } catch (error) {
    console.error('Error fetching orders', error);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const userWithCartItems = await req.user
      .populate('cart.items.productId')
      .execPopulate();
    const order = new Order({
      user: {
        username: req.user.username,
        userId: req.user,
      },
      products: userWithCartItems.cart.items.map(p => {
        return {
          quantity: p.quantity,
          product: { ...p.productId._doc },
        };
      }),
    });
    await order.save();
    await req.user.clearCart();
    res.redirect('/orders');
  } catch (error) {
    console.error('Error creating order', error);
  }
};
