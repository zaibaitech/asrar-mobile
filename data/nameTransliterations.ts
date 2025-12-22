/**
 * West African Name Transliterations
 * Mapping between Latin (English/French) and Arabic script names
 * Common names from Gambia, Senegal, and West African Islamic communities
 * Each variation has its own entry for clearer matching
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
  {"arabic": "لمي", "latin": "lamin"},
  {"arabic": "لمي", "latin": "lamine"},
  {"arabic": "سيك", "latin": "saikou"},
  {"arabic": "كم", "latin": "kemo"},
  {"arabic": "موسى", "latin": "musa"},
  {"arabic": "مود", "latin": "modou"},
  {"arabic": "بكل", "latin": "bakari"},
  {"arabic": "إللاج", "latin": "elhag"},
  {"arabic": "الحاج", "latin": "alhagie"},
  {"arabic": "الحاج", "latin": "alhagi"},
  {"arabic": "ابرام", "latin": "ibrama"},
  {"arabic": "إبراهيم", "latin": "ibrahima"},
  {"arabic": "إبراهيم", "latin": "ebrahima"},
  {"arabic": "ابدالله", "latin": "abdalah"},
  {"arabic": "ابدالله", "latin": "abdala"},
  {"arabic": "ابدالله", "latin": "abdoulie"},
  {"arabic": "عبد الله", "latin": "abdalah"},
  {"arabic": "عبد الله", "latin": "abdala"},
  {"arabic": "عبد الله", "latin": "abdoulie"},
  {"arabic": "عثمان", "latin": "ousman"},
  {"arabic": "اسمان", "latin": "osmane"},
  {"arabic": "باكر", "latin": "bakary"},
  {"arabic": "بك", "latin": "baka"},
  {"arabic": "كيبا", "latin": "kebba"},
  {"arabic": "كيبا", "latin": "keba"},
  {"arabic": "سليمان", "latin": "sulayman"},
  {"arabic": "فاطمة", "latin": "fatou"},
  {"arabic": "فات", "latin": "fatu"},
  {"arabic": "فاطمة", "latin": "fatima"},
  {"arabic": "فاطمة", "latin": "fatimah"},
  {"arabic": "فاطمة", "latin": "fatimatou"},
  {"arabic": "أج", "latin": "aji"},
  {"arabic": "أج", "latin": "adjie"},
  {"arabic": "إيسة", "latin": "isatou"},
  {"arabic": "إيسة", "latin": "aissatou"},
  {"arabic": "نم", "latin": "nyima"},
  {"arabic": "سر", "latin": "sira"},
  {"arabic": "فنت", "latin": "fanta"},
  {"arabic": "خد", "latin": "haddy"},
  {"arabic": "كمب", "latin": "kumba"},
  {"arabic": "كمب", "latin": "coumba"},
  {"arabic": "او", "latin": "awa"},
  {"arabic": "بنت", "latin": "binta"},
  {"arabic": "بنت", "latin": "bintou"},
  {"arabic": "امنة", "latin": "aminata"},
  {"arabic": "امنة", "latin": "amminata"},
  {"arabic": "حواء", "latin": "hawa"},
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
  {"arabic": "محمد", "latin": "muhammadu"},
  {"arabic": "محمد", "latin": "muhammadou"},
  {"arabic": "كد", "latin": "kady"},
  {"arabic": "كد", "latin": "kadi"},
  {"arabic": "سكن", "latin": "sohna"},
  {"arabic": "سكن", "latin": "sokhna"},
  {"arabic": "رقي", "latin": "rokhya"},
  {"arabic": "رجي", "latin": "rohya"},
  {"arabic": "رغ", "latin": "rugi"},
  {"arabic": "رغية", "latin": "rugiatou"},
  {"arabic": "ادم", "latin": "adama"},
  {"arabic": "ادم", "latin": "adam"},
  {"arabic": "مريم", "latin": "mariam"},
  {"arabic": "ابي", "latin": "abbi"},
  {"arabic": "ابي", "latin": "abi"},
  {"arabic": "حبي", "latin": "habbi"},
  {"arabic": "حبي", "latin": "habi"},
  {"arabic": "حبي", "latin": "habby"},
  {"arabic": "حبيبة", "latin": "habibatou"},
  {"arabic": "أنس", "latin": "ansu"},
  {"arabic": "امد", "latin": "amadou"},
  {"arabic": "امد", "latin": "amadu"},
  {"arabic": "سمب", "latin": "samba"},
  {"arabic": "الفا", "latin": "alpha"},
  {"arabic": "سيرن", "latin": "cherno"},
  {"arabic": "سيد", "latin": "saidou"},
  {"arabic": "سيد", "latin": "saidu"},
  {"arabic": "ابيبة", "latin": "abibatou"},
  {"arabic": "امد", "latin": "amadi"},
  {"arabic": "اب", "latin": "ebu"},
  {"arabic": "اب", "latin": "ebou"},
  {"arabic": "اب", "latin": "ibu"},
  {"arabic": "أم  ر", "latin": "omar"},
  {"arabic": "أم  ر", "latin": "umar"},
  {"arabic": "أبدل", "latin": "abdul"},
  {"arabic": "أبدل", "latin": "abdoul"},
  {"arabic": "حمد", "latin": "hamadi"},
  {"arabic": "داد", "latin": "dawda"},
  {"arabic": "را  مة", "latin": "ramata"},
  {"arabic": "رمة", "latin": "ramatu"},
  {"arabic": "ميمون", "latin": "maimouna"},
  {"arabic": "ميمن", "latin": "maimuna"},
  {"arabic": "أبس", "latin": "ansu"},
  {"arabic": "كلف", "latin": "kalifa"},
  {"arabic": "لندغ", "latin": "landing"},
  {"arabic": "جلف", "latin": "khalifa"},
  {"arabic": "اسمان", "latin": "ousman"},
  
  // Common compound names (titles + names)
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
