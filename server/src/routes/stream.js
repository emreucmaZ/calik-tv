const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const StreamLog = require('../models/StreamLog');
const streamRelay = require('../services/streamRelay');

// Yayın durumunu getir
router.get('/status', (req, res) => {
  const status = streamRelay.getStatus();
  res.json(status);
});

// Yayın başlat
router.post('/start', async (req, res) => {
  try {
    const { accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({ message: 'Hesap ID gerekli' });
    }

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Hesap bulunamadı' });
    }

    if (!account.isActive) {
      return res.status(400).json({ message: 'Bu hesap aktif değil' });
    }

    // RTMP sunucusundan gelen yayın URL'i (OBS stream key ile eşleşmeli)
    const streamKey = process.env.STREAM_SECRET || 'calik-tv-2024';
    const inputUrl = `rtmp://127.0.0.1:${process.env.RTMP_PORT || 1935}/live/${streamKey}`;

    const streamLog = await streamRelay.start(account, inputUrl);

    res.json({
      message: 'Yayın başlatıldı',
      streamLog,
      account: account.name
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yayın durdur
router.post('/stop', async (req, res) => {
  try {
    const streamLog = await streamRelay.stop();
    res.json({
      message: 'Yayın durduruldu',
      streamLog
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yayın loglarını getir
router.get('/logs', async (req, res) => {
  try {
    const logs = await StreamLog.find()
      .populate('account', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
