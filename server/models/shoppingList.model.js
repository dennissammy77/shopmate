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
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
