const fetch = require('node-fetch');

// Import normalization function (we'll simulate it)
function normalizeArabic(text) {
  if (!text) return '';
  
  // Unicode normalization
  let normalized = text.trim().normalize('NFC');
  
  // Remove Uthmani symbols
  normalized = normalized.replace(/[\u0600-\u0603\u0606-\u060F\u06DD-\u06DE]/g, '');
  // Remove Quranic marks
  normalized = normalized.replace(/[\u0610-\u061A\u06D6-\u06EF]/g, '');
  // Remove diacritics
  normalized = normalized.replace(/[\u064B-\u065F\u0670]/g, '');
  // Remove tatweel
  normalized = normalized.replace(/\u0640/g, '');
  // Decompose ligatures
  normalized = normalized.replace(/[\uFEF5-\uFEFC]/g, 'لا');
  
  // Normalize letter variants
  normalized = normalized
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ؤئء]/g, '')  // Remove hamza characters completely (matches web)
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

// Maghribi Abjad map
const ABJAD_MAGHRIBI = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
  'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000
};

function calculateKabir(text) {
  let total = 0;
  for (const char of text) {
    total += ABJAD_MAGHRIBI[char] || 0;
  }
  return total;
}

function digitalRoot(n) {
  while (n >= 10) {
    n = String(n).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return n;
}

async function testVerse() {
  try {
    console.log('\n════════════════════════════════════════════════════════════');
    console.log('  SURAH 4, AYAH 20 - ABJAD CALCULATION TEST');
    console.log('════════════════════════════════════════════════════════════\n');
    
    const response = await fetch('https://api.alquran.cloud/v1/ayah/4:20/ar.asad');
    const data = await response.json();
    
    if (data.code === 200 && data.data && data.data.text) {
      const rawText = data.data.text;
      
      console.log('📖 RAW TEXT FROM API:');
      console.log('   "' + rawText + '"');
      console.log('   Length: ' + rawText.length + ' characters\n');
      
      // Normalize
      const normalized = normalizeArabic(rawText);
      
      console.log('✨ NORMALIZED TEXT:');
      console.log('   "' + normalized + '"');
      console.log('   Length: ' + normalized.length + ' characters\n');
      
      console.log('🗑️  REMOVED: ' + (rawText.length - normalized.length) + ' characters\n');
      
      // Calculate Abjad
      const kabir = calculateKabir(normalized);
      const saghir = digitalRoot(kabir);
      
      console.log('📊 ABJAD CALCULATION (Maghribi):');
      console.log('   Kabir (Grand Total):  ' + kabir);
      console.log('   Saghir (Digital Root): ' + saghir);
      
      console.log('\n════════════════════════════════════════════════════════════');
      console.log('  ✅ CALCULATION COMPLETE');
      console.log('════════════════════════════════════════════════════════════\n');
      
      console.log('📝 WHAT TO DO NEXT:');
      console.log('   1. Compare these values with your web app');
      console.log('   2. If web app shows different values, share them');
      console.log('   3. The normalized text should be identical on both\n');
      
    } else {
      console.log('❌ Failed to fetch verse');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testVerse();
