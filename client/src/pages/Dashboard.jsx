import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { streamApi, accountApi } from '../services/api';
import LivePlayer from '../components/LivePlayer';

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Stream URL (HTTP-FLV)
  const streamUrl = `${window.location.protocol}//${window.location.hostname}:8000/live/calik-tv-2024.flv`;

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statusRes, accountsRes] = await Promise.all([
        streamApi.getStatus(),
        accountApi.getAll()
      ]);
      setStatus(statusRes.data);
      setAccounts(accountsRes.data);
    } catch (error) {
      console.error('Veri alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      {/* Canlı Önizleme */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Canlı Önizleme (OBS'den Gelen)</h3>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded text-sm ${
              showPreview ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {showPreview ? 'Önizlemeyi Kapat' : 'Önizlemeyi Aç'}
          </button>
        </div>

        {showPreview ? (
          <LivePlayer streamUrl={streamUrl} />
        ) : (
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 mb-2">OBS'den gelen yayını izlemek için</p>
              <button
                onClick={() => setShowPreview(true)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Önizlemeyi Başlat
              </button>
            </div>
          </div>
        )}

        <p className="text-gray-500 text-sm mt-2">
          * OBS'den yayın başlatılmadıysa önizleme çalışmaz
        </p>
      </div>

      {/* Durum Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Yayın Durumu */}
        <div className={`p-6 rounded-lg ${status?.isStreaming ? 'bg-red-600' : 'bg-gray-800'}`}>
          <h3 className="text-lg font-semibold mb-2">Instagram Yayın</h3>
          <p className="text-3xl font-bold">
            {status?.isStreaming ? 'CANLI' : 'Kapalı'}
          </p>
          {status?.currentAccount && (
            <p className="text-sm mt-2 opacity-80">
              {status.currentAccount.name}
            </p>
          )}
        </div>

        {/* Hesap Sayısı */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Kayıtlı Hesaplar</h3>
          <p className="text-3xl font-bold">{accounts.length}</p>
          <p className="text-sm mt-2 opacity-80">
            {accounts.filter(a => a.isActive).length} aktif
          </p>
        </div>

        {/* Hızlı Yayın */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Hızlı İşlem</h3>
          {status?.isStreaming ? (
            <Link
              to="/stream"
              className="inline-block bg-red-600 hover:bg-red-700 px-4 py-2 rounded mt-2"
            >
              Yayını Yönet
            </Link>
          ) : (
            <Link
              to="/stream"
              className="inline-block bg-green-600 hover:bg-green-700 px-4 py-2 rounded mt-2"
            >
              Yayın Başlat
            </Link>
          )}
        </div>
      </div>

      {/* OBS Bağlantı Bilgisi */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">OBS Bağlantı Ayarları</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Sunucu</label>
            <code className="block bg-gray-900 p-3 rounded text-green-400">
              rtmp://caliktv.emreucmaz.com:1935/live
            </code>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Stream Key</label>
            <code className="block bg-gray-900 p-3 rounded text-green-400">
              calik-tv-2024
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
