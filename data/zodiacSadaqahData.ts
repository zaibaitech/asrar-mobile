/**
 * Zodiac-based Sadaqah (charity) guidance, used for the Birth Date (DOB)
 * calculation method on the Who Am I / Results Sadaqah tab.
 *
 * Source: Cheikh Mahdiyou Niane (authorized), documented per Western tropical
 * zodiac sign. Keyed by English sign name to match BURJ_NAMES_EN /
 * BirthProfile.sunSign.burjEn in services/ProfileDerivationService.ts.
 *
 * Fully trilingual (en/fr/ar) content.
 */

export interface TrilingualText {
  en: string;
  fr: string;
  ar: string;
}

export interface TrilingualList {
  en: string[];
  fr: string[];
  ar: string[];
}

export interface ZodiacSadaqahListItem {
  title: TrilingualText;
  lead: TrilingualText;
  bullets?: TrilingualList;
  after?: TrilingualText;
}

export interface ZodiacSadaqahEntry {
  signEn: string;
  signFr: string;
  signArabic: string;
  transliteration: string;
  rulingPlanet?: TrilingualText;
  intro?: TrilingualText;
  generalForms?: ZodiacSadaqahListItem[];
  specific: ZodiacSadaqahListItem[];
  secret?: {
    title: TrilingualText;
    intro?: TrilingualText;
    bullets?: TrilingualList;
    note?: TrilingualText;
  };
  timing?: {
    title: TrilingualText;
    lines: TrilingualList;
  };
  closingNote?: TrilingualText;
  summary?: TrilingualList;
  authorizedBy: string;
  videoUrl?: string;
}

