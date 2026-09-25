// design2027-en.js - Full English projection of the 2027 design catalog
const DESIGN2027_DATA_EN = (typeof DESIGN2027_DATA !== 'undefined' ? DESIGN2027_DATA : []).map(item => {
  const titles = {
    kitchens: 'Modern Aluminium Kitchen - 2027 Design',
    facades: 'Glass Architectural Facade - 2027 Design',
    windows: 'Modern Aluminium Window System - 2027 Design',
    doors: 'Modern Aluminium Door - 2027 Design',
    curtain_wall: 'Security Glass Facade - 2027 Design',
    shower: 'Modern Shower Cabin - 2027 Design',
    screens: 'Aluminium Screens & Blinds - 2027 Design',
    cladding: 'Aluminium Cladding - 2027 Design',
    pergola: 'Outdoor Aluminium Pergola - 2027 Design',
    railings: 'Aluminium Railings - 2027 Design',
    sections: 'Aluminium Profiles & Accessories - 2027 Design'
  };
  const descriptions = {
    kitchens: 'Contemporary aluminium kitchen design with modern colors and finishes from the 2027 catalog.',
    facades: 'Contemporary glass and aluminium facade design from the 2027 catalog.',
    windows: 'Modern aluminium window system from the 2027 design catalog.',
    doors: 'Modern aluminium door design with a premium finish from the 2027 catalog.',
    curtain_wall: 'Tempered security glass facade system from the 2027 catalog.',
    shower: 'Modern shower cabin with tempered glass from the 2027 catalog.',
    screens: 'Modern aluminium screens and blinds system from the 2027 catalog.',
    cladding: 'Modern aluminium cladding panels with durable finishes from the 2027 catalog.',
    pergola: 'Modern outdoor aluminium pergola for gardens and terraces from the 2027 catalog.',
    railings: 'Modern aluminium railing system from the 2027 catalog.',
    sections: 'Advanced architectural aluminium profiles and accessories from the 2027 catalog.'
  };
  return { ...item, title: titles[item.category] || 'Architectural Aluminium Design - 2027 Catalog', desc: descriptions[item.category] || 'Architectural aluminium design from the 2027 catalog.' };
});

