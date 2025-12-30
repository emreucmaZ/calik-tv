import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { accountApi } from '../services/api';

const defaultFormData = {
  name: '',
  rtmpUrl: 'rtmp://live-upload.instagram.com:80/rtmp/',
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
      toast.error('Hesaplar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await accountApi.update(editingId, formData);
        toast.success('Hesap güncellendi');
      } else {
        await accountApi.create(formData);
        toast.success('Hesap eklendi');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(defaultFormData);
      fetchAccounts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bir hata oluştu');
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
    if (!confirm('Bu hesabı silmek istediğinize emin misiniz?')) return;
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
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Instagram Hesapları</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            + Yeni Hesap
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {editingId ? 'Hesap Düzenle' : 'Yeni Hesap Ekle'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-1">Hesap Adı</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-500"
                placeholder="Okul Ana Hesap"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">RTMP URL</label>
              <input
                type="text"
                value={formData.rtmpUrl}
                onChange={(e) => setFormData({ ...formData, rtmpUrl: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-500"
                placeholder="rtmp://live-upload.instagram.com:80/rtmp/"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Stream Key</label>
              <input
                type="text"
                value={formData.streamKey}
                onChange={(e) => setFormData({ ...formData, streamKey: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-500"
                placeholder="Instagram'dan aldığınız stream key"
                required
              />
              <p className="text-gray-500 text-sm mt-1">
                Instagram &gt; Canlı Yayın &gt; Stream Key kısmından alınır
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-gray-400">
                Hesap aktif
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded"
              >
                {editingId ? 'Güncelle' : 'Kaydet'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hesap Listesi */}
      <div className="space-y-4">
        {accounts.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-gray-400">Henüz hesap eklenmemiş</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-red-500 hover:text-red-400"
            >
              İlk hesabı ekle
            </button>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account._id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-lg">{account.name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      account.isActive
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-gray-600/20 text-gray-400'
                    }`}
                  >
                    {account.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  {account.rtmpUrl}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Key: {account.streamKey.substring(0, 10)}...
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(account)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(account._id)}
                  className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1 rounded text-sm"
                >
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
