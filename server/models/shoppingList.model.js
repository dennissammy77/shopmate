const mongoose = require('mongoose');

const ShoppingListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    householdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Household',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        name: String,
        quantity: Number,
        status: {
          type: String,
          enum: ['pending', 'purchased'],
          default: 'pending',
        },
        lastModifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        priceInfo: {
          storeName: String,
          price: Number,
          currency: String,
          lastChecked: Date
        },        
        history: [
          {
            action: {
              type: String,
              enum: ['add', 'edit', 'delete', 'purchase'],
            },
            timestamp: {
              type: Date,
              default: Date.now,
            },
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
