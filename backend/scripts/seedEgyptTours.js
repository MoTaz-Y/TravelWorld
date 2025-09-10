// import fetch from 'node-fetch'; // Remove this line - using built-in fetch

const API_BASE = 'http://localhost:3000/api/dashboard';

// رحلات مصر الشهيرة مع صور من Unsplash
const egyptTours = [
  {
    title: 'رحلة إلى الأهرامات والمتحف المصري',
    city: 'القاهرة',
    address: 'الجيزة، مصر',
    distance: 15,
    desc: 'استكشف عجائب الدنيا السبع، الأهرامات والمتحف المصري الذي يحتوي على ملايين القطع الأثرية',
    price: 85,
    maxGroupSize: 25,
    featured: true,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0b7ef?w=800&h=600&fit=crop',
        public_id: 'egypt/pyramids_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        public_id: 'egypt/pyramids_2',
      },
    ],
  },
  {
    title: 'رحلة إلى معبد الكرنك والأقصر',
    city: 'الأقصر',
    address: 'الأقصر، مصر',
    distance: 25,
    desc: 'زور معبد الكرنك الأكبر في العالم والمعابد الفرعونية في وادي الملوك',
    price: 120,
    maxGroupSize: 20,
    featured: true,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        public_id: 'egypt/luxor_1',
      },
    ],
  },
  {
    title: 'رحلة إلى أسوان ومعبد أبو سمبل',
    city: 'أسوان',
    address: 'أسوان، مصر',
    distance: 30,
    desc: 'استمتع بالمناظر الطبيعية الخلابة ومعبد أبو سمبل الشهير',
    price: 150,
    maxGroupSize: 18,
    featured: false,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        public_id: 'egypt/aswan_1',
      },
    ],
  },
  {
    title: 'رحلة إلى الإسكندرية التاريخية',
    city: 'الإسكندرية',
    address: 'الإسكندرية، مصر',
    distance: 35,
    desc: 'اكتشف تاريخ الإسكندرية العريق مع مكتبة الإسكندرية وقلعة قايتباي',
    price: 95,
    maxGroupSize: 22,
    featured: false,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
        public_id: 'egypt/alexandria_1',
      },
    ],
  },
  {
    title: 'رحلة إلى شرم الشيخ والغوص',
    city: 'شرم الشيخ',
    address: 'جنوب سيناء، مصر',
    distance: 45,
    desc: 'استمتع بالغوص في البحر الأحمر واكتشف الحياة البحرية الغنية',
    price: 200,
    maxGroupSize: 15,
    featured: true,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop',
        public_id: 'egypt/sharm_1',
      },
    ],
  },
  {
    title: 'رحلة إلى دهب والساحل الجنوبي',
    city: 'دهب',
    address: 'جنوب سيناء، مصر',
    distance: 50,
    desc: 'مدينة الغوص الأولى في العالم مع شواطئ رائعة وأنشطة مائية متنوعة',
    price: 180,
    maxGroupSize: 16,
    featured: false,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        public_id: 'egypt/dahab_1',
      },
    ],
  },
  {
    title: 'رحلة إلى مرسى علم والسفاري',
    city: 'مرسى علم',
    address: 'البحر الأحمر، مصر',
    distance: 55,
    desc: 'أفضل موقع للغوص في العالم مع رحلات السفاري في الصحراء',
    price: 220,
    maxGroupSize: 14,
    featured: false,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        public_id: 'egypt/marsa_alam_1',
      },
    ],
  },
  {
    title: 'رحلة إلى الغردقة والجزر',
    city: 'الغردقة',
    address: 'البحر الأحمر، مصر',
    distance: 60,
    desc: 'عاصمة البحر الأحمر مع جزرها الرائعة ومتنزهاتها الطبيعية',
    price: 190,
    maxGroupSize: 20,
    featured: false,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop',
        public_id: 'egypt/hurghada_1',
      },
    ],
  },
  {
    title: 'رحلة إلى الساحل الشمالي',
    city: 'مطروح',
    address: 'الساحل الشمالي، مصر',
    distance: 40,
    desc: 'شواطئ رملية ذهبية ومياه زرقاء نقية مع أنشطة مائية متنوعة',
    price: 160,
    maxGroupSize: 25,
    featured: false,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        public_id: 'egypt/north_coast_1',
      },
    ],
  },
  {
    title: 'رحلة إلى واحة سيوة',
    city: 'سيوة',
    address: 'الواحات، مصر',
    distance: 70,
    desc: 'واحة سيوة التاريخية مع حمامات المياه الكبريتية والقلعة القديمة',
    price: 140,
    maxGroupSize: 12,
    featured: true,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        public_id: 'egypt/siwa_1',
      },
    ],
  },
  {
    title: 'رحلة إلى الجونة والعين السخنة',
    city: 'الجونة',
    address: 'البحر الأحمر، مصر',
    distance: 65,
    desc: 'مدينة الجونة الفاخرة مع شواطئها الخاصة ومنتجعاتها العالمية',
    price: 250,
    maxGroupSize: 18,
    featured: false,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        public_id: 'egypt/el_gouna_1',
      },
    ],
  },
  {
    title: 'رحلة إلى طابا الحدودية',
    city: 'طابا',
    address: 'جنوب سيناء، مصر',
    distance: 75,
    desc: 'منتجع طابا على الحدود مع الأردن مع شواطئ خلابة وأنشطة مائية',
    price: 175,
    maxGroupSize: 20,
    featured: false,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        public_id: 'egypt/taba_1',
      },
    ],
  },
  {
    title: 'رحلة إلى نويبع والعقبة',
    city: 'نويبع',
    address: 'جنوب سيناء، مصر',
    distance: 80,
    desc: 'مدينة نويبع مع شواطئها الرائعة وقربها من مدينة العقبة الأردنية',
    price: 165,
    maxGroupSize: 16,
    featured: false,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        public_id: 'egypt/nuweiba_1',
      },
    ],
  },
  {
    title: 'رحلة إلى الفيوم والواحات',
    city: 'الفيوم',
    address: 'الفيوم، مصر',
    distance: 20,
    desc: 'واحة الفيوم الخضراء مع بحيرتها الشهيرة وأهراماتها القديمة',
    price: 110,
    maxGroupSize: 22,
    featured: false,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0b7ef?w=800&h=600&fit=crop',
        public_id: 'egypt/fayoum_1',
      },
    ],
  },
  {
    title: 'رحلة إلى دمياط والدلتا',
    city: 'دمياط',
    address: 'الدلتا، مصر',
    distance: 25,
    desc: 'مدينة دمياط التاريخية مع مينائها القديم وقلعتها الإسلامية',
    price: 90,
    maxGroupSize: 24,
    featured: false,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
        public_id: 'egypt/damietta_1',
      },
    ],
  },
];

async function seedEgyptTours() {
  console.log('🚀 بدء إضافة رحلات مصر...');

  for (let i = 0; i < egyptTours.length; i++) {
    const tour = egyptTours[i];

    try {
      console.log(`📝 إضافة الرحلة ${i + 1}: ${tour.title}`);

      const response = await fetch(`${API_BASE}/tours/seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tour),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`✅ تم إضافة الرحلة: ${tour.title}`);
      } else {
        console.log(`❌ فشل في إضافة الرحلة: ${tour.title}`);
        console.log('الخطأ:', result.message);
        console.log('Status:', response.status);
      }

      // انتظار قليل بين كل رحلة لتجنب الضغط على السيرفر
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`❌ خطأ في إضافة الرحلة: ${tour.title}`);
      console.log('الخطأ:', error.message);
    }
  }

  console.log('🎉 انتهى من إضافة جميع الرحلات!');
}

// تشغيل الدالة
seedEgyptTours().catch(console.error);
