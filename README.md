# 🔒 RECONX 5 — Ultimate Security Audit Toolkit

![RECONX Banner](https://img.shields.io/badge/RECONX-v5.0-00c8ff?style=for-the-badge&labelColor=06080f)
![License](https://img.shields.io/badge/License-MIT-00ffaa?style=for-the-badge&labelColor=06080f)
![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-a78bfa?style=for-the-badge&labelColor=06080f)

> **⚠️ DISCLAIMER:** Tools ini hanya untuk pengujian pada sistem yang kamu **miliki** atau sudah ada **izin tertulis**. Penggunaan tanpa izin adalah ilegal.

Web-based security audit toolkit dengan fitur passive recon, OWASP checklist, AI chat (Groq/OpenAI/Gemini/Claude), export PDF/JSON, history & compare, tips & tricks, dan panduan tools.

---

## ✨ Fitur

| Fitur | Deskripsi |
|-------|-----------|
| 🌐 **Scanner** | Passive recon: IP info, DNS, SSL/TLS, HTTP headers, port probe, subdomain enum, tech stack detection |
| ☑️ **OWASP Checklist** | 40+ item OWASP Top 10 + bonus vibe coding checklist |
| 🤖 **AI Chat** | Chat dengan AI tentang hasil scan — support Groq, OpenAI, Gemini, Claude, Custom |
| 📊 **History & Compare** | Simpan riwayat scan, bandingkan 2 hasil scan |
| 💡 **Tips & Tricks** | 12+ tips keamanan dengan kode siap pakai |
| 🛠️ **Tools Guide** | Panduan 12 tools security profesional |
| 📄 **Export PDF/JSON** | Export laporan lengkap |
| 🌐 **Dual Language** | Bahasa Indonesia + English |

---

## 🚀 Quick Deploy ke GitHub Pages

### Cara Paling Simpel (5 menit)

**1. Fork atau upload ke GitHub**

```bash
# Clone repo ini
git clone https://github.com/xxgbrl/reconx.git
cd reconx

# Atau langsung upload file index.html ke repo baru
```

**2. Aktifkan GitHub Pages**

1. Buka repo di GitHub
2. Klik **Settings** → **Pages** (menu kiri)
3. Di bagian **Source**, pilih **Deploy from a branch**
4. Branch: **main** → Folder: **/ (root)**
5. Klik **Save**
6. Tunggu ~1-2 menit
7. Akses di: `https://xxgbrl.github.io/reconx`

**Selesai!** Tools langsung bisa dipakai tanpa backend.

---

## 🤖 Setup AI Chat

AI Chat butuh API key. Berikut opsi dari yang paling mudah:

### Opsi 1 — Groq (RECOMMENDED: Gratis, No Kartu Kredit)

**Step 1: Daftar Groq**
1. Buka [console.groq.com](https://console.groq.com)
2. Klik **Sign Up** → daftar dengan Google/GitHub/Email
3. Verifikasi email

**Step 2: Buat API Key**
1. Di dashboard Groq, klik **API Keys** di menu kiri
2. Klik **Create API Key**
3. Beri nama (misal: `reconx`)
4. **Copy** API key yang muncul (format: `gsk_...`)
5. Simpan baik-baik — tidak bisa dilihat lagi!

**Step 3: Masukkan ke RECONX**
1. Buka RECONX di browser
2. Klik **⚙ Settings** di pojok kanan atas
3. Provider: pilih **Groq**
4. Paste API key di field **API KEY**
5. Klik **Save & Test**
6. Jika muncul "✓ API connection successful" → siap!

**Limit gratis Groq:**
- 30 request/menit
- 14,400 request/hari
- Gratis selamanya

---

### Opsi 2 — Google Gemini (Gratis, Perlu Akun Google)

**Step 1: Buat API Key**
1. Buka [aistudio.google.com](https://aistudio.google.com)
2. Login dengan akun Google
3. Klik **Get API Key** → **Create API key**
4. Copy key (format: `AIza...`)

**Step 2: Masukkan ke RECONX**
1. Settings → Provider: **Google Gemini**
2. Paste API key
3. Model: **Gemini 1.5 Flash** (gratis)
4. Save & Test

**Limit gratis Gemini:**
- 15 request/menit
- 1,500 request/hari

---

### Opsi 3 — OpenAI (Berbayar, $5 credit gratis untuk akun baru)

1. Daftar di [platform.openai.com](https://platform.openai.com)
2. Billing → Add payment method
3. API Keys → Create new secret key
4. Settings RECONX → Provider: **OpenAI** → Paste key

---

### Opsi 4 — Cloudflare Workers (Deploy sendiri untuk production)

Lihat section **[Deploy dengan Cloudflare Workers](#deploy-dengan-cloudflare-workers)** di bawah.

---

## ☁️ Deploy dengan Cloudflare Workers

Cocok jika kamu mau **hosting API key sendiri** supaya user tidak perlu input key. Ini cara yang paling proper untuk production.

### Arsitektur

```
User Browser          Cloudflare Worker        AI Provider
(GitHub Pages)        (serverless, gratis)     (Groq/OpenAI/dll)
      │                      │                      │
      │ 1. Kirim pesan       │                      │
      │ ────────────────────►│                      │
      │                      │ 2. Forward + API key │
      │                      │ ─────────────────────►
      │                      │                      │
      │                      │ 3. Response AI       │
      │                      │ ◄─────────────────────
      │ 4. Balik ke browser  │                      │
      │ ◄────────────────────│                      │
```

API key **tidak pernah menyentuh browser** — aman 100%.

### Step 1: Daftar Cloudflare (Gratis)

1. Buka [cloudflare.com](https://cloudflare.com)
2. Klik **Sign Up** → daftar gratis
3. Verifikasi email

### Step 2: Buat Worker

1. Di dashboard Cloudflare, klik **Workers & Pages** di menu kiri
2. Klik **Create Application** → **Create Worker**
3. Beri nama worker: `reconx-ai` (atau terserah)
4. Klik **Deploy**
5. Klik **Edit Code**
6. **Hapus** semua kode yang ada, **replace** dengan kode berikut:

```javascript
export default {
  async fetch(request, env) {

    // ── CORS preflight ──
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    // ── Hanya izinkan POST ──
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // ── Validasi origin (keamanan) ──
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || '*';
    if (allowed !== '*' && origin !== allowed) {
      return new Response('Forbidden', { status: 403 });
    }

    // ── Rate limiting per IP ──
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimitKey = `rate:${ip}`;
    
    if (env.KV) {
      const count = parseInt(await env.KV.get(rateLimitKey) || '0');
      if (count > 30) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again in 1 hour.' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      await env.KV.put(rateLimitKey, count + 1, { expirationTtl: 3600 });
    }

    // ── Parse body ──
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }

    // ── Forward ke Groq ──
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: body.model || 'llama-3.1-8b-instant',
        messages: body.messages,
        max_tokens: body.max_tokens || 1000,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'API error' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': allowed }
      });
    }

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowed,
      }
    });
  }
}
```

7. Klik **Save and Deploy**

### Step 3: Set Environment Variables (API Key)

1. Di halaman Worker, klik tab **Settings**
2. Klik **Variables** → **Environment Variables**
3. Klik **Add variable**:

| Variable Name | Value | Encrypted? |
|--------------|-------|-----------|
| `GROQ_API_KEY` | `gsk_your_groq_api_key_here` | ✅ Yes |
| `ALLOWED_ORIGIN` | `https://xxgbrl.github.io` | No |

4. Klik **Save and Deploy**

### Step 4 (Opsional): Setup KV untuk Rate Limiting

1. Di Cloudflare dashboard → **Workers & Pages** → **KV**
2. Klik **Create namespace** → nama: `RECONX_RATE_LIMIT`
3. Balik ke Worker → **Settings** → **KV Namespace Bindings**
4. Klik **Add binding**:
   - Variable name: `KV`
   - KV namespace: `RECONX_RATE_LIMIT`
5. **Save and Deploy**

### Step 5: Update RECONX untuk Pakai Worker

1. Buka RECONX di browser → **⚙ Settings**
2. Provider: **Custom Endpoint**
3. Endpoint URL: `https://reconx.gabriel-dimas-eka-jaya.workers.dev`
4. API Key: *kosongkan* (sudah di-handle Worker)
5. Save & Test

---

## 📁 Struktur File

```
reconx/
├── index.html          # Main application (single file)
├── README.md           # Dokumentasi ini
├── worker.js           # Cloudflare Worker code
├── .github/
│   └── workflows/
│       └── deploy.yml  # Auto-deploy workflow (opsional)
└── .gitignore
```

---

## 🔧 Konfigurasi Lanjutan

### Custom Domain di GitHub Pages

1. Beli domain (Niagahoster, Domainesia, Namecheap, dll)
2. Di GitHub repo → Settings → Pages → **Custom domain**
3. Masukkan domain: `reconx.domainmu.com`
4. Di DNS provider, tambah record:
   ```
   Type: CNAME
   Name: reconx
   Value: xxgbrl.github.io
   ```
5. Centang **Enforce HTTPS**

### Custom Domain di Cloudflare Worker

1. Di Worker → **Settings** → **Triggers**
2. **Custom Domains** → **Add Custom Domain**
3. Masukkan: `api.domainmu.com`
4. Update `ALLOWED_ORIGIN` ke domain custom kamu

---

## 🔄 Update Tools

```bash
# Pull update terbaru
git pull origin main

# Atau replace index.html dengan versi baru
# lalu push ke GitHub
git add index.html
git commit -m "Update RECONX to latest version"
git push origin main
```

GitHub Pages otomatis update dalam 1-2 menit.

---

## 🛠️ Troubleshooting

### AI Chat tidak respond

- ✅ Cek API key sudah benar (Settings → Save & Test)
- ✅ Cek quota Groq di [console.groq.com](https://console.groq.com) → Usage
- ✅ Coba ganti model ke `llama-3.1-8b-instant` (lebih stabil)
- ✅ Buka DevTools (F12) → Console, cek error message

### Scan tidak berjalan

- ✅ Pastikan domain valid (tanpa `https://`)
- ✅ Cek koneksi internet
- ✅ Beberapa modul butuh ~30 detik karena scan subdomain

### CORS error di Cloudflare Worker

- ✅ Pastikan `ALLOWED_ORIGIN` sesuai dengan URL GitHub Pages kamu
- ✅ Format: `https://xxgbrl.github.io` (tanpa trailing slash)
- ✅ Cek Worker logs di Cloudflare dashboard

### PDF export gagal

- ✅ Tunggu halaman fully loaded sebelum export
- ✅ Pastikan sudah ada hasil scan
- ✅ Coba di browser lain (Chrome direkomendasikan)

---

## 📊 Free Tier Comparison

| Platform | Gratis? | Limit | Kartu Kredit? |
|----------|---------|-------|---------------|
| GitHub Pages | ✅ | Unlimited | ❌ Tidak |
| Groq API | ✅ | 14,400 req/hari | ❌ Tidak |
| Gemini API | ✅ | 1,500 req/hari | ❌ Tidak |
| Cloudflare Workers | ✅ | 100,000 req/hari | ❌ Tidak |
| Cloudflare KV | ✅ | 100,000 read/hari | ❌ Tidak |

**Total biaya deployment: Rp 0** 🎉

---

## 🤝 Kontribusi

Pull request welcome! Terutama untuk:
- Tambah modul scan baru
- Improve AI prompts
- Tambah tips & tricks
- Bug fixes
- Terjemahan bahasa lain

---

## 📜 License

MIT License — bebas digunakan, dimodifikasi, dan didistribusikan.

---

## ⚠️ Legal Notice

Tools ini dibuat untuk tujuan **edukasi dan audit keamanan yang sah**. Pengguna bertanggung jawab penuh atas penggunaan tools ini. Pembuat tidak bertanggung jawab atas penyalahgunaan.

**Hanya gunakan pada:**
- ✅ Website/aplikasi milikmu sendiri
- ✅ Website/aplikasi yang sudah ada izin tertulis dari pemilik
- ✅ Lab/environment testing lokal (DVWA, HackTheBox, TryHackMe)

**Jangan gunakan pada:**
- ❌ Website orang lain tanpa izin
- ❌ Infrastruktur pemerintah
- ❌ Sistem perbankan/keuangan tanpa authorization

---

<div align="center">

Made with ❤️ for the security community

**[Live Demo](https://xxgbrl.github.io/reconx)** · **[Report Bug](https://github.com/xxgbrl/reconx/issues)** · **[Request Feature](https://github.com/xxgbrl/reconx/issues)**

</div>
