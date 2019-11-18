const http = require('http');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/error');
const User = require('./models/user');

const PORT = 3001;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// register user on all requests
app.use(async (req, res, next) => {
  const user = await User.findById('5dd1e857a2542c2faafcb9eb');
  if (user) {
    req.user = user;
  } else {
    const newUser = new User({
      username: 'Biff Tannen',
      email: 'biffmail',
      cart: { items: [] },
    });
    const savedUser = await newUser.save(newUser, { new: true });
    req.user = savedUser;
  }
  next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);

//******* error handling ********

app.use(errorController.get404);

//******* server init **********

const server = http.createServer(app);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-node-shop-dev-5mjt8.mongodb.net/shop?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(conn => {
    server.listen(PORT, () => {
      console.log('DB CONNECTED:');
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch(error => console.log('Error connecting mongoose', error));

//******* Sequelize Init */
