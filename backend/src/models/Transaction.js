const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    provider: { type: String, default: 'stripe' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
