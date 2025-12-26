const fetch = require('node-fetch');

// MOBILE VERSION - Current implementation
function normalizeMobile(text) {
  if (!text) return '';
  
  let normalized = text.trim().normalize('NFC');
  
  // Remove Uthmani, Quranic marks, diacritics, tatweel
  normalized = normalized
    .replace(/[\u0600-\u0603\u0606-\u060F\u06DD-\u06DE]/g, '')
    .replace(/[\u0610-\u061A\u06D6-\u06EF]/g, '')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\u0640/g, '');
  
  // Decompose ligatures
  normalized = normalized.replace(/[\uFEF5-\uFEFC]/g, 'لا');
  
  // Normalize letter variants
  normalized = normalized
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')  // ← THIS LINE: Convert hamza-yaa to plain yaa
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
  
  // Remove everything except Arabic letters
  normalized = normalized
    .replace(/[0-9\u0660-\u0669]/g, '')
    .replace(/[\s\u200C\u200D\u200E\u200F.,;:!?"'`~@#$%^&*()_+\-=\[\]{}|\\/<>«»،؛؟]/g, '')
    .replace(/[A-Za-z]/g, '')
    .replace(/[^\u0621-\u063A\u0641-\u064A]/g, '');
  
  return normalized;
}

// WEB VERSION HYPOTHESIS - Maybe it removes hamza completely?
function normalizeWeb(text) {
  if (!text) return '';
  
  let normalized = text.trim().normalize('NFC');
  
  // Remove Uthmani, Quranic marks, diacritics, tatweel
  normalized = normalized
    .replace(/[\u0600-\u0603\u0606-\u060F\u06DD-\u06DE]/g, '')
    .replace(/[\u0610-\u061A\u06D6-\u06EF]/g, '')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\u0640/g, '');
  
  // Decompose ligatures
  normalized = normalized.replace(/[\uFEF5-\uFEFC]/g, 'لا');
  
  // Normalize letter variants - DIFFERENT: Remove hamza characters completely?
  normalized = normalized
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ؤئء]/g, '')  // ← HYPOTHESIS: Remove hamza completely instead of converting
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
  
  // Remove everything except Arabic letters
  normalized = normalized
    .replace(/[0-9\u0660-\u0669]/g, '')
    .replace(/[\s\u200C\u200D\u200E\u200F.,;:!?"'`~@#$%^&*()_+\-=\[\]{}|\\/<>«»،؛؟]/g, '')
    .replace(/[A-Za-z]/g, '')
    .replace(/[^\u0621-\u063A\u0641-\u064A]/g, '');
  
  return normalized;
}

const ABJAD = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
  'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000
};

function calculateKabir(text) {
  return text.split('').reduce((sum, c) => sum + (ABJAD[c] || 0), 0);
}

async function test() {
  const response = await fetch('https://api.alquran.cloud/v1/ayah/4:20/ar.asad');
  const data = await response.json();
  const raw = data.data.text;
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  HAMZA NORMALIZATION COMPARISON');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const mobile = normalizeMobile(raw);
  const web = normalizeWeb(raw);
  
  console.log('MOBILE NORMALIZATION (ئ → ي):');
  console.log('  Text:', mobile);
  console.log('  Length:', mobile.length);
  console.log('  Kabir:', calculateKabir(mobile), '\n');
  
  console.log('WEB HYPOTHESIS (ئ → removed):');
  console.log('  Text:', web);
  console.log('  Length:', web.length);
  console.log('  Kabir:', calculateKabir(web), '\n');
  
  console.log('DIFFERENCE:', calculateKabir(mobile) - calculateKabir(web));
  
  if (calculateKabir(web) === 7728) {
    console.log('\n✅ HYPOTHESIS CONFIRMED: Web removes ئ (hamza-yaa) completely!');
    console.log('   Mobile converts ئ → ي (adds +10)');
    console.log('   Web removes ئ entirely (no value)');
  } else {
    console.log('\n❌ Hypothesis incorrect. Need more investigation.');
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════\n');
}

test();
