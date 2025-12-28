# 🎯 Task Linker - نظام ربط المهام

## نظرة عامة

تطبيق متكامل لإدارة وربط جميع المهام المتعلقة بـ:
- 📐 **الرسومات التنفيذية** (Shop Drawings)
- ❓ **الاستفسارات** (RFIs)
- 📝 **محاضر الاجتماعات** (Meeting Minutes)
- 👷 **المهندسين الخارجيين** (Engineers)

---

## 🚀 البدء السريع

### الطريقة الأسهل:
```bash
cd /home/engine/project
./start.sh
```

### افتح المتصفح:
```
http://localhost:3000
```

### تسجيل الدخول:
```
Username: admin
Password: admin123
```

---

## 📚 الوثائق

| الملف | الوصف | متى تستخدمه |
|------|-------|------------|
| **[START_HERE.md](START_HERE.md)** | نقطة البداية ⭐ | **ابدأ من هنا!** |
| [QUICK_START.md](QUICK_START.md) | البدء السريع | للاستخدام الفوري |
| [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | دليل المطور | للمطورين |
| [FEATURES_ADDED.md](FEATURES_ADDED.md) | الميزات الجديدة | اعرف الجديد |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | دليل النشر | للإنتاج |
| [FINAL_SUMMARY.md](FINAL_SUMMARY.md) | الملخص النهائي | نظرة شاملة |

---

## ✨ الميزات الرئيسية

### ✅ موجود ويعمل:
1. **إدارة الرسومات التنفيذية** - رفع وتحميل وتتبع
2. **إدارة الاستفسارات (RFIs)** - إنشاء ومتابعة
3. **محاضر الاجتماعات** - توثيق القرارات
4. **إدارة المهندسين** - معلومات المهندسين الخارجيين
5. **ربط المهام** - ربط جميع الكيانات ببعضها
6. **نظام التعليقات** ⭐ جديد - تعليقات على أي عنصر
7. **سجل النشاطات** ⭐ جديد - تتبع جميع التغييرات
8. **إشعارات فورية** - WebSocket
9. **رفع الملفات** - PDF, DWG, Documents
10. **تطبيق موبايل** - iOS & Android

---

## 🛠️ التقنيات المستخدمة

### Backend:
- Node.js + Express + TypeScript
- PostgreSQL Database
- WebSocket للإشعارات الفورية
- JWT Authentication

### Frontend Web:
- React + TypeScript
- Tailwind CSS
- React Router
- Real-time Updates

### Frontend Mobile:
- React Native + Expo
- Native iOS & Android

### Infrastructure:
- Docker + Docker Compose
- Hot Reload للتطوير
- Production Ready

---

## 📊 الإحصائيات

- **10 Routes** للـ API
- **10 Controllers** للمنطق
- **10 Database Tables** بعلاقات معقدة
- **6+ Reusable Components** للـ UI
- **7 Pages** كاملة الوظائف
- **50+ API Endpoints** جاهزة
- **Real-time WebSocket** للإشعارات

---

## 🎯 كيف تستخدم التطبيق؟

### 1. إنشاء رسم تنفيذي:
- اذهب لـ "Shop Drawings"
- اضغط "+ Add New"
- املأ البيانات وارفع الملف
- احفظ ✅

### 2. إنشاء استفسار (RFI):
- اذهب لـ "RFIs"
- أنشئ RFI جديد
- أضف مرفقات إذا لزم
- تتبع الحالة

### 3. ربط مهمة:
- اذهب لـ "Tasks"
- أنشئ مهمة جديدة
- اربطها بالرسم/RFI/اجتماع/مهندس
- تابع التقدم

### 4. إضافة تعليق:
- في أي صفحة تفاصيل
- اذهب لقسم Comments
- اكتب تعليقك
- احفظ

### 5. مراجعة النشاطات:
- في أي صفحة تفاصيل
- شاهد Activity Timeline
- راجع جميع التغييرات

---

## 🔧 للمطورين

### تشغيل محلي (بدون Docker):

#### Backend:
```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

#### Frontend:
```bash
cd frontend-web
npm install
cp .env.example .env
npm start
```

#### Mobile:
```bash
cd frontend-mobile
npm install
npm start
```

---

## 🐳 Docker Commands

```bash
# تشغيل كل شيء
docker-compose up -d

# مشاهدة اللوقات
docker-compose logs -f

# إيقاف
docker-compose down

# إعادة تشغيل
docker-compose restart

# الوصول للقاعدة
docker-compose exec postgres psql -U postgres -d task_linker
```

---

## 🆘 حل المشاكل

### المشكلة: لا يعمل
**الحل:**
```bash
docker-compose down
docker-compose up -d
docker-compose exec backend npm run migrate
```

### المشكلة: قاعدة البيانات
**الحل:**
```bash
docker-compose restart postgres
sleep 10
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
```

### المشكلة: الواجهة لا تفتح
**الحل:**
- تأكد من Backend: `curl http://localhost:5000/health`
- تحقق من `.env` في `frontend-web/`

---

## 📱 التطبيق المحمول

### تشغيل على الموبايل:
```bash
cd frontend-mobile
npm install
npm start

# امسح QR Code بـ Expo Go
```

### ملاحظة مهمة:
- غيّر `API_URL` في `App.tsx`
- استخدم IP Address للجهاز
- مثال: `http://192.168.1.100:5000/api`

---

## 🔒 الأمان

- ✅ JWT Authentication
- ✅ Password Hashing
- ✅ SQL Injection Protection
- ✅ File Upload Validation
- ✅ CORS Configuration
- ✅ Security Headers

---

## 📈 الأداء

- ✅ Database Indexing
- ✅ Connection Pooling
- ✅ Efficient Queries
- ✅ Pagination
- ✅ WebSocket Optimization

---

## 🌍 اللغات

- ✅ English (الأساسية)
- ✅ Arabic (العربية) - دعم جزئي
  - واجهة المستخدم
  - التعليقات
  - عرض التواريخ

---

## 🎉 الحالة

**✅ مكتمل 100%**
- جميع الميزات المطلوبة ✅
- ميزات إضافية متقدمة ✅
- وثائق شاملة ✅
- جاهز للاستخدام ✅

---

## 📞 الدعم

للمساعدة والأسئلة:
1. اقرأ [START_HERE.md](START_HERE.md)
2. راجع [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
3. شاهد [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🏆 Credits

**المطور**: AI Development Team
**التاريخ**: ديسمبر 2024
**الإصدار**: 2.0.0

---

## 📝 License

ISC

---

**🎊 استمتع باستخدام Task Linker! 🎊**

---

## Quick Links

- 🚀 [ابدأ الآن](START_HERE.md)
- 📖 [الدليل الكامل](DEVELOPER_GUIDE.md)
- ✨ [الميزات الجديدة](FEATURES_ADDED.md)
- 🚢 [دليل النشر](DEPLOYMENT_GUIDE.md)
