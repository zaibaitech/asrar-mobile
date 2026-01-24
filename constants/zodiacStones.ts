/**
 * Zodiac Stones & Crystals Data
 * Complete dataset for all 12 zodiac signs with beneficial stones
 * Includes translations in English, French, and Arabic
 */

export interface ZodiacStone {
  name: string;
  nameAr: string;
  nameFr: string;
}

export interface ZodiacData {
  remainder: number;
  zodiacSign: string;
  zodiacSignAr: string;
  zodiacSignFr: string;
  symbol: string;
  dateRange: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };
  dateRangeFr: string;
  dateRangeAr: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  elementAr: string;
  elementFr: string;
  planet: string;
  planetAr: string;
  planetFr: string;
  stones: ZodiacStone[];
}

export const ZODIAC_COMPLETE_DATA: Record<number, ZodiacData> = {
  1: {
    // Aries - Bélier - الحمل
    remainder: 1,
    zodiacSign: "Aries",
    zodiacSignAr: "الحمل",
    zodiacSignFr: "Bélier",
    symbol: "♈",
    dateRange: {
      start: { month: 3, day: 21 },
      end: { month: 4, day: 20 }
    },
    dateRangeFr: "du 21 mars au 20 avril",
    dateRangeAr: "من 21 مارس إلى 20 أبريل",
    
    element: "fire",
    elementAr: "ناري",
    elementFr: "Feu",
    
    planet: "Mars",
    planetAr: "مريخ",
    planetFr: "Mars",
    
    stones: [
      { name: "Amethyst", nameAr: "جمشت", nameFr: "Améthyste" },
      { name: "Citrine", nameAr: "سترين", nameFr: "Citrine" },
      { name: "Carnelian", nameAr: "عقيق أحمر", nameFr: "Cornaline" },
      { name: "Rock Crystal", nameAr: "كريستال صخري", nameFr: "Cristal de roche" },
      { name: "Herkimer Diamond", nameAr: "ألماس هيركيمر", nameFr: "Diamant de herkimer" },
      { name: "Dolomite", nameAr: "دولوميت", nameFr: "Dolomite" },
      { name: "Hematite", nameAr: "هيماتيت", nameFr: "Hématite" },
      { name: "Garnet", nameAr: "عقيق", nameFr: "Grenat" },
      { name: "Red Jasper", nameAr: "يشب أحمر", nameFr: "Jaspe rouge" },
      { name: "Bloodstone", nameAr: "حجر الدم", nameFr: "Jaspe sanguin" }
    ]
  },

  2: {
    // Taurus - Taureau - الثور
    remainder: 2,
    zodiacSign: "Taurus",
    zodiacSignAr: "الثور",
    zodiacSignFr: "Taureau",
    symbol: "♉",
    dateRange: {
      start: { month: 4, day: 21 },
      end: { month: 5, day: 21 }
    },
    dateRangeFr: "du 21 avril au 21 mai",
    dateRangeAr: "من 21 أبريل إلى 21 مايو",
    
    element: "earth",
    elementAr: "تراب",
    elementFr: "Terre",
    
    planet: "Venus",
    planetAr: "زهرة",
    planetFr: "Vénus",
    
    stones: [
      { name: "Agate", nameAr: "عقيق", nameFr: "Agate" },
      { name: "Moss Agate", nameAr: "عقيق طحلبي", nameFr: "Agate mousse" },
      { name: "Aventurine", nameAr: "أفينتورين", nameFr: "Aventurine" },
      { name: "Chrysocolla", nameAr: "كريزوكولا", nameFr: "Chrysocolle" },
      { name: "Citrine", nameAr: "سترين", nameFr: "Citrine" },
      { name: "Coral", nameAr: "مرجان", nameFr: "Corail" },
      { name: "Emerald", nameAr: "زمرد", nameFr: "Émeraude" },
      { name: "Lapis Lazuli", nameAr: "لازورد", nameFr: "Lapis-lazuli" },
      { name: "Malachite", nameAr: "ملاكيت", nameFr: "Malachite" },
      { name: "Bull's Eye", nameAr: "عين الثور", nameFr: "Oeil de taureau" },
      { name: "Rose Quartz", nameAr: "كوارتز وردي", nameFr: "Quartz rose" }
    ]
  },

  3: {
    // Gemini - Gémeaux - الجوزاء
    remainder: 3,
    zodiacSign: "Gemini",
    zodiacSignAr: "الجوزاء",
    zodiacSignFr: "Gémeaux",
    symbol: "♊",
    dateRange: {
      start: { month: 5, day: 22 },
      end: { month: 6, day: 21 }
    },
    dateRangeFr: "du 22 mai au 21 juin",
    dateRangeAr: "من 22 مايو إلى 21 يونيو",
    
    element: "air",
    elementAr: "هوائي",
    elementFr: "Air",
    
    planet: "Mercury",
    planetAr: "عطارد",
    planetFr: "Mercure",
    
    stones: [
      { name: "Moss Agate", nameAr: "عقيق طحلبي", nameFr: "Agate mousse" },
      { name: "Aquamarine", nameAr: "زبرجد", nameFr: "Aigue marine" },
      { name: "Amber", nameAr: "كهرمان", nameFr: "Ambre" },
      { name: "Blue Chalcedony", nameAr: "عقيق أزرق", nameFr: "Calcédoine bleue" },
      { name: "Yellow Chalcedony", nameAr: "عقيق أصفر", nameFr: "Calcédoine jaune" },
      { name: "Citrine", nameAr: "سترين", nameFr: "Citrine" },
      { name: "Rock Crystal", nameAr: "كريستال صخري", nameFr: "Cristal de roche" },
      { name: "Howlite", nameAr: "هاوليت", nameFr: "Howlite" },
      { name: "Lepidolite", nameAr: "ليبيدوليت", nameFr: "Lépidolite" },
      { name: "Tiger's Eye", nameAr: "عين النمر", nameFr: "Oeil de tigre" },
      { name: "Pyrite", nameAr: "بيريت", nameFr: "Pyrite" }
    ]
  },

  4: {
    // Cancer - السرطان
    remainder: 4,
    zodiacSign: "Cancer",
    zodiacSignAr: "السرطان",
    zodiacSignFr: "Cancer",
    symbol: "♋",
    dateRange: {
      start: { month: 6, day: 22 },
      end: { month: 7, day: 23 }
    },
    dateRangeFr: "du 22 juin au 23 juillet",
    dateRangeAr: "من 22 يونيو إلى 23 يوليو",
    
    element: "water",
    elementAr: "مائي",
    elementFr: "Eau",
    
    planet: "Moon",
    planetAr: "قمر",
    planetFr: "Lune",
    
    stones: [
      { name: "Aventurine", nameAr: "أفينتورين", nameFr: "Aventurine" },
      { name: "White Calcite", nameAr: "كالسيت أبيض", nameFr: "Calcédoine blanche" },
      { name: "Coral", nameAr: "مرجان", nameFr: "Corail" },
      { name: "Emerald", nameAr: "زمرد", nameFr: "Émeraude" },
      { name: "Jade", nameAr: "يشم", nameFr: "Jade" },
      { name: "Labradorite", nameAr: "لابرادوريت", nameFr: "Labradorite" },
      { name: "Moonstone", nameAr: "حجر القمر", nameFr: "Pierre de lune" },
      { name: "Pearl", nameAr: "لؤلؤ", nameFr: "Perle" },
      { name: "Opal", nameAr: "أوبال", nameFr: "Opale" },
      { name: "Rose Quartz", nameAr: "كوارتز وردي", nameFr: "Quartz rose" }
    ]
  },

  5: {
    // Leo - Lion - الأسد
    remainder: 5,
    zodiacSign: "Leo",
    zodiacSignAr: "الأسد",
    zodiacSignFr: "Lion",
    symbol: "♌",
    dateRange: {
      start: { month: 7, day: 24 },
      end: { month: 8, day: 23 }
    },
    dateRangeFr: "du 24 juillet au 23 août",
    dateRangeAr: "من 24 يوليو إلى 23 أغسطس",
    
    element: "fire",
    elementAr: "ناري",
    elementFr: "Feu",
    
    planet: "Sun",
    planetAr: "شمس",
    planetFr: "Soleil",
    
    stones: [
      { name: "Amber", nameAr: "كهرمان", nameFr: "Ambre" },
      { name: "Optical Calcite", nameAr: "كالسيت بصري", nameFr: "Calcite optique" },
      { name: "Citrine", nameAr: "سترين", nameFr: "Citrine" },
      { name: "Rock Crystal", nameAr: "كريستال صخري", nameFr: "Cristal de roche" },
      { name: "Herkimer Diamond", nameAr: "ألماس هيركيمر", nameFr: "Diamant herkimer" },
      { name: "Garnet", nameAr: "عقيق", nameFr: "Grenat" },
      { name: "Yellow Labradorite", nameAr: "لابرادوريت أصفر", nameFr: "Labradorite jaune" },
      { name: "Tiger's Eye", nameAr: "عين النمر", nameFr: "Oeil de tigre" },
      { name: "Olivine (Peridot)", nameAr: "زبرجد زيتوني", nameFr: "Olivine (ou Péridot)" },
      { name: "Rutilated Quartz", nameAr: "كوارتز روتيلي", nameFr: "Quartz rutile" }
    ]
  },

  6: {
    // Virgo - Vierge - العذراء
    remainder: 6,
    zodiacSign: "Virgo",
    zodiacSignAr: "العذراء",
    zodiacSignFr: "Vierge",
    symbol: "♍",
    dateRange: {
      start: { month: 8, day: 24 },
      end: { month: 9, day: 23 }
    },
    dateRangeFr: "du 24 août au 23 septembre",
    dateRangeAr: "من 24 أغسطس إلى 23 سبتمبر",
    
    element: "earth",
    elementAr: "تراب",
    elementFr: "Terre",
    
    planet: "Mercury",
    planetAr: "عطارد",
    planetFr: "Mercure",
    
    stones: [
      { name: "Amber", nameAr: "كهرمان", nameFr: "Ambre" },
      { name: "Amethyst", nameAr: "جمشت", nameFr: "Améthyste" },
      { name: "Celestite", nameAr: "سيليستيت", nameFr: "Célestite" },
      { name: "Citrine", nameAr: "سترين", nameFr: "Citrine" },
      { name: "Carnelian", nameAr: "عقيق أحمر", nameFr: "Cornaline" },
      { name: "Yellow Carnelian", nameAr: "عقيق أصفر", nameFr: "Cornaline jaune" },
      { name: "Jasper", nameAr: "يشب", nameFr: "Jaspe" },
      { name: "Lapis Lazuli", nameAr: "لازورد", nameFr: "Lapis-lazuli" },
      { name: "Tiger's Eye", nameAr: "عين النمر", nameFr: "Oeil de tigre" },
      { name: "Sapphire", nameAr: "ياقوت أزرق", nameFr: "Saphir" },
      { name: "Sodalite", nameAr: "سودليت", nameFr: "Sodalite" },
      { name: "Turquoise", nameAr: "فيروز", nameFr: "Turquoise" }
    ]
  },

  7: {
    // Libra - Balance - الميزان
    remainder: 7,
    zodiacSign: "Libra",
    zodiacSignAr: "الميزان",
    zodiacSignFr: "Balance",
    symbol: "♎",
    dateRange: {
      start: { month: 9, day: 24 },
      end: { month: 10, day: 23 }
    },
    dateRangeFr: "du 24 septembre au 23 octobre",
    dateRangeAr: "من 24 سبتمبر إلى 23 أكتوبر",
    
    element: "air",
    elementAr: "هوائي",
    elementFr: "Air",
    
    planet: "Venus",
    planetAr: "زهرة",
    planetFr: "Vénus",
    
    stones: [
      { name: "Aquamarine", nameAr: "زبرجد", nameFr: "Aigue marine" },
      { name: "Chrysocolla", nameAr: "كريزوكولا", nameFr: "Chrysocolle" },
      { name: "Chrysoprase", nameAr: "كريزوبراز", nameFr: "Chrysoprase" },
      { name: "Jade", nameAr: "يشم", nameFr: "Jade" },
      { name: "Jasper", nameAr: "يشب", nameFr: "Jaspe" },
      { name: "Kunzite", nameAr: "كونزيت", nameFr: "Kunsite" },
      { name: "Opal", nameAr: "أوبال", nameFr: "Opale" },
      { name: "Pearl", nameAr: "لؤلؤ", nameFr: "Perle" },
      { name: "Smoky Quartz", nameAr: "كوارتز دخاني", nameFr: "Quartz fumé" },
      { name: "Rose Quartz", nameAr: "كوارتز وردي", nameFr: "Quartz rose" },
      { name: "Rubellite", nameAr: "روبليت", nameFr: "Rubellite" },
      { name: "Golden Topaz", nameAr: "توباز ذهبي", nameFr: "Topaze dorée" }
    ]
  },

  8: {
    // Scorpio - Scorpion - العقرب
    remainder: 8,
    zodiacSign: "Scorpio",
    zodiacSignAr: "العقرب",
    zodiacSignFr: "Scorpion",
    symbol: "♏",
    dateRange: {
      start: { month: 10, day: 24 },
      end: { month: 11, day: 22 }
    },
    dateRangeFr: "du 24 octobre au 22 novembre",
    dateRangeAr: "من 24 أكتوبر إلى 22 نوفمبر",
    
    element: "water",
    elementAr: "مائي",
    elementFr: "Eau",
    
    planet: "Mars",
    planetAr: "مريخ",
    planetFr: "Mars",
    
    stones: [
      { name: "Agate", nameAr: "عقيق", nameFr: "Agate" },
      { name: "Amethyst", nameAr: "جمشت", nameFr: "Améthyste" },
      { name: "Carnelian", nameAr: "عقيق أحمر", nameFr: "Cornaline" },
      { name: "Garnet", nameAr: "عقيق", nameFr: "Grenat" },
      { name: "Hematite", nameAr: "هيماتيت", nameFr: "Hématite" },
      { name: "Red Jasper", nameAr: "يشب أحمر", nameFr: "Jaspe rouge" },
      { name: "Bloodstone", nameAr: "حجر الدم", nameFr: "Jaspe sanguin" },
      { name: "Malachite", nameAr: "ملاكيت", nameFr: "Malachite" },
      { name: "Obsidian", nameAr: "سبج", nameFr: "Obsidienne" },
      { name: "Milky Quartz", nameAr: "كوارتز حليبي", nameFr: "Quartz laiteux" },
      { name: "Ruby", nameAr: "ياقوت أحمر", nameFr: "Rubis" }
    ]
  },

  9: {
    // Sagittarius - Sagittaire - القوس
    remainder: 9,
    zodiacSign: "Sagittarius",
    zodiacSignAr: "القوس",
    zodiacSignFr: "Sagittaire",
    symbol: "♐",
    dateRange: {
      start: { month: 11, day: 23 },
      end: { month: 12, day: 21 }
    },
    dateRangeFr: "du 23 novembre au 21 décembre",
    dateRangeAr: "من 23 نوفمبر إلى 21 ديسمبر",
    
    element: "fire",
    elementAr: "ناري",
    elementFr: "Feu",
    
    planet: "Jupiter",
    planetAr: "المشتري",
    planetFr: "Jupiter",
    
    stones: [
      { name: "Amazonite", nameAr: "أمازونيت", nameFr: "Amazonite" },
      { name: "Amethyst", nameAr: "جمشت", nameFr: "Améthyste" },
      { name: "Aventurine", nameAr: "أفينتورين", nameFr: "Aventurine" },
      { name: "Chalcedony", nameAr: "عقيق", nameFr: "Calcédoine" },
      { name: "Chrysocolla", nameAr: "كريزوكولا", nameFr: "Chrysocolle" },
      { name: "Lapis Lazuli", nameAr: "لازورد", nameFr: "Lapis-lazuli" },
      { name: "Obsidian", nameAr: "سبج", nameFr: "Obsidienne" },
      { name: "Opal", nameAr: "أوبال", nameFr: "Opale" },
      { name: "Sapphire", nameAr: "ياقوت أزرق", nameFr: "Saphir" },
      { name: "Sodalite", nameAr: "سودليت", nameFr: "Sodalite" },
      { name: "Blue Topaz", nameAr: "توباز أزرق", nameFr: "Topaze bleue" }
    ]
  },

  10: {
    // Capricorn - Capricorne - الجدي
    remainder: 10,
    zodiacSign: "Capricorn",
    zodiacSignAr: "الجدي",
    zodiacSignFr: "Capricorne",
    symbol: "♑",
    dateRange: {
      start: { month: 12, day: 22 },
      end: { month: 1, day: 20 }
    },
    dateRangeFr: "du 22 décembre au 20 janvier",
    dateRangeAr: "من 22 ديسمبر إلى 20 يناير",
    
    element: "earth",
    elementAr: "تراب",
    elementFr: "Terre",
    
    planet: "Saturn",
    planetAr: "زحل",
    planetFr: "Saturne",
    
    stones: [
      { name: "White Chalcedony", nameAr: "عقيق أبيض", nameFr: "Calcédoine blanche" },
      { name: "Rock Crystal", nameAr: "كريستال صخري", nameFr: "Cristal de roche" },
      { name: "Cyanite", nameAr: "سيانيت", nameFr: "Cyanite" },
      { name: "Herkimer Diamond", nameAr: "ألماس هيركيمر", nameFr: "Diamant herkimer" },
      { name: "Jade", nameAr: "يشم", nameFr: "Jade" },
      { name: "Jasper", nameAr: "يشب", nameFr: "Jaspe" },
      { name: "Obsidian", nameAr: "سبج", nameFr: "Obsidienne" },
      { name: "Moonstone", nameAr: "حجر القمر", nameFr: "Pierre de lune" },
      { name: "Smoky Quartz", nameAr: "كوارتز دخاني", nameFr: "Quartz fumé" }
    ]
  },

  11: {
    // Aquarius - Verseau - الدلو
    remainder: 11,
    zodiacSign: "Aquarius",
    zodiacSignAr: "الدلو",
    zodiacSignFr: "Verseau",
    symbol: "♒",
    dateRange: {
      start: { month: 1, day: 21 },
      end: { month: 2, day: 19 }
    },
    dateRangeFr: "du 21 janvier au 19 février",
    dateRangeAr: "من 21 يناير إلى 19 فبراير",
    
    element: "air",
    elementAr: "هوائي",
    elementFr: "Air",
    
    planet: "Saturn",
    planetAr: "زحل",
    planetFr: "Saturne",
    
    stones: [
      { name: "Fossil Agate", nameAr: "عقيق متحجر", nameFr: "Agate fossile" },
      { name: "Aquamarine", nameAr: "زبرجد", nameFr: "Aigue marine" },
      { name: "Chrysocolla", nameAr: "كريزوكولا", nameFr: "Chrysocolle" },
      { name: "Clear Blue Fluorite", nameAr: "فلورايت أزرق فاتح", nameFr: "Fluorite bleue claire" },
      { name: "Leopard Jasper", nameAr: "يشب نمري", nameFr: "Jaspe léopard" },
      { name: "Landscape Jasper", nameAr: "يشب منظري", nameFr: "Jaspe paysage" },
      { name: "Morganite", nameAr: "مورجانيت", nameFr: "Morganite" },
      { name: "Hawk's Eye", nameAr: "عين الصقر", nameFr: "Oeil de faucon" },
      { name: "Opal", nameAr: "أوبال", nameFr: "Opale" }
    ]
  },

  12: {
    // Pisces - Poissons - الحوت
    remainder: 12,
    zodiacSign: "Pisces",
    zodiacSignAr: "الحوت",
    zodiacSignFr: "Poissons",
    symbol: "♓",
    dateRange: {
      start: { month: 2, day: 20 },
      end: { month: 3, day: 20 }
    },
    dateRangeFr: "du 20 février au 20 mars",
    dateRangeAr: "من 20 فبراير إلى 20 مارس",
    
    element: "water",
    elementAr: "مائي",
    elementFr: "Eau",
    
    planet: "Jupiter",
    planetAr: "المشتري",
    planetFr: "Jupiter",
    
    stones: [
      { name: "Aquamarine", nameAr: "زبرجد", nameFr: "Aigue marine" },
      { name: "Amethyst", nameAr: "جمشت", nameFr: "Améthyste" },
      { name: "Coral", nameAr: "مرجان", nameFr: "Corail" },
      { name: "Violet Fluorite", nameAr: "فلورايت بنفسجي", nameFr: "Fluorite violette" },
      { name: "Jade", nameAr: "يشم", nameFr: "Jade" },
      { name: "Kunzite", nameAr: "كونزيت", nameFr: "Kunsite" },
      { name: "Labradorite", nameAr: "لابرادوريت", nameFr: "Labradorite" },
      { name: "Pearl", nameAr: "لؤلؤ", nameFr: "Perle" },
      { name: "Moonstone", nameAr: "حجر القمر", nameFr: "Pierre de lune" },
      { name: "Sapphire", nameAr: "ياقوت أزرق", nameFr: "Saphir" },
      { name: "Turquoise", nameAr: "فيروز", nameFr: "Turquoise" }
    ]
  }
};

/**
 * Get element gradient colors for UI theming
 */
export const getElementGradient = (
  element: 'fire' | 'earth' | 'air' | 'water'
): readonly [string, string] => {
  const gradients: Record<typeof element, readonly [string, string]> = {
    fire: ['#FF6B6B', '#FF8E53'],
    earth: ['#8B7355', '#A0826D'],
    air: ['#74B9FF', '#A29BFE'],
    water: ['#00B894', '#00CEC9']
  };

  return gradients[element];
};

/**
 * Get element emoji icon
 */
export const getElementEmoji = (element: 'fire' | 'earth' | 'air' | 'water'): string => {
  const emojis = {
    fire: '🔥',
    earth: '🌍',
    air: '🌪️',
    water: '💧'
  };
  return emojis[element];
};

/**
 * Get planet emoji icon
 */
export const getPlanetEmoji = (planet: string): string => {
  const emojis: Record<string, string> = {
    'Sun': '☀️',
    'Moon': '🌙',
    'Mercury': '☿️',
    'Venus': '♀️',
    'Mars': '♂️',
    'Jupiter': '♃',
    'Saturn': '♄'
  };
  return emojis[planet] || '⭐';
};
