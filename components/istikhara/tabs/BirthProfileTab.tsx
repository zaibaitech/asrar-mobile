/**
 * Birth Profile Tab
 * =================
 * Displays birth chart data including Sun Sign, Moon Sign, Ascendant, and Descendant.
 * Ascendant/Descendant are only shown if birth time was provided.
 */
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Moon, Sparkles, Sun, Sunrise, Sunset } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getPlanetPositions } from '../../../services/EphemerisService';
import { calculateAscendantSync } from '../../../services/NatalChartService';
import { BirthProfile, IstikharaData } from '../../../types/istikhara';

// ─── Planet dignity table (Classical) ───────────────────────────────────────
const PLANET_DIGNITIES: Record<string, { domicile: string[]; exaltation: string[]; detriment: string[]; fall: string[] }> = {
  Sun:     { domicile: ['Leo'],                  exaltation: ['Aries'],      detriment: ['Aquarius'],           fall: ['Libra'] },
  Moon:    { domicile: ['Cancer'],               exaltation: ['Taurus'],     detriment: ['Capricorn'],          fall: ['Scorpio'] },
  Mercury: { domicile: ['Gemini', 'Virgo'],      exaltation: ['Virgo'],      detriment: ['Sagittarius','Pisces'],fall: ['Pisces'] },
  Venus:   { domicile: ['Taurus', 'Libra'],      exaltation: ['Pisces'],     detriment: ['Aries','Scorpio'],    fall: ['Virgo'] },
  Mars:    { domicile: ['Aries', 'Scorpio'],     exaltation: ['Capricorn'],  detriment: ['Libra','Taurus'],     fall: ['Cancer'] },
  Jupiter: { domicile: ['Sagittarius', 'Pisces'],exaltation: ['Cancer'],     detriment: ['Gemini','Virgo'],     fall: ['Capricorn'] },
  Saturn:  { domicile: ['Capricorn', 'Aquarius'],exaltation: ['Libra'],      detriment: ['Cancer','Leo'],       fall: ['Aries'] },
};

function computePlanetCondition(planet: string, sign: string): 'strong' | 'neutral' | 'weak' {
  const d = PLANET_DIGNITIES[planet];
  if (!d) return 'neutral';
  if (d.domicile.includes(sign) || d.exaltation.includes(sign)) return 'strong';
  if (d.detriment.includes(sign) || d.fall.includes(sign)) return 'weak';
  return 'neutral';
}

function computeMoonTiming(sunLon: number, moonLon: number) {
  let elongation = moonLon - sunLon;
  if (elongation < 0) elongation += 360;
  const lunarDay = Math.floor(elongation / 12) + 1;
  const illumination = Math.round((1 - Math.cos((elongation * Math.PI) / 180)) * 50);
  const isWaxing = elongation < 180;
  let phase = 'new';
  if (elongation < 45) phase = 'new';
  else if (elongation < 90) phase = 'waxing_crescent';
  else if (elongation < 135) phase = 'first_quarter';
  else if (elongation < 180) phase = 'waxing_gibbous';
  else if (elongation < 225) phase = 'full';
  else if (elongation < 270) phase = 'waning_gibbous';
  else if (elongation < 315) phase = 'last_quarter';
  else phase = 'waning_crescent';
  return { phase, lunarDay, illumination, isWaxing };
}

// Planet insight texts per condition
const PLANET_INSIGHTS: Record<string, Record<'strong'|'neutral'|'weak', { en: string; fr: string; ar: string }>> = {
  Sun: {
    strong:  { en: 'Your identity shines brightly — you lead with natural confidence.', fr: 'Votre identité brille naturellement — vous guidez avec assurance.', ar: 'هويتك تتألق بشكل طبيعي — تقود بثقة فطرية.' },
    neutral: { en: 'Your sense of self is steady — purpose emerges through intention.', fr: 'Votre sens de vous-même est stable — la détermination émerge par l\'intention.', ar: 'إحساسك بذاتك ثابت — تظهر الغاية من خلال النية.' },
    weak:    { en: 'Finding your purpose takes practice — self-trust is your lifelong path.', fr: 'Trouver votre but demande de la pratique — la confiance en soi est votre chemin.', ar: 'إيجاد هدفك يتطلب ممارسة — الثقة بالنفس هي درب حياتك.' },
  },
  Moon: {
    strong:  { en: 'Your emotional world flows naturally — intuition and empathy are your gifts.', fr: 'Votre monde émotionnel coule naturellement — l\'intuition est votre don.', ar: 'عالمك العاطفي يتدفق بسلاسة — الحدس والتعاطف هبتك.' },
    neutral: { en: 'Your emotional life is balanced — feelings guide you when you listen inward.', fr: 'Votre vie émotionnelle est équilibrée — les sentiments vous guident.', ar: 'حياتك العاطفية متوازنة — تقودك المشاعر حين تُصغي لداخلك.' },
    weak:    { en: 'Emotional sensitivity may feel intense — learning to honor your feelings is key.', fr: 'La sensibilité émotionnelle peut être intense — honorez vos sentiments.', ar: 'قد تبدو الحساسية العاطفية شديدة — تعلّم تكريم مشاعرك هو المفتاح.' },
  },
  Mercury: {
    strong:  { en: 'Your mind is sharp — ideas and communication flow with clarity.', fr: 'Votre esprit est vif — les idées et la communication coulent avec clarté.', ar: 'عقلك حاد — تتدفق الأفكار والتواصل بوضوح.' },
    neutral: { en: 'Your thinking is clear and practical — listening well serves you greatly.', fr: 'Votre pensée est claire et pratique — bien écouter vous sert beaucoup.', ar: 'تفكيرك واضح وعملي — حسن الإصغاء يخدمك بقدر الكلام.' },
    weak:    { en: 'Expressing ideas clearly may need effort — writing and reflection open new channels.', fr: 'Exprimer vos idées peut demander des efforts — l\'écriture ouvre de nouveaux canaux.', ar: 'التعبير عن أفكارك قد يحتاج جهدًا — الكتابة والتأمل يفتحان آفاقًا.' },
  },
  Venus: {
    strong:  { en: 'Harmony and deep connections come naturally to you.', fr: 'L\'harmonie et les liens profonds vous viennent naturellement.', ar: 'الانسجام والروابط العميقة تأتيك بشكل طبيعي.' },
    neutral: { en: 'Relationships reward consistent warmth and appreciation of beauty.', fr: 'Les relations récompensent la chaleur constante et l\'amour de la beauté.', ar: 'العلاقات تكافئ الدفء المستمر وتقدير الجمال.' },
    weak:    { en: 'Love and harmony require intentional care — patience builds lasting bonds.', fr: 'L\'amour et l\'harmonie nécessitent un soin intentionnel — la patience construit des liens durables.', ar: 'المحبة والانسجام يحتاجان عناية واعية — الصبر يبني روابط دائمة.' },
  },
  Mars: {
    strong:  { en: 'Your drive and courage are powerful — you act with decisive energy.', fr: 'Votre dynamisme et courage sont puissants — vous agissez avec énergie décisive.', ar: 'طاقتك وشجاعتك قويتان — تتصرف بطاقة حاسمة.' },
    neutral: { en: 'Your energy is well-directed — steady effort over time yields results.', fr: 'Votre énergie est bien orientée — un effort soutenu donne des résultats solides.', ar: 'طاقتك موجهة جيدًا — الجهد المنتظم يؤتي ثمارًا.' },
    weak:    { en: 'Motivation may ebb and flow — honoring rest is as important as pushing forward.', fr: 'La motivation peut fluctuer — honorer le repos est aussi important qu\'avancer.', ar: 'قد تتقلب الدوافع — احترام الراحة مهم بقدر المضي قدمًا.' },
  },
  Jupiter: {
    strong:  { en: 'Abundance and wisdom flow toward you naturally — opportunity finds you.', fr: 'L\'abondance et la sagesse vous viennent naturellement — les opportunités vous trouvent.', ar: 'الوفرة والحكمة تتدفقان نحوك — الفرص تجدك.' },
    neutral: { en: 'Growth comes through steady optimism and staying open to new possibilities.', fr: 'La croissance vient d\'un optimisme constant et d\'une ouverture aux possibilités.', ar: 'يأتي النمو بالتفاؤل المستمر والانفتاح على الإمكانيات.' },
    weak:    { en: 'Expansion requires conscious effort — seek growth through small, consistent steps.', fr: 'L\'expansion demande un effort conscient — cherchez la croissance par petites étapes.', ar: 'يتطلب التوسع جهدًا واعيًا — ابحث عن النمو بخطوات صغيرة.' },
  },
  Saturn: {
    strong:  { en: 'Discipline and structure are your allies — you build things designed to last.', fr: 'La discipline et la structure sont vos alliées — vous construisez pour durer.', ar: 'الانضباط والبنية حليفاك — تبني أشياء مصمّمة للدوام.' },
    neutral: { en: 'Responsibility comes naturally — clear boundaries help you keep your rhythm.', fr: 'La responsabilité vient naturellement — des limites claires aident votre rythme.', ar: 'تأتيك المسؤولية بشكل طبيعي — الحدود الواضحة تساعدك على إيقاعك.' },
    weak:    { en: 'Routines and structure may feel challenging — building them gradually pays off.', fr: 'Les routines peuvent sembler exigeantes — les construire graduellement porte ses fruits.', ar: 'قد تبدو الروتين تحديًا — بناؤها تدريجيًا يؤتي ثماره.' },
  },
};

