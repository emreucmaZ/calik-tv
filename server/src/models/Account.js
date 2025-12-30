const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hesap adı zorunludur'],
    trim: true
  },
  rtmpUrl: {
    type: String,
    required: [true, 'RTMP URL zorunludur'],
    default: 'rtmp://live-upload.instagram.com:80/rtmp/'
  },
  streamKey: {
    type: String,
    required: [true, 'Stream Key zorunludur']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Tam RTMP URL'ini döndür
accountSchema.virtual('fullRtmpUrl').get(function() {
  return `${this.rtmpUrl}${this.streamKey}`;
});

// JSON'a çevirirken virtual'ları dahil et
accountSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Account', accountSchema);