export const ZODIAC_SADAQAH_DATA: Record<string, ZodiacSadaqahEntry> = {
  Aries: {
    signEn: 'Aries',
    signFr: 'Bélier',
    signArabic: 'الحمل',
    transliteration: 'Ḥamal',
    generalForms: [
      {
        title: { en: 'Hot Food Sadaqah', fr: 'Sadaqah de Nourriture Chaude', ar: 'صدقة الطعام الساخن' },
        lead: {
          en: 'Giving hot, prepared food as sadaqah is a beneficial form of charity. Examples include:',
          fr: 'Offrir de la nourriture chaude et préparée en sadaqah est une forme de charité bénéfique. En voici quelques exemples :',
          ar: 'تقديم طعام ساخن مُعدّ كصدقة هو شكل مفيد من أشكال الصدقة. ومن الأمثلة على ذلك:',
        },
        bullets: {
          en: ['Rice', 'Porridge', 'Other hot, nourishing meals'],
          fr: ['Riz', 'Bouillie (porridge)', 'D\'autres repas chauds et nourrissants'],
          ar: ['الأرز', 'العصيدة', 'وجبات ساخنة ومغذية أخرى'],
        },
        after: {
          en: 'The food can be given to children or to anyone who can benefit from it. This form of sadaqah is associated with feeding and providing nourishment.',
          fr: 'La nourriture peut être offerte aux enfants ou à toute personne pouvant en bénéficier. Cette forme de sadaqah est associée au fait de nourrir et d\'apporter un bienfait alimentaire.',
          ar: 'يمكن تقديم الطعام للأطفال أو لأي شخص يمكنه الاستفادة منه. يرتبط هذا الشكل من الصدقة بالإطعام وتوفير الغذاء.',
        },
      },
      {
        title: { en: 'Cold Water Sadaqah', fr: 'Sadaqah d\'Eau Fraîche', ar: 'صدقة الماء البارد' },
        lead: {
          en: 'Giving cold water as sadaqah is another beneficial form of charity. The sadaqah specifically consists of providing cold drinking water to someone who can benefit from it.',
          fr: 'Offrir de l\'eau fraîche en sadaqah est une autre forme bénéfique de charité. Cette sadaqah consiste précisément à fournir de l\'eau potable fraîche à une personne qui peut en bénéficier.',
          ar: 'تقديم الماء البارد كصدقة هو شكل آخر مفيد من أشكال الصدقة، وتتمثل هذه الصدقة تحديدًا في توفير ماء شرب بارد لشخص يمكنه الاستفادة منه.',
        },
      },
      {
        title: { en: 'Supporting an Athlete or Sportsman', fr: 'Soutenir un Athlète ou un Sportif', ar: 'دعم رياضي أو لاعب' },
        lead: {
          en: 'Helping a sportsman or athlete can also be given as a form of sadaqah. This may include:',
          fr: 'Aider un sportif ou un athlète peut également constituer une forme de sadaqah. Cela peut inclure :',
          ar: 'يمكن أيضًا أن تكون مساعدة رياضي أو لاعب شكلاً من أشكال الصدقة. ويمكن أن يشمل ذلك:',
        },
        bullets: {
          en: [
            'Buying them sports equipment or supplies',
            'Helping with something needed for their training',
            'Providing practical or financial assistance',
            'Encouraging and supporting them in their sporting activities',
          ],
          fr: [
            'Lui acheter du matériel ou des fournitures sportives',
            'L\'aider à obtenir ce dont il a besoin pour son entraînement',
            'Lui apporter une aide pratique ou financière',
            'L\'encourager et le soutenir dans ses activités sportives',
          ],
          ar: [
            'شراء معدات أو مستلزمات رياضية له',
            'المساعدة في توفير ما يحتاجه لتدريبه',
            'تقديم مساعدة عملية أو مالية',
            'تشجيعه ودعمه في أنشطته الرياضية',
          ],
        },
        after: {
          en: 'The assistance should be given sincerely for the benefit of the person.',
          fr: 'Cette aide doit être offerte sincèrement, pour le bien de la personne.',
          ar: 'ينبغي تقديم هذه المساعدة بإخلاص من أجل منفعة الشخص.',
        },
      },
    ],
    specific: [
      {
        title: { en: 'Livestock Sadaqah', fr: 'Sadaqah de Bétail', ar: 'صدقة الماشية' },
        lead: {
          en: 'A form of sadaqah associated with Ḥamal (Aries) is giving livestock. Examples include:',
          fr: 'Une forme de sadaqah associée au Ḥamal (Bélier) consiste à offrir du bétail. En voici quelques exemples :',
          ar: 'من أشكال الصدقة المرتبطة بالحمل تقديم الماشية، ومن الأمثلة على ذلك:',
        },
        bullets: {
          en: ['A sheep', 'A ram', 'A white sheep or ram', 'A sheep or ram of another colour'],
          fr: ['Une brebis', 'Un bélier', 'Une brebis ou un bélier blanc', 'Une brebis ou un bélier d\'une autre couleur'],
          ar: ['نعجة', 'كبش', 'نعجة أو كبش أبيض اللون', 'نعجة أو كبش بلون آخر'],
        },
        after: {
          en: 'The animal may be raised and cared for in the household and then given as sadaqah.',
          fr: 'L\'animal peut être élevé et soigné au sein du foyer, puis offert en sadaqah.',
          ar: 'يمكن تربية الحيوان والاعتناء به داخل المنزل، ثم تقديمه كصدقة.',
        },
      },
      {
        title: { en: 'Worn Clothing Sadaqah', fr: 'Sadaqah de Vêtements Portés', ar: 'صدقة الملابس المستعملة' },
        lead: {
          en: 'Another form of sadaqah associated with Ḥamal is giving away clothing that you have personally worn. The clothing can have been worn:',
          fr: 'Une autre forme de sadaqah associée au Ḥamal consiste à donner des vêtements que l\'on a soi-même portés. Ces vêtements peuvent avoir été portés :',
          ar: 'من أشكال الصدقة الأخرى المرتبطة بالحمل التصدق بملابس ارتداها الشخص بنفسه، ويمكن أن تكون هذه الملابس قد ارتُديت:',
        },
        bullets: {
          en: ['Once', 'Twice', 'Or a small number of times'],
          fr: ['Une fois', 'Deux fois', 'Ou un petit nombre de fois'],
          ar: ['مرة واحدة', 'مرتين', 'أو عدد قليل من المرات'],
        },
        after: {
          en: 'The important condition is that the clothing is still clean, usable, and in good condition. It is then given to another person who can benefit from wearing it. The emphasis is on giving clothing that has already been worn by the giver, rather than brand-new or completely unused clothing. This sadaqah is associated with protection and seeking benefit through charity.',
          fr: 'La condition importante est que les vêtements soient encore propres, utilisables et en bon état. Ils sont ensuite donnés à une autre personne qui peut en bénéficier en les portant. L\'accent est mis sur le fait de donner des vêtements déjà portés par le donateur, plutôt que des vêtements neufs ou jamais utilisés. Cette sadaqah est associée à la protection et à la recherche de bienfait à travers la charité.',
          ar: 'الشرط المهم هو أن تكون الملابس ما زالت نظيفة وصالحة للاستعمال وفي حالة جيدة، ثم تُعطى لشخص آخر يمكنه الاستفادة من ارتدائها. والتركيز هنا هو على التصدق بملابس سبق للمتصدق أن ارتداها، وليس بملابس جديدة تمامًا لم تُستعمل. وترتبط هذه الصدقة بالحماية وطلب النفع من خلال الصدقة.',
        },
      },
    ],
    authorizedBy: 'Cheikh Mahdiyou Niane',
    videoUrl: 'https://youtu.be/9QX0tEpB43Y?is=9KC2ZAwDdJW0MV5v',
  },

  Taurus: {
    signEn: 'Taurus',
    signFr: 'Taureau',
    signArabic: 'الثور',
    transliteration: 'al-Thawr',
    rulingPlanet: { en: 'Venus (al-Zuhrah / الزهرة)', fr: 'Vénus (al-Zuhrah / الزهرة)', ar: 'الزهرة (al-Zuhrah)' },
    specific: [
      {
        title: { en: 'One-Coloured Ram Sadaqah', fr: 'Sadaqah d\'un Bélier d\'une Seule Couleur', ar: 'صدقة كبش بلون واحد' },
        lead: {
          en: 'A primary form of sadaqah associated with Taurus (al-Thawr) is giving a single-coloured ram. A white ram is particularly suitable. The ram is given as sadaqah to someone who can benefit from it.',
          fr: 'Une forme principale de sadaqah associée au Taureau (al-Thawr) consiste à offrir un bélier d\'une seule couleur. Un bélier blanc convient particulièrement. Le bélier est offert en sadaqah à une personne qui peut en bénéficier.',
          ar: 'من أهم أشكال الصدقة المرتبطة بالثور تقديم كبش بلون واحد، ويُفضَّل أن يكون كبشًا أبيض. يُقدَّم الكبش كصدقة لشخص يمكنه الاستفادة منه.',
        },
      },
      {
        title: { en: 'Used Clothing Sadaqah — Protection', fr: 'Sadaqah de Vêtements Usagés — Protection', ar: 'صدقة الملابس المستعملة — الحماية' },
        lead: {
          en: 'Another form of sadaqah is giving away clothing that has already been worn. The clothing should still be in good and usable condition. This sadaqah is associated with protection and may be given with the intention of seeking protection through charity.',
          fr: 'Une autre forme de sadaqah consiste à donner des vêtements déjà portés. Ils doivent être encore en bon état et utilisables. Cette sadaqah est associée à la protection et peut être offerte avec l\'intention de rechercher une protection à travers la charité.',
          ar: 'من أشكال الصدقة الأخرى التصدق بملابس سبق ارتداؤها، على أن تكون لا تزال في حالة جيدة وصالحة للاستعمال. وترتبط هذه الصدقة بالحماية، ويمكن تقديمها بنية طلب الحماية من خلال الصدقة.',
        },
      },
      {
        title: { en: 'Grains and Agricultural Produce', fr: 'Céréales et Produits Agricoles', ar: 'الحبوب والمحاصيل الزراعية' },
        lead: {
          en: 'Another form of sadaqah for Taurus is giving things that are grown from the ground, particularly staple agricultural foods. Examples include:',
          fr: 'Une autre forme de sadaqah pour le Taureau consiste à offrir ce qui pousse de la terre, en particulier les denrées agricoles de base. En voici des exemples :',
          ar: 'من أشكال الصدقة الأخرى للثور تقديم ما يخرج من الأرض، وخاصة المواد الغذائية الزراعية الأساسية، ومن الأمثلة على ذلك:',
        },
        bullets: {
          en: ['Rice', 'Millet (dugub in Wolof)', 'Other grains and agricultural produce'],
          fr: ['Riz', 'Mil (dugub en wolof)', 'D\'autres céréales et produits agricoles'],
          ar: ['الأرز', 'الدخن (دوغوب بالولوفية)', 'حبوب ومحاصيل زراعية أخرى'],
        },
        after: {
          en: 'The food can be given directly to people in need.',
          fr: 'La nourriture peut être donnée directement aux personnes dans le besoin.',
          ar: 'يمكن تقديم الطعام مباشرة للمحتاجين.',
        },
      },
      {
        title: { en: 'Rice, Millet and Cooking Oil', fr: 'Riz, Mil et Huile de Cuisine', ar: 'الأرز والدخن وزيت الطهي' },
        lead: {
          en: 'Rice and millet may also be combined with cooking oil as part of the sadaqah. For example:',
          fr: 'Le riz et le mil peuvent également être associés à de l\'huile de cuisine dans le cadre de la sadaqah. Par exemple :',
          ar: 'يمكن أيضًا الجمع بين الأرز والدخن وزيت الطهي كجزء من الصدقة، على سبيل المثال:',
        },
        bullets: {
          en: ['Rice', 'Millet', 'Cooking oil'],
          fr: ['Riz', 'Mil', 'Huile de cuisine'],
          ar: ['الأرز', 'الدخن', 'زيت الطهي'],
        },
        after: {
          en: 'These can be given together as a food-based sadaqah package to someone or a family in need.',
          fr: 'Ces éléments peuvent être offerts ensemble, sous forme d\'un lot alimentaire de sadaqah, à une personne ou à une famille dans le besoin.',
          ar: 'يمكن تقديم هذه المواد معًا كحزمة غذائية للصدقة لشخص أو أسرة محتاجة.',
        },
      },
      {
        title: { en: 'Water Sadaqah', fr: 'Sadaqah d\'Eau', ar: 'صدقة الماء' },
        lead: {
          en: 'Giving water is another beneficial sadaqah for Taurus. The water is given to someone who needs or can benefit from it.',
          fr: 'Offrir de l\'eau est une autre sadaqah bénéfique pour le Taureau. L\'eau est donnée à une personne qui en a besoin ou qui peut en bénéficier.',
          ar: 'تقديم الماء صدقة مفيدة أخرى للثور، ويُعطى الماء لشخص يحتاجه أو يمكنه الاستفادة منه.',
        },
      },
      {
        title: { en: 'Supporting an Elderly Person — Provision', fr: 'Soutenir une Personne Âgée — Subsistance', ar: 'دعم شخص مسن — الرزق' },
        lead: {
          en: 'A particularly important form of sadaqah for Taurus is helping an elderly man or woman. This can involve regularly assisting an elderly person with their needs, including:',
          fr: 'Une forme de sadaqah particulièrement importante pour le Taureau consiste à aider un homme ou une femme âgé(e). Cela peut impliquer d\'assister régulièrement une personne âgée dans ses besoins, notamment :',
          ar: 'من أهم أشكال الصدقة للثور مساعدة رجل أو امرأة مسنة، ويمكن أن يشمل ذلك مساعدة الشخص المسن بانتظام في احتياجاته، بما في ذلك:',
        },
        bullets: {
          en: ['Financial assistance', 'Food', 'Household necessities', 'Medical or other essential expenses', 'Other practical needs'],
          fr: ['Une aide financière', 'De la nourriture', 'Des besoins essentiels du foyer', 'Des frais médicaux ou d\'autres dépenses essentielles', 'D\'autres besoins pratiques'],
          ar: ['مساعدة مالية', 'طعام', 'احتياجات المنزل الأساسية', 'نفقات طبية أو نفقات أساسية أخرى', 'احتياجات عملية أخرى'],
        },
        after: {
          en: "The assistance may be provided regularly or whenever the person is in need. This is regarded in the tradition as a secret sadaqah for increasing and sustaining one's provision (rizq). The emphasis is on quietly and consistently helping an elderly person without seeking recognition.",
          fr: 'Cette aide peut être apportée régulièrement ou chaque fois que la personne en a besoin. Cette pratique est considérée dans la tradition comme une sadaqah secrète permettant d\'augmenter et de préserver sa subsistance (rizq). L\'accent est mis sur le fait d\'aider discrètement et régulièrement une personne âgée, sans chercher la reconnaissance.',
          ar: 'يمكن تقديم هذه المساعدة بانتظام أو كلما احتاج الشخص إليها. وتُعتبر هذه الممارسة في هذا التقليد صدقة سرية لزيادة الرزق والحفاظ عليه، مع التركيز على مساعدة الشخص المسن بهدوء وانتظام دون طلب الشهرة أو التقدير.',
        },
      },
    ],
    timing: {
      title: { en: 'Recommended Day — Friday', fr: 'Jour Recommandé — Vendredi', ar: 'اليوم الموصى به — الجمعة' },
      lines: {
        en: [
          'For the Taurus-related sadaqah practices, Friday is considered a particularly suitable day for giving the charity.',
          'This is connected in the tradition with Venus (al-Zuhrah), the planetary ruler associated with Taurus.',
          'Therefore, when possible, these sadaqah practices may be performed on Friday, while maintaining the intention of sincere charity and seeking blessing, protection, and increase in provision.',
        ],
        fr: [
          'Pour les pratiques de sadaqah liées au Taureau, le vendredi est considéré comme un jour particulièrement approprié pour donner la charité.',
          'Cela est lié, dans la tradition, à Vénus (al-Zuhrah), la planète régente associée au Taureau.',
          'Par conséquent, lorsque cela est possible, ces pratiques de sadaqah peuvent être accomplies le vendredi, tout en gardant l\'intention d\'une charité sincère et en recherchant la bénédiction, la protection et l\'augmentation de la subsistance.',
        ],
        ar: [
          'بالنسبة لممارسات الصدقة المرتبطة بالثور، يُعتبر يوم الجمعة يومًا مناسبًا بشكل خاص لتقديم الصدقة.',
          'ويرتبط ذلك في هذا التقليد بكوكب الزهرة، الكوكب الحاكم المرتبط بالثور.',
          'لذلك، حيثما أمكن، يمكن أداء ممارسات الصدقة هذه يوم الجمعة، مع الحفاظ على نية الصدقة الخالصة وطلب البركة والحماية وزيادة الرزق.',
        ],
      },
    },
    authorizedBy: 'Cheikh Mahdiyou Niane',
    videoUrl: 'https://youtu.be/_7XJhemrBzg?is=3xvH_rJ3MhbQ9Yma',
  },

  Gemini: {
    signEn: 'Gemini',
    signFr: 'Gémeaux',
    signArabic: 'الجوزاء',
    transliteration: 'Jawzāʾ',
    specific: [
      {
        title: { en: 'Kola Nut Sadaqah', fr: 'Sadaqah de Noix de Kola', ar: 'صدقة جوز الكولا' },
        lead: {
          en: 'A form of sadaqah associated with Gemini (Jawzāʾ) is giving 100 kola nuts. The kola nuts may include:',
          fr: 'Une forme de sadaqah associée aux Gémeaux (Jawzāʾ) consiste à offrir 100 noix de kola. Les noix de kola peuvent inclure :',
          ar: 'من أشكال الصدقة المرتبطة بالجوزاء تقديم 100 حبة من جوز الكولا، ويمكن أن تشمل:',
        },
        bullets: {
          en: ['White kola nuts', 'Red kola nuts', 'A combination of white and red kola nuts'],
          fr: ['Des noix de kola blanches', 'Des noix de kola rouges', 'Un mélange de noix de kola blanches et rouges'],
          ar: ['جوز كولا أبيض', 'جوز كولا أحمر', 'مزيج من جوز الكولا الأبيض والأحمر'],
        },
        after: {
          en: 'The total amount is 100 kola nuts, which are then distributed as sadaqah.',
          fr: 'La quantité totale est de 100 noix de kola, qui sont ensuite distribuées en sadaqah.',
          ar: 'يكون العدد الإجمالي 100 حبة من جوز الكولا، تُوزَّع بعد ذلك كصدقة.',
        },
      },
      {
        title: { en: 'Money Sadaqah — Preservation of Wealth', fr: 'Sadaqah d\'Argent — Préservation de la Richesse', ar: 'صدقة المال — الحفاظ على المال' },
        lead: {
          en: "Giving money as sadaqah is another important practice associated with Gemini. This sadaqah is intended to help with the preservation and stability of wealth. The purpose is to give a portion of one's wealth away as sadaqah so that wealth is not simply accumulated and lost or continuously spent. The amount of money can be according to the person's ability and circumstances.",
          fr: 'Offrir de l\'argent en sadaqah est une autre pratique importante associée aux Gémeaux. Cette sadaqah vise à aider à la préservation et à la stabilité de la richesse. L\'objectif est de donner une partie de ses biens en sadaqah, afin que la richesse ne soit pas simplement accumulée, perdue ou continuellement dépensée. Le montant de l\'argent peut être déterminé selon les capacités et la situation de la personne.',
          ar: 'تقديم المال كصدقة ممارسة مهمة أخرى مرتبطة بالجوزاء، وتهدف هذه الصدقة إلى المساعدة في حفظ المال واستقراره. والغرض منها إخراج جزء من المال كصدقة حتى لا يبقى المال متراكمًا فحسب أو يُفقد أو يُنفق باستمرار. ويمكن تحديد مبلغ المال بحسب قدرة الشخص وظروفه.',
        },
        after: {
          en: "Intention: Give sincerely as sadaqah, with the intention of helping others and seeking stability, preservation, and blessing in one's wealth.",
          fr: 'Intention : donner sincèrement en sadaqah, avec l\'intention d\'aider autrui et de rechercher la stabilité, la préservation et la bénédiction de sa richesse.',
          ar: 'النية: التصدق بإخلاص، بنية مساعدة الآخرين وطلب الاستقرار والحفظ والبركة في المال.',
        },
      },
      {
        title: { en: 'Three-Coloured Chicken Sadaqah', fr: 'Sadaqah d\'un Poulet Tricolore', ar: 'صدقة دجاجة ثلاثية الألوان' },
        lead: {
          en: 'Another form of sadaqah is giving a chicken. The chicken may be of different colours, particularly a combination of:',
          fr: 'Une autre forme de sadaqah consiste à offrir un poulet. Le poulet peut être de différentes couleurs, en particulier une combinaison de :',
          ar: 'من أشكال الصدقة الأخرى تقديم دجاجة، ويمكن أن تكون الدجاجة بألوان مختلفة، وخاصة مزيج من:',
        },
        bullets: { en: ['Black', 'White', 'Red'], fr: ['Noir', 'Blanc', 'Rouge'], ar: ['الأسود', 'الأبيض', 'الأحمر'] },
        after: {
          en: 'The chicken is given out as sadaqah to someone who can benefit from it.',
          fr: 'Le poulet est offert en sadaqah à une personne qui peut en bénéficier.',
          ar: 'تُقدَّم الدجاجة كصدقة لشخص يمكنه الاستفادة منها.',
        },
      },
      {
        title: { en: 'Guinea Fowl (Pintade) Sadaqah', fr: 'Sadaqah de Pintade', ar: 'صدقة الدجاج الغيني' },
        lead: {
          en: 'Another form of sadaqah is giving a guinea fowl (English: Guinea fowl, French: Pintade). The guinea fowl is given as sadaqah and distributed to someone who can benefit from it.',
          fr: 'Une autre forme de sadaqah consiste à offrir une pintade. La pintade est donnée en sadaqah et distribuée à une personne qui peut en bénéficier.',
          ar: 'من أشكال الصدقة الأخرى تقديم الدجاج الغيني (Pintade بالفرنسية). يُقدَّم الدجاج الغيني كصدقة ويُوزَّع على شخص يمكنه الاستفادة منه.',
        },
      },
      {
        title: { en: 'Educational Materials Sadaqah', fr: 'Sadaqah de Matériel Éducatif', ar: 'صدقة المواد التعليمية' },
        lead: {
          en: 'Providing educational materials is another beneficial form of sadaqah for Gemini. This may include:',
          fr: 'Fournir du matériel éducatif est une autre forme bénéfique de sadaqah pour les Gémeaux. Cela peut inclure :',
          ar: 'توفير المواد التعليمية شكل مفيد آخر من أشكال الصدقة للجوزاء، ويمكن أن يشمل ذلك:',
        },
        bullets: {
          en: ['White writing paper', 'Exercise books', 'Notebooks', 'Pens', 'Pencils', 'Other basic school supplies'],
          fr: ['Du papier blanc', 'Des cahiers d\'exercices', 'Des carnets', 'Des stylos', 'Des crayons', 'D\'autres fournitures scolaires de base'],
          ar: ['ورق كتابة أبيض', 'دفاتر تمارين', 'كراسات', 'أقلام حبر', 'أقلام رصاص', 'لوازم مدرسية أساسية أخرى'],
        },
        after: {
          en: 'These materials can be given to children or students who need them for their education.',
          fr: 'Ce matériel peut être offert à des enfants ou à des élèves qui en ont besoin pour leur éducation.',
          ar: 'يمكن تقديم هذه المواد للأطفال أو الطلاب الذين يحتاجونها لتعليمهم.',
        },
      },
      {
        title: { en: "Supporting Teachers and Qur'anic Teachers", fr: 'Soutenir les Enseignants et les Maîtres Coraniques', ar: 'دعم المعلمين ومعلمي القرآن' },
        lead: {
          en: "Educational sadaqah can also be directed toward teachers, including Qur'anic teachers. This may include helping a teacher or their students with:",
          fr: 'La sadaqah éducative peut également être dirigée vers les enseignants, y compris les maîtres coraniques. Cela peut inclure l\'aide apportée à un enseignant ou à ses élèves sous forme de :',
          ar: 'يمكن أيضًا توجيه الصدقة التعليمية نحو المعلمين، بمن فيهم معلمو القرآن، ويمكن أن يشمل ذلك مساعدة المعلم أو طلابه بـ:',
        },
        bullets: {
          en: ['Books', 'Pens', 'Writing materials', 'Educational resources', 'Other materials needed for teaching and learning'],
          fr: ['Livres', 'Stylos', 'Matériel d\'écriture', 'Ressources pédagogiques', 'D\'autres matériels nécessaires à l\'enseignement et à l\'apprentissage'],
          ar: ['كتب', 'أقلام', 'مواد للكتابة', 'موارد تعليمية', 'مواد أخرى لازمة للتعليم والتعلم'],
        },
        after: {
          en: 'The sadaqah can therefore benefit either the teacher or the students.',
          fr: 'Cette sadaqah peut donc bénéficier soit à l\'enseignant, soit à ses élèves.',
          ar: 'وبذلك يمكن أن تعود هذه الصدقة بالنفع على المعلم أو على طلابه.',
        },
      },
      {
        title: { en: 'Feeding Children', fr: 'Nourrir les Enfants', ar: 'إطعام الأطفال' },
        lead: {
          en: 'Another form of sadaqah is giving food to children. Food can be prepared or purchased and given directly to children who can benefit from it. The intention is to provide nourishment and assistance through sadaqah.',
          fr: 'Une autre forme de sadaqah consiste à donner de la nourriture aux enfants. La nourriture peut être préparée ou achetée, puis donnée directement aux enfants qui peuvent en bénéficier. L\'intention est d\'apporter une nourriture bénéfique et une aide à travers la sadaqah.',
          ar: 'من أشكال الصدقة الأخرى تقديم الطعام للأطفال، ويمكن تحضير الطعام أو شراؤه وتقديمه مباشرة للأطفال الذين يمكنهم الاستفادة منه. والنية هي توفير الغذاء والمساعدة من خلال الصدقة.',
        },
      },
    ],
    authorizedBy: 'Cheikh Mahdiyou Niane',
    videoUrl: 'https://youtu.be/AiM1UMKZmr4?is=8Mstk8Dfy0OB_nDw',
  },

  Cancer: {
    signEn: 'Cancer',
    signFr: 'Cancer',
    signArabic: 'السرطان',
    transliteration: 'Saraṭān',
    specific: [
      {
        title: { en: 'Salt Sadaqah', fr: 'Sadaqah de Sel', ar: 'صدقة الملح' },
        lead: {
          en: "A form of sadaqah associated with Cancer (Saraṭān) is giving salt according to one's age. The amount of salt is determined by the person's current age:",
          fr: 'Une forme de sadaqah associée au Cancer (Saraṭān) consiste à offrir du sel selon l\'âge de la personne. La quantité de sel est déterminée par l\'âge actuel de la personne :',
          ar: 'من أشكال الصدقة المرتبطة بالسرطان تقديم الملح بحسب عمر الشخص، وتُحدَّد كمية الملح بحسب العمر الحالي للشخص:',
        },
        bullets: {
          en: ['Age 25 → 25 kg of salt', 'Age 30 → 30 kg of salt', 'Age 40 → 40 kg of salt'],
          fr: ['25 ans → 25 kg de sel', '30 ans → 30 kg de sel', '40 ans → 40 kg de sel'],
          ar: ['25 سنة ← 25 كغ من الملح', '30 سنة ← 30 كغ من الملح', '40 سنة ← 40 كغ من الملح'],
        },
        after: {
          en: "The amount is weighed according to the person's age and then given out as sadaqah. This may be performed yearly, using the person's age at that time.",
          fr: 'La quantité est pesée selon l\'âge de la personne, puis distribuée en sadaqah. Cette pratique peut être accomplie chaque année, selon l\'âge de la personne à ce moment-là.',
          ar: 'تُوزَن الكمية بحسب عمر الشخص، ثم تُوزَّع كصدقة. ويمكن أداء هذه الممارسة سنويًا، باستخدام عمر الشخص في ذلك الوقت.',
        },
      },
      {
        title: { en: 'Four Kilograms of Meat', fr: 'Quatre Kilogrammes de Viande', ar: 'أربعة كيلوغرامات من اللحم' },
        lead: {
          en: 'Another form of sadaqah is giving 4 kg of meat. The meat may be:',
          fr: 'Une autre forme de sadaqah consiste à offrir 4 kg de viande. La viande peut être :',
          ar: 'من أشكال الصدقة الأخرى تقديم 4 كغ من اللحم، ويمكن أن يكون اللحم:',
        },
        bullets: { en: ['Beef', 'Or another type of meat'], fr: ['Du bœuf', 'Ou un autre type de viande'], ar: ['لحم بقري', 'أو نوع آخر من اللحم'] },
        after: {
          en: 'The 4 kg of meat is given out as sadaqah to people who can benefit from it.',
          fr: 'Les 4 kg de viande sont distribués en sadaqah aux personnes qui peuvent en bénéficier.',
          ar: 'تُوزَّع الـ 4 كغ من اللحم كصدقة على المحتاجين.',
        },
      },
      {
        title: { en: 'Helping a Family in Need', fr: 'Aider une Famille dans le Besoin', ar: 'مساعدة أسرة محتاجة' },
        lead: {
          en: 'Another form of sadaqah is regularly helping a family in need. This can include:',
          fr: 'Une autre forme de sadaqah consiste à aider régulièrement une famille dans le besoin. Cela peut inclure :',
          ar: 'من أشكال الصدقة الأخرى مساعدة أسرة محتاجة بانتظام، ويمكن أن يشمل ذلك:',
        },
        bullets: {
          en: ['Helping with food expenses', 'Paying for fish or other food', 'Helping with household expenses', 'Providing financial assistance when needed'],
          fr: ['Aider avec les dépenses alimentaires', 'Payer le poisson ou d\'autres denrées', 'Aider avec les dépenses du foyer', 'Apporter une aide financière lorsque nécessaire'],
          ar: ['المساعدة في نفقات الطعام', 'دفع ثمن السمك أو أطعمة أخرى', 'المساعدة في نفقات المنزل', 'تقديم مساعدة مالية عند الحاجة'],
        },
        after: {
          en: "The support can be given from time to time, according to the family's needs and one's ability to help.",
          fr: 'Ce soutien peut être apporté de temps à autre, selon les besoins de la famille et les capacités de la personne.',
          ar: 'يمكن تقديم هذا الدعم من حين لآخر، بحسب احتياجات الأسرة وقدرة الشخص على المساعدة.',
        },
      },
      {
        title: { en: 'Supporting an Elderly Woman', fr: 'Soutenir une Femme Âgée', ar: 'دعم امرأة مسنة' },
        lead: {
          en: 'Another form of sadaqah is providing financial assistance to an elderly woman in need. This may be done by:',
          fr: 'Une autre forme de sadaqah consiste à apporter une aide financière à une femme âgée dans le besoin. Cela peut se faire en :',
          ar: 'من أشكال الصدقة الأخرى تقديم مساعدة مالية لامرأة مسنة محتاجة، ويمكن أن يتم ذلك عبر:',
        },
        bullets: {
          en: ['Giving her money', 'Helping with essential expenses', 'Providing regular or occasional financial support'],
          fr: ['Lui donnant de l\'argent', 'L\'aidant avec des dépenses essentielles', 'Lui apportant un soutien financier régulier ou occasionnel'],
          ar: ['إعطائها المال', 'مساعدتها في النفقات الأساسية', 'تقديم دعم مالي منتظم أو من حين لآخر'],
        },
        after: {
          en: 'The intention is to assist and ease her difficulties through sadaqah.',
          fr: 'L\'intention est de l\'assister et d\'alléger ses difficultés grâce à la sadaqah.',
          ar: 'والنية هي مساعدتها وتخفيف صعوباتها من خلال الصدقة.',
        },
      },
      {
        title: { en: 'Giving Milk to Children', fr: 'Donner du Lait aux Enfants', ar: 'إعطاء الحليب للأطفال' },
        lead: {
          en: 'Another form of sadaqah is giving milk to children. This can be:',
          fr: 'Une autre forme de sadaqah consiste à donner du lait aux enfants. Cela peut être :',
          ar: 'من أشكال الصدقة الأخرى إعطاء الحليب للأطفال، ويمكن أن يكون:',
        },
        bullets: {
          en: ['A small bottle of milk', 'A larger quantity of milk', 'Any suitable milk that can be given to children'],
          fr: ['Une petite bouteille de lait', 'Une plus grande quantité de lait', 'Tout lait approprié pouvant être donné aux enfants'],
          ar: ['زجاجة صغيرة من الحليب', 'كمية أكبر من الحليب', 'أي حليب مناسب يمكن إعطاؤه للأطفال'],
        },
        after: {
          en: 'The milk is given as sadaqah to provide nourishment and benefit to the children.',
          fr: 'Le lait est offert en sadaqah afin d\'apporter nourriture et bienfait aux enfants.',
          ar: 'يُقدَّم الحليب كصدقة لتوفير الغذاء والفائدة للأطفال.',
        },
      },
    ],
    authorizedBy: 'Cheikh Mahdiyou Niane',
    videoUrl: 'https://youtu.be/CIeJH6HUXQU?is=SaDYy27XXhbTLQsl',
  },

  Leo: {
    signEn: 'Leo',
    signFr: 'Lion',
    signArabic: 'الأسد',
    transliteration: 'al-Asad',
    specific: [
      {
        title: { en: 'Raising and Giving a Ram', fr: 'Élever et Offrir un Bélier', ar: 'تربية كبش وتقديمه' },
        lead: {
          en: 'A primary form of sadaqah associated with Leo (al-Asad) is to raise a ram, particularly a white ram. The person may:',
          fr: 'Une forme principale de sadaqah associée au Lion (al-Asad) consiste à élever un bélier, en particulier un bélier blanc. La personne peut :',
          ar: 'من أهم أشكال الصدقة المرتبطة بالأسد تربية كبش، وخاصة كبش أبيض، ويمكن للشخص أن:',
        },
        bullets: {
          en: [
            'Obtain a ram.',
            'Keep it in an appropriate place at home or elsewhere.',
            'Feed and care for it.',
            'Allow it to grow until it reaches a suitable mature stage.',
            'Slaughter it as sadaqah.',
            'Divide the meat into portions.',
            'Distribute the meat to people who can benefit from it.',
          ],
          fr: [
            'Se procurer un bélier.',
            'Le garder dans un endroit approprié, à la maison ou ailleurs.',
            'Le nourrir et en prendre soin.',
            'Le laisser grandir jusqu\'à ce qu\'il atteigne un stade de maturité approprié.',
            'L\'abattre en tant que sadaqah.',
            'Diviser la viande en portions.',
            'Distribuer la viande aux personnes qui peuvent en bénéficier.',
          ],
          ar: [
            'يحصل على كبش.',
            'يحتفظ به في مكان مناسب في المنزل أو في مكان آخر.',
            'يطعمه ويعتني به.',
            'يتركه ينمو حتى يبلغ مرحلة نضج مناسبة.',
            'يذبحه كصدقة.',
            'يقسّم اللحم إلى حصص.',
            'يوزّع اللحم على من يمكنهم الاستفادة منه.',
          ],
        },
        after: {
          en: 'Within this tradition, there is an observation that some Leo individuals may find that the ram does not survive long enough to reach maturity. This is traditionally attributed to the heaviness of the zodiac. If the ram survives and reaches the appropriate mature stage, it can then be given as sadaqah.',
          fr: 'Dans cette tradition, on observe que certains natifs du Lion peuvent constater que le bélier ne survit pas assez longtemps pour atteindre la maturité. Cela est traditionnellement attribué à la lourdeur de ce signe. Si le bélier survit et atteint le stade de maturité approprié, il peut alors être offert en sadaqah.',
          ar: 'يُلاحَظ في هذا التقليد أن بعض مواليد الأسد قد يجدون أن الكبش لا يعيش طويلاً بما يكفي ليبلغ النضج، وهو ما يُعزى تقليديًا إلى ثقل هذا البرج. فإذا نجا الكبش وبلغ مرحلة النضج المناسبة، يمكن حينها تقديمه كصدقة.',
        },
      },
      {
        title: { en: 'Three Bowls of Cheb Yap', fr: 'Trois Bols de Cheb Yap', ar: 'ثلاث قصعات من شب ياب' },
        lead: {
          en: 'Another form of sadaqah is preparing three bowls of Cheb Yap, a Senegalese rice dish made with meat, similar to meat-based jollof rice. The practice is: 3 bowls of Cheb Yap. The prepared food is given as sadaqah to people who can benefit from it.',
          fr: 'Une autre forme de sadaqah consiste à préparer trois bols de Cheb Yap, un plat sénégalais à base de riz et de viande, semblable à un riz jollof à la viande. La pratique consiste à préparer 3 bols de Cheb Yap. Le plat préparé est offert en sadaqah aux personnes qui peuvent en bénéficier.',
          ar: 'من أشكال الصدقة الأخرى تحضير ثلاث قصعات من شب ياب، وهو طبق سنغالي من الأرز واللحم يشبه أرز الجولوف باللحم. تتمثل الممارسة في تحضير 3 قصعات من شب ياب، ويُقدَّم الطعام المُعَد كصدقة لمن يمكنهم الاستفادة منه.',
        },
      },
      {
        title: { en: 'Three Bowls of Porridge with Yogurt', fr: 'Trois Bols de Bouillie au Yaourt', ar: 'ثلاث قصعات من العصيدة باللبن' },
        lead: {
          en: 'Another food-based sadaqah is preparing 3 bowls of porridge with yogurt. The porridge can be prepared with a sour or fermented dairy component such as yogurt and distributed to people as sadaqah.',
          fr: 'Une autre sadaqah à base de nourriture consiste à préparer 3 bols de bouillie au yaourt. La bouillie peut être préparée avec un élément laitier fermenté ou acide, tel que le yaourt, puis distribuée aux personnes en sadaqah.',
          ar: 'من أشكال الصدقة الغذائية الأخرى تحضير 3 قصعات من العصيدة باللبن، ويمكن تحضير العصيدة بعنصر ألبان مخمّر أو حامض مثل اللبن، ثم توزيعها على الناس كصدقة.',
        },
      },
    ],
    summary: {
      en: [
        'White ram — raise and care for it until it reaches a suitable mature stage, then slaughter it, divide the meat, and distribute it as sadaqah.',
        '3 bowls of Cheb Yap — meat and rice dish.',
        '3 bowls of porridge with yogurt.',
      ],
      fr: [
        'Bélier blanc — l\'élever et en prendre soin jusqu\'à ce qu\'il atteigne un stade de maturité approprié, puis l\'abattre, diviser la viande et la distribuer en sadaqah.',
        '3 bols de Cheb Yap — plat de riz à la viande.',
        '3 bols de bouillie au yaourt.',
      ],
      ar: [
        'كبش أبيض — تربيته والاعتناء به حتى يبلغ مرحلة نضج مناسبة، ثم ذبحه وتقسيم لحمه وتوزيعه كصدقة.',
        '3 قصعات من شب ياب — طبق أرز باللحم.',
        '3 قصعات من العصيدة باللبن.',
      ],
    },
    authorizedBy: 'Cheikh Mahdiyou Niane',
    videoUrl: 'https://youtu.be/5cd4OeDXLPo?is=JrJgQvFLGjnpnT10',
  },

  Virgo: {
    signEn: 'Virgo',
    signFr: 'Vierge',
    signArabic: 'السنبلة',
    transliteration: 'al-Sunbula',
    specific: [
      {
        title: { en: 'One Hundred Kola Nuts', fr: 'Cent Noix de Kola', ar: 'مئة حبة من جوز الكولا' },
        lead: {
          en: 'A primary form of sadaqah associated with Virgo (al-Sunbula) is giving 100 kola nuts. The kola nuts should be a mixture of:',
          fr: 'Une forme principale de sadaqah associée à la Vierge (al-Sunbula) consiste à offrir 100 noix de kola. Les noix de kola doivent être un mélange de :',
          ar: 'من أهم أشكال الصدقة المرتبطة بالسنبلة تقديم 100 حبة من جوز الكولا، ويجب أن تكون حبات جوز الكولا مزيجًا من:',
        },
        bullets: { en: ['Red kola nuts', 'White kola nuts'], fr: ['Noix de kola rouges', 'Noix de kola blanches'], ar: ['جوز كولا أحمر', 'جوز كولا أبيض'] },
        after: {
          en: 'The 100 kola nuts are mixed together and distributed as sadaqah.',
          fr: 'Les 100 noix de kola sont mélangées puis distribuées en sadaqah.',
          ar: 'تُخلَط الـ 100 حبة من جوز الكولا معًا ثم تُوزَّع كصدقة.',
        },
      },
      {
        title: { en: 'Money Sadaqah', fr: 'Sadaqah d\'Argent', ar: 'صدقة المال' },
        lead: {
          en: "Giving money as sadaqah is another beneficial practice for Virgo. The amount can be according to the person's ability and circumstances. It should be given sincerely to someone who can benefit from it.",
          fr: 'Offrir de l\'argent en sadaqah est une autre pratique bénéfique pour la Vierge. Le montant peut être déterminé selon les capacités et la situation de la personne. Il doit être donné sincèrement à quelqu\'un qui peut en bénéficier.',
          ar: 'تقديم المال كصدقة ممارسة مفيدة أخرى للسنبلة، ويمكن تحديد المبلغ بحسب قدرة الشخص وظروفه، وينبغي تقديمه بإخلاص لمن يمكنه الاستفادة منه.',
        },
      },
      {
        title: { en: 'Three Cereals Sadaqah', fr: 'Sadaqah de Trois Céréales', ar: 'صدقة الحبوب الثلاثة' },
        lead: {
          en: 'Another form of sadaqah is giving three different types of cereal:',
          fr: 'Une autre forme de sadaqah consiste à offrir trois types de céréales différents :',
          ar: 'من أشكال الصدقة الأخرى تقديم ثلاثة أنواع مختلفة من الحبوب:',
        },
        bullets: {
          en: ['Millet', 'Rice', 'Bessi — a Wolof cereal/grain similar to millet'],
          fr: ['Mil', 'Riz', 'Bessi — une céréale wolof semblable au mil'],
          ar: ['الدخن', 'الأرز', 'بيسي — حبة ولوفية تشبه الدخن'],
        },
        after: {
          en: 'The three cereals can be given together as sadaqah to people or families who can benefit from them.',
          fr: 'Les trois céréales peuvent être offertes ensemble en sadaqah à des personnes ou des familles qui peuvent en bénéficier.',
          ar: 'يمكن تقديم الحبوب الثلاثة معًا كصدقة لأشخاص أو أسر يمكنهم الاستفادة منها.',
        },
      },
    ],
    secret: {
      title: { en: 'Secret Sadaqah of Virgo — Age 40', fr: 'Sadaqah Secrète de la Vierge — 40 ans', ar: 'الصدقة السرية للسنبلة — سن الأربعين' },
      intro: {
        en: 'A particularly important secret sadaqah associated with Virgo is performed when a person reaches the age of 40: forty metres of kafan cloth (the white cloth used to shroud a deceased Muslim before burial). Preparation of the sadaqah, according to this tradition:',
        fr: 'Une sadaqah secrète particulièrement importante associée à la Vierge est accomplie lorsqu\'une personne atteint l\'âge de 40 ans : quarante mètres de tissu de kafan (le tissu blanc utilisé pour envelopper un défunt musulman avant l\'enterrement). Selon cette tradition, la préparation de cette sadaqah se déroule ainsi :',
        ar: 'من أهم الصدقات السرية المرتبطة بالسنبلة ما يُؤدَّى عندما يبلغ الشخص سن الأربعين: أربعون مترًا من قماش الكفن (القماش الأبيض المستخدم لتكفين المسلم المتوفى قبل الدفن). وبحسب هذا التقليد، يكون إعداد هذه الصدقة كالتالي:',
      },
      bullets: {
        en: [
          'Obtain 40 metres of kafan cloth.',
          'Keep the cloth in the house overnight.',
          'The following day, divide the cloth into portions of 7 metres each.',
          'Distribute the portions as sadaqah.',
        ],
        fr: [
          'Se procurer 40 mètres de tissu de kafan.',
          'Garder le tissu à la maison pendant une nuit.',
          'Le lendemain, diviser le tissu en portions de 7 mètres.',
          'Distribuer les portions en sadaqah.',
        ],
        ar: [
          'الحصول على 40 مترًا من قماش الكفن.',
          'الاحتفاظ بالقماش في المنزل ليلة واحدة.',
          'تقسيم القماش في اليوم التالي إلى حصص، كل حصة 7 أمتار.',
          'توزيع الحصص كصدقة.',
        ],
      },
      note: {
        en: 'This is regarded as a special or secret sadaqah for Virgo, particularly associated with reaching the age of 40.',
        fr: 'Ceci est considéré comme une sadaqah spéciale ou secrète pour la Vierge, particulièrement associée au fait d\'atteindre l\'âge de 40 ans.',
        ar: 'تُعتبر هذه صدقة خاصة أو سرية للسنبلة، مرتبطة تحديدًا ببلوغ سن الأربعين.',
      },
    },
    summary: {
      en: [
        '100 kola nuts — red and white mixed together.',
        'Money — given as sadaqah.',
        'Three cereals — millet, rice, and Bessi.',
        'At age 40: 40 metres of kafan cloth.',
        'Special practice: keep the cloth overnight, then divide it into 7-metre portions and distribute it as sadaqah.',
      ],
      fr: [
        '100 noix de kola — rouges et blanches mélangées.',
        'Argent — offert en sadaqah.',
        'Trois céréales — mil, riz et Bessi.',
        'À 40 ans : 40 mètres de tissu de kafan.',
        'Pratique spéciale : garder le tissu une nuit, puis le diviser en portions de 7 mètres et le distribuer en sadaqah.',
      ],
      ar: [
        '100 حبة من جوز الكولا — أحمر وأبيض ممزوجان.',
        'المال — يُقدَّم كصدقة.',
        'ثلاثة أنواع من الحبوب — الدخن والأرز وبيسي.',
        'عند سن الأربعين: 40 مترًا من قماش الكفن.',
        'ممارسة خاصة: الاحتفاظ بالقماش ليلة واحدة، ثم تقسيمه إلى حصص من 7 أمتار وتوزيعه كصدقة.',
      ],
    },
    authorizedBy: 'Cheikh Mahdiyou Niane',
    videoUrl: 'https://youtu.be/eqo8hkl1_Gw?is=x2uqO26epupMtXxr',
  },

  Libra: {
    signEn: 'Libra',
    signFr: 'Balance',
    signArabic: 'الميزان',
    transliteration: 'al-Mīzān',
    rulingPlanet: { en: 'Venus (al-Zuhrah / الزهرة)', fr: 'Vénus (al-Zuhrah / الزهرة)', ar: 'الزهرة (al-Zuhrah)' },
    specific: [
      {
        title: { en: 'Seven Yogurts Sadaqah', fr: 'Sadaqah de Sept Yaourts', ar: 'صدقة سبع علب لبن' },
        lead: {
          en: 'A specific form of sadaqah associated with Libra (al-Mīzān) is giving seven portions of yogurt. The yogurt may be provided as:',
          fr: 'Une forme spécifique de sadaqah associée à la Balance (al-Mīzān) consiste à offrir sept portions de yaourt. Le yaourt peut être fourni sous forme de :',
          ar: 'من أشكال الصدقة المحددة المرتبطة بالميزان تقديم سبع حصص من اللبن، ويمكن أن يُقدَّم اللبن على شكل:',
        },
        bullets: {
          en: ['Seven small bags of yogurt', 'Seven sachets of yogurt', 'Seven small containers or portions of yogurt'],
          fr: ['Sept petits sachets de yaourt', 'Sept sachets de yaourt', 'Sept petits contenants ou portions de yaourt'],
          ar: ['سبعة أكياس صغيرة من اللبن', 'سبعة أكياس من اللبن', 'سبعة أوعية أو حصص صغيرة من اللبن'],
        },
        after: {
          en: 'The portions do not need to be large. Seven separate portions are the important part. The yogurt is distributed as sadaqah to people who can benefit from it.',
          fr: 'Les portions n\'ont pas besoin d\'être grandes — l\'important est qu\'il y ait sept portions distinctes. Le yaourt est distribué en sadaqah aux personnes qui peuvent en bénéficier.',
          ar: 'لا يلزم أن تكون الحصص كبيرة — المهم هو وجود سبع حصص منفصلة. يُوزَّع اللبن كصدقة على من يمكنهم الاستفادة منه.',
        },
      },
      {
        title: { en: 'Guinea Fowl Sadaqah', fr: 'Sadaqah de Pintade', ar: 'صدقة الدجاج الغيني' },
        lead: {
          en: 'Another form of sadaqah for Libra is giving guinea fowl (pintade). The guinea fowl is given as sadaqah to someone who can benefit from it.',
          fr: 'Une autre forme de sadaqah pour la Balance consiste à offrir une pintade. La pintade est donnée en sadaqah à une personne qui peut en bénéficier.',
          ar: 'من أشكال الصدقة الأخرى للميزان تقديم الدجاج الغيني، ويُقدَّم كصدقة لشخص يمكنه الاستفادة منه.',
        },
      },
      {
        title: { en: 'Three-Coloured Chicken Sadaqah', fr: 'Sadaqah d\'un Poulet Tricolore', ar: 'صدقة دجاجة ثلاثية الألوان' },
        lead: {
          en: 'Another specific animal sadaqah is giving three chickens of different colours:',
          fr: 'Une autre sadaqah animale spécifique consiste à offrir trois poulets de couleurs différentes :',
          ar: 'من أشكال الصدقة الحيوانية المحددة الأخرى تقديم ثلاث دجاجات بألوان مختلفة:',
        },
        bullets: { en: ['Black', 'White', 'Red'], fr: ['Noir', 'Blanc', 'Rouge'], ar: ['الأسود', 'الأبيض', 'الأحمر'] },
        after: {
          en: 'The three chickens are given out as sadaqah.',
          fr: 'Les trois poulets sont distribués en sadaqah.',
          ar: 'تُوزَّع الدجاجات الثلاث كصدقة.',
        },
      },
    ],
    timing: {
      title: { en: 'Recommended Timing', fr: 'Moment Recommandé', ar: 'التوقيت الموصى به' },
      lines: {
        en: [
          'Because Libra is traditionally associated with Venus (al-Zuhrah), particular days may be selected when the planetary condition is favourable.',
          'Friday is a preferred day for Libra sadaqah when Venus is in a favourable condition.',
          'Thursday may also be used when the planetary conditions are favourable.',
        ],
        fr: [
          'La Balance étant traditionnellement associée à Vénus (al-Zuhrah), certains jours peuvent être choisis lorsque la condition planétaire est favorable.',
          'Le vendredi est un jour privilégié pour la sadaqah de la Balance lorsque Vénus est dans une condition favorable.',
          'Le jeudi peut également être utilisé lorsque les conditions planétaires sont favorables.',
        ],
        ar: [
          'نظرًا لأن الميزان يرتبط تقليديًا بكوكب الزهرة، يمكن اختيار أيام معينة عندما تكون الحالة الفلكية مواتية.',
          'يوم الجمعة يوم مفضل لصدقة الميزان عندما تكون الزهرة في حالة مواتية.',
          'يمكن أيضًا استخدام يوم الخميس عندما تكون الظروف الفلكية مواتية.',
        ],
      },
    },
    summary: {
      en: [
        '7 portions of yogurt — even small sachets or portions',
        'Guinea fowl (pintade)',
        '3 chickens — black, white, and red',
        'Preferred day: Friday when favourable',
        'Alternative: Thursday when favourable',
      ],
      fr: [
        '7 portions de yaourt — même en petits sachets ou petites portions',
        'Pintade',
        '3 poulets — noir, blanc et rouge',
        'Jour privilégié : le vendredi, lorsque favorable',
        'Alternative : le jeudi, lorsque favorable',
      ],
      ar: [
        '7 حصص من اللبن — حتى ولو في أكياس أو حصص صغيرة',
        'دجاج غيني',
        '3 دجاجات — أسود وأبيض وأحمر',
        'اليوم المفضل: الجمعة عند مواتاة الظروف',
        'البديل: الخميس عند مواتاة الظروف',
      ],
    },
    authorizedBy: 'Cheikh Mahdiyou Niane',
    videoUrl: 'https://youtu.be/VsMCgoQbsAg?is=-Ob18FsMRN0Wu0YH',
  },

  Scorpio: {
    signEn: 'Scorpio',
    signFr: 'Scorpion',
    signArabic: 'العقرب',
    transliteration: 'al-ʿAqrab',
    rulingPlanet: { en: 'Mars (al-Mirrīkh / المريخ)', fr: 'Mars (al-Mirrīkh / المريخ)', ar: 'المريخ (al-Mirrīkh)' },
    specific: [
      {
        title: { en: 'Protective Ring Sadaqah', fr: 'Sadaqah d\'une Bague Protectrice', ar: 'صدقة الخاتم الحامي' },
        lead: {
          en: 'A special form of sadaqah associated with Scorpio is having or giving a good protective ring. Suitable stones may include:',
          fr: 'Une forme spéciale de sadaqah associée au Scorpion consiste à posséder ou à offrir une bonne bague protectrice. Les pierres appropriées peuvent inclure :',
          ar: 'من أشكال الصدقة الخاصة المرتبطة بالعقرب امتلاك أو تقديم خاتم حامٍ جيد، ويمكن أن تشمل الأحجار المناسبة:',
        },
        bullets: { en: ['Rose agate', 'Amethyst'], fr: ['L\'agate rose', 'L\'améthyste'], ar: ['العقيق الوردي', 'الجمشت (الأميثيست)'] },
        after: {
          en: 'The ring is regarded within this tradition as having protective and beneficial qualities and is also considered part of the sadaqah practice for Scorpio.',
          fr: 'Cette bague est considérée, dans cette tradition, comme ayant des qualités protectrices et bénéfiques, et fait également partie de la pratique de sadaqah pour le Scorpion.',
          ar: 'يُعتبر هذا الخاتم في هذا التقليد ذا خصائص حامية ومفيدة، ويُعد أيضًا جزءًا من ممارسة الصدقة للعقرب.',
        },
      },
      {
        title: { en: 'White Ram or Sheep Sadaqah', fr: 'Sadaqah d\'un Bélier ou d\'une Brebis Blanche', ar: 'صدقة كبش أو نعجة بيضاء' },
        lead: {
          en: 'Another form of sadaqah is giving a white ram or white sheep. This is particularly associated with favourable conditions involving Mars.',
          fr: 'Une autre forme de sadaqah consiste à offrir un bélier ou une brebis blanche. Cela est particulièrement associé à des conditions favorables concernant Mars.',
          ar: 'من أشكال الصدقة الأخرى تقديم كبش أو نعجة بيضاء، وترتبط هذه الصدقة بشكل خاص بالظروف المواتية المتعلقة بالمريخ.',
        },
      },
      {
        title: { en: 'Red Goat Sadaqah During a Favourable Mars Transit', fr: 'Sadaqah d\'une Chèvre Rouge lors d\'un Transit Favorable de Mars', ar: 'صدقة عنزة حمراء أثناء عبور مواتٍ للمريخ' },
        lead: {
          en: 'When Mars is transiting a favourable or friendly zodiac sign, such as Aries (Bélier), a special sadaqah may be performed. One form is giving a red goat as sadaqah. Preparation of the Red Goat Sadaqah — The goat is prepared and its meat is:',
          fr: 'Lorsque Mars transite dans un signe zodiacal favorable ou ami, comme le Bélier, une sadaqah spéciale peut être accomplie : offrir une chèvre rouge en sadaqah. La chèvre est préparée et sa viande est :',
          ar: 'عندما يعبر المريخ برجًا فلكيًا مواتيًا أو صديقًا، كالحمل، يمكن أداء صدقة خاصة: تقديم عنزة حمراء كصدقة. تُجهَّز العنزة ويُوزَّع لحمها كالتالي:',
        },
        bullets: {
          en: ['Divided into portions.', 'Distributed among people who can benefit from it.', 'Given out as sadaqah until the meat has been distributed.'],
          fr: ['Divisée en portions.', 'Distribuée aux personnes qui peuvent en bénéficier.', 'Donnée en sadaqah jusqu\'à ce que toute la viande ait été distribuée.'],
          ar: ['يُقسَّم إلى حصص.', 'يُوزَّع على من يمكنهم الاستفادة منه.', 'يُقدَّم كصدقة حتى يتم توزيع كل اللحم.'],
        },
        after: {
          en: 'The emphasis is on distributing the meat, rather than keeping it for personal consumption.',
          fr: 'L\'accent est mis sur la distribution de la viande, plutôt que sur sa consommation personnelle.',
          ar: 'التركيز هنا على توزيع اللحم، وليس على استهلاكه شخصيًا.',
        },
      },
      {
        title: { en: 'Water Sadaqah — For Patients', fr: 'Sadaqah d\'Eau — Pour les Malades', ar: 'صدقة الماء — للمرضى' },
        lead: {
          en: 'Giving water is another important sadaqah for Scorpio. A particularly beneficial form is to give water to sick or hospitalised people. For example:',
          fr: 'Offrir de l\'eau est une autre sadaqah importante pour le Scorpion. Une forme particulièrement bénéfique consiste à apporter de l\'eau aux malades ou aux personnes hospitalisées. Par exemple :',
          ar: 'تقديم الماء صدقة مهمة أخرى للعقرب، ومن أكثر أشكالها فائدة تقديم الماء للمرضى أو للأشخاص في المستشفى. على سبيل المثال:',
        },
        bullets: {
          en: ['Take drinking water to a hospital.', 'Give it to patients who need it.', 'Provide it freely as sadaqah.'],
          fr: ['Apporter de l\'eau potable à un hôpital.', 'La donner aux patients qui en ont besoin.', 'La fournir gratuitement en sadaqah.'],
          ar: ['إحضار ماء الشرب إلى المستشفى.', 'إعطاؤه للمرضى المحتاجين إليه.', 'تقديمه مجانًا كصدقة.'],
        },
        after: {
          en: 'This form of sadaqah is especially associated with Scorpio when beginning a new project or undertaking a journey.',
          fr: 'Cette forme de sadaqah est particulièrement associée au Scorpion lors du début d\'un nouveau projet ou d\'un voyage.',
          ar: 'يرتبط هذا الشكل من الصدقة بشكل خاص بالعقرب عند بدء مشروع جديد أو الشروع في رحلة.',
        },
      },
      {
        title: { en: 'Rice Sadaqah', fr: 'Sadaqah de Riz', ar: 'صدقة الأرز' },
        lead: {
          en: 'Giving rice as sadaqah is another practice associated with Scorpio. The rice can be distributed to people or families who can benefit from it.',
          fr: 'Offrir du riz en sadaqah est une autre pratique associée au Scorpion. Le riz peut être distribué aux personnes ou aux familles qui peuvent en bénéficier.',
          ar: 'تقديم الأرز كصدقة ممارسة أخرى مرتبطة بالعقرب، ويمكن توزيع الأرز على أشخاص أو أسر يمكنهم الاستفادة منه.',
        },
      },
      {
        title: { en: 'Fish Sadaqah', fr: 'Sadaqah de Poisson', ar: 'صدقة السمك' },
        lead: {
          en: 'Giving fish as sadaqah is also considered beneficial for Scorpio. The fish may be given to individuals or families in need.',
          fr: 'Offrir du poisson en sadaqah est également considéré comme bénéfique pour le Scorpion. Le poisson peut être donné à des individus ou à des familles dans le besoin.',
          ar: 'يُعتبر تقديم السمك كصدقة مفيدًا أيضًا للعقرب، ويمكن إعطاء السمك لأفراد أو أسر محتاجة.',
        },
      },
    ],
    timing: {
      title: { en: 'Timing of Scorpio Sadaqah', fr: 'Moment de la Sadaqah du Scorpion', ar: 'توقيت صدقة العقرب' },
      lines: {
        en: [
          'Tuesday — Mars Day: particularly associated with Scorpio because of its connection with Mars, the planetary ruler of the sign. When Mars is in a favourable or neutral transit, Tuesday can be chosen for giving Scorpio-related sadaqah.',
          'Sunday — Solar Alternative: can also be considered, particularly when the Sun is in a favourable condition.',
          'Special occasions: beginning a project or travelling.',
        ],
        fr: [
          'Mardi — Jour de Mars : particulièrement associé au Scorpion en raison de son lien avec Mars, la planète régente de ce signe. Lorsque Mars se trouve dans un transit favorable ou neutre, le mardi peut être choisi pour accomplir la sadaqah liée au Scorpion.',
          'Dimanche — Alternative Solaire : peut également être envisagé, en particulier lorsque le Soleil est dans une condition favorable.',
          'Occasions particulières : le début d\'un projet ou un voyage.',
        ],
        ar: [
          'الثلاثاء — يوم المريخ: يرتبط بشكل خاص بالعقرب بسبب صلته بالمريخ، الكوكب الحاكم لهذا البرج. وعندما يكون المريخ في عبور مواتٍ أو محايد، يمكن اختيار يوم الثلاثاء لتقديم الصدقة المرتبطة بالعقرب.',
          'الأحد — بديل شمسي: يمكن أيضًا اعتماده، خاصة عندما تكون الشمس في حالة مواتية.',
          'مناسبات خاصة: بدء مشروع أو السفر.',
        ],
      },
    },
    summary: {
      en: [
        'Protective ring — rose agate or amethyst',
        'White ram or sheep',
        'Red goat — particularly during a favourable Mars transit; meat divided and distributed',
        'Water — especially to sick or hospitalised people',
        'Rice',
        'Fish',
        'Preferred day: Tuesday when Mars is favourable or neutral',
        'Alternative: Sunday when the Sun is favourable',
      ],
      fr: [
        'Bague protectrice — agate rose ou améthyste',
        'Bélier ou brebis blanche',
        'Chèvre rouge — en particulier lors d\'un transit favorable de Mars ; la viande est divisée et distribuée',
        'Eau — en particulier pour les malades ou les personnes hospitalisées',
        'Riz',
        'Poisson',
        'Jour privilégié : le mardi, lorsque Mars est favorable ou neutre',
        'Alternative : le dimanche, lorsque le Soleil est favorable',
      ],
      ar: [
        'خاتم حامٍ — عقيق وردي أو جمشت',
        'كبش أو نعجة بيضاء',
        'عنزة حمراء — خاصة أثناء عبور مواتٍ للمريخ؛ يُقسَّم اللحم ويُوزَّع',
        'الماء — خاصة للمرضى أو للأشخاص في المستشفى',
        'الأرز',
        'السمك',
        'اليوم المفضل: الثلاثاء عندما يكون المريخ مواتيًا أو محايدًا',
        'البديل: الأحد عندما تكون الشمس مواتية',
      ],
    },
    authorizedBy: 'Cheikh Mahdiyou Niane',
    videoUrl: 'https://youtu.be/wJBDdTZBth4?is=jhJgo2MFYGnH2cNe',
  },

  Sagittarius: {
    signEn: 'Sagittarius',
    signFr: 'Sagittaire',
    signArabic: 'القوس',
    transliteration: 'al-Qaws',
    intro: {
      en: 'Sagittarius is considered a sign for which sadaqah is particularly important and should be given regularly. Unlike some signs that have specific items associated with their sadaqah, Sagittarius has a more open form of sadaqah — a person may give whatever they sincerely wish to give, provided it benefits another person.',
      fr: 'Le Sagittaire est considéré comme un signe pour lequel la sadaqah est particulièrement importante et doit être donnée régulièrement. Contrairement à certains signes ayant des éléments spécifiques associés à leur sadaqah, le Sagittaire a une forme de sadaqah plus ouverte — une personne peut donner ce qu\'elle souhaite sincèrement offrir, à condition que cela bénéficie à autrui.',
      ar: 'يُعتبر القوس برجًا تكون فيه الصدقة مهمة بشكل خاص وينبغي تقديمها بانتظام. وبخلاف بعض الأبراج التي ترتبط بعناصر محددة لصدقتها، يتميز القوس بشكل أكثر انفتاحًا للصدقة — إذ يمكن للشخص أن يقدّم ما يرغب في تقديمه بإخلاص، بشرط أن يعود ذلك بالنفع على شخص آخر.',
    },
    specific: [
      {
        title: { en: 'Nine Pieces of Bread', fr: 'Neuf Morceaux de Pain', ar: 'تسع قطع من الخبز' },
        lead: {
          en: 'A specific form of sadaqah is giving nine pieces of bread. The bread can be distributed to people who are in need or to anyone who can benefit from it.',
          fr: 'Une forme spécifique de sadaqah consiste à offrir neuf morceaux de pain. Le pain peut être distribué à des personnes dans le besoin ou à toute personne pouvant en bénéficier.',
          ar: 'من أشكال الصدقة المحددة تقديم تسع قطع من الخبز، ويمكن توزيع الخبز على المحتاجين أو على أي شخص يمكنه الاستفادة منه.',
        },
      },
      {
        title: { en: 'Three Bowls of Laakh', fr: 'Trois Bols de Laakh', ar: 'ثلاث قصعات من اللاخ' },
        lead: {
          en: 'Another form of sadaqah is preparing three bowls of laakh. Laakh is a Wolof-style porridge traditionally prepared with a fermented or sour dairy component, such as yogurt. The sadaqah consists of preparing 3 bowls of laakh with yogurt and giving them to people who can benefit from the food.',
          fr: 'Une autre forme de sadaqah consiste à préparer trois bols de laakh, une bouillie de style wolof traditionnellement préparée avec un élément laitier fermenté ou acide, tel que le yaourt. La sadaqah consiste à préparer 3 bols de laakh au yaourt et à les offrir aux personnes qui peuvent bénéficier de cette nourriture.',
          ar: 'من أشكال الصدقة الأخرى تحضير ثلاث قصعات من اللاخ، وهو عصيدة على الطريقة الولوفية تُحضَّر تقليديًا بعنصر ألبان مخمّر أو حامض مثل اللبن. تتمثل الصدقة في تحضير 3 قصعات من اللاخ باللبن وتقديمها لمن يمكنهم الاستفادة من هذا الطعام.',
        },
      },
      {
        title: { en: 'One-Coloured White Ram', fr: 'Un Bélier Blanc d\'une Seule Couleur', ar: 'كبش أبيض بلون واحد' },
        lead: {
          en: 'Another important sadaqah for Sagittarius is giving a single-coloured ram, particularly a white ram. The ram is given as sadaqah to someone who can benefit from it.',
          fr: 'Une autre sadaqah importante pour le Sagittaire consiste à offrir un bélier d\'une seule couleur, en particulier un bélier blanc. Le bélier est offert en sadaqah à une personne qui peut en bénéficier.',
          ar: 'من الصدقات المهمة الأخرى للقوس تقديم كبش بلون واحد، وخاصة كبش أبيض، ويُقدَّم الكبش كصدقة لشخص يمكنه الاستفادة منه.',
        },
      },
      {
        title: { en: 'Open Sadaqah', fr: 'Sadaqah Libre', ar: 'الصدقة المفتوحة' },
        lead: {
          en: 'Sagittarius has a broad range of possible sadaqah. A person may give whatever they are able and willing to give, including:',
          fr: 'Le Sagittaire dispose d\'un large éventail de sadaqah possibles. Une personne peut offrir ce qu\'elle est capable et désireuse de donner, notamment :',
          ar: 'يتمتع القوس بمجال واسع من الصدقات الممكنة، إذ يمكن للشخص أن يقدّم ما يستطيع ويرغب في تقديمه، بما في ذلك:',
        },
        bullets: {
          en: ['Food', 'Money', 'Clothing', 'Animals', 'Water', 'Assistance to people in need', 'Other beneficial forms of charity'],
          fr: ['De la nourriture', 'De l\'argent', 'Des vêtements', 'Des animaux', 'De l\'eau', 'Une assistance aux personnes dans le besoin', 'D\'autres formes bénéfiques de charité'],
          ar: ['الطعام', 'المال', 'الملابس', 'الحيوانات', 'الماء', 'مساعدة المحتاجين', 'أشكال أخرى مفيدة من الصدقة'],
        },
        after: {
          en: 'The important principle is to give sincerely and for the benefit of another person.',
          fr: 'Le principe important est de donner sincèrement, pour le bénéfice d\'autrui.',
          ar: 'المبدأ المهم هو التصدق بإخلاص ولمنفعة شخص آخر.',
        },
      },
    ],
    timing: {
      title: { en: 'Recommended Day — Thursday', fr: 'Jour Recommandé — Jeudi', ar: 'اليوم الموصى به — الخميس' },
      lines: {
        en: [
          'Thursday is considered a particularly suitable day for giving Sagittarius-related sadaqah.',
          'Where possible, the sadaqah may be given on Thursday, while maintaining the intention of sincere charity and seeking blessing and ease.',
        ],
        fr: [
          'Le jeudi est considéré comme un jour particulièrement approprié pour donner la sadaqah liée au Sagittaire.',
          'Lorsque cela est possible, la sadaqah peut être donnée le jeudi, tout en gardant l\'intention d\'une charité sincère et en recherchant la bénédiction et la facilité.',
        ],
        ar: [
          'يُعتبر يوم الخميس يومًا مناسبًا بشكل خاص لتقديم الصدقة المرتبطة بالقوس.',
          'وحيثما أمكن، يمكن تقديم الصدقة يوم الخميس، مع الحفاظ على نية الصدقة الخالصة وطلب البركة والتيسير.',
        ],
      },
    },
    summary: {
      en: ['9 pieces of bread', '3 bowls of laakh with yogurt', 'One-coloured white ram', 'Any sincere and beneficial sadaqah', 'Recommended day: Thursday'],
      fr: ['9 morceaux de pain', '3 bols de laakh au yaourt', 'Un bélier blanc d\'une seule couleur', 'Toute sadaqah sincère et bénéfique', 'Jour recommandé : le jeudi'],
      ar: ['9 قطع من الخبز', '3 قصعات من اللاخ باللبن', 'كبش أبيض بلون واحد', 'أي صدقة صادقة ومفيدة', 'اليوم الموصى به: الخميس'],
    },
    closingNote: {
      en: 'Sagittarius is traditionally regarded as a sign that benefits from frequent and generous sadaqah, so regular charity is emphasized.',
      fr: 'Le Sagittaire est traditionnellement considéré comme un signe qui bénéficie d\'une sadaqah fréquente et généreuse ; la charité régulière y est donc particulièrement mise en avant.',
      ar: 'يُعتبر القوس تقليديًا برجًا يستفيد من الصدقة المتكررة والسخية، لذلك يُشدَّد فيه بشكل خاص على الصدقة المنتظمة.',
    },
    authorizedBy: 'Cheikh Mahdiyou Niane',
    videoUrl: 'https://youtu.be/V-7gVkVQEpI?is=EE6jNZOeNfQHaFOv',
  },

  Capricorn: {
    signEn: 'Capricorn',
    signFr: 'Capricorne',
    signArabic: 'الجدي',
    transliteration: 'al-Jady',
    specific: [
      {
        title: { en: 'Rice and Millet Sadaqah', fr: 'Sadaqah de Riz et de Mil', ar: 'صدقة الأرز والدخن' },
        lead: {
          en: "A form of sadaqah associated with Capricorn is giving rice and millet according to specific measurements. The measurements are connected to the person's age and body weight:",
          fr: 'Une forme de sadaqah associée au Capricorne consiste à offrir du riz et du mil selon des mesures spécifiques, liées à l\'âge et au poids corporel de la personne :',
          ar: 'من أشكال الصدقة المرتبطة بالجدي تقديم الأرز والدخن وفق مقاييس محددة، ترتبط بعمر الشخص ووزن جسمه:',
        },
        bullets: {
          en: ["Rice: Measure an amount in kilograms corresponding to the person's age.", "Millet: Measure an amount in kilograms corresponding to the person's body weight."],
          fr: ['Riz : mesurer une quantité en kilogrammes correspondant à l\'âge de la personne.', 'Mil : mesurer une quantité en kilogrammes correspondant au poids corporel de la personne.'],
          ar: ['الأرز: تُقاس كمية بالكيلوغرام تعادل عمر الشخص.', 'الدخن: تُقاس كمية بالكيلوغرام تعادل وزن جسم الشخص.'],
        },
        after: {
          en: 'The rice and millet may be distributed little by little until the entire amount has been given out. They can be given to individuals, families, or people in need.',
          fr: 'Le riz et le mil peuvent être distribués petit à petit jusqu\'à ce que la quantité totale ait été donnée, à des individus, des familles ou des personnes dans le besoin.',
          ar: 'يمكن توزيع الأرز والدخن تدريجيًا حتى تُقدَّم الكمية بأكملها، لأفراد أو أسر أو محتاجين.',
        },
      },
      {
        title: { en: 'One-Coloured Ram Sadaqah', fr: 'Sadaqah d\'un Bélier d\'une Seule Couleur', ar: 'صدقة كبش بلون واحد' },
        lead: {
          en: 'Another important sadaqah for Capricorn is giving a single-coloured ram. A white ram is particularly associated with this sadaqah. This is described in the tradition as a particularly powerful sadaqah, and some people who follow this practice may experience it symbolically through dreams, such as dreaming that they are giving away a ram.',
          fr: 'Une autre sadaqah importante pour le Capricorne consiste à offrir un bélier d\'une seule couleur. Un bélier blanc est particulièrement associé à cette sadaqah. Elle est décrite dans la tradition comme une sadaqah particulièrement puissante, et certaines personnes qui la pratiquent peuvent en faire l\'expérience symboliquement à travers des rêves, comme rêver qu\'elles offrent un bélier.',
          ar: 'من الصدقات المهمة الأخرى للجدي تقديم كبش بلون واحد، ويرتبط الكبش الأبيض بشكل خاص بهذه الصدقة. وتُوصَف في هذا التقليد بأنها صدقة قوية بشكل خاص، وقد يختبرها بعض من يمارسونها رمزيًا من خلال الأحلام، كأن يحلم الشخص بأنه يتصدق بكبش.',
        },
      },
      {
        title: { en: 'Kafan — Burial Shroud Sadaqah', fr: 'Sadaqah du Kafan — Linceul Funéraire', ar: 'صدقة الكفن' },
        lead: {
          en: "Another form of sadaqah is giving kafan, the white cloth used to shroud a deceased Muslim before burial. The sadaqah may consist of providing the cloth needed for someone's burial. This can be given to:",
          fr: 'Une autre forme de sadaqah consiste à offrir le kafan, le tissu blanc utilisé pour envelopper un défunt musulman avant l\'enterrement. Cette sadaqah peut consister à fournir le tissu nécessaire pour l\'enterrement de quelqu\'un. Elle peut être donnée à :',
          ar: 'من أشكال الصدقة الأخرى تقديم الكفن، القماش الأبيض المستخدم لتكفين المسلم المتوفى قبل الدفن. ويمكن أن تتمثل هذه الصدقة في توفير القماش اللازم لدفن شخص ما، ويمكن تقديمها إلى:',
        },
        bullets: {
          en: ['A family preparing for a burial', 'A mosque or community', 'Someone who cannot afford the burial shroud', 'People responsible for assisting with funeral arrangements'],
          fr: ['Une famille se préparant à un enterrement', 'Une mosquée ou une communauté', 'Une personne qui ne peut pas se permettre le linceul funéraire', 'Des personnes chargées d\'organiser les funérailles'],
          ar: ['أسرة تستعد لدفن ميت', 'مسجد أو جماعة', 'شخص لا يستطيع تحمل تكلفة الكفن', 'أشخاص مسؤولون عن ترتيبات الجنازة'],
        },
      },
      {
        title: { en: 'Cowries — Petaw Sadaqah', fr: 'Sadaqah des Cauris — Petaw', ar: 'صدقة الودع — بيتاو' },
        lead: {
          en: 'Another traditional sadaqah associated with Capricorn is giving cowries, known in Wolof as petaw. These are the small white cowrie shells traditionally used for decoration and in various cultural and spiritual practices. This form of sadaqah is considered special and sensitive within the tradition.',
          fr: 'Une autre sadaqah traditionnelle associée au Capricorne consiste à offrir des cauris, appelés petaw en wolof — de petits coquillages blancs traditionnellement utilisés pour la décoration ainsi que dans diverses pratiques culturelles et spirituelles. Cette forme de sadaqah est considérée comme particulière et délicate au sein de la tradition.',
          ar: 'من الصدقات التقليدية الأخرى المرتبطة بالجدي تقديم الودع، المعروف بالولوفية باسم بيتاو — وهي أصداف بحرية بيضاء صغيرة تُستخدم تقليديًا للزينة وفي مختلف الممارسات الثقافية والروحية. ويُعتبر هذا الشكل من الصدقة خاصًا وحساسًا داخل هذا التقليد.',
        },
        after: {
          en: 'Important Guidance: Anyone intending to give petaw/cowries as sadaqah should seek guidance from a knowledgeable and trusted spiritual authority who understands the practice. According to the tradition being documented, this sadaqah may be considered capable of helping to open pathways and make matters easier, but it should not be undertaken casually. The practice is therefore regarded as one requiring proper guidance and understanding before giving it as sadaqah.',
          fr: 'Conseil important : toute personne souhaitant offrir des petaw/cauris en sadaqah devrait solliciter les conseils d\'une autorité spirituelle compétente et digne de confiance, connaissant bien cette pratique. Cette sadaqah peut être considérée, selon la tradition documentée, comme capable d\'ouvrir des voies et de faciliter certaines affaires, mais elle ne doit pas être entreprise à la légère — elle nécessite un accompagnement et une compréhension appropriés avant d\'être offerte.',
          ar: 'إرشاد مهم: على من ينوي التصدق بالودع/بيتاو أن يطلب توجيه أهل علم ومرجعية روحية موثوقة وعارفة بهذه الممارسة. وبحسب هذا التقليد الموثَّق، يمكن اعتبار هذه الصدقة قادرة على المساعدة في فتح الأبواب وتيسير الأمور، لكن ينبغي عدم الإقدام عليها باستخفاف — إذ تتطلب توجيهًا وفهمًا مناسبين قبل تقديمها كصدقة.',
        },
      },
      {
        title: { en: 'Helping Labourers and Low-Income Workers', fr: 'Aider les Travailleurs et les Personnes à Faible Revenu', ar: 'مساعدة العمال وذوي الدخل المحدود' },
        lead: {
          en: 'Another form of sadaqah for Capricorn is helping workers and labourers, particularly people earning a modest income through physically demanding or low-skilled work. This can include:',
          fr: 'Une autre forme de sadaqah pour le Capricorne consiste à aider les travailleurs et les ouvriers, en particulier les personnes ayant un revenu modeste lié à un travail physiquement exigeant ou peu qualifié. Cela peut inclure :',
          ar: 'من أشكال الصدقة الأخرى للجدي مساعدة العمال، وخاصة من لديهم دخل متواضع من عمل يتطلب جهدًا بدنيًا أو مهارة منخفضة، ويمكن أن يشمل ذلك:',
        },
        bullets: {
          en: ['Labourers', 'Casual workers', 'Construction workers', 'Cleaners', 'Other low-income workers'],
          fr: ['Des ouvriers', 'Des travailleurs journaliers', 'Des travailleurs du bâtiment', 'Des agents d\'entretien', 'D\'autres travailleurs à faible revenu'],
          ar: ['العمال', 'العمال المؤقتون', 'عمال البناء', 'عمال النظافة', 'عمال آخرون ذوو دخل محدود'],
        },
        after: {
          en: 'The person does not necessarily have to be extremely poor. The sadaqah can simply be an act of assistance and support for someone whose income is limited.',
          fr: 'La personne n\'a pas nécessairement besoin d\'être extrêmement pauvre — la sadaqah peut simplement être un acte d\'assistance et de soutien envers une personne dont le revenu est limité.',
          ar: 'لا يلزم أن يكون الشخص فقيرًا جدًا — يمكن أن تكون الصدقة ببساطة عملاً من المساعدة والدعم لشخص دخله محدود.',
        },
      },
      {
        title: { en: 'Helping a Widow and Her Children', fr: 'Aider une Veuve et Ses Enfants', ar: 'مساعدة أرملة وأطفالها' },
        lead: {
          en: 'Another important sadaqah for Capricorn is helping a widow and her children. This may include:',
          fr: 'Une autre sadaqah importante pour le Capricorne consiste à aider une veuve et ses enfants. Cela peut inclure :',
          ar: 'من الصدقات المهمة الأخرى للجدي مساعدة أرملة وأطفالها، ويمكن أن يشمل ذلك:',
        },
        bullets: {
          en: ['Financial assistance for the widow', 'Providing food or household necessities', "Helping with children's expenses", 'Supporting their education', 'Assisting with other essential needs'],
          fr: ['Une aide financière pour la veuve', 'La fourniture de nourriture ou de besoins essentiels du foyer', 'Une aide pour les dépenses des enfants', 'Un soutien à leur éducation', 'Une assistance pour d\'autres besoins essentiels'],
          ar: ['مساعدة مالية للأرملة', 'توفير الطعام أو احتياجات المنزل الأساسية', 'المساعدة في نفقات الأطفال', 'دعم تعليمهم', 'المساعدة في احتياجات أساسية أخرى'],
        },
        after: {
          en: 'The assistance can be given regularly or whenever the family needs support. This is regarded as a particularly meaningful form of sadaqah because it supports both the widow and the children who depend on her.',
          fr: 'Cette aide peut être apportée régulièrement ou chaque fois que la famille en a besoin — c\'est une forme de sadaqah particulièrement significative, car elle soutient à la fois la veuve et les enfants qui dépendent d\'elle.',
          ar: 'يمكن تقديم هذه المساعدة بانتظام أو كلما احتاجت الأسرة إلى دعم — وتُعد هذه صدقة ذات معنى خاص لأنها تدعم الأرملة والأطفال الذين يعتمدون عليها في آن واحد.',
        },
      },
    ],
    secret: {
      title: { en: 'Secret Sadaqah of Capricorn', fr: 'Sadaqah Secrète du Capricorne', ar: 'الصدقة السرية للجدي' },
      intro: {
        en: 'The practices above are regarded within this tradition as forms of secret or special sadaqah for Capricorn. Particular emphasis is placed on:',
        fr: 'Les pratiques ci-dessus sont considérées, dans cette tradition, comme des formes de sadaqah secrète ou spéciale pour le Capricorne. Un accent particulier est mis sur :',
        ar: 'تُعتبر الممارسات المذكورة أعلاه في هذا التقليد أشكالاً من الصدقة السرية أو الخاصة للجدي، مع تركيز خاص على:',
      },
      bullets: {
        en: ['Rice and millet', 'A white, single-coloured ram', 'Kafan (burial shroud)', 'Cowries / petaw, with proper guidance', 'Helping labourers and low-income workers', 'Supporting widows and their children'],
        fr: ['Le riz et le mil', 'Un bélier blanc d\'une seule couleur', 'Le kafan (linceul funéraire)', 'Les cauris / petaw, avec un accompagnement approprié', 'L\'aide aux travailleurs et aux personnes à faible revenu', 'Le soutien aux veuves et à leurs enfants'],
        ar: ['الأرز والدخن', 'كبش أبيض بلون واحد', 'الكفن', 'الودع / بيتاو، مع التوجيه المناسب', 'مساعدة العمال وذوي الدخل المحدود', 'دعم الأرامل وأطفالهن'],
      },
      note: {
        en: 'The sadaqah should be given discreetly and sincerely, with the intention of benefiting another person rather than seeking recognition.',
        fr: 'La sadaqah doit être donnée discrètement et sincèrement, avec l\'intention de bénéficier à autrui plutôt que de rechercher la reconnaissance.',
        ar: 'ينبغي تقديم الصدقة بتكتم وإخلاص، بنية الإحسان لشخص آخر لا طلب التقدير أو الشهرة.',
      },
    },
    authorizedBy: 'Cheikh Mahdiyou Niane',
    videoUrl: 'https://youtu.be/v4_Z5ld1OAE?is=M5-AcuZoBFn4OBHw',
  },

  Aquarius: {
    signEn: 'Aquarius',
    signFr: 'Verseau',
    signArabic: 'الدلو',
    transliteration: 'al-Dalw',
    specific: [
      {
        title: { en: 'Kola Nut Sadaqah', fr: 'Sadaqah de Noix de Kola', ar: 'صدقة جوز الكولا' },
        lead: {
          en: 'A primary form of sadaqah associated with Aquarius (al-Dalw) is giving 100 kola nuts. The kola nuts may be:',
          fr: 'Une forme principale de sadaqah associée au Verseau (al-Dalw) consiste à offrir 100 noix de kola. Les noix de kola peuvent être :',
          ar: 'من أهم أشكال الصدقة المرتبطة بالدلو تقديم 100 حبة من جوز الكولا، ويمكن أن تكون:',
        },
        bullets: {
          en: ['White kola nuts', 'Red kola nuts', 'A combination of white and red kola nuts'],
          fr: ['Des noix de kola blanches', 'Des noix de kola rouges', 'Un mélange de noix de kola blanches et rouges'],
          ar: ['جوز كولا أبيض', 'جوز كولا أحمر', 'مزيج من جوز الكولا الأبيض والأحمر'],
        },
        after: {
          en: 'This sadaqah can be performed monthly, or every three months. The 100 kola nuts are then distributed as sadaqah.',
          fr: 'Cette sadaqah peut être accomplie chaque mois, ou tous les trois mois. Les 100 noix de kola sont ensuite distribuées en sadaqah.',
          ar: 'يمكن أداء هذه الصدقة شهريًا، أو كل ثلاثة أشهر. وتُوزَّع الـ 100 حبة من جوز الكولا بعد ذلك كصدقة.',
        },
      },
      {
        title: { en: 'Money Sadaqah', fr: 'Sadaqah d\'Argent', ar: 'صدقة المال' },
        lead: {
          en: "Giving money as sadaqah is another beneficial practice for Aquarius. The amount can be determined according to one's ability and circumstances. The money should be given sincerely to someone or a cause that can benefit from it.",
          fr: 'Offrir de l\'argent en sadaqah est une autre pratique bénéfique pour le Verseau. Le montant peut être déterminé selon les capacités et la situation de la personne. L\'argent doit être donné sincèrement à une personne ou à une cause qui peut en bénéficier.',
          ar: 'تقديم المال كصدقة ممارسة مفيدة أخرى للدلو، ويمكن تحديد المبلغ بحسب قدرة الشخص وظروفه، وينبغي تقديم المال بإخلاص لشخص أو قضية يمكن أن يستفيد منها.',
        },
      },
      {
        title: { en: 'Supporting a Community or Group', fr: 'Soutenir une Communauté ou un Groupe', ar: 'دعم مجتمع أو جماعة' },
        lead: {
          en: 'Another form of sadaqah is helping a community, group, or voluntary organisation. This can include supporting:',
          fr: 'Une autre forme de sadaqah consiste à aider une communauté, un groupe ou une organisation bénévole. Cela peut inclure le soutien à :',
          ar: 'من أشكال الصدقة الأخرى مساعدة مجتمع أو جماعة أو منظمة تطوعية، ويمكن أن يشمل ذلك دعم:',
        },
        bullets: {
          en: ['A local community', 'A voluntary group', 'A charitable group', 'A masjid', 'A community project', 'A group serving people in need'],
          fr: ['Une communauté locale', 'Un groupe bénévole', 'Un groupe caritatif', 'Une mosquée', 'Un projet communautaire', 'Un groupe au service des personnes dans le besoin'],
          ar: ['مجتمع محلي', 'جماعة تطوعية', 'جماعة خيرية', 'مسجد', 'مشروع مجتمعي', 'جماعة تخدم المحتاجين'],
        },
        after: {
          en: 'Support may be financial, material, or practical.',
          fr: 'Le soutien peut être financier, matériel ou pratique.',
          ar: 'يمكن أن يكون الدعم ماليًا أو ماديًا أو عمليًا.',
        },
      },
      {
        title: { en: 'Guinea Fowl or Chicken Sadaqah', fr: 'Sadaqah de Pintade ou de Poulet', ar: 'صدقة دجاج غيني أو دجاجة' },
        lead: {
          en: 'Another form of sadaqah is giving guinea fowl (pintade) or chicken. The bird is given as sadaqah to someone who can benefit from it.',
          fr: 'Une autre forme de sadaqah consiste à offrir une pintade ou un poulet. L\'oiseau est donné en sadaqah à une personne qui peut en bénéficier.',
          ar: 'من أشكال الصدقة الأخرى تقديم دجاج غيني أو دجاجة، ويُقدَّم الطائر كصدقة لشخص يمكنه الاستفادة منه.',
        },
      },
      {
        title: { en: 'Three-Coloured Chicken Sadaqah', fr: 'Sadaqah d\'un Poulet Tricolore', ar: 'صدقة دجاجة ثلاثية الألوان' },
        lead: {
          en: 'A specific form of animal sadaqah is giving three chickens of different colours:',
          fr: 'Une forme spécifique de sadaqah animale consiste à offrir trois poulets de couleurs différentes :',
          ar: 'من أشكال الصدقة الحيوانية المحددة تقديم ثلاث دجاجات بألوان مختلفة:',
        },
        bullets: { en: ['Black', 'Red', 'White'], fr: ['Noir', 'Rouge', 'Blanc'], ar: ['الأسود', 'الأحمر', 'الأبيض'] },
        after: {
          en: 'The three chickens are given out as sadaqah.',
          fr: 'Les trois poulets sont distribués en sadaqah.',
          ar: 'تُوزَّع الدجاجات الثلاث كصدقة.',
        },
      },
      {
        title: { en: 'Water Sadaqah', fr: 'Sadaqah d\'Eau', ar: 'صدقة الماء' },
        lead: {
          en: 'Giving water is another beneficial form of sadaqah for Aquarius. The water is given to someone who needs or can benefit from it.',
          fr: 'Offrir de l\'eau est une autre forme bénéfique de sadaqah pour le Verseau. L\'eau est donnée à une personne qui en a besoin ou qui peut en bénéficier.',
          ar: 'تقديم الماء شكل مفيد آخر من أشكال الصدقة للدلو، ويُعطى الماء لشخص يحتاجه أو يمكنه الاستفادة منه.',
        },
      },
    ],
    summary: {
      en: [
        '100 kola nuts — white, red, or a combination; monthly or every three months.',
        "Money — given as sadaqah according to one's ability.",
        'Community or group support — help a voluntary group, community, masjid, or similar organisation.',
        'Guinea fowl (pintade) or chicken — given as sadaqah.',
        'Three-coloured chickens — black, red, and white.',
        'Water — given to someone who can benefit from it.',
      ],
      fr: [
        '100 noix de kola — blanches, rouges, ou un mélange ; chaque mois ou tous les trois mois.',
        'Argent — offert en sadaqah selon ses capacités.',
        'Soutien à une communauté ou un groupe — aider un groupe bénévole, une communauté, une mosquée ou une organisation similaire.',
        'Pintade ou poulet — offert en sadaqah.',
        'Poulets tricolores — noir, rouge et blanc.',
        'Eau — donnée à une personne qui peut en bénéficier.',
      ],
      ar: [
        '100 حبة من جوز الكولا — أبيض أو أحمر أو مزيج منهما؛ شهريًا أو كل ثلاثة أشهر.',
        'المال — يُقدَّم كصدقة بحسب القدرة.',
        'دعم مجتمع أو جماعة — مساعدة جماعة تطوعية أو مجتمع أو مسجد أو منظمة مشابهة.',
        'دجاج غيني أو دجاجة — يُقدَّم كصدقة.',
        'دجاجات ثلاثية الألوان — أسود وأحمر وأبيض.',
        'الماء — يُعطى لشخص يمكنه الاستفادة منه.',
      ],
    },
    authorizedBy: 'Cheikh Mahdiyou Niane',
    videoUrl: 'https://youtu.be/GzDou_TW-cM?is=8CfKJVMSB_kojOWH',
  },

  Pisces: {
    signEn: 'Pisces',
    signFr: 'Poissons',
    signArabic: 'الحوت',
    transliteration: 'al-Ḥūt',
    specific: [
      {
        title: { en: 'Fish Sadaqah', fr: 'Sadaqah de Poisson', ar: 'صدقة السمك' },
        lead: {
          en: 'A primary form of sadaqah associated with Pisces (al-Ḥūt) is giving fish. A particularly recommended amount is 12 fish, given as sadaqah to people who can benefit from them.',
          fr: 'Une forme principale de sadaqah associée aux Poissons (al-Ḥūt) consiste à offrir du poisson. Une quantité particulièrement recommandée est de 12 poissons, offerts en sadaqah aux personnes qui peuvent en bénéficier.',
          ar: 'من أهم أشكال الصدقة المرتبطة بالحوت تقديم السمك، والكمية الموصى بها بشكل خاص هي 12 سمكة، تُقدَّم كصدقة لمن يمكنهم الاستفادة منها.',
        },
      },
      {
        title: { en: 'Seven-Chicken Food Sadaqah', fr: 'Sadaqah Alimentaire de Sept Poulets', ar: 'صدقة طعام سبع دجاجات' },
        lead: {
          en: 'Another form of sadaqah can be performed when a person has an important project or undertaking. The practice is to:',
          fr: 'Une autre forme de sadaqah peut être accomplie lorsqu\'une personne a un projet ou une entreprise importante. La pratique consiste à :',
          ar: 'يمكن أداء شكل آخر من الصدقة عندما يكون لدى الشخص مشروع أو أمر مهم، وتتمثل الممارسة في:',
        },
        bullets: {
          en: ['Take seven chickens.', 'Prepare and cook the chickens.', 'Distribute the prepared food as sadaqah.', 'Give the food to people in need, such as a poor family.', 'Continue distributing it until the food has been completely given out.'],
          fr: ['Prendre sept poulets.', 'Les préparer et les cuisiner.', 'Distribuer le plat préparé en sadaqah.', 'Donner la nourriture aux personnes dans le besoin, comme une famille pauvre.', 'Continuer à la distribuer jusqu\'à ce qu\'elle soit entièrement donnée.'],
          ar: ['أخذ سبع دجاجات.', 'تحضيرها وطهيها.', 'توزيع الطعام المُعَد كصدقة.', 'تقديم الطعام للمحتاجين، مثل أسرة فقيرة.', 'الاستمرار في التوزيع حتى يُقدَّم الطعام بالكامل.'],
        },
        after: {
          en: 'The purpose is to provide food and benefit to people who are in need.',
          fr: 'L\'objectif est d\'apporter nourriture et bienfait aux personnes qui en ont besoin.',
          ar: 'الهدف هو توفير الطعام والفائدة للمحتاجين.',
        },
      },
      {
        title: { en: 'Evening Food Sadaqah', fr: 'Sadaqah Alimentaire du Soir', ar: 'صدقة طعام المساء' },
        lead: {
          en: 'The food sadaqah may particularly be given in the evening, around the time when people would normally have:',
          fr: 'La sadaqah alimentaire peut particulièrement être offerte le soir, au moment où les gens prendraient normalement :',
          ar: 'يمكن تقديم صدقة الطعام بشكل خاص في المساء، في الوقت الذي يتناول فيه الناس عادة:',
        },
        bullets: {
          en: ['Dinner', 'An evening meal', 'Tea or other evening refreshments'],
          fr: ['Le dîner', 'Un repas du soir', 'Du thé ou d\'autres rafraîchissements du soir'],
          ar: ['العشاء', 'وجبة مسائية', 'الشاي أو مرطبات مسائية أخرى'],
        },
        after: {
          en: 'The food should be distributed to people who can benefit from it, especially those experiencing financial hardship or food insecurity.',
          fr: 'La nourriture doit être distribuée aux personnes qui peuvent en bénéficier, en particulier celles connaissant des difficultés financières ou une insécurité alimentaire.',
          ar: 'ينبغي توزيع الطعام على من يمكنهم الاستفادة منه، وخاصة من يعانون من ضائقة مالية أو انعدام الأمن الغذائي.',
        },
      },
      {
        title: { en: 'Helping Someone Experiencing Mental Health Difficulties', fr: 'Aider une Personne en Difficulté Psychologique', ar: 'مساعدة شخص يعاني من صعوبات نفسية' },
        lead: {
          en: 'Another form of sadaqah associated with Pisces is helping someone experiencing mental or emotional difficulties. This may include:',
          fr: 'Une autre forme de sadaqah associée aux Poissons consiste à aider une personne traversant des difficultés mentales ou émotionnelles. Cela peut inclure :',
          ar: 'من أشكال الصدقة الأخرى المرتبطة بالحوت مساعدة شخص يمر بصعوبات نفسية أو عاطفية، ويمكن أن يشمل ذلك:',
        },
        bullets: {
          en: ['Providing financial assistance', 'Helping with their basic needs', 'Supporting them during a difficult period', 'Offering practical assistance', 'Helping them access appropriate support'],
          fr: ['Apporter une aide financière', 'Aider avec ses besoins fondamentaux', 'La soutenir pendant une période difficile', 'Offrir une assistance pratique', 'L\'aider à accéder à un soutien approprié'],
          ar: ['تقديم مساعدة مالية', 'المساعدة في احتياجاته الأساسية', 'دعمه خلال فترة صعبة', 'تقديم مساعدة عملية', 'مساعدته في الوصول إلى الدعم المناسب'],
        },
        after: {
          en: 'The intention is to reduce their hardship and provide compassionate assistance.',
          fr: 'L\'intention est de réduire ses difficultés et de lui apporter une aide compatissante.',
          ar: 'والنية هي تخفيف معاناته وتقديم مساعدة قائمة على الرحمة.',
        },
      },
      {
        title: { en: 'Supporting Someone Involved in Spiritual Work', fr: 'Soutenir une Personne Engagée dans une Œuvre Spirituelle', ar: 'دعم شخص منخرط في عمل روحي' },
        lead: {
          en: 'Another form of sadaqah is helping a person who is engaged in spiritual or religious activity. This may include supporting:',
          fr: 'Une autre forme de sadaqah consiste à aider une personne engagée dans une activité spirituelle ou religieuse. Cela peut inclure le soutien à :',
          ar: 'من أشكال الصدقة الأخرى مساعدة شخص منخرط في نشاط روحي أو ديني، ويمكن أن يشمل ذلك دعم:',
        },
        bullets: {
          en: ['A spiritual practitioner', 'A person engaged in religious study or service', 'Someone involved in spiritual activities', 'Someone who provides spiritual guidance or related services'],
          fr: ['Un praticien spirituel', 'Une personne engagée dans l\'étude ou le service religieux', 'Une personne impliquée dans des activités spirituelles', 'Une personne qui offre un accompagnement spirituel ou des services similaires'],
          ar: ['ممارس روحي', 'شخص منخرط في الدراسة أو الخدمة الدينية', 'شخص مشارك في أنشطة روحية', 'شخص يقدّم توجيهًا روحيًا أو خدمات مشابهة'],
        },
        after: {
          en: "Assistance may be financial or practical, depending on the person's needs.",
          fr: 'L\'assistance peut être financière ou pratique, selon les besoins de la personne.',
          ar: 'يمكن أن تكون المساعدة مالية أو عملية، بحسب احتياجات الشخص.',
        },
      },
    ],
    closingNote: {
      en: 'The sadaqah should be given sincerely for the benefit of others. The food, fish, or other assistance is distributed to people who can genuinely benefit from it, particularly those experiencing poverty or hardship.',
      fr: 'La sadaqah doit être donnée sincèrement, pour le bénéfice d\'autrui. La nourriture, le poisson ou toute autre aide sont distribués à des personnes qui peuvent véritablement en bénéficier, en particulier celles connaissant la pauvreté ou des difficultés.',
      ar: 'ينبغي تقديم الصدقة بإخلاص لمنفعة الآخرين، إذ يُوزَّع الطعام أو السمك أو أي مساعدة أخرى على من يمكنهم الاستفادة الحقيقية منها، وخاصة من يعانون من الفقر أو الصعوبات.',
    },
    authorizedBy: 'Cheikh Mahdiyou Niane',
    videoUrl: 'https://youtu.be/7ifjKRr2sT4?is=z18LkfLLqvIPKIij',
  },
};

export function getZodiacSadaqah(signEn: string | undefined | null): ZodiacSadaqahEntry | null {
  if (!signEn) return null;
  return ZODIAC_SADAQAH_DATA[signEn] ?? null;
}
