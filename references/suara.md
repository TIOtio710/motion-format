# Suara (Fish Audio / HeyGen / Agen Arman) — voiceover per adegan, efek suara, subtitle

Dibaca setiap kali video memakai suara. Tujuannya: user cukup ngobrol, lalu suara dibuat,
disimpan, disinkronkan dengan gambar dan subtitle, dan ikut masuk ke MP4.

## 0. Urutan: gambar uji disetujui → naskah → suara → bangun semua

Suara dibuat **setelah** gambar uji adegan 1 disetujui dan naskah disetujui. Dengan begitu,
kalau gaya diganti, kredit suara tidak terbuang. Setelah suara ada, panjang tiap adegan
mengikuti panjang klip suaranya.

## 1. Pilih mesin suara

Pakai salah satu yang tersambung di akun user. Tidak perlu API key.
| Mesin | Dipakai untuk | Tool (pilih dari fungsinya, nama bisa berubah) |
|---|---|---|
| **Fish Audio** (bawaan) | VO, efek suara | `search_voices`, `text_to_speech`, `generate_sound_effect`, `get_credit_balance` |
| **HeyGen** | VO | `list_voices`, `create_speech` |
| **Agen Arman** (MCP professionals.ai) | VO lewat Agent | `agent_context` lalu `agent_tool` (`generate_speech`) |
- Urutan bawaan: Fish Audio → HeyGen → Agen Arman, kecuali user menyebut yang lain.
- **Agen Arman hanya ada di project `professionals-ai`.** Di project lain, Arman tidak ada: minta
  user membuat Agent voice cloning dengan model **OmniVoice** di project itu, lalu pakai Agent
  tersebut lewat `agent_context` + `agent_tool` seperti Arman. Jangan membuatnya sendiri tanpa
  persetujuan user.
- Efek suara hanya dari Fish Audio. Mesin lain tanpa efek: naskah jalan tanpa SFX.
- **Belum tersambung?** Bilang satu kalimat mesin mana yang belum tersambung dan minta user
  menyambungkannya lalu mulai chat baru. Sambil menunggu, lanjutkan naskah. Jangan meminta API key.
- **Tidak mau pakai suara AI?** Video tetap jadi tanpa VO (teks layar membawa cerita), atau user
  merekam suara sendiri: taruh `vo-01.mp3` … di `assets/audio/` lalu lanjut ke langkah 6.

## 2. Naskah (`naskah.md`)

Satu baris tabel = satu adegan = satu klip suara.
```markdown
# Naskah: <judul>
Suara: <nama> (<id>) · mesin <Fish Audio|HeyGen|Arman> · model <model> · bahasa Indonesia
| # | Adegan (yang terlihat) | Kalimat VO | ±detik |
|---|---|---|---|
| 1 | kamera turun ke mesin cuci, dinding terbelah | Pernah kepikiran, gimana mesin cuci memeras baju? | 3 |
```
- Kalimat lisan, pendek. Angka ditulis seperti diucapkan ("dua ribu", "lima koma lima").
- Bahasa Indonesia ±2,6 kata/detik. Hitung durasi sebelum generate supaya sesuai brief.
- Perkiraan kredit ≈ jumlah karakter naskah; harga beda tiap mesin, cek saldo
  (Fish: `get_credit_balance`) dan sebutkan ke user sebelum generate.
- Nada: tag emosi hanya bila mesin/model-nya mendukung (cek dulu dengan 1 kalimat uji); satu tag
  per kalimat paling banyak. Tidak didukung → atur nada lewat pilihan suara dan tanda baca.

## 3. Pilih suara (sekali, lalu konsisten)

- Ambil daftar suara; saring berbahasa Indonesia/multibahasa. Tawarkan 2–3 pilihan dengan alasan
  (hangat/ceria/berwibawa, perempuan/laki-laki) + satu rekomendasi sesuai nuansa.
- Pakai model terbaru yang tersedia di mesin itu.
- Catat nama + id + mesin + model di kepala `naskah.md`. Seri = suara sama.

## 4. Hemat kredit

1. **1 variasi per generate.** Kalau tool bisa banyak variasi, set ke 1.
2. **Adegan 1 dulu** sebagai tes. Minta user mendengar. Baru sisanya.
3. Hasil masih diproses → baca status, **jangan** generate ulang.
4. Revisi naskah → generate ulang klip yang berubah saja.
5. Jeda diatur lewat `at` di `SCENE.audio`, bukan generate ulang.

