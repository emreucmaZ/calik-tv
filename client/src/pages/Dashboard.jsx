import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { streamApi, accountApi } from '../services/api';
import LivePlayer from '../components/LivePlayer';

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Stream URL (HTTP-FLV) - aynı domain üzerinden proxy
  const streamUrl = `${window.location.origin}/live/calik-tv-2024.flv`;

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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-orange-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1">ÇALIK TV yayın kontrol merkezi</p>
        </div>
        <div className="flex items-center gap-2">
          {status?.isStreaming && (
            <span className="badge badge-live animate-pulse-live">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              CANLI
            </span>
          )}
        </div>
      </div>

      {/* Canlı Önizleme */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">Canlı Önizleme</h3>
              <p className="text-slate-500 text-sm">OBS'den gelen yayın</p>
            </div>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`btn ${showPreview ? 'btn-danger' : 'btn-ghost'}`}
          >
            {showPreview ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Kapat
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                İzle
              </>
            )}
          </button>
        </div>

        {showPreview ? (
          <LivePlayer streamUrl={streamUrl} />
        ) : (
          <div className="bg-slate-900/50 rounded-xl aspect-video flex items-center justify-center border border-slate-700/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-400 mb-4">OBS'den gelen yayını izlemek için</p>
              <button
                onClick={() => setShowPreview(true)}
                className="btn btn-primary"
              >
                Önizlemeyi Başlat
              </button>
            </div>
          </div>
        )}

        <p className="text-slate-600 text-xs mt-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          OBS'den yayın başlatılmadıysa önizleme çalışmaz
        </p>
      </div>

      {/* Durum Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Yayın Durumu */}
        <div className={`card p-6 ${status?.isStreaming ? 'bg-gradient-to-br from-red-600/20 to-red-700/20 border-red-500/30' : ''}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Instagram Yayın</p>
              <p className={`text-3xl font-bold mt-2 ${status?.isStreaming ? 'text-red-400' : 'text-white'}`}>
                {status?.isStreaming ? 'CANLI' : 'Kapalı'}
              </p>
              {status?.currentAccount && (
                <p className="text-slate-400 text-sm mt-2">
                  {status.currentAccount.name}
                </p>
              )}
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status?.isStreaming ? 'bg-red-500/20' : 'bg-slate-700/50'}`}>
              {status?.isStreaming ? (
                <span className="w-4 h-4 bg-red-500 rounded-full animate-pulse-live"></span>
              ) : (
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Hesap Sayısı */}
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Kayıtlı Hesaplar</p>
              <p className="text-3xl font-bold text-white mt-2">{accounts.length}</p>
              <p className="text-slate-400 text-sm mt-2">
                <span className="text-green-400">{accounts.filter(a => a.isActive).length}</span> aktif
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Hızlı İşlem */}
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Hızlı İşlem</p>
              <p className="text-xl font-semibold text-white mt-2">
                {status?.isStreaming ? 'Yayını Yönet' : 'Yayın Başlat'}
              </p>
              <Link
                to="/stream"
                className={`btn mt-4 inline-flex items-center ${status?.isStreaming ? 'btn-danger' : 'btn-success'}`}
              >
                {status?.isStreaming ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Yönet
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Başlat
                  </>
                )}
              </Link>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status?.isStreaming ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
              <svg className={`w-6 h-6 ${status?.isStreaming ? 'text-red-400' : 'text-green-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* OBS Bağlantı Bilgisi */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white">OBS Bağlantı Ayarları</h3>
            <p className="text-slate-500 text-sm">Bu bilgileri OBS'e girin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">Sunucu</label>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
              <code className="text-orange-400 font-mono text-sm">rtmp://caliktv.emreucmaz.com:1935/live</code>
              <button
                onClick={() => navigator.clipboard.writeText('rtmp://caliktv.emreucmaz.com:1935/live')}
                className="text-slate-500 hover:text-white transition-colors"
                title="Kopyala"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">Stream Key</label>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
              <code className="text-orange-400 font-mono text-sm">calik-tv-2024</code>
              <button
                onClick={() => navigator.clipboard.writeText('calik-tv-2024')}
                className="text-slate-500 hover:text-white transition-colors"
                title="Kopyala"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
