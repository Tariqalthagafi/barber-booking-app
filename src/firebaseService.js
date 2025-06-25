import { collection, getDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getAuth } from 'firebase/auth';

export const saveBarber = async (barberData) => {
  try {
    if (!barberData.userId) throw new Error('يجب تمرير userId لحفظ بيانات الحلاق');
    const docRef = doc(db, 'barbers', barberData.userId);
    await setDoc(docRef, barberData);
    return barberData.userId;
  } catch (error) {
    console.error('❌ خطأ أثناء حفظ البيانات:', error);
    return null;
  }
};

export const fetchAllBarbers = async () => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const snapshot = await getDocs(collection(db, 'barbers'));

    const result = snapshot.docs.map(doc => {
      const data = doc.data();
      const isOwner = currentUser && currentUser.uid === doc.id;
      if (data.approved || isOwner) {
        return { id: doc.id, ...data };
      }
      return null;
    }).filter(Boolean);

    return result;
  } catch (error) {
    console.error('❌ خطأ في جلب الحلاقين:', error.message);
    return [];
  }
};

export const fetchMyBarber = async (uid) => {
  try {
    const ref = doc(db, 'barbers', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error('❌ خطأ في جلب بيانات الحلاق:', error);
    return null;
  }
};
