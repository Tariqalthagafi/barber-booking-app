// AppCheck.js
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

/**
 * يهيّئ App Check لتأمين الوصول إلى خدمات Firebase
 * @param {object} app - نسخة Firebase app المُهيئة مسبقًا
 */
const initAppCheck = (app) => {
  // ✅ تفعيل debug token محليًا فقط
  if (process.env.NODE_ENV === 'development') {
    // يعرض التوكن في الكونسول لأول مرة فقط
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  // ✅ تهيئة App Check باستخدام reCAPTCHA v3
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      process.env.REACT_APP_RECAPTCHA_KEY // تأكد إنه موجود في ملف .env
    ),
    isTokenAutoRefreshEnabled: true, // يجدد التوكنات تلقائيًا
  });
};

export default initAppCheck;
