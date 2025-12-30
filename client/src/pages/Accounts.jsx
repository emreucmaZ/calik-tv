import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { accountApi } from '../services/api';

const defaultFormData = {
  name: '',
  rtmpUrl: 'rtmps://live-upload.instagram.com:443/rtmp/',
  streamKey: '',
  isActive: true
};

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await accountApi.getAll();
      setAccounts(res.data);
    } catch (error) {
      toast.error('Hesaplar yuklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await accountApi.update(editingId, formData);
        toast.success('Hesap guncellendi');
      } else {
        await accountApi.create(formData);
        toast.success('Hesap eklendi');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(defaultFormData);
      fetchAccounts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bir hata olustu');
    }
  };

  const handleEdit = (account) => {
    setFormData({
      name: account.name,
      rtmpUrl: account.rtmpUrl,
      streamKey: account.streamKey,
      isActive: account.isActive
    });
    setEditingId(account._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu hesabi silmek istediginize emin misiniz?')) return;
    try {
      await accountApi.delete(id);
      toast.success('Hesap silindi');
      fetchAccounts();
    } catch (error) {
      toast.error('Hesap silinemedi');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(defaultFormData);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Instagram Hesaplari</h2>
          <p className="text-slate-400 text-sm mt-1">Yayin yapilacak Instagram hesaplarini yonetin</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-success flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Hesap
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 animate-slide-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {editingId ? 'Hesap Duzenle' : 'Yeni Hesap Ekle'}
              </h3>
              <p className="text-slate-500 text-sm">Instagram yayin bilgilerini girin</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Hesap Adi</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="Okul Ana Hesap"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">RTMP URL</label>
              <input
                type="text"
                value={formData.rtmpUrl}
                onChange={(e) => setFormData({ ...formData, rtmpUrl: e.target.value })}
                className="input font-mono text-sm"
                placeholder="rtmps://live-upload.instagram.com:443/rtmp/"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Stream Key</label>
              <input
                type="text"
                value={formData.streamKey}
                onChange={(e) => setFormData({ ...formData, streamKey: e.target.value })}
                className="input font-mono text-sm"
                placeholder="Instagram'dan aldiginiz stream key"
                required
              />
              <p className="text-slate-600 text-xs mt-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Instagram &gt; Canli Yayin &gt; Stream Key kismindan alinir
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-800"
              />
              <label htmlFor="isActive" className="text-slate-300 font-medium">
                Hesap aktif
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn btn-primary flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {editingId ? 'Guncelle' : 'Kaydet'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-ghost"
              >
                Iptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hesap Listesi */}
      <div className="space-y-3">
        {accounts.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-slate-400 mb-4">Henuz hesap eklenmemis</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Ilk hesabi ekle
            </button>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account._id}
              className="card card-hover p-5 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${account.isActive ? 'bg-gradient-to-br from-pink-500 to-rose-600' : 'bg-slate-700'}`}>
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{account.name}</h4>
                    <span className={`badge ${account.isActive ? 'badge-success' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                      {account.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1 font-mono">
                    {account.rtmpUrl}
                  </p>
                  <p className="text-slate-600 text-xs mt-1">
                    Key: {account.streamKey.substring(0, 15)}...
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(account)}
                  className="btn btn-ghost text-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Duzenle
                </button>
                <button
                  onClick={() => handleDelete(account._id)}
                  className="btn bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
