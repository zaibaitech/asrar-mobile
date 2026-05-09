export type PlanetaryZikrEntry = {
  id: string;
  name: string;
  count: string;
  benefit: string;
  note?: string;
};

export type PlanetaryZikrSection = {
  label: string;
  sectionNote?: string;
  zikr: PlanetaryZikrEntry[];
};

export const PLANETARY_ZIKR = {
  sun: {
    label: '☀️ Sun',
    zikr: [
      { id: 'yaAllah', name: 'Ya Allah', count: '66 or 594', benefit: 'General remembrance and divine connection.' },
      { id: 'yaRahman', name: 'Ya Rahman', count: '298', benefit: 'For rizq (wealth and provision).' },
      { id: 'yaRaheem', name: 'Ya Raheem', count: '258', benefit: 'For fulfilling needs and resolving difficulties.' },
      { id: 'yaMalik', name: 'Ya Malik', count: '90', benefit: 'For support and success in endeavors.' },
      { id: 'yaQuddus', name: 'Ya Quddus', count: '170', benefit: 'For purification, forgiveness, and spiritual cleansing.' },
      { id: 'yaSalam', name: 'Ya Salam', count: '122', benefit: 'For inner peace and forgiveness.' },
      { id: 'yaMumin', name: "Ya Mu'min", count: '126', benefit: 'For protection from enemies.' },
      { id: 'yaHakim', name: 'Ya Hakim', count: '78', benefit: 'For wisdom, shahada, and blessings.' },
      { id: 'yaAdl', name: "Ya 'Adl", count: '104', benefit: 'For tawfiq and avoiding sinful actions.' },
      { id: 'yaBari', name: "Ya Bari'", count: '213', benefit: 'For strength and overcoming enemies.' },
      { id: 'yaMusawwir', name: 'Ya Musawwir', count: '226', benefit: 'To stay consistent in good deeds.' },
      { id: 'yaRafi', name: "Ya Rafi'", count: '251', benefit: 'For elevation, respect, and being loved.' },
      { id: 'yaHalim', name: 'Ya Halim', count: '88', benefit: 'For calmness and patience.' },
      { id: 'yaBasir', name: 'Ya Basir', count: '302', benefit: 'For clarity and insight.' },
    ],
  },
  venus: {
    label: '♀️ Venus',
    zikr: [
      { id: 'yaGhaffar', name: 'Ya Ghaffar', count: '1281', benefit: 'Increase in blessings and goodness.' },
      { id: 'yaWahhab', name: 'Ya Wahhab', count: '14', benefit: 'For wealth and prosperity.' },
      { id: 'yaRazzaq', name: 'Ya Razzaq', count: '308', benefit: 'For sustenance and provision.' },
      { id: 'yaQabid', name: 'Ya Qabid', count: '903', benefit: 'For abundance in different forms of wealth.' },
      { id: 'yaLatif', name: 'Ya Latif', count: '129', benefit: 'For resolving difficulties and subtle ease.' },
      { id: 'yaJami', name: "Ya Jami'", count: '114', benefit: 'For fixing relationships and marriage.' },
    ],
  },
  mars: {
    label: '♂️ Mars',
    sectionNote: 'Used for protection, defense, and overcoming enemies.',
    zikr: [
      { id: 'yaKhafid', name: 'Ya Khafid', count: '1480', benefit: 'Protection from enemies and their plots.' },
      { id: 'yaMuzil', name: 'Ya Muzil', count: '770', benefit: 'To overcome and humble enemies.' },
      { id: 'yaJabbar', name: 'Ya Jabbar', count: '217', benefit: 'For strength against oppression or harm.', note: 'especially Tuesday' },
      { id: 'yaQahhar', name: 'Ya Qahhar', count: '306', benefit: 'For overpowering enemies.' },
    ],
  },
} satisfies Record<string, PlanetaryZikrSection>;

export type PlanetaryZikrKey = keyof typeof PLANETARY_ZIKR;