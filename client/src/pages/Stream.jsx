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
      console.error('Veri alinamadi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await streamApi.getStatus();
      setStatus(res.data);
    } catch (error) {
      console.error('Durum alinamadi:', error);
    }
  };

  const handleStart = async () => {
    if (!selectedAccount) {
      toast.error('Lutfen bir hesap secin');
      return;
    }

    setActionLoading(true);
    try {
      await streamApi.start(selectedAccount);
      toast.success('Yayin baslatildi!');
      fetchStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Yayin baslatilamadi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStop = async () => {
    if (!confirm('Yayini durdurmak istediginize emin misiniz?')) return;

    setActionLoading(true);
    try {
      await streamApi.stop();
      toast.success('Yayin durduruldu');
      fetchStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Yayin durdurulamadi');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-amber-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400">Yukleniyor...</span>
        </div>
      </div>
    );
  }

  const isStreaming = status?.isStreaming;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Yayin Kontrolu</h2>
        <p className="text-slate-400 text-sm mt-1">Instagram canli yayininizi yonetin</p>
      </div>

      {/* Durum Gostergesi */}
      <div className={`card p-8 text-center ${isStreaming ? 'bg-gradient-to-br from-red-600/20 to-red-700/20 border-red-500/30' : ''}`}>
        <div className="flex items-center justify-center gap-4 mb-4">
          {isStreaming ? (
            <div className="relative">
              <span className="w-6 h-6 bg-red-500 rounded-full block animate-pulse-live"></span>
              <span className="absolute inset-0 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-50"></span>
            </div>
          ) : (
            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
              </svg>
            </div>
          )}
          <h3 className={`text-4xl font-bold ${isStreaming ? 'text-red-400' : 'text-white'}`}>
            {isStreaming ? 'CANLI YAYIN' : 'Yayin Kapali'}
          </h3>
        </div>
        {isStreaming && status?.currentAccount && (
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <span className="text-white font-medium">{status.currentAccount.name}</span>
          </div>
        )}
      </div>

      {/* Kontrol Paneli */}
      <div className="card p-6">
        {!isStreaming ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Yayin Baslat</h3>
                <p className="text-slate-500 text-sm">Instagram hesabi secin ve yayini baslatin</p>
              </div>
            </div>

            {accounts.length === 0 ? (
              <div className="text-center py-8 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-slate-400 mb-4">Aktif hesap bulunamadi</p>
                <a href="/accounts" className="text-amber-400 hover:text-amber-300 font-medium">
                  Hesap eklemek icin tiklayin
                </a>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-slate-400 text-sm font-medium mb-2">
                    Yayin yapilacak hesabi secin
                  </label>
                  <div className="relative">
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="input appearance-none cursor-pointer pr-10"
                    >
                      <option value="">-- Hesap Secin --</option>
                      {accounts.map((account) => (
                        <option key={account._id} value={account._id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  disabled={actionLoading || !selectedAccount}
                  className={`w-full py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-3 ${
                    actionLoading || !selectedAccount
                      ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                      : 'btn-success'
                  }`}
                >
                  {actionLoading ? (
                    <>
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Baslatiliyor...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Yayini Baslat</span>
                    </>
                  )}
                </button>

                <div className="mt-6 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-slate-300 text-sm">
                    <strong className="text-amber-400">Not:</strong> Yayini baslatmadan once OBS'den bu sunucuya yayin yapmayi baslattiginizdan emin olun.
                  </p>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <span className="w-4 h-4 bg-red-500 rounded-full animate-pulse-live"></span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Yayin Aktif</h3>
                <p className="text-slate-500 text-sm">Instagram'a canli yayin yapiliyor</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-700/50">
                <span className="text-slate-400 text-sm">Hesap</span>
                <span className="text-white font-medium">{status?.currentAccount?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Baslangic</span>
                <span className="text-white font-mono">
                  {status?.streamLog?.startedAt &&
                    new Date(status.streamLog.startedAt).toLocaleTimeString('tr-TR')}
                </span>
              </div>
            </div>

            <button
              onClick={handleStop}
              disabled={actionLoading}
              className={`w-full py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-3 ${
                actionLoading
                  ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                  : 'btn-danger'
              }`}
            >
              {actionLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Durduruluyor...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  <span>Yayini Durdur</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
