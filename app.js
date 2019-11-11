const http = require('http');
const path = require('path');
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./utils/database');
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartProduct = require('./models/cart-product');
const Order = require('./models/order');
const OrderProduct = require('./models/order-product');

const PORT = 3001;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// register user on all requests
app.use(async (req, res, next) => {
  const user = await User.findByPk(1);
  if (user) req.user = user;
  next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);

//******* error handling ********

app.use(errorController.get404);

//******* server init **********

const server = http.createServer(app);

//******* Sequelize Init */

Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE',
});
Cart.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE',
});
Order.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE',
});
User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);
Cart.belongsToMany(Product, {
  through: CartProduct
});
Product.belongsToMany(Cart, {
  through: CartProduct
});
Order.belongsToMany(Product, {
  through: OrderProduct
});

sequelize.sync()
  // sequelize.sync({ force: true })
  .then(async result => {
    // for seeding content
    // const user = await User.create({ username: 'Biff', email: 'email' })
    // user.createCart();
    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch(err => console.log("Sync Error", err));



