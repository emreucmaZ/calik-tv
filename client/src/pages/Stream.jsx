import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { streamApi, accountApi } from '../services/api';

export default function Stream() {
  const [status, setStatus] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statusRes, accountsRes] = await Promise.all([
        streamApi.getStatus(),
        accountApi.getAll()
      ]);
      setStatus(statusRes.data);
      setAccounts(accountsRes.data.filter(a => a.isActive));
    } catch (error) {
      console.error('Veri alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await streamApi.getStatus();
      setStatus(res.data);
    } catch (error) {
      console.error('Durum alınamadı:', error);
    }
  };

  const handleStart = async () => {
    if (!selectedAccount) {
      toast.error('Lütfen bir hesap seçin');
      return;
    }

    setActionLoading(true);
    try {
      await streamApi.start(selectedAccount);
      toast.success('Yayın başlatıldı!');
      fetchStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Yayın başlatılamadı');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStop = async () => {
    if (!confirm('Yayını durdurmak istediğinize emin misiniz?')) return;

    setActionLoading(true);
    try {
      await streamApi.stop();
      toast.success('Yayın durduruldu');
      fetchStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Yayın durdurulamadı');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  const isStreaming = status?.isStreaming;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Yayın Kontrolü</h2>

      {/* Durum Göstergesi */}
      <div className={`p-8 rounded-lg mb-8 text-center ${isStreaming ? 'bg-red-600' : 'bg-gray-800'}`}>
        <div className="flex items-center justify-center gap-3 mb-4">
          {isStreaming && (
            <span className="w-4 h-4 bg-white rounded-full animate-pulse"></span>
          )}
          <h3 className="text-4xl font-bold">
            {isStreaming ? 'CANLI YAYIN' : 'Yayın Kapalı'}
          </h3>
        </div>
        {isStreaming && status?.currentAccount && (
          <p className="text-xl opacity-80">
            {status.currentAccount.name} hesabında yayın yapılıyor
          </p>
        )}
      </div>

      {/* Kontrol Paneli */}
      <div className="bg-gray-800 p-6 rounded-lg">
        {!isStreaming ? (
          <>
            <h3 className="text-xl font-semibold mb-4">Yayın Başlat</h3>

            {accounts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Aktif hesap bulunamadı</p>
                <a
                  href="/accounts"
                  className="text-red-500 hover:text-red-400"
                >
                  Hesap eklemek için tıklayın
                </a>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-gray-400 mb-2">
                    Yayın yapılacak hesabı seçin:
                  </label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-red-500"
                  >
                    <option value="">-- Hesap Seçin --</option>
                    {accounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleStart}
                  disabled={actionLoading || !selectedAccount}
                  className={`w-full py-4 rounded text-xl font-bold transition-colors ${
                    actionLoading || !selectedAccount
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {actionLoading ? 'Başlatılıyor...' : 'Yayını Başlat'}
                </button>

                <div className="mt-6 p-4 bg-gray-900 rounded">
                  <p className="text-gray-400 text-sm">
                    <strong>Not:</strong> Yayını başlatmadan önce OBS'den bu sunucuya
                    yayın yapmaya başladığınızdan emin olun.
                  </p>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-4">Yayın Aktif</h3>

            <div className="mb-6 p-4 bg-gray-900 rounded">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Hesap:</span>
                <span>{status?.currentAccount?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Başlangıç:</span>
                <span>
                  {status?.streamLog?.startedAt &&
                    new Date(status.streamLog.startedAt).toLocaleTimeString('tr-TR')}
                </span>
              </div>
            </div>

            <button
              onClick={handleStop}
              disabled={actionLoading}
              className={`w-full py-4 rounded text-xl font-bold transition-colors ${
                actionLoading
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {actionLoading ? 'Durduruluyor...' : 'Yayını Durdur'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
