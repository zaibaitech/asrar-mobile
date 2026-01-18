export type ManazilLanguage = 'en' | 'fr' | 'ar';

export type TrilingualText = {
  en: string;
  fr: string;
  ar: string;
};

export type ManazilThemeKey =
  | 'opening'
  | 'clarifying'
  | 'separation'
  | 'union'
  | 'protection'
  | 'transformation'
  | 'provision'
  | 'travel'
  | 'healing'
  | 'revelation';

export type ManazilGuidance = {
  quality: TrilingualText;
  themeLabel: TrilingualText;

  // Meaning layer
  essence: TrilingualText;
  manifests: TrilingualText;
  easier: TrilingualText;
  sensitive: TrilingualText;

  // Action layer
  bestPractices: {
    spiritual: TrilingualText[];
    worldly: TrilingualText[];
    inner: TrilingualText[];
  };
  betterToAvoid: TrilingualText[];

  // Inner work
  reflection: {
    ayahRef?: string;
    hikmah: TrilingualText;
    intention: TrilingualText;
    silentPractice?: TrilingualText;
  };
};

function text(en: string, fr?: string, ar?: string): TrilingualText {
  return {
    en,
    fr: fr ?? en,
    ar: ar ?? en,
  };
}

function mergeTextArrays(override: TrilingualText[] | undefined, base: TrilingualText[]): TrilingualText[] {
  if (!override || override.length === 0) return base;
  return [...override, ...base].slice(0, 8);
}

const THEMES: Record<ManazilThemeKey, { label: TrilingualText; ayahRef?: string }> = {
  opening: {
    label: { en: 'Opening', fr: 'Ouverture', ar: 'فتح' },
    ayahRef: 'Qur’an 94:5–6',
  },
  clarifying: {
    label: { en: 'Clarifying', fr: 'Clarification', ar: 'تبيين' },
    ayahRef: 'Qur’an 2:286',
  },
  separation: {
    label: { en: 'Separation', fr: 'Séparation', ar: 'فصل' },
    ayahRef: 'Qur’an 8:29',
  },
  union: {
    label: { en: 'Union', fr: 'Union', ar: 'وصل' },
    ayahRef: 'Qur’an 49:10',
  },
  protection: {
    label: { en: 'Protection', fr: 'Protection', ar: 'حفظ' },
    ayahRef: 'Qur’an 113',
  },
  transformation: {
    label: { en: 'Transformation', fr: 'Transformation', ar: 'تحوّل' },
    ayahRef: 'Qur’an 13:11',
  },
  provision: {
    label: { en: 'Provision', fr: 'Subsistance', ar: 'رزق' },
    ayahRef: 'Qur’an 65:2–3',
  },
  travel: {
    label: { en: 'Travel', fr: 'Voyage', ar: 'سفر' },
    ayahRef: 'Qur’an 29:20',
  },
  healing: {
    label: { en: 'Healing', fr: 'Guérison', ar: 'شفاء' },
    ayahRef: 'Qur’an 17:82',
  },
  revelation: {
    label: { en: 'Revelation', fr: 'Révélation', ar: 'كشف' },
    ayahRef: 'Qur’an 24:35',
  },
};

// A lightweight, spiritually-grounded mapping.
// If a mansion isn't explicitly customized later, these defaults still produce a complete screen.
const THEME_BY_MANSION_INDEX: ManazilThemeKey[] = [
  'opening', // 1 Al-Sharatān
  'clarifying',
  'revelation',
  'separation',
  'clarifying',
  'provision',
  'travel',
  'revelation',
  'opening',
  'protection',
  'clarifying',
  'transformation',
  'protection',
  'union',
  'protection',
  'separation',
  'union',
  'healing',
  'transformation',
  'travel',
  'clarifying',
  'provision',
  'provision',
  'union',
  'protection',
  'revelation',
  'clarifying',
  'healing',
];

// Mansion-specific authored layer (0-27). These are intentionally gentle and non-technical.
// They refine the default theme/element guidance without introducing hard claims.
const MANSION_OVERRIDES: Record<
  number,
  Partial<
    Pick<
      ManazilGuidance,
      'quality' | 'themeLabel' | 'essence' | 'manifests' | 'easier' | 'sensitive' | 'betterToAvoid' | 'reflection' | 'bestPractices'
    >
  >
