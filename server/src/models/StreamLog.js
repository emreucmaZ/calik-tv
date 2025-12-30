const mongoose = require('mongoose');

const streamLogSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  status: {
    type: String,
    enum: ['live', 'ended', 'error'],
    default: 'live'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
});

// Yayın süresini hesapla (dakika)
streamLogSchema.virtual('duration').get(function() {
  if (!this.endedAt) return null;
  return Math.round((this.endedAt - this.startedAt) / 1000 / 60);
});

streamLogSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('StreamLog', streamLogSchema);
