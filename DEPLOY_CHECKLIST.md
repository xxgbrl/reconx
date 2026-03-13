# ✅ RECONX Deploy Checklist

Centang satu per satu sebelum share ke teman-teman.

---

## 📦 GitHub Pages Setup

- [ ] Buat akun GitHub (jika belum punya) di [github.com](https://github.com)
- [ ] Buat repository baru: **New repository** → nama: `reconx` → **Public** → Create
- [ ] Upload file-file ini ke repo:
  - [ ] `index.html` ← file utama RECONX
  - [ ] `README.md`
  - [ ] `worker.js`
  - [ ] `.gitignore`
- [ ] Aktifkan GitHub Pages:
  - [ ] Settings → Pages → Source: **Deploy from a branch**
  - [ ] Branch: **main** → Folder: **/ (root)** → Save
- [ ] Tunggu 1-2 menit → cek `https://xxgbrl.github.io/reconx`
- [ ] Test buka di browser — semua tab (Scanner, Checklist, dll) berfungsi

---

## 🤖 Groq API Setup (Gratis)

- [ ] Buka [console.groq.com](https://console.groq.com)
- [ ] Sign up dengan Google/GitHub (gratis, no kartu kredit)
- [ ] Verifikasi email
- [ ] Menu **API Keys** → **Create API Key** → copy key (`gsk_...`)
- [ ] Simpan key di tempat aman (password manager, dll)
- [ ] Test di RECONX: Settings ⚙ → Provider: Groq → Paste key → **Save & Test**
- [ ] Pastikan muncul "✓ API connection successful"

---

## ☁️ Cloudflare Workers Setup (Opsional, untuk production)

- [ ] Daftar [cloudflare.com](https://cloudflare.com) (gratis)
- [ ] Workers & Pages → **Create Application** → **Create Worker**
- [ ] Nama worker: `reconx-ai`
- [ ] Edit code → paste isi `worker.js` → **Save and Deploy**
- [ ] Settings → Variables → tambah:
  - [ ] `GROQ_API_KEY` = key Groq kamu (encrypted ✅)
  - [ ] `ALLOWED_ORIGIN` = `https://xxgbrl.github.io`
- [ ] (Opsional) Setup KV untuk rate limiting:
  - [ ] KV → Create namespace → nama: `RECONX_RATE_LIMIT`
  - [ ] Worker → Settings → KV Bindings → Variable: `KV` → Namespace: `RECONX_RATE_LIMIT`
- [ ] Test Worker URL di RECONX: Settings → Provider: **Custom** → URL worker → Save & Test

---

## 🧪 Testing Before Share

- [ ] Buka URL GitHub Pages di incognito window
- [ ] Tab **Scanner**: scan domain milikmu sendiri
- [ ] Tab **AI Chat**: tanya sesuatu → dapat respons
- [ ] Tab **Checklist**: centang beberapa item
- [ ] Tab **Report**: ada data, tombol Export PDF/JSON berfungsi
- [ ] Tab **History**: muncul hasil scan
- [ ] Toggle bahasa EN ↔ ID berfungsi
- [ ] Export PDF → file terdownload
- [ ] Export JSON → file terdownload
- [ ] Cek di HP (mobile responsive)

---

## 📢 Share ke Komunitas

Setelah semua checklist di atas ✅:

```
🔒 RECONX 5 — Free Security Audit Toolkit

Tools gratis untuk audit keamanan web app,
cocok banget buat yang lagi vibe coding!

✅ Passive recon (IP, DNS, SSL, Headers, Ports)
✅ OWASP Top 10 Checklist
✅ AI Chat (Groq gratis)
✅ Export PDF/JSON
✅ History & Compare
✅ Tips & Tricks dengan kode siap pakai
✅ Dual language ID/EN

🔗 https://xxgbrl.github.io/reconx

⚠️ Hanya untuk sistem yang kamu miliki/ada izin
```

---

## 🆘 Butuh Bantuan?

Cek bagian **Troubleshooting** di README.md atau buka issue di GitHub.
