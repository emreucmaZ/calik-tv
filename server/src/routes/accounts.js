const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// Tüm hesapları getir
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tek hesap getir
router.get('/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Hesap bulunamadı' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni hesap oluştur
router.post('/', async (req, res) => {
  try {
    const account = new Account({
      name: req.body.name,
      rtmpUrl: req.body.rtmpUrl,
      streamKey: req.body.streamKey,
      isActive: req.body.isActive
    });
    const newAccount = await account.save();
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Hesap güncelle
router.put('/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Hesap bulunamadı' });
    }

    if (req.body.name) account.name = req.body.name;
    if (req.body.rtmpUrl) account.rtmpUrl = req.body.rtmpUrl;
    if (req.body.streamKey) account.streamKey = req.body.streamKey;
    if (typeof req.body.isActive === 'boolean') account.isActive = req.body.isActive;

    const updatedAccount = await account.save();
    res.json(updatedAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Hesap sil
router.delete('/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Hesap bulunamadı' });
    }
    await account.deleteOne();
    res.json({ message: 'Hesap silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
