# 🚗 Car Project — Fullstack Web Ilova

Bu loyiha avtomobillar bilan bog‘liq ma'lumotlarni ko‘rish, qo‘shish, tahrirlash va o‘chirish imkonini beruvchi **fullstack web ilova** hisoblanadi. Ilova ikki asosiy qismdan iborat:

- **Frontend**: `Vite` va ehtimol `React` asosida foydalanuvchi interfeysi
- **Backend**: `Node.js` yordamida API xizmatlarini ko‘rsatuvchi server

---

## 🏗 Loyiha Tuzilishi

```
Car/
├── frontend/         # Foydalanuvchi interfeysi
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
└── backend/          # Server qismi
    ├── app.js
    ├── package.json
    └── ...
```

---

## 🚀 Texnologiyalar

### Frontend:
- Vite
- JavaScript (yoki TypeScript)
- React (agar mavjud bo‘lsa)
- ESLint

### Backend:
- Node.js
- Express.js (agar mavjud bo‘lsa)
- Body-parser
- Yargs-parser
- CORS (agar kerak bo‘lsa)

---

## ⚙️ O‘rnatish va Ishga Tushurish

### 1. Repositoryni Klon Qiling

```bash
git clone https://github.com/your-username/car-project.git
cd car-project
```

---

### 2. Backendni Ishga Tushurish

```bash
cd backend
npm install
node app.js
```

> Backend server odatda `http://51.20.108.48:3000` da ishlaydi (aniq port `app.js` faylida belgilangan).

---

### 3. Frontendni Ishga Tushurish

Yangi terminal oynasida:

```bash
cd frontend
npm install
npm run dev
```

> Frontend odatda `http://51.20.108.48:5173` da ishga tushadi.

---

## 🔗 API Endpointlar (Backend)

Quyidagi endpointlar orqali avtomobil ma'lumotlari bilan ishlash mumkin (taxminan):

| Endpoint         | Method | Tavsif                        |
|------------------|--------|-------------------------------|
| `/api/cars`      | GET    | Avtomobillar ro‘yxatini olish |
| `/api/cars/:id`  | GET    | Ma'lum bir avtomobilni olish |
| `/api/cars`      | POST   | Yangi avtomobil qo‘shish      |
| `/api/cars/:id`  | PUT    | Avtomobilni tahrirlash        |
| `/api/cars/:id`  | DELETE | Avtomobilni o‘chirish         |

> Aniqlik uchun `app.js` faylini tekshiring.

---

## 🧪 Testlar

Agar test yozilgan bo‘lsa:

### Frontend:

```bash
npm run test
```

### Backend:

```bash
npm test
```

---

## 📦 Foydalanilgan Kutubxonalar

- `vite` – frontend build vositasi
- `express` – backend framework
- `cors`, `body-parser` – API uchun yordamchilar
- `eslint` – kod sifati uchun linter
- `yargs-parser` – buyruqlarni tahlil qilish uchun

---

## 💡 Hissa Qo‘shish

1. Loyihani fork qiling
2. O‘zgarishlarni alohida branchda bajaring (`feature/my-feature`)
3. Pull Request yarating

---

## 📄 Litsenziya

Ushbu loyiha MIT litsenziyasi asosida tarqatiladi.

---

## 📬 Aloqa

   
📁 Issues bo‘limida muammo qoldiring