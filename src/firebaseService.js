import { db } from './firebase';
import { getDocs, collection } from 'firebase/firestore';


export const fetchAllBarbers = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'barbers'));

    const barbers = snapshot.docs.map(docSnap => {
      const raw = docSnap.data();

      return {
        id: docSnap.id,
        approved: raw.approved ?? false,
        membershipType: raw.membershipType || 'غير محدد',
        status: raw.status || {},
        pendingChanges: raw.pendingChanges || {},
        baseData: {
          name: raw.name || '',
          phone: raw.phone || '',
          image: raw.image || '',
          salon: raw.salon || '',
          location: raw.location || { lat: '', lng: '' },
          services: raw.services || [],
          workingHours: raw.workingHours || {},
          offersKidsHaircut: raw.offersKidsHaircut || false,
          offersHomeService: raw.offersHomeService || false
        },
        metrics: {
          rating: raw.rating || 0,
          totalReviews: raw.totalReviews || 0
        }
      };
    });

    return barbers;
  } catch (err) {
    console.error('❌ فشل في تحميل الحلاقين:', err);
    return [];
  }
};