const MOON_PHASE_LABEL: Record<string, { en: string; fr: string; ar: string }> = {
  new:            { en: '🌑 New Moon',          fr: '🌑 Nouvelle Lune',     ar: '🌑 القمر الجديد' },
  waxing_crescent:{ en: '🌒 Waxing Crescent',  fr: '🌒 Croissant Croissant',ar: '🌒 الهلال المتزايد' },
  first_quarter:  { en: '🌓 First Quarter',    fr: '🌓 Premier Quartier',  ar: '🌓 الربع الأول' },
  waxing_gibbous: { en: '🌔 Waxing Gibbous',   fr: '🌔 Gibbeuse Croissante',ar: '🌔 أحدب متزايد' },
  full:           { en: '🌕 Full Moon',         fr: '🌕 Pleine Lune',       ar: '🌕 البدر' },
  waning_gibbous: { en: '🌖 Waning Gibbous',   fr: '🌖 Gibbeuse Décroissante',ar: '🌖 أحدب متناقص' },
  last_quarter:   { en: '🌗 Last Quarter',     fr: '🌗 Dernier Quartier',  ar: '🌗 الربع الأخير' },
  waning_crescent:{ en: '🌘 Waning Crescent',  fr: '🌘 Croissant Décroissant',ar: '🌘 الهلال المتناقص' },
};

// Zodiac sign names
const ZODIAC_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const ZODIAC_FR = ['Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge', 'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'];
const ZODIAC_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const ZODIAC_ELEMENTS = ['fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water'];

// Element translations
const ELEMENT_NAMES: Record<string, Record<string, string>> = {
  fire: { en: 'Fire', fr: 'Feu', ar: 'نار' },
  earth: { en: 'Earth', fr: 'Terre', ar: 'تراب' },
  air: { en: 'Air', fr: 'Air', ar: 'هواء' },
  water: { en: 'Water', fr: 'Eau', ar: 'ماء' },
};

