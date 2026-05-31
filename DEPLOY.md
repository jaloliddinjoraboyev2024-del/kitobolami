# KitobOlami — Deploy qilish yo'riqnomasi

## Loyiha tuzilishi
```
src/
├── firebase/
│   ├── config.js     ← Firebase konfiguratsiya + auth providers
│   └── auth.js       ← Barcha auth funksiyalar
├── pages/
│   ├── LoginPage.jsx   ← Login + Forgot password
│   ├── SignupPage.jsx  ← Ro'yxatdan o'tish + email tasdiqlash
│   └── Dashboard.jsx  ← Foydalanuvchi sahifasi (himoyalangan)
├── components/
│   └── AuthProvider.jsx ← Auth context
└── App.jsx             ← Routing
```

## Firebase Console sozlamalari

### 1. Authentication yoqish
Firebase Console → Authentication → Sign-in method:
- ✅ Email/Password — yoqish
- ✅ Google — yoqish (loyiha nomi: KitobOlami)
- ✅ Apple — yoqish (Apple Developer account kerak)

### 2. Authorized domains qo'shish
Firebase Console → Authentication → Settings → Authorized domains:
- `kitobolami0.firebaseapp.com` (avtomatik)
- `kitobolami0.web.app` (avtomatik)
- O'z domeningizni qo'shing (masalan `kitabolami.uz`)

---

## Deploy qilish

### Variant A: Firebase Hosting (tavsiya etiladi)

```bash
# 1. Firebase CLI o'rnatish
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Loyiha papkasiga o'tish
cd kitabolami

# 4. Build
npm run build

# 5. Deploy
firebase deploy --only hosting
```

URL: `https://kitobolami0.web.app`

---

### Variant B: Vercel

```bash
# 1. Vercel CLI o'rnatish
npm install -g vercel

# 2. Deploy
cd kitabolami
vercel --prod
```

---

### Variant C: Netlify

```bash
# 1. Build
npm run build

# 2. dist/ papkasini Netlify dashboard'ga drag & drop qiling
# yoki Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Muhim:** Netlify va Vercel uchun SPA redirect qo'shing:
- Netlify: `dist/_redirects` faylida `/* /index.html 200`
- Vercel: `vercel.json` da rewrites sozlash

---

## Mahalliy ishga tushirish

```bash
cd kitabolami
npm install
npm run dev
```

Brauzerda: http://localhost:5173

---

## Sahifalar

| Yo'l | Sahifa |
|------|--------|
| `/login` | Login sahifasi |
| `/signup` | Ro'yxatdan o'tish |
| `/dashboard` | Foydalanuvchi kabineti (login talab qiladi) |

---

## Ishlayotgan funksiyalar

- ✅ Email + parol bilan kirish
- ✅ Google orqali kirish
- ✅ Apple orqali kirish  
- ✅ Yangi hisob yaratish
- ✅ Email tasdiqlash xati yuborish
- ✅ Parolni tiklash (email orqali)
- ✅ Himoyalangan dashboard (login bo'lmasa redirect)
- ✅ Chiqish (sign out)
- ✅ Parol kuchliligi ko'rsatkichi
- ✅ Firebase Hosting konfiguratsiya (`firebase.json`)