> = {
  0: {
    essence: text(
      'A clean beginning. Start with sincerity and one simple intention.',
      'Un début net. Commencez avec sincérité et une intention simple.',
      'بداية نظيفة: ابدأ بإخلاص وبنيّة واحدة بسيطة.'
    ),
    easier: text('Beginning again without carrying yesterday’s weight.', 'Recommencer sans porter le poids d’hier.', 'البدء من جديد دون حمل ثقل الأمس.'),
    sensitive: text('Rushing into commitments before you are ready.', 'S’engager trop vite avant d’être prêt.', 'الاندفاع في الالتزام قبل الاستعداد.'),
    bestPractices: {
      spiritual: [text('Make a quiet intention (niyyah) before action.', 'Fixez une niyyah silencieuse avant d’agir.', 'جدّد النية قبل العمل.')],
      worldly: [text('Choose one task and complete it fully.', 'Choisissez une tâche et terminez-la بالكامل.', 'اختر مهمة واحدة وأتمها.')],
      inner: [text('Let simplicity be your strength today.', 'Que la simplicité soit votre force.', 'اجعل البساطة قوتك.')],
    },
  },
  1: {
    essence: text(
      'Strength through steadiness. Stabilize your footing before expanding.',
      'Force par la stabilité. Stabilisez avant d’élargir.',
      'قوة بالثبات: ثبّت خطاك قبل التوسع.'
    ),
    easier: text('Building a small routine that holds.', 'Construire une petite routine qui tient.', 'بناء روتين صغير ثابت.'),
    sensitive: text('Stubbornness disguised as stability.', 'L’entêtement déguisé en stabilité.', 'العناد باسم الثبات.'),
  },
  2: {
    essence: text(
      'A gathering of lights: learn, connect, and keep your heart humble.',
      'Un rassemblement de lumières: apprendre, se relier, rester humble.',
      'اجتماع أنوار: تعلّم وتواصل مع تواضع.'
    ),
    manifests: text('Ideas multiply—choose what benefits and leave what distracts.', 'Les idées se multiplient—choisissez l’utile.', 'تتكاثر الأفكار—خذ النافع واترك المشتت.'),
    betterToAvoid: [text('Comparing your path to others.', 'Comparer votre chemin à celui des autres.', 'مقارنة طريقك بغيرك.')],
  },
  3: {
    essence: text(
      'Follow what is true, not what is loud. Let clarity lead.',
      'Suivez le vrai, pas le bruit. Laissez la clarté guider.',
      'اتبع الحق لا الضجيج؛ دع الوضوح يقود.'
    ),
    sensitive: text('Chasing what pulls your attention but not your soul.', 'Poursuivre ce qui attire mais لا يغذي.', 'ملاحقة ما يجذب الانتباه دون غذاء للقلب.'),
  },
  4: {
    essence: text(
      'A bright mark: be seen for goodness, not performance.',
      'Une marque lumineuse: être vu par le bien, pas par la performance.',
      'علامة مضيئة: كن ظاهرًا بالخير لا بالاستعراض.'
    ),
    easier: text('Doing a visible good deed with quiet intention.', 'Faire un bien visible avec نية خفية.', 'عمل خير ظاهر بنية خفية.'),
    sensitive: text('Showing off spiritual work.', 'Se montrer dans le spirituel.', 'الرياء في العمل.'),
  },
  5: {
    essence: text(
      'Refinement. Shape your habits the way a craftsperson shapes a tool.',
      'Affinage. Façonnez vos habitudes comme un artisan.',
      'تهذيب: شكّل عاداتك كما يُشكّل الصانع أداته.'
    ),
    manifests: text('Small corrections bring big relief.', 'De petites corrections apportent un grand soulagement.', 'تصحيحات صغيرة تجلب راحة كبيرة.'),
  },
  6: {
    essence: text(
      'Reach with care. Extend help without overextending yourself.',
      'Tendre la main avec soin. Aider sans se vider.',
      'مدّ اليد بحكمة: أعِن دون أن تستنزف نفسك.'
    ),
    betterToAvoid: [text('Rescuing people who refuse responsibility.', 'Sauver ceux qui refusent la responsabilité.', 'إنقاذ من يرفض تحمل المسؤولية.')],
  },
  7: {
    essence: text(
      'Gentle precision. Speak with kindness and choose your timing.',
      'Précision douce. Parler avec bonté et choisir le moment.',
      'دقة بلطف: تكلّم برفق واختر الوقت.'
    ),
    sensitive: text('Sharp speech that wounds.', 'Paroles tranchantes qui blessent.', 'كلام جارح.'),
  },
  8: {
    essence: text(
      'A glance that sees. Notice what you usually ignore—then act wisely.',
      'Un regard qui voit. Remarquez l’oublié—puis agissez avec sagesse.',
      'نظرة واعية: انتبه لما تُهمله ثم تصرّف بحكمة.'
    ),
  },
  9: {
    essence: text(
      'Forehead and presence: lead with adab, not ego.',
      'Présence: diriger avec adab, pas avec ego.',
      'هيبة وحضور: قدّم الأدب على الأنانية.'
    ),
    easier: text('Taking responsibility without harshness.', 'Prendre responsabilité sans dureté.', 'تحمّل المسؤولية بلا قسوة.'),
    sensitive: text('Pride in “being right”.', 'Orgueil d’“avoir raison”.', 'الكِبر في “الصواب”.'),
  },
  10: {
    essence: text(
      'Mane and dignity: keep your boundaries clean and your heart soft.',
      'Dignité: limites claires et cœur doux.',
      'وقار: حدود واضحة وقلب ليّن.'
    ),
  },
  11: {
    essence: text(
      'A turning point: when something changes, return to prayer quickly.',
      'Un tournant: quand ça change, revenez vite à la prière.',
      'تحوّل: إذا تغيّر الأمر فارجع للصلاة سريعًا.'
    ),
    manifests: text('Plans shift—keep flexibility without losing principles.', 'Les plans changent—restez flexible sans perdre المبادئ.', 'تتبدل الخطط—كن مرنًا دون ترك الأصول.'),
  },
  12: {
    essence: text(
      'Voice and direction: let your words be a bridge, not a weapon.',
      'Parole et direction: que vos mots soient un pont, pas une arme.',
      'الكلمة اتجاه: اجعل كلامك جسراً لا سلاحًا.'
    ),
  },
  13: {
    essence: text(
      'Unarmed strength: simplicity, honesty, and steady effort.',
      'Force sans armes: simplicité, honnêteté, effort constant.',
      'قوة بلا سلاح: بساطة وصدق وثبات.'
    ),
    betterToAvoid: [text('Overcomplicating what is already clear.', 'Compliquer ce qui est déjà clair.', 'تعقيد ما هو واضح.')],
  },
  14: {
    essence: text(
      'Covering and protection: keep what is sacred private.',
      'Couverture et protection: gardez le sacré privé.',
      'ستر وحفظ: احفظ المقدّس في الخصوصية.'
    ),
    easier: text('Discretion that preserves barakah.', 'La discrétion qui préserve la barakah.', 'سترٌ يحفظ البركة.'),
    sensitive: text('Oversharing plans or blessings.', 'Trop partager plans ou نعمة.', 'نشر الخطط أو النعم بلا حاجة.'),
  },
  15: {
    essence: text(
      'Claws: defend without attacking. Choose justice with calm.',
      'Griffes: se défendre sans attaquer. Justice avec calme.',
      'مخالب: ادفع بلا اعتداء؛ اختر العدل بهدوء.'
    ),
    betterToAvoid: [text('Retaliation that goes beyond the issue.', 'Riposte qui dépasse le sujet.', 'انتقام يتجاوز الحد.')],
  },
  16: {
    essence: text(
      'Crown: honor comes from humility and service.',
      'Couronne: l’honneur vient de l’humilité et du service.',
      'إكليل: الشرف بالتواضع والخدمة.'
    ),
    bestPractices: {
      spiritual: [text('Make duʿāʾ for sincerity before recognition.', 'Duʿāʾ pour l’إخلاص قبل الاعتراف.', 'دعاء للإخلاص قبل الثناء.')],
      worldly: [text('Lead by example: do the hard part first.', 'Montrer l’exemple: commencez par le difficile.', 'قدّم المثال: ابدأ بالأصعب.')],
      inner: [text('Replace entitlement with gratitude.', 'Remplacer الاستحقاق بالشكر.', 'بدّل الاستحقاق بالشكر.')],
    },
  },
  17: {
    essence: text(
      'Heart: return to what softens you—prayer, mercy, forgiveness.',
      'Cœur: revenir à ce qui adoucit—prière, miséricorde, pardon.',
      'قلب: ارجع لما يلينك—الصلاة والرحمة والعفو.'
    ),
    manifests: text('The real work is inside: repair the intention.', 'Le vrai travail est dedans: réparer la نية.', 'العمل الحقيقي في الداخل: إصلاح النية.'),
  },
  18: {
    essence: text(
      'Stinger: keep your tongue safe. Don’t strike with words.',
      'Aiguillon: protégez votre langue. Ne piquez pas par les mots.',
      'شوكة: احفظ لسانك؛ لا تلسع بالكلام.'
    ),
    sensitive: text('Sarcasm and subtle cruelty.', 'Sarcasme et cruauté subtile.', 'سخرية وقسوة خفية.'),
  },
  19: {
    essence: text(
      'Ostriches: steady movement. Don’t scatter your steps.',
      'Mouvement stable. Ne dispersez pas vos pas.',
      'حركة ثابتة: لا تشتّت خطواتك.'
    ),
    easier: text('Progress through consistency, not speed.', 'Progrès par constance, pas vitesse.', 'تقدم بالثبات لا بالسرعة.'),
  },
  20: {
    essence: text(
      'The City: build what will remain—structures, habits, and trust.',
      'La Cité: construire ce qui reste—structures, habitudes, confiance.',
      'البلدة: ابنِ ما يبقى—نظامًا وعادةً وثقة.'
    ),
    betterToAvoid: [text('Burning bridges out of frustration.', 'Brûler les ponts par frustration.', 'قطع الجسور بسبب الغضب.')],
  },
  21: {
    essence: text(
      'Sacrifice wisely. Give up what harms your path.',
      'Sacrifier avec sagesse. Abandonner ce qui nuit.',
      'ذبحٌ بحكمة: اترك ما يضرّ طريقك.'
    ),
    sensitive: text('Cutting the wrong thing (or cutting too deep).', 'Couper le mauvais lien (ou trop).', 'قطعٌ في غير موضعه.'),
  },
  22: {
    essence: text(
      'Swallowing: digest your lessons. Don’t rush to explain them.',
      'Avaler: digérer les leçons. Ne pas se hâter de les expliquer.',
      'بلع: هضم الدروس دون استعجال شرحها.'
    ),
    manifests: text('Keep wisdom inside until it becomes calm and useful.', 'Gardez الحكمة حتى تصبح هادئة ونافعة.', 'احبس الحكمة حتى تهدأ وتَنفع.'),
  },
  23: {
    essence: text(
      'Luck of lucks: barakah grows with gratitude and clean means.',
      'Chance des chances: la barakah grandit avec gratitude et moyens propres.',
      'سعد السعود: البركة تزيد بالشكر والحلال.'
    ),
    easier: text('Receiving goodness without guilt.', 'Recevoir le bien sans culpabilité.', 'قبول الخير دون ذنب.'),
  },
  24: {
    essence: text(
      'Tents: shelter your heart. Rest, restore, then continue.',
      'Tentes: abriter le cœur. Se reposer ثم continuer.',
      'أخبية: احمِ قلبك؛ استرح ثم واصل.'
    ),
    betterToAvoid: [text('Overexposure to noise and people.', 'Trop d’exposition au bruit et aux gens.', 'الانغماس في الضوضاء والاختلاط.')],
  },
  25: {
    essence: text(
      'First pourer: start the flow—give, share, and keep it balanced.',
      'Premier verseur: lancer le flux—donner et partager avec équilibre.',
      'فرغ مقدم: ابدأ السكب—أعطِ وشارك بتوازن.'
    ),
  },
  26: {
    essence: text(
      'Second pourer: complete what you started. Close loops.',
      'Second verseur: achever ce qui a commencé. Fermer les boucles.',
      'فرغ مؤخر: أتمّ ما بدأت؛ أغلق الدوائر.'
    ),
    easier: text('Finishing and handing over cleanly.', 'Terminer et remettre proprement.', 'الإتمام والتسليم بإحسان.'),
    sensitive: text('Leaving things half-done.', 'Laisser des choses inachevées.', 'ترك الأمور معلّقة.'),
  },
  27: {
    essence: text(
      'Belly of the fish: quiet depth. Retreat, repent, and return.',
      'Profondeur silencieuse. Retraite, repentir, retour.',
      'عمقٌ وصمت: خلوة واستغفار ثم رجوع.'
    ),
    manifests: text('What feels hidden can become healing when met with truth.', 'Ce qui est caché peut guérir avec vérité.', 'ما خفي قد يصير شفاء إذا لقي الصدق.'),
    bestPractices: {
      spiritual: [text('Istighfār slowly, without self-hatred.', 'Istighfār lentement, sans haine de soi.', 'استغفار بهدوء دون كراهية للنفس.')],
      worldly: [text('Reduce inputs: fewer screens, fewer conversations.', 'Réduire les entrées: moins d’écrans et de conversations.', 'قلّل المُدخلات: شاشات أقل وكلام أقل.')],
      inner: [text('Return to hope after remorse.', 'Revenir à l’espoir après le regret.', 'ارجع إلى الرجاء بعد الندم.')],
    },
  },
};

