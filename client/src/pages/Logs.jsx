import { useState, useEffect } from 'react';
import { streamApi } from '../services/api';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await streamApi.getLogs();
      setLogs(res.data);
    } catch (error) {
      console.error('Loglar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      live: 'bg-red-600 text-white',
      ended: 'bg-green-600/20 text-green-400',
      error: 'bg-red-600/20 text-red-400'
    };
    const labels = {
      live: 'Canlı',
      ended: 'Tamamlandı',
      error: 'Hata'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDuration = (startedAt, endedAt) => {
    if (!endedAt) return '-';
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const diffMs = end - start;
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}dk ${seconds}sn`;
  };

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Yayın Logları</h2>
        <button
          onClick={fetchLogs}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
        >
          Yenile
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-400">Henüz yayın kaydı yok</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Hesap</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Durum</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Başlangıç</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Bitiş</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Süre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    {log.account?.name || 'Silinmiş Hesap'}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(log.status)}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(log.startedAt).toLocaleString('tr-TR')}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {log.endedAt
                      ? new Date(log.endedAt).toLocaleString('tr-TR')
                      : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {formatDuration(log.startedAt, log.endedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {logs.some(l => l.errorMessage) && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Hata Detayları</h3>
          <div className="space-y-2">
            {logs.filter(l => l.errorMessage).map((log) => (
              <div key={log._id} className="bg-red-900/20 p-4 rounded">
                <p className="text-red-400 text-sm">
                  {new Date(log.startedAt).toLocaleString('tr-TR')}
                </p>
                <p className="text-gray-300 mt-1">{log.errorMessage}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
