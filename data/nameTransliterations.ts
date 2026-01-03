/**
 * Global Muslim Name Transliterations Database
 * Comprehensive mapping between Latin and Arabic script names
 * Covers: Middle East, South Asia, North Africa, West Africa, Turkey, Persia, Southeast Asia
 * Each variation has its own entry for clearer matching
 * Arabic names include proper tashkeel for accurate Ilm Huruf calculations
 */

export interface NameTransliteration {
  arabic: string;
  latin: string;
}

export interface NameMatch {
  arabic: string;
  /** The specific variation that matched the user's input */
  matchedVariation: string;
  /** Whether this was an exact match */
  isExactMatch: boolean;
  /** Whether this starts with the query */
  isStartsWith: boolean;
}

export const nameTransliterations: NameTransliteration[] = [
  // ==========================================
  // MIDDLE EAST & ARAB WORLD (Most Common)
  // ==========================================
  
  // Muhammad (Most common Muslim name - multiple variations)
  {"arabic": "مُحَمَّد", "latin": "muhammad"},
  {"arabic": "مُحَمَّد", "latin": "mohamed"},
  {"arabic": "مُحَمَّد", "latin": "mohammed"},
  {"arabic": "مُحَمَّد", "latin": "mohammad"},
  {"arabic": "مُحَمَّد", "latin": "muhammed"},
  {"arabic": "مُحَمَّد", "latin": "mohamad"},
  {"arabic": "محمد", "latin": "muhammadu"},
  {"arabic": "محمد", "latin": "muhammadou"},
  
  // Ahmad/Ahmed
  {"arabic": "أَحْمَد", "latin": "ahmed"},
  {"arabic": "أَحْمَد", "latin": "ahmad"},
  {"arabic": "أَحْمَد", "latin": "ahmet"},
  
  // Ali
  {"arabic": "عَلِي", "latin": "ali"},
  {"arabic": "عَلِي", "latin": "alee"},
  
  // Hassan/Hussein
  {"arabic": "حَسَن", "latin": "hassan"},
  {"arabic": "حَسَن", "latin": "hasan"},
  {"arabic": "حُسَيْن", "latin": "hussein"},
  {"arabic": "حُسَيْن", "latin": "husain"},
  {"arabic": "حُسَيْن", "latin": "husayn"},
  
  // Omar/Umar
  {"arabic": "عُمَر", "latin": "omar"},
  {"arabic": "عُمَر", "latin": "umar"},
  {"arabic": "أُمَر", "latin": "omer"},
  
  // Ibrahim
  {"arabic": "إِبْرَاهِيم", "latin": "ibrahim"},
  {"arabic": "إِبْرَاهِيم", "latin": "ibraheem"},
  {"arabic": "إبراهيم", "latin": "ibrahima"},
  {"arabic": "إبراهيم", "latin": "ebrahima"},
  {"arabic": "ابرام", "latin": "ibrama"},
  
  // Yusuf/Joseph
  {"arabic": "يُوسُف", "latin": "youssef"},
  {"arabic": "يُوسُف", "latin": "yusuf"},
  {"arabic": "يُوسُف", "latin": "yousef"},
  {"arabic": "يُوسُف", "latin": "yusif"},
  {"arabic": "يُوسُف", "latin": "josef"},
  
  // Abdullah
  {"arabic": "عَبْد الله", "latin": "abdullah"},
  {"arabic": "عَبْد الله", "latin": "abdallah"},
  {"arabic": "عَبْد الله", "latin": "abdalla"},
  {"arabic": "عبد الله", "latin": "abdalah"},
  {"arabic": "عبد الله", "latin": "abdala"},
  {"arabic": "عبد الله", "latin": "abdoulie"},
  {"arabic": "ابدالله", "latin": "abdalah"},
  {"arabic": "ابدالله", "latin": "abdala"},
  {"arabic": "ابدالله", "latin": "abdoulie"},
  
  // Abdul + Divine Names compounds
  {"arabic": "عَبْد الرَّحْمَن", "latin": "abdulrahman"},
  {"arabic": "عَبْد الرَّحْمَن", "latin": "abdul rahman"},
  {"arabic": "عَبْد الرَّحْمَن", "latin": "abdelrahman"},
  {"arabic": "عَبْد الرَّحِيم", "latin": "abdulrahim"},
  {"arabic": "عَبْد الرَّحِيم", "latin": "abdelrahim"},
  {"arabic": "عَبْد الْعَزِيز", "latin": "abdulaziz"},
  {"arabic": "عَبْد الْعَزِيز", "latin": "abdelaziz"},
  {"arabic": "عَبْد الْكَرِيم", "latin": "abdulkarim"},
  {"arabic": "عَبْد الْكَرِيم", "latin": "abdelkarim"},
  {"arabic": "عَبْد الْمَلِك", "latin": "abdulmalik"},
  {"arabic": "عَبْد الْمَلِك", "latin": "abdelmalik"},
  {"arabic": "أَبدُل", "latin": "abdul"},
  {"arabic": "أَبدُل", "latin": "abdoul"},
  
  // Khalid
  {"arabic": "خَالِد", "latin": "khalid"},
  {"arabic": "خَالِد", "latin": "khaled"},
  
  // Salah/Saleh
  {"arabic": "صَلَاح", "latin": "salah"},
  {"arabic": "صَالِح", "latin": "saleh"},
  {"arabic": "صَالِح", "latin": "salih"},
  
  // Said/Saeed
  {"arabic": "سَعِيد", "latin": "saeed"},
  {"arabic": "سَعِيد", "latin": "said"},
  {"arabic": "سَعِيد", "latin": "saeid"},
  {"arabic": "سيد", "latin": "saidou"},
  {"arabic": "سيد", "latin": "saidu"},
  
  // Tariq
  {"arabic": "طَارِق", "latin": "tariq"},
  {"arabic": "طَارِق", "latin": "tarek"},
  {"arabic": "طَارِق", "latin": "tarik"},
  
  // Rashid
  {"arabic": "رَشِيد", "latin": "rashid"},
  {"arabic": "رَشِيد", "latin": "rasheed"},
  
  // Karim
  {"arabic": "كَرِيم", "latin": "karim"},
  {"arabic": "كَرِيم", "latin": "kareem"},
  
  // Hamza
  {"arabic": "حَمْزَة", "latin": "hamza"},
  {"arabic": "حَمْزَة", "latin": "hamzah"},
  
  // Bilal
  {"arabic": "بِلَال", "latin": "bilal"},
  {"arabic": "بِلَال", "latin": "bilel"},
  
  // Anas
  {"arabic": "أَنَس", "latin": "anas"},
  {"arabic": "أنس", "latin": "ansu"},
  
  // Zakaria
  {"arabic": "زَكَرِيَّا", "latin": "zakaria"},
  {"arabic": "زَكَرِيَّا", "latin": "zakariya"},
  {"arabic": "زَكَرِيَّا", "latin": "zachary"},
  
  // Younes/Yunus
  {"arabic": "يُونُس", "latin": "younes"},
  {"arabic": "يُونُس", "latin": "yunus"},
  {"arabic": "يُونُس", "latin": "yunes"},
  
  // Ismail
  {"arabic": "إِسْمَاعِيل", "latin": "ismail"},
  {"arabic": "إِسْمَاعِيل", "latin": "ismael"},
  {"arabic": "إِسْمَاعِيل", "latin": "ishmael"},
  
  // Musa/Moses
  {"arabic": "مُوسَى", "latin": "musa"},
  {"arabic": "مُوسَى", "latin": "mousa"},
  {"arabic": "موسى", "latin": "moussa"},
  
  // Isa/Jesus
  {"arabic": "عِيسَى", "latin": "isa"},
  {"arabic": "عِيسَى", "latin": "eisa"},
  
  // Adam
  {"arabic": "آدَم", "latin": "adam"},
  {"arabic": "ادم", "latin": "adama"},
  
  // Nuh/Noah
  {"arabic": "نُوح", "latin": "nuh"},
  {"arabic": "نُوح", "latin": "noah"},
  
  // ==========================================
  // FEMALE NAMES - Middle East & Arab World
  // ==========================================
  
  // Fatima (Most common female name)
  {"arabic": "فَاطِمَة", "latin": "fatima"},
  {"arabic": "فَاطِمَة", "latin": "fatimah"},
  {"arabic": "فَاطِمَة", "latin": "fatime"},
  {"arabic": "فاطمة", "latin": "fatou"},
  {"arabic": "فات", "latin": "fatu"},
  {"arabic": "فاطمة", "latin": "fatimatou"},
  {"arabic": "فَاطِمَة", "latin": "fatma"},
  
  // Aisha
  {"arabic": "عَائِشَة", "latin": "aisha"},
  {"arabic": "عَائِشَة", "latin": "ayesha"},
  {"arabic": "عَائِشَة", "latin": "aicha"},
  {"arabic": "عَائِشَة", "latin": "aysha"},
  {"arabic": "إيسة", "latin": "isatou"},
  {"arabic": "إيسة", "latin": "aissatou"},
  
  // Khadija
  {"arabic": "خَدِيجَة", "latin": "khadija"},
  {"arabic": "خَدِيجَة", "latin": "khadijah"},
  {"arabic": "خَدِيجَة", "latin": "hadija"},
  {"arabic": "خد", "latin": "haddy"},
  
  // Maryam/Mariam
  {"arabic": "مَرْيَم", "latin": "maryam"},
  {"arabic": "مَرْيَم", "latin": "mariam"},
  {"arabic": "مَرْيَم", "latin": "meryem"},
  {"arabic": "مريم", "latin": "meriem"},
  
  // Zainab
  {"arabic": "زَيْنَب", "latin": "zainab"},
  {"arabic": "زَيْنَب", "latin": "zaynab"},
  {"arabic": "زَيْنَب", "latin": "zeinab"},
  {"arabic": "زَيْنَب", "latin": "zineb"},
  
  // Hawa/Eve
  {"arabic": "حَوَّاء", "latin": "hawa"},
  {"arabic": "حَوَّاء", "latin": "hawwa"},
  {"arabic": "حواء", "latin": "hava"},
  
  // Hafsa
  {"arabic": "حَفْصَة", "latin": "hafsa"},
  {"arabic": "حَفْصَة", "latin": "hafsah"},
  
  // Ruqayya
  {"arabic": "رُقَيَّة", "latin": "ruqayya"},
  {"arabic": "رُقَيَّة", "latin": "ruqayyah"},
  {"arabic": "رقي", "latin": "rokhya"},
  {"arabic": "رجي", "latin": "rohya"},
  {"arabic": "رغية", "latin": "rugiatou"},
  
  // Safiya
  {"arabic": "صَفِيَّة", "latin": "safiya"},
  {"arabic": "صَفِيَّة", "latin": "safiyya"},
  {"arabic": "صَفِيَّة", "latin": "safia"},
  
  // Amina/Aminah
  {"arabic": "آمِنَة", "latin": "amina"},
  {"arabic": "آمِنَة", "latin": "aminah"},
  {"arabic": "امنة", "latin": "aminata"},
  {"arabic": "امنة", "latin": "amminata"},
  
  // Leila/Layla
  {"arabic": "لَيْلَى", "latin": "leila"},
  {"arabic": "لَيْلَى", "latin": "layla"},
  {"arabic": "لَيْلَى", "latin": "laila"},
  
  // Salma
  {"arabic": "سَلْمَى", "latin": "salma"},
  {"arabic": "سَلْمَى", "latin": "selma"},
  
  // Asma
  {"arabic": "أَسْمَاء", "latin": "asma"},
  {"arabic": "أَسْمَاء", "latin": "asmaa"},
  
  // Sumaya
  {"arabic": "سُمَيَّة", "latin": "sumaya"},
  {"arabic": "سُمَيَّة", "latin": "sumaiya"},
  {"arabic": "سُمَيَّة", "latin": "soumaya"},
  
  // Nour/Noor
  {"arabic": "نُور", "latin": "nour"},
  {"arabic": "نُور", "latin": "noor"},
  {"arabic": "نُور", "latin": "nur"},
  
  // Sara/Sarah
  {"arabic": "سَارَة", "latin": "sara"},
  {"arabic": "سَارَة", "latin": "sarah"},
  {"arabic": "سر", "latin": "sira"},
  
  // Hana
  {"arabic": "هَنَاء", "latin": "hana"},
  {"arabic": "هَنَاء", "latin": "hanaa"},
  
  // Habiba
  {"arabic": "حَبِيبَة", "latin": "habiba"},
  {"arabic": "حبيبة", "latin": "habibatou"},
  {"arabic": "ابيبة", "latin": "abibatou"},
  
  // Rania
  {"arabic": "رَانْيَا", "latin": "rania"},
  {"arabic": "رَانْيَا", "latin": "raniya"},
  
  // ==========================================
  // SOUTH ASIAN VARIATIONS (Pakistan, India, Bangladesh)
  // ==========================================
  
  // Male names
  {"arabic": "عَلِي", "latin": "alee"},
  {"arabic": "حَسَن", "latin": "hasan"},
  {"arabic": "حُسَيْن", "latin": "hussain"},
  {"arabic": "زَيْن", "latin": "zain"},
  {"arabic": "زَيْن", "latin": "zayn"},
  {"arabic": "فَيْصَل", "latin": "faisal"},
  {"arabic": "فَيْصَل", "latin": "faysal"},
  {"arabic": "عِمْرَان", "latin": "imran"},
  {"arabic": "كَامِل", "latin": "kamil"},
  {"arabic": "نَبِيل", "latin": "nabeel"},
  {"arabic": "رِضْوَان", "latin": "rizwan"},
  {"arabic": "شَاكِر", "latin": "shakir"},
  {"arabic": "طَاهِر", "latin": "tahir"},
  {"arabic": "وَسِيم", "latin": "wasim"},
  {"arabic": "وَسِيم", "latin": "waseem"},
  
  // Female names
  {"arabic": "عَائِشَة", "latin": "ayesha"},
  {"arabic": "سَانِيَة", "latin": "sania"},
  {"arabic": "رُبَى", "latin": "ruba"},
  {"arabic": "مَهَا", "latin": "maha"},
  {"arabic": "لُبْنَى", "latin": "lubna"},
  {"arabic": "سَمَر", "latin": "samar"},
  
  // ==========================================
  // TURKISH & PERSIAN VARIATIONS
  // ==========================================
  
  // Turkish
  {"arabic": "مُحَمَّد", "latin": "mehmet"},
  {"arabic": "مُحَمَّد", "latin": "mehmed"},
  {"arabic": "أَحْمَد", "latin": "ahmet"},
  {"arabic": "مُصْطَفَى", "latin": "mustafa"},
  {"arabic": "عُثْمَان", "latin": "osman"},
  {"arabic": "سُلَيْمَان", "latin": "suleyman"},
  {"arabic": "يُوسُف", "latin": "yusuf"},
  {"arabic": "إِبْرَاهِيم", "latin": "ibrahim"},
  {"arabic": "عُمَر", "latin": "omer"},
  
  // Persian
  {"arabic": "رِضَا", "latin": "reza"},
  {"arabic": "رِضَا", "latin": "riza"},
  {"arabic": "جَعْفَر", "latin": "jafar"},
  {"arabic": "جَعْفَر", "latin": "jaafar"},
  {"arabic": "سَجَّاد", "latin": "sajjad"},
  {"arabic": "مَهْدِي", "latin": "mahdi"},
  {"arabic": "مَهْدِي", "latin": "mehdi"},
  
  // ==========================================
  // SOUTHEAST ASIAN (Indonesia, Malaysia)
  // ==========================================
  
  {"arabic": "نُور", "latin": "nur"},
  {"arabic": "سِيتِي", "latin": "siti"},
  {"arabic": "فَاطِمَة", "latin": "fatimah"},
  {"arabic": "مُحَمَّد", "latin": "muhammad"},
  {"arabic": "أَحْمَد", "latin": "ahmad"},
  {"arabic": "عَلِي", "latin": "ali"},
  {"arabic": "حَسَن", "latin": "hasan"},
  {"arabic": "يُوسُف", "latin": "yusuf"},
  
  // ==========================================
  // NORTH AFRICAN VARIATIONS (Morocco, Algeria, Tunisia, Libya, Egypt)
  // ==========================================
  
  {"arabic": "مُحَمَّد", "latin": "mohamed"},
  {"arabic": "مُحَمَّد", "latin": "mohammed"},
  {"arabic": "أَمِين", "latin": "amine"},
  {"arabic": "يَاسِين", "latin": "yassine"},
  {"arabic": "يَاسِين", "latin": "yassin"},
  {"arabic": "إِلْيَاس", "latin": "ilyas"},
  {"arabic": "إِلْيَاس", "latin": "elias"},
  {"arabic": "آدَم", "latin": "adam"},
  {"arabic": "أَيُّوب", "latin": "ayoub"},
  {"arabic": "أَيُّوب", "latin": "ayyub"},
  {"arabic": "سُفْيَان", "latin": "sofiane"},
  {"arabic": "سُفْيَان", "latin": "soufiane"},
  {"arabic": "رَيَان", "latin": "rayan"},
  {"arabic": "رَيَان", "latin": "rayane"},
  
  // Female
  {"arabic": "سَلْمَى", "latin": "salma"},
  {"arabic": "إِيمَان", "latin": "imane"},
  {"arabic": "إِيمَان", "latin": "iman"},
  {"arabic": "سَمِيَّة", "latin": "samia"},
  {"arabic": "سَمِيَّة", "latin": "samiya"},
  {"arabic": "كَرِيمَة", "latin": "karima"},
  {"arabic": "نَدِيَة", "latin": "nadia"},
  {"arabic": "يَاسْمِين", "latin": "yasmine"},
  {"arabic": "يَاسْمِين", "latin": "yasmeen"},
  
  // ==========================================
  // WEST AFRICAN NAMES (Gambia, Senegal, etc.)
  // ==========================================
  
  {"arabic": "لمي", "latin": "lamin"},
  {"arabic": "لمي", "latin": "lamine"},
  {"arabic": "سيك", "latin": "saikou"},
  {"arabic": "كم", "latin": "kemo"},
  {"arabic": "مود", "latin": "modou"},
  {"arabic": "بكل", "latin": "bakari"},
  {"arabic": "إللاج", "latin": "elhag"},
  {"arabic": "الحاج", "latin": "alhagie"},
  {"arabic": "الحاج", "latin": "alhagi"},
  {"arabic": "عثمان", "latin": "ousman"},
  {"arabic": "اسمان", "latin": "osmane"},
  {"arabic": "باكر", "latin": "bakary"},
  {"arabic": "بك", "latin": "baka"},
  {"arabic": "كيبا", "latin": "kebba"},
  {"arabic": "كيبا", "latin": "keba"},
  {"arabic": "سليمان", "latin": "sulayman"},
  {"arabic": "أج", "latin": "aji"},
  {"arabic": "أج", "latin": "adjie"},
  {"arabic": "نم", "latin": "nyima"},
  {"arabic": "فنت", "latin": "fanta"},
  {"arabic": "كمب", "latin": "kumba"},
  {"arabic": "كمب", "latin": "coumba"},
  {"arabic": "او", "latin": "awa"},
  {"arabic": "بنت", "latin": "binta"},
  {"arabic": "بنت", "latin": "bintou"},
  {"arabic": "شيخ", "latin": "saihou"},
  {"arabic": "شيخ", "latin": "sheikh"},
  {"arabic": "شيخ", "latin": "sheikhou"},
  {"arabic": "شيخ", "latin": "sheikha"},
  {"arabic": "شيخ", "latin": "sheik"},
  {"arabic": "شيخ", "latin": "cheikh"},
  {"arabic": "باي", "latin": "bai"},
  {"arabic": "باي", "latin": "baye"},
  {"arabic": "شرن", "latin": "seringe"},
  {"arabic": "شرن", "latin": "serigne"},
  {"arabic": "بب", "latin": "pap"},
  {"arabic": "فل", "latin": "fallu"},
  {"arabic": "فل", "latin": "fallou"},
  {"arabic": "مومود", "latin": "momodou"},
  {"arabic": "مومود", "latin": "momodu"},
  {"arabic": "فان", "latin": "fana"},
  {"arabic": "مالك", "latin": "malick"},
  {"arabic": "مالك", "latin": "malic"},
  {"arabic": "مالك", "latin": "malik"},
  {"arabic": "بابكر", "latin": "babacar"},
  {"arabic": "بابكر", "latin": "babakar"},
  {"arabic": "بابكر", "latin": "babukar"},
  {"arabic": "بابكر", "latin": "babucarr"},
  {"arabic": "بابكر", "latin": "babacarr"},
  {"arabic": "بوبكر", "latin": "bubakar"},
  {"arabic": "بوبكر", "latin": "boubakar"},
  {"arabic": "ابو بكر", "latin": "abubakar"},
  {"arabic": "ابو بكر", "latin": "aboubacarr"},
  {"arabic": "ابالكر", "latin": "ababacar"},
  {"arabic": "ابالكر", "latin": "ababakar"},
  {"arabic": "كرا", "latin": "kara"},
  {"arabic": "م مد", "latin": "mamadu"},
  {"arabic": "م مد", "latin": "mamadou"},
  {"arabic": "حد", "latin": "haddy"},
  {"arabic": "حد", "latin": "hady"},
  {"arabic": "باب", "latin": "pape"},
  {"arabic": "بوكر", "latin": "boukar"},
  {"arabic": "بوكر", "latin": "boucar"},
  {"arabic": "كد", "latin": "kady"},
  {"arabic": "كد", "latin": "kadi"},
  {"arabic": "سكن", "latin": "sohna"},
  {"arabic": "سكن", "latin": "sokhna"},
  {"arabic": "رغ", "latin": "rugi"},
  {"arabic": "ابي", "latin": "abbi"},
  {"arabic": "ابي", "latin": "abi"},
  {"arabic": "حبي", "latin": "habbi"},
  {"arabic": "حبي", "latin": "habi"},
  {"arabic": "حبي", "latin": "habby"},
  {"arabic": "امد", "latin": "amadou"},
  {"arabic": "امد", "latin": "amadu"},
  {"arabic": "سمب", "latin": "samba"},
  {"arabic": "الفا", "latin": "alpha"},
  {"arabic": "سيرن", "latin": "cherno"},
  {"arabic": "امد", "latin": "amadi"},
  {"arabic": "اب", "latin": "ebu"},
  {"arabic": "اب", "latin": "ebou"},
  {"arabic": "اب", "latin": "ibu"},
  {"arabic": "حمد", "latin": "hamadi"},
  {"arabic": "داد", "latin": "dawda"},
  {"arabic": "را مة", "latin": "ramata"},
  {"arabic": "رمة", "latin": "ramatu"},
  {"arabic": "ميمون", "latin": "maimouna"},
  {"arabic": "ميمن", "latin": "maimuna"},
  {"arabic": "أبس", "latin": "ansu"},
  {"arabic": "كلف", "latin": "kalifa"},
  {"arabic": "لندغ", "latin": "landing"},
  {"arabic": "جلف", "latin": "khalifa"},
  {"arabic": "اسمان", "latin": "ousman"},
  
  // ==========================================
  // COMPOUND NAMES (Titles + Names)
  // ==========================================
  
  {"arabic": "شيخ إبراهيم", "latin": "cheikh ibrahima"},
  {"arabic": "شيخ إبراهيم", "latin": "sheikh ibrahima"},
  {"arabic": "شيخ عثمان", "latin": "cheikh ousman"},
  {"arabic": "شيخ عثمان", "latin": "sheikh ousman"},
  {"arabic": "شرن فل", "latin": "serigne fallu"},
  {"arabic": "شرن فل", "latin": "seringe fallou"},
  {"arabic": "شرن لمي", "latin": "serigne lamine"},
  {"arabic": "شرن مود", "latin": "serigne modou"},
  {"arabic": "شرن توب", "latin": "serigne touba"},
  {"arabic": "شيخ امد", "latin": "cheikh amadou"},
  {"arabic": "شيخ بكل", "latin": "cheikh bakari"},
  {"arabic": "الحاج عثمان", "latin": "alhagie ousman"},
  {"arabic": "الحاج م مد", "latin": "alhagie mamadou"},
  {"arabic": "ند فاطمة", "latin": "ndaye fatou"},
  {"arabic": "ند فاطمة", "latin": "ndeye fatou"},
  {"arabic": "ند إيسة", "latin": "ndaye aissatou"},
  {"arabic": "ند إيسة", "latin": "ndeye isatou"},
  {"arabic": "ند امنة", "latin": "ndaye aminata"},
  {"arabic": "ند كمب", "latin": "ndaye kumba"},
  {"arabic": "ياي فاطمة", "latin": "yaye fatou"},
  {"arabic": "ياي إيسة", "latin": "yaye aissatou"},
  {"arabic": "ياي امنة", "latin": "yaye aminata"},
  {"arabic": "باب مالك", "latin": "pape malick"},
  {"arabic": "باب سمب", "latin": "pape samba"},
  {"arabic": "باب إبراهيم", "latin": "pape ibrahima"},
  {"arabic": "شيخ عبد الله", "latin": "cheikh abdoulie"},
  {"arabic": "شرن سليمان", "latin": "serigne sulayman"},
  {"arabic": "الحاج محمد", "latin": "alhagie muhammadu"}
];