const QUALITY_BY_THEME: Record<ManazilThemeKey, TrilingualText> = {
  opening: { en: 'Opening', fr: 'Ouverture', ar: 'فتح' },
  clarifying: { en: 'Clarifying', fr: 'Clarification', ar: 'تبيين' },
  separation: { en: 'Cutting / Releasing', fr: 'Coupure / Libération', ar: 'قطع / تحرّر' },
  union: { en: 'Joining / Reconciling', fr: 'Union / Réconciliation', ar: 'وصل / إصلاح' },
  protection: { en: 'Guarding', fr: 'Protection', ar: 'حفظ' },
  transformation: { en: 'Turning', fr: 'Changement', ar: 'تحوّل' },
  provision: { en: 'Gathering', fr: 'Collecte', ar: 'جمع' },
  travel: { en: 'Movement', fr: 'Mouvement', ar: 'حركة' },
  healing: { en: 'Mending', fr: 'Réparation', ar: 'جبر' },
  revelation: { en: 'Unveiling', fr: 'Dévoilement', ar: 'كشف' },
};

const ELEMENT_PRACTICES: Record<
  'fire' | 'water' | 'air' | 'earth',
  {
    spiritual: TrilingualText[];
    worldly: TrilingualText[];
    inner: TrilingualText[];
    avoid: TrilingualText[];
  }
