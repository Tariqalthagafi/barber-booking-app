// src/admin/adminService.js
import { doc, updateDoc, deleteField, getFirestore } from 'firebase/firestore';

const db = getFirestore();

/**
 * يعتمد التعديل المقترح على حقل واحد.
 * @param {string} barberId - معرف الحلاق
 * @param {string} field - اسم الحقل (مثل 'name' أو 'image')
 * @param {*} newValue - القيمة المقترحة للموافقة عليها
 */
export const approvePendingChange = async (barberId, field, newValue) => {
  const ref = doc(db, 'barbers', barberId);
  await updateDoc(ref, {
    [field]: newValue,
    [`pendingChanges.${field}`]: deleteField()
  });
};

/**
 * يرفض التعديل المعلّق على حقل واحد، ويبقي القيمة الحالية كما هي.
 * @param {string} barberId - معرف الحلاق
 * @param {string} field - اسم الحقل
 */
export const rejectPendingChange = async (barberId, field) => {
  const ref = doc(db, 'barbers', barberId);
  await updateDoc(ref, {
    [`pendingChanges.${field}`]: deleteField()
  });
};