export function searchNameTransliterations(query: string): NameMatch[] {
  if (!query || query.trim().length === 0) return [];
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check if query contains multiple words (compound name like "Cheikh Ibrahim")
  const queryWords = normalizedQuery.split(/\s+/);
  
  if (queryWords.length > 1) {
    // For compound names, match each word separately and combine results
    const combinedMatches: NameMatch[] = [];
    const wordMatches: NameMatch[][] = queryWords.map(word => {
      const wordResults: NameMatch[] = [];
      nameTransliterations.forEach(item => {
        const latinLower = item.latin.toLowerCase();
        if (latinLower.includes(word)) {
          wordResults.push({
            arabic: item.arabic,
            matchedVariation: item.latin,
            isExactMatch: latinLower === word,
            isStartsWith: latinLower.startsWith(word)
          });
        }
      });
      return wordResults.sort((a, b) => {
        if (a.isExactMatch && !b.isExactMatch) return -1;
        if (!a.isExactMatch && b.isExactMatch) return 1;
        if (a.isStartsWith && !b.isStartsWith) return -1;
        if (!a.isStartsWith && b.isStartsWith) return 1;
        return 0;
      });
    });
    
    // Combine matches from each word (take top match from each)
    // This creates compound name suggestions like "cheikh + ibrahima"
    if (wordMatches.every(matches => matches.length > 0)) {
      const topMatches = wordMatches.map(matches => matches[0]);
      const combinedArabic = topMatches.map(m => m.arabic).join(' ');
      const combinedLatin = topMatches.map(m => m.matchedVariation).join(' ');
      combinedMatches.push({
        arabic: combinedArabic,
        matchedVariation: combinedLatin,
        isExactMatch: topMatches.every(m => m.isExactMatch),
        isStartsWith: topMatches.every(m => m.isStartsWith)
      });
    }
    
    // Also include individual word matches as alternatives
    wordMatches.forEach(matches => {
      matches.slice(0, 3).forEach(match => {
        if (!combinedMatches.some(cm => cm.matchedVariation === match.matchedVariation)) {
          combinedMatches.push(match);
        }
      });
    });
    
    return combinedMatches;
  }
  
  // Single word search - original logic
  const matches: NameMatch[] = [];
  nameTransliterations.forEach(item => {
    const latinLower = item.latin.toLowerCase();
    if (latinLower.includes(normalizedQuery)) {
      matches.push({
        arabic: item.arabic,
        matchedVariation: item.latin,
        isExactMatch: latinLower === normalizedQuery,
        isStartsWith: latinLower.startsWith(normalizedQuery)
      });
    }
  });
  return matches.sort((a, b) => {
    if (a.isExactMatch && !b.isExactMatch) return -1;
    if (!a.isExactMatch && b.isExactMatch) return 1;
    if (a.isStartsWith && !b.isStartsWith) return -1;
    if (!a.isStartsWith && b.isStartsWith) return 1;
    return a.matchedVariation.localeCompare(b.matchedVariation);
  });
}

export function getNameDisplayLabel(item: NameMatch | NameTransliteration): string {
  if ('matchedVariation' in item) return item.matchedVariation;
  return item.latin;
}