> = {
  fire: {
    spiritual: [
      { en: 'Short, focused duʿāʾ after prayers', fr: 'Duʿāʾ court et concentré après la prière', ar: 'دعاء قصير ومركز بعد الصلاة' },
      { en: 'Dhikr for steadiness and sincerity', fr: 'Dhikr pour la stabilité et la sincérité', ar: 'ذكر للثبات والإخلاص' },
    ],
    worldly: [
      { en: 'Begin one clear task; finish it cleanly', fr: 'Commencer une tâche claire et la terminer', ar: 'ابدأ مهمة واضحة وأتمّها بإتقان' },
      { en: 'Channel energy into service (help someone quietly)', fr: 'حوّل الطاقة إلى خدمة (مساعدة بصمت)', ar: 'حوّل الطاقة إلى خدمة (مساعدة بهدوء)' },
    ],
    inner: [
      { en: 'Act with adab before intensity', fr: 'Adab avant l’intensité', ar: 'أدب قبل الحِدّة' },
      { en: 'Let zeal become discipline', fr: 'حوّل الحماس إلى انضباط', ar: 'حوّل الحماس إلى انضباط' },
    ],
    avoid: [
      { en: 'Arguments and quick escalations', fr: 'Disputes et escalades rapides', ar: 'الجدال والتصعيد السريع' },
      { en: 'Binding promises made in emotion', fr: 'Promesses engageantes sous émotion', ar: 'الوعود المُلزمة وقت الانفعال' },
    ],
  },
  water: {
    spiritual: [
      { en: 'Istighfār and gentle dhikr', fr: 'Istighfār et dhikr doux', ar: 'استغفار وذكر لطيف' },
      { en: 'Recite a small portion slowly (tadabbur)', fr: 'Lecture lente avec تدبر', ar: 'تلاوة يسيرة بتدبر' },
    ],
    worldly: [
      { en: 'Make space: clean, declutter, simplify', fr: 'Créer de l’espace: nettoyer, désencombrer', ar: 'افسح مجالًا: تنظيف وترتيب وتخفيف' },
      { en: 'Repair relationships with a soft message', fr: 'إصلاح العلاقات برسالة لطيفة', ar: 'إصلاح العلاقات برسالة لطيفة' },
    ],
    inner: [
      { en: 'Notice sensitivity without obeying it', fr: 'Observer la sensibilité sans lui obéir', ar: 'لاحظ الحساسية دون اتباعها' },
      { en: 'Let mercy lead your decisions', fr: 'اجعل الرحمة تقود قراراتك', ar: 'اجعل الرحمة تقود قراراتك' },
    ],
    avoid: [
      { en: 'Emotional decisions made while unsettled', fr: 'Décisions émotionnelles en agitation', ar: 'قرارات عاطفية وقت الاضطراب' },
      { en: 'Revealing secrets in a fragile mood', fr: 'Divulguer des secrets en fragilité', ar: 'كشف الأسرار وقت الضعف' },
    ],
  },
  air: {
    spiritual: [
      { en: 'Dhikr with breath awareness', fr: 'Dhikr avec attention au souffle', ar: 'ذكر مع وعي بالنَّفَس' },
      { en: 'Two rakaʿāt for clarity (without rushing outcomes)', fr: 'ركعتان لطلب الوضوح دون استعجال', ar: 'ركعتان لطلب الوضوح دون استعجال' },
    ],
    worldly: [
      { en: 'Study, write, learn, and organize ideas', fr: 'Étudier, écrire, apprendre, organiser les idées', ar: 'تعلّم، اكتب، نظّم الأفكار' },
      { en: 'Have one honest conversation with adab', fr: 'Conversation honnête بأدب', ar: 'حديث صادق بأدب' },
    ],
    inner: [
      { en: 'Choose truth over overthinking', fr: 'Choisir la vérité plutôt que la rumination', ar: 'اختر الحقيقة بدل الاسترسال' },
      { en: 'Let clarity be gentle, not sharp', fr: 'Que la clarté soit لطيفة لا جارحة', ar: 'اجعل الوضوح لطيفًا لا جارحًا' },
    ],
    avoid: [
      { en: 'Spreading worries through too much talk', fr: 'Propager l’inquiétude par trop de الكلام', ar: 'نشر القلق بكثرة الكلام' },
      { en: 'Starting many threads without closing any', fr: 'بدء أشياء كثيرة دون إغلاقها', ar: 'بدء مسارات كثيرة دون إتمام' },
    ],
  },
  earth: {
    spiritual: [
      { en: 'Consistent ṣalāh, then quiet gratitude', fr: 'Ṣalāh régulière ثم شكر هادئ', ar: 'ثبات على الصلاة ثم شكر بهدوء' },
      { en: 'Sadaqah with intention (even small)', fr: 'صدقة بنية (ولو قليلة)', ar: 'صدقة بنية (ولو يسيرة)' },
    ],
    worldly: [
      { en: 'Build steadily: routines, finances, paperwork', fr: 'Construire تدريجيًا: روتين، مال، أوراق', ar: 'ابنِ بتدرّج: روتين، مال، معاملات' },
      { en: 'Care for the body: sleep, food, walking', fr: 'العناية بالجسد: نوم، طعام، مشي', ar: 'العناية بالجسد: نوم، طعام، مشي' },
    ],
    inner: [
      { en: 'Patience is worship when sincere', fr: 'La patience est عبادة حين تُخلص', ar: 'الصبر عبادة إذا صَدَق' },
      { en: 'Let stability soften your heart', fr: 'دع الاستقرار يلين قلبك', ar: 'دع الاستقرار يلين قلبك' },
    ],
    avoid: [
      { en: 'Rigid control or harsh self-judgment', fr: 'Contrôle rigide أو قسوة على النفس', ar: 'التحكم القاسي أو جلد الذات' },
      { en: 'Overcommitting to long projects impulsively', fr: 'الالتزام بمشاريع طويلة بلا تروٍّ', ar: 'الالتزام بمشاريع طويلة بلا تروٍّ' },
    ],
  },
};

