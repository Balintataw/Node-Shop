const Product = require('../models/product');

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
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        products,
        path: '/products',
        title: 'All Products',
      });
    })
    .catch(error => {
      console.error('Error fetching products', error);
    });
};

exports.getProductDetailPage = async (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .then(product => {
      res.render('shop/product-detail', {
        title: product.title,
        path: '',
        product: product,
      });
    })
    .catch(err => console.log('ERROR GETTING PRODUCT', err));
};

exports.getIndexPage = async (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', { products, path: '/shop', title: 'Shop' });
    })
    .catch(error => {
      console.error('Error fetching products', error);
    });
};

exports.getCartPage = async (req, res, next) => {
  try {
    const products = await req.user.getCart();
    res.render('shop/cart', {
      path: '/cart',
      title: 'Your Cart',
      products: products,
    });
  } catch (error) {
    console.error('Error fetching products in cart', error);
  }
};

exports.getOrdersPage = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders();
    res.render('shop/orders', { path: '/orders', title: 'Orders', orders });
  } catch (error) {
    console.error('Error fetching orders', error);
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

exports.postOrder = async (req, res, next) => {
  try {
    await req.user.addOrder();
    res.redirect('/orders');
  } catch (error) {
    console.error('Error creating order', error);
  }
};
