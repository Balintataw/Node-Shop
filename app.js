const http = require('http');
const path = require('path');
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/error');
const mongoConnect = require('./utils/conn').mongoConnect;
const User = require('./models/user');

const PORT = 3001;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// register user on all requests
app.use(async (req, res, next) => {
  const user = await User.findByEmail('biffmail');
  if (user) {
    req.user = new User(user.username, user.email, user._id, user.cart);
  } else {
    const newUser = new User('Biff', 'biffmail', null, { items: [] });
    const savedUser = await newUser.save(newUser);
    req.user = new User(savedUser.ops[0]);
  }
  next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);

//******* error handling ********

app.use(errorController.get404);

//******* server init **********

const server = http.createServer(app);

mongoConnect(() =>
  server.listen(PORT, () => {
    console.log('DB CONNECTED:');
    console.log(`Listening on port ${PORT}`);
  }),
);

//******* Sequelize Init */