function themeForIndex(index0: number): ManazilThemeKey {
  return THEME_BY_MANSION_INDEX[((index0 % 28) + 28) % 28] ?? 'clarifying';
}

export function tr(text: TrilingualText, language: ManazilLanguage): string {
  if (language === 'ar') return text.ar;
  if (language === 'fr') return text.fr;
  return text.en;
}

export function getManazilGuidance(params: {
  // 0-27
  mansionIndex: number;
  mansionElement: 'fire' | 'water' | 'air' | 'earth';
}): ManazilGuidance {
  const themeKey = themeForIndex(params.mansionIndex);
  const theme = THEMES[themeKey];
  const quality = QUALITY_BY_THEME[themeKey];
  const defaults = ELEMENT_PRACTICES[params.mansionElement];
  const mansionOverride = MANSION_OVERRIDES[params.mansionIndex] ?? {};

  // Meaning layer is intentionally descriptive and gentle.
  const essenceByTheme: Record<ManazilThemeKey, TrilingualText> = {
    opening: {
      en: 'A gate that opens pathways and resets intention.',
      fr: 'Une porte qui ouvre des chemins et réinitialise l’intention.',
      ar: 'باب يفتح المسارات ويُجدِّد النيّة.',
    },
    clarifying: {
      en: 'A clarifying gate: what is true becomes easier to see.',
      fr: 'Une porte de clarté: le vrai devient plus visible.',
      ar: 'باب تبيين: يسهُل تمييز الحقائق.',
    },
    separation: {
      en: 'A releasing gate: what no longer serves can be let go.',
      fr: 'Une porte de libération: on peut laisser ce qui ne sert plus.',
      ar: 'باب تحرّر: يُستحسن ترك ما لا ينفع.',
    },
    union: {
      en: 'A joining gate: reconciliation and right-connection are supported.',
      fr: 'Une porte d’union: la réconciliation et les liens justes sont aidés.',
      ar: 'باب وصل: الإصلاح وصلة الرحم مُيسّرة.',
    },
    protection: {
      en: 'A guarding gate: boundaries, discretion, and safety are emphasized.',
      fr: 'Une porte de protection: limites, discrétion et sécurité.',
      ar: 'باب حفظ: حدود وستر وسلامة.',
    },
    transformation: {
      en: 'A turning gate: change arrives—meet it with steadiness.',
      fr: 'Une porte de transformation: le changement vient—avec ثبات.',
      ar: 'باب تحوّل: التغيير حاضر—بالثبات.',
    },
    provision: {
      en: 'A gathering gate: provision grows through order and gratitude.',
      fr: 'Une porte de subsistance: la رزق grandit avec ordre et gratitude.',
      ar: 'باب رزق: يزداد الرزق مع الترتيب والشكر.',
    },
    travel: {
      en: 'A moving gate: transitions, journeys, and shifts in direction.',
      fr: 'Une porte de mouvement: transitions et changements de direction.',
      ar: 'باب حركة: انتقالات وأسفار وتحوّلات.',
    },
    healing: {
      en: 'A mending gate: repair, gentleness, and recovery are near.',
      fr: 'Une porte de guérison: réparation, douceur, récupération.',
      ar: 'باب جبر: إصلاح ولطف وتعافٍ.',
    },
    revelation: {
      en: 'An unveiling gate: insight comes—handle it with amanah.',
      fr: 'Une porte de dévoilement: des éclaircissements viennent—avec أمانة.',
      ar: 'باب كشف: يظهر المعنى—بالأمانة.',
    },
  };

  const manifestsByTheme: Record<ManazilThemeKey, TrilingualText> = {
    opening: {
      en: 'Beginnings feel lighter when they are simple and sincere.',
      fr: 'Les débuts sont plus légers quand ils sont simples et sincères.',
      ar: 'البدايات أخفّ إذا كانت بسيطة وصادقة.',
    },
    clarifying: {
      en: 'Confusion thins when you return to one clear priority.',
      fr: 'La confusion diminue quand on revient à une priorité claire.',
      ar: 'يزول التشوش إذا رجعتَ إلى أولوية واضحة.',
    },
    separation: {
      en: 'Old attachments loosen; some endings are mercy.',
      fr: 'Les attachements se relâchent; certaines fins sont رحمة.',
      ar: 'تخفّ التعلقات؛ وبعض النهايات رحمة.',
    },
    union: {
      en: 'Connection becomes easier through humility and repair.',
      fr: 'Le lien devient plus facile par humilité et réparation.',
      ar: 'يسهل الوصل بالتواضع والإصلاح.',
    },
    protection: {
      en: 'Privacy protects barakah; keep your plans clean and quiet.',
      fr: 'La discrétion protège la barakah; gardez vos projets propres et calmes.',
      ar: 'الستر يحفظ البركة؛ اجعل خططك نظيفة وهادئة.',
    },
    transformation: {
      en: 'The day turns quickly—anchor yourself in prayer and patience.',
      fr: 'La journée tourne vite—ancrez-vous dans la prière et la patience.',
      ar: 'يتحول اليوم سريعًا—تثبّت بالصلاة والصبر.',
    },
    provision: {
      en: 'Small consistent steps open unexpected provision.',
      fr: 'De petits pas constants ouvrent une subsistance inattendue.',
      ar: 'خطوات صغيرة ثابتة تفتح رزقًا غير متوقّع.',
    },
    travel: {
      en: 'Movement is blessed when it is purposeful, not restless.',
      fr: 'Le mouvement est béni lorsqu’il est intentionnel, pas agité.',
      ar: 'الحركة مباركة إذا كانت بقصد لا بقلق.',
    },
    healing: {
      en: 'Healing comes through gentleness—toward others and yourself.',
      fr: 'La guérison vient par la douceur—envers autrui et soi-même.',
      ar: 'الشفاء باللطف—مع الناس ومع نفسك.',
    },
    revelation: {
      en: 'Insights arrive; keep them grounded, not dramatic.',
      fr: 'Les éclaircissements arrivent; restez ancré, sans dramatique.',
      ar: 'تأتي البصيرة؛ ثبّتها دون تهويل.',
    },
  };

  const easierByTheme: Record<ManazilThemeKey, TrilingualText> = {
    opening: { en: 'Starting again with sincerity.', fr: 'Recommencer avec sincérité.', ar: 'البدء من جديد بإخلاص.' },
    clarifying: { en: 'Choosing the next right step.', fr: 'Choisir le prochain pas juste.', ar: 'اختيار الخطوة الصحيحة التالية.' },
    separation: { en: 'Letting go of what drains you.', fr: 'Lâcher ce qui vous épuise.', ar: 'ترك ما يستنزفك.' },
    union: { en: 'Repairing and reconnecting.', fr: 'Réparer et se reconnecter.', ar: 'الإصلاح وإعادة الوصل.' },
    protection: { en: 'Guarding time and attention.', fr: 'Protéger le temps et l’attention.', ar: 'حفظ الوقت والانتباه.' },
    transformation: { en: 'Adapting without losing adab.', fr: 'S’adapter sans perdre l’adab.', ar: 'التكيّف دون فقدان الأدب.' },
    provision: { en: 'Ordering life and finances.', fr: 'Organiser la vie et les finances.', ar: 'ترتيب الحياة والرزق.' },
    travel: { en: 'Transitioning with clarity.', fr: 'Passer une transition avec clarté.', ar: 'الانتقال بوضوح.' },
    healing: { en: 'Mending what’s strained.', fr: 'Réparer ce qui est tendu.', ar: 'جبر ما انكسر.' },
    revelation: { en: 'Seeing the lesson beneath events.', fr: 'Voir la leçon sous les événements.', ar: 'رؤية العبرة تحت الأحداث.' },
  };

  const sensitiveByTheme: Record<ManazilThemeKey, TrilingualText> = {
    opening: { en: 'Overcommitting too fast.', fr: 'S’engager trop vite.', ar: 'الاندفاع في الالتزام.' },
    clarifying: { en: 'Harsh words disguised as truth.', fr: 'Des paroles dures au nom de la vérité.', ar: 'قساوة باسم الحقيقة.' },
    separation: { en: 'Breaking bonds without wisdom.', fr: 'Couper des liens sans sagesse.', ar: 'قطع بلا حكمة.' },
    union: { en: 'People-pleasing at your expense.', fr: 'Satisfaire tout le monde à vos dépens.', ar: 'إرضاء الناس على حسابك.' },
    protection: { en: 'Suspicion and unnecessary fear.', fr: 'Soupçon et peur inutile.', ar: 'الظن والخوف بلا داع.' },
    transformation: { en: 'Reacting before reflecting.', fr: 'Réagir avant de réfléchir.', ar: 'ردّ الفعل قبل التأمل.' },
    provision: { en: 'Chasing outcomes with anxiety.', fr: 'Poursuivre les résultats avec anxiété.', ar: 'ملاحقة النتائج بقلق.' },
    travel: { en: 'Restlessness and scattered focus.', fr: 'Agitation et focus dispersé.', ar: 'تشتت وقلق.' },
    healing: { en: 'Reopening old wounds unnecessarily.', fr: 'Rouvrir de vieilles blessures.', ar: 'فتح جراح قديمة بلا حاجة.' },
    revelation: { en: 'Sharing insight without amanah.', fr: 'Partager sans أمانة.', ar: 'نشر ما كُشف بلا أمانة.' },
  };

  const reflection = {
    ayahRef: theme.ayahRef,
    hikmah: {
      en: 'What opens outwardly is safest when it opens inwardly first.',
      fr: 'Ce qui s’ouvre à l’extérieur est plus sûr quand cela s’ouvre d’abord à l’intérieur.',
      ar: 'ما ينفتح خارجًا يكون أأمن إذا انفتح داخلاً أولًا.',
    },
    intention: {
      en: 'O Allah, let this gate refine my adab and strengthen my sincerity.',
      fr: 'Ô Allah, que cette porte affine mon adab et renforce ma sincérité.',
      ar: 'اللهم اجعل هذا الباب سببًا لإصلاح أدبي وتقوية إخلاصي.',
    },
    silentPractice: {
      en: '3 minutes of quiet breathing with istighfār.',
      fr: '3 minutes de respiration calme avec istighfār.',
      ar: '٣ دقائق صمت مع الاستغفار والتنفس بهدوء.',
    },
  };

  const baseGuidance: ManazilGuidance = {
    quality,
    themeLabel: theme.label,
    essence: essenceByTheme[themeKey],
    manifests: manifestsByTheme[themeKey],
    easier: easierByTheme[themeKey],
    sensitive: sensitiveByTheme[themeKey],
    bestPractices: {
      spiritual: defaults.spiritual,
      worldly: defaults.worldly,
      inner: defaults.inner,
    },
    betterToAvoid: defaults.avoid,
    reflection,
  };

  // Merge overrides (prepend) while preserving a complete experience.
  return {
    ...baseGuidance,
    ...mansionOverride,
    bestPractices: {
      spiritual: mergeTextArrays(mansionOverride.bestPractices?.spiritual, baseGuidance.bestPractices.spiritual),
      worldly: mergeTextArrays(mansionOverride.bestPractices?.worldly, baseGuidance.bestPractices.worldly),
      inner: mergeTextArrays(mansionOverride.bestPractices?.inner, baseGuidance.bestPractices.inner),
    },
    betterToAvoid: mergeTextArrays(mansionOverride.betterToAvoid, baseGuidance.betterToAvoid),
    reflection: {
      ...baseGuidance.reflection,
      ...(mansionOverride.reflection ?? {}),
    },
  };
}