// ─── Plain-language Ascendant insights ────────────────────────────────
// Index matches ZODIAC sign index (0 = Aries … 11 = Pisces)
const ASCENDANT_INSIGHTS: { en: string; fr: string; ar: string }[] = [
  // 0 Aries
  {
    en: 'People perceive you as bold, energetic, and direct. You move through the world with purpose and rarely hesitate. First impressions of you are confident, dynamic, and refreshingly straightforward.',
    fr: 'Les gens vous perçoivent comme audacieux, énergique et direct. Vous traversez le monde avec intention et hésitez rarement. Les premières impressions que vous laissez sont assurées, dynamiques et directes.',
    ar: 'يرى الناس فيك شخصًا جريئًا وحيويًا وصريحًا. تتحرك في الحياة بهدف وقلما تتردد. انطباعك الأول على الآخرين واثق وديناميكي ومباشر.',
  },
  // 1 Taurus
  {
    en: 'People immediately sense calm, reliability, and a quiet strength in you. Your grounded presence puts others at ease. First impressions of you are warm, steady, and trustworthy.',
    fr: 'Les gens ressentent immédiatement en vous calme, fiabilité et force tranquille. Votre présence ancrée met les autres à l\'aise. Les premières impressions que vous laissez sont chaleureuses, stables et fiables.',
    ar: 'يشعر الناس فورًا بالهدوء والاتزان والقوة الهادئة فيك. حضورك يريح الآخرين. تبدو للناس دافئًا وموثوقًا ومستقرًا.',
  },
  // 2 Gemini
  {
    en: 'People see you as curious, quick-witted, and effortlessly talkative. You light up in conversation and seem to know a little about everything. First impressions of you are lively, intelligent, and engaging.',
    fr: 'Les gens vous voient comme curieux, spirituel et naturellement bavard. Vous vous épanouissez dans la conversation et semblez tout savoir un peu. Les premières impressions que vous laissez sont animées, intelligentes et captivantes.',
    ar: 'يراك الناس فضوليًا وذكيًا وسلس الحديث. تتألق في المحادثات وتبدو ملمًا بكثير من الأشياء. تبدو للناس حيويًا وذكيًا وجذابًا.',
  },
  // 3 Cancer
  {
    en: 'People perceive you as warm, caring, and deeply approachable. Your gentle presence makes others feel safe and understood. First impressions of you are nurturing, empathetic, and comforting.',
    fr: 'Les gens vous perçoivent comme chaleureux, attentionné et très accessible. Votre présence douce fait sentir aux autres qu\'ils sont en sécurité et compris. Les premières impressions sont bienveillantes, empathiques et rassurantes.',
    ar: 'يرى الناس فيك الدفء والاهتمام والترحيب. حضورك اللطيف يجعل الآخرين يشعرون بالأمان والفهم. تبدو للناس حنونًا ومتعاطفًا ومريحًا.',
  },
  // 4 Leo
  {
    en: 'People immediately notice you — confident, warm, and magnetically compelling. You seem to naturally belong wherever you are. First impressions of you are radiant, generous, and hard to ignore.',
    fr: 'Les gens vous remarquent immédiatement — confiant, chaleureux et magnétiquement captivant. Vous semblez naturellement à votre place partout. Les premières impressions que vous laissez sont rayonnantes, généreuses et difficiles à ignorer.',
    ar: 'يلاحظ الناس حضورك فورًا — واثق، دافئ وجاذب. تبدو في مكانك الطبيعي أينما كنت. تبدو للناس مشعًا وكريمًا ويصعب تجاهله.',
  },
  // 5 Virgo
  {
    en: 'People see you as composed, precise, and quietly observant. You carry yourself with modest competence and attention to detail. First impressions of you are intelligent, organized, and reliably helpful.',
    fr: 'Les gens vous voient comme composé, précis et discrètement observateur. Votre maintien reflète une compétence modeste et un sens du détail. Les premières impressions sont intelligentes, organisées et utiles.',
    ar: 'يرى الناس فيك الهدوء والدقة والملاحظة الذكية. تتصرف بكفاءة متواضعة واهتمام بالتفاصيل. تبدو للناس ذكيًا ومنظمًا ومفيدًا.',
  },
  // 6 Libra
  {
    en: 'People are charmed by your grace, diplomacy, and natural social ease. You make everyone around you feel seen and valued. First impressions of you are refined, fair-minded, and effortlessly attractive.',
    fr: 'Les gens sont charmés par votre grâce, votre diplomatie et votre aisance sociale naturelle. Vous faites sentir à chacun qu\'il est vu et valorisé. Les premières impressions sont raffinées, équitables et naturellement séduisantes.',
    ar: 'يُسحر الناس بلطفك ودبلوماسيتك وسهولة تواصلك. تجعل كل من حولك يشعر بالتقدير. تبدو للناس أنيقًا ومنصفًا وجذابًا بشكل طبيعي.',
  },
  // 7 Scorpio
  {
    en: 'People sense an intense, magnetic, and quietly mysterious energy from you. Your gaze alone communicates depth and inner power. First impressions of you are serious, perceptive, and unforgettable.',
    fr: 'Les gens ressentent en vous une énergie intense, magnétique et mystérieuse. Votre regard seul communique profondeur et puissance intérieure. Les premières impressions sont sérieuses, perspicaces et inoubliables.',
    ar: 'يشعر الناس بطاقة مكثفة وغامضة وقوية منك. نظرتك وحدها تعكس العمق والقوة الداخلية. تبدو للناس جادًا وثاقبًا ولا يُنسى.',
  },
  // 8 Sagittarius
  {
    en: 'People instantly perceive you as adventurous, optimistic, and refreshingly direct. You carry a philosophical energy that makes conversations feel expansive. First impressions of you are enthusiastic, free-spirited, and warm.',
    fr: 'Les gens vous perçoivent instantanément comme aventurier, optimiste et directement rafraîchissant. Vous portez une énergie philosophique qui élargit les conversations. Les premières impressions sont enthousiastes, libres et chaleureuses.',
    ar: 'يرى الناس فيك فورًا المغامرة والتفاؤل والصراحة. تحمل طاقة فكرية تجعل المحادثات أوسع. تبدو للناس متحمسًا وحرًا ودافئًا.',
  },
  // 9 Capricorn
  {
    en: 'People immediately read you as serious, capable, and quietly authoritative. You project a natural air of someone who has their life together. First impressions of you are disciplined, composed, and deeply trustworthy.',
    fr: 'Les gens vous lisent immédiatement comme sérieux, compétent et discrètement autoritaire. Vous dégagez naturellement l\'image de quelqu\'un qui maîtrise sa vie. Les premières impressions sont disciplinées, composées et profondément fiables.',
    ar: 'يقرأ الناس فيك فورًا الجدية والكفاءة والهيبة الهادئة. تُوحي بصورة طبيعية بأنك مسؤول ومتحكم في حياتك. تبدو للناس منضبطًا وهادئًا وجديرًا بالثقة.',
  },
  // 10 Aquarius
  {
    en: 'People see you as unique, unconventional, and quietly ahead of the crowd. You carry a friendly independence that naturally sparks curiosity. First impressions of you are original, progressive, and refreshingly different.',
    fr: 'Les gens vous voient comme unique, non conventionnel et discrètement en avance. Vous dégagez une indépendance amicale qui éveille naturellement la curiosité. Les premières impressions sont originales, progressistes et différentes.',
    ar: 'يرى الناس فيك التميز وعدم التقليد والتقدم الهادئ. تحمل استقلالية ودية تثير الفضول بشكل طبيعي. تبدو للناس أصيلًا وتقدميًا ومختلفًا.',
  },
  // 11 Pisces
  {
    en: 'People sense a gentle, dreamy, and deeply compassionate soul when they meet you. Your soft presence makes others feel immediately understood. First impressions of you are sensitive, spiritual, and quietly enchanting.',
    fr: 'Les gens perçoivent une âme douce, rêveuse et profondément compatissante lorsqu\'ils vous rencontrent. Votre présence douce leur donne l\'impression d\'être immédiatement compris. Les premières impressions sont sensibles, spirituelles et doucement charmantes.',
    ar: 'يحس الناس بروح لطيفة وحالمة وعميقة التعاطف عند لقائك. حضورك الهادئ يجعلهم يشعرون بأنهم مفهومون فورًا. تبدو للناس حساسًا وروحانيًا وساحرًا بهدوء.',
  },
];

