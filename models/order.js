const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: {
          title: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          imageUri: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
        },
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    username: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
});

module.exports = mongoose.model('Order', orderSchema);
