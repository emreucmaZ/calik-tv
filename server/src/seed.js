require('dotenv').config();
const mongoose = require('mongoose');
const Account = require('./models/Account');
const StreamLog = require('./models/StreamLog');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');

    // Mevcut verileri temizle (opsiyonel)
    await Account.deleteMany({});
    await StreamLog.deleteMany({});
    console.log('Mevcut veriler temizlendi');

    // Örnek hesaplar ekle
    const accounts = await Account.insertMany([
      {
        name: 'Okul Ana Hesap',
        rtmpUrl: 'rtmp://live-upload.instagram.com:80/rtmp/',
        streamKey: 'BURAYA_INSTAGRAM_STREAM_KEY_GELECEK',
        isActive: true
      },
      {
        name: 'Yedek Hesap',
        rtmpUrl: 'rtmp://live-upload.instagram.com:80/rtmp/',
        streamKey: 'YEDEK_HESAP_STREAM_KEY',
        isActive: false
      }
    ]);
    console.log(`${accounts.length} hesap eklendi`);

    // Örnek log ekle (test amaçlı)
    const logs = await StreamLog.insertMany([
      {
        account: accounts[0]._id,
        status: 'ended',
        startedAt: new Date(Date.now() - 3600000), // 1 saat önce
        endedAt: new Date(Date.now() - 1800000)    // 30 dk önce
      }
    ]);
    console.log(`${logs.length} log eklendi`);

    console.log('\nSeed tamamlandı!');
    console.log('--------------------');
    console.log('Eklenen hesaplar:');
    accounts.forEach(acc => {
      console.log(`  - ${acc.name} (${acc.isActive ? 'Aktif' : 'Pasif'})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seed hatası:', error);
    process.exit(1);
  }
};

seedData();