## 5. Menyimpan berkas

Semua audio harus jadi berkas di `<proyek>/assets/audio/`: `vo-01.mp3`, `vo-02.mp3`, …,
`sfx-<nama>.mp3`, `musik.mp3`.

Jalur umum:
1. Generate → hasil berupa berkas, URL, atau id tugas. Id tugas → baca status sampai selesai
   (Fish: `get_audio_task` / `get_generation_status`), **jangan** generate ulang.
2. URL hasil bisa kedaluwarsa: unduh segera `curl -sSL -o assets/audio/vo-01.mp3 "<url>"`, lalu
   `file assets/audio/vo-01.mp3` harus "Audio file".
3. Tool memberi berkas → salin ke `assets/audio/` dengan nama baku. Hanya pemutar di chat tanpa
   berkas/URL → minta user mengunduh tiap hasil dan menaruhnya dengan nama yang kamu sebutkan
   persis. Tunggu sampai berkasnya ada.

## 6. Menyusun waktu

Durasi klip menentukan timeline:
```
mulai_1 = 0.4
mulai_(n+1) = mulai_n + durasi_n + 0.35     (0,3–0,8 dtk; lebih lama saat ganti babak)
dur = mulai_terakhir + durasi_terakhir + 1.5
```
Ukur durasi: `ffprobe -v error -show_entries format=duration -of csv=p=0 assets/audio/vo-01.mp3`.

Isi `SCENE.audio` — **`teks` wajib** (dipakai subtitle):
```js
audio: {
  vo:  [{src: 'assets/audio/vo-01.mp3', at: 0.4, teks: 'Pernah kepikiran, gimana mesin cuci memeras baju?'},
        {src: 'assets/audio/vo-02.mp3', at: 3.6, teks: '...'}],
  sfx: [{src: 'assets/audio/sfx-whoosh.mp3', at: 3.3, vol: .4}],
  music: {src: 'assets/audio/musik.mp3', vol: .12}   // atau null
}
```
Lalu `mf.py kata <proyek>` → `kata.js` (perkiraan waktu tiap kata dari durasi & jeda suara,
±0,15 dtk). Turunkan waktu adegan dari kata kunci (`T('mesin')`, lihat `mesin.md`). Bila subtitle
terasa mendahului/terlambat di satu tempat, koreksi angka di `kata.js` langsung.

## 7. Efek suara & musik

- **Satu bunyi per momen, dan jarang.** 3–7 efek per video 30–45 detik: benda besar muncul,
  transisi besar, angka kunci, penutup. Bukan di setiap gerak; tidak ada efek beruntun cepat.
- **Efek di jeda suara**, bukan menimpa kata. Cari jeda:
  `ffmpeg -i assets/audio/vo-02.mp3 -af silencedetect=n=-35dB:d=0.25 -f null -` (detik file +
  `at` klip = detik layar).
- Efek lewat Fish `generate_sound_effect`. Prompt dalam bahasa Inggris, pendek + durasi: "soft airy whoosh, 0.6 seconds",
  "deep mechanical clunk, 0.5 seconds", "gentle bright chime, 1 second".
- Volume: VO 1 · efek .3–.5 · musik .10–.15. Satu efek boleh dipakai berkali-kali.
- Musik hanya bila user mau atau gaya memintanya; pilih yang tenang di bawah suara.

## 8. Render & cek

`mf.py render <proyek> --sampai 8` → user mendengar: suara pas dengan gambar? efek tidak menutup
kata? → `mf.py render <proyek>`. Loudness dinormalkan otomatis ke ±-15 LUFS (standar Reels/YouTube).

## 9. Checklist suara

- [ ] Gambar uji & naskah sudah disetujui sebelum generate
- [ ] Perkiraan kredit disebut; 1 variasi per generate; adegan 1 dites dulu
- [ ] Suara/id/model tercatat di `naskah.md`
- [ ] Berkas di `assets/audio/` dengan nama baku, durasi diukur
- [ ] `SCENE.audio.vo` punya `teks`; `kata.js` dibuat; subtitle pas
- [ ] Efek jarang, di jeda, tidak menutupi kata
