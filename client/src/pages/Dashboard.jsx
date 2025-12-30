import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { streamApi, accountApi } from '../services/api';

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {/* Durum Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Yayın Durumu */}
        <div className={`p-6 rounded-lg ${status?.isStreaming ? 'bg-red-600' : 'bg-gray-800'}`}>
          <h3 className="text-lg font-semibold mb-2">Yayın Durumu</h3>
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
              rtmp://SUNUCU_IP:1935/live
            </code>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Stream Key</label>
            <code className="block bg-gray-900 p-3 rounded text-green-400">
              calik-tv-2024
            </code>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          * SUNUCU_IP kısmını sunucunuzun IP adresi ile değiştirin
        </p>
      </div>
    </div>
  );
}
