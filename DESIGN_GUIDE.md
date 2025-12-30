# ÇALIK TV - Tasarım Rehberi

## Hakkında

**ÇALIK TV**, Nuh Mehmet Küçükçalık Anadolu Lisesi'nin resmi canlı yayın platformudur. 1984 yılında kurulan okul, Kayseri'nin en köklü ve akademik başarısı yüksek Anadolu liselerinden biridir.

Bu tasarım rehberi, platformun görsel tutarlılığını sağlamak için oluşturulmuştur.

---

## Marka Kimliği

### Logo Konsepti
- **ÇALIK** kelimesi okulun kısaltmasından gelir
- **TV** canlı yayın platformunu temsil eder
- Modern, profesyonel ve kurumsal bir görünüm hedeflenir

### Slogan
> "Canlı Yayının Adresi"

---

## Renk Paleti

### Ana Renkler (Primary)

| Renk | HEX | Kullanım |
|------|-----|----------|
| **Lacivert** | `#1e3a5f` | Ana marka rengi, başlıklar, sidebar |
| **Koyu Lacivert** | `#152a45` | Hover durumları, vurgular |
| **Açık Lacivert** | `#2d4a6f` | Kartlar, secondary elementler |

### Vurgu Renkleri (Accent)

| Renk | HEX | Kullanım |
|------|-----|----------|
| **Kırmızı** | `#dc2626` | Canlı yayın göstergesi, uyarılar |
| **Altın** | `#f59e0b` | Başarı, önemli bilgiler |
| **Yeşil** | `#16a34a` | Başarılı işlemler, aktif durumlar |

### Nötr Renkler (Neutral)

| Renk | HEX | Kullanım |
|------|-----|----------|
| **Beyaz** | `#ffffff` | Metin, ikonlar |
| **Gri 100** | `#f3f4f6` | Açık arka planlar |
| **Gri 400** | `#9ca3af` | Secondary metin |
| **Gri 700** | `#374151` | Kartlar |
| **Gri 800** | `#1f2937` | Ana arka plan |
| **Gri 900** | `#111827` | En koyu arka plan |

---

## Tipografi

### Font Ailesi
```css
font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
```

### Font Boyutları

| Kullanım | Boyut | Ağırlık |
|----------|-------|---------|
| H1 (Sayfa Başlığı) | 2rem (32px) | Bold (700) |
| H2 (Bölüm Başlığı) | 1.5rem (24px) | Semibold (600) |
| H3 (Kart Başlığı) | 1.125rem (18px) | Semibold (600) |
| Body | 1rem (16px) | Regular (400) |
| Small | 0.875rem (14px) | Regular (400) |
| Caption | 0.75rem (12px) | Regular (400) |

---

## Bileşenler

### Kartlar
```css
background: #1f2937;
border-radius: 12px;
padding: 24px;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
```

### Butonlar

**Primary Button:**
```css
background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
color: white;
border-radius: 8px;
padding: 12px 24px;
font-weight: 600;
```

**Danger Button (Canlı/Durdur):**
```css
background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
```

**Success Button (Başlat):**
```css
background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
```

### Input Alanları
```css
background: #111827;
border: 1px solid #374151;
border-radius: 8px;
padding: 12px 16px;
color: white;
```

**Focus durumu:**
```css
border-color: #1e3a5f;
box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.3);
```

---

## Sidebar

- Genişlik: 280px
- Arka plan: Gradient (lacivert → koyu lacivert)
- Logo üstte, navigasyon ortada, kullanıcı bilgisi altta
- Aktif menü item'ı beyaz arka plan ile vurgulanır

---

## Durum Göstergeleri

### Canlı Yayın
- Kırmızı arka plan
- Yanıp sönen beyaz nokta animasyonu
- "CANLI" yazısı büyük ve bold

### Kapalı
- Gri arka plan
- Statik görünüm

---

## İkonlar

Lucide Icons veya Heroicons kullanılır:
- Tutarlı çizgi kalınlığı (1.5px)
- 24x24px standart boyut
- Beyaz veya gri renk (context'e göre)

---

## Responsive Tasarım

| Breakpoint | Değer | Davranış |
|------------|-------|----------|
| Mobile | < 768px | Sidebar gizlenir, hamburger menü |
| Tablet | 768px - 1024px | Sidebar daraltılır |
| Desktop | > 1024px | Tam sidebar görünür |

---

## Animasyonlar

- Geçişler: `transition: all 0.2s ease`
- Hover efektleri: Scale veya opacity değişimi
- Canlı göstergesi: `pulse` animasyonu

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## Erişilebilirlik

- Minimum kontrast oranı: 4.5:1
- Focus durumları görünür olmalı
- Tüm interaktif elementler keyboard ile erişilebilir
- Alt text ve ARIA label'lar kullanılmalı

---

## Örnek Renk Kullanımı

```jsx
// Tailwind CSS sınıfları
const colors = {
  primary: 'bg-[#1e3a5f]',
  primaryHover: 'hover:bg-[#152a45]',
  accent: 'bg-amber-500',
  danger: 'bg-red-600',
  success: 'bg-green-600',
  background: 'bg-gray-900',
  card: 'bg-gray-800',
  text: 'text-white',
  textMuted: 'text-gray-400'
};
```

---

## Dosya Yapısı (Tasarım)

```
client/src/
├── index.css          # Global stiller, Tailwind config
├── components/
│   ├── Layout.jsx     # Ana layout, sidebar
│   ├── Card.jsx       # Tekrar kullanılabilir kart
│   └── Button.jsx     # Tekrar kullanılabilir buton
└── pages/
    ├── Dashboard.jsx  # Ana sayfa
    ├── Stream.jsx     # Yayın kontrolü
    └── ...
```

---

*Bu rehber, ÇALIK TV platformunun tutarlı ve profesyonel görünümünü sağlamak için referans olarak kullanılmalıdır.*
