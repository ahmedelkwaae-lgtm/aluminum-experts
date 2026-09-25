const CATALOGUE_SYSTEMS = [
  {id:'rock-60', nameAr:'ROCK 60', nameEn:'ROCK 60', categoryAr:'شبابيك وأبواب', categoryEn:'Windows & Doors', page:2, endPage:21, tags:'window door hinged casement', introAr:'نظام ألومنيوم معماري للشبابيك والأبواب.', introEn:'Architectural aluminium system for windows and doors.'},
  {id:'sonata-45', nameAr:'SONATA 45', nameEn:'SONATA 45', categoryAr:'شبابيك وأبواب', categoryEn:'Windows & Doors', page:22, endPage:53, tags:'window door', introAr:'نظام عملي للشبابيك والأبواب المعمارية.', introEn:'Practical architectural window and door system.'},
  {id:'volta-41', nameAr:'VOLTA 41', nameEn:'VOLTA 41', categoryAr:'شبابيك وأبواب', categoryEn:'Windows & Doors', page:54, endPage:59, tags:'window door', introAr:'نظام قطاعات مخصص للتطبيقات المعمارية.', introEn:'Profile system designed for architectural applications.'},
  {id:'samba-40', nameAr:'SAMBA 40', nameEn:'SAMBA 40', categoryAr:'شبابيك وأبواب', categoryEn:'Windows & Doors', page:60, endPage:67, tags:'window door', introAr:'نظام ألومنيوم مدمج للشبابيك والأبواب.', introEn:'Compact aluminium system for windows and doors.'},
  {id:'tendu-120', nameAr:'TENDU 120 - SLIM - PLUS', nameEn:'TENDU 120 - SLIM - PLUS', categoryAr:'أبواب وشبابيك', categoryEn:'Doors & Windows', page:68, endPage:83, tags:'slim door window', introAr:'نظام بتصميم نحيف وخيارات متعددة.', introEn:'Slim-profile system with multiple configurations.'},
  {id:'jumbo-100', nameAr:'JUMBO 100', nameEn:'JUMBO 100', categoryAr:'أبواب وشبابيك', categoryEn:'Doors & Windows', page:84, endPage:105, tags:'jumbo door window', introAr:'نظام قطاعات كبير للتطبيقات عالية الأداء.', introEn:'Large-profile system for demanding applications.'},
  {id:'tempo-84', nameAr:'TEMPO 84 - SLIM', nameEn:'TEMPO 84 - SLIM', categoryAr:'شبابيك وأبواب', categoryEn:'Windows & Doors', page:106, endPage:117, tags:'slim window door', introAr:'نظام نحيف للشبابيك والأبواب.', introEn:'Slim system for windows and doors.'},
  {id:'classic-80', nameAr:'CLASSIC 80', nameEn:'CLASSIC 80', categoryAr:'شبابيك وأبواب', categoryEn:'Windows & Doors', page:118, endPage:123, tags:'classic window door', introAr:'نظام كلاسيكي للتطبيقات المعمارية.', introEn:'Classic system for architectural applications.'},
  {id:'alto-70', nameAr:'ALTO 70', nameEn:'ALTO 70', categoryAr:'شبابيك وأبواب', categoryEn:'Windows & Doors', page:124, endPage:129, tags:'window door', introAr:'نظام ألومنيوم متوسط القطاعات.', introEn:'Medium-profile aluminium system.'},
  {id:'tango-60', nameAr:'TANGO 60', nameEn:'TANGO 60', categoryAr:'شبابيك وأبواب', categoryEn:'Windows & Doors', page:130, endPage:145, tags:'window door', introAr:'نظام مرن للشبابيك والأبواب.', introEn:'Flexible system for windows and doors.'},
  {id:'nano-55', nameAr:'NANO 55', nameEn:'NANO 55', categoryAr:'شبابيك وأبواب', categoryEn:'Windows & Doors', page:146, endPage:151, tags:'window door compact', introAr:'نظام مدمج للمشروعات السكنية والتجارية.', introEn:'Compact system for residential and commercial projects.'},
  {id:'panorama-62', nameAr:'PANORAMA 62', nameEn:'PANORAMA 62', categoryAr:'واجهات وشبابيك', categoryEn:'Facades & Windows', page:152, endPage:165, tags:'panorama facade window', introAr:'نظام بانورامي للمساحات ذات الإطلالات الواسعة.', introEn:'Panoramic system for wide-view spaces.'},
  {id:'panorama-52', nameAr:'PANORAMA 52', nameEn:'PANORAMA 52', categoryAr:'واجهات وشبابيك', categoryEn:'Facades & Windows', page:166, endPage:203, tags:'panorama facade window', introAr:'حل بانورامي مرن للواجهات والفتحات الكبيرة.', introEn:'Flexible panoramic solution for facades and large openings.'},
  {id:'kito-20', nameAr:'KITO 20', nameEn:'KITO 20', categoryAr:'أبواب وأنظمة داخلية', categoryEn:'Doors & Interior Systems', page:204, endPage:209, tags:'door interior', introAr:'نظام للأبواب والتطبيقات الداخلية.', introEn:'System for doors and interior applications.'},
  {id:'acacia-50', nameAr:'ACACIA 50', nameEn:'ACACIA 50', categoryAr:'شبابيك', categoryEn:'Windows', page:210, endPage:215, tags:'acacia window', introAr:'نظام شبابيك ألومنيوم ACACIA 50.', introEn:'ACACIA 50 aluminium window system.'},
  {id:'common-profiles', nameAr:'COMMON PROFILES', nameEn:'COMMON PROFILES', categoryAr:'قطاعات مشتركة', categoryEn:'Common Profiles', page:216, endPage:223, tags:'profiles accessories', introAr:'قطاعات مشتركة وإكسسوارات داعمة للأنظمة.', introEn:'Common profiles and supporting accessories.'},
  {id:'acacia-42', nameAr:'ACACIA 42', nameEn:'ACACIA 42', categoryAr:'شبابيك', categoryEn:'Windows', page:224, endPage:235, tags:'acacia window', introAr:'نظام شبابيك ألومنيوم ACACIA 42.', introEn:'ACACIA 42 aluminium window system.'},
  {id:'ramak-88', nameAr:'RAMAK 88', nameEn:'RAMAK 88', categoryAr:'أبواب وشبابيك', categoryEn:'Doors & Windows', page:236, endPage:239, tags:'door window', introAr:'نظام قطاعات للأبواب والشبابيك.', introEn:'Profile system for doors and windows.'},
  {id:'expo-44', nameAr:'EXPO 44', nameEn:'EXPO 44', categoryAr:'واجهات وأنظمة عرض', categoryEn:'Facades & Display Systems', page:240, endPage:274, tags:'facade display', introAr:'نظام للتطبيقات المعمارية وأنظمة العرض.', introEn:'System for architectural and display applications.'}
];

const CATALOGUE_META = {
  pdf: 'GCatalogue_2027.pdf',
  profileIndexStart: 10,
  profileIndexEnd: 31,
  totalPages: 275,
  polyfilmAvailable: false
};