// ─── Plain-language Descendant insights ────────────────────────────────
// Index matches the DESCENDANT sign index (= (ascendantIndex + 6) % 12)
const DESCENDANT_INSIGHTS: { en: string; fr: string; ar: string }[] = [
  // 0 Aries Descendant
  {
    en: 'You are drawn to bold, action-oriented, and fiercely independent partners. You need someone who takes initiative and challenges you to grow. You may attract courageous, direct, and energetic people into your life.',
    fr: 'Vous êtes attiré par des partenaires audacieux, orientés vers l\'action et résolument indépendants. Vous avez besoin de quelqu\'un qui prend l\'initiative et vous pousse à grandir. Vous attirerez des personnes courageuses, directes et énergiques.',
    ar: 'تنجذب إلى شركاء جريئين موجهين نحو الفعل ومستقلين. تحتاج شخصًا يأخذ المبادرة ويحفزك على النمو. تجذب في حياتك أشخاصًا شجعانًا ومباشرين وحيويين.',
  },
  // 1 Taurus Descendant
  {
    en: 'You are drawn to grounded, sensual, and deeply loyal partners. You crave stability, warmth, and someone whose calm presence brings you ease. You may attract patient, dependable, and steadfast souls.',
    fr: 'Vous êtes attiré par des partenaires ancrés, sensuels et profondément loyaux. Vous ressentez le besoin de stabilité, de chaleur et de quelqu\'un dont la présence calme vous apaise. Vous attirerez des âmes patientes, fiables et constantes.',
    ar: 'تنجذب إلى شركاء متجذرين وحسيين وأوفياء. تشتاق إلى الاستقرار والدفء وشخص هادئ يريحك. تجذب أرواحًا صبورة وموثوقة وثابتة.',
  },
  // 2 Gemini Descendant
  {
    en: 'You are drawn to curious, communicative, and mentally agile partners. You need someone who stimulates your mind and keeps conversations alive. You may attract witty, adaptable, and endlessly interesting people.',
    fr: 'Vous êtes attiré par des partenaires curieux, communicatifs et mentalement agiles. Vous avez besoin de quelqu\'un qui stimule votre esprit et maintient les conversations vivantes. Vous attirerez des personnes spirituelles, adaptables et infiniment intéressantes.',
    ar: 'تنجذب إلى شركاء فضوليين وتواصليين وأذكياء ذهنيًا. تحتاج من يحفز عقلك ويُبقي المحادثات حية. تجذب أشخاصًا ظرفاء ومرنين ومثيرين للاهتمام.',
  },
  // 3 Cancer Descendant
  {
    en: 'You are drawn to nurturing, emotionally available, and deeply caring partners. You need someone who creates a sense of home and emotional safety around you. You may attract sensitive, devoted, and family-oriented souls.',
    fr: 'Vous êtes attiré par des partenaires bienveillants, émotionnellement disponibles et profondément attentionnés. Vous avez besoin de quelqu\'un qui crée un foyer et une sécurité émotionnelle autour de vous. Vous attirerez des âmes sensibles, dévouées et familiales.',
    ar: 'تنجذب إلى شركاء راعين ومتاحين عاطفيًا وعميقي الاهتمام. تحتاج شخصًا يصنع لك شعورًا بالبيت والأمان العاطفي. تجذب أرواحًا حساسة ومتفانية وعائلية.',
  },
  // 4 Leo Descendant
  {
    en: 'You are drawn to warm, generous, and vividly expressive partners. You need someone who brings joy, creativity, and heartfelt confidence into your world. You may attract passionate, dramatic, and fiercely loyal people.',
    fr: 'Vous êtes attiré par des partenaires chaleureux, généreux et expressifs. Vous avez besoin de quelqu\'un qui apporte joie, créativité et confiance sincère dans votre vie. Vous attirerez des personnes passionnées, expressives et profondément fidèles.',
    ar: 'تنجذب إلى شركاء دافئين وكرماء وتعبيريين. تحتاج من يجلب الفرح والإبداع والثقة إلى حياتك. تجذب أشخاصًا متحمسين وبارزين وأوفياء بشدة.',
  },
  // 5 Virgo Descendant
  {
    en: 'You are drawn to practical, thoughtful, and quietly devoted partners. You need someone who pays attention to the small things that matter. You may attract analytical, detail-oriented, and genuinely helpful souls.',
    fr: 'Vous êtes attiré par des partenaires pratiques, réfléchis et discrètement dévoués. Vous avez besoin de quelqu\'un qui fait attention aux petites choses qui comptent. Vous attirerez des âmes analytiques, soucieuses du détail et véritablement serviables.',
    ar: 'تنجذب إلى شركاء عمليين ومتأملين ومتفانين بهدوء. تحتاج من يهتم بالأشياء الصغيرة المهمة. تجذب أرواحًا تحليلية دقيقة وحريصة على المساعدة.',
  },
  // 6 Libra Descendant
  {
    en: 'You are drawn to harmonious, fair-minded, and socially graceful partners. You need someone who brings balance, beauty, and a calming presence into your life. You may attract diplomatic, cultured, and relationship-focused people.',
    fr: 'Vous êtes attiré par des partenaires harmonieux, équitables et socialement élégants. Vous avez besoin de quelqu\'un qui apporte équilibre, beauté et sérénité dans votre vie. Vous attirerez des personnes diplomatiques, cultivées et centrées sur la relation.',
    ar: 'تنجذب إلى شركاء متناغمين وعادلين وأنيقين اجتماعيًا. تحتاج من يجلب التوازن والجمال والهدوء إلى حياتك. تجذب أشخاصًا دبلوماسيين ومثقفين ومهتمين بالعلاقة.',
  },
  // 7 Scorpio Descendant
  {
    en: 'You are drawn to intense, deeply loyal, and passionately transformative partners. You need emotional depth, raw honesty, and a connection that goes far beneath the surface. You may attract powerful, magnetic, and complex souls.',
    fr: 'Vous êtes attiré par des partenaires intenses, profondément loyaux et transformateurs. Vous avez besoin de profondeur émotionnelle, d\'honnêteté brute et d\'une connexion qui dépasse les apparences. Vous attirerez des âmes puissantes, magnétiques et complexes.',
    ar: 'تنجذب إلى شركاء مكثفين وأوفياء وقادرين على التحول. تحتاج العمق العاطفي والصدق الحقيقي واتصالًا يتخطى السطح. تجذب أرواحًا قوية وجاذبة ومعقدة.',
  },
  // 8 Sagittarius Descendant
  {
    en: 'You are drawn to free-spirited, adventurous, and philosophically expansive partners. You need someone who broadens your horizons and shares your love of discovery. You may attract optimistic, worldly, and intellectually generous people.',
    fr: 'Vous êtes attiré par des partenaires libres, aventuriers et philosophiquement ouverts. Vous avez besoin de quelqu\'un qui élargit vos horizons et partage votre amour de la découverte. Vous attirerez des personnes optimistes, ouvertes sur le monde et généreuses intellectuellement.',
    ar: 'تنجذب إلى شركاء أحرار ومغامرين وفلسفيين. تحتاج من يوسِّع آفاقك ويشاركك حب الاستكشاف. تجذب أشخاصًا متفائلين ومنفتحين على العالم وكرماء فكريًا.',
  },
  // 9 Capricorn Descendant
  {
    en: 'You are drawn to ambitious, structured, and dependably responsible partners. You need someone with clear direction and a steady sense of purpose. You may attract achievement-driven, disciplined, and quietly powerful souls.',
    fr: 'Vous êtes attiré par des partenaires ambitieux, structurés et fiablement responsables. Vous avez besoin de quelqu\'un avec une direction claire et un sens ferme de l\'objectif. Vous attirerez des âmes orientées vers la réussite, disciplinées et discrètement puissantes.',
    ar: 'تنجذب إلى شركاء طموحين ومنظمين ومتحملين للمسؤولية. تحتاج شخصًا ذا هدف واضح وإحساس ثابت بالغاية. تجذب أرواحًا طموحة ومنضبطة وهادئة القوة.',
  },
  // 10 Aquarius Descendant
  {
    en: 'You are drawn to original, independent, and intellectually progressive partners. You need someone who thinks for themselves and respects your need for authentic expression. You may attract unconventional, visionary, and socially conscious people.',
    fr: 'Vous êtes attiré par des partenaires originaux, indépendants et intellectuellement progressifs. Vous avez besoin de quelqu\'un qui pense par lui-même et respecte votre besoin d\'expression authentique. Vous attirerez des personnes non conventionnelles, visionnaires et socialement conscientes.',
    ar: 'تنجذب إلى شركاء أصيلين ومستقلين ومتقدمين فكريًا. تحتاج من يفكر باستقلالية ويحترم رغبتك في التعبير الحقيقي. تجذب أشخاصًا غير تقليديين وذوي رؤية ووعي اجتماعي.',
  },
  // 11 Pisces Descendant
  {
    en: 'You are drawn to sensitive, imaginative, and spiritually open partners. You need someone who brings depth, compassion, and a touch of magic into your world. You may attract dreamy, empathetic, and creatively gifted souls.',
    fr: 'Vous êtes attiré par des partenaires sensibles, imaginatifs et spirituellement ouverts. Vous avez besoin de quelqu\'un qui apporte profondeur, compassion et une touche de magie dans votre vie. Vous attirerez des âmes rêveuses, empathiques et créativement douées.',
    ar: 'تنجذب إلى شركاء حساسين ومبتكرين ومنفتحين روحيًا. تحتاج من يُضفي على عالمك العمق والرحمة ولمسة من السحر. تجذب أرواحًا حالمة ومتعاطفة وموهوبة إبداعيًا.',
  },
];

