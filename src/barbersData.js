import ahmadImg from './images/1.jpg';
import samiImg from './images/2.jpg';
import jamalImg from './images/3.jpg';

const barbers = [
  {
    name: 'أحمد الحلاق',
    image: ahmadImg,
    rating: '4.8',
    services: [
      { name: 'قص شعر كلاسيكي', price: 35 },
      { name: 'تنظيف بشرة', price: 50 },
      { name: 'حلاقة ذقن', price: 25 },
    ],
    available: true,
    location: { lat: 21.6283, lng: 39.1047 }

  },
  {
    name: 'سامي القصّاب',
    image: samiImg,
    rating: '4.5',
    services: [
      { name: 'تسريح شعر', price: 30 },
      { name: 'حلاقة أطفال', price: 20 },
      { name: 'بخار وتنعيم لحية', price: 40 },
    ],
    available: true,
    location: { lat: 21.5636, lng: 39.2185 }

  },
  {
    name: 'جمال الشنب',
    image: jamalImg,
    rating: '5.0',
    services: [
      { name: 'ستايل فادي', price: 60 },
      { name: 'تنظيف أذن وشمع', price: 15 },
      { name: 'قص أطراف دقيقة', price: 35 },
    ],
    available: false,
    location: { lat: 21.5414, lng: 39.1620 }

  },
];

export default barbers;