interface BirthProfileTabProps {
  data: IstikharaData & { birthProfile?: BirthProfile };
  elementColor: string;
}

interface CalculatedData {
  moonSign: { burjIndex: number; degree: number } | null;
  ascendant: { burjIndex: number; degree: number } | null;
  descendant: { burjIndex: number; degree: number } | null;
}

function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    fire: '#ef4444',
    earth: '#84cc16',
    air: '#06b6d4',
    water: '#3b82f6',
  };
  return colors[element.toLowerCase()] || '#8b5cf6';
}

// Skeleton Loading Component
function SkeletonCard({ delay = 0 }: { delay?: number }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          delay,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay, shimmerAnim]);
  
  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });
  
  return (
    <View style={styles.skeletonCard}>
      <Animated.View style={[styles.skeletonGradient, { opacity }]}>
        <View style={styles.skeletonHeader}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonTitle} />
        </View>
        <View style={styles.skeletonContent}>
          <View style={styles.skeletonSymbol} />
          <View style={styles.skeletonName} />
        </View>
        <View style={styles.skeletonBadge} />
      </Animated.View>
    </View>
  );
}

function LoadingState({ language, elementColor }: { language: string; elementColor: string }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    // Rotating animation for the star
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotateAnim, scaleAnim]);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Animated Header */}
        <View style={styles.loadingHeader}>
          <Animated.View style={{ transform: [{ rotate }, { scale: scaleAnim }] }}>
            <LinearGradient
              colors={[elementColor, `${elementColor}80`]}
              style={styles.loadingIconContainer}
            >
              <Sparkles size={32} color="#ffffff" />
            </LinearGradient>
          </Animated.View>
          <Text style={styles.loadingTitle}>
            {language === 'ar' 
              ? 'جاري حساب ملفك الفلكي'
              : language === 'fr'
                ? 'Calcul de votre thème natal'
                : 'Calculating Your Birth Chart'}
          </Text>
          <Text style={styles.loadingSubtitle}>
            {language === 'ar' 
              ? 'نقوم بحساب مواقع الكواكب...'
              : language === 'fr'
                ? 'Calcul des positions planétaires...'
                : 'Computing planetary positions...'}
          </Text>
        </View>
        
        {/* Skeleton Cards Row 1 */}
        <View style={styles.signsRow}>
          <SkeletonCard delay={0} />
          <SkeletonCard delay={200} />
        </View>
        
        {/* Skeleton Cards Row 2 */}
        <View style={styles.signsRow}>
          <SkeletonCard delay={400} />
          <SkeletonCard delay={600} />
        </View>
        
        {/* Loading Progress */}
        <View style={styles.loadingProgress}>
          <ActivityIndicator size="small" color={elementColor} />
          <Text style={styles.loadingProgressText}>
            {language === 'ar' 
              ? 'الرجاء الانتظار...'
              : language === 'fr'
                ? 'Veuillez patienter...'
                : 'Please wait...'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SignCard({ 
  title, 
  icon: Icon,
  iconColor,
  signIndex, 
  degree,
  showDegree = false,
  locked = false,
  lockedMessage,
}: { 
  title: string;
  icon: any;
  iconColor: string;
  signIndex: number | null;
  degree?: number;
  showDegree?: boolean;
  locked?: boolean;
  lockedMessage?: string;
}) {
  const { language } = useLanguage();
  
  if (locked || signIndex === null) {
    const defaultLockedMessage = language === 'ar' 
      ? 'أضف وقت الميلاد للفتح'
      : language === 'fr'
        ? 'Ajoutez l\'heure de naissance pour débloquer'
        : 'Add birth time to unlock';
    
    return (
      <View style={[styles.signCard, styles.signCardLocked]}>
        <View style={styles.signCardHeader}>
          <View style={[styles.signIconContainer, { backgroundColor: 'rgba(100, 100, 100, 0.2)' }]}>
            <Lock size={24} color="rgba(255, 255, 255, 0.4)" />
          </View>
          <Text style={styles.signTitle}>{title}</Text>
        </View>
        <View style={styles.lockedContent}>
          <Text style={styles.lockedText}>
            {lockedMessage || defaultLockedMessage}
          </Text>
        </View>
      </View>
    );
  }

  const signName = language === 'ar' ? ZODIAC_AR[signIndex] : language === 'fr' ? ZODIAC_FR[signIndex] : ZODIAC_EN[signIndex];
  const symbol = ZODIAC_SYMBOLS[signIndex];
  const element = ZODIAC_ELEMENTS[signIndex];
  const elementColor = getElementColor(element);
  const elementName = ELEMENT_NAMES[element]?.[language] || ELEMENT_NAMES[element]?.en || element;

  return (
    <View style={[styles.signCard, { borderColor: `${elementColor}40` }]}>
      <LinearGradient
        colors={[`${elementColor}15`, `${elementColor}08`]}
        style={styles.signCardGradient}
      >
        <View style={styles.signCardHeader}>
          <View style={[styles.signIconContainer, { backgroundColor: `${iconColor}20` }]}>
            <Icon size={24} color={iconColor} />
          </View>
          <Text style={styles.signTitle}>{title}</Text>
        </View>
        
        <View style={styles.signDetails}>
          <Text style={styles.signSymbol}>{symbol}</Text>
          <View style={styles.signNameContainer}>
            <Text style={styles.signName}>{signName}</Text>
            {showDegree && degree !== undefined && (
              <Text style={styles.signDegree}>{degree.toFixed(1)}°</Text>
            )}
          </View>
        </View>

        <View style={[styles.elementBadge, { backgroundColor: `${elementColor}30` }]}>
          <Text style={[styles.elementBadgeText, { color: elementColor }]}>
            {elementName.toUpperCase()}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

function InsightCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <View style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <Text style={styles.insightEmoji}>{emoji}</Text>
        <Text style={styles.insightTitle}>{title}</Text>
      </View>
      <Text style={styles.insightText}>{text}</Text>
    </View>
  );
}

export default function BirthProfileTab({ data, elementColor }: BirthProfileTabProps) {
  const { t, language } = useLanguage();
  const [calculatedData, setCalculatedData] = useState<CalculatedData>({
    moonSign: null,
    ascendant: null,
    descendant: null,
  });
  const [loading, setLoading] = useState(true);
  const [planets, setPlanets] = useState<Array<{
    planet: string;
    sign: string;
    signIndex: number;
    degree: number;
    condition: 'strong' | 'neutral' | 'weak';
  }>>([]);
  const [moonTiming, setMoonTiming] = useState<{
    phase: string;
    lunarDay: number;
    illumination: number;
    isWaxing: boolean;
  } | null>(null);
  const [moonExpanded, setMoonExpanded] = useState(false);

  const birthProfile = data.birthProfile;
  const hasBirthTime = birthProfile?.hasBirthTime ?? false;
  const hasLocation = !!birthProfile?.birthLocation;
  
  // Calculate Moon Sign, Ascendant, and Descendant
  useEffect(() => {
    const calculateBirthChart = async () => {
      if (!birthProfile) {
        console.log('[BirthProfileTab] No birth profile data');
        setLoading(false);
        return;
      }

      console.log('[BirthProfileTab] Calculating with:', {
        dobISO: birthProfile.dobISO,
        birthTime: birthProfile.birthTime,
        hasBirthTime: birthProfile.hasBirthTime,
        hasLocation: !!birthProfile.birthLocation,
        birthLocation: birthProfile.birthLocation,
        timezone: birthProfile.timezone,
      });

      try {
        setLoading(true);
        let moonIndex = null;
        let moonDegree = 0;
        let ascIndex = null;
        let ascDegree = 0;
        let descIndex = null;
        let descDegree = 0;
        
        // Use same approach as profile.tsx for timezone fallback
        const timezone = birthProfile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

        // Calculate Moon Sign (use exact time if available for accuracy)
        if (birthProfile.dobISO) {
          try {
            // ParsedobISO safely - it should be YYYY-MM-DD format
            const dateParts = birthProfile.dobISO.split('-');
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            const day = parseInt(dateParts[2], 10);
            
            console.log('[BirthProfileTab] Parsed date parts:', { year, month, day, raw: birthProfile.dobISO });
            
            if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
              console.error('[BirthProfileTab] Invalid dobISO format:', birthProfile.dobISO);
            } else {
              // Create date using UTC to avoid timezone issues
              let birthDate: Date;
              
              if (birthProfile.hasBirthTime && birthProfile.birthTime) {
                const timeParts = birthProfile.birthTime.split(':');
                const hours = parseInt(timeParts[0], 10);
                const minutes = parseInt(timeParts[1], 10);
                
                if (Number.isFinite(hours) && Number.isFinite(minutes)) {
                  birthDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
                } else {
                  // Invalid time - use noon UTC
                  birthDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
                }
              } else {
                // No birth time - use noon UTC as approximation
                birthDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
              }
              
              console.log('[BirthProfileTab] Created birthDate:', birthDate.toISOString());
              
              if (!isNaN(birthDate.getTime())) {
                const positions = await getPlanetPositions(birthDate, timezone);
                
                if (positions) {
                  if (positions.planets?.moon?.longitude) {
                    const moonLon = positions.planets.moon.longitude;
                    moonIndex = Math.floor(moonLon / 30);
                    moonDegree = moonLon % 30;
                    console.log('[BirthProfileTab] Moon calculation:', { moonLon, moonIndex, moonDegree });
                  }

                  // Compute all 7 classical planets with conditions
                  const planetKeys: Array<{ name: string; key: keyof typeof positions.planets }> = [
                    { name: 'Sun', key: 'sun' },
                    { name: 'Moon', key: 'moon' },
                    { name: 'Mercury', key: 'mercury' },
                    { name: 'Venus', key: 'venus' },
                    { name: 'Mars', key: 'mars' },
                    { name: 'Jupiter', key: 'jupiter' },
                    { name: 'Saturn', key: 'saturn' },
                  ];
                  const computedPlanets = planetKeys
                    .filter(p => positions.planets[p.key]?.longitude !== undefined)
                    .map(p => {
                      const lon = ((positions.planets[p.key].longitude % 360) + 360) % 360;
                      const signIndex = Math.floor(lon / 30);
                      const degree = lon % 30;
                      const sign = ZODIAC_EN[signIndex];
                      return { planet: p.name, sign, signIndex, degree, condition: computePlanetCondition(p.name, sign) };
                    });
                  setPlanets(computedPlanets);

                  // Compute moon timing from sun + moon longitudes
                  if (positions.planets.sun?.longitude && positions.planets.moon?.longitude) {
                    setMoonTiming(computeMoonTiming(positions.planets.sun.longitude, positions.planets.moon.longitude));
                  }
                }
              }
            }
          } catch (dateError) {
            console.error('[BirthProfileTab] Error parsing date for moon calculation:', dateError);
          }
        }

        // Calculate Ascendant & Descendant (requires birth time + location)
        const canCalcAsc = birthProfile.hasBirthTime && birthProfile.birthLocation && birthProfile.birthTime;
        console.log('[BirthProfileTab] Can calculate ascendant:', canCalcAsc);
        
        if (canCalcAsc) {
          console.log('[BirthProfileTab] Calling calculateAscendantSync with:', {
            dobISO: birthProfile.dobISO,
            birthTime: birthProfile.birthTime,
            timezone: timezone,
            location: birthProfile.birthLocation,
          });
          
          const ascResult = calculateAscendantSync(
            birthProfile.dobISO,
            birthProfile.birthTime!,
            timezone,
            birthProfile.birthLocation!
          );
          
          console.log('[BirthProfileTab] Ascendant result:', ascResult);
          
          if (ascResult) {
            ascIndex = ascResult.burjIndex;
            ascDegree = ascResult.degree;
            // Descendant is opposite (180°) from Ascendant
            descIndex = (ascResult.burjIndex + 6) % 12;
            descDegree = ascResult.degree;
          }
        }

        setCalculatedData({
          moonSign: moonIndex !== null ? { burjIndex: moonIndex, degree: moonDegree } : null,
          ascendant: ascIndex !== null ? { burjIndex: ascIndex, degree: ascDegree } : null,
          descendant: descIndex !== null ? { burjIndex: descIndex, degree: descDegree } : null,
        });
      } catch (error) {
        console.error('[BirthProfileTab] Error calculating birth chart:', error);
      } finally {
        setLoading(false);
      }
    };

    calculateBirthChart();
  }, [birthProfile]);

  if (!birthProfile) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {language === 'ar' 
            ? 'بيانات الملف الفلكي غير متوفرة. يرجى استخدام طريقة تاريخ الميلاد لرؤية ملفك الفلكي.'
            : language === 'fr'
              ? 'Données du profil de naissance non disponibles. Veuillez utiliser la méthode de date de naissance pour voir votre thème natal.'
              : 'Birth profile data not available. Please use the Birth Date method to see your birth chart.'}
        </Text>
      </View>
    );
  }

  if (loading) {
    return <LoadingState language={language} elementColor={elementColor} />;
  }

  const sunSignIndex = birthProfile.sunSign.burjIndex;
  const canCalculateAscendant = hasBirthTime && hasLocation;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Summary chips banner */}
        <View style={styles.chipsBanner}>
          <View style={styles.chip}>
            <Text style={styles.chipEmoji}>☀️</Text>
            <Text style={styles.chipText}>
              {language === 'ar' ? ZODIAC_AR[sunSignIndex] : language === 'fr' ? ZODIAC_FR[sunSignIndex] : ZODIAC_EN[sunSignIndex]}
            </Text>
          </View>
          {calculatedData.moonSign !== null && (
            <View style={styles.chip}>
              <Text style={styles.chipEmoji}>🌙</Text>
              <Text style={styles.chipText}>
                {language === 'ar' ? ZODIAC_AR[calculatedData.moonSign.burjIndex] : language === 'fr' ? ZODIAC_FR[calculatedData.moonSign.burjIndex] : ZODIAC_EN[calculatedData.moonSign.burjIndex]}
              </Text>
            </View>
          )}
          {calculatedData.ascendant !== null && (
            <View style={styles.chip}>
              <Text style={styles.chipEmoji}>⬆️</Text>
              <Text style={styles.chipText}>
                {language === 'ar'
                  ? `${ZODIAC_AR[calculatedData.ascendant.burjIndex]} طالع`
                  : language === 'fr'
                    ? `${ZODIAC_FR[calculatedData.ascendant.burjIndex]} Asc`
                    : `${ZODIAC_EN[calculatedData.ascendant.burjIndex]} Rising`}
              </Text>
            </View>
          )}
          <View style={[styles.chip, styles.chipElement, { borderColor: `${getElementColor(ZODIAC_ELEMENTS[sunSignIndex])}60` }]}>
            <Text style={[styles.chipText, { color: getElementColor(ZODIAC_ELEMENTS[sunSignIndex]) }]}>
              {ELEMENT_NAMES[ZODIAC_ELEMENTS[sunSignIndex]]?.[language] || ELEMENT_NAMES[ZODIAC_ELEMENTS[sunSignIndex]]?.en}
            </Text>
          </View>
        </View>

        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>
            {language === 'ar' ? 'ملفك الفلكي' : language === 'fr' ? 'Votre Profil de Naissance' : 'Your Birth Profile'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {language === 'ar' 
              ? 'الشمس والقمر والطالع من تاريخ ميلادك' 
              : language === 'fr' 
                ? 'Positions du Soleil, de la Lune et de l\'Ascendant à votre naissance'
                : 'Sun, Moon, and Rising Sign positions at your birth'}
          </Text>
        </View>

        {/* Primary Signs Row */}
        <View style={styles.signsRow}>
          {/* Sun Sign */}
          <SignCard
            title={language === 'ar' ? 'برج الشمس' : language === 'fr' ? 'Signe Solaire' : 'Sun Sign'}
            icon={Sun}
            iconColor="#fbbf24"
            signIndex={sunSignIndex}
          />

          {/* Moon Sign */}
          <SignCard
            title={language === 'ar' ? 'برج القمر' : language === 'fr' ? 'Signe Lunaire' : 'Moon Sign'}
            icon={Moon}
            iconColor="#94a3b8"
            signIndex={calculatedData.moonSign?.burjIndex ?? null}
            degree={calculatedData.moonSign?.degree}
            showDegree={true}
            locked={!calculatedData.moonSign}
            lockedMessage={language === 'ar' ? 'جاري الحساب...' : language === 'fr' ? 'Calcul en cours...' : 'Calculating...'}
          />
        </View>

        {/* Ascendant/Descendant Row */}
        <View style={styles.signsRow}>
          {/* Ascendant */}
          <SignCard
            title={language === 'ar' ? 'الطالع' : language === 'fr' ? 'Ascendant' : 'Ascendant'}
            icon={Sunrise}
            iconColor="#f472b6"
            signIndex={calculatedData.ascendant?.burjIndex ?? null}
            degree={calculatedData.ascendant?.degree}
            showDegree={true}
            locked={!canCalculateAscendant && !calculatedData.ascendant}
            lockedMessage={
              canCalculateAscendant && !calculatedData.ascendant
                ? (language === 'ar' ? 'جاري الحساب...' : language === 'fr' ? 'Calcul en cours...' : 'Calculating...')
                : !hasBirthTime 
                  ? (language === 'ar' ? 'أضف وقت الميلاد للفتح' : language === 'fr' ? 'Ajoutez l\'heure de naissance' : 'Add birth time to unlock')
                  : (language === 'ar' ? 'أضف موقع الميلاد' : language === 'fr' ? 'Ajoutez le lieu de naissance' : 'Add birth location to unlock')
            }
          />

          {/* Descendant */}
          <SignCard
            title={language === 'ar' ? 'الغارب' : language === 'fr' ? 'Descendant' : 'Descendant'}
            icon={Sunset}
            iconColor="#a78bfa"
            signIndex={calculatedData.descendant?.burjIndex ?? null}
            degree={calculatedData.descendant?.degree}
            showDegree={true}
            locked={!canCalculateAscendant && !calculatedData.descendant}
            lockedMessage={
              canCalculateAscendant && !calculatedData.descendant
                ? (language === 'ar' ? 'جاري الحساب...' : language === 'fr' ? 'Calcul en cours...' : 'Calculating...')
                : !hasBirthTime 
                  ? (language === 'ar' ? 'أضف وقت الميلاد للفتح' : language === 'fr' ? 'Ajoutez l\'heure de naissance' : 'Add birth time to unlock')
                  : (language === 'ar' ? 'أضف موقع الميلاد' : language === 'fr' ? 'Ajoutez le lieu de naissance' : 'Add birth location to unlock')
            }
          />
        </View>

        {/* Ascendant insight — only when actually calculated */}
        {calculatedData.ascendant !== null && (
          <InsightCard
            emoji="🪞"
            title={
              language === 'ar' ? 'كيف يراك العالم' :
              language === 'fr' ? 'Comment le monde vous voit' :
              'How the world sees you'
            }
            text={
              (ASCENDANT_INSIGHTS[calculatedData.ascendant.burjIndex] as any)?.[language as 'en'|'fr'|'ar'] ||
              ASCENDANT_INSIGHTS[calculatedData.ascendant.burjIndex].en
            }
          />
        )}

        {/* Descendant insight — only when actually calculated */}
        {calculatedData.descendant !== null && (
          <InsightCard
            emoji="🤝"
            title={
              language === 'ar' ? 'ما تبحث عنه في الآخرين' :
              language === 'fr' ? 'Ce que vous cherchez chez les autres' :
              'What you seek in relationships'
            }
            text={
              (DESCENDANT_INSIGHTS[calculatedData.descendant.burjIndex] as any)?.[language as 'en'|'fr'|'ar'] ||
              DESCENDANT_INSIGHTS[calculatedData.descendant.burjIndex].en
            }
          />
        )}

        {/* Info Message */}
        {!canCalculateAscendant && (
          <View style={styles.infoBox}>
            <Lock size={16} color="#94a3b8" />
            <Text style={styles.infoText}>
              {language === 'ar' 
                ? 'أضف وقت ميلادك وموقعك لفتح الطالع والغارب'
                : language === 'fr'
                  ? 'Ajoutez votre heure et lieu de naissance pour débloquer votre Ascendant et Descendant'
                  : 'Add your birth time and location to unlock your Ascendant and Descendant signs'}
            </Text>
          </View>
        )}

        {/* Planets section */}
        {planets.length > 0 && (
          <View style={styles.planetsCard}>
            <Text style={styles.planetsTitle}>
              {language === 'ar' ? '🪐 الكواكب' : language === 'fr' ? '🪐 Planètes' : '🪐 Planets'}
            </Text>
            {planets.map((p, i) => {
              const insightData = PLANET_INSIGHTS[p.planet]?.[p.condition];
              const insight = insightData ? (language === 'ar' ? insightData.ar : language === 'fr' ? insightData.fr : insightData.en) : '';
              const signLabel = language === 'ar' ? ZODIAC_AR[p.signIndex] : language === 'fr' ? ZODIAC_FR[p.signIndex] : ZODIAC_EN[p.signIndex];
              const conditionColor = p.condition === 'strong' ? '#22c55e' : p.condition === 'weak' ? '#ef4444' : '#94a3b8';
              const conditionBg = p.condition === 'strong' ? '#22c55e22' : p.condition === 'weak' ? '#ef444422' : '#64748b22';
              return (
                <View key={i} style={styles.planetRow}>
                  <View style={styles.planetRowTop}>
                    <Text style={styles.planetName}>
                      {language === 'ar'
                        ? { Sun: 'الشمس', Moon: 'القمر', Mercury: 'عطارد', Venus: 'الزهرة', Mars: 'المريخ', Jupiter: 'المشتري', Saturn: 'زحل' }[p.planet] || p.planet
                        : language === 'fr'
                          ? { Sun: 'Soleil', Moon: 'Lune', Mercury: 'Mercure', Venus: 'Vénus', Mars: 'Mars', Jupiter: 'Jupiter', Saturn: 'Saturne' }[p.planet] || p.planet
                          : p.planet}
                    </Text>
                    <Text style={styles.planetSign}>{signLabel} {p.degree.toFixed(1)}°</Text>
                    <View style={[styles.conditionBadge, { backgroundColor: conditionBg }]}>
                      <Text style={[styles.conditionText, { color: conditionColor }]}>
                        {p.condition === 'strong'
                          ? (language === 'ar' ? 'قوي' : language === 'fr' ? 'Fort' : 'Strong')
                          : p.condition === 'weak'
                            ? (language === 'ar' ? 'ضعيف' : language === 'fr' ? 'Faible' : 'Weak')
                            : (language === 'ar' ? 'محايد' : language === 'fr' ? 'Neutre' : 'Neutral')}
                      </Text>
                    </View>
                  </View>
                  {insight ? <Text style={styles.planetInsight}>💡 {insight}</Text> : null}
                </View>
              );
            })}
          </View>
        )}

        {/* Moon timing card */}
        {moonTiming && (
          <View style={styles.moonCard}>
            <View style={styles.moonCardHeader}>
              <Text style={styles.moonCardTitle}>
                {language === 'ar' ? '🌙 توقيت القمر' : language === 'fr' ? '🌙 Timing Lunaire' : '🌙 Moon Timing'}
              </Text>
              <Pressable onPress={() => setMoonExpanded(!moonExpanded)} style={styles.moonToggle}>
                <Text style={styles.moonToggleText}>
                  {moonExpanded
                    ? (language === 'ar' ? 'إخفاء' : language === 'fr' ? 'Masquer' : 'Hide details')
                    : (language === 'ar' ? 'التفاصيل' : language === 'fr' ? 'Détails' : 'See details')}
                </Text>
                <Ionicons name={moonExpanded ? 'chevron-up' : 'chevron-down'} size={14} color="#8B7BF7" />
              </Pressable>
            </View>
            <Text style={styles.moonPhase}>
              {MOON_PHASE_LABEL[moonTiming.phase]?.[language as 'en'|'fr'|'ar'] || moonTiming.phase}
              {' • '}
              {moonTiming.isWaxing
                ? (language === 'ar' ? '↑ متزايد' : language === 'fr' ? '↑ Croissant' : '↑ Waxing')
                : (language === 'ar' ? '↓ متناقص' : language === 'fr' ? '↓ Décroissant' : '↓ Waning')}
            </Text>
            {moonExpanded && (
              <>
                <View style={styles.moonRow}>
                  <Text style={styles.moonLabel}>
                    {language === 'ar' ? 'اليوم القمري' : language === 'fr' ? 'Jour Lunaire' : 'Lunar Day'}
                  </Text>
                  <Text style={styles.moonValue}>{moonTiming.lunarDay}</Text>
                </View>
                <View style={styles.moonRow}>
                  <Text style={styles.moonLabel}>
                    {language === 'ar' ? 'الإضاءة' : language === 'fr' ? 'Illumination' : 'Illumination'}
                  </Text>
                  <View style={styles.moonProgressBar}>
                    <View style={[styles.moonProgressFill, { width: `${moonTiming.illumination}%` as any }]} />
                    <Text style={styles.moonProgressText}>{moonTiming.illumination}%</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        )}

        {/* Birth Data Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {language === 'ar' ? 'بيانات الميلاد' : language === 'fr' ? 'Données de Naissance' : 'Birth Data'}
          </Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {language === 'ar' ? 'التاريخ:' : language === 'fr' ? 'Date:' : 'Date:'}
            </Text>
            <Text style={styles.summaryValue}>
              {new Date(birthProfile.dobISO).toLocaleDateString(
                language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </Text>
          </View>
          {birthProfile.birthTime && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {language === 'ar' ? 'الوقت:' : language === 'fr' ? 'Heure:' : 'Time:'}
              </Text>
              <Text style={styles.summaryValue}>{birthProfile.birthTime}</Text>
            </View>
          )}
          {birthProfile.birthLocation?.label && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {language === 'ar' ? 'المكان:' : language === 'fr' ? 'Lieu:' : 'Location:'}
              </Text>
              <Text style={styles.summaryValue}>{birthProfile.birthLocation.label}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1419',
    gap: 16,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1419',
    padding: 32,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  headerSection: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  signsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  signCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    overflow: 'hidden',
  },
  signCardLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(100, 100, 100, 0.2)',
  },
  signCardGradient: {
    padding: 16,
  },
  signCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  signIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  signDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  signSymbol: {
    fontSize: 36,
  },
  signNameContainer: {
    flex: 1,
  },
  signName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  signDegree: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  elementBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  elementBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  lockedContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  lockedText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    lineHeight: 18,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  summaryValue: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  // Insight Cards
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  insightEmoji: {
    fontSize: 20,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    flexShrink: 1,
  },
  insightText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.72)',
    lineHeight: 22,
  },

  // ── Summary chips banner ─────────────────
  chipsBanner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#1e1b4b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4c1d95',
    marginBottom: 16,
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#312e81',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipElement: {
    backgroundColor: 'transparent',
  },
  chipEmoji: {
    fontSize: 13,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e0e7ff',
  },

  // ── Planets section ──────────────────────
  planetsCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e3a5f',
    gap: 10,
  },
  planetsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  planetRow: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 10,
    gap: 6,
  },
  planetRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planetName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1f5f9',
    flex: 1,
  },
  planetSign: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  conditionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  conditionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  planetInsight: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    lineHeight: 17,
  },

  // ── Moon timing card ─────────────────────
  moonCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e3a5f',
    gap: 10,
  },
  moonCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moonCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  moonToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moonToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7BF7',
  },
  moonPhase: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  moonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moonLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
    flex: 1,
  },
  moonValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  moonProgressBar: {
    flex: 1,
    height: 22,
    backgroundColor: '#1e293b',
    borderRadius: 11,
    overflow: 'hidden',
    position: 'relative',
    marginLeft: 12,
  },
  moonProgressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 11,
  },
  moonProgressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 11,
    fontWeight: '700',
    color: '#f1f5f9',
  },

  // Skeleton Loading Styles
  loadingHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  loadingProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  loadingProgressText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  skeletonCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 100, 100, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
  skeletonGradient: {
    padding: 16,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  skeletonTitle: {
    height: 14,
    width: '60%',
    borderRadius: 7,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  skeletonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  skeletonSymbol: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  skeletonName: {
    height: 20,
    width: '50%',
    borderRadius: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  skeletonBadge: {
    height: 24,
    width: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
});
