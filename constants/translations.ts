export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      calculator: "Calculator",
      letterCalculator: "Letter Calculator",
      compatibility: "Compatibility",
      planetaryHours: "Planetary Hours",
      about: "About",
      guidance: "Life Guidance",
      advanced: "Istikharah",
      menu: "Menu",
    },
    
    // Drawer Menu
    drawer: {
      profileSettings: "PROFILE & SETTINGS",
      myProfile: "My Profile",
      aiSettings: "AI Settings",
      tools: "TOOLS",
      abjadCalculator: "Abjad Calculator",
      nameDestiny: "Name Destiny",
      compatibility: "Compatibility",
      istikhara: "Istikharah",
      divineTiming: "Divine Timing",
      app: "APP",
      about: "About Asrār",
      helpTutorial: "Help & Tutorial",
      language: "LANGUAGE",
      langEnglish: "English",
      langFrench: "Français",
      langArabic: "العربية",
      guestMode: "Guest Mode",
      guestUser: "Guest User",
      levelGuest: "GUEST",
      levelBasic: "BASIC",
      levelEnhanced: "ENHANCED",
      levelFull: "FULL",
    },
    
    // Home Screen Modules
    modules: {
      calculator: {
        title: "Calculator",
        description: "Advanced Abjad numerology calculations and letter analysis",
      },
      nameDestiny: {
        title: "Name Destiny",
        description: "Discover the spiritual significance and destiny encoded in names",
      },
      istikhara: {
        title: "Istikhara",
        description: "Spiritual consultation combining prayer guidance with numerology",
      },
      guidedIstikhara: {
        title: "Guided Istikhārah",
        description: "Learn the authentic prayer method and track your spiritual decisions",
        // Common navigation
        common: {
          back: "Back",
        },
        // Step labels
        steps: {
          intro: "Intro",
          prepare: "Prepare",
          prayer: "Prayer",
          dua: "Dua",
        },
        // Home/Landing Screen
        home: {
          title: "Ṣalāt al-Istikhārah",
          subtitle: "The Prayer of Seeking Guidance - a Sunnah practice to seek Allah's guidance when making important decisions",
          hadith: {
            text: "\"When one of you is concerned about a matter, let him pray two rak'ahs...\"",
            source: "— Sahih al-Bukhari 1162",
          },
          learnTitle: "📖 LEARN THE AUTHENTIC METHOD",
          guide: {
            title: "Complete Prayer Guide",
            subtitle: "Step-by-step instructions • Authentic duʿā • Prerequisites • Post-prayer guidance",
          },
          infoCard: "Istikhārah is performed when facing an important decision. The prayer consists of 2 rak'ahs followed by a specific supplication taught by the Prophet Muhammad ﷺ.",
          when: {
            title: "When to Perform Istikhārah",
            items: {
              marriage: "Marriage or important relationships",
              career: "Career decisions or job changes",
              purchases: "Major purchases or investments",
              travel: "Travel or relocation decisions",
              anyMatter: "Any permissible matter requiring guidance",
            },
          },
        },
        // Intro/Guide Screen
        intro: {
          back: "Back",
          steps: {
            intro: "Intro",
            prepare: "Prepare",
            prayer: "Prayer",
            dua: "Dua",
          },
          title: "What is Salat al-Istikhara?",
          description: "Ṣalāt al-Istikhārah (Prayer of Seeking Guidance) is a blessed Sunnah prayer taught by Prophet Muhammad ﷺ to seek Allah's guidance when making important decisions.",
          hadith: {
            title: "Authentic Hadith",
            text: "Jabir ibn Abdullah (RA) narrated: \"The Prophet ﷺ used to teach us to seek Allah's counsel in all matters, just as he used to teach us a chapter from the Quran.\"",
            source: "Sahih al-Bukhari 1162",
          },
          understanding: {
            title: "Important Understanding",
            text: "Istikhara is NOT fortune-telling. It is seeking Allah's guidance to make the decision easier and to place your trust in His wisdom, not to see dreams or receive mystical signs.",
          },
          cta: "Begin Preparation",
        },
        // Prepare Screen
        prepare: {
          title: "Before You Begin",
          step1: {
            title: "Make Wudu",
            body: "Perform complete wudu (ablution) as you would for any obligatory prayer. You must be in a state of ritual purity.",
            bullets: [
              "Wash hands, rinse mouth, rinse nose",
              "Wash face, arms to elbows",
              "Wipe head, wash feet to ankles",
            ],
          },
          step2: {
            title: "Find a Clean, Quiet Place",
            body: "Choose a clean area where you can pray without interruption. Face the Qibla (direction of the Kaaba in Makkah).",
          },
          step3: {
            title: "Have a Clear Decision in Mind",
            body: "Before praying, clearly define the matter you're seeking guidance about. Istikhara is for when you have two permissible options and need help choosing.",
            note: "Istikhara is for halal matters only. Don't pray istikhara about something clearly forbidden.",
          },
          step4: {
            title: "Choose the Right Time",
            body: "Istikhara can be prayed at any time EXCEPT:",
            avoid: [
              "After Fajr until 15 minutes after sunrise",
              "When sun is at its zenith (around Dhuhr time)",
              "After Asr until sunset",
            ],
            best: "Best times: Last third of night, after any obligatory prayer, or between Maghrib and Isha.",
          },
          cta: "Continue to Prayer",
        },
        // Prayer Screen
        prayer: {
          title: "The Two Rakats Prayer",
          prayerType: {
            title: "Prayer Type",
            body: "This is a voluntary (Nafl) prayer of 2 rakats, performed like any other voluntary prayer.",
          },
          step1: {
            title: "Make Intention (Niyyah)",
            body: "In your heart, intend: \"I am praying two rakats of Salat al-Istikhara seeking Allah's guidance.\"",
            note: "Note: The intention is in the heart, not spoken aloud.",
          },
          step2: {
            title: "First Rakat",
            items: [
              "Say Takbir (Allahu Akbar) and raise hands",
              "Recite Surah Al-Fatihah",
              "Recite a Surah (recommended: Surah Al-Kafirun)",
              "Perform Ruku (bowing)",
              "Stand up, then go to Sujud (prostration)",
              "Sit briefly between the two prostrations",
              "Perform second Sujud",
              "Stand up for the second rakat",
            ],
          },
          step3: {
            title: "Second Rakat",
            items: [
              "Recite Surah Al-Fatihah",
              "Recite a Surah (recommended: Surah Al-Ikhlas)",
              "Perform Ruku",
              "Perform the two Sujud",
              "Sit for Tashahhud",
              "Send blessings on the Prophet (Salawat)",
              "Make Salam to conclude",
            ],
          },
          tip: {
            title: "Tip: Recommended Surahs",
            firstRakat: "First Rakat: After Al-Fatihah, recite \"Qul ya ayyuhal-kafirun\" (Surah 109)",
            secondRakat: "Second Rakat: After Al-Fatihah, recite \"Qul Huwa Allahu Ahad\" (Surah 112)",
          },
          cta: "Continue to Dua",
        },
        // Dua Screen
        dua: {
          title: "The Istikhara Dua",
          when: {
            title: "When to Recite",
            body: "After completing the 2 rakats and making Salam, praise Allah, send blessings upon the Prophet ﷺ, then recite this dua.",
          },
          arabicTitle: "The Complete Dua in Arabic",
          transliterationTitle: "Transliteration",
          translationTitle: "Translation",
          translation: {
            p1: "O Allah, I seek Your guidance by virtue of Your knowledge, and I seek ability by virtue of Your power, and I ask You of Your great bounty. For You have power and I have none. And You know and I know not. You are the Knower of hidden things.",
            p2: "O Allah, if You know that this matter [mention your specific matter here] is good for me in my religion, my livelihood, and the outcome of my affairs—both immediate and in the future—then ordain it for me, make it easy for me, and bless it for me.",
            p3: "And if You know that this matter is bad for me in my religion, my livelihood, and the outcome of my affairs—both immediate and in the future—then turn it away from me and turn me away from it, and ordain for me what is good wherever it may be, and make me pleased with it.",
          },
          note: "When you reach \"hadhal-amr\" (this matter), specify your decision clearly. For example: \"If marriage to [name] is good for me...\" or \"If accepting this job is good for me...\"",
          cta: "What Happens Next?",
        },
        // After Screen
        after: {
          title: "After the Prayer",
          trust: {
            title: "Trust in Allah's Wisdom",
            body: "The most important part of Istikhara is accepting Allah's decree with contentment, knowing He has chosen what is best for you.",
          },
          expect: {
            title: "What to Expect",
            body: "Many people mistakenly think istikhara means you'll see a dream or receive a sign. This is NOT required.",
            do1: "Look for ease and facilitation in one direction",
            do2: "Notice which option feels more peaceful",
            do3: "See which path opens up naturally",
            avoid1: "Don't wait for mystical signs or dreams",
            avoid2: "Don't keep repeating if you've already decided",
          },
          action: {
            title: "Take Action",
            body: "After praying istikhara, proceed with what seems best. Trust that Allah will make the good easy and block the harmful.",
            note1: "If things become easy and flow smoothly, that's a positive sign.",
            note2: "If unexpected obstacles arise, consider it Allah protecting you from harm.",
          },
          repeat: {
            title: "How Many Times?",
            body: "You can pray istikhara once or repeat it up to 7 times if you're still uncertain. Some scholars say 3 times, others 7 times.",
            note: "But once you feel inclined toward a decision, trust that feeling and proceed. Don't become paralyzed by indecision.",
          },
          mistakes: {
            title: "Common Mistakes to Avoid",
            1: "Praying istikhara about something haram",
            2: "Expecting dreams or supernatural signs",
            3: "Repeating endlessly without taking action",
            4: "Praying after already making a decision",
            5: "Using it to avoid responsibility for your choice",
          },
          remember: {
            title: "Remember",
            text: "\"And whoever relies upon Allah – then He is sufficient for him. Indeed, Allah will accomplish His purpose.\"",
          },
          cta: "I Understand",
        },
      },
      compatibility: {
        title: "Compatibility",
        description: "Analyze relationship harmony through elemental and numerical balance",
      },
      divineTiming: {
        title: "Divine Timing",
        description: "Spiritual reflection tool for understanding timing and intention",
      },
      prayerTimes: {
        title: "Prayer Times",
        description: "Daily prayer times based on your location",
      },
      quran: {
        title: "Quran",
        description: "Read the complete Quran with translations and bookmarks",
      },
      qibla: {
        title: "Qibla",
        description: "Find the direction to Kaaba for prayer",
      },
      dhikrCounter: {
        title: "Dhikr Counter",
        description: "Digital tasbih for counting dhikr and remembrance",
      },
    },

    // Prayer Times Screen
    prayerTimes: {
      title: "Prayer Times",
      next: "NEXT",
      inTime: "in {{time}}",
      noPrayer: "No prayer",
      calculationMethod: "Calculation Method",
      method: {
        mwl: "Muslim World League",
      },
      timesBasedOnLocation: "Times are calculated based on your current location and timezone.",
      configureAdhan: "Configure Adhan Notifications",
    },

    // Adhan Settings Screen
    adhanSettings: {
      title: "Adhan Settings",
      subtitle: "Configure prayer time notifications",

      enable: {
        title: "Enable Adhan Notifications",
        desc: "Receive notifications at prayer times",
      },

      prayersToNotify: {
        title: "Prayers to Notify",
      },

      sound: {
        title: "Sound Settings",
        playSound: "Play Sound",
        playSoundDesc: "Play adhan audio",
        vibrate: "Vibrate",
        vibrateDesc: "Vibration pattern",
        volume: "Volume: {{value}}%",
      },

      selection: {
        title: "Adhan Selection",
        fajr: "Fajr Adhan",
        otherPrayers: "Other Prayers Adhan",
      },

      adhanOption: {
        default: "Default",
        mishary: "Mishary",
        mecca: "Mecca",
        medina: "Medina",
      },

      reminder: {
        title: "Reminder",
        value: "Remind before prayer: {{minutes}} min",
        zeroHint: "0 = No reminder",
      },

      sendTest: "Send Test Notification",
    },

    // Welcome Section
    welcome: {
      title: "Welcome to Asrār Everyday",
      description: "Explore the rich tradition of ʿIlm al-Ḥurūf (Science of Letters) and ʿIlm al-ʿAdad (Science of Numbers) through an intuitive, educational interface. Enter Arabic text above to discover numerical values, elemental associations, and traditional guidance.",
    },

    // Common UI
    common: {
      calculate: "Calculate",
      clear: "Clear",
      submit: "Submit",
      cancel: "Cancel",
      close: "Close",
      save: "Save",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      unknown: "—",
      name: "Name",
      date: "Date",
      location: "Location",
      enterName: "Enter name",
      selectDate: "Select date",
      results: "Results",
      history: "History",
      favorites: "Favorites",
      compare: "Compare",
      delete: "Delete",
      copy: "Copy",
      copied: "Copied!",
      viewAll: "View All",
      hideAll: "Hide All",
      expand: "Expand",
      collapse: "Collapse",
      next: "Next",
      back: "Back",
      skip: "Skip",
      edit: "Edit",
      upload: "Upload",
      remove: "Remove",
      optional: "Optional",
      share: "Share",
      seeMore: "See More",
      seeLess: "See Less",
      days: "days",
      export: "Export",
      showKeyboard: "Show Keyboard",
      tapForDetails: "Tap for details",
      rules: "Rules",
      seeDetails: "See details →",
      // Elements - shared across features
      elements: {
        air: "Air",
        fire: "Fire",
        water: "Water",
        earth: "Earth",
      },
    },
    
    // Home Screen
    home: {
      daily: {
        summary: "Balanced energies today",
        bestFor: "Routine tasks",
      },
      moment: {
        title: "Moment Alignment",
        addNamePrompt: "Add name to enable",
        details: "DETAILS",
        you: "You",
        now: "Now",
        status: {
          act: "ACT",
          maintain: "MAINTAIN",
          hold: "HOLD",
        },
        hint: {
          act: "Aligned — good to initiate",
          maintain: "Supportive — keep steady",
          hold: "Not aligned — avoid rushing",
        },
        updated: {
          justNow: "Updated just now",
          minute: "Updated 1 minute ago",
          minutes: "Updated {count} minutes ago",
          hour: "Updated 1 hour ago",
          hours: "Updated {count} hours ago",
        },
      },
      cards: {
        dailyGuidance: {
          title: "Daily Guidance",
          window: {
            favorable: "Favorable Window",
            transformative: "Transformative Window",
            delicate: "Delicate Window",
            neutral: "Neutral Window",
          },
          dayRuler: "Day Ruler:",
          energyToday: "Energy Today",
          yourElement: "Your {element}",
          supportiveBalance: "Supportive Balance",
          bestFor: "BEST FOR:",
          tapForDetails: "Tap for details",
          disclaimer: "For reflection only • Not a ruling",
        },
        momentAlignment: {
          title: "Moment Alignment",
          nowLabel: "Now",
          cta: "See details →",
          tapForDetails: "Tap for details",
          summaryTemplate: "{a} and {b} align — {tone}",
          youLabel: "You",
          momentLabel: "Moment",
        },
        nextPlanetaryHour: {
          title: "Next Planetary Hour",
          inTime: "in {duration}",
        },
        planetTransit: {
          title: "Planet Transit",
          nowBadge: "NOW",
          hourPlanetLabel: "Hour Planet",
          rulesLabel: "Rules",
          transitLabel: "Transit",
          seeDetails: "See details →",
        },
        nextDayRuler: {
          title: "Next Day Ruler",
        },
        tomorrow: {
          title: "Tomorrow",
        },
      },
      
      // 🔒 Planetary Coming Soon (frozen for launch)
      planet: {
        comingSoon: {
          title: "Planetary Module",
          message: "This section is being refined and will return in a future update. In the meantime, explore our other spiritual tools.",
          backHome: "Back to Home",
        },
      },
      
      // Planet Detail Screen
      planetDetail: {
        title: "Planet Details",
        error: "Unable to load planet data",
        modeBadge: {
          now: "Now",
          next: "Next",
        },
        sections: {
          snapshot: "Planet Snapshot",
          practical: "Practical Guidance",
          ruhaniFocus: "Spiritual Focus",
          ruhaniFocusDesc: "What this planet traditionally supports",
          cautions: "Spiritual Cautions",
          cautionsDesc: "What to be mindful of",
          timing: "Timing Windows",
          resonance: "Personal Resonance",
          divineNames: "Divine Names",
          spiritual: "Spiritual Layer",
          status: "Planet Status",
        },
        status: {
          seeMore: "See Full Details",
          seeLess: "See Less",
          sign: "Sign",
          motion: "Motion",
          station: "Station",
          nextChange: "Next Change",
          speed: "Speed",
          perDay: "per day",
          aspects: "Major Aspects",
          nextIngressFull: "Next Sign Change",
          noAspects: "No major aspects at this time",
          motionDirect: "Direct",
          motionRetrograde: "Retrograde",
          stationingRx: "Stationing Retrograde",
          stationingDirect: "Stationing Direct",
          days: "days",
          in: "in",
          aspectConjunction: "Conjunction",
          aspectSextile: "Sextile",
          aspectSquare: "Square",
          aspectTrine: "Trine",
          aspectOpposition: "Opposition",
          applying: "applying",
          separating: "separating",
          orb: "orb",
        },
        zodiacSigns: {
          aries: "Aries",
          taurus: "Taurus",
          gemini: "Gemini",
          cancer: "Cancer",
          leo: "Leo",
          virgo: "Virgo",
          libra: "Libra",
          scorpio: "Scorpio",
          sagittarius: "Sagittarius",
          capricorn: "Capricorn",
          aquarius: "Aquarius",
          pisces: "Pisces",
        },
        labels: {
          sign: "Sign",
          element: "Element",
          dayRuler: "Day Ruler",
          hourRuler: "Hour Ruler",
          vibeNow: "Vibe Now",
          bestFor: "Best For",
          avoid: "Avoid",
          actionsNow: "Do This Now",
          resonanceScore: "Resonance",
          whyResonant: "Why",
        },
        timing: {
          generalWindow: "Best General Time",
          afterFajr: "After Fajr prayer",
          sunrise: "At sunrise",
          midday: "Around midday (Dhuhr)",
          afterAsr: "After Asr prayer",
          afterMaghrib: "After Maghrib prayer",
          night: "During the night",
          lastThirdNight: "Last third of the night",
        },
        practice: {
          subtitle: "Traditionally practiced method",
          adab: "Spiritual Etiquette (Adab)",
        },
        divineNames: {
          whyLabel: "Why this name",
        },
        resonance: {
          supportive: "Supportive",
          neutral: "Neutral",
          challenging: "Challenging",
        },
        premium: {
          lockedTitle: "Unlock Divine Name Guidance",
          lockedBody: "Discover personalized Divine Name recommendations with authentic Arabic, meanings, count suggestions, and timing aligned with this planetary moment.",
          upgradeButton: "Upgrade to Premium",
          planetaryDivineResonance: {
            title: "Planetary-Divine Resonance",
            description: "Discover which Divine Names resonate most powerfully during this planetary moment, with personalized count recommendations and sacred timing windows.",
          },
          zikriTiming: {
            title: "Personalized Zikr Timing",
            description: "Know the exact moments when your planetary configuration amplifies specific Divine Names—optimized for your birth chart and current transits.",
          },
          planetaryHourOptimizer: {
            title: "Planetary Hour Optimizer",
            description: "Get intelligent alerts for the most spiritually potent planetary hours aligned with your intentions and the current celestial energies.",
          },
        },
        spiritual: {
          lockedTitle: "Unlock Deeper Alignment",
          lockedBody: "Discover personalized Divine Name resonances, spiritual timing windows, and sacred practice recommendations aligned with this planetary moment.",
          upgradeButton: "Upgrade to Premium",
          divineNames: "Recommended Divine Names",
          bestTimeWindows: "Best Time Windows",
          adabReminder: "Adab Reminder",
        },
        disclaimer: "For reflection only • Not a religious ruling",
        back: "Back",
      },
      
      // Daily Guidance Details Screen
      dailyGuidanceDetails: {
        title: "Daily Guidance",
        sections: {
          dayRuler: "Day Ruler",
          dailyWindow: "Daily Window",
          elementalHarmony: "Elemental Harmony",
          bestFor: "Best For",
          whyThis: "Why This?",
        },
        days: {
          Sunday: "Sunday",
          Monday: "Monday",
          Tuesday: "Tuesday",
          Wednesday: "Wednesday",
          Thursday: "Thursday",
          Friday: "Friday",
          Saturday: "Saturday",
        },
        elements: {
          fire: "Fire",
          water: "Water",
          air: "Air",
          earth: "Earth",
        },
        window: {
          favorable: "Favorable Window",
          neutral: "Neutral Window",
          transformative: "Transformative Window",
          delicate: "Delicate Window",
        },
        windowDescription: {
          favorable: "Today presents favorable conditions for action and growth. The energies align to support your intentions.",
          neutral: "Today offers balanced energies. A steady day for routine activities and gradual progress.",
          transformative: "Today brings transformative potential through contrast. Opportunities arise from adapting to changing energies.",
          delicate: "Today requires gentle navigation. Practice patience and mindful awareness in your actions.",
        },
        dayRulerText: "Today is ruled by {planet}, bringing {element} energy to all activities and intentions.",
        elementText: "{element} Element",
        harmonyYour: "Your {element}",
        harmonyDay: "Day's {element}",
        harmonyLevels: {
          Harmonious: "Harmonious",
          Supportive: "Supportive",
          Challenging: "Challenging",
        },
        whyThisContent: {
          line1: "Today's guidance is calculated from {day}'s planetary ruler ({planet})",
          line2: "The {element} element of {planet} shapes the day's overall energy",
          line3: "Your personal {userElement} element (derived from your name) interacts with the day's energy",
          line4: "This is a reflection tool, not a predictive system — use it to align intentions with natural rhythms",
        },
        disclaimer: "For reflection only • Not a ruling",
      },
      
      // Daily Guidance Messages & Content
      dailyGuidanceContent: {
        generic: {
          fire: {
            message: "{day}'s Fire energy brings vitality and action. A day for initiative and creative expression.",
            bestFor: {
              0: "New beginnings",
              1: "Creative projects",
              2: "Leadership",
              3: "Physical activity",
            },
            avoid: {
              0: "Impulsive decisions",
              1: "Conflict",
              2: "Overexertion",
            },
          },
          water: {
            message: "{day}'s Water energy brings flow and intuition. A day for emotional connection and reflection.",
            bestFor: {
              0: "Emotional healing",
              1: "Intuitive work",
              2: "Relationships",
              3: "Spiritual practices",
            },
            avoid: {
              0: "Major decisions",
              1: "Rigid planning",
              2: "Overanalysis",
            },
          },
          air: {
            message: "{day}'s Air energy brings clarity and communication. A day for learning and intellectual pursuits.",
            bestFor: {
              0: "Study",
              1: "Communication",
              2: "Planning",
              3: "Social connection",
            },
            avoid: {
              0: "Heavy emotions",
              1: "Isolation",
              2: "Rushed decisions",
            },
          },
          earth: {
            message: "{day}'s Earth energy brings grounding and stability. A day for practical work and building foundations.",
            bestFor: {
              0: "Practical tasks",
              1: "Financial planning",
              2: "Health routines",
              3: "Building",
            },
            avoid: {
              0: "Major changes",
              1: "Risk-taking",
              2: "Neglecting basics",
            },
          },
        },
        harmonious: {
          fire: {
            message: "Powerful alignment! Your Fire nature resonates perfectly with {day}'s solar energy. Channel this intensity with clear intention.",
            bestFor: {
              0: "Bold action",
              1: "Leadership",
              2: "Breakthrough",
              3: "Transformation",
            },
            avoid: {
              0: "Burnout",
              1: "Aggression",
              2: "Impatience",
            },
            peakHours: "Morning to Midday",
          },
          water: {
            message: "Deep harmony! Your Water element flows with {day}'s lunar energy. Trust your intuition and emotional wisdom.",
            bestFor: {
              0: "Healing",
              1: "Intuitive work",
              2: "Deep connection",
              3: "Spiritual reflection",
            },
            avoid: {
              0: "Overthinking",
              1: "Isolation",
              2: "Emotional overwhelm",
            },
            peakHours: "Evening to Night",
          },
          air: {
            message: "Clear alignment! Your Air nature dances with {day}'s mercurial energy. Perfect for mental clarity and communication.",
            bestFor: {
              0: "Learning",
              1: "Teaching",
              2: "Writing",
              3: "Strategy",
            },
            avoid: {
              0: "Scattered focus",
              1: "Overcommitment",
              2: "Superficiality",
            },
            peakHours: "Morning to Afternoon",
          },
          earth: {
            message: "Solid foundation! Your Earth element grounds {day}'s stable energy. Build with patience and practical wisdom.",
            bestFor: {
              0: "Building",
              1: "Health routines",
              2: "Financial planning",
              3: "Consistency",
            },
            avoid: {
              0: "Stubbornness",
              1: "Resistance to change",
              2: "Overwork",
            },
            peakHours: "Afternoon to Evening",
          },
        },
        complementary: {
          fireAir: {
            message: "Air fans your Fire! {day}'s energy amplifies your natural vitality. Channel this synergy wisely.",
            bestFor: {
              0: "Creative expression",
              1: "Communication",
              2: "Innovation",
              3: "Social leadership",
            },
            avoid: {
              0: "Scattered energy",
              1: "Overcommitment",
              2: "Impulsiveness",
            },
          },
          airFire: {
            message: "Fire energizes your Air! {day} brings passion to your ideas. Clarity meets action.",
            bestFor: {
              0: "Strategic action",
              1: "Public speaking",
              2: "Problem-solving",
              3: "Teaching",
            },
            avoid: {
              0: "Analysis paralysis",
              1: "Overexcitement",
              2: "Hasty decisions",
            },
          },
          waterEarth: {
            message: "Earth contains your Water! {day} provides structure for your flow. Intuition meets form.",
            bestFor: {
              0: "Grounded healing",
              1: "Practical spirituality",
              2: "Building routines",
              3: "Nurturing",
            },
            avoid: {
              0: "Stagnation",
              1: "Over-caution",
              2: "Suppressing emotions",
            },
          },
          earthWater: {
            message: "Water nourishes your Earth! {day}'s emotional energy softens your grounding. Stability meets flow.",
            bestFor: {
              0: "Gentle progress",
              1: "Emotional work",
              2: "Creativity",
              3: "Compassion",
            },
            avoid: {
              0: "Rigidity",
              1: "Over-planning",
              2: "Neglecting intuition",
            },
          },
          default: {
            message: "Supportive energies today. {day} complements your natural element.",
            bestFor: {
              0: "Balanced action",
              1: "Integration",
              2: "Steady progress",
            },
            avoid: {
              0: "Extremes",
              1: "Forcing outcomes",
            },
          },
        },
        transformative: {
          fireWater: {
            message: "Transformative tension. Your Fire meets {day}'s Water energy. This opposition creates steam - powerful transformation potential.",
            bestFor: {
              0: "Breakthrough",
              1: "Letting go",
              2: "Spiritual cleansing",
              3: "Deep healing",
            },
            avoid: {
              0: "Impulsive reactions",
              1: "Emotional decisions",
              2: "Forcing outcomes",
            },
            peakHours: "Evening (21:00-04:00)",
          },
          waterFire: {
            message: "Dynamic opposition. Your Water meets {day}'s Fire energy. Navigate with awareness - transformation awaits.",
            bestFor: {
              0: "Emotional alchemy",
              1: "Creative breakthrough",
              2: "Shadow work",
              3: "Purification",
            },
            avoid: {
              0: "Reactivity",
              1: "Overwhelm",
              2: "Hasty action",
            },
            peakHours: "Pre-Dawn (04:00-06:00) & Night (21:00-04:00)",
          },
          airEarth: {
            message: "Grounding challenge. Your Air meets {day}'s Earth energy. Slow down and anchor your insights.",
            bestFor: {
              0: "Bringing ideas to form",
              1: "Practical application",
              2: "Discipline",
              3: "Patience",
            },
            avoid: {
              0: "Mental resistance",
              1: "Rushing",
              2: "Avoiding embodiment",
            },
            peakHours: "Afternoon (14:00-18:00)",
          },
          earthAir: {
            message: "Elevating tension. Your Earth meets {day}'s Air energy. Let yourself be lifted into new perspectives.",
            bestFor: {
              0: "New viewpoints",
              1: "Learning",
              2: "Flexibility",
              3: "Mental expansion",
            },
            avoid: {
              0: "Stubbornness",
              1: "Over-attachment",
              2: "Resistance to change",
            },
            peakHours: "Morning (06:00-10:00)",
          },
          default: {
            message: "Transformative day. Navigate opposing energies with awareness and intention.",
            bestFor: {
              0: "Transformation",
              1: "Growth",
              2: "Breakthrough",
            },
            avoid: {
              0: "Reactivity",
              1: "Resistance",
              2: "Forcing",
            },
          },
        },
        neutral: {
          message: "Balanced energies today. {day} offers steady ground for mindful action.",
          bestFor: {
            0: "Routine tasks",
            1: "Consistent effort",
            2: "Observation",
            3: "Balance",
          },
          avoid: {
            0: "Extremes",
            1: "Major changes",
            2: "Overexertion",
          },
        },
      },
      
      sections: {
        momentAlignment: {
          title: "Moment Alignment",
          details: "DETAILS",
          you: "You",
          now: "Now",
          tapForDetails: "Tap for details",
        },
        nextPlanetaryHour: {
          title: "Next Planetary Hour",
          startsAt: "Starts at {time}",
          inTime: "in {duration}",
        },
        tomorrow: {
          title: "Tomorrow",
        },
        spiritualModules: "Spiritual Modules",
      },
      actions: {
        checkInNow: "Check In Now",
        viewInsights: "View Insights",
      },
      showAll: "Show All",
      nextPrayer: "Next Prayer",
      nextPlanetHour: "Next Planet Hour",
      startsAt: "Starts at",
      todayBlessing: "Today's Blessing",
      tomorrow: "Tomorrow",
      tapToSetLocation: "Tap to set location",
    },

    qibla: {
      title: "Qibla",
      locating: "Finding your location...",
      toKaaba: "to Kaaba",
      facing: "Facing",
      qibla: "Qibla",
      howToUse: "How to use",
      instruction1: "Lay your phone flat and away from metal objects.",
      instruction2: "Rotate until the arrow points toward the Kaaba icon.",
      instruction3: "If it seems off, move away from magnets and tap Refresh.",
      refresh: "Refresh",
      yourLocation: "Your Location",
      locationDenied: "Location access is required to calculate the Qibla.",
      locationUnavailable: "Unable to determine your location right now.",
      permissionRequired: "Location Permission Required",
      permissionMessage: "Asrār needs access to your location to calculate the Qibla direction. Please enable location services in your device settings.",
      enableLocation: "Enable Location",
      noCompass: "Compass sensor not available. Showing static Qibla direction only.",
      calibrate: "Move your device in a figure-8 pattern to calibrate the compass.",
      calibrating: "Calibrating compass...",
    },

    quran: {
      title: "Quran",
      subtitle: "The Noble Quran - Complete with translations",
      allSurahs: "All Surahs (114)",
      surah: "Surah",
      ayah: "Ayah",
      ayahs: "Ayahs",
      searchPlaceholder: "Search by name or number...",
      results: "Results",
      continueReading: "Continue Reading",
      lastRead: "Last Read",
      loading: "Loading...",
      loadingSurah: "Loading Surah...",
      errorLoading: "Failed to load Quran. Please check your connection and try again.",
      bookmarks: "Bookmarks",
      noBookmarks: "No Bookmarks Yet",
      noBookmarksDesc: "Long press any ayah to bookmark it for later",
      removeBookmark: "Remove Bookmark",
      removeBookmarkConfirm: "Are you sure you want to remove this bookmark?",
      bookmarkError: "Could not save bookmark. Please try again.",
    },
    
    // Moment Alignment Detail
    momentDetail: {
      title: "Moment Alignment",
      noName: "No Name Set",
      addNameMessage: "Add your name in Name Destiny to unlock moment alignment guidance.",
      goToNameDestiny: "Go to Name Destiny",
      updated: "Updated",
      zahirOutward: "Ẓāhir (Outward)",
      hourQuality: "Hour Quality",
      whyThisStatus: "Why This Status?",
      guidanceTitle: "Guidance",
      bestNow: "Better for:",
      avoidNow: "Avoid for now:",
      disclaimer: "For reflection only • Not a ruling",
      
      // Timeline
      timeline: {
        title: "Next 24 Hours",
        currentWindow: "Current Hour",
        windowEnds: "Hour ends",
        nextOptimal: "Next Optimal Hours",
        showTimeline: "Show Timeline",
        hideTimeline: "Hide Timeline",
        noOptimalWindows: "No optimal hours found in next 24 hours",
        daysAway: "{count} days away",
        tomorrow: "Tomorrow",
        today: "Today",
        in: "in",
        hours: "{count}h",
        minutes: "{count}m",
        planetaryHour: "Planetary Hour",
        hour: "Hour",
      },
      
      equation: {
        zahir: "Ẓāhir",
        hour: "Hour",
      },
      
      zahirShort: {
        fire: "Active, initiating energy",
        earth: "Stable, grounding energy",
        air: "Expressive, clear energy",
        water: "Intuitive, flowing energy",
      },
      
      timeShort: {
        fire: "Dynamic, active quality",
        earth: "Grounded, steady quality",
        air: "Lucid, intellectual quality",
        water: "Receptive, emotional quality",
      },
      
      reasons: {
        act: {
          bullet1: "Your Ẓāhir element perfectly matches the hour's element—natural alignment.",
          bullet2: "This creates flow for initiating, communicating, and deciding.",
          bullet3: "Alignment window lasts for this planetary hour; observe how it shifts.",
        },
        maintain: {
          bullet1: "Your Ẓāhir element is compatible with the hour's element—supportive conditions.",
          bullet2: "Good for steady progress and follow-through without forcing.",
          bullet3: "Maintain calm effort; alignment shifts each hour.",
        },
        hold: {
          bullet1: "Your Ẓāhir element contrasts with the hour's element—suggests gentler pace.",
          bullet2: "Better for observation, patience, and review than major initiatives.",
          bullet3: "Alignment changes hourly; next window may suit your rhythm better.",
        },
      },
      
      guidance: {
        act: {
          best1: "Initiating conversations or decisions",
          best2: "Communicating important messages",
          best3: "Taking action on ideas you've been holding",
          avoid1: "Overthinking simple choices",
          avoid2: "Waiting unnecessarily when flow is present",
        },
        maintain: {
          best1: "Routine tasks and follow-through",
          best2: "Steady effort on ongoing projects",
          best3: "Building momentum calmly",
          avoid1: "Forcing breakthroughs or rushing",
          avoid2: "Starting major new initiatives",
        },
        hold: {
          best1: "Reflection and observation",
          best2: "Planning and reviewing ideas",
          best3: "Patience with timing",
          avoid1: "Rushed decisions or commitments",
          avoid2: "Forcing action when flow is absent",
        },
      },
    },

    // Daily Check-In
    dailyCheckIn: {
      header: {
        title: "Daily Check-In",
        subtitle: "Attune to today's flow",
      },
      disclaimer: "For reflection only • Not a ruling",
      
      // Ritual Flow (V2)
      ritual: {
        subtitle: "Take a breath",
        breathPrompt: "and observe your state",
        step1: {
          title: "Daily Alignment",
          subtitle: "Observe",
        },
        step2: {
          title: "Inner State",
          subtitle: "How are you arriving today?",
        },
        step3: {
          title: "Intention Setting",
          subtitle: "What do you wish to align with?",
        },
        mood: {
          label: "How are you feeling?",
          hint: "There is no right answer",
        },
        energy: {
          label: "Energy level",
        },
        note: {
          label: "Brief reflection (optional)",
          placeholder: "A short note about your day...",
        },
        intention: {
          label: "Today's direction",
          selected: "Today's intention",
        },
        complete: {
          button: "Complete Check-In",
          buttonAction: "Seal My Check-In",
          saving: "Saving...",
          success: "Check-In Saved ✓",
          footer: "For reflection only • Not a ruling",
        },
      },
      notice: {
        alreadyCheckedIn: "You've already checked in today. You can update your reflection below.",
      },
      sections: {
        configuration: {
          title: "Today's Configuration",
        },
        actionWindow: {
          title: "Action Window",
        },
        intention: {
          title: "Focus Intention",
          compatibilityTitle: "Intention Compatibility",
          empty: "Select an intention to see alignment notes.",
        },
        note: {
          title: "What's on your mind? (Optional)",
          placeholder: "A brief note about your day...",
        },
        energy: {
          title: "How's your energy right now?",
          low: "Low",
          high: "High",
          helper: "This helps us learn your peak windows over time.",
        },
      },
      labels: {
        planetaryDay: "Planetary Day",
        cycleTone: "Cycle Tone",
        zahir: "Ẓāhir Alignment",
        batin: "Bāṭin Element",
        harmony: "Harmony",
        hourElement: "Current Hour",
        closesIn: "Closes in",
        nextWindow: "Next window",
      },
      days: {
        sun: { title: "Sunday • Solar current" },
        moon: { title: "Monday • Lunar flow" },
        mars: { title: "Tuesday • Mars initiative" },
        mercury: { title: "Wednesday • Mercury insight" },
        jupiter: { title: "Thursday • Jupiter expansion" },
        venus: { title: "Friday • Venus harmony" },
        saturn: { title: "Saturday • Saturn grounding" },
      },
      elements: {
        zahir: {
          fire: "Fire • Outward initiative",
          water: "Water • Outward intuition",
          air: "Air • Outward expression",
          earth: "Earth • Outward steadiness",
        },
        batin: {
          fire: "Fire • Inner drive",
          water: "Water • Inner depth",
          air: "Air • Inner clarity",
          earth: "Earth • Inner steadiness",
        },
        hour: {
          fire: "Hour carries active fire quality",
          water: "Hour carries receptive water quality",
          air: "Hour carries lucid air quality",
          earth: "Hour carries grounded earth quality",
        },
        zahirMissing: "Add your name to reveal Ẓāhir alignment.",
        batinMissing: "Add your birth date to reveal your Bāṭin element.",
      },
      alignment: {
        labels: {
          perfect: "Perfect alignment",
          strong: "Supportive alignment",
          moderate: "Balanced alignment",
          opposing: "Contrasting alignment",
        },
        descriptions: {
          perfect: "Your inner rhythm fully resonates with the current hour.",
          strong: "Conditions are supportive; stay steady and engaged.",
          moderate: "Balanced flow — proceed with awareness.",
          opposing: "Energy contrasts the hour; move gently and observe.",
        },
      },
      timing: {
        favorable: "Supportive flow",
        neutral: "Balanced flow",
        delicate: "Reflective pace",
      },
      actionWindow: {
        urgency: {
          high: "Focused opportunity — window closing soon",
          medium: "Flowing window — stay attentive",
          low: "Gentle window — pacing is spacious",
        },
      },
      intention: {
        readiness: {
          aligned: "Flowing",
          steady: "Steady",
          reflect: "Reflect first",
        },
        tags: {
          flowing: "Flow is with you",
          steady: "Keep a grounded pace",
          reflect: "Pause and observe",
          hourOpen: "Hour is open",
          hourNext: "Next window noted",
        },
        descriptions: {
          flowing: "Alignment is high — move with confidence and grace.",
          steady: "Momentum is steady — build calmly and stay present.",
          reflect: "The moment invites reflection before action.",
          hourOpen: "The current hour supports mindful engagement.",
          hourNext: "Note the next opening to continue with ease.",
        },
      },
      actions: {
        requestReflection: "Request Reflection",
        saving: "Saving...",
        saveCheckIn: "Save Check-In",
        changeIntention: "Change Intention",
      },
      alerts: {
        savedTitle: "Check-In Saved",
        savedMessage: "Your daily reflection has been recorded. Consistency brings clarity.",
        done: "Done",
        errorTitle: "Error",
        errorMessage: "Failed to save check-in. Please try again.",
      },
    },

    // User Profile
    profile: {
      title: "Your Profile",
      complete: "Profile 100% Complete",
      personalizationLevel: "Personalization Level",
      full: "Full",
      setup: "Profile Setup",
      edit: "Edit Profile",
      view: "View Profile",
      completion: "Profile Completion",
      completeYourProfile: "Complete Your Profile",
      profileIncomplete: "Your profile is incomplete. Complete it to personalize your experience.",
      
      // Personalization levels
      levels: {
        none: "None",
        basic: "Basic",
        enhanced: "Enhanced",
        full: "Full",
      },
      
      // Date of Birth
      dob: {
        title: "Date of Birth",
        subtitle: "Required for Divine Timing personalization",
        selectPlaceholder: "Select your date of birth",
      },
      
      // Astrological Profile
      astro: {
        title: "Your Astrological Profile",
        sign: "Burj (Sign)",
        element: "Element",
      },
      
      // Name Section
      name: {
        title: "Your Name",
        subtitle: "Required for Name Destiny and Compatibility",
        arabic: "Arabic Name",
        arabicPlaceholder: "أدخل اسمك بالعربية",
        latin: "Latin Name (Optional)",
        latinPlaceholder: "Enter your name in Latin",
      },
      
      // Mother's Name
      mother: {
        title: "Mother's Name (Optional)",
        subtitle: "Used for enhanced calculations in some features",
        arabic: "Mother's Arabic Name",
        arabicPlaceholder: "أدخل اسم والدتك بالعربية",
      },
      
      // Location
      location: {
        title: "Location (Optional)",
        subtitle: "For accurate prayer times and advanced astrological calculations",
        label: "Location",
        placeholder: "Enter location or use auto-detect",
        autoDetect: "Tap the location icon to auto-detect",
      },
      
      // Data Privacy
      localOnly: "All data is stored locally on your device. Nothing is sent to external servers in guest mode.",
      
      // Action Buttons
      save: "Save Profile",
      aiSettings: "AI Settings",
      
      // Setup Steps
      steps: {
        basicInfo: "Basic Info",
        birthDate: "Birth Date",
        location: "Location",
        avatar: "Profile Picture",
      },
      
      // Form Fields
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      fullNameHelper: "Used for name calculations and personalized greetings",
      
      dateOfBirth: "Date of Birth",
      dateOfBirthHelper: "Required for accurate destiny calculations",
      
      locationName: "Location",
      locationPlaceholder: "City, Country",
      locationHelper: "Used for planetary hour calculations based on your timezone",
      detectLocation: "Detect My Location",
      detectingLocation: "Detecting location...",
      
      language: "Preferred Language",
      languageHelper: "Choose your preferred language for the app",
      
      timezone: "Timezone",
      timezoneHelper: "Automatically detected from your location",
      
      // Avatar
      profilePicture: "Profile Picture",
      uploadPhoto: "Upload Photo",
      changePhoto: "Change Photo",
      removePhoto: "Remove Photo",
      photoHelper: "JPG, PNG, or WebP (max 2MB)",
      dragDropPhoto: "Drag and drop your photo here, or click to browse",
      photoUploading: "Uploading...",
      photoUploadSuccess: "Photo uploaded successfully!",
      photoUploadError: "Failed to upload photo. Please try again.",
      photoTooLarge: "Photo is too large. Maximum size is 2MB.",
      photoInvalidType: "Invalid file type. Please upload JPG, PNG, or WebP.",
      
      // Messages
      saveSuccess: "Profile saved successfully!",
      saveError: "Failed to save profile. Please try again.",
      setupComplete: "Profile setup complete!",
      setupWelcome: "Welcome! Let's set up your profile to personalize your experience.",
      
      // Completion Status
      percentComplete: "% Complete",
      almostDone: "Almost done!",
      getStarted: "Get started by completing your profile",
      
      // Actions
      completeSetup: "Complete Setup",
      saveChanges: "Save Changes",
      cancelEdit: "Cancel",
      skipForNow: "Skip for now",
      
      // Profile View
      memberSince: "Member since",
      lastSeen: "Last seen",
      noProfileYet: "No profile information yet",
      createProfile: "Create Profile",
      
      // Privacy & Data
      privacyDataTitle: "Privacy & Data",
      exportMyData: "Export My Data",
      signOut: "Sign Out",
      deleteAccount: "Delete Account",
      deleteAllMyData: "Delete All My Data",
      privacyNotice: "All your data is stored locally on this device. We never send your personal information to external servers in guest mode.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      
      // Confirmations
      clearDataTitle: "Clear Profile Data",
      clearDataMessage: "This will delete all your personalization data. This action cannot be undone.",
      signOutTitle: "Sign Out",
      signOutMessage: "Are you sure you want to sign out? Your local data will remain on this device.",
      deleteAccountTitle: "Delete Account",
      deleteAccountMessage: "This will permanently delete your account and all associated data. This action cannot be undone.",
      enterPassword: "Enter your password to confirm",
      deleteSuccess: "Account deleted successfully",
      deleteError: "Failed to delete account",
      exportSuccess: "Profile exported successfully",
      exportError: "Failed to export profile data",
    },
    
    // Authentication
    auth: {
      // Mode Selection
      welcomeTitle: "Welcome to Asrār",
      welcomeSubtitle: "Choose how you'd like to use the app",
      guestMode: "Guest Mode",
      guestModeDescription: "Quick access, data stored locally",
      accountMode: "Account Mode",
      accountModeDescription: "Cloud sync, access from multiple devices",
      continueAsGuest: "Continue as Guest",
      createAccount: "Create Account",
      
      // Sign Up / Sign In
      signUp: "Sign Up",
      signIn: "Sign In",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      emailPlaceholder: "your@email.com",
      passwordPlaceholder: "••••••••",
      
      // Password Strength
      passwordStrength: "Password Strength",
      weak: "Weak",
      medium: "Medium",
      strong: "Strong",
      
      // Actions
      createAccountButton: "Create Account",
      signInButton: "Sign In",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      forgotPassword: "Forgot password?",
      
      // Errors
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      passwordMismatch: "Passwords don't match",
      invalidEmail: "Invalid email address",
      emailInUse: "Email already in use",
      weakPassword: "Password is too weak",
      wrongPassword: "Incorrect password",
      userNotFound: "No account found with this email",
      networkError: "Network error. Please check your connection",
      unknownError: "An error occurred. Please try again",
      
      // Success
      accountCreated: "Account created successfully!",
      signInSuccess: "Signed in successfully!",
    },

    // History & Comparisons
    history: {
      title: "History",
      recentCalculations: "Recent Calculations",
      noCalculationsYet: "No calculations yet",
      clearAll: "Clear All",
      confirmClear: "Clear all history? This cannot be undone.",
      favorites: "Favorites",
      recent: "Recent",
      saved: "saved",
      total: "total",
    },

    // Comparison Modal
    comparison: {
      title: "Compare Two Names",
      firstName: "First Name/Text",
      secondName: "Second Name/Text",
      elementalHarmony: "Elemental Harmony",
      analysis: "Analysis",
      planet: "Planet",
      day: "Day",
      bestHours: "Best Hours",
    },

    // Daily Reflection
    dailyReflection: {
      title: "Daily Spiritual Reflection",
      todaysReflection: "Today's Reflection",
      dailyBadge: "Daily",
      verseOfTheDay: "Verse of the Day",
      divineNameForReflection: "Divine Name for Reflection",
      optimalReflectionTimes: "Optimal reflection times",
      suggestedCounts: "Suggested counts",
      expandReflection: "Expand reflection",
      collapseReflection: "Collapse reflection",
    },

    // Guidance Content
    guidance: {
      relatedQuranicVerses: "Related Quranic Verses",
      divineNames: "Asmā' al-Ḥusnā (Beautiful Names)",
      letterValues: "Letter Values",
      sumAllValues: "Sum All Values",
      calculateDigitalRoot: "Calculate Digital Root",
      elementDiscovery: "Element Discovery",
      discoverSignificance: "Discover the numerological significance of your name through the traditional Islamic sciences",
      howLettersConvert: "How each Arabic letter converts to sacred numbers",
      fourElements: "The four classical elements and your spiritual composition",
      sacredConnections: "Sacred connections and divine resonances in your numbers",
      totalOfAllLetters: "Total of all letter values",
      spiritOfTheCycle: "Spirit of the cycle",
    },

    // Calculator
    calculator: {
      title: "Calculator",
      subtitle: "Islamic Numerology Based on Abjad System",
      calculateLetterValues: "Calculate Letter Values",
      enterYourName: "Enter Your Name",
      namePlaceholder: "محمد",
      calculateButton: "Calculate",
      latinText: "Latin Text (English/French)",
      arabicText: "Arabic Text",
      autoTransliterates: "Auto-transliterates to Arabic • Supports EN/FR names",
      showKeyboard: "Show Keyboard",
      hideKeyboard: "Hide Keyboard",
      examples: "Examples",
      
      // Tabs
      tabs: {
        input: "Input",
        results: "Results",
      },
      
      // Form Section Headers
      form: {
        calculationType: "Calculation Type",
        calculationTypeHelper: "What would you like to calculate?",
        abjadSystem: "Abjad System",
        name: "Name",
        yourName: "Your Name",
        motherName: "Mother's Name",
        phraseOrSentence: "Phrase or Sentence",
        anyText: "Any Text",
        pasteArabicText: "Paste Arabic Text",
      },
      
      // Calculation Types
      types: {
        name: {
          title: "Name",
          subtitle: "Single name analysis",
        },
        lineage: {
          title: "Lineage",
          subtitle: "Name + Mother",
        },
        phrase: {
          title: "Phrase",
          subtitle: "Sentence or text",
        },
        quran: {
          title: "Qur'an",
          subtitle: "Surah + Ayah",
        },
        dhikr: {
          title: "Dhikr",
          subtitle: "Divine Names",
        },
        general: {
          title: "General",
          subtitle: "Raw letters",
        },
      },
      
      // Abjad System Labels
      abjad: {
        maghribi: "Maghribi",
        mashriqi: "Mashriqi",
      },
      
      // Input Fields
      inputs: {
        latinName: "Latin Name (English/French)",
        latinNamePlaceholder: "e.g., Ibrahima, Amadou, Ousmane",
        motherLatinPlaceholder: "e.g., Fatima, Khadija, Aisha",
        arabicName: "Arabic Name",
        arabicNameRequired: "Arabic Name *",
        keyboard: "Keyboard",
        selectSurahAyah: "Select Surah & Ayah",
        selectDivineName: "Select Divine Name",
        orDivider: "— OR —",
      },
      
      // Phrase Options
      options: {
        removeVowels: "Remove vowels/harakat",
        ignorePunctuation: "Ignore punctuation",
        ignoreSpaces: "Ignore spaces",
      },
      
      // Actions
      actions: {
        calculate: "Calculate",
        calculating: "Calculating...",
        close: "Close",
      },
      
      // Results Screen - Phase 1: Tabs, Sections, Core Labels
      results: {
        // Tab Navigation
        tabs: {
          core: "Core",
          insights: "Insights",
          elements: "Elements",
          advanced: "Advanced",
        },
        
        // Section Headers
        sections: {
          coreResults: "Core Results",
          nameInsights: "Name Insights",
          lineageInsights: "Lineage Insights",
          phraseAnalysis: "Phrase Analysis",
          quranResonance: "Qur'an Resonance",
          dhikrPractice: "Dhikr Practice",
          generalInsights: "General Insights",
          elementalAnalysis: "Elemental Analysis",
          advancedMethods: "Advanced Methods",
        },
        
        // Core Result Labels
        core: {
          kabir: "Kabir",
          saghir: "Saghir",
          hadad: "Hadad",
          burj: "Burj",
          grandTotal: "Grand Total",
          digitalRoot: "Digital Root",
          mod4: "Mod 4",
          zodiac: "Zodiac",
        },
        
        // Common Labels
        labels: {
          calculatedFrom: "Calculated from",
          calculation: "Calculation",
          intermediate: "Intermediate",
          value: "Value",
          distance: "Distance",
          letter: "letter",
          letters: "letters",
        },
        
        // Badges
        badges: {
          maghribi: "Maghribi",
          mashriqi: "Mashriqi",
        },
        
        // Type Labels
        types: {
          name: "Name",
          lineage: "Lineage",
          phrase: "Phrase",
          quran: "Qur'an",
          dhikr: "Dhikr",
          general: "General",
        },
        
        // Disclaimer
        disclaimer: "These insights are for spiritual reflection only. Not a substitute for qualified religious guidance.",
        
        // Elements (Ṭabāʾiʿ)
        elements: {
          fire: "Fire",
          water: "Water",
          air: "Air",
          earth: "Earth",
        },
        
        // Modalities
        modalities: {
          cardinal: "Cardinal",
          fixed: "Fixed",
          mutable: "Mutable",
        },
        
        // Zodiac Section Labels
        zodiac: {
          element: "Element",
          modality: "Modality",
          planetaryRuler: "Planetary Ruler",
          temperament: "Temperament",
          spiritualQuality: "Spiritual Quality",
          classicalReference: "Classical Reference",
          calculation: "Calculation",
          burjSign: "Burj (Zodiac Sign)",
          intermediate: "Intermediate",
        },
        
        // Numerical Essence Section Labels
        essence: {
          yourNumericalEssence: "Your Numerical Essence",
          coreNumberMeaning: "Core Number Meaning",
          dominantElement: "Dominant Element",
          spiritualGuidance: "Spiritual Guidance",
        },
        
        // Number Archetypes (1-9)
        archetypes: {
          1: {
            title: "The Leader",
            description: "Leadership, independence, pioneering spirit. The number of divine unity (Tawḥīd).",
            qualities: ["Initiative", "Confidence", "Innovation", "Self-reliance"],
          },
          2: {
            title: "The Harmonizer",
            description: "Balance, partnership, diplomacy. Represents duality seeking unity.",
            qualities: ["Cooperation", "Sensitivity", "Patience", "Mediation"],
          },
          3: {
            title: "The Creator",
            description: "Creativity, expression, joy. Sacred trinity of body, mind, and spirit.",
            qualities: ["Creativity", "Communication", "Optimism", "Self-expression"],
          },
          4: {
            title: "The Builder",
            description: "Stability, foundation, discipline. Four elements, four sacred months.",
            qualities: ["Organization", "Practicality", "Determination", "Trustworthiness"],
          },
          5: {
            title: "The Adventurer",
            description: "Freedom, change, versatility. Five pillars of Islam, five daily prayers.",
            qualities: ["Adaptability", "Curiosity", "Freedom", "Resourcefulness"],
          },
          6: {
            title: "The Nurturer",
            description: "Love, responsibility, harmony. Six days of creation.",
            qualities: ["Compassion", "Service", "Responsibility", "Balance"],
          },
          7: {
            title: "The Seeker",
            description: "Wisdom, spirituality, introspection. Seven heavens, seven earths.",
            qualities: ["Spiritual depth", "Analysis", "Contemplation", "Mysticism"],
          },
          8: {
            title: "The Achiever",
            description: "Power, abundance, manifestation. Eight angels carrying the Throne.",
            qualities: ["Ambition", "Authority", "Material success", "Karma"],
          },
          9: {
            title: "The Humanitarian",
            description: "Completion, universal love, enlightenment. The number of completion and perfection.",
            qualities: ["Compassion", "Service to others", "Wisdom", "Completion"],
          },
        },
        
        // Element Qualities
        elementQualities: {
          fire: {
            quality: "Passionate, energetic, transformative",
            spiritual: "Your soul carries the divine spark of transformation and purification",
          },
          water: {
            quality: "Flowing, adaptive, healing",
            spiritual: "Your essence flows with divine mercy and emotional depth",
          },
          air: {
            quality: "Intellectual, communicative, swift",
            spiritual: "Your spirit moves with divine inspiration and clarity of thought",
          },
          earth: {
            quality: "Grounding, stable, nurturing",
            spiritual: "Your being roots in divine stability and patient perseverance",
          },
        },
        
        // Elemental Composition Section
        elementalComposition: {
          title: "Elemental Composition",
          balanceScore: "Elemental Balance Score",
          balanceStatus: {
            harmonious: "Harmonious",
            moderate: "Moderate",
            seeRecommendations: "See recommendations",
          },
          harmonizingRecommendation: "Harmonizing Recommendation",
          letterCount: "{{count}} letter",
          letterCount_plural: "{{count}} letters",
          recommendations: {
            harmonious: "Your elemental balance is harmonious. Maintain equilibrium through balanced practices.",
            waterWeak: "Your Water element (0%) could use more attention. Try: Cultivate emotional depth, intuition, and flow. Practice dhikr near water or during wuḍū.",
            fireWeak: "Your Fire element (0%) could use more attention. Try: Engage passionate spiritual practices. Dhikr at dawn or sunrise to kindle inner light.",
            airWeak: "Your Air element (0%) could use more attention. Try: Focus on knowledge and communication. Practice dhikr with breath awareness (habs al-nafas).",
            earthWeak: "Your Earth element (0%) could use more attention. Try: Ground yourself through patience and gratitude. Practice dhikr while in sujūd or standing on earth.",
            balanceDominant: "Balance your {{element}} dominance by incorporating practices from other elements.",
          },
        },
        
        // Name Insights Section
        nameInsights: {
          yourSpiritualArchetype: "Your Spiritual Archetype",
          spiritualGuidance: "Spiritual Guidance",
          divineNameResonance: "Divine Name Resonance",
          value: "Value",
          distance: "Distance",
          recommendedDhikrCounts: "Recommended Dhikr Counts",
          bestPracticeTimes: "Best Practice Times",
          bestTimeWindow: "Best Time Window",
          powerDays: "Power Days",
          timingNote: "Power Day = Burj planetary ruler. Best Time Window = Elemental resonance peak.",
          // Best Time Descriptions by Element
          bestTime: {
            fire: "Dawn and sunrise (Fajr time) - when fire energy is strongest",
            water: "Night and before sleep (Isha time) - when water energy flows",
            air: "Morning and afternoon (Dhuhr to Asr) - when air circulates",
            earth: "Maghrib and grounding moments - when earth stabilizes",
          },
        },
        
        // Advanced Methods Section
        advancedMethods: {
          title: "Advanced Calculation Methods",
          subtitle: "Traditional methods from classical ʿIlm al-Ḥurūf for deeper numerical analysis",
          wusta: {
            name: "Wusṭā (Mean)",
            description: "Balance between large and small",
          },
          kamal: {
            name: "Kamāl (Perfection)",
            description: "Essence of numerical completion",
          },
          bast: {
            name: "Basṭ (Expansion)",
            description: "Expansive spiritual potential",
          },
          sirr: {
            name: "Sirr (Hidden)",
            description: "Secret reflection of the value",
          },
        },
        
        // Zodiac Symbols
        zodiacSymbols: {
          ram: "The Ram",
          bull: "The Bull",
          twins: "The Twins",
          crab: "The Crab",
          lion: "The Lion",
          maiden: "The Maiden",
          scales: "The Scales",
          scorpion: "The Scorpion",
          archer: "The Archer",
          goat: "The Goat",
          waterBearer: "The Water-Bearer",
          fish: "The Fish",
        },
        
        // Spiritual Guidance (Element-based)
        elementGuidance: {
          fire: "Your fiery nature brings passion and transformation. Channel this energy through focused spiritual practice and righteous action.",
          water: "Your flowing nature brings depth and intuition. Embrace emotional wisdom and let your heart guide you to divine connection.",
          air: "Your airy nature brings clarity and communication. Seek knowledge and share wisdom with gentle words and pure intention.",
          earth: "Your grounded nature brings stability and patience. Build your spiritual foundation through consistent practice and gratitude.",
        },
        
        // Numerical Essence Guidance Template
        essenceGuidance: {
          template: "Your path combines the essence of {{archetype}} with the power of {{element}}.\n\nEmbrace your natural {{quality}} while balancing it with the {{elementQuality}} nature of your element. Seek harmony between inner contemplation and outward expression.",
        },
        
        // Lineage Result Section
        lineage: {
          // Section Title
          lineageBreakdown: "Lineage Breakdown",
          familyPattern: "Family Pattern",
          keyTakeaways: "Key Takeaways",
          practicePlan: "Practice Plan",
          
          // Breakdown Labels
          labels: {
            yourName: "Your Name",
            motherName: "Mother's Name",
            combined: "Combined",
            plusSign: "+",
            equalsSign: "=",
          },
          
          // Harmony Badges & Descriptions
          pattern: {
            support: {
              badge: "SUPPORT",
              title: "Supportive Harmony",
            },
            neutral: {
              badge: "NEUTRAL",
              title: "Neutral Balance",
            },
            tension: {
              badge: "TENSION",
              title: "Dynamic Tension",
            },
          },
          
          // Element Interaction Descriptions
          interactions: {
            firefire: "Double fire creates powerful transformation energy",
            fireair: "Fire and air amplify each other - inspiration flows",
            firewater: "Fire and water create dynamic tension - balance needed",
            fireearth: "Fire warms earth - grounded passion",
            waterwater: "Double water deepens intuition and emotional wisdom",
            waterair: "Water and air create mist - gentle flow",
            waterearth: "Water nourishes earth - fertile growth",
            airair: "Double air enhances communication and clarity",
            airearth: "Air over earth - ideas meet reality",
            earthearth: "Double earth provides strong foundation and stability",
            balanced: "Balanced elemental interaction",
          },
          
          // Key Takeaways Templates
          takeaways: {
            lineageNumber: "Your lineage number is {{kabir}}, rooted in {{element}} energy",
            elementalRelationship: "Elemental relationship: {{interaction}}",
            spiritualRoot: "Combined spiritual root (Ṣaghīr): {{saghir}}",
          },
          
          // Practice Plan
          practice: {
            doTitle: "Do",
            avoidTitle: "Avoid",
            bestTimeTitle: "Best Time",
            
            // Do List Items
            do: {
              dhikr: "Practice dhikr {{saghir}} or 99 times",
              reflection: "Reflect on family patterns during {{bestTime}}",
              gratitude: "Honor maternal lineage through duʿā and gratitude",
            },
            
            // Avoid List Items
            avoid: {
              neglect: "Neglecting family spiritual connection",
              ignoreWisdom: "Ignoring ancestral wisdom",
            },
          },
          
          // Best Time Descriptions
          bestTime: {
            fire: "Dawn and sunrise (Fajr time) - when fire energy is strongest",
            water: "Night and before sleep (Isha time) - when water energy flows",
            air: "Morning and afternoon (Dhuhr to Asr) - when air circulates",
            earth: "Maghrib and grounding moments - when earth stabilizes",
          },
        },
        
        // Phrase Result Section
        phrase: {
          // Section Titles
          themeDetection: "Theme Detection",
          repeatedLetters: "Repeated Letters",
          structureInsights: "Structure Insights",
          reflectionPrompts: "Reflection Prompts",
          
          // Theme Detection Labels
          theme: {
            dominantElement: "Dominant Element:",
            nearSacredNumber: "Near Sacred Number:",
          },
          
          // Structure Labels
          structure: {
            topRepeated: "Top Repeated:",
            elementLabel: "({{element}} element)",
            centerSignificance: "The center represents the heart of the message",
          },
          
          // Reflection Prompts
          reflection: {
            q1: "What feeling does this phrase evoke in your heart?",
            q2: "How does this phrase connect to your current spiritual journey?",
            q3: "What action or change does this phrase inspire in you?",
          },
        },
        
        // Qur'an Result Section
        quran: {
          // Section Titles
          resonanceTitle: "Quranic Resonance",
          resonanceLink: "Resonance Link",
          reflection: "Reflection",
          ayah: "Ayah",
          
          // Resonance Subtitles
          calculatedFrom: "Calculated from verse Abjad value",
          suggestedAssociation: "Suggested association",
          
          // Resonance Labels
          element: "Element",
          sacredNumber: "Sacred Number",
          verseKabir: "Verse Kabīr",
          
          // Sacred Number Meanings
          sacredMeaning: {
            7: "Seven heavens, seven days of creation",
            12: "Twelve Imams, twelve months",
            19: "Numerical miracle of the Quran",
            70: "Surah Yā-Sīn (يس)",
            99: "Asmā' al-Ḥusnā (Beautiful Names)",
            114: "Surahs in the Quran",
            313: "Companions at Badr",
            786: "Bismillah value (short form)",
            default: "Resonates with divine pattern",
          },
          
          // Calculated Description Templates
          calculatedDistance: "Calculated: Verse Kabīr is {{kabir}}, nearest sacred number is {{nearest}} (distance: {{distance}})",
          perfectMatch: "Perfect match: This verse's Kabīr ({{kabir}}) is a sacred number!",
          
          // Reflection Section
          reflectionPrompt: "Read this ayah slowly, with presence. What word or phrase stands out to you? Write 1-2 words that resonate.",
          reflectionPlaceholder: "Write your reflections here (saved locally)...",
          
          // Actions
          readOnQuranCom: "Read on Quran.com",
          
          // Disclaimer
          disclaimer: "This is numerical analysis only. For tafsīr and religious rulings, consult qualified scholars.",
        },
        
        // Dhikr Result Section
        dhikr: {
          // Calculated From Messages
          calculatedWithoutPrefixes: "Calculated without ال/يا prefixes",
          
          // Section Titles
          divineName: "Divine Name",
          suggestedCounts: "Suggested Dhikr Counts",
          bestTimes: "Best Times to Practice",
          practiceGuidance: "Practice Guidance",
          
          // Match Strength Templates
          match: {
            exact: "Match: exact (Value: {{value}})",
            near: "Match: near (Value: {{value}})",
            distant: "Match: distant (Value: {{value}})",
          },
          
          // Count Labels
          counts: {
            valueBased: "Value-Based:",
            traditionalCounts: "Traditional Counts:",
          },
          
          // Timing Labels
          timing: {
            planetaryDay: "Planetary Day:",
            afterSalah: "After Salah:",
            afterFajr: "After Fajr",
            afterMaghrib: "After Maghrib",
            beforeSleep: "Before sleep",
          },
          
          // Practice Guidance
          guidance: {
            preparation: "Preparation:",
            adab: "Adab (Etiquette):",
            
            // Preparation Steps
            prep: {
              wudu: "Make wuḍū",
              qibla: "Face qibla",
              salawat: "Begin with ṣalawāt on the Prophet ﷺ",
            },
            
            // Adab Steps
            etiquette: {
              presence: "With presence and humility",
              counting: "Count on fingers or tasbīḥ",
              dua: "End with duʿā",
            },
          },
        },
        
        // General Result Section
        general: {
          // Section Titles
          letterFrequency: {
            title: "Letter Frequency",
            value: "value",
          },
          elementalBalance: {
            title: "Elemental Balance",
          },
          sacredResonance: {
            title: "Sacred Resonance",
            nearestLabel: "Nearest Sacred",
            distanceLabel: "Distance",
          },
          advancedMethods: {
            title: "Advanced Methods",
            wusta: {
              label: "Wusṭā (Middle)",
            },
            kamal: {
              label: "Kamāl (Perfection)",
            },
            bast: {
              label: "Basṭ (Expansion)",
            },
          },
        },
      },
      
      // Abjad System Labels (deprecated, kept for backwards compatibility)
      maghribi: "Maghribi",
      mashriqi: "Mashriqi",
      
      // Info Section
      whatYouLearn: "What You're About to Learn",
      discoverSignificance: "Discover the numerological significance of your name through the traditional Islamic sciences",
      numericalValues: "Numerical Values",
      numericalValuesDesc: "How each Arabic letter converts to sacred numbers",
      elementalForces: "Elemental Forces",
      elementalForcesDesc: "The four classical elements and your spiritual composition",
      hiddenPatterns: "Hidden Patterns",
      hiddenPatternsDesc: "Sacred connections and divine resonances in your numbers",
      
      // Key Metrics
      keyMetrics: "Key Metrics",
      totalOfAllLetterValues: "Total of all letter values",
      digitalRoot: "Digital root (1-9)",
      remainderMod4: "Remainder mod 4",
      spiritOfTheCycle: "Spirit of the cycle",
      
      // Step by Step
      stepByStep: "Step-by-Step Calculation",
      reduceToSingleDigit: "Reduce to single digit",
      dominantElement: "Dominant element",
      totalAbjadValue: "Total Abjad Value",

      kabir: {
        title: "Kabīr (الكبير)",
        subtitle: "Grand Total",
        description: "The total energetic signature of your name",
        label: "KABĪR (LARGE)",
      },
      saghir: {
        title: "Ṣaghīr (الصغير)",
        subtitle: "Spiritual Essence",
        description: "The core spiritual quality, reduced to a single digit (1-9)",
        label: "ṢAGHĪR (SMALL)",
      },
      hadath: {
        title: "Ḥadath (الحدث)",
        subtitle: "Element",
        description: "The dominant natural element",
        label: "ḤADATH (CYCLE)",
      },
      ruh: {
        title: "Rūḥ Ḥadad (روح الحدد)",
        subtitle: "Soul Number",
        description: "The bridge between outer appearance and inner essence",
        label: "RŪḤ ḤADAD",
      },
      
      // Mode Switcher
      knowledgeLevel: "Knowledge Level",
      knowledgeLevelHelp: "What's this?",
      knowledgeLevelInfo: "Choose your expertise level:\n\n🔰 Beginner: Learn the basics of Abjad calculations\n🎓 Intermediate: Explore Burj, planets, and divine names\n👑 Scholar: Access advanced research tools",
      beginner: "Beginner",
      intermediate: "Intermediate",
      scholar: "Scholar",
      learnBasics: "Learn basics",
      deeperAnalysis: "Deeper analysis",
      fullResearch: "Full research",
      
      // Burj (Zodiac)
      burjTitle: "Burj (Zodiac Sign)",
      burjSubtitle: "Classical Islamic astronomy",
      calculation: "Calculation",
      element: "Element",
      modality: "Modality",
      planetaryRuler: "Planetary Ruler",
      temperament: "Temperament",
      symbolism: "Symbolism",
      spiritualQuality: "Spiritual Quality",
      classicalReference: "Classical Reference",
      
      // Planetary Signature
      planetarySignature: "Planetary Signature",
      sevenPlanets: "The 7 classical planets",
      planet: "Planet",
      dayOfWeek: "Day of Week",
      hourNumber: "Hour Number",
      metal: "Metal",
      color: "Color",
      dhikrRecommendation: "Dhikr Recommendation",
      divineName: "Divine Name",
      count: "Count",
      timing: "Timing",
    },
    
    // Elemental Composition
    elementalComposition: {
      title: "Elemental Composition",
      letters: "letters",
    },
    
    // Sacred Numbers
    sacredNumbers: {
      title: "Sacred Number Resonance",
      divisibleBy: "Divisible by",
      divinePerfection: "Divine perfection",
      quranicHarmony: "Quranic harmony",
      divineNames: "99 Divine Names",
      nearest: "Nearest",
    },
    
    // Numerical Essence
    numericalEssence: {
      title: "Your Numerical Essence",
      coreNumberMeaning: "Core Number Meaning:",
      theNumber: "The Number",
      dominantElement: "Dominant Element:",
      
      // Number meanings
      number1: "Leadership, independence, pioneering spirit",
      number2: "Partnership, balance, cooperation and harmony",
      number3: "Creativity, expression, joy and communication",
      number4: "Stability, foundation, security and structure",
      number5: "Freedom, adventure, change and adaptability",
      number6: "Service, responsibility, nurturing and love",
      number7: "Wisdom, spirituality, introspection and mystery",
      number8: "Power, abundance, material mastery and success",
      number9: "Completion, universal love, wisdom and compassion",
      
      // Element descriptions
      fireDesc: "Passionate, energetic, transformative, action-oriented",
      waterDesc: "Intuitive, emotional, reflective, flowing and adaptive",
      airDesc: "Communicative, intellectual, social, quick-thinking",
      earthDesc: "Grounded, practical, reliable, solid and steady",
      
      // Guidance message
      guidanceMessage: "These numbers and elements offer guidance for self-reflection. Remember that you are more than numbers×your choices, values, and character shape your destiny.",
    },
    
    // Celestial Signature
    celestialSignature: {
      title: "Celestial Signature",
      planet: "Planet",
      day: "Day",
      bestHours: "Best Hours",
      footerNote: "Based on classical Islamic cosmology following the Four Natures (Ṭabāʾiʿ Arbaʿa) • For spiritual reflection only",
    },
    
    // Disclaimer
    disclaimer: {
      title: "Educational Tool:",
      message: "This app explores the traditional Islamic sciences of ʿIlm al-Ḥurūf and ʿIlm al-ʿAdad for cultural and historical reflection. It is not for fortune-telling, medical advice, or religious rulings. Always consult qualified scholars for religious guidance.",
    },

    // Elements
    elements: {
      fire: "Fire",
      water: "Water",
      air: "Air",
      earth: "Earth",
      fireDesc: "Hot & Dry - Passionate and energetic",
      waterDesc: "Cold & Wet - Emotional and intuitive",
      airDesc: "Hot & Wet - Intellectual and communicative",
      earthDesc: "Cold & Dry - Stable and grounding",
    },

    // Enhanced Temperament Profiles (Psychology + Career)
    temperament: {
      title: "Temperament Profile",
      psychologyTitle: "Psychological Profile",
      careerTitle: "Career Guidance",
      
      traits: "Core Traits",
      strengths: "Strengths",
      watchOuts: "Watch Out For",
      balanceTips: "Balance Tips",
      
      careerGoodFits: "Good Career Fits",
      careerAvoid: "May Find Challenging",
      careerRationale: "Why This Fits",
      
      // Note: Individual temperament data is now in temperamentProfiles.ts
      // This section contains only UI labels
    },

    // Life Path
    lifePath: {
      title: "Life Path Numerology",
      lifePathNumber: "Life Path Number",
      expressionNumber: "Expression Number",
      soulUrge: "Soul Urge Number",
      personality: "Personality Number",
      destiny: "Destiny Number",
      personalYear: "Personal Year",
      personalMonth: "Personal Month",
      karmicDebt: "Karmic Debt Numbers",
      sacredNumbers: "Sacred Numbers",
      cycle: "Life Cycle",
      
      // Core vs External sections
      coreNumbers: "Your Core Life Numbers",
      coreNumbersDesc: "These four numbers reveal your core personality, inner desires, how others see you, and your life's purpose. Calculated from your personal name only.",
      externalInfluences: "External Influences",
      maternalInfluence: "MATERNAL INFLUENCE",
      maternalInfluenceDesc: "This number shows how your mother's energy affects your external path and the conditions that surround you.",
      maternalInfluenceExplanation: "Your mother's name reveals external conditions and inherited influences that surround your path, but do not define your core identity.",

      // Number labels in cards
      lifePathLabel: "LIFE PATH NUMBER",
      expressionLabel: "EXPRESSION NUMBER",
      soulUrgeLabel: "SOUL URGE NUMBER",
      personalityLabel: "PERSONALITY NUMBER",
      destinyLabel: "DESTINY NUMBER",

      // Simple explanations
      lifePathSimple: "Calculated from your birth date. Your soul's blueprint and the main purpose you came here to fulfill.",
      expressionSimple: "Calculated from your name. How you express your life path through your unique talents and personality.",
      soulUrgeSimple: "Your inner motivation. What you're seeking in life and what brings you real joy & satisfaction.",
      personalitySimple: "Your public face. How you appear to others & the energy you give off when you walk into a room.",
      destinySimple: "Your life purpose & ultimate goal. What you're meant to accomplish and give to the world.",

      // Section titles
      whatItMeans: "What it means:",
      important: "Important:",
      externalEnergy: "External Energy",
      importantNote: "This represents what surrounds you, not who you are. Your core numbers above define your true identity.",

      // Quick Guide boxes
      quickGuideTitle: "Quick Guide:",
      lifePathQuick: "Your core talents & natural strengths. The abilities you're born with.",
      soulUrgeQuick: "What truly makes you happy. Your deepest desires & inner fulfillment.",
      personalityQuick: "The impression you give. How people see & experience you at first.",
      destinyQuick: "Your life purpose & what you're meant to achieve. Your ultimate goal.",

      // Cycle Section
      whereYouAreNow: "Where You Are Right Now",
      currentLifePhase: "Current Life Phase",
      phaseOf9: "Phase {number} of 9",
      yearTheme: "Year {position}/9:",
      focusAreas: "Focus Areas:",
      yourAge: "Your Age",
      years: "{age} years",
      yearMonthEnergy: "This Year & Month's Energy",
      personalYearLabel: "Personal Year",
      personalMonthLabel: "Personal Month",
      overallEnergy: "Overall energy",
      monthFlow: "This month's flow",

      // Strengths & Challenges
      strengthsAndGrowth: "Your Strengths & Growth Opportunities",
      strengthsIntro: "Each number from 1-9 represents different life qualities. Your strengths show what you naturally excel at. Growth areas show where you can develop further.",
      whatYouAreStrongAt: "What You're Strong At",
      whereYouCanGrow: "Where You Can Grow",
      strength: "Strength {number}",
      growthArea: "Growth Area {number}",
      strengthDesc1: "What makes you capable and reliable",
      strengthDesc2: "What gives you an edge",
      strengthDesc3: "Your natural talent",
      strengthDesc4: "What you excel at",
      growthDesc1: "A quality to develop",
      growthDesc2: "An area for improvement",
      growthDesc3: "Something to work on",
      growthDesc4: "A key life lesson",
      currentStrength: "Right Now (Your Current Strength):",
      currentStrengthDesc: "This is the main strength supporting you this season",
      currentChallenge: "Currently Working On (Your Main Focus):",
      currentChallengeDesc: "This is what life is teaching you right now×embrace it!",

      // Special Numbers
      specialNumbers: "Special Numbers & Lessons",
      lessonsToLearn: "Lessons to Learn",
      lessonsDesc: "These numbers represent lessons your soul wants to learn in this lifetime. They're not obstacles × they're opportunities for growth.",
      blessedNumbers: "Blessed Numbers",
      blessedDesc: "These are powerful numbers connected to spiritual tradition. They bring special blessings and spiritual protection to your life.",

      // Number Archetypes (1-11, 22)
      numberArchetypes: {
        1: { title: "The Leader", meaning: "You're naturally independent and driven to create new things. You prefer making decisions yourself." },
        2: { title: "The Peacemaker", meaning: "You're great at bringing people together and finding harmony. You're sensitive to others' feelings." },
        3: { title: "The Creator", meaning: "You express yourself easily and bring joy wherever you go. Communication is your strength." },
        4: { title: "The Builder", meaning: "You're reliable and practical. You build solid foundations in everything you do." },
        5: { title: "The Explorer", meaning: "You love freedom and variety. You adapt quickly and learn from diverse experiences." },
        6: { title: "The Caregiver", meaning: "You're responsible and naturally want to help others. Family and service matter deeply to you." },
        7: { title: "The Thinker", meaning: "You're analytical and spiritual. You seek deeper understanding in life's mysteries." },
        8: { title: "The Achiever", meaning: "You're ambitious and focused on success. You have strong business and leadership abilities." },
        9: { title: "The Humanitarian", meaning: "You care about the world and want to make a positive difference. Compassion guides you." },
        11: { title: "The Visionary", meaning: "You see beyond ordinary things. You inspire others and carry spiritual messages." },
        22: { title: "The Master Builder", meaning: "You have big ambitions to create something lasting. You turn dreams into reality on a large scale." },
      },

      descriptions: {
        lifePath: "Your soul's primary journey and purpose",
        soulUrge: "Your heart's deepest desires and inner motivations",
        personality: "How others perceive you; your outer expression",
        destiny: "Your ultimate life mission and divine purpose",
        personalYear: "The main theme and energy of your current year",
        personalMonth: "The monthly energy and focus",
      },

      // Phase 1 Enhancements
      elementalComposition: "Your Elemental Composition",
      elementalCompositionDesc: "Based on your four core numbers, here's the elemental balance in your life path:",
      dominantElement: "Dominant Element",
      elementalBalance: "Elemental Balance",
      
      elementDescriptions: {
        fire: "Fire brings passion, initiative, and drive. You're motivated to take action and lead.",
        earth: "Earth brings stability, practicality, and groundedness. You build lasting foundations.",
        air: "Air brings intellect, communication, and adaptability. You thrive on ideas and connections.",
        water: "Water brings emotion, intuition, and sensitivity. You navigate life through feeling.",
      },

      careerGuidance: "Career Guidance",
      careerGuidanceIntro: "Based on your Life Path Number, here are careers that align with your natural strengths:",
      idealCareers: "Careers That Fit You Well",
      careersToAvoid: "Environments That May Challenge You",
      whyTheseFit: "Why these careers suit you:",
      
      balanceTips: "Balance & Self-Care Tips",
      balanceTipsIntro: "Actionable ways to maintain balance and honor your Life Path energy:",
      
      shadowWork: "Shadow Work & Growth Edges",
      shadowWorkIntro: "Every number has challenges. These aren't flaws—they're opportunities for growth:",
      growthOpportunities: "Areas to Watch & Develop",
      
      practicalGuidance: "Practical Guidance",
      pathSummary: "Your Path in Brief",
      spiritualPractice: "Spiritual Practice",
      quranicConnection: "Quranic Connection",
      weeklyActions: "Weekly Action Steps",
      shadowToAvoid: "Main Pattern to Watch",
      
      // Phase 2 Enhancements
      quranicWisdom: "Quranic Wisdom & Divine Attributes",
      quranicWisdomDesc: "Discover how your Life Path connects to sacred verses and divine names:",
      verse: "Quranic Verse",
      divineAttribute: "Divine Attribute (Asma ul-Husna)",
      spiritualMeaning: "Spiritual Meaning for Your Path",
      dailyPractice: "Daily Spiritual Practice",
    },

    // Compatibility
    compatibility: {
      title: "Relationship Compatibility",
      person1: "Person 1",
      person2: "Person 2",
      checkCompatibility: "Check Compatibility",
      overallScore: "Overall Harmony Score",
      harmonyIndex: "Harmony Index",
      harmonyIndexDesc: "Practical lived compatibility",
      soulConnection: "Soul Connection",
      soulConnectionDesc: "Spiritual destiny resonance",
      independentMetric: "Independent metric — not part of overall score",
      soulConnectionExplanation: "Soul Connection describes the underlying resonance between two names",
      harmonyExplanation: "Harmony describes how daily life tends to flow in practice",
      metricsNote: "A strong Soul Connection can still require effort in Harmony",
      spiritualHarmony: "Spiritual Harmony",
      elementalHarmony: "Elemental Harmony",
      planetaryCompatibility: "Planetary Compatibility",
      
      // Core vs Cosmic sections
      coreCompatibility: "Core Compatibility (Personal Names)",
      coreCompatibilityDesc: "How your conscious personalities interact",
      cosmicLayer: "Cosmic Layer (Maternal Influences)",
      cosmicLayerDesc: "How your inherited energies interact together",
      cosmicLayerExplanation: "Your mother's element represents cosmic conditions affecting your soul connection. This is about inherited emotional patterns, not your core personality.",

      ratings: {
        excellent: "Excellent",
        good: "Good",
        moderate: "Moderate",
        challenging: "Challenging",
      },

      // New Universal Compatibility UI translations
      tabs: {
        calculate: "Calculate",
        results: "Results",
      },
      form: {
        chooseType: "Select Compatibility Type",
        type: {
          personPerson: "Person ↔ Person",
          personPersonDesc: "Universal compatibility for any relationship",
          personDivineName: "Person ↔ Divine Name",
          personDivineNameDesc: "How a Divine Name resonates with you",
          divineIntention: "Divine Name ↔ Intention",
          divineIntentionDesc: "Match Names to your spiritual goals",
        },
        context: {
          title: "Relationship Context",
          universal: "Universal",
          marriage: "Marriage",
          friendship: "Friendship",
          family: "Family",
          work: "Work",
        },
        person1: "Person 1",
        person2: "Person 2",
        displayNameOptional: "Display name (optional)",
        latinName: "Latin name (English/French)",
        arabicName: "Arabic name",
        keyboard: "Keyboard",
        exampleAhmed: "Example: Ahmed",
        exampleFatima: "e.g., Fatima, Ibrahima, Amadou",
        exampleKhadija: "e.g., Fatima, Khadija, Aisha",
        cta: "Calculate Compatibility",
        newCalculation: "New Calculation",
        reflectionOnly: "⚖️ Reflection Only",
        disclaimer: "This analysis is for spiritual reflection within the traditional sciences of ʿIlm al-Asrār. It does not constitute religious rulings, future predictions, or guarantees of outcomes.",
        personInfo: {
          title: "Your Information",
          displayName: {
            label: "Display Name (Optional)",
            placeholder: "e.g., Ahmed",
          },
          latinName: {
            label: "Latin Name (English/French)",
            placeholder: "e.g., Fatima, Ibrahima, Amadou",
          },
          arabicName: {
            label: "Arabic Name *",
            placeholder: "أحمد",
          },
          keyboard: "Keyboard",
        },
        divineName: {
          title: "Select Divine Name",
          placeholder: "Choose a Divine Name",
        },
        cta2: {
          calculateResonance: "Calculate Resonance",
          calculateCompatibility: "Calculate Compatibility",
        },
        disclaimer2: {
          title: "⚖️ Reflection Only",
          body: "This analysis is for spiritual reflection within the traditional sciences of ʿIlm al-Asrār. It does not constitute religious rulings, future predictions, or guarantees of outcomes.",
        },
        errors: {
          arabicNameRequired: "Arabic name is required",
          divineNameRequired: "Please select a Divine Name",
          calculationFailed: "Calculation failed. Please check your inputs.",
          intentionRequired: "Please select an intention",
        },
        divineNameIntention: {
          helper: "Match a Divine Name to your spiritual intention to receive traditional guidance.",
          intentionSection: {
            title: "Your Spiritual Intention",
            placeholder: "Choose Your Intention",
            description: "What spiritual goal are you focusing on?",
          },
          divineNameSection: {
            title: "Divine Name to Evaluate",
            placeholder: "Choose a Divine Name",
            hint: "Select which Divine Name you'd like to align with this intention.",
          },
          intentionPicker: {
            title: "Select Intention",
          },
          divineNamePicker: {
            title: "Select Divine Name",
          },
          cta: "Evaluate Compatibility",
          whyMatters: "Traditional sources guide which Names align with specific intentions.",
          results: {
            title: "Divine Name for Your Intention",
            tabs: {
              alignment: "Alignment",
              alternatives: "Alternatives",
              guidance: "Guidance",
            },
            alignment: {
              optimal: "OPTIMAL",
              suitable: "SUITABLE",
              neutral: "NEUTRAL",
              notRecommended: "NOT RECOMMENDED",
            },
            alignmentSubtext: {
              optimal: "Perfect Match for Your Intention",
              suitable: "Good Choice for Your Intention",
              neutral: "May Work, But Consider Alternatives",
              notRecommended: "Not Recommended for This Intention",
            },
            sections: {
              aboutName: "About This Divine Name",
              traditionalUses: "📖 Traditional Uses",
              spiritualInfluence: "🌟 Spiritual Influence",
              alternatives: "✨ Alternative Divine Names",
              alternativesDesc: "These Names may better support your intention:",
              recommended: "Recommended",
            },
            intentions: {
              clarity: "Clarity",
              patience: "Patience",
              provision: "Provision",
              healing: "Healing",
              protection: "Protection",
              guidance: "Guidance",
              strength: "Strength",
              peace: "Peace",
              knowledge: "Knowledge",
              forgiveness: "Forgiveness",
            },
            speed: {
              fast: "FAST",
              gradual: "GRADUAL",
              subtle: "SUBTLE",
              hidden: "HIDDEN",
            },
            expectation: {
              title: "What to Expect",
            },
            guidance: {
              title: "🧭 Spiritual Guidance",
              howToUse: {
                title: "🙏 How to Engage with This Name",
              },
              steps: {
                step1: {
                  title: "Purify Your Intention",
                  desc: "Begin with sincere intention (niyyah) seeking only Allah's pleasure.",
                },
                step2: {
                  title: "Reflect on the Meaning",
                  desc: "Contemplate how this Name manifests in your life and creation.",
                },
                step3: {
                  title: "Invoke with Reverence",
                  desc: "Call upon Allah using this Name with humility and trust.",
                },
              },
              disclaimer: "This is spiritual guidance only. The Divine Names belong to Allah alone. Results depend on sincerity, patience, and Allah's wisdom.",
            },
            spiritualInfluence: {
              body: "Deepens connection to the divine quality of {{name}}.",
            },
            misaligned: {
              guidance: "According to classical attributions, {{name}} is not traditionally associated with {{intention}}. Consider the suggested Names, which are classically more aligned for this intention.",
            },
            aligned: {
              optimal: "{{name}} is traditionally more aligned for {{intention}} according to classical teachings. This Name resonates well with your intention.",
              suitable: "{{name}} opens adjacent spiritual doors related to {{intention}}. This is a suitable choice for reflection.",
              neutral: "{{name}} has neutral alignment with {{intention}} in classical sources. All Divine Names may be invoked with sincere intention and proper adab.",
            },
            alignmentLevel: {
              optimal: "OPTIMAL",
              suitable: "SUITABLE",
              neutral: "NEUTRAL",
              notRecommended: "NOT RECOMMENDED",
            },
            alternatives: {
              title: "💡 Alternative Divine Names",
              subtitle: "These Names may better support your intention:",
              recommended: "Recommended",
            },
            practice: {
              title: "🙏 How to Engage with This Name",
              step1: {
                title: "Purify Your Intention",
                desc: "Begin with sincere intention (niyyah) seeking only Allah's pleasure.",
              },
              step2: {
                title: "Reflect on the Meaning",
                desc: "Contemplate how this Name manifests in your life and creation.",
              },
              step3: {
                title: "Invoke with Reverence",
                desc: "Call upon Allah using this Name with humility and trust.",
              },
              disclaimer: "This is spiritual guidance only. The Divine Names belong to Allah alone. Results depend on sincerity, patience, and Allah's wisdom.",
            },
          },
        },
      },

      // Tags (for alternative cards)
      tags: {
        strength: "Strength",
        protection: "Protection",
        provision: "Provision",
        guidance: "Guidance",
        clarity: "Clarity",
        patience: "Patience",
        peace: "Peace",
        healing: "Healing",
        knowledge: "Knowledge",
        forgiveness: "Forgiveness",
      },

      // Divine Names (short influence for cards)
      divineNames: {
        arRahman: {
          meaning: "The Most Merciful",
          shortInfluence: "Deepens connection to the divine quality of The Most Merciful",
        },
        arRaheem: {
          meaning: "The Merciful",
          shortInfluence: "Deepens connection to the divine quality of The Merciful",
        },
        arRazzaaq: {
          meaning: "The Sustainer",
          shortInfluence: "Deepens connection to the divine quality of The Sustainer",
        },
        alAzeez: {
          meaning: "The Precious / The Most Mighty",
          shortInfluence: "Deepens connection to the divine quality of The Precious / The Most Mighty",
        },
        alFattaah: {
          meaning: "The Opener",
          shortInfluence: "Deepens connection to the divine quality of The Opener",
        },
        alKhaliq: {
          meaning: "The Creator",
          shortInfluence: "Deepens connection to the divine quality of The Creator",
        },
        asShafi: {
          meaning: "The Healer",
          shortInfluence: "Deepens connection to the divine quality of The Healer",
        },
        alHakim: {
          meaning: "The Wise",
          shortInfluence: "Deepens connection to the divine quality of The Wise",
        },
        alAleem: {
          meaning: "The All-Knowing",
          shortInfluence: "Deepens connection to the divine quality of The All-Knowing",
        },
        asShakur: {
          meaning: "The Appreciative",
          shortInfluence: "Deepens connection to the divine quality of The Appreciative",
        },
        alHafiz: {
          meaning: "The Preserver",
          shortInfluence: "Deepens connection to the divine quality of The Preserver",
        },
        alMuqeet: {
          meaning: "The Sustainer",
          shortInfluence: "Deepens connection to the divine quality of The Sustainer",
        },
        alWahhaab: {
          meaning: "The Bestower",
          shortInfluence: "Deepens connection to the divine quality of The Bestower",
        },
        alHaadi: {
          meaning: "The Guide",
          shortInfluence: "Deepens connection to the divine quality of The Guide",
        },
        asSubbooh: {
          meaning: "The Pure",
          shortInfluence: "Deepens connection to the divine quality of The Pure",
        },
        asSabur: {
          meaning: "The Patient",
          shortInfluence: "Deepens connection to the divine quality of The Patient",
        },
        alMujeeb: {
          meaning: "The Responsive",
          shortInfluence: "Deepens connection to the divine quality of The Responsive",
        },
        alWadud: {
          meaning: "The Loving",
          shortInfluence: "Deepens connection to the divine quality of The Loving",
        },
        alGhaffar: {
          meaning: "The Forgiving",
          shortInfluence: "Deepens connection to the divine quality of The Forgiving",
        },
        alHaafiz: {
          meaning: "The Guardian",
          shortInfluence: "Deepens connection to the divine quality of The Guardian",
        },
      },

      // Person ↔ Divine Name Results
      divineNameResults: {
        title: "Divine Name Resonance",
        subtitle: "Divine Name Resonance Analysis",
        tabs: {
          resonance: "Resonance",
          guidance: "Guidance",
          practice: "Practice",
        },
        resonance: {
          title: "Spiritual Resonance",
          subtitle: "{{person}}'s energy aligns with {{name}}",
          spiritualDestiny: {
            title: "Main Spiritual Tendency",
            modNine: "Mod-9 Remainder:",
          },
          nameAction: {
            title: "How This Name Acts Upon You",
            divineInfluence: "💫 Divine Influence",
          },
          profile: {
            element: "Element",
            planet: "Planet",
          },
        },
        guidance: {
          manifestation: {
            title: "Manifestation Timeline",
            whatToExpect: "⏳ What to Expect",
          },
          spiritualWisdom: {
            title: "Spiritual Wisdom",
          },
        },
        practice: {
          traditionalUses: {
            title: "Traditional Uses",
          },
          spiritualInfluence: {
            title: "🌟 Spiritual Influence",
          },
          disclaimer: "This resonance analysis is for spiritual reflection. The Divine Names belong to Allah alone. Use with reverence and pure intention.",
        },
        effects: {
          strengthens: "STRENGTHENS",
          stabilizes: "STABILIZES",
          tempers: "TEMPERS",
          challenges: "CHALLENGES",
        },
        speed: {
          fast: "FAST",
          delayed: "GRADUAL",
          subtle: "SUBTLE",
        },
        intentions: {
          clarity: "Clarity",
          patience: "Patience",
          provision: "Provision",
          healing: "Healing",
          protection: "Protection",
          guidance: "Guidance",
          strength: "Strength",
          peace: "Peace",
          knowledge: "Knowledge",
          forgiveness: "Forgiveness",
        },
        elements: {
          fire: "FIRE",
          water: "WATER",
          air: "AIR",
          earth: "EARTH",
        },
        planets: {
          Sun: "Sun",
          Moon: "Moon",
          Mercury: "Mercury",
          Venus: "Venus",
          Mars: "Mars",
          Jupiter: "Jupiter",
          Saturn: "Saturn",
        },
        explanations: {
          spiritualMeaning: {
            title: "Spiritual Meaning",
            description: "Dynamic change and strong adaptability. This energy thrives on variety and movement.",
          },
        },
        sacredNumber: "Sacred number: {{value}}",
        nameActions: {
          strengthens: {
            title: "Taqwiyah (Strengthening)",
            description: "This Name reinforces your innate {{element}} temperament, amplifying its natural expression.",
          },
          stabilizes: {
            title: "Muʿāwanah (Supportive)",
            description: "This Name carries and stabilizes your {{element}} nature, providing harmonious support.",
          },
          tempers: {
            title: "Tadbīr bi-l-Ḍidd (Tempering)",
            description: "This Name governs your {{element}} nature through opposition, restraining excess and establishing regulation.",
          },
          challenges: {
            title: "Taṣrīf wa-Taḥwīl (Transformative)",
            description: "This Name transforms your {{element}} disposition, refining it through internal change rather than comfort.",
          },
        },
        manifestationSpeed: {
          fast: {
            fire: "Your temperament allows quicker reception of this Name's apparent effect. Reflection may reveal changes sooner.",
            air: "Your temperament allows quicker reception of this Name's apparent effect. Reflection may reveal changes sooner.",
            water: "Your grounded nature receives this Name's effect more gradually, stabilizing it deeply over time.",
            earth: "Your grounded nature receives this Name's effect more gradually, stabilizing it deeply over time.",
          },
          gradual: {
            earth: "Your earthy reception mirrors the Name's gradual unfolding, building lasting foundations through patient reception.",
            default: "This Name unfolds gradually; your reception deepens through steady spiritual practice over time.",
          },
          subtle: {
            default: "This Name works inwardly. Its effect is subtle, revealed through inner transformation rather than outward signs.",
          },
        },
        elementLabels: {
          fire: "fire",
          water: "water",
          air: "air",
          earth: "earth",
        },
        spiritualWisdomText: "This alignment supports steady progress and smooth cooperation.",
        qualityLabels: {
          excellent: "Excellent",
          "very-good": "Very Good",
          good: "Good",
          moderate: "Moderate",
          challenging: "End of cycle",
        },
        modLabel: "Sacred number: {{value}}",
      },

      // Person-to-Person Results
      results: {
        tabs: {
          overview: "Overview",
          soulConnection: "Soul Connection",
          harmony: "Harmony",
          elemental: "Elemental",
          planetary: "Planetary",
          daily: "Daily",
          advice: "Advice",
        },
        header: {
          compatibilityAnalysis: "{{context}} Compatibility",
        },
        overview: {
          overallCompatibility: "Harmony Index",
          harmonyDesc: "Overall % built from lived dynamics",
          soulConnectionTitle: "Soul Connection",
          soulConnectionSubtitle: "Destiny Mod-9",
          twoMetricsExplanation: "Overall Harmony reflects lived dynamics. Soul Connection reflects underlying destiny resonance. They do not always match — that's normal.",
          tendencyNotCertainty: "Tendency, not certainty",
          modeOfUnion: "🜂 MODE OF UNION",
          unionMode: {
            label: "UNION MODE",
            balance: "Union through balance",
            dynamic: "Dynamic union",
            complementary: "Complementary union",
          },
          summary: "Summary",
          quality: "Quality",
          sacredNumber: "Sacred Number",
          spiritual: "Soul Connection",
          elemental: "Elemental",
          planetary: "Planetary",
          daily: "Daily",
          harmony: "Harmony",
        },
        spiritual: {
          title: "Soul Connection",
          subtitle: "Spiritual destiny resonance",
          badge: "Independent Metric",
          classicalLabel: "Classical Indicator",
          sacredNumberLabel: "Sacred Number",
          numberOutOfNine: "{{value}}/9",
          meaning: "🌿 Meaning",
          watchOut: "⚡ Watch out for",
          keyToSuccess: "🔑 Key to Success",
          howCalculated: "How this number was derived",
          formula: "Formula",
          kabir1: "{{name}} Kabīr",
          kabir2: "{{name}} Kabīr",
          formulaText: "({{kabir1}} + {{kabir2}} + 7) mod 9 = {{result}}",
          zeroTreatedAsNine: "0 is treated as 9",
          contextNote: "In {{context}}",
          contextMarriage: "strengthens loyalty and patience",
          contextFriendship: "strengthens loyalty and mutual aid",
          contextWork: "enhances respect and cooperation",
          contextFamily: "deepens familial bonds",
          // Content keys by score range
          watchOut_high: "When things flow easily, complacency can set in — stay intentional.",
          watchOut_medium: "Under stress or when rushed, patience may fade — slow down.",
          watchOut_low: "Fundamental differences surface often — this requires continuous conscious effort.",
          success_high: "Maintain gratitude and regular heartfelt communication.",
          success_medium: "Talk calmly and regularly, even just 5 minutes a day.",
          success_low: "Accept differences without trying to change each other; find your own rhythm.",
        },
        harmony: {
          title: "Harmony Index",
          subtitle: "Practical compatibility in lived dynamics",
          description: "This reflects how daily life tends to flow based on elemental balance, planetary influences, and day-to-day rhythms.",
          components: "Harmony Components",
        },
        elemental: {
          title: "Elemental Temperament",
          subtitle: "Natural energy balance",
          shortDesc: "Natural energetic balance",
          balanceType: "Balance Type",
          balanceType_high: "Reinforcing",
          balanceType_medium: "Complementary",
          balanceType_low: "Tempering",
          watchOut_fire: "Too much intensity can overwhelm — channel energy into shared goals.",
          watchOut_water: "Emotions may overflow — honor boundaries while staying empathetic.",
          watchOut_air: "Mental stimulation can scatter — ground ideas in action.",
          watchOut_earth: "Routines may become rigid — preserve stability while allowing gentle change.",
          success_fire: "Direct shared passion toward constructive goals; celebrate wins together.",
          success_water: "Create space for emotional expression; listen without trying to fix.",
          success_air: "Balance dialogue with silence; let ideas settle before acting.",
          success_earth: "Build rhythms together; let consistency become your foundation.",
        },
        planetary: {
          title: "Cosmic Harmony",
          subtitle: "Planetary influences",
          shortDesc: "Planetary influences",
          dominantInfluence: "Dominant Influence",
          dominantInfluence_friendly: "Supportive energies",
          dominantInfluence_neutral: "Balanced influences",
          dominantInfluence_opposing: "Tension requires patience",
          watchOut_friendly: "Natural ease may breed assumptions — maintain gratitude and intention.",
          watchOut_neutral: "When one energy dominates, subtle imbalances emerge — honor both equally.",
          watchOut_opposing: "Conflicting impulses arise frequently — notice which serves the moment.",
          success_friendly: "Flow with supportive influences while staying grounded in shared values.",
          success_neutral: "Acknowledge differences without judgment; find complementary rhythms.",
          success_opposing: "When tension rises, pause; let patience reveal the wiser path.",
        },
        daily: {
          title: "Daily Interaction",
          subtitle: "Day-to-day dynamics",
          shortDesc: "Day-to-day rhythm",
          bestRhythm: "Best Rhythm",
          bestRhythm_value: "Calm days benefit this pairing more than rushed cycles",
          watchOut_high: "Routines may become mechanical — infuse intention into ordinary moments.",
          watchOut_low: "Rushed days amplify friction — slow down when imbalance appears.",
          success_high: "Keep small daily rituals that reconnect you (coffee, walks, check-ins).",
          success_low: "Plan important conversations when you're both calm and rested.",
        },
        advice: {
          title: "Spiritual Guidance",
          traditionalNote: "📜 Traditional Note",
        },
        disclaimer: {
          title: "Traditional Note",
          body: "This analysis is indicative. It reflects tendencies, not certainty. Results depend on intention, behavior, and context.",
        },
        microLabels: {
          spiritual: "Alignment, not completion",
          elemental: "Natural ease",
          planetary: "Supportive influences",
          daily: "Day-to-day flow",
        },
        enums: {
          quality: {
            excellent: "Excellent",
            "very-good": "Very Good",
            good: "Good",
            moderate: "Moderate",
            challenging: "Challenging",
          },
          elementalQuality: {
            harmonious: "Harmonious",
            complementary: "Complementary",
            balanced: "Balanced",
            dynamic: "Dynamic",
          },
          interactionType: {
            harmonious: "Harmonious",
            complementary: "Complementary",
            challenging: "Challenging",
            neutral: "Neutral",
          },
          element: {
            fire: "Fire",
            water: "Water",
            air: "Air",
            earth: "Earth",
          },
          relationship: {
            friendly: "Friendly",
            neutral: "Neutral",
            opposing: "Opposing",
          },
          planetaryRelationship: {
            friendly: "Supportive",
            neutral: "Balanced",
            opposing: "Tense",
          },
        },
        tags: {
          active: "Active",
          growing: "Growing",
          dynamic: "Dynamic",
          complementary: "Complementary",
        },
        independentMetric: "Independent metric",
      },
      
      // Soul Connection Archetypes (1-9)
      soul: {
        title: "Soul Connection",
        subtitle: "A traditional soul-resonance marker",
        independentChip: "Independent metric",
        disclaimer: "A reflection tool from traditional teachings — it does not replace faith, free will, or wise counsel.",
        
        blocks: {
          meaning: "Meaning",
          marriageOutlook: "Marriage Outlook",
          watchOut: "Watch Out",
          keyToSuccess: "Key to Success",
        },
        
        howCalculated: {
          title: "How this number is calculated",
          constant: "Constant",
          explanation: "We add the two name values, add 7, then reduce to a number 1–9.",
        },
        
        archetypes: {
          1: {
            title: "The Grounded Path",
            oneLine: "May start easy; later can feel stagnant",
            meaning: "This pattern traditionally shows an easy beginning that may later feel stagnant, especially in growth and provision. Emotional connection can cool over time if not actively tended.",
            marriageOutlook: "Marriage may start smoothly but requires intentional renewal to avoid complacency. Focus on shared goals and gratitude practices.",
            watchOut: "Emotional coldness and taking each other for granted. Growth in provision may slow without conscious effort.",
            keyToSuccess: "Shared spiritual goals, regular renewal practices, gratitude, and acts of charity (sadaqah) together.",
          },
          2: {
            title: "The Harmonious Bond",
            oneLine: "Traditionally good for cooperation",
            meaning: "Traditionally considered favorable for marriage. This pattern supports natural cooperation, companionship, and mutual understanding. Balance flows more easily than opposition.",
            marriageOutlook: "Marriage is traditionally supported. Companionship and teamwork are natural strengths. Guard against dependency.",
            watchOut: "Over-dependency and avoiding difficult conversations. One partner may lean too heavily on the other.",
            keyToSuccess: "Clear communication, shared responsibility, and maintaining individual growth alongside partnership.",
          },
          3: {
            title: "The Friction Path",
            oneLine: "Often difficult; tension and strain",
            meaning: "This pattern is traditionally associated with difficulty. Tension, frequent disagreements, and financial pressure may arise. Requires significant patience and discipline.",
            marriageOutlook: "Marriage may face continuous challenges. Strain in provision and emotional harmony often requires outside support and spiritual discipline.",
            watchOut: "Constant arguments, financial instability, and emotional burnout. This path tests endurance.",
            keyToSuccess: "Patience (sabr), structured routines, spiritual discipline, and wise counsel from trusted elders.",
          },
          4: {
            title: "The Burdened Path",
            oneLine: "Heavy trials; health and strain",
            meaning: "Traditionally seen as a heavy path. Health concerns, emotional strain, and a sense of burden may be present, especially if one partner has unresolved emotional patterns.",
            marriageOutlook: "Marriage may feel like a test. Health (physical or emotional) often becomes a central concern. Requires emotional maturity and calm.",
            watchOut: "Burnout, neglecting physical or mental wellbeing, and resentment building from unspoken burdens.",
            keyToSuccess: "Focus on health (physical and emotional), emotional maturity, calm daily routines, and seeking therapeutic support when needed.",
          },
          5: {
            title: "The Blessed Path",
            oneLine: "Traditionally blessed; harmony and growth",
            meaning: "Traditionally considered very favorable. Associated with blessing, natural harmony, children, and spiritual growth. Balance and abundance may flow more easily.",
            marriageOutlook: "Marriage is traditionally blessed. Harmony, children, and shared spiritual life are often supported. Guard against excess and distraction.",
            watchOut: "Distraction from blessings, excess in comfort, and taking abundance for granted.",
            keyToSuccess: "Gratitude practices, structured spiritual life together, and using blessings to support others.",
          },
          6: {
            title: "The Trial Path",
            oneLine: "Quarrels and ego tests",
            meaning: "This pattern traditionally shows recurring quarrels and discord. Tests of anger, pride, and ego are common. Patterns may repeat until inner work is done.",
            marriageOutlook: "Marriage often involves power struggles and repeated conflicts. Both partners must work on self-awareness and forgiveness.",
            watchOut: "Power struggles, recurring arguments, and cycles of blame. Pride and unresolved anger amplify friction.",
            keyToSuccess: "Conflict resolution skills, self-work (especially anger and ego), forgiveness practices, and regular spiritual remembrance (dhikr).",
          },
          7: {
            title: "The Chosen Path",
            oneLine: "Traditionally best; blessings after obstacles",
            meaning: "Traditionally considered the most favorable for marriage. May face obstacles before union, but strong blessings and alignment often follow. Spiritual harmony is deep.",
            marriageOutlook: "Marriage is traditionally highly blessed. Challenges before union often make the bond stronger. This path carries spiritual favor.",
            watchOut: "Pride in the blessing, external interference before union, and assuming ease means no effort is needed.",
            keyToSuccess: "Humility, trust in divine timing, gratitude, and alignment in spiritual values.",
          },
          8: {
            title: "The Path of Patience",
            oneLine: "Very good long-term; early struggles",
            meaning: "This pattern is traditionally very good for the long term, but early misunderstandings are common. Patience (sabr) transforms this into a strong, enduring bond.",
            marriageOutlook: "Marriage starts with confusion or misjudgment but becomes very strong over time. Patience is the key to unlocking this bond's strength.",
            watchOut: "Judging the relationship too quickly in the beginning. Early friction may cause premature endings.",
            keyToSuccess: "Patience (sabr), emotional intelligence, gentle communication, and giving time for mutual understanding to deepen.",
          },
          9: {
            title: "The Severed Path",
            oneLine: "Traditionally warned against",
            meaning: "Traditionally warned against for binding marriage. Associated with severe hardship, sudden breaks, and recurring harm patterns. Requires extreme caution and guidance.",
            marriageOutlook: "Marriage is traditionally discouraged under this pattern. If already in this bond, increase spiritual protection practices and seek wise counsel.",
            watchOut: "Sudden separations, recurring harm cycles, and patterns that repeat despite efforts. This path requires vigilance.",
            keyToSuccess: "Do not panic if this appears. Seek counsel from trusted spiritual guides. If already bound, increase protection practices (duʿāʾ, charity, guidance). Avoid fatalistic thinking — free will and divine mercy remain.",
          },
          fallback: {
            title: "Soul Connection",
            oneLine: "Spiritual resonance pattern",
            meaning: "This reflects the underlying spiritual resonance between the two names.",
            marriageOutlook: "Every path has its lessons. Approach with wisdom and patience.",
            watchOut: "General caution and awareness in all relationships.",
            keyToSuccess: "Seek wise counsel, maintain spiritual practices, and honor free will.",
          },
        },
        
        tags: {
          grounded: "Grounded",
          stability: "Stability",
          renewal: "Renewal",
          harmony: "Harmony",
          cooperation: "Cooperation",
          companionship: "Companionship",
          friction: "Friction",
          patience: "Patience",
          discipline: "Discipline",
          burden: "Burden",
          health: "Health",
          maturity: "Maturity",
          blessed: "Blessed",
          growth: "Growth",
          gratitude: "Gratitude",
          trial: "Trial",
          forgiveness: "Forgiveness",
          selfWork: "Self-work",
          chosen: "Chosen",
          alignment: "Alignment",
          longTerm: "Long-term",
          wisdom: "Wisdom",
          caution: "Caution",
          guidance: "Guidance",
          protection: "Protection",
          reflection: "Reflection",
        },
        
        // Soul Connection Glimpse (for Overview Card)
        glimpse: {
          fallback: "Spiritual connection pattern",
          universal: {
            1: "Easy start; growth can slow",
            2: "Generally smooth and supportive",
            3: "Friction likely; needs patience",
            4: "Heavy feel; requires care",
            5: "Blessed flow; harmony grows",
            6: "Quarrels possible; set boundaries",
            7: "Best long-term; tested first",
            8: "Deep bond; clarity with time",
            9: "Unstable match; avoid rushing",
          },
          friendship: {
            1: "Starts well; may become distant",
            2: "Good friendship; mutual support",
            3: "Ego clashes; keep it light",
            4: "Can feel heavy; be gentle",
            5: "Warm bond; grows over time",
            6: "Arguments possible; respect limits",
            7: "Loyal bond after early tests",
            8: "Strong link; avoid assumptions",
            9: "On-off dynamic; protect peace",
          },
          family: {
            1: "Closeness early; effort needed",
            2: "Supportive ties; good harmony",
            3: "Sensitive triggers; speak gently",
            4: "Burdened feel; patience required",
            5: "Mercy and ease; bond strengthens",
            6: "Tension cycles; keep respect",
            7: "Respect grows through duty",
            8: "Close bond; heal misunderstandings",
            9: "Distance cycles; keep boundaries",
          },
          work: {
            1: "Good start; progress may stall",
            2: "Works well; reliable teamwork",
            3: "Conflict risk; clarify roles",
            4: "Slow and heavy; needs structure",
            5: "Productive flow; shared wins",
            6: "Disputes possible; set process",
            7: "Strong team once roles clear",
            8: "High potential; align expectations",
            9: "Volatile pairing; firm rules",
          },
        },
        
        // Soul Connection Meanings by Relationship Context
        meanings: {
          // Universal Context (all relationship types)
          universal: {
            1: {
              short: "Stable foundation with renewal needs",
              meaning: "This connection often starts strong and feels steady. Over time, it may require conscious renewal to prevent stagnation. The bond tends to be grounded but can feel routine without active effort.",
              watchOut: "Taking the connection for granted or letting it become purely transactional. Energy may plateau if not refreshed.",
              keyToSuccess: "Regular check-ins, shared goals, and intentional renewal practices. Gratitude and active appreciation keep this bond alive.",
            },
            2: {
              short: "Natural harmony and mutual support",
              meaning: "This pattern supports balance and cooperation. People in this connection often understand each other naturally and work well together. Mutual respect tends to flow easily.",
              watchOut: "Over-reliance on the other person or avoiding necessary conflict. Balance can become dependency if not monitored.",
              keyToSuccess: "Maintain individual strength while cherishing the bond. Healthy boundaries and honest communication sustain this harmony.",
            },
            3: {
              short: "Friction and growth through challenge",
              meaning: "This connection may involve frequent disagreements or tension. It often requires patience and maturity to navigate. The friction can lead to growth if both parties commit to working through it.",
              watchOut: "Constant conflict without resolution, or giving up too quickly. This path tests endurance and emotional regulation.",
              keyToSuccess: "Clear communication, conflict resolution skills, and a commitment to personal growth. Patience (sabr) transforms friction into wisdom.",
            },
            4: {
              short: "Burden and trial, emotional weight",
              meaning: "This pattern can feel heavy. Emotional strain, unspoken burdens, or recurring difficulties may arise. It often requires significant inner work and maturity from both sides.",
              watchOut: "Burnout, resentment, or neglecting self-care. The weight of this connection can drain energy if not managed wisely.",
              keyToSuccess: "Prioritize emotional health, set boundaries, and seek support when needed. Calm routines and therapeutic practices help lighten the load.",
            },
            5: {
              short: "Blessed connection, natural flow",
              meaning: "This pattern is traditionally favorable. Balance, growth, and mutual benefit tend to occur more naturally. The connection often feels supportive and enriching.",
              watchOut: "Taking blessings for granted or becoming distracted by ease. Comfort can lead to complacency.",
              keyToSuccess: "Gratitude practices, using the blessing to support others, and maintaining spiritual discipline together.",
            },
            6: {
              short: "Power struggles and ego tests",
              meaning: "This connection often involves recurring conflicts around pride, control, or differing perspectives. Both parties may struggle with ego and the need to be right.",
              watchOut: "Endless power struggles, blame cycles, and unresolved anger. Pride amplifies friction in this pattern.",
              keyToSuccess: "Self-awareness, forgiveness practices, and letting go of the need to win. Spiritual remembrance (dhikr) softens the ego.",
            },
            7: {
              short: "Deeply blessed, spiritually aligned",
              meaning: "This is traditionally the most favorable pattern. The connection often carries spiritual harmony and mutual benefit. Challenges before the bond may strengthen it once formed.",
              watchOut: "Pride in the blessing or assuming ease means no effort is needed. External interference can disrupt this bond.",
              keyToSuccess: "Humility, gratitude, and aligning on shared values. Protect the connection from negativity and nurture it with care.",
            },
            8: {
              short: "Slow start, strong over time",
              meaning: "This connection may begin with misunderstandings or confusion, but it grows stronger with time. Patience (sabr) reveals the depth and resilience of this bond.",
              watchOut: "Judging the connection too quickly or giving up before it matures. Early friction can mislead.",
              keyToSuccess: "Give it time, practice patience, and communicate gently. Emotional intelligence and understanding deepen this bond.",
            },
            9: {
              short: "Difficult path, requires caution",
              meaning: "This pattern is traditionally associated with recurring hardship and sudden breaks. It requires vigilance, spiritual protection, and wise counsel. Approach with care.",
              watchOut: "Sudden disruptions, recurring harm patterns, and cycles that repeat despite effort. This path requires serious discernment.",
              keyToSuccess: "Seek guidance from trusted advisors, increase spiritual practices (duʿāʾ, charity), and honor your intuition. Free will and divine mercy remain.",
            },
          },
          
          // Friendship Context
          friendship: {
            1: {
              short: "Steady but may grow distant",
              meaning: "This friendship often starts well and feels comfortable. Over time, it may cool or become distant without regular contact and shared activities.",
              watchOut: "Drifting apart due to routine or neglect. The friendship can become surface-level if not actively maintained.",
              keyToSuccess: "Regular quality time, shared interests, and checking in often. Small gestures of care keep this friendship warm.",
            },
            2: {
              short: "Natural companionship and ease",
              meaning: "This friendship flows naturally. Mutual understanding, support, and cooperation are common. You tend to bring out the best in each other.",
              watchOut: "Co-dependency or avoiding difficult conversations. The ease can mask unaddressed issues.",
              keyToSuccess: "Honest communication, mutual respect, and celebrating each other's growth. Balance closeness with healthy independence.",
            },
            3: {
              short: "Frequent disagreements, tension",
              meaning: "This friendship may involve recurring friction or misunderstandings. Patience and maturity are needed to maintain the bond.",
              watchOut: "Constant arguments that go unresolved. The friendship can become draining if conflict is not managed.",
              keyToSuccess: "Clear boundaries, conflict resolution, and mutual commitment to growth. Choose your battles wisely.",
            },
            4: {
              short: "Heavy energy, emotional drain",
              meaning: "This friendship can feel burdensome. One or both may struggle with emotional weight, and the connection may require significant emotional labor.",
              watchOut: "Emotional burnout or one-sided support. The friendship can become exhausting without balance.",
              keyToSuccess: "Set boundaries, practice self-care, and be honest about your limits. Seek balance between giving and receiving.",
            },
            5: {
              short: "Joyful, mutually enriching",
              meaning: "This friendship is traditionally blessed. Laughter, growth, and mutual support tend to flow naturally. You uplift each other.",
              watchOut: "Taking the friendship for granted or only connecting during good times. Ease can lead to shallow engagement.",
              keyToSuccess: "Show gratitude, support each other through challenges, and deepen the bond with shared values and experiences.",
            },
            6: {
              short: "Ego clashes, pride issues",
              meaning: "This friendship often involves power dynamics and ego clashes. Both may struggle with being right or feeling superior.",
              watchOut: "Recurring arguments about control, judgment, or differing opinions. Pride prevents reconciliation.",
              keyToSuccess: "Practice humility, forgive quickly, and let go of needing to be right. Focus on mutual respect.",
            },
            7: {
              short: "Deep bond, loyal and blessed",
              meaning: "This is traditionally the best friendship pattern. Loyalty, trust, and spiritual connection are strong. You may feel like chosen companions.",
              watchOut: "Pride in the friendship or assuming it requires no effort. External jealousy or interference can harm it.",
              keyToSuccess: "Protect the bond, stay humble, and invest in it consistently. Align on shared values and purpose.",
            },
            8: {
              short: "Awkward start, grows with time",
              meaning: "This friendship may begin with misjudgment or distance. Over time, it deepens and becomes very strong. Patience reveals its value.",
              watchOut: "Giving up too soon due to early misunderstandings. The friendship needs time to mature.",
              keyToSuccess: "Be patient, give space for growth, and communicate openly. Trust builds slowly but solidly.",
            },
            9: {
              short: "Fragile, prone to sudden breaks",
              meaning: "This friendship is vulnerable to sudden endings or recurring harm. Caution and spiritual protection are advised.",
              watchOut: "Unexpected betrayals, recurring conflicts, or patterns that don't resolve. The bond may break without warning.",
              keyToSuccess: "Set clear boundaries, trust your intuition, and don't force the connection. Spiritual practices offer protection.",
            },
          },
          
          // Family Context
          family: {
            1: {
              short: "Stable but emotionally distant",
              meaning: "This family bond often feels steady and reliable, but emotional warmth may fade over time without intentional connection.",
              watchOut: "Taking each other for granted or becoming emotionally detached. The relationship can feel transactional.",
              keyToSuccess: "Regular quality time, expressing appreciation, and creating shared rituals. Small acts of love renew the bond.",
            },
            2: {
              short: "Harmonious and supportive",
              meaning: "This family relationship tends to be balanced and cooperative. Mutual respect and natural understanding are common.",
              watchOut: "Avoiding conflict to keep peace, which can lead to unspoken resentment. Balance can become avoidance.",
              keyToSuccess: "Honest communication, celebrating each other, and addressing issues early. Maintain healthy boundaries.",
            },
            3: {
              short: "Tension and recurring conflict",
              meaning: "This family bond may involve frequent disagreements or emotional friction. Patience and maturity are required to sustain it.",
              watchOut: "Unresolved arguments that build resentment. The relationship can become a source of stress.",
              keyToSuccess: "Family therapy, clear communication, and forgiveness practices. Establish routines that promote peace.",
            },
            4: {
              short: "Heavy burdens, emotional strain",
              meaning: "This family relationship can feel burdensome. Emotional or health challenges may be present, requiring significant care and patience.",
              watchOut: "Caregiver burnout or unspoken resentment. The weight can damage both parties if not managed.",
              keyToSuccess: "Seek external support, set boundaries, and prioritize self-care. Share the burden with others when possible.",
            },
            5: {
              short: "Blessed bond, mutual joy",
              meaning: "This family relationship is traditionally favorable. Love, support, and growth tend to flow naturally. You bring out the best in each other.",
              watchOut: "Complacency or taking the blessing for granted. Ease can lead to shallow connection.",
              keyToSuccess: "Express gratitude, deepen the bond through shared values, and support each other through all seasons.",
            },
            6: {
              short: "Power struggles, pride clashes",
              meaning: "This family bond often involves control issues, judgment, or clashing egos. Both may struggle with authority and respect.",
              watchOut: "Endless arguments about being right or controlling each other. Pride prevents healing.",
              keyToSuccess: "Practice forgiveness, respect differences, and focus on love over control. Let go of the need to dominate.",
            },
            7: {
              short: "Deeply connected, spiritually aligned",
              meaning: "This is traditionally the best family pattern. Deep love, loyalty, and spiritual connection are present. The bond feels sacred.",
              watchOut: "Pride in the relationship or assuming it's unbreakable. External interference can still harm it.",
              keyToSuccess: "Protect the bond, stay humble, and nurture it with consistent care and shared spiritual practices.",
            },
            8: {
              short: "Misunderstood at first, strengthens later",
              meaning: "This family relationship may start with distance or misjudgment. Over time, it grows into a strong, enduring bond.",
              watchOut: "Judging too quickly or giving up before the bond matures. Early friction can be misleading.",
              keyToSuccess: "Give it time, practice patience, and communicate with empathy. Deep connection develops gradually.",
            },
            9: {
              short: "Fragile bond, recurring hardship",
              meaning: "This family relationship is vulnerable to sudden breaks or recurring harm. Caution, prayer, and wise counsel are essential.",
              watchOut: "Unexpected separations, harmful patterns, or cycles that don't resolve. The bond may fracture without warning.",
              keyToSuccess: "Set boundaries, increase spiritual protection (duʿāʾ, charity), and seek guidance. Honor your wellbeing.",
            },
          },
          
          // Work Context
          work: {
            1: {
              short: "Productive start, may plateau",
              meaning: "This working relationship often starts well and feels stable. Over time, it may become routine or stagnant without fresh energy.",
              watchOut: "Complacency or lack of innovation. The partnership can become unproductive if not renewed.",
              keyToSuccess: "Set new goals regularly, celebrate wins, and inject fresh ideas. Active collaboration prevents stagnation.",
            },
            2: {
              short: "Natural teamwork and balance",
              meaning: "This work connection supports collaboration and mutual respect. You complement each other's strengths and work well together.",
              watchOut: "Over-reliance on each other or avoiding necessary accountability. Balance can become avoidance of tough decisions.",
              keyToSuccess: "Clear roles, honest feedback, and mutual accountability. Maintain professionalism and celebrate collaboration.",
            },
            3: {
              short: "Friction and disagreements",
              meaning: "This working relationship may involve frequent clashes or differing work styles. Patience and clear communication are needed.",
              watchOut: "Constant conflict that disrupts productivity. The tension can harm both the work and the relationship.",
              keyToSuccess: "Structured communication, defined boundaries, and conflict resolution protocols. Focus on shared goals.",
            },
            4: {
              short: "Heavy workload, stress and strain",
              meaning: "This work connection can feel burdensome. Stress, overwhelm, or unbalanced workloads may be common.",
              watchOut: "Burnout or resentment from unequal contribution. The partnership can become unsustainable.",
              keyToSuccess: "Distribute work fairly, communicate openly about capacity, and prioritize wellbeing. Seek support when needed.",
            },
            5: {
              short: "Productive and mutually beneficial",
              meaning: "This work relationship is traditionally favorable. Collaboration, success, and mutual growth tend to flow naturally.",
              watchOut: "Taking the partnership for granted or becoming complacent. Success can lead to lack of vigilance.",
              keyToSuccess: "Maintain professionalism, acknowledge contributions, and keep innovating. Shared success requires ongoing effort.",
            },
            6: {
              short: "Power struggles, ego conflicts",
              meaning: "This work connection often involves competition, control issues, or clashing work styles. Both may struggle with authority.",
              watchOut: "Unproductive power battles or blame cycles. Pride prevents effective collaboration.",
              keyToSuccess: "Define clear roles, practice humility, and focus on collective goals over individual ego.",
            },
            7: {
              short: "Excellent partnership, aligned vision",
              meaning: "This is traditionally the best work pattern. Shared vision, trust, and productivity are strong. You accomplish great things together.",
              watchOut: "Pride in success or assuming the partnership requires no maintenance. External competition can create friction.",
              keyToSuccess: "Protect the partnership, stay aligned on values, and invest in the relationship. Celebrate wins humbly.",
            },
            8: {
              short: "Slow start, strengthens over time",
              meaning: "This work relationship may begin with misalignment or miscommunication. Over time, it becomes very productive and reliable.",
              watchOut: "Giving up too soon due to early challenges. The partnership needs time to find its rhythm.",
              keyToSuccess: "Be patient, clarify expectations often, and give space for adjustment. Strong partnerships take time.",
            },
            9: {
              short: "Unstable, prone to sudden endings",
              meaning: "This work relationship is vulnerable to abrupt changes, conflicts, or partnership dissolution. Caution is advised.",
              watchOut: "Unexpected betrayals, contract breaks, or recurring issues. The partnership may end without warning.",
              keyToSuccess: "Maintain professional boundaries, document agreements, and trust your instincts. Have backup plans.",
            },
          },
        },
      },

      // Universal Compatibility System (ʿIlm al-Asrār)
      universal: {
        title: "Universal Compatibility",
        subtitle: "Resonance Analysis through ʿIlm al-Asrār",
        selectType: "Select Compatibility Type",
        calculate: "Calculate",
        newCalculation: "New Calculation",
        
        types: {
          personPerson: "Person ↔ Person",
          personPersonDesc: "Universal compatibility for any relationship",
          personDivineName: "Person ↔ Divine Name",
          personDivineNameDesc: "How a Divine Name resonates with you",
          divineIntention: "Divine Name ↔ Intention",
          divineIntentionDesc: "Match Names to your spiritual goals",
        },

        relationshipContext: {
          title: "Relationship Context",
          universal: "Universal",
          marriage: "Marriage",
          friendship: "Friendship",
          family: "Family",
          work: "Work",
        },

        inputs: {
          yourInfo: "Your Information",
          displayName: "Display Name (Optional)",
          arabicName: "Arabic Name",
          arabicNameRequired: "Arabic Name *",
          selectDivineName: "Select Divine Name",
          chooseDivineName: "Choose a Divine Name",
          selectIntention: "Select Intention",
          chooseIntention: "Choose Your Intention",
        },

        intentions: {
          clarity: "Clarity",
          patience: "Patience",
          provision: "Provision",
          healing: "Healing",
          protection: "Protection",
          guidance: "Guidance",
          strength: "Strength",
          peace: "Peace",
          knowledge: "Knowledge",
          forgiveness: "Forgiveness",
        },

        results: {
          resonanceAnalysis: "Resonance Analysis",
          divineNameResonance: "Divine Name Resonance",
          nameIntentionAlignment: "Name-Intention Alignment",
          resonanceScore: "Resonance Score",
          
          elementalRelationship: "Elemental Relationship",
          zahirBatinDynamics: "Zāhir-Bāṭin Dynamics",
          planetaryResonance: "Planetary Resonance",
          modeOfAction: "Mode of Action",
          
          spiritualGuidance: "Spiritual Guidance",
          whatFlowsEasily: "What Flows Easily",
          whatRequiresPatience: "What Requires Patience",
          whatToAvoidForcing: "What to Avoid Forcing",
          
          howNameActs: "How This Name Acts Upon You",
          manifestationGuidance: "Manifestation Guidance",
          speed: "Speed",
          
          alignment: "Alignment",
          recommendedAlternatives: "Recommended Alternatives",
        },

        disclaimer: {
          title: "Reflection Only",
          text: "This analysis is for spiritual reflection within the traditional sciences of ʿIlm al-Asrār. It does not constitute religious rulings, future predictions, or guarantees of outcomes.",
        },

        errors: {
          bothNamesRequired: "Both Arabic names are required",
          arabicNameRequired: "Arabic name is required",
          selectDivineName: "Please select a Divine Name",
          selectIntention: "Please select an intention",
          calculationFailed: "Calculation failed. Please check your inputs.",
        },
      },
    },

    // Name Destiny
    nameDestiny: {
      // Core vs Inherited Analysis Labels
      coreAnalysis: "Core Analysis (Your Name Only)",
      coreAnalysisDesc: "These reflect your inner nature and personal identity.",
      inheritedInfluences: "Inherited Influences",
      inheritedInfluencesDesc: "Shows how your mother's energy influences your external conditions.",
      whyMotherName: "Why add mother's name?",
      motherNameExplanation: "Your personal name reveals WHO you are (inner identity). Your mother's name reveals external conditions that surround you×obstacles, protection, and family inheritance.",
      motherNameInfo: "Personal Name = WHO you are | Name + Mother = WHAT surrounds you",
      
      nameChart: {
        title: "Name Chart",
        subtitle: "Spiritual Blueprint of Your Name",
        total: "Total (Ḥadad Kabīr)",
        saghir: "Digital Root (Ṣaghīr)",
        tabh: "Element (Ṭabʿ)",
        burj: "Zodiac Sign (Burj)",
        planet: "Planet",
        day: "Day",
        hour: "Planetary Hour #",
        hourTip: "Nth hour after local sunrise. Order: Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars.",
        elementHarmony: "Element Harmony",
        harmonious: "✨ Harmonious",
        nourishing: "🌱 Nourishing",
        transformative: "⚡ Transformative",
        unified: "💫 Unified",
      },
      destinyNumber: {
        title: "Your Life Destiny Number",
        subtitle: "Core Destiny Number & Station",
        sumOfLetters: "Sum of all letter values",
        reducedRoot: "Reduced digital root",
      },
      quranicResonance: {
        title: "Qur'anic Resonance",
        subtitle: "Divine Connection Through Your Number",
      },
      motherOrigin: {
        subtitle: "Your inherited energetic foundation",
      },
      inputs: {
        motherName: "Mother's Name",
        motherHint: "Optional × add to see inherited influences and family harmony.",
        motherOptional: "Mother's Name (optional for inherited influences)",
      },
      origin: {
        title: "Your Spiritual Origin",
        motherElement: "Mother's Name Element (Umm Ḥadad)",
        inheritance: "Element Inheritance",
        expression: "Expression",
        foundation: "Foundation",
        yourExpression: "Your Expression",
        yourFoundation: "Your Foundation",
        insight: "Insight",
        kabir: "Kabīr",
        saghir: "Ṣaghīr",
        hadath: "Ḥadath",
      },
      geometry: {
        title: "Letter Geometry (Handasa al-Ḥurūf)",
        vertical: "Vertical (ʿAmūdī)",
        round: "Round (Mudawwar)",
        flat: "Flat (Musaṭṭaḥ)",
        angular: "Angular (Zāwiya)",
        none: "None in your name",
        profile: "Your Geometric Profile",
      },
      triad: {
        title: "Your Soul Triad",
        lifeDestiny: "Life Destiny",
        soulUrge: "Soul Urge",
        outerPersonality: "Outer Personality",
      },
      guidance: {
        title: "Practical Guidance",
        yourPath: "Your Path",
        yourPathDesc: "Explains what your life direction and energy naturally move toward.",
        spiritualPractice: "Spiritual Practice",
        spiritualPracticeDesc: "Simple daily habits or reflections to balance your element.",
        quranicGuidance: "Quranic Guidance",
        quranicGuidanceDesc: "A verse connected to your name's energy, for reflection only.",
        practicalAction: "Practical Action",
        practicalActionDesc: "Steps you can take in everyday life that align with your destiny.",
        shadowToWatch: "Shadow to Watch",
        shadowToWatchDesc: "Tendencies to be aware of that may hinder your growth.",
      },
      disclaimer: {
        reflectionOnly: "For reflection only × not divination or legal ruling.",
      },
      elementChart: {
        title: "Name Element Chart",
        subtitle: "Elemental Composition & Balance",
        dominant: "Dominant Element",
        personality: "Personality Reflection",
        balancingDhikr: "Balancing Dhikr",
        fire: {
          name: "Fire",
          personality: "Your name carries the energy of passion, courage, and bold action. You're naturally driven to lead, initiate, and transform.",
        },
        air: {
          name: "Air",
          personality: "Your name embodies intellectual clarity, communication, and adaptability. You're drawn to thinking, learning, and connecting ideas.",
        },
        water: {
          name: "Water",
          personality: "Your name resonates with emotional depth, empathy, and intuition. You naturally heal, nurture, and flow with life's rhythms.",
        },
        earth: {
          name: "Earth",
          personality: "Your name grounds you in practicality, reliability, and patience. You excel at building, organizing, and bringing stability.",
        },
        dhikr: {
          fire: "Yā Laṭīf (The Gentle) × to soften intensity",
          air: "Yā Ḥakīm (The Wise) × to ground thoughts",
          water: "Yā Nūr (The Light) × to illuminate emotions",
          earth: "Yā Fattāḥ (The Opener) × to invite flow",
        },
      },
      // Higher Resonance Insights
      higherResonance: {
        title: "Higher Resonance Insights",
        subtitle: "Divine Name & Color Energy in Your Name",
      },
      divineNameResonance: {
        title: "Divine Name Resonance",
        subtitle: "Your name carries the vibration of:",
        meaning: "Meaning",
        spiritualInfluence: "Spiritual Influence",
        reflection: "What this means for you",
        reflectionTip: "Reflection Tip",
      },
      colorResonance: {
        title: "Name Color Resonance",
        subtitle: "Your name's natural color energy is:",
        primary: "Primary Color",
        secondary: "Secondary Color",
        meaning: "Meaning",
        bestColors: "Best colors to wear / use",
        avoidColors: "Colors to avoid",
        tip: "Tip",
        tipIntro: "Use these colors for clothing, journaling, meditation, or personal spaces.",
      },
      
      // Mode Selectors
      inputTypeLabel: "Input Type",
      understandingLevelLabel: "Understanding Level",
      
      // Input Types
      inputTypes: {
        namePerson: "Name (Person)",
        nameMotherPair: "Name + Mother",
        divineName: "Divine Name",
        quranVerse: "Quranic Verse",
        sentence: "Sentence/Phrase",
        freeText: "Free Text",
      },
      
      // Understanding Levels
      levels: {
        beginner: "Beginner",
        intermediate: "Intermediate",
        classical: "Classical",
      },
      
      // Results
      results: {
        yourResults: "Your Results",
        newCalculation: "New Calculation",
        keyTakeaways: "Key Takeaways",
        practicalGuidance: "Practical Guidance",
        do: "Do",
        avoid: "Avoid",
        bestTime: "Best Time",
        sacredNumbers: "Sacred Numbers",
        grandTotal: "Grand Total",
        total: "Total",
        essence: "Essence",
        completSum: "Complete sum",
        digitalRoot: "Digital root",
        kabir: "Kabīr",
        saghir: "Ṣaghīr",
        yourPersonalElement: "Your Personal Element (Ṭabʿ)",
        enhancing: "Enhancing...",
        personalizeExplanation: "✨ Personalize Explanation",
        enhancedExplanation: "Enhanced Explanation",
        personalizedInsight: "💫 Personalized Insight",
        divineNameResonance: "Divine Name Resonance",
        divineNameResonanceSubtitle: "The Divine Name resonating with your name",
        elementalComposition: "Elemental Composition",
        elementalCompositionSubtitle: "Based on the letters in your name (outer expression).",
        dominantExpression: "Dominant Expression: ",
        weakElement: "Weak Element: ",
        balancingActions: "Balancing Actions",
        zodiacInfluence: "Zodiac Influence",
        zodiacInfluenceSubtitle: "The Ruling Planet reflects your nature; Active Hour Planet reflects current timing.",
        zodiacInfluenceTooltip: "Power Day is from your Burj's ruling planet. Best Time is an element-based practice window and season.",
        rulingPlanet: "Ruling Planet",
        dayOfPower: "Day of Power (Burj Ruler)",
        activeHourPlanet: "Active Hour Planet",
        burjInsight: "Burj Insight",
        reflectionPrompt: "Which word or phrase stands out most for your current situation?",
        advancedContent: "Advanced Content",
        classicalDetails: "Classical Details",
        classicalDetailsSubtitle: "Traditional Maghribi terminology",
        divisibleBy4: "Divisible by 4?",
        divisibleBy12: "Divisible by 12?",
        yes: "Yes ✓",
        no: "No",
        personKabir: "Person Kabir:",
        motherKabir: "Mother Kabir:",
        deepInterpretation: "Deep Interpretation",
        deepInterpretationSubtitle: "Sirr, Basṭ, Kamāl",
        deepInterpretationText: "This section is reserved for advanced classical interpretation of Sirr (hidden essence), Basṭ (expansion), and Kamāl (perfection). Additional calculations may be added in future updates.",
        maghribiSystem: "Maghribī System",
        goBack: "Go Back",
        noResults: "No results to display",
        disclaimer: "For reflection only • Not divination or legal ruling",
      },
      
      // Personal Element Card
      personalElement: {
        title: "YOUR PERSONAL ELEMENT (TAB)",
        fire: "Fire",
        air: "Air",
        water: "Water",
        earth: "Earth",
        qualities: {
          fire: "Hot & Dry",
          air: "Hot & Moist",
          water: "Cold & Moist",
          earth: "Cold & Dry",
        },
        description: {
          fire: "Passionate, dynamic energy. Transformative power that drives action and illuminates the path forward.",
          air: "Intellectual, communicative essence. Free-flowing wisdom that connects ideas and facilitates understanding.",
          water: "Emotional, intuitive wisdom. Adaptive nature that flows through challenges with grace and depth.",
          earth: "Grounded, stable foundation. Nurturing strength that provides security and steady growth.",
        },
      },
      
      // Divine Name Resonance Card
      divineResonance: {
        title: "Divine Name Resonance",
        abjadNote: "This Name resonates with your name through the 28-letter Abjad cycle.",
        howDerived: "How it was derived",
        abjadTotalLabel: "Abjad Total (your name)",
        resonanceIndexLabel: "Resonance Index (1–28)",
        resonantLetterLabel: "Resonant Letter",
        letterBreakdownTitle: "Letter-by-letter breakdown",
        dhikrTitle: "Dhikr (Optional)",
        suggestedCount: "Suggested count:",
        dhikrDescription: "This Divine Name may be used in dhikr (remembrance of Allah), seeking closeness, forgiveness, or help according to one's intention (niyyah).",
      },
      
      // Form UI
      form: {
        title: "Name Destiny",
        heroTitle: "Name Destiny Calculator",
        heroSubtitle: "Discover the spiritual blueprint encoded in your name through sacred Abjad numerology",
        enterNames: "Enter Names",
        bothArabic: "Both names must be in Arabic script",
        yourName: "Your Name",
        mothersName: "Mother's Name",
        latinNameLabel: "Latin Name (English/French)",
        latinPlaceholderPerson: "e.g., Ibrahima, Amadou, Ousmane",
        latinPlaceholderMother: "e.g., Fatima, Khadija, Aisha",
        arabicNameLabel: "Arabic Name *",
        arabicPlaceholderPerson: "محمد",
        arabicPlaceholderMother: "فاطمة",
        keyboardButton: "Keyboard",
        validationError: "Please enter a valid Arabic name",
        calculateButton: "✨ Calculate Destiny",
        calculating: "Calculating...",
        incompleteForm: "Incomplete Form",
        incompleteMassage: "Please enter both names to continue.",
        calculationError: "Calculation Error",
        calculationErrorMessage: "Something went wrong while generating the destiny insights.",
        educationTitle: "What is Name Destiny?",
        educationContent: "Name Destiny (Qadr al-Asmāʾ) reveals the spiritual blueprint encoded within your name and your mother's name. Using Abjad numerology, we uncover the sacred numbers, elemental balance, and celestial influences guiding your life path.",
        discoveryTitle: "What You'll Discover",
        discoveryItems: {
          numbers: { icon: "🔢", title: "Sacred Numbers", desc: "Kabir (grand total) and Saghir (essence)" },
          element: { icon: "💧", title: "Element", desc: "Your Tab element—Water, Fire, Earth, or Air" },
          zodiac: { icon: "⭐", title: "Zodiac", desc: "Your Burj (constellation) and ruling planet" },
          guidance: { icon: "🌙", title: "Guidance", desc: "Spiritual insights for your journey" },
        },
        examplesTitle: "Example Names",
        examplesContent: "All entries should be in Arabic script for accurate calculation:",
        privacyTitle: "Your Privacy",
        privacyContent: "🔒 Calculations happen entirely on your device. Your names are never stored, synced, or shared—preserving the privacy of your sacred journey.",
        footer: "For reflection only • Not divination or legal ruling",
      },
    },

    // Planetary Hours
    planetaryHours: {
      title: "Planetary Hours",
      currentHour: "Current Planetary Hour",
      planet: "Planet",
      startTime: "Start Time",
      endTime: "End Time",
      dayHours: "Day Hours",
      nightHours: "Night Hours",

      planets: {
        sun: "Sun",
        moon: "Moon",
        mars: "Mars",
        mercury: "Mercury",
        jupiter: "Jupiter",
        venus: "Venus",
        saturn: "Saturn",
      },
    },

    // Planet names
    planets: {
      sun: "Sun",
      moon: "Moon",
      mars: "Mars",
      mercury: "Mercury",
      jupiter: "Jupiter",
      venus: "Venus",
      saturn: "Saturn",
    },

    // Zodiac signs
    zodiac: {
      aries: "Aries",
      taurus: "Taurus",
      gemini: "Gemini",
      cancer: "Cancer",
      leo: "Leo",
      virgo: "Virgo",
      libra: "Libra",
      scorpio: "Scorpio",
      sagittarius: "Sagittarius",
      capricorn: "Capricorn",
      aquarius: "Aquarius",
      pisces: "Pisces",
    },

    // Aspects
    aspects: {
      conjunction: "Conjunction",
      sextile: "Sextile",
      square: "Square",
      trine: "Trine",
      opposition: "Opposition",
      applying: "applying",
      separating: "separating",
      orb: "orb",
    },

    // UI Labels
    ui: {
      bestTime: "Best Time",
      avoid: "Avoid",
      recommended: "Recommended",
      unlockPremium: "Unlock Premium",
      addNameToActivate: "Add your name to activate",
      forReflectionOnly: "For reflection only • Not a religious ruling",
      seeFullDetails: "See Full Details",
      seeLess: "See Less",
      upgradeNow: "Upgrade Now",
      learnMore: "Learn More",
    },

    // Day names
    days: {
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
    },

    // Divine Names (28 names for resonance calculation)
    divineNames: {
      allah: { meaning: "The God, The One True God" },
      alBaqi: { meaning: "The Everlasting, The Eternal" },
      alJami: { meaning: "The Gatherer, The Uniter" },
      adDaim: { meaning: "The Eternal, The Everlasting" },
      alHadi: { meaning: "The Guide, The One Who Guides" },
      alWadud: { meaning: "The Loving, The Most Affectionate" },
      azZaki: { meaning: "The Pure, The Immaculate" },
      alHakim: { meaning: "The Wise, The All-Wise" },
      atTahir: { meaning: "The Purifier, The Pure One" },
      alYaqin: { meaning: "The Certain, The Certainty" },
      alKarim: { meaning: "The Generous, The Most Bountiful" },
      alLatif: { meaning: "The Subtle, The Most Kind" },
      alMumin: { meaning: "The Believer, The Giver of Faith" },
      anNur: { meaning: "The Light, The Illuminator" },
      asSalam: { meaning: "The Peace, The Source of Peace" },
      alAlim: { meaning: "The All-Knowing, The Omniscient" },
      alFard: { meaning: "The Unique, The One and Only" },
      asSabur: { meaning: "The Patient, The Most Forbearing" },
      alQadir: { meaning: "The Able, The All-Powerful" },
      arRahman: { meaning: "The Most Merciful, The Beneficent" },
      ashShakur: { meaning: "The Grateful, The Appreciative" },
      atTawwab: { meaning: "The Acceptor of Repentance" },
      athThabit: { meaning: "The Firm, The Steadfast" },
      alKhabir: { meaning: "The Aware, The All-Informed" },
      dhulJalal: { meaning: "The Lord of Majesty and Bounty" },
      adDarr: { meaning: "The Distresser, The Corrector" },
      azZahir: { meaning: "The Manifest, The Evident" },
      alGhani: { meaning: "The Rich, The Self-Sufficient" },
    },

    // Spiritual Stations
    stations: {
      1: "Badʾ (البدء) - Beginning",
      2: "Tawāfuq (التوافق) - Harmony",
      3: "Ibdāʿ (الإبداع) - Creativity",
      4: "Istiqrār (الاستقرار) - Stability",
      5: "Taḥawwul (التحول) - Transformation",
      6: "Khidma (الخدمة) - Service",
      7: "Ḥikma (الحكمة) - Divine Wisdom",
      8: "Qudra (القدرة) - Divine Power",
      9: "Kamāl (الكمال) - Completion",
      11: "Spiritual Illumination",
      22: "Master Builder",
      33: "Master Teacher",
    },

    // Ilm Huruf Panel
    ilmHuruf: {
      // Title and subtitle
      title: "ʿIlm al-Ḥurūf - Practical Life Guidance",
      subtitle: "Choose a guidance mode and discover insights tailored to your inquiry",
      
      // Mode Buttons
      weeklyGuidance: "Weekly Guidance",
      nameDestiny: "Name Destiny",
      compatibility: "Compatibility",
      lifePath: "Life Path",
      divineTiming: "Divine Timing",
      
      // Titles
      generateWeeklyGuidance: "Generate Your Weekly Guidance",
      discoverNameDestiny: "Discover Your Name Destiny",
      analyzeTwoSouls: "Analyze Two Souls",
      calculateLifePath: "Calculate Your Life Path",
      currentPlanetaryInfluence: "Current Planetary Influence",
      
      // Descriptions
      weeklyGuidanceDesc: "Reflective guidance mapped to planetary influences",
      nameDestinyDesc: "Discover the spiritual essence encoded in your name",
      compatibilityDesc: "Explore the harmony and potential between two individuals",
      lifePathDesc: "Understand the numerological significance of your birth path",
      divineTimingDesc: "Align your actions with celestial timings",
      
      // Labels
      nameLatin: "Name - Latin (English/French)",
      nameArabic: "Name - Arabic",
      yourNameLatin: "Your Name - Latin (English/French)",
      yourNameArabic: "Your Name - Arabic",
      firstPersonLatin: "First Person - Latin (English/French)",
      firstPersonArabic: "First Person - Arabic",
      secondPersonLatin: "Second Person - Latin (English/French)",
      secondPersonArabic: "Second Person - Arabic",
      motherNameLatin: "Mother's Name - Latin (optional)",
      motherNameArabic: "Mother's Name - Arabic (optional)",
      birthDate: "Birth Date",
      birthDateOptional: "Birth Date (Optional - for anchor date)",
      birthDateUsage: "Used to calculate your personal cycles. Defaults to today if not provided.",
      location: "Location (optional)",
      optional: "Optional",
      optionalForRestSignal: "Optional - for Rest Signal",
      restSignalNote: "Enables personalized Rest Signal detection",
      
      // Mother's Name specific
      addMotherName: "Add Mother's Name (optional)",
      motherNameOptional: "Mother's Name (optional)",
      motherNameRequired: "Mother's Name (Required)",
      motherNameRequiredExplanation: "Life Path is personal to YOU. Your mother's name ensures this reading reflects your unique journey, not just a general pattern for everyone with your name.",
      timingRequiredExplanation: "Divine Timing is calculated for YOUR specific planetary influences. Your mother's name personalizes these calculations to your unique spiritual blueprint.",
      clearMotherName: "Clear",
      latinAutoTransliterates: "Latin (English/French) - Auto-transliterates",
      arabicDirectInput: "Arabic - Direct input",
      whyMotherRequired: "Why is mother's name required?",
      
      // Placeholders
      namePlaceholderEn: "e.g., Fatima, Ibrahima, Amadou",
      motherNamePlaceholderEn: "e.g., Fatima, Khadija, Aisha",
      namePlaceholderAr: "محمد",
      motherNamePlaceholderAr: "فاطمة",
      
      // Name autocomplete
      nameLatinLabel: "Name (Latin script)",
      nameHelperText: "Type your name in Latin letters - we'll show the Arabic equivalent",
      nameHelperTextSuggestions: "Start typing to see Arabic suggestions",
      selectArabicName: "Select Arabic name",
      noMatchesFound: "No matches found",
      typeToSearch: "Type to search names...",
      
      // Autofill toggle
      autofillToggle: {
        label: "Use my profile information",
        description: "Toggle off to calculate for family or friends"
      },
      
      // Messages
      autoTransliterate: "Auto-transliterates to Arabic • Supports EN/FR names",
      confidence: "Confidence",
      showKeyboard: "Show Keyboard",
      hideKeyboard: "Hide Keyboard",
      noneInYourName: "None in your name",
      
      // Buttons
      analyzeButton: "Analyze",
      analysisError: "Analysis Error",
      
      // Weekly Results
      yourSpiritualProfile: "Your Spiritual Profile",
      ruh: "Rūḥ",
      element: "Element",
      currentHarmony: "Current Harmony",
      allForcesAligned: "All forces aligned×excellent flow",
      mixedSignals: "Mixed signals×proceed mindfully",
      challengingEnergies: "Challenging energies×patience needed",
      dominantForce: "Dominant Force",
      weekAtAGlance: "Week at a Glance",
      peakDayThisWeek: "Peak Day This Week",
      bestForInitiatives: "Best for important initiatives",
      focusDay: "Focus Day",
      forDeepWorkAndPlanning: "For deep work & planning",
      harmony: "Harmony",
      planet: "Planet",
      energyReturnSpeedsThisWeek: "Energy Return Speeds This Week",
      whenActionsManifestResults: "When actions manifest their results (classical concept: Irtiṭāb)",
      sameDay: "Same day",
      fewHours: "Few hours",
      twoDays: "2-3 days",
      oneToTwoWeeks: "1-2 weeks",
      deepRestNeeded: "Deep Rest Needed",
      restSignal: "Rest Signal (Infisāl)",
      criticalLowEnergy: "Critical low energy - honor this healing signal from your body and spirit.",
      lowHarmonyPause: "Low harmony + {planet} energy = Time to pause, not push.",
      restPractices: "Rest Practices (choose one):",
      betterDaysThisWeek: "Better Days This Week:",
      rescheduleImportantTasks: "Reschedule important tasks to these high-harmony days for better outcomes.",
      classicalWisdom: "Classical wisdom:",
      stillnessBeforeMotion: "Al-sukūn qabl al-ḥaraka",
      stillnessExplanation: "(Stillness before motion brings blessed action)",
      leadership: "Leadership & Vitality",
      emotions: "Emotions & Intuition",
      action: "Action & Courage",
      communication: "Communication & Learning",
      expansion: "Expansion & Wisdom",
      love: "Love & Harmony",
      structure: "Structure & Discipline",
      ruhPhase: "Rūḥ Phase",
      phase: "Phase",
      energyBand: "Energy Band",
      allTipsForTheDay: "All Tips for the Day",
      planMindfully: "Plan mindfully",
      
      // Energy return speed badges
      instant: "INSTANT",
      quick: "QUICK",
      gradual: "GRADUAL",
      delayed: "DELAYED",
      restSignalBadge: "REST SIGNAL",
      deepRest: "DEEP REST",
      
      // Speed descriptions (lowercase for display)
      instantLower: "instant",
      quickLower: "quick",
      gradualLower: "gradual",
      delayedLower: "delayed",
      sameDayParens: "(same day)",
      fewHoursParens: "(few hours)",
      twoDaysParens: "(2-3 days)",
      oneToTwoWeeksParens: "(1-2 weeks)",
      
      // Footer message
      reflectiveGuidance: "Reflective guidance to plan your week. Use your own judgment. This is a rhythm and planning helper, not a prediction or medical/financial advice.",
      
      // Error messages
      unableToGenerateWeekly: "Unable to generate weekly forecast. Please enter a valid Arabic name.",
      
      // Day badges
      best: "Best",
      gentle: "Gentle",
      focus: "Focus",
      
      // Day details
      yourGuidanceForThisDay: "Your Guidance for This Day",
      energyReturnWisdom: "Energy Return Wisdom",
      returnSpeed: "Return Speed:",
      todaysPractice: "Today's Practice:",
      classicalTeaching: "Classical teaching (Lesson 25):",
      classicalQuote: "Man zaraʿa khayran ḥaṣada khayran",
      classicalMeaning: "(Who plants good, harvests good) × The timing of harvest depends on the seed and season.",
      optimalSequence: "Optimal Sequence for {day}",
      timeWindows: "Time Windows",
    },
    
    // Balance Meter
    balanceMeter: {
      yourBalanceToday: "Your Balance Today",
      balance: "Balance",
      conflict: "Conflict",
      moderate: "Moderate",
      harmony: "Harmony",
      tooMuch: "Too much:",
      needMore: "Need more:",
      quickFix: "Quick Fix",
      severeConflict: "Severe Conflict",
      mild: "Mild",
      startTimer: "Start {duration}-Min Timer",
      focusOnPractice: "Focus on your practice...",
      stopTimer: "Stop Timer",
      recheckBalance: "Recheck balance: 2 hours after completing Quick Fix",
      scoreUpdates: "Score updates: Midnight (new planetary day begins)",
      validFor: "Valid for: Today only - each day brings new elemental balance",
      whyThisScore: "Why this score:",
      whatDoesScoreMean: "What does my score mean?",
      scoreGuide: "Score Guide",
      harmonyRange: "70-100: Harmony",
      harmonyDesc: "Excellent flow. Minor tweaks only.",
      moderateRange: "40-69: Moderate",
      moderateDesc: "Workable balance. Quick fixes help.",
      conflictRange: "0-39: Conflict",
      conflictDesc: "Challenging day. Deep rebalancing needed.",
      basedOnMizan: "Based on Mīzān (Scale) concept from Imam al-Būnī's ʿIlm al-Ḥurūf tradition",
    },

    // Footer
    footer: {
      tagline: "Islamic Numerology & Spiritual Calculations",
      rights: "All rights reserved",
      about: "About",
      contact: "Contact",
      privacy: "Privacy Policy",
    },

    // SPIRITUAL STATIONS - Detailed descriptions
    spiritualStations: {
      1: {
        name: "Tawḥīd",
        meaning: "Divine Unity",
        quality: "Leadership, Independence, Originality",
        shadow: "Pride, Isolation, Rigidity",
        practice: "Meditate on divine oneness. Reflect: 'All power belongs to the One.'",
        verse: "Say: He is Allah, the One (112:1)",
        practical: "Start new projects, take initiative, practice self-reliance. Best for solo work."
      },
      2: {
        name: "Muʿāwana",
        meaning: "Divine Assistance",
        quality: "Cooperation, Balance, Diplomacy",
        shadow: "Indecision, Dependency, Conflict Avoidance",
        practice: "Seek harmony in relationships. Reflect: 'Two are better than one.'",
        verse: "Help one another in righteousness (5:2)",
        practical: "Build partnerships, mediate conflicts, create balance. Good for teamwork."
      },
      3: {
        name: "Ibdāʿ",
        meaning: "Creative Expression",
        quality: "Creativity, Communication, Joy",
        shadow: "Scattered Energy, Superficiality, Gossip",
        practice: "Express divine inspiration. Reflect: 'Beauty manifests through me.'",
        verse: "Read in the name of your Lord who created (96:1)",
        practical: "Create art, write, speak publicly, teach. Channel creative energy."
      },
      4: {
        name: "Istiqrār",
        meaning: "Stability",
        quality: "Foundation, Order, Discipline",
        shadow: "Rigidity, Limitation, Stubbornness",
        practice: "Build solid foundations. Reflect: 'Patience is the key to paradise.'",
        verse: "Allah loves those who are firm and steadfast (61:4)",
        practical: "Organize, plan, build systems, establish routines. Create structure."
      },
      5: {
        name: "Taḥawwul",
        meaning: "Transformation",
        quality: "Freedom, Adventure, Change",
        shadow: "Restlessness, Irresponsibility, Addiction",
        practice: "Embrace sacred change. Reflect: 'All changes except the Face of God.'",
        verse: "Allah does not change the condition of a people until they change themselves (13:11)",
        practical: "Travel, learn new skills, adapt to change. Seek variety and experience."
      },
      6: {
        name: "Khidma",
        meaning: "Service",
        quality: "Responsibility, Care, Harmony",
        shadow: "Martyrdom, Meddling, Perfectionism",
        practice: "Serve with love. Reflect: 'The best are those who benefit others.'",
        verse: "The best among you are those who feed others (Ahmad)",
        practical: "Help family, care for others, create beauty. Focus on home and community."
      },
      7: {
        name: "Ḥikma",
        meaning: "Divine Wisdom",
        quality: "Analysis, Introspection, Spirituality",
        shadow: "Isolation, Cynicism, Over-analysis",
        practice: "Seek inner knowledge. Reflect: 'Know yourself to know your Lord.'",
        verse: "He grants wisdom to whom He wills (2:269)",
        practical: "Study, research, meditate, retreat. Deepen spiritual practice."
      },
      8: {
        name: "Qudra",
        meaning: "Divine Power",
        quality: "Abundance, Authority, Achievement",
        shadow: "Greed, Domination, Materialism",
        practice: "Steward divine abundance. Reflect: 'I am a channel for divine provision.'",
        verse: "Whatever you spend, He will replace it (34:39)",
        practical: "Manage resources, lead organizations, create wealth. Build influence."
      },
      9: {
        name: "Kamāl",
        meaning: "Completion",
        quality: "Compassion, Wisdom, Universal Love",
        shadow: "Martyrdom, Emotional Manipulation, Escapism",
        practice: "Serve humanity. Reflect: 'I release with love and trust.'",
        verse: "Today I have perfected your religion for you (5:3)",
        practical: "Complete projects, forgive, let go. Teach and mentor others."
      },
      11: {
        name: "Spiritual Illumination",
        meaning: "Spiritual awakening",
        quality: "Intuition, Inspiration, Vision",
        shadow: "Over-idealism, Disconnection",
        practice: "Channel higher inspiration",
        verse: "Light upon light",
        practical: "Teach, inspire, guide with spiritual wisdom"
      },
      22: {
        name: "Master Builder",
        meaning: "Manifestation",
        quality: "Building, Practical Vision, Impact",
        shadow: "Stress, Unrealistic Expectations",
        practice: "Build lasting structures",
        verse: "Build with wisdom",
        practical: "Create systems, organizations, lasting legacy"
      },
      33: {
        name: "Master Teacher",
        meaning: "Universal compassion",
        quality: "Healing, Teaching, Service",
        shadow: "Overwhelm, Self-sacrifice",
        practice: "Teach and heal with love",
        verse: "Guide with compassion",
        practical: "Mentor, heal, serve humanity"
      }
    },

    // GEOMETRY - Letter shapes
    geometryKeywords: {
      vertical: ["Aspiration", "Spiritual Reach", "Goals", "Growth"],
      round: ["Compassion", "Wholeness", "Cycles", "Embrace"],
      flat: ["Stability", "Grounding", "Foundation", "Balance"],
      angular: ["Decision", "Sharpness", "Clarity", "Transformation"]
    },
    
    geometryProfiles: {
      verticalDominant: "Strong upward energy. You naturally aspire to ideals and higher aims. Spiritual seeker with aspirational drive.",
      roundDominant: "Embracing, nurturing energy. You contain and complete cycles with emotional warmth. Natural compassion capacity.",
      flatDominant: "Grounded, stable foundation. You create horizontal expansion with practical stability. Reliable, earth-connected energy.",
      angularDominant: "Sharp, decisive energy. You cut through complexity with clarity and transformation. Direct, focused approach.",
      balanced: "Balanced geometric energy. You have versatility of expression, able to be aspirational, nurturing, grounded, or decisive."
    },

    // INHERITANCE - Mother's element analysis
    inheritanceSame: "You express and inherit the same {element} energy. Strong, coherent elemental identity with deep roots.",
    
    inheritanceCompatible: {
      fireAir: "You express with Fire but have Air roots. Your Air foundation fuels your Fire action×like wind fanning flames.",
      airFire: "You express with Air but have Fire roots. Your Fire foundation energizes your Air movement×like heat creating wind.",
      waterEarth: "You express with Water but have Earth roots. Your Earth foundation contains your Water flow×like a riverbed holding water.",
      earthWater: "You express with Earth but have Water roots. Your Water foundation nourishes your Earth structure×like rain feeding soil."
    },
    
    inheritanceOpposing: {
      fireWater: "You express with Fire but have Water roots. This creates dynamic tension×passion balanced by emotional depth.",
      waterFire: "You express with Water but have Fire roots. This creates dynamic tension×emotional depth fueled by inner passion.",
      airEarth: "You express with Air but have Earth roots. This creates dynamic tension×movement balanced by stability.",
      earthAir: "You express with Earth but have Air roots. This creates dynamic tension×structure built on freedom."
    },

    // PLANETARY QUALITIES
    planetaryQualities: {
      Sun: {
        quality: "Leadership, Authority, Success",
        favorable: ["Starting new ventures", "Seeking promotions", "Public speaking", "Creative projects"],
        avoid: ["Ego-driven decisions", "Confrontations with authority"]
      },
      Moon: {
        quality: "Emotion, Intuition, Home",
        favorable: ["Family matters", "Emotional healing", "Dream work", "Nurturing activities"],
        avoid: ["Major decisions (emotions clouded)", "Legal matters"]
      },
      Mercury: {
        quality: "Communication, Learning, Commerce",
        favorable: ["Study", "Writing", "Business deals", "Social networking", "Short travel"],
        avoid: ["Signing contracts if Mercury retrograde", "Gossip"]
      },
      Venus: {
        quality: "Love, Beauty, Harmony",
        favorable: ["Romance", "Art", "Socializing", "Beautification", "Peacemaking"],
        avoid: ["Harsh criticism", "Conflict"]
      },
      Mars: {
        quality: "Action, Courage, Competition",
        favorable: ["Physical exercise", "Assertive action", "Courage needed", "Surgery"],
        avoid: ["Anger", "Impulsive decisions", "Starting conflicts"]
      },
      Jupiter: {
        quality: "Expansion, Wisdom, Abundance",
        favorable: ["Legal matters", "Education", "Spiritual practice", "Long-term planning", "Generosity"],
        avoid: ["Excess", "Overconfidence"]
      },
      Saturn: {
        quality: "Structure, Discipline, Karma",
        favorable: ["Hard work", "Long-term commitments", "Authority relations", "Real estate matters"],
        avoid: ["Fun activities", "Expecting quick results"]
      }
    },

    // DAILY DHIKR
    dailyDhikr: {
      Fire: {
        benefit: "Strengthens will and courage",
        time: "After Fajr"
      },
      Water: {
        benefit: "Brings ease in difficulty, softens hearts",
        time: "After Maghrib"
      },
      Air: {
        benefit: "Increases knowledge and clarity",
        time: "After ʿIshā"
      },
      Earth: {
        benefit: "Grants patience and steadfastness",
        time: "Before sleep"
      }
    },

    // PERSONAL YEAR THEMES
    personalYearThemes: {
      1: "New beginnings, planting seeds, independence",
      2: "Partnerships, patience, cooperation",
      3: "Creative expression, joy, social expansion",
      4: "Building foundations, hard work, stability",
      5: "Change, freedom, adventure, unexpected events",
      6: "Responsibility, service, family matters, love",
      7: "Spiritual growth, introspection, study, rest",
      8: "Achievement, power, financial matters, recognition",
      9: "Completion, release, humanitarianism, endings leading to new beginnings"
    },

    // COMPATIBILITY - Additional strings
    compatibilityAnalysis: {
      soulJourney: "Your soul's journey passes through the station of",
      destinyInterpretation: "Your life destiny ({destiny}) calls you to {quality}. Your soul deeply urges {soulQuality}, while outwardly you express {personalityQuality}. Integration comes when you align all three dimensions.",
      uniqueDynamic: "Unique Dynamic",
      eachRelationshipTeaches: "Each relationship teaches unique lessons",
      opportunityForGrowth: "Opportunity for growth",
      learningThroughDifferences: "Learning through differences",
      balanceIndividuality: "Balancing individuality with union"
    },

    // WEEKLY RESULTS COMPONENT
    weeklyResults: {
      unableToGenerate: "Unable to generate weekly forecast. Please enter a valid Arabic name.",
      badges: {
        best: "Best",
        gentle: "Gentle",
        focus: "Focus"
      },
      clickIndicator: "▼",
      timeWindows: "Time Windows",
      morning: "Morning",
      midday: "Midday",
      afternoon: "Afternoon",
      evening: "Evening",
      closeDetails: "Close details",
      energyType: "Energy Type",
      bestFor: "Best for",
      avoid: "Avoid",
      planetalPhase: "Planetal Phase",
      peakClarity: "Peak Clarity",
      socialEnergy: "Social Energy",
      endurancePhase: "Endurance Phase",
      reviewTime: "Review Time",
      classicalTeaching: "Classical teaching (Lesson",
      forEverythingTime: "For everything there is a time",
      successFromRightAction: "Success comes from right action at the right time",
      allTips: "All tips",
      closesIn: "Closes in",
      nextWindow: "Next window",
      peakPerformanceDay: "Peak Performance Day",
      steadyProgressDay: "Steady Progress Day",
      restReflectionDay: "Rest & Reflection Day",
      overallEnergy: "Overall Energy",
      thisMonthFlow: "This Month's Flow"
    },

    // DESTINY RESULTS COMPONENT
    destinyResults: {
      unableToCalculate: "Unable to calculate destiny. Please enter a name.",
      loadingVerse: "Loading Quranic verse...",
      verseError: "Unable to load verse at the moment. Please refresh or visit Quran.com directly.",
      arabicText: "Arabic Text",
      englishTranslation: "English Translation",
      readFullVerse: "Read full verse on Quran.com",
      ayahOf: "Ayah {ayah} of {total}",
      noVerseData: "No verse data available for this resonance.",
      kabir: "Kabīr",
      hadath: "Ḥadath",
      grandTotal: "Grand Total",
      element: "Element",
      strengths: "Strengths",
      growthAreas: "Growth Areas",
      yourNumbers: "Your Numbers",
      corePersonality: "Core Personality",
      innerDesires: "Inner Desires",
      howOthersSee: "How Others See You",
      lifePurpose: "Life Purpose",
      lifePath: "Life Path",
      soulUrge: "Soul Urge",
      personality: "Personality",
      destiny: "Destiny",
      coreTalents: "Your core talents & natural strengths. The abilities you were born with.",
      whatMakesHappy: "What truly makes you happy. Your deepest desires & inner fulfillment.",
      impressionYouGive: "The impression you give. How people see & experience you at first.",
      ultimateGoal: "Your life purpose & what you're meant to accomplish. Your ultimate goal.",
      specialNumbers: "Special Numbers & Lessons",
      lessonsToLearn: "Lessons to Learn",
      lessonsDescription: "These numbers represent lessons your soul wants to learn in this life. They're not obstacles×they're opportunities for growth.",
      blessedNumbers: "Blessed Numbers",
      blessedDescription: "These are powerful numbers linked to spiritual tradition. They bring special blessings and spiritual protection to your life."
    },

    // COMPATIBILITY RESULTS COMPONENT
    compatibilityResults: {
      unableToCalculate: "Unable to calculate compatibility. Please ensure both names are entered.",
      overallCompatibility: "Overall Compatibility",
      threeAnalysisMethods: "Three Analysis Methods",
      spiritualDestiny: "Spiritual Destiny",
      elementalTemperament: "Elemental Temperament",
      planetaryCosmic: "Planetary Cosmic",
      remainder: "Remainder",
      sharedElement: "Element",
      recommendations: "Recommendations",
      strengths: "Strengths",
      challenges: "Challenges",
      // Letter Chemistry Feature
      letterChemistry: "Letter Chemistry",
      letterChemistryArabic: "Zawāj al-Ḥurūf",
      letterChemistryDesc: "Shows the elemental temperament between the two names. Each letter carries Fire, Air, Water, or Earth energy × their blend forms the emotional and energetic balance of your connection.",
      combinedHarmony: "Combined Harmony",
      combinedHarmonyExplain: "Higher means smoother elemental flow between you",
      balancingDhikr: "Balancing Dhikr",
      balancingDhikrContext: "These dhikr help balance the dominant elements so both can harmonize.",
      temperament: "Temperament",
      for: "For",
      // Element names
      fire: "Fire",
      air: "Air",
      water: "Water",
      earth: "Earth",
      // Element temperament descriptions
      fireTemperament: "Fire Temperament × passionate, creative, bold",
      airTemperament: "Air Temperament × quick, intellectual, communicative",
      waterTemperament: "Water Temperament × calm, emotional, intuitive",
      earthTemperament: "Earth Temperament × stable, practical, grounded",
      // Balance Advice for Element Pairs
      balanceAdvice: {
        fireFire: "Practice calm dhikr together, avoid rushing decisions.",
        fireAir: "Creative synergy! Good for projects and ideas, but take cool-down time together.",
        fireWater: "Balance passion with patience. Cool flames with understanding.",
        fireEarth: "Combine vision with planning. Let fire inspire, earth execute.",
        airAir: "Express ideas clearly, but ground them in action.",
        airWater: "Express feelings clearly through words or art. Write or sing together.",
        airEarth: "Ideas meet practicality. Discuss, then build together.",
        waterWater: "Nurture each other's emotions. Create safe, peaceful spaces.",
        waterEarth: "Nurture creative rest together. Cook, garden, or create beauty.",
        earthEarth: "Build stability together, but leave room for spontaneity."
      },
      // Dhikr Effects
      dhikrEffects: {
        fireEffect: "Cools intensity, brings gentleness",
        airEffect: "Focuses the mind, brings wisdom",
        waterEffect: "Lifts emotion into clarity",
        earthEffect: "Softens rigidity, opens possibilities"
      },
      
      // UI Labels for Four-Layer Compatibility
      accuracy: "Accuracy",
      precision: "Accuracy",
      weight: "weight",
      motherOf: "Mother of",
      
      // Four-Layer UI Text
      whatThisMeans: "💡 What This Means",
      showCalculationDetails: "Show Calculation Details",
      understandingTerms: "Understanding the Terms",
      hoverToLearnMore: "Hover over ℹ️ icons to learn more",
      fourLayersTitle: "Four Layers of Compatibility",
      inDailyLife: "🏠 In Daily Life:",
      challenge: "⚠️ Challenge:",
      tip: "💡 Tip:",
      mostImportantForMarriage: "💜 MOST IMPORTANT FOR MARRIAGE",
      dailyImpact: "🏠 Daily Impact:",
      innerTemperament: "💡 Inner Temperament (الطبع الباطن)",
      cosmicTemperament: "💡 Cosmic Temperament (الطبع الفلكي)",
      harmony: "Harmony"
    },

    // ============================================================================
    // FOUR-LAYER COMPATIBILITY SYSTEM
    // ============================================================================
    
    fourLayerCompatibility: {
      // Form Header
      title: "Four-Layer Compatibility Analysis",
      titleArabic: "تحليل التوافق الرباعي",
      subtitle: "The complete traditional West African method",
      description: "This analysis examines both your conscious personalities (from your names) and your inherited emotional patterns (from your mothers' names) to give the most accurate compatibility reading.",
      
      // Input Fields
      person1Name: "First Person's Name",
      person2Name: "Second Person's Name",
      person1MotherName: "First Person's Mother's Name",
      person2MotherName: "Second Person's Mother's Name",
      optional: "(Optional for deeper analysis)",
      
      // Tooltips
      nameTooltip: "💡 Your name reveals your conscious self × how you show up in the world, your active personality, and how others see you.",
      motherNameTooltip: `💡 Your mother's name reveals your emotional blueprint × the subconscious patterns, feelings, and needs you inherited. This is the foundation beneath your personality.

📊 Analysis depth:
• With names only: 70% accuracy
• With mothers' names: 90-95% accuracy

🌍 This is the traditional method preserved by West African Islamic scholars for serious marriage compatibility.

🔒 Privacy: Mother's names are used only for calculation and never stored.`,
      
      // Analysis Mode Selection
      analysisMode: "Analysis Mode",
      quickAnalysis: "Quick Analysis (Names Only)",
      quickAnalysisDesc: "See how your conscious personalities interact in daily life. Good for initial curiosity.",
      quickAccuracy: "70-75% accuracy",
      completeAnalysis: "Complete Analysis (Names + Mothers) ⭐ Recommended",
      completeAnalysisDesc: "The traditional West African method. Reveals both surface chemistry and deep emotional compatibility. Essential for serious relationships.",
      completeAccuracy: "90-95% accuracy",
      
      // Overall Score Section
      overallCompatibilityTitle: "Overall Compatibility",
      overallCompatibilityArabic: "التوافق الشامل",
      overallExplanation: "This score is calculated from all four layers of your connection, weighted to prioritize emotional foundation (most important for long-term harmony).",
      
      // Score Interpretations
      excellent: "EXCELLENT",
      excellentRange: "85-100%",
      excellentMeaning: "Outstanding compatibility on both surface and soul levels. Your energies complement each other beautifully.",
      
      veryGood: "VERY GOOD",
      veryGoodRange: "70-84%",
      veryGoodMeaning: "Strong compatibility with minor areas to nurture. This connection has great potential with mutual effort.",
      
      good: "GOOD",
      goodRange: "55-69%",
      goodMeaning: "Moderate compatibility. You can build a harmonious relationship with understanding, communication, and compromise.",
      
      challenging: "CHALLENGING",
      challengingRange: "40-54%",
      challengingMeaning: "Significant differences in energy and approach. This relationship requires substantial effort, patience, and mutual growth.",
      
      difficult: "DIFFICULT",
      difficultRange: "0-39%",
      difficultMeaning: "Major elemental conflicts. While not impossible, this pairing faces fundamental challenges that require deep commitment to overcome.",
      
      // Layer Headers
      layer1Title: "Daily Life Compatibility",
      layer1TitleArabic: "التوافق اليومي",
      layer1Subtitle: "Surface Dynamic (الديناميكية الظاهرة - al-Dīnāmīkīya al-Ẓāhira)",
      
      layer2Title: "Emotional Foundation",
      layer2TitleArabic: "الأساس العاطفي",
      layer2Subtitle: "Deep Dynamic (الديناميكية العميقة - al-Dīnāmīkīya al-ʿAmīqa)",
      layer2Badge: "🌟 MOST IMPORTANT FOR LONG-TERM HARMONY",
      
      layer3Title: "Person 1's Effect on Person 2's Emotional Core",
      layer4Title: "Person 2's Effect on Person 1's Emotional Core",
      crossDynamicsTitle: "Cross-Influence Dynamics",
      crossDynamicsArabic: "الديناميكيات المتقاطعة",
      crossDynamicsExplanation: "These layers show how each person's conscious energy affects the other's emotional core. Think of it as: 'How does your personality land on their heart?'",
      
      // What It Means Sections
      whatItMeasures: "📖 What This Measures:",
      basedOn: "🔍 Based On:",
      whyItMatters: "💡 Why It Matters:",
      
      // Layer 1 Explanations
      layer1WhatItMeans: "How your conscious personalities interact day-to-day. This is the energy you actively bring to conversations, decisions, and shared activities. It's what people see when they look at your relationship.",
      layer1BasedOn: "The elemental temperaments from both of your names (calculated using Ḥadath ÷ 4 method)",
      layer1WhyItMatters: "This determines your communication style, conflict resolution, and whether you naturally 'get' each other in everyday moments. High scores here mean easy, natural flow in daily life.",
      
      // Layer 2 Explanations
      layer2WhatItMeans: "The subconscious emotional compatibility inherited from your mothers. This is the 'feeling of home' you create together×the unspoken comfort, safety, and deep bond that either naturally exists or must be built.",
      layer2BasedOn: "The elemental temperaments from both of your mothers' names (calculated using Ḥadath ÷ 4 method)",
      layer2WhyItMatters: `This is THE most important layer for marriage and long-term partnership. Here's why:

• Your mother's emotional patterns shaped how you give and receive love
• This layer determines if you feel "safe" together emotionally
• High scores here mean you intuitively understand each other's needs
• Low scores mean you'll need conscious work to meet each other's emotional needs

Many couples with great surface chemistry struggle because this layer isn't harmonious. Knowing this in advance helps you prepare.`,
      
      layer2ExampleTitle: "🎭 Real-World Example:",
      layer2Example: `Ahmad and Layla have great daily chemistry (Fire + Air = 85%).

But when stress hits:
• Ahmad's Water roots (from mother) need emotional processing and talking
• Layla's Fire roots (from mother) need space and action to feel better

Without knowing this, they hurt each other:
• Ahmad feels abandoned when Layla takes space
• Layla feels suffocated when Ahmad wants to talk

WITH this knowledge, they understand: "We're both trying to feel safe×just in different ways."`,
      
      // Dual Temperament
      dualTemperamentTitle: "🎭 Your Individual Temperaments",
      dualTemperamentArabic: "طبائعكم الفردية",
      dualTemperamentExplanation: "Understanding each person's inner (conscious) and cosmic (subconscious) temperaments helps you see the complete person×not just the surface.",
      
      innerTemperament: "Inner Temperament",
      innerTemperamentArabic: "الطبع الباطن",
      innerTemperamentDef: "Your conscious self×how you actively show up in the world. Calculated from YOUR name.",
      
      cosmicTemperament: "Cosmic Temperament",
      cosmicTemperamentArabic: "الطبع الفلكي",
      cosmicTemperamentDef: "Your inherited emotional blueprint×the subconscious patterns from your lineage. Calculated from your MOTHER'S name.",
      
      // Integration Types
      fullyAligned: "Fully Aligned",
      fullyAlignedMeaning: "You are authentically who you appear to be. What people see matches what you feel inside. This creates strong, consistent energy.",
      fullyAlignedChallenge: "May be TOO much of that element×lacking balance from others.",
      
      naturallyBalanced: "Naturally Balanced",
      naturallyBalancedMeaning: "Your inner and cosmic sides support each other. You have access to multiple energies that work together harmoniously.",
      
      internalComplexity: "Internal Complexity",
      internalComplexityMeaning: "There's a gap between how you show up and what you need emotionally. Others may not see your full depth. You may feel misunderstood.",
      internalComplexityAdvice: "💡 Your work is integration: letting your inner self express through your outer self. Honor both sides.",
      
      // Recommendations
      yourPersonalizedGuidance: "💡 Your Personalized Guidance",
      yourPersonalizedGuidanceArabic: "إرشاداتكم الشخصية",
      guidanceIntro: "Based on all four layers of your compatibility, here's specific advice to strengthen your connection:",
      
      yourNaturalStrengths: "🌟 Your Natural Strengths",
      strengthsDesc: "These areas come easily to you. Celebrate and maintain them:",
      
      areasToNurture: "⚠️ Areas to Nurture",
      challengesDesc: "These areas need conscious attention, but awareness is half the solution:",
      
      specificPractices: "🛠️ Specific Practices",
      practicesDesc: "Try these activities to balance your elemental dynamics:",
      
      spiritualBalancing: "🤲 Spiritual Balancing",
      dhikrDesc: "These sacred phrases help harmonize your elemental energies:",
      
      // Educational Glossary
      understandingTheTerms: "[ℹ️ Understanding the Terms]",
      glossaryTitle: "📚 ʿIlm al-Ḥurūf Glossary",
      glossaryTitleArabic: "مسرد علم الحروف",
      
      ilmAlHuruf: "ʿIlm al-Ḥurūf",
      ilmAlHurufArabic: "علم الحروف",
      ilmAlHurufDef: "The Science of Letters × An ancient Islamic science that studies the mystical properties of Arabic letters and their numerical values. Each letter carries specific energy (Fire, Air, Water, or Earth) and a numerical value used for spiritual calculations.",
      
      hadath: "al-Ḥadath",
      hadathArabic: "الحدث",
      hadathDef: "The Numerical Essence × The sum of all letter values in a name using the Abjad (أبجد) system. This number reveals spiritual essence and destiny patterns.",
      
      hadathDiv4: "al-Ḥadath ÷ 4",
      hadathDiv4Def: `The classical method for determining elemental temperament (MAGHRIBI SYSTEM). The remainder when Ḥadath is divided by 4 indicates the dominant element:
• Remainder 1 = Fire (النار)
• Remainder 2 = Earth (الأرض)  
• Remainder 3 = Air (الهواء)
• Remainder 0 = Water (الماء)`,
      
      zawajAlHuruf: "Zawāj al-Ḥurūf",
      zawajAlHurufArabic: "زواج الحروف",
      zawajAlHurufDef: "Marriage of Letters × The compatibility analysis between two names based on their elemental harmony. How the letters 'marry' or interact between two people.",
      
      // Calculation Transparency
      showCalculation: "[📊 Show How We Calculated This]",
      calculationBreakdown: "🔢 Calculation Breakdown",
      calculationBreakdownArabic: "تفصيل الحسابات",
      
      step1: "Step 1: Convert name to Abjad values",
      step2: "Step 2: Sum all values",
      step3: "Step 3: Divide by 4",
      step4: "Step 4: Map remainder to element",
      
      totalHadath: "Total (Ḥadath)",
      quotient: "Quotient",
      remainder: "Remainder",
      element: "Element",
      
      weightingExplanation: "Why these weights? Emotional Foundation (40%) is most important for long-term harmony. Daily Life (30%) affects everyday happiness. Cross Dynamics (15% each) show how you affect each other's cores."
    },

    // Element Pairing Descriptions (for all 10 combinations)
    elementPairings: {
      fireFire: {
        label: "Fire + Fire: The Power Couple",
        description: "Intense, passionate, and fast-moving. You both bring bold energy and drive to the relationship.",
        dailyLife: "Daily life together feels electric and exciting. Lots of action, adventure, and spontaneity.",
        challenge: "⚠️ May compete or burn out without rest. Both want to lead.",
        tip: "💡 Schedule calm time together. Practice listening, not just doing."
      },
      fireAir: {
        label: "Fire + Air: The Visionary Duo",
        description: "Fire sparks Air's ideas into action. Creative, energizing, and full of possibilities.",
        dailyLife: "You inspire each other constantly. Conversations lead to projects. Ideas become reality.",
        challenge: "⚠️ May overlook emotional depth and practical details. All vision, little grounding.",
        tip: "💡 Weekly check-ins: 'How are you feeling?' not just 'What are you doing?'"
      },
      fireWater: {
        label: "Fire + Water: Steam & Transformation",
        description: "Passion meets depth. This creates either steam (transformation) or evaporation (conflict).",
        dailyLife: "Your approaches to life are opposite. Fire acts fast; Water needs time to feel. This creates friction in daily decisions.",
        challenge: "⚠️ Fire may overwhelm Water. Water may withdraw from Fire. Communication styles clash.",
        tip: "💡 Fire: Practice active listening and patience. Water: Express needs clearly and directly."
      },
      fireEarth: {
        label: "Fire + Earth: Vision Meets Foundation",
        description: "Fire brings vision and excitement; Earth brings execution and stability. Complementary but at different paces.",
        dailyLife: "Fire wants to start new things constantly; Earth prefers to finish what's begun. This creates planning tension but also balance.",
        challenge: "⚠️ Different paces: Fire rushes, Earth takes time. May feel like you're pulling in opposite directions.",
        tip: "💡 Combine planning sessions (Earth) with spontaneous adventures (Fire). Honor both approaches."
      },
      airAir: {
        label: "Air + Air: The Intellectual Partnership",
        description: "Endless conversations, shared curiosity, and mental stimulation. You understand how each other thinks.",
        dailyLife: "You can talk for hours. Every experience becomes a discussion. Learning and exploring together is natural.",
        challenge: "⚠️ May overthink or avoid emotional vulnerability. All head, not enough heart.",
        tip: "💡 Set 'no-analysis' zones. Practice feeling without discussing. Touch more, talk less sometimes."
      },
      airWater: {
        label: "Air + Water: Mind Meets Heart",
        description: "Air gives words to Water's feelings. Water adds depth to Air's ideas. Beautiful when balanced.",
        dailyLife: "Air helps Water express emotions clearly. Water reminds Air that feelings matter as much as thoughts.",
        challenge: "⚠️ Air may rationalize feelings; Water may feel misunderstood when emotions are analyzed.",
        tip: "💡 Air: Write love letters×use your words for emotion. Water: Share dreams aloud×trust Air to listen."
      },
      airEarth: {
        label: "Air + Earth: Ideas Take Root",
        description: "Air dreams, Earth builds. Opposite approaches that can complement or clash.",
        dailyLife: "Air wants to explore possibilities; Earth wants to commit to one path. This creates daily decision-making friction.",
        challenge: "⚠️ Air may seem scattered to Earth; Earth may seem rigid to Air. Different values around structure.",
        tip: "💡 Create vision boards together (Air), then assign tasks and timelines (Earth). Meet in the middle."
      },
      waterWater: {
        label: "Water + Water: The Deep Connection",
        description: "Intuitive understanding. You feel each other's emotions without words. Natural empathy flows between you.",
        dailyLife: "A look says everything. You nurture each other instinctively. Emotional safety comes naturally.",
        challenge: "⚠️ May drown in emotions together. Can become isolated from the outside world. Need Air's perspective.",
        tip: "💡 Journal together, then discuss what you wrote. Bring emotions into words. Connect with others too."
      },
      waterEarth: {
        label: "Water + Earth: Nurturing Growth",
        description: "Natural harmony. Water nourishes Earth, Earth holds Water. Like a garden×growth happens organically.",
        dailyLife: "You support each other's growth effortlessly. Water brings feelings, Earth brings stability. Balanced and peaceful.",
        challenge: "⚠️ May avoid conflict or become stagnant. Too comfortable can mean no growth challenges.",
        tip: "💡 Cook together, garden, create with your hands. Embrace gentle change×try new things monthly."
      },
      earthEarth: {
        label: "Earth + Earth: The Solid Foundation",
        description: "Rock-solid stability. Loyalty, consistency, and shared practical goals. You build together brick by brick.",
        dailyLife: "Reliable routines, shared responsibilities, and steady progress. You know what to expect from each other.",
        challenge: "⚠️ May resist change or become too routine. Both can be stubborn. Life feels safe but may lack spontaneity.",
        tip: "💡 Schedule monthly 'new experiences.' Break routines together intentionally. Invite Air and Fire energy."
      }
    },

    // LIFE PATH RESULTS COMPONENT
    lifePathResults: {
      yourLifeNumbers: "Your Life Numbers",
      introduction: "These four numbers reveal your core personality, inner desires, how others see you, and your life purpose. Think of them as the main traits shaping who you are and the path you're meant to walk.",
      whereYouAre: "Where You Are Now",
      currentLifePhase: "Current Life Phase",
      phaseOf: "Phase {current} of 9",
      yearOf: "Year {current}/9",
      focusAreas: "Focus Areas",
      yourAge: "Your age",
      years: "years",
      thisYearMonth: "This Year & Month's Energy",
      personalYear: "Personal Year",
      personalMonth: "Personal Month",
      strengthsChallenges: "Your Strengths & Growth Opportunities",
      strengthsDescription: "Each number from 1 to 9 represents different life qualities. Your strengths show what you naturally excel at. Growth areas show where you can develop further.",
      whatYouAreStrongAt: "What you're strong at",
      whereYouCanGrow: "Where you can grow",
      strength: "Strength",
      growthArea: "Growth Area",
      whatMakesCapable: "What makes you capable and reliable",
      whatGivesEdge: "What gives you an edge",
      yourNaturalTalent: "Your natural talent",
      whatYouExcelAt: "What you excel at",
      aQualityToDevelop: "A quality to develop",
      areaForImprovement: "An area for improvement",
      somethingToWorkOn: "Something to work on",
      keyLifeLesson: "A key life lesson",
      rightNow: "Right now",
      currentStrength: "Your current strength",
      mainStrengthSupporting: "This is the main strength supporting you this season",
      currentlyWorkingOn: "Currently working on",
      yourMainFocus: "Your main focus",
      whatLifeTeaching: "This is what life is teaching you now×embrace it!",
      numberExplanations: {
        1: { title: "The Leader", meaning: "You're naturally independent and driven to create new things. You prefer making your own decisions." },
        2: { title: "The Peacemaker", meaning: "You're good at bringing people together and finding harmony. You're sensitive to others' feelings." },
        3: { title: "The Creator", meaning: "You express yourself easily and bring joy wherever you go. Communication is your strength." },
        4: { title: "The Builder", meaning: "You're reliable and practical. You build solid foundations in everything you do." },
        5: { title: "The Explorer", meaning: "You love freedom and variety. You adapt quickly and learn from diverse experiences." },
        6: { title: "The Caregiver", meaning: "You're responsible and naturally want to help others. Family and service matter deeply to you." },
        7: { title: "The Thinker", meaning: "You're analytical and spiritual. You seek deeper understanding of life's mysteries." },
        8: { title: "The Achiever", meaning: "You're ambitious and focused on success. You have strong business and leadership abilities." },
        9: { title: "The Humanitarian", meaning: "You care about the world and want to make a positive difference. Compassion guides you." },
        11: { title: "The Visionary", meaning: "You see beyond ordinary things. You inspire others and carry spiritual messages." },
        22: { title: "The Master Builder", meaning: "You have big ambitions to create something lasting. You turn dreams into reality on a large scale." }
      }
    },

    // TIMING RESULTS COMPONENT
    timingResults: {
      unableToCalculate: "Unable to calculate planetary hour. Please try again.",
      deepRestNeededToday: "Deep Rest Needed Today",
      todayIsRestDay: "Today is a Rest Day",
      criticalLowEnergy: "Critical low energy detected. Your spirit is recalibrating×honor this healing signal with deep physical and mental rest today.",
      lowHarmonyToday: "Low harmony today suggests this is a strategic rest day. Focus on planning and reflection rather than execution and new starts.",
      recommendedToday: "Recommended Today:",
      viewFullWeek: "View Full Week",
      dismiss: "Dismiss",
      restDayActive: "Rest Day Active",
      restDayNote: "Planetary hours below are shown for reference, but minimize activities today.",
      currentPlanetaryHour: "Current Planetary Hour",
      favorableFor: "Favorable For:",
      avoid: "Avoid:",
      perfectAlignment: "PERFECT ALIGNMENT!",
      strongEnergy: "STRONG ENERGY",
      restTime: "REST TIME",
      moderate: "MODERATE",
      windowClosesIn: "Window closes in:",
      nextWindow: "Next {element} window:",
      bestForNow: "Best for NOW:",
      bestForWhenReturns: "Best for when your element returns:",
      yourPersonalYear: "Your Personal Year",
      recommendedDhikr: "Recommended Dhikr Today",
      count: "Count",
      times: "times",
      bestTime: "Best time",
      benefit: "Benefit",
      actNow: "Act Now",
      realTimeGuidance: "Real-time Guidance",
      
      // Optimal Sequence translations
      optimalSequenceFor: "Optimal Sequence for {day}",
      morning: "Morning",
      midday: "Midday",
      afternoon: "Afternoon",
      evening: "Evening",
      bestFor: "Best For:",
      avoidLabel: "Avoid:",
      
      // New additions for better UX
      harmony: "Harmony:",
      harmonyScore: "Harmony",
      planetEnergy: "{planet} energy",
      yourElement: "Your {element}",
      hourElement: "Hour's {element}",
      classicalWisdom: "Classical Wisdom:",
      deepRestQuote: "Man ʿarafa infisāl waqtihi, faqad ḥafaẓa ṭāqatahu",
      deepRestTranslation: "Who knows the time for disconnection, preserves their energy",
      restDayQuote: "Al-sukūn qabl al-ḥaraka",
      restDayTranslation: "Stillness before motion brings blessed action",
      minutesLeft: "{minutes} minutes left",
      hoursLeft: "{hours} hours left",
      alignment: "Alignment",
      energyStatus: "Energy Status",
      timeRemaining: "Time Remaining",
      
      // Color guidance
      whatToWearToday: "What to Wear Today",
      wearTheseColors: "Wear these colors:",
      tryThis: "Try this:",
      you: "You",
      today: "Today",
      perfectFit: "Perfect fit",
      goingWell: "Going well",
      balanced: "Balanced",
      needCare: "Need care",
      
      // Act Now section
      actNowRealTimeGuidance: "Act Now - Real-Time Guidance",
      useThisTimeFor: "Use this time for:",
      handleRoutineTasks: "Handle routine tasks",
      continueOngoingWork: "Continue ongoing work",
      waitForBetterTiming: "Wait for better timing",
      plentyOfTime: "Plenty of time remaining in this window",
      actNowWarning: "ACT NOW! Optimal time ending soon.",
      howWeFiguredThisOut: "How we figured this out",
      howItWorks: "How it works:",
      planetaryRulerExplanation: "We look at today's planetary ruler ({planet}) and which element controls most of today's hours ({element}). Together they create today's energy personality.",
      yourFitExplanation: "Your fit: Your {userElement} nature and today's {dayElement} energy are {harmonyPercent}% aligned - like two personalities getting along.",
      dayRuler: "Day Ruler:",
      mostActive: "Most Active:",
      dominantElement: "Dominant:",
      harmonyLabel: "Harmony:",
      ancientWisdomMessage: "Ancient wisdom says colors and energy work together. Wear what feels right to you! 🌀"
    },

    // ACTION BUTTONS & ALIGNMENT
    actionButtons: {
      startImportantTask: "Start an important task",
      makeDifficultCall: "Make a difficult call",
      sendCriticalEmail: "Send a critical email",
      scheduleForLater: "Schedule for later",
      restReflect: "Rest and reflect",
      planPrepare: "Plan and prepare",
      waitFor: "Wait for {element}",
      handleRoutineTasks: "Handle routine tasks",
      continueOngoingWork: "Continue ongoing work",
      waitForBetterTiming: "Wait for better timing",
      takeBoldAction: "Take bold action",
      writeOrCommunicate: "Write or communicate",
      brainstormIdeas: "Brainstorm ideas",
      creativeWork: "Creative work",
      deepReflection: "Deep reflection",
      buildOrOrganize: "Build or organize",
      completeTasks: "Complete tasks",
      lowStakesActivities: "Low-stakes activities",
      preparationWork: "Preparation work"
    },

    // HARMONY & ALIGNMENT
    harmony: {
      perfectAlignment: "Perfect alignment",
      strongAlignment: "Strong alignment",
      moderateAlignment: "Moderate alignment",
      weakAlignment: "Weak alignment",
      opposing: "Opposing",
      harmonious: "Harmonious",
      transformative: "Transformative",
      nourishing: "Nourishing",
      unified: "Unified",
      excellent: "Excellent",
      veryGood: "Very Good",
      good: "Good",
      moderate: "Moderate",
      challenging: "Challenging",
      supportive: "Supportive",
      neutral: "Neutral",
    },
    
    // MOMENT STATE
    moment: {
      hold: {
        cause: "Contrasting energies — pause before acting",
        saturn: "Saturn's reflective influence — time for review",
      },
      flow: {
        cause: "Aligned energies — momentum favors you",
        neutral: "Balanced energies — steady progress",
      },
      act: {
        cause: "Dynamic hour matches your nature — seize the moment",
      },
      rest: {
        cause: "Gentle hour suits your nature — restore and reflect",
      },
    },

    // ELEMENT GUIDANCE
    elementGuidance: {
      Fire: {
        bestFor: [
          "Starting new projects",
          "Making important decisions",
          "Having conversations requiring courage",
          "Taking bold action",
          "Leading and inspiring others"
        ],
        avoid: [
          "Emotional processing",
          "Detailed planning",
          "Slow, methodical work"
        ]
      },
      Air: {
        bestFor: [
          "Communicating and networking",
          "Learning new concepts",
          "Brainstorming",
          "Writing and articulating",
          "Teaching and sharing knowledge"
        ],
        avoid: [
          "Heavy physical work",
          "Deep emotional work",
          "Long-term commitments"
        ]
      },
      Water: {
        bestFor: [
          "Emotional processing",
          "Deep reflection",
          "Healing conversations",
          "Intuitive work",
          "Creative flow"
        ],
        avoid: [
          "Quick decisions",
          "Confrontations",
          "Aggressive action"
        ]
      },
      Earth: {
        bestFor: [
          "Building and organizing",
          "Making commitments",
          "Finishing projects",
          "Financial planning",
          "Physical work"
        ],
        avoid: [
          "Rapid changes",
          "Impulsive decisions",
          "Abstract theorizing"
        ]
      }
    },

    // COLOR GUIDANCE
    colorGuidance: {
      dailyColorGuidance: "Daily Color Guidance",
      yourElement: "Your Element",
      todayElement: "Today's Element",
      harmonyLevel: "Harmony Level",
      primaryColors: "Primary Colors",
      accentColors: "Accent Colors",
      avoidColors: "Avoid Colors",
      energyMessage: "Energy Message",
      practicalTips: "Practical Tips",
      bestEnergyTimes: "Best Energy Times",
      harmonyBreakdown: "Harmony Breakdown"
    },

    // REST PRACTICES
    restPractices: {
      physicalRest: "Physical rest - sleep, lie down, minimal movement",
      cancelNonEssential: "Cancel all non-essential meetings/tasks",
      lightPrayer: "Light prayer or dhikr only (no intensive practice)",
      noDecisions: "No decision-making today - defer to best days",
      hydrateNourish: "Hydrate, nourish, be gentle with yourself",
      silenceMeditation: "20 min silence or meditation away from bright light",
      gentleWalk: "Gentle walk in shade (no goals, just presence)",
      journalThoughts: "Journal thoughts without forcing solutions",
      postponeDecisions: "Postpone leadership decisions until tomorrow",
      earlyBedtime: "Early bedtime for solar repair (before 10 PM)",
      byWater: "20 min by water (real or visualized)",
      emotionalRelease: "Gentle emotional release - cry, write, express",
      warmFood: "Nourish with warm, comforting food",
      postponeEmotional: "Postpone emotional conversations",
      extraSleep: "Extra sleep - honor your lunar rhythm",
      gentleMovement: "Very gentle movement only (stretching, slow walk)",
      breathingExercises: "Calm down with breathing exercises",
      noConflicts: "No conflicts or confrontations today",
      postponePhysical: "Postpone physical challenges",
      coolDown: "Cool down with breathing exercises",
      informationFast: "Information fast - limit reading/messages",
      speakLess: "Speak less, listen to silence",
      postponeCommunication: "Postpone important communications",
      simpleTasks: "Simple, single-focus tasks only",
      mentalRest: "Mental rest - no problem-solving",
      scaleBack: "Scale back ambitious plans",
      postponeTeaching: "Postpone teaching or sharing wisdom",
      gratitudePractice: "Gratitude practice for what is",
      restInContentment: "Rest in contentment, not expansion",
      gentleSelfCare: "Gentle self-care (bath, soft music, beauty)",
      noRelationshipDecisions: "No relationship decisions today",
      postponeSocial: "Postpone social gatherings",
      soloTime: "Solo time in pleasant environment",
      appreciateWithout: "Appreciate without acquiring",
      releaseRigidity: "Release rigidity - don't force structure",
      postponePlanning: "Postpone long-term planning",
      letGoShould: "Let go of 'should' thoughts",
      flexibilityExercises: "Gentle flexibility exercises",
      trustPause: "Trust the pause before discipline returns"
    },

    // ============================================================================
    // WEEKLY RESULTS - Complete translations
    // ============================================================================
    weeklyResultsComplete: {
      unableToGenerate: "Unable to generate weekly forecast. Please enter a valid Arabic name.",
      best: "Best",
      gentle: "Gentle",
      focus: "Focus",
      closeDetails: "Close details",
      clickToExpand: "Click to expand",
      peakPerformanceDay: "Peak Performance Day",
      steadyProgressDay: "Steady Progress Day",
      restReflectionDay: "Rest & Reflection Day",
      allForcesAligned: "All forces aligned×excellent flow",
      mixedSignals: "Mixed signals×proceed mindfully",
      challengingEnergies: "Challenging energies×patience needed",
      morning: "🌅 Morning",
      midday: "☀️ Midday",
      afternoon: "🌆 Afternoon",
      evening: "🌙 Evening",
      optimalSequence: "Optimal sequence for",
      timeWindows: "Time Windows",
      energyType: "Energy Type",
      bestFor: "✓ Best for:",
      avoid: "✗ Avoid:",
      planetalPhase: "Planetal Phase",
      peakLeadership: "Peak leadership energy",
      highVisibility: "High visibility",
      delegationPhase: "Delegation phase",
      reflectionTime: "Reflection time",
      emotionalClarity: "Emotional clarity",
      empathyPeak: "Empathy peak",
      creativeFlow: "Creative flow",
      deepRestBegins: "Deep rest begins",
      peakPhysicalEnergy: "Peak physical energy",
      combatMode: "Combat mode",
      sustainedPush: "Sustained push",
      coolDownNeeded: "Cool down needed",
      mentalSharpness: "Mental sharpness",
      communicationPeak: "Communication peak",
      quickConnections: "Quick connections",
      integrationTime: "Integration time",
      expansionBegins: "Expansion begins",
      opportunityWindow: "Opportunity window",
      growthMomentum: "Growth momentum",
      wisdomIntegration: "Wisdom integration",
      beautyAppreciation: "Beauty appreciation",
      relationshipHarmony: "Relationship harmony",
      pleasureTime: "Pleasure time",
      disciplinePeak: "Discipline peak",
      seriousWorkMode: "Serious work mode",
      endurancePhase: "Endurance phase",
      reviewTime: "Review time",
      classicalTeaching: "Classical teaching (Lesson 28):",
      forEverythingTime: "\"Li-kulli shay'in waqtun\"",
      successFromTiming: "(For everything there is a time) × Success comes from right action at the right time."
    },

    // ============================================================================
    // DESTINY RESULTS - Complete translations
    // ============================================================================
    destinyResultsComplete: {
      unableToCalculate: "Unable to calculate destiny. Please enter a name.",
      nameChart: "Name Chart",
      spiritualBlueprint: "Spiritual Blueprint of Your Name",
      totalHadadKabir: "Total (Ḥadad Kabīr)",
      digitalRootSaghir: "Digital Root (Ṣaghīr)",
      elementTabh: "Element (Ṭabʿ)",
      zodiacBurj: "Zodiac Sign (Burj)",
      planetLabel: "Planet",
      dayLabel: "Day",
      hourLabel: "Planetary Hour #",
      hourTooltip: "Nth hour after local sunrise. Order: Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars.",
      elementHarmony: "Element Harmony",
      harmonious: "✨ Harmonious",
      nourishing: "🌱 Nourishing",
      transformative: "⚡ Transformative",
      unified: "💫 Unified",
      elementInheritance: "Element Inheritance",
      expression: "Expression",
      foundation: "Foundation",
      yourExpression: "Your Expression",
      yourFoundation: "Your Foundation",
      quranicResonance: "Quranic Resonance",
      arabicText: "Arabic Text",
      englishTranslation: "English Translation",
      loadingVerse: "Loading Quranic verse...",
      unableToLoadVerse: "Unable to load verse at the moment. Please refresh or visit Quran.com directly.",
      verseReferenceValid: "Verse reference is valid (Surah {surah}:{ayah}), but we're having difficulty retrieving it.",
      readFullVerse: "Read full verse on Quran.com",
      ayahOfTotal: "Ayah {ayah} of {total}",
      noVerseData: "No verse data available for this resonance.",
      grandTotal: "Grand Total",
      element: "Element",
      spiritualOrigin: "Your Spiritual Origin",
      motherElement: "Mother's Name Element (Umm Ḥadad)",
      inheritance: "Inheritance",
      insight: "Insight",
      letterGeometry: "Letter Geometry (Handasa al-Ḥurūf)",
      vertical: "Vertical (ʿAmūdī)",
      round: "Round (Mudawwar)",
      flat: "Flat (Musaṭṭaḥ)",
      angular: "Angular (Zāwiya)",
      noneInYourName: "None in your name",
      letters: "letters",
      geometricProfile: "Your Geometric Profile",
      aspiration: "Aspiration",
      spiritualReach: "Spiritual Reach",
      goals: "Goals",
      growth: "Growth",
      compassion: "Compassion",
      wholeness: "Wholeness",
      cycles: "Cycles",
      embrace: "Embrace",
      stability: "Stability",
      grounding: "Grounding",
      decisiveness: "Decisiveness",
      sharpness: "Sharpness",
      clarity: "Clarity",
      transformation: "Transformation",
      soulTriad: "Your Soul Triad",
      lifeDestiny: "Life Destiny",
      soulUrge: "Soul Urge",
      outerPersonality: "Outer Personality",
      practicalGuidance: "Practical Guidance",
      yourPath: "Your Path",
      yourPathDesc: "Explains what your life direction and energy naturally move toward.",
      spiritualPractice: "Spiritual Practice",
      spiritualPracticeDesc: "Simple daily habits or reflections to balance your element.",
      quranicGuidance: "Quranic Guidance",
      quranicGuidanceDesc: "A verse connected to your name's energy, for reflection only.",
      practicalAction: "Practical Action",
      practicalActionDesc: "Steps you can take in everyday life that align with your destiny.",
      shadowToWatch: "Shadow to Watch",
      shadowToWatchDesc: "Tendencies to be aware of that may hinder your growth.",
      reflectionOnly: "For reflection only × not divination or legal ruling."
    },

    // ============================================================================
    // COMPATIBILITY RESULTS - Complete translations
    // ============================================================================
    compatibilityResultsComplete: {
      unableToCalculate: "Unable to calculate compatibility. Please ensure both names are entered.",
      overallCompatibility: "Overall Compatibility",
      overallHarmonyScore: "Overall Harmony Score",
      threeAnalysisMethods: "Three Analysis Methods",
      spiritualDestiny: "🌙 Spiritual Destiny",
      elementalTemperament: "🌊 Elemental Temperament",
      planetaryCosmic: "⭐ Planetary Cosmic",
      remainder: "Remainder",
      sharedElement: "Element",
      excellent: "EXCELLENT",
      veryGood: "VERY GOOD",
      good: "GOOD",
      moderate: "MODERATE",
      challenging: "CHALLENGING",
      recommendations: "Recommendations",
      strengths: "Strengths",
      growthAreas: "Growth Areas",
      challenges: "Challenges",
      relationship: "Relationship",
      advice: "Advice",
      harmonyScore: "Harmony Score"
    },

    // ============================================================================
    // PLANETARY DESCRIPTIONS - Complete translations
    // ============================================================================
    planetaryDescriptions: {
      Sun: {
        name: "Sun",
        energy: "Leadership & Vitality",
        quality: "Leadership, Authority, Success"
      },
      Moon: {
        name: "Moon",
        energy: "Emotions & Intuition",
        quality: "Emotion, Intuition, Home"
      },
      Mars: {
        name: "Mars",
        energy: "Action & Courage",
        quality: "Action, Courage, Competition"
      },
      Mercury: {
        name: "Mercury",
        energy: "Communication & Learning",
        quality: "Communication, Learning, Commerce"
      },
      Jupiter: {
        name: "Jupiter",
        energy: "Expansion & Wisdom",
        quality: "Expansion, Wisdom, Abundance"
      },
      Venus: {
        name: "Venus",
        energy: "Love & Harmony",
        quality: "Love, Beauty, Harmony"
      },
      Saturn: {
        name: "Saturn",
        energy: "Structure & Discipline",
        quality: "Structure, Discipline, Karma"
      }
    },

    // ============================================================================
    // CLASSICAL WISDOM - Keep original with translations
    // ============================================================================
    classicalWisdom: {
      stillnessBeforeMotion: "Al-sukūn qabl al-ḥaraka",
      stillnessExplanation: "(Stillness before motion brings blessed action)",
      whoPlants: "Man zaraʿa khayran ḥaṣada khayran",
      whoPlantsExplanation: "(Who plants good, harvests good) × The timing of harvest depends on the seed and season.",
      forEverything: "Li-kulli shay'in waqtun",
      forEverythingExplanation: "(For everything there is a time) × Success comes from right action at the right time.",
      whoKnowsDisconnection: "Man ʿarafa infisāl waqtihi, faqad ḥafaẓa ṭāqatahu",
      whoKnowsExplanation: "(Who knows the time of disconnection, preserves his energy)"
    },

    // ============================================================================
    // UI COMPONENTS - Onboarding, Glossary, Controls
    // ============================================================================
    onboarding: {
      welcome: "Welcome to Asrār Everyday! 🌙",
      enterText: "Enter Your Text",
      understanding: "Understanding Your Analysis",
      closeTutorial: "Close tutorial",
      previousStep: "Previous step",
      nextStep: "Next step",
      completeTutorial: "Complete tutorial",
      stepOf: "Step {current} of {total}",
      
      // First-Launch Walkthrough
      skip: "Skip",
      next: "Next",
      back: "Back",
      getStarted: "Get Started",
      signIn: "Sign In",
      signUp: "Create Account",
      continueGuest: "Continue as Guest",
      
      s1: {
        title: "Daily Guidance",
        body: "Discover your favorable window of the day and simple actions to take right now.",
        b1: "Best moment to act on intentions",
        b2: "What to avoid today",
        b3: "Tap cards to reveal deeper details",
      },
      s2: {
        title: "Divine Timing",
        body: "Discover windows of time for reflection, planning, and inner calm.",
        b1: "Day & hourly planetary influence",
        b2: "Supportive vs. challenging periods",
        b3: "For reflection & contemplation only",
      },
      s3: {
        title: "Calculator & Spiritual Profile",
        body: "Explore markers linked to your name: element, temperament, and core meaning.",
        b1: "Kabir & Saghir calculations",
        b2: "Element & quality analysis",
        b3: "Simple, clear explanations",
      },
      s4: {
        title: "Dhikr & Practice",
        body: "Track your sessions, stay consistent, and follow guided method (adab).",
        b1: "Session counter with progress",
        b2: "Recommended method & etiquette",
        b3: "Gentle reminders to stay on track",
      },
      s5: {
        title: "Save & Unlock",
        body: "Create an account to sync across devices. Premium unlocks deep alignment insights.",
        b1: "Cloud sync your spiritual data",
        b2: "Premium: Advanced compatibility",
        b3: "Premium: Personalized guidance",
      },

      final: {
        tagline: "Your path, preserved.",
        title: "Begin Your Journey",
        description: "Create an account to sync your profile and unlock advanced features.",
        createAccount: "Create Account",
        signIn: "Sign In",
        continueGuest: "Continue as Guest",
        guestNote: "Your data stays on this device only.",
        disclaimer: "This app supports reflection and spiritual awareness. It does not replace religious guidance.",
        or: "or",
      },
    },

    glossary: {
      openTitle: "Open Islamic Numerology Glossary",
      closeLabel: "Close glossary",
      searchPlaceholder: "Search terms... (e.g., 'Saghir', 'element', 'destiny')",
      noResults: "No terms found matching",
    },

    controls: {
      closeKeyboard: "Close keyboard",
      closeMenu: "Close menu",
      updateLocation: "Update",
    },

    tooltips: {
      umHadad1: "Um Ḥadad (أم حدد) - Required for complete Name Destiny calculation",
      umHadad2: "Um Ḥadad (أم حدد) - Reveals your Aṣl al-Rūḥānī (spiritual origin)",
    },

    // ============================================================================
    // ACTION BUTTONS & ENERGY DESCRIPTIONS
    // ============================================================================
    energyReturn: {
      fast: "What you give flows back quickly",
      slow: "What you give today takes time to return",
    },

    // ============================================================================
    // ERROR MESSAGES
    // ============================================================================
    errors: {
      analysisError: "Unable to analyze. Please check your input.",
      verseLoadError: "Unable to load verse text. Please try again.",
    },

    // ============================================================================
    // SEO & METADATA
    // ============================================================================
    seo: {
      siteTitle: "Asrār Everyday - ʿIlm al-Ḥurūf & ʿIlm al-ʿAdad Calculator",
      titleTemplate: "%s | Asrār Everyday",
    },

    dailyGuidance: {
      title: "Daily Guidance",
      todaysFlow: "Today's Flow",
      elementHarmony: "Element Harmony",
      dayElement: "Day Element",
      yourElement: "Your Element",
      noElement: "No Element",
      addProfileHint: "Add your birth date to reveal your element",
      lunarMansion: "Lunar Mansion",
      yourMansion: "Your Mansion",
      mansionHint: "Based on your birth date",
      missingDobCta: "Add your birth date to calculate your Lunar Mansion",
      addBirthDate: "Add Birth Date",
      recommendations: "Guidance for Today",
      bestFor: "Better for:",
      avoid: "Avoid for now:",
      peakHours: "Peak Hours",
      reflection: "Quranic Reflection",
      wisdom: "Classical Wisdom",
      wisdomQuote: "Li-kulli shay'in waqtun — For everything there is a time. Success comes from right action at the right moment.",
      wisdomSource: "Classical Islamic Wisdom",
      empty: {
        title: "No Guidance Available",
        message: "Unable to load daily guidance. Please try again.",
      },
      timing: {
        favorable: "Favorable Flow",
        transformative: "Transformative Window",
        delicate: "Delicate Timing",
        neutral: "Neutral Flow",
      },
      relationship: {
        harmonious: "Perfect Harmony — Your element matches today's energy",
        complementary: "Supportive Flow — Your element complements today's energy",
        transformative: "Transformative Dynamic — Opposing energies invite growth",
        neutral: "Balanced State — Neutral energy flow",
      },
      elemental: {
        harmonious: {
          description: "Your {userElement} nature perfectly aligns with today's {dayElement} energy — move with confidence and clarity.",
        },
        supportive: {
          description: "Your {userElement} nature is supported by today's {dayElement} energy — favorable conditions for growth and action.",
        },
        challenging: {
          description: "Your {userElement} nature contrasts with today's {dayElement} energy — practice patience and gentle adaptation.",
        },
        neutral: {
          description: "Your {userElement} nature and today's {dayElement} energy flow neutrally — balanced conditions for steady progress.",
        },
      },
      elements: {
        fire: {
          description: "Dynamic, initiating, outward expression",
        },
        water: {
          description: "Intuitive, receptive, flowing nature",
        },
        air: {
          description: "Intellectual, communicative, clear",
        },
        earth: {
          description: "Stable, grounding, practical",
        },
      },
    },

    divineTimingInsights: {
      header: {
        title: "Insights",
        loading: "Gathering your timeline...",
      },
      loading: {
        message: "Analyzing your patterns...",
      },
      empty: {
        title: "No Data Yet",
        subtitle: "Check in daily to build your personalized insights.",
        cta: "Start Check-In",
      },
      disclaimer: "For reflection only • Not a ruling",
      metrics: {
        checkIns: "check-ins",
        dayStreak: "day streak",
        harmony: "harmony",
      },
      summary: {
        thisWeek: "This Week",
        avgHarmony: "Avg Harmony",
        trend: "Trend",
      },
      trendStates: {
        improving: "Momentum rising",
        declining: "Momentum softening",
        stable: "Holding steady",
        change: "{value}% vs prior period",
      },
      sections: {
        currentAlignment: "Current Alignment",
        patternMap: "Pattern Map",
        patternHint: "Tap a cell to review its harmony and consistency.",
        segments: "Time Segments",
        intentions: "Intention Themes",
        recommendations: "Recommendations",
      },
      patternDetail: {
        title: "{day} • {segment}",
        count: "{count} check-ins recorded",
        empty: "No check-ins recorded yet.",
        placeholder: "Tap a square to view its detail.",
      },
      segments: {
        preDawn: "Pre-dawn",
        morning: "Morning",
        midday: "Midday",
        afternoon: "Afternoon",
        evening: "Evening",
        night: "Night",
      },
      segmentStats: {
        checkins: "{count} check-ins",
        success: "{value}% favorable",
        energy: "{value}% avg energy",
      },
      intentions: {
        summary: "{count} check-ins • Best at: {segments}",
      },
      heatmapLegend: {
        title: "Harmony scale",
        low: "Low",
        medium: "Balanced",
        high: "High",
      },
    },

    // DIVINE TIMING SPIRITUAL COMPONENTS
    divineTiming: {
      // Screen 1: Advanced Timing Analysis - Home/Intro
      home: {
        title: "Advanced Timing Analysis",
        subtitle: "Receive comprehensive guidance by integrating all timing systems: Moment Alignment, Daily Guidance, and Planetary Hours.",
        cards: {
          currentHour: {
            label: "Current Hour",
          },
          dailyEnergy: {
            label: "Daily Energy",
          },
        },
        features: {
          harmonyScore: "Harmony Score (0-100)",
          timeline: "7-Day Optimal Timeline",
          actionSteps: "Practical Action Steps",
        },
        intentions: {
          question: "What is your intention today?",
          newBeginning: "New Beginning",
          journey: "Journey",
          communication: "Communication",
          connection: "Connection",
          learning: "Learning",
          restRecovery: "Rest & Recovery",
          generalReflection: "General Reflection",
        },
        weekdays: {
          sun: "Sun",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat",
        },
        weekdaysLong: {
          sunday: "Sunday",
          monday: "Monday",
          tuesday: "Tuesday",
          wednesday: "Wednesday",
          thursday: "Thursday",
          friday: "Friday",
          saturday: "Saturday",
        },
        cta: "Get Advanced Analysis",
      },
      // Ask Divine Timing (AI Guidance Input)
      askDivineTiming: {
        title: "Ask Divine Timing",
        subtitle: "Receive spiritual reflection for your question",
        questionLabel: "Your Question",
        questionPlaceholder: "e.g., Is it a good time to start my exam preparation?",
        category: "Category *",
        timeFrame: "Time Frame",
        urgency: "Urgency",
        charCount: "{count}/200",
        categories: {
          study_exam: "Study / Exam",
          work_career: "Work / Career",
          money_business: "Money / Business",
          travel: "Travel",
          relationships_family: "Relationships / Family",
          health_wellbeing: "Health / Wellbeing",
          spiritual_practice: "Spiritual Practice",
          decisions_general: "Decisions / General",
        },
        timeFrameOptions: {
          today: "Today",
          this_week: "This Week",
          this_month: "This Month",
        },
        urgencyOptions: {
          low: "Low",
          medium: "Medium",
          high: "High",
        },
        actions: {
          getGuidance: "Get Guidance",
          reflectDifferent: "Reflect on Different Intention",
        },
        errors: {
          enterQuestion: "Please enter your question",
          selectCategory: "Please select a category",
          tooLong: "Question must be 200 characters or less",
        },
      },
      // Results Screens - All tabs and data translations
      results: {
        // Header
        header: {
          intentToday: "Your intention today:",
        },
        // Section titles
        section: {
          divineTiming: "Divine Timing",
          currentMomentAnalysis: "Current Moment Analysis",
          practicalSteps: "Practical Steps",
          bestTimeNext24h: "Best Time in Next 24 Hours",
          sevenDayOutlook: "7-Day Outlook",
        },
        // Field labels
        labels: {
          timingQuality: "Timing Quality",
          cycleState: "Cycle State",
          elementalTone: "Elemental Tone",
          reflectiveGuidance: "Reflective Guidance",
          harmony: "Harmony",
          hourlyStatus: "Hourly Status",
          planetaryHour: "Planetary Hour",
          dailyQuality: "Daily Quality",
        },
        // Timing quality values
        qualities: {
          favorable: "Favorable",
          neutral: "Neutral",
          delicate: "Delicate",
          mixed: "Mixed",
          challenging: "Challenging",
        },
        // Cycle states
        states: {
          completion_closure: "Completion / Closure",
          initiation: "Initiation",
          growth_expansion: "Growth / Expansion",
          review_restraint: "Review / Restraint",
        },
        // Guidance levels
        guidanceLevels: {
          act: "→ Engage mindfully",
          slow: "⊙ Proceed deliberately",
          observe: "◐ Reflect before acting",
        },
        // Alert/Recommendation levels
        alerts: {
          proceedWithCaution: "Proceed with Caution",
          proceedConfidently: "Proceed Confidently",
          highlyFavorable: "Highly Favorable Time",
          actNow: "Good Time to Act",
          waitForBetterTime: "Consider Waiting",
        },
        // Guidance messages (from DivineTimingService)
        guidance: {
          // Quality-based messages
          supportive_reflection: "Conditions appear supportive for reflection and considered action.",
          energy_flows_align: "The energy flows align well for mindful engagement.",
          mindful_participation: "A good moment for mindful participation with what's before you.",
          conditions_neutral: "Conditions are neutral—good for routine activities.",
          steady_as_you_go: "Steady-as-you-go energy—neither pushing nor resisting.",
          balanced_window: "A balanced window for everyday tasks.",
          timing_feels_delicate: "Timing feels delicate—proceed gently if you must.",
          consider_pausing: "This may be a time to pause and observe.",
          quiet_reflection: "Better suited for quiet reflection than decisive action.",
        },
        // Cycle state descriptions
        cycles: {
          ongoing_efforts: "Ongoing efforts may be nurtured.",
          current_projects: "Current projects can progress steadily.",
          gentle_continuation: "A time for gentle continuation.",
          new_beginnings: "New beginnings may take root.",
          fresh_initiatives: "Fresh initiatives can be explored.",
          planting_seeds: "Consider this a time for planting seeds.",
          winding_down: "Things may be winding down naturally.",
          completion_near: "Completion or closure may be near.",
          finishing_touches: "A time for finishing touches, not new starts.",
          watchful_waiting: "Watchful waiting is advised.",
          careful_review: "Careful review before moving forward.",
          patience_serves: "Patience serves you now.",
        },
        // Practical Steps (from AdvancedDivineTimingService)
        steps: {
          // Highly favorable
          exceptionally_aligned: "✨ Conditions are exceptionally aligned - this is an optimal time to act",
          act_within_2_hours: "Make your decision/move within the next 2 hours while alignment is strong",
          combine_prayer_trust: "Combine with prayer (duʿāʾ) and trust in divine wisdom",
          // Act now
          timing_favorable: "✓ Current timing is favorable for your intention",
          proceed_confident_mindful: "Proceed with confidence but remain mindful",
          track_unfold: "Keep track of how things unfold for future reference",
          // Proceed with caution
          mixed_proceed_care: "⚠ Timing is mixed - proceed if necessary but with extra care",
          wait_if_not_urgent: "Consider waiting for a better window if not urgent",
          increase_prayers_istikharah: "Increase prayers and istikhārah for guidance",
          // Wait for better time
          consider_delaying: "⏸ Consider delaying if possible",
          review_timeline: "Review the timeline for upcoming optimal windows",
          planning_preparation: "Use this time for planning and preparation",
          // Intention-specific
          document_decision_process: "Document your decision-making process for future reflection",
          double_check_arrangements: "Double-check all arrangements and have backup plans",
          prepare_words_carefully: "Prepare your words carefully and choose the right medium",
          approach_empathy_patience: "Approach with empathy and patience",
          structured_study_schedule: "Create a structured study schedule and quiet environment",
          handle_obligations_first: "Ensure all obligations are handled before taking time off",
          reflect_seek_counsel: "Reflect on your specific situation and seek qualified counsel",
        },
        // Quran Reflection
        quranReflection: {
          title: "Quran Reflection",
          mode: {
            auto: "Auto",
            manual: "Manual",
          },
          prompt: "Read this verse slowly. What word resonates with you today?",
          readOnQuran: "Read on Quran.com",
          forContemplation: "For contemplation only",
          hideTranslation: "Hide Translation",
          disclaimer: "This verse is presented for reflection only. For strict interpretations and religious guidance, consult qualified scholars.",
        },
        // Reflection Prompts (from QuranReflectionService)
        reflectionPrompts: {
          // Favorable prompts
          read_verse_slowly_resonate: "Read this verse slowly. What word resonates with you today?",
          clarity_mindful_action: "Reflect on how this verse speaks to clarity and mindful action.",
          wisdom_current_path: "Consider what wisdom this verse offers for your current path.",
          // Neutral prompts
          invite_consider_today: "What does this verse invite you to consider today?",
          balance_patience_observation: "Reflect on balance, patience, and attentive observation.",
          notice_draws_attention: "Notice which part of this verse draws your attention.",
          // Delicate prompts
          read_patience_comfort: "Read this verse with patience. What comfort does it offer?",
          trust_stillness_contemplation: "Reflect on trust, stillness, and careful contemplation.",
          wisdom_in_waiting: "Consider how this verse speaks to wisdom in waiting.",
        },
        // AI Guidance
        aiGuidance: {
          title: "AI-Powered Spiritual Guidance",
          badge: "AI",
          description: "Get personalized guidance based on your Abjad profile and current timing",
          cta: "Ask AI Guidance",
          changeIntention: "Change intention",
        },
        aiGuidanceCard: {
          header: "AI-Powered Guidance",
          verdict: {
            highlyFavorable: "HIGHLY FAVORABLE",
            favorable: "FAVORABLE",
            mixed: "MIXED CONDITIONS",
            unfavorable: "PROCEED WITH CAUTION",
          },
          sections: {
            summary: "Summary",
            contextualInsight: "Contextual Insight",
            spiritualAlignment: "Spiritual Alignment",
            personalizedSteps: "Recommended Steps",
            optimalTiming: "Optimal Timing",
            abjadWisdom: "Abjad Wisdom",
          },
          fields: {
            harmonyScore: "Harmony Score",
            zahir: "Ẓāhir (Outward)",
            batin: "Bāṭin (Inward)",
            bestTime: "Best Time",
            nextOptimal: "Next Optimal",
            avoid: "Consider Avoiding",
            today: "Today",
            thisWeek: "This Week",
            thisMonth: "This Month",
          },
          actions: {
            askAnother: "Ask Another Question",
            seeMore: "See More",
          },
        },
        // CTA buttons
        cta: {
          reflectDifferentIntention: "Reflect on Different Intention",
        },
        // Disclaimer
        disclaimer: "This guidance is for spiritual reflection only and does not replace prayer, istikhārah, or qualified religious advice.",
      },
      spiritualDepth: {
        divineName: "Divine Name",
        quranicVerse: "Quranic Verse",
        spiritualSignificance: "Spiritual Significance",
        relatedNames: "Related Names",
        recommendedRecitation: "Recommended recitation",
        reflectionPrompt: "Reflection",
        beginDhikr: "Begin Dhikr",
        relevanceToThisHour: "Relevance to this hour",
        inTheNameOfAllah: "In the name of Allah, the Most Gracious, the Most Merciful",
      },
      disclaimer: {
        importantNotice: "Important Notice",
        pleaseReadCarefully: "Please read carefully before using the Divine Timing module",
        natureOfThisTool: "Nature of This Tool",
        toolDescription: "This tool provides spiritual reflection and timing guidance based on classical Islamic traditions of planetary hours (Sāʿāt al-Falakiyya / الساعات الفلكية). It is a guide for spiritual timing optimization and personal reflection.",
        essentialPoints: "Essential Points to Understand",
        notDivination: "This is NOT Divination",
        notDivinationText: "This tool does NOT predict the future or guarantee outcomes. Fortune-telling (kāhana / كهانة) is prohibited in Islam. We only offer timing suggestions based on traditional wisdom.",
        freeWillAndQadr: "Free Will and Qadr",
        freeWillText: "Your free will (ikhtiyār / اختيار) and choices remain yours. All outcomes are determined by Allah alone (Qadr / قدر). Use this wisdom as a reflection tool, not as a replacement for your judgment.",
        notLegalGuidance: "Not Islamic Legal Guidance",
        notLegalGuidanceText: "This tool is NOT a fatwa (فتوى) or Islamic legal ruling. For religious questions, consult qualified scholars. For important decisions, seek professional advice.",
        recommendedUse: "Recommended Use",
        recommendedUseText: "Use this tool for: timing optimization of actions, spiritual reflection, understanding natural cycles, and enriching your spiritual practice. Always combine with prayer (duʿāʾ / دعاء), practical wisdom (ḥikma / حكمة), and personal effort (ijtihād).",
        classicalSources: "Classical Sources",
        classicalSourcesText: "Planetary hour calculations are based on classical Islamic traditions (ʿIlm al-Ḥurūf, Shams al-Maʿārif, etc.). Spiritual connections with Divine Names and Quranic verses are presented for reflection and spiritual enrichment, not as mandatory prescriptions.",
        knowledgeOfUnseen: "The knowledge of the unseen belongs to Allah alone",
        quranReference: "Quran 10:20",
        iHaveReadAndUnderstand: "I have read and understand - Continue",
        byContinuingYouAgree: "By continuing, you agree to use this tool as a guide for reflection, not as a source of absolute authority.",
      },
      // PHASE 2: Prayer Times, Lunar Mansions, Alignment
      prayerTimes: {
        prayerTimes: "Prayer Times",
        currentPeriod: "Current Period",
        nextPrayer: "Next Prayer",
        in: "in",
        betweenPrayers: "Between Prayers",
        planetarySynergy: "Planetary Synergy",
        viewAll: "View All",
        hide: "Hide",
        now: "Now",
        next: "Next",
        calculationsBasedOn: "Calculations based on",
        yourLocation: "your location",
        specialPrayerTime: "Special Prayer Time",
      },
      lunarMansion: {
        lunarMansion: "Lunar Mansion",
        moonPhase: "Moon Phase",
        element: "Element",
        planetaryRuler: "Planetary Ruler",
        divineQuality: "Divine Quality",
        spiritualFocus: "Spiritual Focus",
        lunarPlanetarySynergy: "Lunar-Planetary Synergy",
        hideDetails: "Hide Details",
        viewActivitiesWisdom: "View Activities & Wisdom",
        favorableFor: "Favorable For",
        unfavorableFor: "Unfavorable For",
        classicalWisdom: "Classical Wisdom",
        constellation: "Constellation",
        calculatingLunarMansion: "Calculating lunar mansion...",
      },
      alignment: {
        personalAlignment: "Personal Alignment",
        alignmentBreakdown: "Alignment Breakdown",
        elementalHarmony: "Elemental Harmony",
        planetaryResonance: "Planetary Resonance",
        numericalAlignment: "Numerical Alignment",
        sacredConnection: "Sacred Connection",
        recommendations: "Recommendations",
        yourBestHoursToday: "Your Best Hours Today",
        planetaryHour: "Planetary hour",
        basedOnSpiritualEssence: "Based on your spiritual essence and planetary energies",
      },
      // PHASE 3: Educational Content
      education: {
        learningCenter: "Learning Center",
        planetGuides: "Planet Guides",
        glossary: "Glossary",
        energyFlow: "Energy Flow",
        selectPlanet: "Select Planet",
        overview: "Overview",
        spiritualWisdom: "Spiritual Wisdom",
        practicalGuide: "Practical Guide",
        classicalSources: "Classical Sources",
        primaryDivineName: "Primary Divine Name",
        relatedDivineNames: "Related Divine Names",
        islamicHistoricalContext: "Islamic Historical Context",
        spiritualQualities: "Spiritual Qualities",
        relatedSpiritualConcepts: "Related Spiritual Concepts",
        spiritualExamples: "Spiritual Examples",
        favorableActivities: "Favorable Activities",
        activitiesToAvoid: "Activities to Avoid",
        classicalTeachings: "Classical Teachings",
        position: "Position",
        recommendedDhikr: "Recommended Dhikr",
        source: "Source",
        energyFlowChart: "Daily Energy Flow",
        currentHour: "Current Hour",
        excellentHours: "Excellent Hours",
        goodHours: "Good Hours",
        challengingHours: "Challenging Hours",
        harmonyScore: "Harmony Score",
        introduction: "Introduction",
        islamicContext: "Islamic Context",
        howItWorks: "How It Works",
        faq: "FAQ",
        comprehensiveGuide: "Comprehensive guide to planetary hours in Islamic tradition",
        searchTerms: "Search terms",
        showingTerms: "Showing",
        terms: "terms",
        allTerms: "All Terms",
        planets: "Planets",
        elements: "Elements",
        divineNames: "Divine Names",
        concepts: "Concepts",
        practices: "Practices",
        related: "Related",
        noTermsFound: "No terms found matching your search",
        element: "Element",
        day: "Day",
        metal: "Metal",
      },
    },

    // ============================================================================
    // MOTHER'S NAME STRATEGY - Name Destiny Dual-Mode System
    // ============================================================================
    mothersNameStrategy: {
      // Name Destiny Mode Selector
      modeSelector: {
        title: "Choose Your Reading Type",
        generalMode: {
          title: "Explore a Name",
          icon: "📖",
          description: "Discover the spiritual meaning and general characteristics of any name",
          bestFor: "Best for: Learning about names, cultural exploration, general insights",
        },
        personalMode: {
          title: "My Personal Reading",
          icon: "✨",
          description: "Get YOUR unique spiritual profile - personalized to your exact soul blueprint",
          bestFor: "Best for: Self-discovery, spiritual guidance, personal transformation",
          recommended: "⭐ Recommended",
        },
        whyPersonalBetter: "Why personal is better:",
        reason1: "Your exact spiritual blueprint (not just general traits)",
        reason2: "Unique to YOU (not anyone else with your name)",
        reason3: "More accurate guidance and insights",
      },

      // Name Destiny Input Forms
      nameInput: {
        generalModeHeader: "General Name Exploration",
        generalModeSubtitle: "Exploring name meaning only - not personalized to you",
        personalModeHeader: "Personal Spiritual Profile",
        personalModeSubtitle: "Your unique reading - requires mother's name",
        switchToPersonal: "Switch to Personal Reading",
        switchToGeneral: "Switch to General Exploration",
        motherNameRequired: "Mother's Name (Required for Personal Reading)",
        motherNameOptional: "Mother's Name (Optional)",
        whyRequired: "Why is mother's name required?",
        learnMore: "Learn More",
      },

      // General Results with Upgrade CTA
      generalResults: {
        modeLabel: "📖 General Name Exploration",
        limitedInsight: "Limited Insight - General characteristics only",
        upgradePrompt: "Want YOUR unique spiritual profile?",
        upgradeButton: "✨ Get My Personal Reading",
        upgradeBenefits: "Personal reading includes:",
        benefit1: "Your exact spiritual blueprint (Aṣl al-Rūḥānī)",
        benefit2: "Personalized guidance unique to YOU",
        benefit3: "Deeper insights into your soul's journey",
        generalOnly: "This is a general analysis for the name '{name}' - not specific to you.",
      },

      // Personal Results Emphasis
      personalResults: {
        modeLabel: "✨ Personal Spiritual Profile",
        uniqueToYou: "Unique to YOU - Not anyone else with your name",
        yourExactBlueprint: "Your Exact Spiritual Blueprint",
        calculatedFrom: "Calculated from: {name} + {motherName}",
        thisIsYours: "This reading is unique to your soul - no one else will have this exact profile.",
      },

      // Life Path Module - Required Mother's Name
      lifePath: {
        motherNameRequired: "Mother's Name (Required)",
        whyRequired: "Why is mother's name required?",
        explanation: "Life Path is personal to YOU",
        detailedExplanation: "Your Life Path is not just about your name - it's about YOUR unique journey through life. Your mother's name ensures this reading reflects your specific spiritual blueprint, not just a general pattern for everyone with your name.",
        cannotSubmit: "Please enter your mother's name to continue",
        validationError: "Mother's name is required for Life Path calculation",
      },

      // Divine Timing Module - Required Mother's Name
      divineTiming: {
        motherNameRequired: "Mother's Name (Required)",
        whyRequired: "Why is mother's name required?",
        explanation: "Divine Timing is calculated for YOUR specific planetary influences",
        detailedExplanation: "Planetary hours affect each person differently based on their unique spiritual signature. Your mother's name personalizes these calculations to your exact soul blueprint, ensuring the timing guidance is accurate for YOU specifically.",
        cannotSubmit: "Please enter your mother's name to continue",
        validationError: "Mother's name is required for Divine Timing calculation",
      },

      // Educational Modal - Mother's Name Explanation
      explanation: {
        title: "Why Mother's Name Matters",
        subtitle: "The spiritual principle behind personalized readings",
        
        section1: {
          title: "The Principle: Your Unique Soul Blueprint",
          text: "In the Senegalese tradition of ʿIlm al-Ḥurūf, your full spiritual identity (Aṣl al-Rūḥānī) is formed from your name + your mother's name. This creates a unique numerical and elemental signature that is yours alone.",
        },

        section2: {
          title: "Why This Matters",
          point1: {
            title: "Without mother's name:",
            text: "You get general characteristics of the name 'Muhammad' - shared by millions of people",
          },
          point2: {
            title: "With mother's name:",
            text: "You get YOUR unique profile - Muhammad + Fatima = different from Muhammad + Aisha",
          },
        },

        section3: {
          title: "Example: Two People Named Muhammad",
          person1: "Muhammad (mother: Fatima) = Numerical value X → Fire-dominant → Unique spiritual path A",
          person2: "Muhammad (mother: Khadija) = Numerical value Y → Water-dominant → Different spiritual path B",
          conclusion: "Same name, different mothers = completely different spiritual blueprints",
        },

        section4: {
          title: "Privacy & Respect",
          point1: "Your mother's name is never stored or shared",
          point2: "Calculations happen instantly in your browser only",
          point3: "We honor the sacred trust of your mother's name (um ḥadad / أم حدد)",
        },

        section5: {
          title: "When to Use Each Mode",
          generalMode: {
            title: "General Mode (Name Only):",
            use1: "Exploring baby names or name meanings",
            use2: "Cultural or historical research",
            use3: "Learning about name patterns",
          },
          personalMode: {
            title: "Personal Mode (Name + Mother's Name):",
            use1: "YOUR spiritual guidance",
            use2: "Life decisions and timing",
            use3: "Deep self-discovery work",
          },
        },

        closeButton: "I Understand",
      },

      // Auto-upgrade Logic
      autoUpgrade: {
        detected: "Mother's name detected - upgrading to Personal Reading",
        switchingMode: "Switching to Personal mode for accurate results",
      },
    },

    // ============================================================================
    // ISTIKHARA MODULE - Istikharah al-Asmā' (الاستخارة بالأسماء)
    // ============================================================================
    istikhara: {
      // Main panel
      title: "Istikharah al-Asmā'",
      titleArabic: "الاستخارة بالأسماء",
      subtitle: "Spiritual Guidance Through Names",
      formInstruction: "Enter two names to receive spiritual guidance",
      description: "Seek divine guidance by examining the spiritual connection between two names using the sacred science of ʿIlm al-Ḥurūf.",
      
      // Collapsible sections
      educationTitle: "What is Ilm al-Ḥurūf?",
      educationText: "Ilm al-Ḥurūf (Science of Letters) is an ancient Islamic mystical tradition that explores the spiritual significance of Arabic letters and their numerical values. This sacred science has been practiced for centuries by scholars and Sufis to gain deeper insights into personality, destiny, and spiritual alignment.",
      discoveryTitle: "What You'll Discover",
      examplesTitle: "Example Names",
      examplesText: "For accurate results, names should be in Arabic script. Examples:\n\n• محمد (Muhammad)\n• علي (Ali)\n• فاطمة (Fatima)\n• عائشة (Aisha)\n• حسن (Hassan)",
      privacyTitle: "Your Privacy",
      privacyText: "🔒 Your data is never stored or shared. All calculations happen instantly and are discarded after your session. We respect your privacy and spiritual journey.",
      arabicName: "Arabic Name",
      helperText: "Names should be in Arabic script for accurate results",
      
      // Latin search
      latinSearch: {
        label: "Search by Latin Name",
        placeholder: "e.g., Muhammad, Fatima, Ibrahim",
        suggestionsHint: "Database-backed suggestions as you type",
      },
      
      // Discovery items
      discovery: {
        element: {
          title: "Your Element",
          desc: "Fire, Earth, Air, or Water based on your numerical signature",
        },
        personality: {
          title: "Personality Traits",
          desc: "Deep insights into temperament and character",
        },
        career: {
          title: "Career Guidance",
          desc: "Professional paths aligned with your spiritual nature",
        },
        powerDay: {
          title: "Your Power Day",
          desc: "The most auspicious day for important decisions",
        },
        spiritual: {
          title: "Spiritual Practices",
          desc: "Personalized dhikr, charity guidance, and sacred offerings",
        },
      },
      
      // Validation
      validation: {
        missingNames: "Please enter both names to continue",
        nameRequired: "Name is required",
      },
      
      // Form section
      form: {
        title: "Enter Names for Guidance",
        personName: "Person's Name",
        personNamePlaceholder: "e.g., Muhammad, Fatima, Ibrahim",
        motherName: "Mother's Name",
        motherNamePlaceholder: "e.g., Khadija, Aisha, Maryam",
        latinName: "Latin Name",
        latinNamePlaceholder: "e.g., Muhammad, Fatima, Aisha",
        latinNameHint: "Type your name in Latin letters — we'll show the Arabic equivalent",
        calculateButton: "Seek Guidance",
        clearButton: "Clear",
        validationError: "Please enter both names to continue",
        bothNamesRequired: "Both names are required for accurate guidance",
        arabicRequiredNote: "Names should be in Arabic script for accurate results",
      },
      
      // Results section
      results: {
        title: "Your Spiritual Guidance",
        calculatedFor: "Guidance for {person} (mother: {mother})",
        burujRemainder: "Buruj Remainder",
        element: "Dominant Element",
        exportError: "Failed to export results as PDF",
        
        // Tab navigation
        tabs: {
          overview: "Overview",
          personality: "Personality",
          career: "Career Guidance",
          blessedDay: "Blessed Day",
          spiritual: "Spiritual Practice",
        },
      },
      
      // Overview Tab
      overview: {
        intermediate: "Intermediate",
        calculation: "Calculation",
        element: "Element",
        modality: "Modality",
        planetaryRuler: "Planetary Ruler",
        temperament: "Temperament",
        symbolism: "Symbolism",
        spiritualQuality: "Spiritual Quality",
        classicalReference: "Classical Reference",
        classicalReferenceSource: "Al-Bīrūnī - Al-Qānūn al-Masʿūdī",
        elementColors: "Element & Colors",
        yourElement: "Your Element",
        elementOf: "Element {number} of 4",
        associatedColors: "Associated Colors",
        fireDesc: "🔥 Fire represents passion, transformation, and spiritual illumination",
        earthDesc: "🌍 Earth represents stability, manifestation, and grounded wisdom",
        airDesc: "💨 Air represents intellect, communication, and spiritual elevation",
        waterDesc: "💧 Water represents emotion, purification, and divine flow",
        abjadNumerology: "Abjad Numerology",
        abjadDesc: "The sacred science of ʿIlm al-Ḥurūf (علم الحروف) - calculating spiritual values from Arabic letters",
        personNameTotal: "Person's Name Total",
        motherNameTotal: "Mother's Name Total",
        combinedTotal: "Combined Total",
        burujCalculation: "Buruj Remainder Calculation",
        divineNamesDhikr: "Divine Names Dhikr",
        dhikrDesc: "Recommended recitation count based on your Abjad calculation",
        recitationCount: "Recitation Count",
        personalized: "Personalized",
        repetitions: "repetitions",
        practiceTips: "Practice Tips",
        tip1: "Recite after Fajr or Maghrib prayer",
        tip2: "Maintain state of wudu (ablution)",
        tip3: "Focus on intention and presence",
        spiritualNote: "Each recitation carries the barakah (blessing) of your unique spiritual signature",
        // New guided UX translations
        spiritualPattern: "Spiritual Pattern",
        spiritualIndicators: "Spiritual Indicators",
        ruler: "Ruler",
        quality: "Quality",
        spiritualGuidance: "Spiritual Guidance",
        reciteNames: "Recite Divine Names",
        times: "times for spiritual alignment",
        embraceElement: "Embrace",
        qualities: "qualities through mindful presence",
        contemplate: "Contemplate",
        wisdom: "wisdom in moments of decision",
        showDetails: "Show Spiritual Details",
        hideDetails: "Hide Spiritual Details",
        abjadCalculations: "Abjad Calculations",
      },
      
      // Personality Profile
      personality: {
        title: "Personality Profile",
        subtitle: "Character Traits & Temperament",
        coreTraits: "Core Traits",
        strengths: "Strengths",
        challenges: "Challenges",
        guidance: "Spiritual Guidance",
        elementalInfluence: "Elemental Influence",
        colors: "Harmonious Colors",
      },
      
      // Career Guidance
      career: {
        title: "Career & Vocation Guidance",
        subtitle: "Paths Aligned with Your Spiritual Nature",
        idealFields: "Ideal Career Fields",
        workStyle: "Work Style",
        bestEnvironments: "Best Environments",
        leadershipStyle: "Leadership Approach",
        collaboration: "Collaboration Style",
        avoidCareers: "Careers to Approach with Caution",
      },
      
      // Blessed Day
      blessedDay: {
        title: "Your Blessed Day",
        subtitle: "Optimal Day for Important Actions",
        primaryDay: "Primary Blessed Day",
        planetaryRuler: "Planetary Ruler",
        bestActivities: "Best Activities for This Day",
        spiritualPractices: "Recommended Spiritual Practices",
        timing: "Optimal Timing",
        morningBlessings: "Morning (after Fajr)",
        middayBlessings: "Midday (Ẓuhr to ʿAṣr)",
        eveningBlessings: "Evening (after Maghrib)",
      },
      
      // Spiritual Practice
      spiritual: {
        title: "Spiritual Practice & Growth",
        subtitle: "Practices to Strengthen Your Connection",
        recommendedSadaqah: "Recommended Sadaqah",
        sadaqahType: "Type of Charity",
        sadaqahBenefit: "Spiritual Benefit",
        sadaqahTiming: "Best Timing",
        dhikrPractice: "Recommended Dhikr",
        dhikrName: "Divine Name",
        dhikrCount: "Suggested Count",
        dhikrTime: "Best Time",
        dhikrBenefit: "Benefit",
        dailyPractice: "Daily Practice",
        weeklyPractice: "Weekly Practice",
        monthlyPractice: "Monthly Practice",
      },
      
      // Element descriptions (English)
      elements: {
        fire: {
          name: "Fire",
          nameArabic: "النار (al-Nār)",
          quality: "Passionate, Dynamic, Transformative",
          description: "Fire energy brings boldness, creativity, and transformative power. Those with Fire dominance are natural leaders who inspire change.",
        },
        earth: {
          name: "Earth",
          nameArabic: "الأرض (al-Arḍ)",
          quality: "Stable, Practical, Grounded",
          description: "Earth energy brings stability, reliability, and practical wisdom. Those with Earth dominance build lasting foundations.",
        },
        air: {
          name: "Air",
          nameArabic: "الهواء (al-Hawāʾ)",
          quality: "Intellectual, Communicative, Adaptable",
          description: "Air energy brings clarity, communication, and intellectual power. Those with Air dominance excel in knowledge and connection.",
        },
        water: {
          name: "Water",
          nameArabic: "الماء (al-Māʾ)",
          quality: "Emotional, Intuitive, Flowing",
          description: "Water energy brings empathy, intuition, and emotional depth. Those with Water dominance heal and nurture naturally.",
        },
      },
      
      // UI elements
      ui: {
        loading: "Calculating spiritual guidance...",
        error: "Unable to calculate guidance. Please check the names and try again.",
        backToForm: "Enter New Names",
        printResults: "Print Guidance",
        shareResults: "Share",
        expandAll: "Expand All Sections",
        collapseAll: "Collapse All Sections",
      },
      
      // Educational footer
      education: {
        title: "About Istikharah al-Asmā'",
        whatIsIt: "What is it?",
        whatIsItText: "Istikharah al-Asmā' (الاستخارة بالأسماء) is a traditional Islamic practice that seeks divine guidance by analyzing the spiritual resonance between names using ʿIlm al-Ḥurūf (Science of Letters).",
        howItWorks: "How does it work?",
        howItWorksText: "By calculating the Abjad values of both names and applying the Buruj system (12 remainders mapped to 4 elements), we reveal the spiritual temperament and divine guidance specific to this connection.",
        isItPermissible: "Is it permissible?",
        isItPermissibleText: "This practice is rooted in West African Islamic scholarly tradition, particularly Senegalese ʿIlm al-Ḥurūf. It is used for reflection and guidance, not fortune-telling. Always combine with prayer (duʿāʾ) and consult qualified scholars for important decisions.",
      },
      
      // Disclaimer
      disclaimer: {
        title: "Important Notice",
        text: "This tool provides spiritual reflection based on traditional Islamic sciences. It is NOT fortune-telling (kāhana), which is prohibited. Use it as a guide for self-reflection, always combined with prayer (duʿāʾ), practical wisdom (ḥikma), and consultation with qualified scholars. All outcomes are determined by Allah alone (Qadr).",
      },

      // Onboarding
      onboarding: {
        // Progress indicator
        stepOf: "Your Journey — {current} / {total}",

        skip: "Skip",
        next: "Next",
        back: "Back",
        getStarted: "Get Started",
        signIn: "Sign In",
        signUp: "Sign Up",
        continueGuest: "Continue as Guest",
        
        s1: {
          tagline: "One clear window for today.",
          credibility: "Designed for reflection, not prediction.",
          title: "Daily Guidance",
          body: "See today's supportive window and simple actions you can do now.",
          b1: "Best time to focus",
          b2: "What to avoid",
          b3: "Tap to see details",
        },
        s2: {
          tagline: "Sacred hours, not random time.",
          credibility: "Based on sacred time principles and planetary hour systems.",
          title: "Divine Timing",
          body: "Discover time windows aligned for reflection, planning, and calm work.",
          b1: "Day & hour influences",
          b2: "Supportive vs. challenging",
          b3: "For reflection only",
        },
        s3: {
          tagline: "Your name carries a structure.",
          credibility: "Inspired by traditional letter-number correspondences (Abjad).",
          title: "Calculator & Spiritual Profile",
          body: "Explore name-based insights: element, temperament, and core meaning.",
          b1: "Kabir & Saghir",
          b2: "Element & quality",
          b3: "Simple explanations",
        },
        s4: {
          tagline: "Consistency before intensity.",
          credibility: "Built upon adab, presence, and continuity.",
          title: "Zikr Practice",
          body: "Track your sessions, stay consistent, and follow guided etiquette (adab).",
          b1: "Session counter",
          b2: "Suggested method",
          b3: "Gentle reminders",
        },
        s5: {
          tagline: "Your path, preserved.",
          credibility: "Your data stays private and secure.",
          title: "Save & Unlock",
          body: "Create an account to sync progress. Premium unlocks deeper alignment features.",
          b1: "Cloud sync",
          b2: "Premium insights",
          b3: "Continue as guest anytime",
        },

        // Final Screen (Save & Unlock)
        final: {
          tagline: "Your path, preserved.",
          title: "Save & Unlock",
          description: "Sync your spiritual profile and unlock deeper tools when ready.",
          createAccount: "Create Account",
          signIn: "Sign In",
          continueGuest: "Continue as Guest",
          guestNote: "Your data stays on this device.",
          premium: {
            title: "Advanced Spiritual Tools",
            item1: "Compatibility & relationship resonance",
            item2: "Guided Istikhara & spiritual inquiry",
            item3: "Divine Name alignment & intentions",
            subtext: "Available for members seeking deeper exploration.",
          },
          disclaimer: "This app supports reflection and spiritual awareness. It does not replace religious guidance or professional advice.",
          or: "or",
        },
      },
    },
  },

  fr: {
    nav: {
      home: "Accueil",
      calculator: "Calculatrice",
      letterCalculator: "Calculatrice de Lettres",
      compatibility: "Compatibilité",
      planetaryHours: "Heures Planétaires",
      about: "À Propos",
      guidance: "Guide de Vie",
      advanced: "Istikharah",
      menu: "Menu",
    },

    drawer: {
      profileSettings: "PROFIL & PARAMÈTRES",
      myProfile: "Mon Profil",
      aiSettings: "Paramètres IA",
      tools: "OUTILS",
      abjadCalculator: "Calculatrice Abjad",
      nameDestiny: "Destinée des Noms",
      compatibility: "Compatibilité",
      istikhara: "Istikharah",
      divineTiming: "Moment Divin",
      app: "APPLICATION",
      about: "À Propos d'Asrār",
      helpTutorial: "Aide & Tutoriel",
      language: "LANGUE",
      langEnglish: "English",
      langFrench: "Français",
      langArabic: "العربية",
      guestMode: "Mode Invité",
      guestUser: "Utilisateur Invité",
      levelGuest: "INVITÉ",
      levelBasic: "BASIQUE",
      levelEnhanced: "AMÉLIORÉ",
      levelFull: "COMPLET",
    },
    
    // Modules de la Page d'Accueil
    modules: {
      calculator: {
        title: "Calculatrice",
        description: "Calculs numériques Abjad avancés et analyse des lettres",
      },
      nameDestiny: {
        title: "Destinée des Noms",
        description: "Découvrez la signification spirituelle et le destin encodés dans les noms",
      },
      istikhara: {
        title: "Istikharah",
        description: "Consultation spirituelle combinant guidance de prière et numérologie",
      },
      guidedIstikhara: {
        title: "Istikharah Guidée",
        description: "Apprenez la méthode authentique de prière et suivez vos décisions spirituelles",
        // Common navigation
        common: {
          back: "Retour",
        },
        // Step labels
        steps: {
          intro: "Intro",
          prepare: "Préparation",
          prayer: "Prière",
          dua: "Doua",
        },
        // Home/Landing Screen
        home: {
          title: "Ṣalāt al-Istikhārah",
          subtitle: "La Prière de Demande de Guidance - une pratique Sunnah pour solliciter la guidance d'Allah lors de décisions importantes",
          hadith: {
            text: "\"Lorsque l'un d'entre vous s'inquiète d'une affaire, qu'il prie deux rak'ahs...\"",
            source: "— Sahih al-Bukhari 1162",
          },
          learnTitle: "📖 APPRENDRE LA MÉTHODE AUTHENTIQUE",
          guide: {
            title: "Guide Complet de Prière",
            subtitle: "Instructions étape par étape • Duʿā authentique • Prérequis • Guidance post-prière",
          },
          infoCard: "L'Istikhārah est effectuée face à une décision importante. La prière se compose de 2 rak'ahs suivies d'une supplication spécifique enseignée par le Prophète Muhammad ﷺ.",
          when: {
            title: "Quand Effectuer l'Istikhārah",
            items: {
              marriage: "Mariage ou relations importantes",
              career: "Décisions de carrière ou changements d'emploi",
              purchases: "Achats majeurs ou investissements",
              travel: "Décisions de voyage ou de relocalisation",
              anyMatter: "Toute question licite nécessitant une guidance",
            },
          },
        },
        // Intro/Guide Screen
        intro: {
          back: "Retour",
          steps: {
            intro: "Intro",
            prepare: "Préparation",
            prayer: "Prière",
            dua: "Doua",
          },
          title: "Qu'est-ce que la Salat al-Istikhara ?",
          description: "Ṣalāt al-Istikhārah (prière de demande de guidance) est une prière de la Sunnah enseignée par le Prophète Muhammad ﷺ pour rechercher la guidance d'Allah lors de décisions importantes.",
          hadith: {
            title: "Hadith authentique",
            text: "Jabir ibn Abdullah (RA) a rapporté : « Le Prophète ﷺ nous enseignait de rechercher le conseil d'Allah en toute chose, comme il nous enseignait une sourate du Coran. »",
            source: "Sahih al-Bukhari 1162",
          },
          understanding: {
            title: "Point important",
            text: "L'istikhara n'est PAS de la divination. C'est une demande de guidance d'Allah pour faciliter la décision et placer sa confiance dans Sa sagesse, et non pour voir des rêves ou recevoir des signes mystiques.",
          },
          cta: "Commencer la préparation",
        },
        // Prepare Screen
        prepare: {
          title: "Avant de commencer",
          step1: {
            title: "Faire les ablutions",
            body: "Faites des ablutions complètes (wuḍūʾ) comme pour toute prière obligatoire. Vous devez être en état de pureté rituelle.",
            bullets: [
              "Laver les mains, rincer la bouche, rincer le nez",
              "Laver le visage, les bras jusqu'aux coudes",
              "Passer les mains mouillées sur la tête, laver les pieds jusqu'aux chevilles",
            ],
          },
          step2: {
            title: "Trouver un endroit propre et calme",
            body: "Choisissez un endroit propre où vous pouvez prier sans interruption. Orientez-vous vers la Qibla (direction de la Kaaba à La Mecque).",
          },
          step3: {
            title: "Avoir une décision claire en tête",
            body: "Avant de prier, définissez clairement la question pour laquelle vous demandez la guidance. L'istikhara est utile lorsque vous avez deux options permises et que vous avez besoin d'aide pour choisir.",
            note: "L'istikhara concerne uniquement les choses licites. Ne faites pas l'istikhara pour une chose clairement interdite.",
          },
          step4: {
            title: "Choisir le bon moment",
            body: "L'istikhara peut être accomplie à tout moment SAUF :",
            avoid: [
              "Après Fajr jusqu'à 15 minutes après le lever du soleil",
              "Lorsque le soleil est au zénith (autour de l'heure de Ẓuhr)",
              "Après ʿAṣr jusqu'au coucher du soleil",
            ],
            best: "Meilleurs moments : dernier tiers de la nuit, après une prière obligatoire, ou entre Maghrib et ʿIshāʾ.",
          },
          cta: "Continuer vers la prière",
        },
        // Prayer Screen
        prayer: {
          title: "La prière de deux rak'ats",
          prayerType: {
            title: "Type de prière",
            body: "Il s'agit d'une prière surérogatoire (nafl) de deux rak'ats, accomplie comme toute autre prière surérogatoire.",
          },
          step1: {
            title: "Formuler l'intention (niyyah)",
            body: "Dans votre cœur, ayez l'intention : « Je prie deux rak'ats de ṣalāt al-istikhāra pour demander la guidance d'Allah. »",
            note: "Note : L'intention se fait dans le cœur, elle ne se prononce pas à voix haute.",
          },
          step2: {
            title: "Première rak'a",
            items: [
              "Dire le takbīr (« Allāhu Akbar ») et lever les mains",
              "Réciter la sourate Al-Fātiḥa",
              "Réciter une sourate (recommandé : Al-Kāfirūn)",
              "Faire le rukūʿ (inclinaison)",
              "Se relever, puis faire le sujūd (prosternation)",
              "S'asseoir brièvement entre les deux prosternations",
              "Faire le deuxième sujūd",
              "Se relever pour la deuxième rak'a",
            ],
          },
          step3: {
            title: "Deuxième rak'a",
            items: [
              "Réciter la sourate Al-Fātiḥa",
              "Réciter une sourate (recommandé : Al-Ikhlāṣ)",
              "Faire le rukūʿ",
              "Faire les deux sujūd",
              "S'asseoir pour le tashahhud",
              "Envoyer les salutations sur le Prophète (ṣalawāt)",
              "Faire le salām pour conclure",
            ],
          },
          tip: {
            title: "Astuce : Sourates recommandées",
            firstRakat: "Première rak'a : Après Al-Fātiḥa, réciter « Qul yā ayyuhal-kāfirūn » (sourate 109)",
            secondRakat: "Deuxième rak'a : Après Al-Fātiḥa, réciter « Qul huwa Allāhu aḥad » (sourate 112)",
          },
          cta: "Continuer vers la dou'a",
        },
        // Dua Screen
        dua: {
          title: "L'invocation de l'istikhāra",
          when: {
            title: "Quand réciter",
            body: "Après avoir accompli les deux rak'ats et fait le salām, louez Allah, envoyez les salutations sur le Prophète ﷺ, puis récitez cette invocation.",
          },
          arabicTitle: "L'invocation complète en arabe",
          transliterationTitle: "Transcription phonétique",
          translationTitle: "Traduction",
          translation: {
            p1: "Ô Allah, je Te demande la guidance par Ta science, et je Te demande la capacité par Ta puissance, et je Te demande de Ta grâce immense. Car Tu es Capable et je ne le suis pas. Tu sais et je ne sais pas, et Tu es le Connaisseur de l'invisible.",
            p2: "Ô Allah, si Tu sais que cette chose [mentionne ici ton besoin précis] est un bien pour moi dans ma religion, dans ma subsistance et dans l'issue de mes affaires — immédiates et futures — alors décrète-la pour moi, facilite-la-moi et bénis-la pour moi.",
            p3: "Et si Tu sais que cette chose est un mal pour moi dans ma religion, dans ma subsistance et dans l'issue de mes affaires — immédiates et futures — alors écarte-la de moi et écarte-moi d'elle, et décrète pour moi le bien où qu'il se trouve, puis rends-moi satisfait de cela.",
          },
          note: "Lorsque tu arrives à « hadhal-amr » (cette chose), précise clairement ton intention. Par exemple : « si mon mariage avec [nom] est un bien pour moi » ou « si accepter ce travail est un bien pour moi ».",
          cta: "Que se passe-t-il ensuite ?",
        },
        // After Screen
        after: {
          title: "Après la prière",
          trust: {
            title: "Avoir confiance en la sagesse d'Allah",
            body: "La partie la plus importante de l'istikhāra est d'accepter le décret d'Allah avec satisfaction, en sachant qu'Il a choisi ce qu'il y a de meilleur pour toi.",
          },
          expect: {
            title: "À quoi s'attendre",
            body: "Beaucoup de personnes pensent à tort que l'istikhāra signifie voir un rêve ou recevoir un signe. Ce n'est PAS nécessaire.",
            do1: "Observer la facilité et l'ouverture dans une direction",
            do2: "Remarquer quelle option apporte le plus de paix",
            do3: "Voir quelle voie s'ouvre naturellement",
            avoid1: "Ne pas attendre des signes mystiques ou des rêves",
            avoid2: "Ne pas répéter si tu as déjà pris une décision",
          },
          action: {
            title: "Passer à l'action",
            body: "Après avoir prié l'istikhāra, avance avec ce qui te semble le meilleur. Aie confiance qu'Allah facilitera le bien et écartera ce qui est nuisible.",
            note1: "Si les choses deviennent faciles et fluides, c'est un signe positif.",
            note2: "Si des obstacles inattendus apparaissent, considère que c'est une protection d'Allah contre un mal.",
          },
          repeat: {
            title: "Combien de fois ?",
            body: "Tu peux prier l'istikhāra une fois ou la répéter jusqu'à 7 fois si tu hésites encore. Certains savants disent 3 fois, d'autres 7 fois.",
            note: "Mais lorsque tu penches vers une décision, fais confiance à cela et avance. Ne reste pas bloqué dans l'hésitation.",
          },
          mistakes: {
            title: "Erreurs courantes à éviter",
            1: "Faire l'istikhāra pour quelque chose d'illicite",
            2: "Attendre des rêves ou des signes surnaturels",
            3: "Répéter sans fin sans passer à l'action",
            4: "Prier après avoir déjà décidé",
            5: "L'utiliser pour fuir la responsabilité de son choix",
          },
          remember: {
            title: "Rappel",
            text: "« Et quiconque place sa confiance en Allah, Il lui suffit. Allah accomplit parfaitement Son dessein. »",
          },
          cta: "J'ai compris",
        },
      },
      compatibility: {
        title: "Compatibilité",
        description: "Analysez l'harmonie relationnelle à travers l'équilibre élémentaire et numérique",
      },
      divineTiming: {
        title: "Timing Divin",
        description: "Outil de réflexion spirituelle pour comprendre le timing et l'intention",
      },
      prayerTimes: {
        title: "Horaires de Prière",
        description: "Horaires de prière quotidiens basés sur votre localisation",
      },
      quran: {
        title: "Coran",
        description: "Lisez le Coran complet avec traductions et signets",
      },
      qibla: {
        title: "Qibla",
        description: "Trouvez la direction de la Kaaba pour la prière",
      },
      dhikrCounter: {
        title: "Compteur de Dhikr",
        description: "Tasbih numérique pour compter le dhikr et le souvenir",
      },
    },

    // Prayer Times Screen
    prayerTimes: {
      title: "Horaires de prière",
      next: "SUIVANT",
      inTime: "dans {{time}}",
      noPrayer: "Pas de prière",
      calculationMethod: "Méthode de calcul",
      method: {
        mwl: "Ligue musulmane mondiale",
      },
      timesBasedOnLocation: "Les horaires sont calculés selon votre position et votre fuseau horaire.",
      configureAdhan: "Configurer les notifications d'adhan",
    },

    // Adhan Settings Screen
    adhanSettings: {
      title: "Paramètres de l'adhan",
      subtitle: "Configurer les notifications des horaires de prière",

      enable: {
        title: "Activer les notifications d'adhan",
        desc: "Recevoir des notifications aux heures de prière",
      },

      prayersToNotify: {
        title: "Prières à notifier",
      },

      sound: {
        title: "Paramètres du son",
        playSound: "Activer le son",
        playSoundDesc: "Lire l'audio de l'adhan",
        vibrate: "Vibration",
        vibrateDesc: "Schéma de vibration",
        volume: "Volume : {{value}} %",
      },

      selection: {
        title: "Choix de l'adhan",
        fajr: "Adhan du Fajr",
        otherPrayers: "Adhan des autres prières",
      },

      adhanOption: {
        default: "Par défaut",
        mishary: "Mishary",
        mecca: "La Mecque",
        medina: "Médine",
      },

      reminder: {
        title: "Rappel",
        value: "Rappel avant la prière : {{minutes}} min",
        zeroHint: "0 = Aucun rappel",
      },

      sendTest: "Envoyer une notification test",
    },

    // Welcome Section
    welcome: {
      title: "Bienvenue sur Asrār Everyday",
      description: "Explorez la riche tradition de ʿIlm al-Ḥurūf (Science des Lettres) et ʿIlm al-ʿAdad (Science des Nombres) à travers une interface intuitive et éducative. Entrez du texte arabe ci-dessus pour découvrir les valeurs numériques, les associations élémentaires et les conseils traditionnels.",
    },

    common: {
      calculate: "Calculer",
      clear: "Effacer",
      submit: "Soumettre",
      cancel: "Annuler",
      close: "Fermer",
      save: "Enregistrer",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      unknown: "—",
      name: "Nom",
      date: "Date",
      location: "Lieu",
      enterName: "Entrez le nom",
      selectDate: "Sélectionnez la date",
      results: "Résultats",
      history: "Historique",
      favorites: "Favoris",
      compare: "Comparer",
      delete: "Supprimer",
      copy: "Copier",
      copied: "Copié !",
      viewAll: "Voir Tout",
      hideAll: "Masquer Tout",
      expand: "Développer",
      collapse: "Réduire",
      next: "Suivant",
      back: "Retour",
      skip: "Passer",
      edit: "Modifier",
      upload: "Télécharger",
      remove: "Retirer",
      optional: "Optionnel",
      share: "Partager",
      seeMore: "Voir Plus",
      seeLess: "Voir Moins",
      days: "jours",
      export: "Exporter",
      showKeyboard: "Afficher le Clavier",
      tapForDetails: "Appuyez pour détails",
      now: "EN COURS",
      rules: "Règne",
      seeDetails: "Voir détails →",
      // Elements - shared across features
      elements: {
        air: "Air",
        fire: "Feu",
        water: "Eau",
        earth: "Terre",
      },
    },
    
    // Home Screen
    home: {
      daily: {
        summary: "Énergies équilibrées",
        bestFor: "Tâches routinières",
      },
      moment: {
        title: "Alignement du moment",
        addNamePrompt: "Ajoutez un nom pour activer",
        details: "DÉTAILS",
        you: "Vous",
        now: "Maintenant",
        status: {
          act: "AGIR",
          maintain: "MAINTENIR",
          hold: "ATTENDRE",
        },
        hint: {
          act: "Aligné — bon moment pour initier",
          maintain: "Supportif — avance régulière",
          hold: "Pas aligné — éviter la précipitation",
        },
        updated: {
          justNow: "Mis à jour à l'instant",
          minute: "Mis à jour il y a 1 minute",
          minutes: "Mis à jour il y a {count} minutes",
          hour: "Mis à jour il y a 1 heure",
          hours: "Mis à jour il y a {count} heures",
        },
      },
      cards: {
        dailyGuidance: {
          title: "Guidance du jour",
          window: {
            favorable: "Fenêtre favorable",
            transformative: "Fenêtre transformative",
            delicate: "Fenêtre délicate",
            neutral: "Fenêtre neutre",
          },
          dayRuler: "Planète du jour :",
          energyToday: "Énergie Terre",
          yourElement: "Votre {element}",
          supportiveBalance: "Équilibre favorable",
          bestFor: "Idéal pour :",
          tapForDetails: "Appuyez pour détails",
          disclaimer: "Pour réflexion • Pas un avis religieux",
        },
        momentAlignment: {
          title: "Alignement du moment",
          nowLabel: "Maintenant",
          cta: "Voir les détails →",
          tapForDetails: "Appuyez pour détails",
          summaryTemplate: "{a} et {b} — {tone}",
          youLabel: "Vous",
          momentLabel: "Moment",
        },
        nextPlanetaryHour: {
          title: "Prochaine heure planétaire",
          inTime: "dans {duration}",
        },
        planetTransit: {
          title: "Transit Planétaire",
          nowBadge: "MAINTENANT",
          hourPlanetLabel: "Planète de l'heure",
          rulesLabel: "Règles",
          transitLabel: "Transit",
          seeDetails: "Voir détails →",
        },
        nextDayRuler: {
          title: "Planète de demain",
        },
        tomorrow: {
          title: "Demain",
        },
      },
      
      // 🔒 Planetary Coming Soon (frozen for launch)
      planet: {
        comingSoon: {
          title: "Module Planétaire",
          message: "Cette section est en cours d'amélioration et reviendra dans une future mise à jour. En attendant, explorez nos autres outils spirituels.",
          backHome: "Retour à l'accueil",
        },
      },
      
      // Planet Detail Screen
      planetDetail: {
        title: "Détails de la planète",
        error: "Impossible de charger les données de la planète",
        modeBadge: {
          now: "Maintenant",
          next: "Suivant",
        },
        sections: {
          snapshot: "Aperçu planétaire",
          practical: "Guidance pratique",
          ruhaniFocus: "Focus Spirituel",
          ruhaniFocusDesc: "Ce que cette planète soutient traditionnellement",
          cautions: "Précautions Spirituelles",
          cautionsDesc: "Ce dont il faut être conscient",
          timing: "Fenêtres Temporelles",
          resonance: "Résonance personnelle",
          divineNames: "Noms Divins",
          spiritual: "Couche spirituelle",
          status: "État Planétaire",
        },
        status: {
          seeMore: "Voir tous les détails",
          seeLess: "Voir moins",
          sign: "Signe",
          motion: "Mouvement",
          station: "Station",
          nextChange: "Prochain Changement",
          speed: "Vitesse",
          perDay: "par jour",
          aspects: "Aspects Majeurs",
          nextIngressFull: "Prochain Changement de Signe",
          noAspects: "Aucun aspect majeur pour le moment",
          motionDirect: "Direct",
          motionRetrograde: "Rétrograde",
          stationingRx: "En Station Rétrograde",
          stationingDirect: "En Station Directe",
          days: "jours",
          in: "dans",
          aspectConjunction: "Conjonction",
          aspectSextile: "Sextile",
          aspectSquare: "Carré",
          aspectTrine: "Trigone",
          aspectOpposition: "Opposition",
          applying: "appliquant",
          separating: "séparant",
          orb: "orbe",
        },
        zodiacSigns: {
          aries: "Bélier",
          taurus: "Taureau",
          gemini: "Gémeaux",
          cancer: "Cancer",
          leo: "Lion",
          virgo: "Vierge",
          libra: "Balance",
          scorpio: "Scorpion",
          sagittarius: "Sagittaire",
          capricorn: "Capricorne",
          aquarius: "Verseau",
          pisces: "Poissons",
        },
        labels: {
          sign: "Signe",
          element: "Élément",
          dayRuler: "Maître du jour",
          hourRuler: "Maître de l'heure",
          vibeNow: "Ambiance actuelle",
          bestFor: "Idéal pour",
          avoid: "Éviter",
          actionsNow: "À faire maintenant",
          resonanceScore: "Résonance",
          whyResonant: "Pourquoi",
        },
        timing: {
          generalWindow: "Meilleur Moment Général",
          afterFajr: "Après la prière de Fajr",
          sunrise: "Au lever du soleil",
          midday: "Vers midi (Dhuhr)",
          afterAsr: "Après la prière de Asr",
          afterMaghrib: "Après la prière de Maghrib",
          night: "Pendant la nuit",
          lastThirdNight: "Dernier tiers de la nuit",
        },
        practice: {
          subtitle: "Méthode traditionnellement pratiquée",
          adab: "Étiquette Spirituelle (Adab)",
        },
        divineNames: {
          whyLabel: "Pourquoi ce nom",
        },
        resonance: {
          supportive: "Favorable",
          neutral: "Neutre",
          challenging: "Transformatif",
        },
        premium: {
          lockedTitle: "Débloquer la Guidance des Noms Divins",
          lockedBody: "Découvrez des recommandations personnalisées de Noms Divins avec l'arabe authentique, significations, suggestions de répétitions et synchronisation alignée avec ce moment planétaire.",
          upgradeButton: "Passer à Premium",
          planetaryDivineResonance: {
            title: "Résonance Planétaire-Divine",
            description: "Découvrez quels Noms Divins résonnent le plus puissamment durant ce moment planétaire, avec des recommandations personnalisées de répétitions et fenêtres sacrées.",
          },
          zikriTiming: {
            title: "Timing de Zikr Personnalisé",
            description: "Connaissez les moments exacts où votre configuration planétaire amplifie des Noms Divins spécifiques—optimisés pour votre thème natal et transits actuels.",
          },
          planetaryHourOptimizer: {
            title: "Optimiseur d'Heures Planétaires",
            description: "Recevez des alertes intelligentes pour les heures planétaires les plus spirituellement puissantes alignées avec vos intentions et énergies célestes actuelles.",
          },
        },
        spiritual: {
          lockedTitle: "Débloquez un alignement plus profond",
          lockedBody: "Découvrez les résonances personnalisées des Noms Divins, les fenêtres de temps spirituel et les recommandations de pratiques sacrées alignées avec ce moment planétaire.",
          upgradeButton: "Passer à Premium",
          divineNames: "Noms Divins recommandés",
          bestTimeWindows: "Meilleures fenêtres temporelles",
          adabReminder: "Rappel d'adab",
        },
        disclaimer: "Pour réflexion seulement • Pas un avis religieux",
        back: "Retour",
      },
      
      // Daily Guidance Details Screen  
      dailyGuidanceDetails: {
        title: "Guidance du jour",
        sections: {
          dayRuler: "Planète du jour",
          dailyWindow: "Fenêtre quotidienne",
          elementalHarmony: "Harmonie élémentaire",
          bestFor: "Idéal pour",
          whyThis: "Pourquoi?",
        },
        days: {
          Sunday: "Dimanche",
          Monday: "Lundi",
          Tuesday: "Mardi",
          Wednesday: "Mercredi",
          Thursday: "Jeudi",
          Friday: "Vendredi",
          Saturday: "Samedi",
        },
        elements: {
          fire: "Feu",
          water: "Eau",
          air: "Air",
          earth: "Terre",
        },
        window: {
          favorable: "Fenêtre favorable",
          neutral: "Fenêtre neutre",
          transformative: "Fenêtre transformative",
          delicate: "Fenêtre délicate",
        },
        windowDescription: {
          favorable: "Aujourd'hui présente des conditions favorables pour l'action et la croissance. Les énergies s'alignent pour soutenir vos intentions.",
          neutral: "Aujourd'hui offre des énergies équilibrées. Une journée stable pour les activités routinières et le progrès graduel.",
          transformative: "Aujourd'hui apporte un potentiel transformatif par le contraste. Les opportunités naissent de l'adaptation aux énergies changeantes.",
          delicate: "Aujourd'hui nécessite une navigation délicate. Pratiquez la patience et la conscience dans vos actions.",
        },
        dayRulerText: "Aujourd'hui est gouverné par {planet}, apportant l'énergie {element} à toutes les activités et intentions.",
        elementText: "Élément {element}",
        harmonyYour: "Votre {element}",
        harmonyDay: "{element} du jour",
        harmonyLevels: {
          Harmonious: "Harmonieux",
          Supportive: "Favorable",
          Challenging: "Difficile",
        },
        whyThisContent: {
          line1: "La guidance d'aujourd'hui est calculée à partir de la planète gouvernante de {day} ({planet})",
          line2: "L'élément {element} de {planet} façonne l'énergie générale du jour",
          line3: "Votre élément personnel {userElement} (dérivé de votre nom) interagit avec l'énergie du jour",
          line4: "Ceci est un outil de réflexion, pas un système prédictif — utilisez-le pour aligner vos intentions avec les rythmes naturels",
        },
        disclaimer: "Pour réflexion • Pas un avis religieux",
      },
      
      // Daily Guidance Messages & Content
      dailyGuidanceContent: {
        generic: {
          fire: {
            message: "L'énergie Feu de {day} apporte vitalité et action. Un jour pour l'initiative et l'expression créative.",
            bestFor: {
              0: "Nouveaux débuts",
              1: "Projets créatifs",
              2: "Leadership",
              3: "Activité physique",
            },
            avoid: {
              0: "Décisions impulsives",
              1: "Conflit",
              2: "Surmenage",
            },
          },
          water: {
            message: "L'énergie Eau de {day} apporte fluidité et intuition. Un jour pour la connexion émotionnelle et la réflexion.",
            bestFor: {
              0: "Guérison émotionnelle",
              1: "Travail intuitif",
              2: "Relations",
              3: "Pratiques spirituelles",
            },
            avoid: {
              0: "Décisions majeures",
              1: "Planification rigide",
              2: "Suranalyse",
            },
          },
          air: {
            message: "L'énergie Air de {day} apporte clarté et communication. Un jour pour l'apprentissage et les poursuites intellectuelles.",
            bestFor: {
              0: "Étude",
              1: "Communication",
              2: "Planification",
              3: "Connexion sociale",
            },
            avoid: {
              0: "Émotions lourdes",
              1: "Isolement",
              2: "Décisions précipitées",
            },
          },
          earth: {
            message: "L'énergie Terre de {day} apporte ancrage et stabilité. Un jour pour le travail pratique et bâtir des fondations.",
            bestFor: {
              0: "Tâches pratiques",
              1: "Planification financière",
              2: "Routines de santé",
              3: "Construction",
            },
            avoid: {
              0: "Changements majeurs",
              1: "Prise de risques",
              2: "Négliger les bases",
            },
          },
        },
        harmonious: {
          fire: {
            message: "Alignement puissant ! Votre nature Feu résonne parfaitement avec l'énergie solaire de {day}. Canalisez cette intensité avec une intention claire.",
            bestFor: {
              0: "Action audacieuse",
              1: "Leadership",
              2: "Percée",
              3: "Transformation",
            },
            avoid: {
              0: "Épuisement",
              1: "Agressivité",
              2: "Impatience",
            },
            peakHours: "Matin au Midi",
          },
          water: {
            message: "Harmonie profonde ! Votre élément Eau coule avec l'énergie lunaire de {day}. Faites confiance à votre intuition et sagesse émotionnelle.",
            bestFor: {
              0: "Guérison",
              1: "Travail intuitif",
              2: "Connexion profonde",
              3: "Réflexion spirituelle",
            },
            avoid: {
              0: "Surpensée",
              1: "Isolement",
              2: "Submersion émotionnelle",
            },
            peakHours: "Soir à la Nuit",
          },
          air: {
            message: "Alignement clair ! Votre nature Air danse avec l'énergie mercurielle de {day}. Parfait pour la clarté mentale et la communication.",
            bestFor: {
              0: "Apprentissage",
              1: "Enseignement",
              2: "Écriture",
              3: "Stratégie",
            },
            avoid: {
              0: "Focus dispersé",
              1: "Sur-engagement",
              2: "Superficialité",
            },
            peakHours: "Matin à l'Après-midi",
          },
          earth: {
            message: "Fondation solide ! Votre élément Terre ancre l'énergie stable de {day}. Construisez avec patience et sagesse pratique.",
            bestFor: {
              0: "Construction",
              1: "Routines de santé",
              2: "Planification financière",
              3: "Constance",
            },
            avoid: {
              0: "Entêtement",
              1: "Résistance au changement",
              2: "Surmenage",
            },
            peakHours: "Après-midi au Soir",
          },
        },
        complementary: {
          fireAir: {
            message: "L'Air attise votre Feu ! L'énergie de {day} amplifie votre vitalité naturelle. Canalisez cette synergie avec sagesse.",
            bestFor: {
              0: "Expression créative",
              1: "Communication",
              2: "Innovation",
              3: "Leadership social",
            },
            avoid: {
              0: "Énergie dispersée",
              1: "Sur-engagement",
              2: "Impulsivité",
            },
          },
          airFire: {
            message: "Le Feu énergise votre Air ! {day} apporte passion à vos idées. La clarté rencontre l'action.",
            bestFor: {
              0: "Action stratégique",
              1: "Prise de parole en public",
              2: "Résolution de problèmes",
              3: "Enseignement",
            },
            avoid: {
              0: "Paralysie d'analyse",
              1: "Surexcitation",
              2: "Décisions hâtives",
            },
          },
          waterEarth: {
            message: "La Terre contient votre Eau ! {day} fournit structure à votre flux. L'intuition rencontre la forme.",
            bestFor: {
              0: "Guérison ancrée",
              1: "Spiritualité pratique",
              2: "Construire des routines",
              3: "Nourrir",
            },
            avoid: {
              0: "Stagnation",
              1: "Excès de prudence",
              2: "Supprimer les émotions",
            },
          },
          earthWater: {
            message: "L'Eau nourrit votre Terre ! L'énergie émotionnelle de {day} adoucit votre ancrage. La stabilité rencontre le flux.",
            bestFor: {
              0: "Progrès doux",
              1: "Travail émotionnel",
              2: "Créativité",
              3: "Compassion",
            },
            avoid: {
              0: "Rigidité",
              1: "Sur-planification",
              2: "Négliger l'intuition",
            },
          },
          default: {
            message: "Énergies favorables aujourd'hui. {day} complète votre élément naturel.",
            bestFor: {
              0: "Action équilibrée",
              1: "Intégration",
              2: "Progrès constant",
            },
            avoid: {
              0: "Extrêmes",
              1: "Forcer les résultats",
            },
          },
        },
        transformative: {
          fireWater: {
            message: "Tension transformative. Votre Feu rencontre l'énergie Eau de {day}. Cette opposition crée de la vapeur - potentiel de transformation puissant.",
            bestFor: {
              0: "Percée",
              1: "Lâcher prise",
              2: "Nettoyage spirituel",
              3: "Guérison profonde",
            },
            avoid: {
              0: "Réactions impulsives",
              1: "Décisions émotionnelles",
              2: "Forcer les résultats",
            },
            peakHours: "Soir (21h00-04h00)",
          },
          waterFire: {
            message: "Opposition dynamique. Votre Eau rencontre l'énergie Feu de {day}. Naviguez avec conscience - la transformation vous attend.",
            bestFor: {
              0: "Alchimie émotionnelle",
              1: "Percée créative",
              2: "Travail de l'ombre",
              3: "Purification",
            },
            avoid: {
              0: "Réactivité",
              1: "Submersion",
              2: "Action hâtive",
            },
            peakHours: "Pré-aube (04h00-06h00) & Nuit (21h00-04h00)",
          },
          airEarth: {
            message: "Défi d'ancrage. Votre Air rencontre l'énergie Terre de {day}. Ralentissez et ancrez vos idées.",
            bestFor: {
              0: "Donner forme aux idées",
              1: "Application pratique",
              2: "Discipline",
              3: "Patience",
            },
            avoid: {
              0: "Résistance mentale",
              1: "Précipitation",
              2: "Éviter l'incarnation",
            },
            peakHours: "Après-midi (14h00-18h00)",
          },
          earthAir: {
            message: "Tension élévatrice. Votre Terre rencontre l'énergie Air de {day}. Laissez-vous élever vers de nouvelles perspectives.",
            bestFor: {
              0: "Nouveaux points de vue",
              1: "Apprentissage",
              2: "Flexibilité",
              3: "Expansion mentale",
            },
            avoid: {
              0: "Entêtement",
              1: "Sur-attachement",
              2: "Résistance au changement",
            },
            peakHours: "Matin (06h00-10h00)",
          },
          default: {
            message: "Journée transformative. Naviguez les énergies opposées avec conscience et intention.",
            bestFor: {
              0: "Transformation",
              1: "Croissance",
              2: "Percée",
            },
            avoid: {
              0: "Réactivité",
              1: "Résistance",
              2: "Forcer",
            },
          },
        },
        neutral: {
          message: "Énergies équilibrées aujourd'hui. {day} offre un terrain stable pour une action consciente.",
          bestFor: {
            0: "Tâches routinières",
            1: "Effort constant",
            2: "Observation",
            3: "Équilibre",
          },
          avoid: {
            0: "Extrêmes",
            1: "Changements majeurs",
            2: "Surmenage",
          },
        },
      },
      
      sections: {
        momentAlignment: {
          title: "Alignement du moment",
          nowLabel: "Maintenant",
          cta: "Voir les détails →",
          tapForDetails: "Touchez pour les détails",
          summaryTemplate: "{a} et {b} — {tone}",
          youLabel: "Vous",
          momentLabel: "Moment",
        },
        nextPlanetaryHour: {
          title: "Prochaine heure planétaire",
          startsAt: "Commence à {time}",
          inTime: "dans {duration}",
        },
        planetTransit: {
          title: "Transit Planétaire",
          nowBadge: "EN COURS",
          hourPlanetLabel: "Planète de l'Heure",
          rulesLabel: "Règne",
          transitLabel: "Transit",
          seeDetails: "Voir détails →",
        },
        nextDayRuler: {
          title: "Règle de Demain",
        },
        tomorrow: {
          title: "Demain",
        },
        spiritualModules: "Modules spirituels",
      },
      actions: {
        checkInNow: "Check-in",
        viewInsights: "Voir analyses",
      },
      showAll: "Voir tout",
      nextPrayer: "Prochaine Prière",
      nextPlanetHour: "Prochaine Heure Planétaire",
      startsAt: "Commence à",
      todayBlessing: "Bénédiction d'Aujourd'hui",
      tomorrow: "Demain",
      tapToSetLocation: "Appuyez pour définir l'emplacement",
    },

    qibla: {
      title: "Qibla",
      locating: "Localisation en cours...",
      toKaaba: "vers la Kaaba",
      facing: "Orientation",
      qibla: "Qibla",
      howToUse: "Mode d'emploi",
      instruction1: "Posez le téléphone à plat, loin des objets métalliques.",
      instruction2: "Tournez jusqu'à ce que la flèche pointe vers l'icône de la Kaaba.",
      instruction3: "Si cela semble incorrect, éloignez-vous des aimants et appuyez sur Actualiser.",
      refresh: "Actualiser",
      yourLocation: "Votre position",
      locationDenied: "L'accès à la localisation est nécessaire pour calculer la Qibla.",
      locationUnavailable: "Impossible de déterminer votre position pour le moment.",
      permissionRequired: "Permission de localisation requise",
      permissionMessage: "Asrār a besoin d'accéder à votre position pour calculer la direction de la Qibla. Veuillez activer les services de localisation dans les paramètres de votre appareil.",
      enableLocation: "Activer la localisation",
      noCompass: "Capteur de boussole non disponible. Affichage de la direction Qibla statique uniquement.",
      calibrate: "Déplacez votre appareil en formant un 8 pour calibrer la boussole.",
      calibrating: "Calibration de la boussole...",
    },

    quran: {
      title: "Coran",
      subtitle: "Le Noble Coran - Complet avec traductions",
      allSurahs: "Toutes les Sourates (114)",
      surah: "Sourate",
      ayah: "Verset",
      ayahs: "Versets",
      searchPlaceholder: "Rechercher par nom ou numéro...",
      results: "Résultats",
      continueReading: "Continuer la Lecture",
      lastRead: "Dernière Lecture",
      loading: "Chargement...",
      loadingSurah: "Chargement de la Sourate...",
      errorLoading: "Échec du chargement du Coran. Veuillez vérifier votre connexion et réessayer.",
      bookmarks: "Favoris",
      noBookmarks: "Aucun Favori",
      noBookmarksDesc: "Appuyez longuement sur un verset pour le mettre en favori",
      removeBookmark: "Supprimer le Favori",
      removeBookmarkConfirm: "Êtes-vous sûr de vouloir supprimer ce favori?",
      bookmarkError: "Impossible d'enregistrer le favori. Veuillez réessayer.",
    },
    
    // Moment Alignment Detail
    momentDetail: {
      title: "Alignement du Moment",
      noName: "Aucun Nom Défini",
      addNameMessage: "Ajoutez votre nom dans Destinée du Nom pour débloquer l'alignement du moment.",
      goToNameDestiny: "Aller à Destinée du Nom",
      updated: "Mis à jour",
      zahirOutward: "Ẓāhir (Extérieur)",
      hourQuality: "Qualité de l'heure",
      whyThisStatus: "Pourquoi ce statut ?",
      guidanceTitle: "Guidance",
      bestNow: "Favorable pour :",
      avoidNow: "Éviter pour l'instant :",
      disclaimer: "Pour réflexion seulement • Pas une règle",
      
      // Timeline
      timeline: {
        title: "Prochaines 24 Heures",
        currentWindow: "Heure Actuelle",
        windowEnds: "L'heure se termine",
        nextOptimal: "Prochaines Heures Optimales",
        showTimeline: "Afficher la Chronologie",
        hideTimeline: "Masquer la Chronologie",
        noOptimalWindows: "Aucune heure optimale trouvée dans les 24 prochaines heures",
        daysAway: "dans {count} jours",
        tomorrow: "Demain",
        today: "Aujourd'hui",
        in: "dans",
        hours: "{count}h",
        minutes: "{count}m",
        planetaryHour: "Heure Planétaire",
        hour: "Heure",
      },
      
      equation: {
        zahir: "Ẓāhir",
        hour: "Heure",
      },
      
      zahirShort: {
        fire: "Énergie active, initiatrice",
        earth: "Énergie stable, ancrée",
        air: "Énergie expressive, claire",
        water: "Énergie intuitive, fluide",
      },
      
      timeShort: {
        fire: "Qualité dynamique, active",
        earth: "Qualité ancrée, stable",
        air: "Qualité lucide, intellectuelle",
        water: "Qualité réceptive, émotionnelle",
      },
      
      reasons: {
        act: {
          bullet1: "Votre élément Ẓāhir correspond parfaitement à l'élément de l'heure—alignement naturel.",
          bullet2: "Cela crée un flux pour initier, communiquer et décider.",
          bullet3: "La fenêtre d'alignement dure cette heure planétaire ; observez comment elle évolue.",
        },
        maintain: {
          bullet1: "Votre élément Ẓāhir est compatible avec l'élément de l'heure—conditions favorables.",
          bullet2: "Bon pour un progrès régulier et le suivi sans forcer.",
          bullet3: "Maintenez un effort calme ; l'alignement change chaque heure.",
        },
        hold: {
          bullet1: "Votre élément Ẓāhir contraste avec l'élément de l'heure—suggère un rythme plus doux.",
          bullet2: "Mieux pour l'observation, la patience et la révision que pour des initiatives majeures.",
          bullet3: "L'alignement change chaque heure ; la prochaine fenêtre pourrait mieux convenir à votre rythme.",
        },
      },
      
      guidance: {
        act: {
          best1: "Initier des conversations ou prendre des décisions",
          best2: "Communiquer des messages importants",
          best3: "Agir sur des idées que vous reteniez",
          avoid1: "Trop réfléchir aux choix simples",
          avoid2: "Attendre inutilement quand le flux est présent",
        },
        maintain: {
          best1: "Tâches routinières et suivi",
          best2: "Effort régulier sur projets en cours",
          best3: "Construire un élan calmement",
          avoid1: "Forcer des percées ou se précipiter",
          avoid2: "Commencer de nouvelles initiatives majeures",
        },
        hold: {
          best1: "Réflexion et observation",
          best2: "Planification et révision d'idées",
          best3: "Patience avec le timing",
          avoid1: "Décisions ou engagements précipités",
          avoid2: "Forcer l'action quand le flux est absent",
        },
      },
    },

    dailyCheckIn: {
      header: {
        title: "Bilan Quotidien",
        subtitle: "Accordez-vous au flux du jour",
      },
      disclaimer: "Pour la réflexion seulement • Pas une règle",
      
      // Ritual Flow (V2)
      ritual: {
        subtitle: "Prenez une respiration",
        breathPrompt: "profonde et observez votre état",
        step1: {
          title: "Alignement quotidien",
          subtitle: "Observer",
        },
        step2: {
          title: "État intérieur",
          subtitle: "Comment vous sentez-vous aujourd'hui ?",
        },
        step3: {
          title: "Définir l'intention",
          subtitle: "Avec quoi souhaitez-vous vous aligner ?",
        },
        mood: {
          label: "Comment vous sentez-vous ?",
          hint: "Il n'y a pas de bonne réponse",
        },
        energy: {
          label: "Niveau d'énergie",
        },
        note: {
          label: "Brève réflexion (optionnel)",
          placeholder: "Une courte note sur votre journée...",
        },
        intention: {
          label: "Direction du jour",
          selected: "Intention du jour",
        },
        complete: {
          button: "Terminer le bilan",
          buttonAction: "Sceller mon bilan",
          saving: "Enregistrement...",
          success: "Bilan enregistré ✓",
          footer: "Pour la réflexion seulement • Pas une règle",
        },
      },
      notice: {
        alreadyCheckedIn: "Vous avez déjà fait votre bilan aujourd'hui. Vous pouvez mettre à jour votre réflexion ci-dessous.",
      },
      sections: {
        configuration: {
          title: "Configuration du jour",
        },
        actionWindow: {
          title: "Fenêtre d'action",
        },
        intention: {
          title: "Intention du moment",
          compatibilityTitle: "Compatibilité de l'intention",
          empty: "Choisissez une intention pour voir les notes d'alignement.",
        },
        note: {
          title: "Qu'avez-vous en tête ? (Optionnel)",
          placeholder: "Une courte note sur votre journée...",
        },
        energy: {
          title: "Quel est votre niveau d'énergie ?",
          low: "Faible",
          high: "Élevé",
          helper: "Cela nous aide à apprendre vos fenêtres optimales.",
        },
      },
      labels: {
        planetaryDay: "Jour planétaire",
        cycleTone: "Tonalité du cycle",
        zahir: "Alignement Ẓāhir",
        batin: "Élément Bāṭin",
        harmony: "Harmonie",
        hourElement: "Heure actuelle",
        closesIn: "Se termine dans",
        nextWindow: "Prochaine fenêtre",
      },
      days: {
        sun: { title: "Dimanche • Courant solaire" },
        moon: { title: "Lundi • Flux lunaire" },
        mars: { title: "Mardi • Initiative de Mars" },
        mercury: { title: "Mercredi • Clairvoyance de Mercure" },
        jupiter: { title: "Jeudi • Expansion de Jupiter" },
        venus: { title: "Vendredi • Harmonie de Vénus" },
        saturn: { title: "Samedi • Ancrage de Saturne" },
      },
      elements: {
        zahir: {
          fire: "Feu • Élan extérieur",
          water: "Eau • Intuition extérieure",
          air: "Air • Expression extérieure",
          earth: "Terre • Stabilité extérieure",
        },
        batin: {
          fire: "Feu • Élan intérieur",
          water: "Eau • Profondeur intérieure",
          air: "Air • Clarté intérieure",
          earth: "Terre • Stabilité intérieure",
        },
        hour: {
          fire: "L'heure porte une qualité de feu active",
          water: "L'heure porte une qualité d'eau réceptive",
          air: "L'heure porte une qualité d'air lucide",
          earth: "L'heure porte une qualité de terre ancrée",
        },
        zahirMissing: "Ajoutez votre nom pour révéler l'alignement Ẓāhir.",
        batinMissing: "Ajoutez votre date de naissance pour révéler votre élément Bāṭin.",
      },
      alignment: {
        labels: {
          perfect: "Alignement parfait",
          strong: "Alignement favorable",
          moderate: "Alignement équilibré",
          opposing: "Alignement contrasté",
        },
        descriptions: {
          perfect: "Votre rythme intérieur résonne pleinement avec l'heure actuelle.",
          strong: "Les conditions sont favorables ; avancez avec constance.",
          moderate: "Flux équilibré — progressez avec conscience.",
          opposing: "L'énergie contraste avec l'heure ; avancez doucement.",
        },
      },
      timing: {
        favorable: "Flux favorable",
        neutral: "Flux équilibré",
        delicate: "Rythme réfléchi",
      },
      actionWindow: {
        urgency: {
          high: "Fenêtre concentrée — se referme bientôt",
          medium: "Fenêtre fluide — restez attentif",
          low: "Fenêtre douce — rythme spacieux",
        },
      },
      intention: {
        readiness: {
          aligned: "En phase",
          steady: "Stable",
          reflect: "Réfléchir d'abord",
        },
        tags: {
          flowing: "Le flux est avec vous",
          steady: "Gardez un rythme posé",
          reflect: "Pause et observation",
          hourOpen: "Heure ouverte",
          hourNext: "Prochaine fenêtre notée",
        },
        descriptions: {
          flowing: "L'alignement est élevé — avancez avec confiance.",
          steady: "L'élan est stable — construisez calmement.",
          reflect: "Le moment invite à la réflexion avant d'agir.",
          hourOpen: "L'heure actuelle soutient une implication attentive.",
          hourNext: "Notez la prochaine ouverture pour poursuivre sereinement.",
        },
      },
      actions: {
        requestReflection: "Demander une réflexion",
        saving: "Enregistrement...",
        saveCheckIn: "Enregistrer le bilan",
        changeIntention: "Changer d'intention",
      },
      alerts: {
        savedTitle: "Bilan enregistré",
        savedMessage: "Votre réflexion quotidienne a été enregistrée. La constance apporte de la clarté.",
        done: "Terminer",
        errorTitle: "Erreur",
        errorMessage: "Impossible d'enregistrer le bilan. Veuillez réessayer.",
      },
    },

    // Profil Utilisateur
    profile: {
      title: "Votre profil",
      complete: "Profil complété à 100 %",
      personalizationLevel: "Niveau de personnalisation",
      full: "Complet",
      setup: "Configuration du Profil",
      edit: "Modifier le Profil",
      view: "Voir le Profil",
      completion: "Complétion du Profil",
      completeYourProfile: "Complétez Votre Profil",
      profileIncomplete: "Votre profil est incomplet. Complétez-le pour personnaliser votre expérience.",
      
      // Niveaux de personnalisation
      levels: {
        none: "Aucun",
        basic: "Basique",
        enhanced: "Amélioré",
        full: "Complet",
      },
      
      // Date de naissance
      dob: {
        title: "Date de naissance",
        subtitle: "Requis pour la personnalisation du Timing Divin",
        selectPlaceholder: "Sélectionnez votre date de naissance",
      },
      
      // Profil astrologique
      astro: {
        title: "Votre profil astrologique",
        sign: "Burj (signe)",
        element: "Élément",
      },
      
      // Section nom
      name: {
        title: "Votre nom",
        subtitle: "Requis pour le Destin du Nom et la Compatibilité",
        arabic: "Nom en arabe",
        arabicPlaceholder: "أدخل اسمك بالعربية",
        latin: "Nom en latin (optionnel)",
        latinPlaceholder: "Entrez votre nom en lettres latines",
      },
      
      // Nom de la mère
      mother: {
        title: "Nom de la mère (optionnel)",
        subtitle: "Utilisé pour des calculs avancés dans certaines fonctionnalités",
        arabic: "Nom arabe de la mère",
        arabicPlaceholder: "أدخل اسم والدتك بالعربية",
      },
      
      // Localisation
      location: {
        title: "Localisation (optionnel)",
        subtitle: "Pour des heures de prière précises et des calculs astrologiques avancés",
        label: "Localisation",
        placeholder: "Entrez la localisation ou utilisez la détection automatique",
        autoDetect: "Touchez l'icône pour détecter automatiquement",
      },
      
      // Confidentialité des données
      localOnly: "Toutes les données sont stockées localement sur votre appareil. Aucune information n'est envoyée vers des serveurs externes en mode invité.",
      
      // Boutons d'action
      save: "Enregistrer le profil",
      aiSettings: "Paramètres IA",
      
      // Étapes de configuration
      steps: {
        basicInfo: "Informations de Base",
        birthDate: "Date de Naissance",
        location: "Localisation",
        avatar: "Photo de Profil",
      },
      
      // Champs du formulaire
      fullName: "Nom Complet",
      fullNamePlaceholder: "Entrez votre nom complet",
      fullNameHelper: "Utilisé pour les calculs de nom et les salutations personnalisées",
      
      dateOfBirth: "Date de Naissance",
      dateOfBirthHelper: "Requis pour des calculs de destinée précis",
      
      locationName: "Localisation",
      locationPlaceholder: "Ville, Pays",
      locationHelper: "Utilisé pour les calculs d'heures planétaires selon votre fuseau horaire",
      detectLocation: "Détecter Ma Position",
      detectingLocation: "Détection de la position...",
      
      language: "Langue Préférée",
      languageHelper: "Choisissez votre langue préférée pour l'application",
      
      timezone: "Fuseau Horaire",
      timezoneHelper: "Détecté automatiquement depuis votre localisation",
      
      // Avatar
      profilePicture: "Photo de Profil",
      uploadPhoto: "Télécharger une Photo",
      changePhoto: "Changer la Photo",
      removePhoto: "Supprimer la Photo",
      photoHelper: "JPG, PNG ou WebP (max 2Mo)",
      dragDropPhoto: "Glissez et déposez votre photo ici, ou cliquez pour parcourir",
      photoUploading: "Téléchargement...",
      photoUploadSuccess: "Photo téléchargée avec succès !",
      photoUploadError: "Échec du téléchargement de la photo. Veuillez réessayer.",
      photoTooLarge: "La photo est trop grande. Taille maximale de 2Mo.",
      photoInvalidType: "Type de fichier invalide. Veuillez télécharger JPG, PNG ou WebP.",
      
      // Messages
      saveSuccess: "Profil enregistré avec succès !",
      saveError: "Échec de l'enregistrement du profil. Veuillez réessayer.",
      setupComplete: "Configuration du profil terminée !",
      setupWelcome: "Bienvenue ! Configurons votre profil pour personnaliser votre expérience.",
      
      // Statut de complétion
      percentComplete: "% Complété",
      almostDone: "Presque terminé !",
      getStarted: "Commencez en complétant votre profil",
      
      // Actions
      completeSetup: "Terminer la Configuration",
      saveChanges: "Enregistrer les Modifications",
      cancelEdit: "Annuler",
      skipForNow: "Passer pour l'instant",
      
      // Vue du profil
      memberSince: "Membre depuis",
      lastSeen: "Dernière visite",
      noProfileYet: "Aucune information de profil pour le moment",
      createProfile: "Créer un Profil",
      
      // Confidentialité & Données
      privacyDataTitle: "Confidentialité & Données",
      exportMyData: "Exporter Mes Données",
      signOut: "Se Déconnecter",
      deleteAccount: "Supprimer le Compte",
      deleteAllMyData: "Supprimer Toutes Mes Données",
      privacyNotice: "Toutes vos données sont stockées localement sur cet appareil. Nous n'envoyons jamais vos informations personnelles à des serveurs externes en mode invité.",
      privacyPolicy: "Politique de Confidentialité",
      termsOfService: "Conditions d'Utilisation",
      
      // Confirmations
      clearDataTitle: "Effacer les Données du Profil",
      clearDataMessage: "Cela supprimera toutes vos données de personnalisation. Cette action est irréversible.",
      signOutTitle: "Se Déconnecter",
      signOutMessage: "Êtes-vous sûr de vouloir vous déconnecter ? Vos données locales resteront sur cet appareil.",
      deleteAccountTitle: "Supprimer le Compte",
      deleteAccountMessage: "Cela supprimera définitivement votre compte et toutes les données associées. Cette action est irréversible.",
      enterPassword: "Entrez votre mot de passe pour confirmer",
      deleteSuccess: "Compte supprimé avec succès",
      deleteError: "Échec de la suppression du compte",
      exportSuccess: "Profil exporté avec succès",
      exportError: "Échec de l'exportation des données du profil",
    },
    
    // Authentification
    auth: {
      // Sélection du mode
      welcomeTitle: "Bienvenue sur Asrār",
      welcomeSubtitle: "Choisissez comment vous souhaitez utiliser l'application",
      guestMode: "Mode Invité",
      guestModeDescription: "Accès rapide, données stockées localement",
      accountMode: "Mode Compte",
      accountModeDescription: "Synchronisation cloud, accès depuis plusieurs appareils",
      continueAsGuest: "Continuer en Invité",
      createAccount: "Créer un Compte",
      
      // Inscription / Connexion
      signUp: "S'inscrire",
      signIn: "Se Connecter",
      email: "Email",
      password: "Mot de Passe",
      confirmPassword: "Confirmer le Mot de Passe",
      emailPlaceholder: "votre@email.com",
      passwordPlaceholder: "••••••••",
      
      // Force du mot de passe
      passwordStrength: "Force du Mot de Passe",
      weak: "Faible",
      medium: "Moyen",
      strong: "Fort",
      
      // Actions
      createAccountButton: "Créer un Compte",
      signInButton: "Se Connecter",
      alreadyHaveAccount: "Vous avez déjà un compte ?",
      dontHaveAccount: "Vous n'avez pas de compte ?",
      forgotPassword: "Mot de passe oublié ?",
      
      // Erreurs
      emailRequired: "L'email est requis",
      passwordRequired: "Le mot de passe est requis",
      passwordMismatch: "Les mots de passe ne correspondent pas",
      invalidEmail: "Adresse email invalide",
      emailInUse: "Email déjà utilisé",
      weakPassword: "Le mot de passe est trop faible",
      wrongPassword: "Mot de passe incorrect",
      userNotFound: "Aucun compte trouvé avec cet email",
      networkError: "Erreur réseau. Veuillez vérifier votre connexion",
      unknownError: "Une erreur s'est produite. Veuillez réessayer",
      
      // Succès
      accountCreated: "Compte créé avec succès !",
      signInSuccess: "Connexion réussie !",
    },

    history: {
      title: "Historique",
      recentCalculations: "Calculs Récents",
      noCalculationsYet: "Aucun calcul pour le moment",
      clearAll: "Tout Effacer",
      confirmClear: "Effacer tout l'historique ? Cette action est irréversible.",
      favorites: "Favoris",
      recent: "Récent",
      saved: "sauvegardés",
      total: "total",
    },

    comparison: {
      title: "Comparer Deux Noms",
      firstName: "Premier Nom/Texte",
      secondName: "Deuxième Nom/Texte",
      elementalHarmony: "Harmonie Élémentaire",
      analysis: "Analyse",
      planet: "Planète",
      day: "Jour",
      bestHours: "Meilleures Heures",
    },

    dailyReflection: {
      title: "Réflexion Spirituelle Quotidienne",
      todaysReflection: "Réflexion du Jour",
      dailyBadge: "Quotidien",
      verseOfTheDay: "Verset du Jour",
      divineNameForReflection: "Nom Divin pour la Réflexion",
      optimalReflectionTimes: "Moments optimaux de réflexion",
      suggestedCounts: "Comptes suggérés",
      expandReflection: "Développer la réflexion",
      collapseReflection: "Réduire la réflexion",
    },

    guidance: {
      relatedQuranicVerses: "Versets Coraniques Associés",
      divineNames: "Asmā' al-Ḥusnā (Les Beaux Noms)",
      letterValues: "Valeurs des Lettres",
      sumAllValues: "Somme de Toutes les Valeurs",
      calculateDigitalRoot: "Calculer la Racine Numérique",
      elementDiscovery: "Découverte de l'Élément",
      discoverSignificance: "Découvrez la signification numérologique de votre nom à travers les sciences islamiques traditionnelles",
      howLettersConvert: "Comment chaque lettre arabe se convertit en nombres sacrés",
      fourElements: "Les quatre éléments classiques et votre composition spirituelle",
      sacredConnections: "Connexions sacrées et résonances divines dans vos nombres",
      totalOfAllLetters: "Total de toutes les valeurs des lettres",
      spiritOfTheCycle: "Esprit du cycle",
    },

    calculator: {
      title: "Calculatrice",
      subtitle: "Numérologie Islamique Basée sur le Système Abjad",
      calculateLetterValues: "Calculer les Valeurs des Lettres",
      enterYourName: "Entrez Votre Nom",
      namePlaceholder: "محمد",
      calculateButton: "Calculer",
      latinText: "Texte Latin (Anglais/Français)",
      arabicText: "Texte Arabe",
      autoTransliterates: "Translittération automatique vers l'arabe • Prend en charge les noms EN/FR",
      showKeyboard: "Afficher le Clavier",
      hideKeyboard: "Masquer le Clavier",
      examples: "Exemples",
      
      // Tabs
      tabs: {
        input: "Saisie",
        results: "Résultats",
      },
      
      // Form Section Headers
      form: {
        calculationType: "Type de Calcul",
        calculationTypeHelper: "Que souhaitez-vous calculer ?",
        abjadSystem: "Système Abjad",
        name: "Nom",
        yourName: "Votre Nom",
        motherName: "Nom de la Mère",
        phraseOrSentence: "Phrase ou Sentence",
        anyText: "Texte Quelconque",
        pasteArabicText: "Coller le Texte Arabe",
      },
      
      // Calculation Types
      types: {
        name: {
          title: "Nom",
          subtitle: "Analyse d'un seul nom",
        },
        lineage: {
          title: "Lignée",
          subtitle: "Nom + Mère",
        },
        phrase: {
          title: "Phrase",
          subtitle: "Sentence ou texte",
        },
        quran: {
          title: "Coran",
          subtitle: "Sourate + Ayah",
        },
        dhikr: {
          title: "Dhikr",
          subtitle: "Noms Divins",
        },
        general: {
          title: "Général",
          subtitle: "Lettres brutes",
        },
      },
      
      // Abjad System Labels
      abjad: {
        maghribi: "Maghribi",
        mashriqi: "Mashriqi",
      },
      
      // Input Fields
      inputs: {
        latinName: "Nom Latin (Anglais/Français)",
        latinNamePlaceholder: "ex., Ibrahima, Amadou, Ousmane",
        motherLatinPlaceholder: "ex., Fatima, Khadija, Aisha",
        arabicName: "Nom Arabe",
        arabicNameRequired: "Nom Arabe *",
        keyboard: "Clavier",
        selectSurahAyah: "Sélectionner Sourate & Ayah",
        selectDivineName: "Sélectionner un Nom Divin",
        orDivider: "— OU —",
      },
      
      // Phrase Options
      options: {
        removeVowels: "Supprimer les voyelles/harakat",
        ignorePunctuation: "Ignorer la ponctuation",
        ignoreSpaces: "Ignorer les espaces",
      },
      
      // Actions
      actions: {
        calculate: "Calculer",
        calculating: "Calcul en cours...",
        close: "Fermer",
      },
      
      // Results Screen - Phase 1: Tabs, Sections, Core Labels
      results: {
        // Tab Navigation
        tabs: {
          core: "Base",
          insights: "Aperçus",
          elements: "Éléments",
          advanced: "Avancé",
        },
        
        // Section Headers
        sections: {
          coreResults: "Résultats de Base",
          nameInsights: "Aperçus du Nom",
          lineageInsights: "Aperçus de Lignée",
          phraseAnalysis: "Analyse de Phrase",
          quranResonance: "Résonance Coranique",
          dhikrPractice: "Pratique du Dhikr",
          generalInsights: "Aperçus Généraux",
          elementalAnalysis: "Analyse Élémentaire",
          advancedMethods: "Méthodes Avancées",
        },
        
        // Core Result Labels
        core: {
          kabir: "Kabir",
          saghir: "Saghir",
          hadad: "Hadad",
          burj: "Burj",
          grandTotal: "Total Grand",
          digitalRoot: "Racine Numérique",
          mod4: "Mod 4",
          zodiac: "Zodiaque",
        },
        
        // Common Labels
        labels: {
          calculatedFrom: "Calculé à partir de",
          calculation: "Calcul",
          intermediate: "Intermédiaire",
          value: "Valeur",
          distance: "Distance",
          letter: "lettre",
          letters: "lettres",
        },
        
        // Badges
        badges: {
          maghribi: "Maghribi",
          mashriqi: "Mashriqi",
        },
        
        // Type Labels
        types: {
          name: "Nom",
          lineage: "Lignée",
          phrase: "Phrase",
          quran: "Coran",
          dhikr: "Dhikr",
          general: "Général",
        },
        
        // Disclaimer
        disclaimer: "Ces aperçus sont destinés à la réflexion spirituelle uniquement. Pas un substitut à des conseils religieux qualifiés.",
        
        // Elements (Ṭabāʾiʿ)
        elements: {
          fire: "Feu",
          water: "Eau",
          air: "Air",
          earth: "Terre",
        },
        
        // Modalities
        modalities: {
          cardinal: "Cardinal",
          fixed: "Fixe",
          mutable: "Mutable",
        },
        
        // Zodiac Section Labels
        zodiac: {
          element: "Élément",
          modality: "Modalité",
          planetaryRuler: "Dirigeant Planétaire",
          temperament: "Tempérament",
          spiritualQuality: "Qualité Spirituelle",
          classicalReference: "Référence Classique",
          calculation: "Calcul",
          burjSign: "Burj (Signe du Zodiaque)",
          intermediate: "Intermédiaire",
        },
        
        // Numerical Essence Section Labels
        essence: {
          yourNumericalEssence: "Votre Essence Numérique",
          coreNumberMeaning: "Signification du Nombre de Base",
          dominantElement: "Élément Dominant",
          spiritualGuidance: "Guidance Spirituelle",
        },
        
        // Number Archetypes (1-9)
        archetypes: {
          1: {
            title: "Le Leader",
            description: "Leadership, indépendance, esprit pionnier. Le nombre de l'unité divine (Tawḥīd).",
            qualities: ["Initiative", "Confiance", "Innovation", "Autonomie"],
          },
          2: {
            title: "L'Harmonisateur",
            description: "Équilibre, partenariat, diplomatie. Représente la dualité cherchant l'unité.",
            qualities: ["Coopération", "Sensibilité", "Patience", "Médiation"],
          },
          3: {
            title: "Le Créateur",
            description: "Créativité, expression, joie. Trinité sacrée du corps, de l'esprit et de l'âme.",
            qualities: ["Créativité", "Communication", "Optimisme", "Expression de soi"],
          },
          4: {
            title: "Le Bâtisseur",
            description: "Stabilité, fondation, discipline. Quatre éléments, quatre mois sacrés.",
            qualities: ["Organisation", "Praticité", "Détermination", "Fiabilité"],
          },
          5: {
            title: "L'Aventurier",
            description: "Liberté, changement, versatilité. Cinq piliers de l'Islam, cinq prières quotidiennes.",
            qualities: ["Adaptabilité", "Curiosité", "Liberté", "Débrouillardise"],
          },
          6: {
            title: "Le Nourricier",
            description: "Amour, responsabilité, harmonie. Six jours de création.",
            qualities: ["Compassion", "Service", "Responsabilité", "Équilibre"],
          },
          7: {
            title: "Le Chercheur",
            description: "Sagesse, spiritualité, introspection. Sept cieux, sept terres.",
            qualities: ["Profondeur spirituelle", "Analyse", "Contemplation", "Mysticisme"],
          },
          8: {
            title: "L'Accomplisseur",
            description: "Pouvoir, abondance, manifestation. Huit anges portant le Trône.",
            qualities: ["Ambition", "Autorité", "Succès matériel", "Karma"],
          },
          9: {
            title: "L'Humanitaire",
            description: "Achèvement, amour universel, illumination. Le nombre de l'achèvement et de la perfection.",
            qualities: ["Compassion", "Service aux autres", "Sagesse", "Achèvement"],
          },
        },
        
        // Element Qualities
        elementQualities: {
          fire: {
            quality: "Passionné, énergique, transformateur",
            spiritual: "Votre âme porte l'étincelle divine de transformation et de purification",
          },
          water: {
            quality: "Fluide, adaptable, guérisseur",
            spiritual: "Votre essence coule avec la miséricorde divine et la profondeur émotionnelle",
          },
          air: {
            quality: "Intellectuel, communicatif, rapide",
            spiritual: "Votre esprit se déplace avec l'inspiration divine et la clarté de pensée",
          },
          earth: {
            quality: "Ancré, stable, nourrissant",
            spiritual: "Votre être s'enracine dans la stabilité divine et la persévérance patiente",
          },
        },
        
        // Elemental Composition Section
        elementalComposition: {
          title: "Composition Élémentaire",
          balanceScore: "Score d'Équilibre Élémentaire",
          balanceStatus: {
            harmonious: "Harmonieux",
            moderate: "Modéré",
            seeRecommendations: "Voir les recommandations",
          },
          harmonizingRecommendation: "Recommandation d'Harmonisation",
          letterCount: "{{count}} lettre",
          letterCount_plural: "{{count}} lettres",
          recommendations: {
            harmonious: "Votre équilibre élémentaire est harmonieux. Maintenez l'équilibre par des pratiques équilibrées.",
            waterWeak: "Votre élément Eau (0%) pourrait nécessiter plus d'attention. Essayez : Cultivez la profondeur émotionnelle, l'intuition et le flux. Pratiquez le dhikr près de l'eau ou pendant le wuḍū.",
            fireWeak: "Votre élément Feu (0%) pourrait nécessiter plus d'attention. Essayez : Engagez des pratiques spirituelles passionnées. Dhikr à l'aube ou au lever du soleil pour allumer la lumière intérieure.",
            airWeak: "Votre élément Air (0%) pourrait nécessiter plus d'attention. Essayez : Concentrez-vous sur la connaissance et la communication. Pratiquez le dhikr avec la conscience du souffle (habs al-nafas).",
            earthWeak: "Votre élément Terre (0%) pourrait nécessiter plus d'attention. Essayez : Ancrez-vous par la patience et la gratitude. Pratiquez le dhikr en sujūd ou debout sur la terre.",
            balanceDominant: "Équilibrez votre dominance {{element}} en incorporant des pratiques d'autres éléments.",
          },
        },
        
        // Name Insights Section
        nameInsights: {
          yourSpiritualArchetype: "Votre Archétype Spirituel",
          spiritualGuidance: "Guidance Spirituelle",
          divineNameResonance: "Résonance du Nom Divin",
          value: "Valeur",
          distance: "Distance",
          recommendedDhikrCounts: "Comptages de Dhikr Recommandés",
          bestPracticeTimes: "Meilleurs Moments de Pratique",
          bestTimeWindow: "Meilleure Fenêtre Temporelle",
          powerDays: "Jours de Puissance",
          timingNote: "Jour de Puissance = dirigeant planétaire du Burj. Meilleure Fenêtre = pic de résonance élémentaire.",
          // Best Time Descriptions by Element
          bestTime: {
            fire: "Aube et lever du soleil (temps de Fajr) - quand l'énergie du feu est la plus forte",
            water: "Nuit et avant de dormir (temps d'Isha) - quand l'énergie de l'eau coule",
            air: "Matin et après-midi (Dhuhr à Asr) - quand l'air circule",
            earth: "Maghrib et moments d'ancrage - quand la terre se stabilise",
          },
        },
        
        // Advanced Methods Section
        advancedMethods: {
          title: "Méthodes de Calcul Avancées",
          subtitle: "Méthodes traditionnelles de l'ʿIlm al-Ḥurūf classique pour une analyse numérique approfondie",
          wusta: {
            name: "Wusṭā (Moyenne)",
            description: "Équilibre entre le grand et le petit",
          },
          kamal: {
            name: "Kamāl (Perfection)",
            description: "Essence de l'achèvement numérique",
          },
          bast: {
            name: "Basṭ (Expansion)",
            description: "Potentiel spirituel expansif",
          },
          sirr: {
            name: "Sirr (Caché)",
            description: "Réflexion secrète de la valeur",
          },
        },
        
        // Zodiac Symbols
        zodiacSymbols: {
          ram: "Le Bélier",
          bull: "Le Taureau",
          twins: "Les Gémeaux",
          crab: "Le Crabe",
          lion: "Le Lion",
          maiden: "La Vierge",
          scales: "La Balance",
          scorpion: "Le Scorpion",
          archer: "L'Archer",
          goat: "Le Bouc",
          waterBearer: "Le Verseau",
          fish: "Les Poissons",
        },
        
        // Spiritual Guidance (Element-based)
        elementGuidance: {
          fire: "Votre nature ardente apporte passion et transformation. Canalisez cette énergie par une pratique spirituelle concentrée et une action juste.",
          water: "Votre nature fluide apporte profondeur et intuition. Embrassez la sagesse émotionnelle et laissez votre cœur vous guider vers la connexion divine.",
          air: "Votre nature aérienne apporte clarté et communication. Recherchez la connaissance et partagez la sagesse avec des mots doux et une intention pure.",
          earth: "Votre nature ancrée apporte stabilité et patience. Construisez votre fondation spirituelle par une pratique constante et la gratitude.",
        },
        
        // Numerical Essence Guidance Template
        essenceGuidance: {
          template: "Votre chemin combine l'essence de {{archetype}} avec le pouvoir de {{element}}.\n\nEmbrassez votre {{quality}} naturel tout en l'équilibrant avec la nature {{elementQuality}} de votre élément. Recherchez l'harmonie entre contemplation intérieure et expression extérieure.",
        },
        
        // Lineage Result Section
        lineage: {
          // Section Title
          lineageBreakdown: "Répartition de Lignée",
          familyPattern: "Modèle Familial",
          keyTakeaways: "Points Clés",
          practicePlan: "Plan de Pratique",
          
          // Breakdown Labels
          labels: {
            yourName: "Votre Nom",
            motherName: "Nom de la Mère",
            combined: "Combiné",
            plusSign: "+",
            equalsSign: "=",
          },
          
          // Harmony Badges & Descriptions
          pattern: {
            support: {
              badge: "SOUTIEN",
              title: "Harmonie de Soutien",
            },
            neutral: {
              badge: "NEUTRE",
              title: "Équilibre Neutre",
            },
            tension: {
              badge: "TENSION",
              title: "Tension Dynamique",
            },
          },
          
          // Element Interaction Descriptions
          interactions: {
            firefire: "Le double feu crée une puissante énergie de transformation",
            fireair: "Le feu et l'air s'amplifient mutuellement - l'inspiration coule",
            firewater: "Le feu et l'eau créent une tension dynamique - équilibre nécessaire",
            fireearth: "Le feu réchauffe la terre - passion ancrée",
            waterwater: "L'eau double approfondit l'intuition et la sagesse émotionnelle",
            waterair: "L'eau et l'air créent de la brume - flux doux",
            waterearth: "L'eau nourrit la terre - croissance fertile",
            airair: "Le double air améliore la communication et la clarté",
            airearth: "L'air sur la terre - les idées rencontrent la réalité",
            earthearth: "La terre double fournit une base solide et de la stabilité",
            balanced: "Interaction élémentaire équilibrée",
          },
          
          // Key Takeaways Templates
          takeaways: {
            lineageNumber: "Votre nombre de lignée est {{kabir}}, enraciné dans l'énergie {{element}}",
            elementalRelationship: "Relation élémentaire : {{interaction}}",
            spiritualRoot: "Racine spirituelle combinée (Ṣaghīr) : {{saghir}}",
          },
          
          // Practice Plan
          practice: {
            doTitle: "À Faire",
            avoidTitle: "À Éviter",
            bestTimeTitle: "Meilleur Moment",
            
            // Do List Items
            do: {
              dhikr: "Pratiquez le dhikr {{saghir}} ou 99 fois",
              reflection: "Réfléchissez aux modèles familiaux pendant {{bestTime}}",
              gratitude: "Honorez la lignée maternelle par le duʿā et la gratitude",
            },
            
            // Avoid List Items
            avoid: {
              neglect: "Négliger la connexion spirituelle familiale",
              ignoreWisdom: "Ignorer la sagesse ancestrale",
            },
          },
          
          // Best Time Descriptions
          bestTime: {
            fire: "L'aube et le lever du soleil (heure de Fajr) - quand l'énergie du feu est la plus forte",
            water: "La nuit et avant de dormir (heure d'Isha) - quand l'énergie de l'eau coule",
            air: "Le matin et l'après-midi (Dhuhr à Asr) - quand l'air circule",
            earth: "Maghrib et moments d'ancrage - quand la terre stabilise",
          },
        },
        
        // Phrase Result Section
        phrase: {
          // Section Titles
          themeDetection: "Détection de Thème",
          repeatedLetters: "Lettres Répétées",
          structureInsights: "Aperçus de Structure",
          reflectionPrompts: "Questions de Réflexion",
          
          // Theme Detection Labels
          theme: {
            dominantElement: "Élément Dominant :",
            nearSacredNumber: "Nombre Sacré Proche :",
          },
          
          // Structure Labels
          structure: {
            topRepeated: "Plus Répété :",
            elementLabel: "(élément {{element}})",
            centerSignificance: "Le centre représente le cœur du message",
          },
          
          // Reflection Prompts
          reflection: {
            q1: "Quel sentiment cette phrase évoque-t-elle dans votre cœur ?",
            q2: "Comment cette phrase se connecte-t-elle à votre parcours spirituel actuel ?",
            q3: "Quelle action ou changement cette phrase vous inspire-t-elle ?",
          },
        },
        
        // Qur'an Result Section
        quran: {
          // Section Titles
          resonanceTitle: "Résonance Coranique",
          resonanceLink: "Lien de Résonance",
          reflection: "Réflexion",
          ayah: "Ayah",
          
          // Resonance Subtitles
          calculatedFrom: "Calculé à partir de la valeur Abjad du verset",
          suggestedAssociation: "Association suggérée",
          
          // Resonance Labels
          element: "Élément",
          sacredNumber: "Nombre Sacré",
          verseKabir: "Kabīr du Verset",
          
          // Sacred Number Meanings
          sacredMeaning: {
            7: "Sept cieux, sept jours de création",
            12: "Douze Imams, douze mois",
            19: "Miracle numérique du Coran",
            70: "Sourate Yā-Sīn (يس)",
            99: "Asmā' al-Ḥusnā (Les Beaux Noms)",
            114: "Sourates dans le Coran",
            313: "Compagnons à Badr",
            786: "Valeur de Bismillah (forme courte)",
            default: "Résonne avec un modèle divin",
          },
          
          // Calculated Description Templates
          calculatedDistance: "Calculé : Le Kabīr du verset est {{kabir}}, le nombre sacré le plus proche est {{nearest}} (distance : {{distance}})",
          perfectMatch: "Correspondance parfaite : Le Kabīr de ce verset ({{kabir}}) est un nombre sacré !",
          
          // Reflection Section
          reflectionPrompt: "Lisez cette ayah lentement, avec présence. Quel mot ou phrase vous interpelle ? Écrivez 1-2 mots qui résonnent.",
          reflectionPlaceholder: "Écrivez vos réflexions ici (sauvegardées localement)...",
          
          // Actions
          readOnQuranCom: "Lire sur Quran.com",
          
          // Disclaimer
          disclaimer: "Ceci est une analyse numérique uniquement. Pour le tafsīr et les décisions religieuses, consultez des érudits qualifiés.",
        },
        
        // Dhikr Result Section
        dhikr: {
          // Calculated From Messages
          calculatedWithoutPrefixes: "Calculé sans les préfixes ال/يا",
          
          // Section Titles
          divineName: "Nom Divin",
          suggestedCounts: "Comptages de Dhikr Suggérés",
          bestTimes: "Meilleurs Moments pour Pratiquer",
          practiceGuidance: "Guide de Pratique",
          
          // Match Strength Templates
          match: {
            exact: "Correspondance : exacte (Valeur : {{value}})",
            near: "Correspondance : proche (Valeur : {{value}})",
            distant: "Correspondance : distante (Valeur : {{value}})",
          },
          
          // Count Labels
          counts: {
            valueBased: "Basé sur la Valeur :",
            traditionalCounts: "Comptages Traditionnels :",
          },
          
          // Timing Labels
          timing: {
            planetaryDay: "Jour Planétaire :",
            afterSalah: "Après la Salah :",
            afterFajr: "Après Fajr",
            afterMaghrib: "Après Maghrib",
            beforeSleep: "Avant de dormir",
          },
          
          // Practice Guidance
          guidance: {
            preparation: "Préparation :",
            adab: "Adab (Étiquette) :",
            
            // Preparation Steps
            prep: {
              wudu: "Faites le wuḍū",
              qibla: "Faites face à la qibla",
              salawat: "Commencez par les ṣalawāt sur le Prophète ﷺ",
            },
            
            // Adab Steps
            etiquette: {
              presence: "Avec présence et humilité",
              counting: "Comptez sur les doigts ou le tasbīḥ",
              dua: "Terminez par le duʿā",
            },
          },
        },
        
        // General Result Section
        general: {
          // Section Titles
          letterFrequency: {
            title: "Fréquence des Lettres",
            value: "valeur",
          },
          elementalBalance: {
            title: "Équilibre Élémentaire",
          },
          sacredResonance: {
            title: "Résonance Sacrée",
            nearestLabel: "Sacré le Plus Proche",
            distanceLabel: "Distance",
          },
          advancedMethods: {
            title: "Méthodes Avancées",
            wusta: {
              label: "Wusṭā (Milieu)",
            },
            kamal: {
              label: "Kamāl (Perfection)",
            },
            bast: {
              label: "Basṭ (Expansion)",
            },
          },
        },
      },
      
      // Abjad System Labels (deprecated, kept for backwards compatibility)
      maghribi: "Maghribi",
      mashriqi: "Mashriqi",
      
      // Info Section
      whatYouLearn: "Ce Que Vous Allez Apprendre",
      discoverSignificance: "Découvrez la signification numérologique de votre nom à travers les sciences islamiques traditionnelles",
      numericalValues: "Valeurs Numériques",
      numericalValuesDesc: "Comment chaque lettre arabe se convertit en nombres sacrés",
      elementalForces: "Forces Élémentaires",
      elementalForcesDesc: "Les quatre éléments classiques et votre composition spirituelle",
      hiddenPatterns: "Motifs Cachés",
      hiddenPatternsDesc: "Connexions sacrées et résonances divines dans vos nombres",
      
      // Key Metrics
      keyMetrics: "Métriques Clés",
      totalOfAllLetterValues: "Total de toutes les valeurs des lettres",
      digitalRoot: "Racine numérique (1-9)",
      remainderMod4: "Reste mod 4",
      spiritOfTheCycle: "Esprit du cycle",
      
      // Step by Step
      stepByStep: "Calcul Étape par Étape",
      reduceToSingleDigit: "Réduire à un seul chiffre",
      dominantElement: "Élément dominant",
      totalAbjadValue: "Valeur Abjad Totale",

      kabir: {
        title: "Kabīr (الكبير)",
        subtitle: "Total Grand",
        description: "La signature énergétique totale de votre nom",
        label: "KABĪR (GRAND)",
      },
      saghir: {
        title: "Ṣaghīr (الصغير)",
        subtitle: "Essence Spirituelle",
        description: "La qualité spirituelle fondamentale, réduite à un chiffre unique (1-9)",
        label: "ṢAGHĪR (PETIT)",
      },
      hadath: {
        title: "Ḥadath (الحدث)",
        subtitle: "Élément",
        description: "L'élément naturel dominant",
        label: "ḤADATH (CYCLE)",
      },
      ruh: {
        title: "Rūḥ Ḥadad (روح الحدد)",
        subtitle: "Nombre de l'Âme",
        description: "Le pont entre l'apparence extérieure et l'essence intérieure",
        label: "RŪḤ ḤADAD",
      },
      
      // Mode Switcher
      knowledgeLevel: "Niveau de Connaissance",
      knowledgeLevelHelp: "Qu'est-ce?",
      knowledgeLevelInfo: "Choisissez votre niveau:\n\n🔰 Débutant: Apprenez les bases du calcul Abjad\n🎓 Intermédiaire: Explorez Burj, planètes et noms divins\n👑 Érudit: Accédez aux outils de recherche avancés",
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      scholar: "Érudit",
      learnBasics: "Apprendre",
      deeperAnalysis: "Plus profond",
      fullResearch: "Recherche",
      
      // Burj (Zodiac)
      burjTitle: "Burj (Signe du Zodiaque)",
      burjSubtitle: "Astronomie islamique classique",
      calculation: "Calcul",
      element: "Élément",
      modality: "Modalité",
      planetaryRuler: "Maître planétaire",
      temperament: "Tempérament",
      symbolism: "Symbolisme",
      spiritualQuality: "Qualité spirituelle",
      classicalReference: "Référence classique",
      
      // Planetary Signature
      planetarySignature: "Signature Planétaire",
      sevenPlanets: "Les 7 planètes classiques",
      planet: "Planète",
      dayOfWeek: "Jour de la semaine",
      hourNumber: "Numéro d'heure",
      metal: "Métal",
      color: "Couleur",
      dhikrRecommendation: "Recommandation de Dhikr",
      divineName: "Nom Divin",
      count: "Nombre",
      timing: "Moment",
    },
    
    // Elemental Composition
    elementalComposition: {
      title: "Composition Élémentaire",
      letters: "lettres",
    },
    
    // Sacred Numbers
    sacredNumbers: {
      title: "Résonance des Nombres Sacrés",
      divisibleBy: "Divisible par",
      divinePerfection: "Perfection divine",
      quranicHarmony: "Harmonie coranique",
      divineNames: "99 Noms Divins",
      nearest: "Le plus proche",
    },
    
    // Numerical Essence
    numericalEssence: {
      title: "Votre Essence Numérique",
      coreNumberMeaning: "Signification du Nombre Central :",
      theNumber: "Le Nombre",
      dominantElement: "Élément Dominant :",
      
      // Number meanings
      number1: "Leadership, indépendance, esprit pionnier",
      number2: "Partenariat, équilibre, coopération et harmonie",
      number3: "Créativité, expression, joie et communication",
      number4: "Stabilité, fondation, sécurité et structure",
      number5: "Liberté, aventure, changement et adaptabilité",
      number6: "Service, responsabilité, soin et amour",
      number7: "Sagesse, spiritualité, introspection et mystère",
      number8: "Pouvoir, abondance, maîtrise matérielle et succès",
      number9: "Achèvement, amour universel, sagesse et compassion",
      
      // Element descriptions
      fireDesc: "Passionné, énergique, transformateur, orienté vers l'action",
      waterDesc: "Intuitif, émotionnel, réfléchi, fluide et adaptable",
      airDesc: "Communicatif, intellectuel, social, esprit vif",
      earthDesc: "Ancré, pratique, fiable, solide et stable",
      
      // Guidance message
      guidanceMessage: "Ces nombres et éléments offrent une guidance pour l'auto-réflexion. Rappelez-vous que vous êtes plus que des nombres×vos choix, valeurs et caractère façonnent votre destin.",
    },
    
    // Celestial Signature
    celestialSignature: {
      title: "Signature Céleste",
      planet: "Planète",
      day: "Jour",
      bestHours: "Meilleures Heures",
      footerNote: "Basé sur la cosmologie islamique classique suivant les Quatre Natures (Ṭabāʾiʿ Arbaʿa) • Pour réflexion spirituelle uniquement",
    },
    
    // Disclaimer
    disclaimer: {
      title: "Outil Éducatif :",
      message: "Cette application explore les sciences islamiques traditionnelles du ʿIlm al-Ḥurūf et du ʿIlm al-ʿAdad pour une réflexion culturelle et historique. Elle n'est pas destinée à la divination, aux conseils médicaux ou aux jugements religieux. Consultez toujours des érudits qualifiés pour des conseils religieux.",
    },

    elements: {
      fire: "Feu",
      water: "Eau",
      air: "Air",
      earth: "Terre",
      fireDesc: "Chaud et Sec - Passionné et énergique",
      waterDesc: "Froid et Humide - Émotionnel et intuitif",
      airDesc: "Chaud et Humide - Intellectuel et communicatif",
      earthDesc: "Froid et Sec - Stable et ancré",
    },

    // Profils de Tempérament Améliorés (Psychologie + Carrière)
    temperament: {
      title: "Profil de Tempérament",
      psychologyTitle: "Profil Psychologique",
      careerTitle: "Guidance Professionnelle",
      
      traits: "Traits Principaux",
      strengths: "Forces",
      watchOuts: "Points de Vigilance",
      balanceTips: "Conseils d'Équilibre",
      
      careerGoodFits: "Carrières Adaptées",
      careerAvoid: "Peut Trouver Difficile",
      careerRationale: "Pourquoi Cela Convient",
      
      // Note: Les données individuelles de tempérament sont dans temperamentProfiles.ts
      // Cette section contient uniquement les étiquettes de l'interface utilisateur
    },

    lifePath: {
      title: "Numérologie du Chemin de Vie",
      lifePathNumber: "Nombre du Chemin de Vie",
      expressionNumber: "Nombre d'Expression",
      soulUrge: "Nombre de l'Élan de l'Âme",
      personality: "Nombre de Personnalité",
      destiny: "Nombre de Destinée",
      personalYear: "Année Personnelle",
      personalMonth: "Mois Personnel",
      karmicDebt: "Nombres de Dette Karmique",
      sacredNumbers: "Nombres Sacrés",
      cycle: "Cycle de Vie",
      
      // Sections de Base vs Externes
      coreNumbers: "Vos Nombres de Vie Fondamentaux",
      coreNumbersDesc: "Ces quatre nombres révèlent votre personnalité fondamentale, vos désirs intérieurs, comment les autres vous voient et le but de votre vie. Calculés uniquement à partir de votre nom personnel.",
      externalInfluences: "Influences Externes",
      maternalInfluence: "INFLUENCE MATERNELLE",
      maternalInfluenceDesc: "Ce nombre montre comment l'énergie de votre mère affecte votre chemin externe et les conditions qui vous entourent.",
      maternalInfluenceExplanation: "Le nom de votre mère révèle les conditions externes et les influences héritées qui entourent votre chemin, mais ne définissent pas votre identité fondamentale.",

      // Étiquettes de nombres dans les cartes
      lifePathLabel: "NOMBRE DU CHEMIN DE VIE",
      expressionLabel: "NOMBRE D'EXPRESSION",
      soulUrgeLabel: "NOMBRE DE L'ÉLAN DE L'ÂME",
      personalityLabel: "NOMBRE DE PERSONNALITÉ",
      destinyLabel: "NOMBRE DE DESTINÉE",

      // Explications simples
      lifePathSimple: "Calculé à partir de votre date de naissance. Le plan de votre âme et le but principal que vous êtes venu accomplir.",
      expressionSimple: "Calculé à partir de votre nom. Comment vous exprimez votre chemin de vie à travers vos talents et personnalité uniques.",
      soulUrgeSimple: "Votre motivation intérieure. Ce que vous recherchez dans la vie et ce qui vous apporte une vraie joie et satisfaction.",
      personalitySimple: "Votre visage public. Comment vous apparaissez aux autres et l'énergie que vous dégagez quand vous entrez dans une pièce.",
      destinySimple: "Votre but de vie et objectif ultime. Ce que vous êtes destiné à accomplir et donner au monde.",

      // Titres de sections
      whatItMeans: "Ce que cela signifie :",
      important: "Important :",
      externalEnergy: "Énergie Externe",
      importantNote: "Cela représente ce qui vous entoure, pas qui vous êtes. Vos nombres fondamentaux ci-dessus définissent votre vraie identité.",

      // Boîtes de guide rapide
      quickGuideTitle: "Guide Rapide :",
      lifePathQuick: "Vos talents de base et forces naturelles. Les capacités avec lesquelles vous êtes né.",
      soulUrgeQuick: "Ce qui vous rend vraiment heureux. Vos désirs les plus profonds et épanouissement intérieur.",
      personalityQuick: "L'impression que vous donnez. Comment les gens vous voient et vous vivent au premier abord.",
      destinyQuick: "Votre but de vie et ce que vous êtes destiné à accomplir. Votre objectif ultime.",

      // Section Cycle
      whereYouAreNow: "Où Vous Êtes Maintenant",
      currentLifePhase: "Phase de Vie Actuelle",
      phaseOf9: "Phase {number} sur 9",
      yearTheme: "Année {position}/9 :",
      focusAreas: "Domaines de Focus :",
      yourAge: "Votre Âge",
      years: "{age} ans",
      yearMonthEnergy: "L'Énergie de Cette Année et de Ce Mois",
      personalYearLabel: "Année Personnelle",
      personalMonthLabel: "Mois Personnel",
      overallEnergy: "Énergie globale",
      monthFlow: "Le flux de ce mois",

      // Forces et Défis
      strengthsAndGrowth: "Vos Forces et Opportunités de Croissance",
      strengthsIntro: "Chaque nombre de 1 à 9 représente différentes qualités de vie. Vos forces montrent ce en quoi vous excellez naturellement. Les domaines de croissance montrent où vous pouvez vous développer davantage.",
      whatYouAreStrongAt: "Ce en Quoi Vous Êtes Fort",
      whereYouCanGrow: "Où Vous Pouvez Grandir",
      strength: "Force {number}",
      growthArea: "Domaine de Croissance {number}",
      strengthDesc1: "Ce qui vous rend capable et fiable",
      strengthDesc2: "Ce qui vous donne un avantage",
      strengthDesc3: "Votre talent naturel",
      strengthDesc4: "Ce en quoi vous excellez",
      growthDesc1: "Une qualité à développer",
      growthDesc2: "Un domaine à améliorer",
      growthDesc3: "Quelque chose sur quoi travailler",
      growthDesc4: "Une leçon de vie clé",
      currentStrength: "En Ce Moment (Votre Force Actuelle) :",
      currentStrengthDesc: "C'est la force principale qui vous soutient en cette saison",
      currentChallenge: "En Cours de Travail (Votre Focus Principal) :",
      currentChallengeDesc: "C'est ce que la vie vous enseigne maintenant×embrassez-le !",

      // Nombres Spéciaux
      specialNumbers: "Nombres Spéciaux et Leçons",
      lessonsToLearn: "Leçons à Apprendre",
      lessonsDesc: "Ces nombres représentent les leçons que votre âme veut apprendre dans cette vie. Ce ne sont pas des obstacles × ce sont des opportunités de croissance.",
      blessedNumbers: "Nombres Bénis",
      blessedDesc: "Ce sont des nombres puissants liés à la tradition spirituelle. Ils apportent des bénédictions spéciales et une protection spirituelle à votre vie.",

      // Archétypes de Nombres (1-11, 22)
      numberArchetypes: {
        1: { title: "Le Leader", meaning: "Vous êtes naturellement indépendant et poussé à créer de nouvelles choses. Vous préférez prendre vos propres décisions." },
        2: { title: "Le Pacificateur", meaning: "Vous excellez à rassembler les gens et à trouver l'harmonie. Vous êtes sensible aux sentiments des autres." },
        3: { title: "Le Créateur", meaning: "Vous vous exprimez facilement et apportez de la joie partout où vous allez. La communication est votre force." },
        4: { title: "Le Bâtisseur", meaning: "Vous êtes fiable et pratique. Vous construisez des fondations solides dans tout ce que vous faites." },
        5: { title: "L'Explorateur", meaning: "Vous aimez la liberté et la variété. Vous vous adaptez rapidement et apprenez d'expériences diverses." },
        6: { title: "Le Soignant", meaning: "Vous êtes responsable et voulez naturellement aider les autres. La famille et le service vous tiennent profondément à cœur." },
        7: { title: "Le Penseur", meaning: "Vous êtes analytique et spirituel. Vous cherchez une compréhension plus profonde des mystères de la vie." },
        8: { title: "Le Réalisateur", meaning: "Vous êtes ambitieux et concentré sur le succès. Vous avez de fortes capacités commerciales et de leadership." },
        9: { title: "L'Humanitaire", meaning: "Vous vous souciez du monde et voulez faire une différence positive. La compassion vous guide." },
        11: { title: "Le Visionnaire", meaning: "Vous voyez au-delà des choses ordinaires. Vous inspirez les autres et portez des messages spirituels." },
        22: { title: "Le Maître Bâtisseur", meaning: "Vous avez de grandes ambitions pour créer quelque chose de durable. Vous transformez les rêves en réalité à grande échelle." },
      },

      descriptions: {
        lifePath: "Le voyage principal et le but de votre âme",
        soulUrge:
          "Les désirs les plus profonds de votre cœur et vos motivations intérieures",
        personality:
          "Comment les autres vous perçoivent ; votre expression extérieure",
        destiny:
          "Votre mission de vie ultime et votre but divin",
        personalYear:
          "Le thème principal et l'énergie de votre année en cours",
        personalMonth: "L'énergie mensuelle et le focus",
      },

      // Améliorations Phase 1
      elementalComposition: "Votre Composition Élémentaire",
      elementalCompositionDesc: "Basé sur vos quatre nombres fondamentaux, voici l'équilibre élémentaire dans votre chemin de vie :",
      dominantElement: "Élément Dominant",
      elementalBalance: "Équilibre Élémentaire",
      
      elementDescriptions: {
        fire: "Le Feu apporte passion, initiative et dynamisme. Vous êtes motivé à agir et diriger.",
        earth: "La Terre apporte stabilité, praticité et ancrage. Vous construisez des fondations durables.",
        air: "L'Air apporte intellect, communication et adaptabilité. Vous prospérez sur les idées et les connexions.",
        water: "L'Eau apporte émotion, intuition et sensibilité. Vous naviguez la vie à travers le ressenti.",
      },

      careerGuidance: "Orientation Professionnelle",
      careerGuidanceIntro: "Basé sur votre Nombre de Chemin de Vie, voici des carrières qui s'alignent avec vos forces naturelles :",
      idealCareers: "Carrières Qui Vous Correspondent Bien",
      careersToAvoid: "Environnements Qui Peuvent Vous Défier",
      whyTheseFit: "Pourquoi ces carrières vous conviennent :",
      
      balanceTips: "Conseils d'Équilibre et de Soin Personnel",
      balanceTipsIntro: "Moyens concrets pour maintenir l'équilibre et honorer l'énergie de votre Chemin de Vie :",
      
      shadowWork: "Travail d'Ombre et Opportunités de Croissance",
      shadowWorkIntro: "Chaque nombre a ses défis. Ce ne sont pas des défauts—ce sont des opportunités de croissance :",
      growthOpportunities: "Domaines à Surveiller et Développer",
      
      practicalGuidance: "Guidance Pratique",
      pathSummary: "Votre Chemin en Bref",
      spiritualPractice: "Pratique Spirituelle",
      quranicConnection: "Connexion Coranique",
      weeklyActions: "Actions Hebdomadaires",
      shadowToAvoid: "Motif Principal à Surveiller",
      
      // Améliorations Phase 2
      quranicWisdom: "Sagesse Coranique et Attributs Divins",
      quranicWisdomDesc: "Découvrez comment votre Chemin de Vie se connecte aux versets sacrés et aux noms divins :",
      verse: "Verset Coranique",
      divineAttribute: "Attribut Divin (Asma ul-Husna)",
      spiritualMeaning: "Signification Spirituelle pour Votre Chemin",
      dailyPractice: "Pratique Spirituelle Quotidienne",
    },

    // Ilm Huruf Panel
    ilmHuruf: {
      // Title and subtitle
      title: "ʿIlm al-Ḥurūf - Guide de Vie Pratique",
      subtitle: "Choisissez un mode de guidance et découvrez des perspectives adaptées à votre recherche",
      
      // Mode Buttons
      weeklyGuidance: "Guide Hebdomadaire",
      nameDestiny: "Destinée du Nom",
      compatibility: "Compatibilité",
      lifePath: "Chemin de Vie",
      divineTiming: "Moment Divin",
      
      // Titles
      generateWeeklyGuidance: "Générez Votre Guide Hebdomadaire",
      discoverNameDestiny: "Découvrez la Destinée de Votre Nom",
      analyzeTwoSouls: "Analysez Deux Âmes",
      calculateLifePath: "Calculez Votre Chemin de Vie",
      currentPlanetaryInfluence: "Influence Planétaire Actuelle",
      
      // Descriptions
      weeklyGuidanceDesc: "Guidance réflexive alignée sur les influences planétaires",
      nameDestinyDesc: "Découvrez l'essence spirituelle encodée dans votre nom",
      compatibilityDesc: "Explorez l'harmonie et le potentiel entre deux individus",
      lifePathDesc: "Comprenez la signification numérologique de votre chemin de naissance",
      divineTimingDesc: "Alignez vos actions avec les moments célestes",
      
      // Labels
      nameLatin: "Nom - Latin (Anglais/Français)",
      nameArabic: "Nom - Arabe",
      yourNameLatin: "Votre Nom - Latin (Anglais/Français)",
      yourNameArabic: "Votre Nom - Arabe",
      firstPersonLatin: "Première Personne - Latin (Anglais/Français)",
      firstPersonArabic: "Première Personne - Arabe",
      secondPersonLatin: "Deuxième Personne - Latin (Anglais/Français)",
      secondPersonArabic: "Deuxième Personne - Arabe",
      motherNameLatin: "Nom de la Mère - Latin (optionnel)",
      motherNameArabic: "Nom de la Mère - Arabe (optionnel)",
      birthDate: "Date de Naissance",
      birthDateOptional: "Date de Naissance (Optionnel - pour date d'ancrage)",
      birthDateUsage: "Utilisé pour calculer vos cycles personnels. Par défaut aujourd'hui si non fourni.",
      location: "Localisation (optionnel)",
      optional: "Optionnel",
      optionalForRestSignal: "Optionnel - pour Signal de Repos",
      restSignalNote: "Active la détection personnalisée du Signal de Repos",
      
      // Mother's Name specific
      addMotherName: "Ajouter le Nom de la Mère (optionnel)",
      motherNameOptional: "Nom de la Mère (optionnel)",
      motherNameRequired: "Nom de la Mère (Requis)",
      motherNameRequiredExplanation: "Le Chemin de Vie est personnel à VOUS. Le nom de votre mère garantit que cette lecture reflète votre voyage unique, pas seulement un modèle général pour tous ceux qui portent votre nom.",
      timingRequiredExplanation: "Divine Timing est calculé pour VOS influences planétaires spécifiques. Le nom de votre mère personnalise ces calculs à votre plan spirituel unique.",
      clearMotherName: "Effacer",
      latinAutoTransliterates: "Latin (Anglais/Français) - Translittération automatique",
      arabicDirectInput: "Arabe - Saisie directe",
      whyMotherRequired: "Pourquoi le nom de la mère est-il requis ?",
      
      // Placeholders
      namePlaceholderEn: "ex : Fatima, Ibrahima, Amadou",
      motherNamePlaceholderEn: "p.ex., Fatima, Khadija, Aisha",
      namePlaceholderAr: "محمد",
      motherNamePlaceholderAr: "فاطمة",
      
      // Name autocomplete
      nameLatinLabel: "Nom (alphabet latin)",
      nameHelperText: "Saisissez votre nom en lettres latines - nous afficherons l'équivalent en arabe",
      nameHelperTextSuggestions: "Commencez à taper pour voir les suggestions en arabe",
      selectArabicName: "Sélectionnez le nom arabe",
      noMatchesFound: "Aucune correspondance trouvée",
      typeToSearch: "Tapez pour rechercher des noms...",
      
      // Autofill toggle
      autofillToggle: {
        label: "Utiliser mes informations de profil",
        description: "Désactivez pour calculer pour la famille ou les amis"
      },
      
      // Messages
      autoTransliterate: "Translittération automatique vers l'arabe • Prend en charge les noms EN/FR",
      confidence: "Confiance",
      showKeyboard: "Afficher le Clavier",
      hideKeyboard: "Masquer le Clavier",
      noneInYourName: "Aucun dans votre nom",
      
      // Buttons
      analyzeButton: "Analyser",
      analysisError: "Erreur d'Analyse",
      
      // Weekly Results
      yourSpiritualProfile: "Votre Profil Spirituel",
      ruh: "Rūḥ",
      element: "Élément",
      currentHarmony: "Harmonie Actuelle",
      allForcesAligned: "Toutes les forces alignées×excellent flux",
      mixedSignals: "Signaux mélangés×procédez avec prudence",
      challengingEnergies: "Énergies difficiles×la patience est nécessaire",
      dominantForce: "Force Dominante",
      weekAtAGlance: "Vue d'ensemble de la semaine",
      peakDayThisWeek: "Jour Culminant de la Semaine",
      bestForInitiatives: "Excellent pour les initiatives importantes",
      focusDay: "Jour Focus",
      forDeepWorkAndPlanning: "Pour le travail profond et la planification",
      harmony: "Harmonie",
      planet: "Planète",
      energyReturnSpeedsThisWeek: "Vitesses de Retour d'Énergie Cette Semaine",
      whenActionsManifestResults: "Quand les actions manifestent leurs résultats (concept classique: Irtiṭāb)",
      sameDay: "Le même jour",
      fewHours: "Quelques heures",
      twoDays: "2-3 jours",
      oneToTwoWeeks: "1-2 semaines",
      deepRestNeeded: "Repos Profond Nécessaire",
      restSignal: "Signal de Repos (Infisāl)",
      criticalLowEnergy: "Énergie critique - honorer ce signal de guérison de votre corps et de votre esprit.",
      lowHarmonyPause: "Harmonie faible + énergie {planet} = Temps de pause, pas de poussée.",
      restPractices: "Pratiques de Repos (choisissez une):",
      betterDaysThisWeek: "Meilleurs Jours Cette Semaine:",
      rescheduleImportantTasks: "Reportez les tâches importantes aux jours d'harmonie élevée pour de meilleurs résultats.",
      classicalWisdom: "Sagesse classique:",
      stillnessBeforeMotion: "Al-sukūn qabl al-ḥaraka",
      stillnessExplanation: "(L'immobilité avant le mouvement apporte l'action bénie)",
      leadership: "Leadership & Vitalité",
      emotions: "Émotions & Intuition",
      action: "Action & Courage",
      communication: "Communication & Apprentissage",
      expansion: "Expansion & Sagesse",
      love: "Amour & Harmonie",
      structure: "Structure & Discipline",
      ruhPhase: "Phase Rūḥ",
      phase: "Phase",
      energyBand: "Bande d'Énergie",
      allTipsForTheDay: "Tous les Conseils du Jour",
      planMindfully: "Planifiez avec attention",
      
      // Energy return speed badges
      instant: "INSTANTANÉ",
      quick: "RAPIDE",
      gradual: "GRADUEL",
      delayed: "DIFFÉRÉ",
      restSignalBadge: "SIGNAL DE REPOS",
      deepRest: "REPOS PROFOND",
      
      // Speed descriptions (lowercase for display)
      instantLower: "instantané",
      quickLower: "rapide",
      gradualLower: "graduel",
      delayedLower: "différé",
      sameDayParens: "(le même jour)",
      fewHoursParens: "(quelques heures)",
      twoDaysParens: "(2-3 jours)",
      oneToTwoWeeksParens: "(1-2 semaines)",
      
      // Footer message
      reflectiveGuidance: "Guidance réfléchie pour planifier votre semaine. Utilisez votre propre jugement. Ceci est un assistant de rythme et de planification, pas une prédiction ou un conseil médical/financier.",
      
      // Error messages
      unableToGenerateWeekly: "Impossible de générer les prévisions hebdomadaires. Veuillez entrer un nom arabe valide.",
      
      // Day badges
      best: "Meilleur",
      gentle: "Doux",
      focus: "Focus",
      
      // Day details
      yourGuidanceForThisDay: "Votre Guidance pour Ce Jour",
      energyReturnWisdom: "Sagesse du Retour d'Énergie",
      returnSpeed: "Vitesse de Retour:",
      todaysPractice: "Pratique d'Aujourd'hui:",
      classicalTeaching: "Enseignement classique (Leçon 25):",
      classicalQuote: "Man zaraʿa khayran ḥaṣada khayran",
      classicalMeaning: "(Qui plante le bien, récolte le bien) × Le moment de la moisson dépend de la graine et de la saison.",
      optimalSequence: "Séquence Optimale pour {day}",
      timeWindows: "Fenêtres de Temps",
    },
    
    // Balance Meter
    balanceMeter: {
      yourBalanceToday: "Votre Équilibre Aujourd'hui",
      balance: "Équilibre",
      conflict: "Conflit",
      moderate: "Modéré",
      harmony: "Harmonie",
      tooMuch: "Trop:",
      needMore: "Besoin de plus:",
      quickFix: "Solution Rapide",
      severeConflict: "Conflit Sévère",
      mild: "Léger",
      startTimer: "Démarrer le Minuteur de {duration} Min",
      focusOnPractice: "Concentrez-vous sur votre pratique...",
      stopTimer: "Arrêter le Minuteur",
      recheckBalance: "Revérifier l'équilibre: 2 heures après avoir terminé la Solution Rapide",
      scoreUpdates: "Mise à jour du score: Minuit (nouveau jour planétaire commence)",
      validFor: "Valide pour: Aujourd'hui seulement - chaque jour apporte un nouvel équilibre élémentaire",
      whyThisScore: "Pourquoi ce score:",
      whatDoesScoreMean: "Que signifie mon score?",
      scoreGuide: "Guide des Scores",
      harmonyRange: "70-100: Harmonie",
      harmonyDesc: "Excellent flux. Ajustements mineurs seulement.",
      moderateRange: "40-69: Modéré",
      moderateDesc: "Équilibre viable. Les solutions rapides aident.",
      conflictRange: "0-39: Conflit",
      conflictDesc: "Journée difficile. Rééquilibrage profond nécessaire.",
      basedOnMizan: "Basé sur le concept Mīzān (Balance) de la tradition ʿIlm al-Ḥurūf d'Imam al-Būnī",
    },

    compatibility: {
      title: "Compatibilité Relationnelle",
      person1: "Personne 1",
      person2: "Personne 2",
      checkCompatibility: "Vérifier la Compatibilité",
      overallScore: "Score d'Harmonie Global",
      harmonyIndex: "Indice d'Harmonie",
      harmonyIndexDesc: "Compatibilité pratique vécue",
      soulConnection: "Connexion de l'Âme",
      soulConnectionDesc: "Résonance de destinée spirituelle",
      independentMetric: "Métrique indépendante — ne fait pas partie du score global",
      soulConnectionExplanation: "La Connexion de l'Âme décrit la résonance sous-jacente entre deux noms",
      harmonyExplanation: "L'Harmonie décrit comment la vie quotidienne tend à se dérouler en pratique",
      metricsNote: "Une forte Connexion de l'Âme peut encore nécessiter des efforts dans l'Harmonie",
      spiritualHarmony: "Harmonie Spirituelle",
      elementalHarmony: "Harmonie Élémentaire",
      planetaryCompatibility: "Compatibilité Planétaire",
      
      // Sections de Base vs Cosmique
      coreCompatibility: "Compatibilité de Base (Noms personnels)",
      coreCompatibilityDesc: "Comment vos personnalités conscientes interagissent",
      cosmicLayer: "Couche Cosmique (Influences Maternelles)",
      cosmicLayerDesc: "Comment vos énergies héritées interagissent ensemble",
      cosmicLayerExplanation: "L'élément de votre mère représente les conditions cosmiques affectant votre connexion d'âme. Cela concerne les schémas émotionnels hérités, pas votre personnalité fondamentale.",

      ratings: {
        excellent: "Excellent",
        good: "Bon",
        moderate: "Modéré",
        challenging: "Difficile",
      },

      // New Universal Compatibility UI translations
      tabs: {
        calculate: "Calcul",
        results: "Résultats",
      },
      form: {
        chooseType: "Choisissez le type de compatibilité",
        type: {
          personPerson: "Personne ↔ Personne",
          personPersonDesc: "Compatibilité pour toute relation",
          personDivineName: "Personne ↔ Nom divin",
          personDivineNameDesc: "Comment le Nom divin te soutient",
          divineIntention: "Nom divin ↔ Intention",
          divineIntentionDesc: "Association des Noms pour un objectif spirituel",
        },
        context: {
          title: "Contexte de la relation",
          universal: "Général",
          marriage: "Mariage",
          friendship: "Amitié",
          family: "Famille",
          work: "Travail",
        },
        person1: "Première personne",
        person2: "Deuxième personne",
        displayNameOptional: "Nom d'affichage (optionnel)",
        latinName: "Nom en latin (anglais/français)",
        arabicName: "Nom en arabe",
        keyboard: "Clavier",
        exampleAhmed: "Exemple : Ahmed",
        exampleFatima: "ex. Fatima, Ibrahima, Amadou",
        exampleKhadija: "ex. Fatima, Khadija, Aisha",
        cta: "Calculer la compatibilité",
        newCalculation: "Nouveau calcul",
        reflectionOnly: "⚖️ Pour réflexion seulement",
        disclaimer: "Cette analyse est destinée à la réflexion spirituelle dans le cadre des sciences traditionnelles de ʿIlm al-Asrār. Elle ne constitue pas de règles religieuses, de prédictions futures ou de garanties de résultats.",
        personInfo: {
          title: "Vos informations",
          displayName: {
            label: "Nom d'affichage (optionnel)",
            placeholder: "ex. Ahmed",
          },
          latinName: {
            label: "Nom en latin (anglais/français)",
            placeholder: "ex. Fatima, Ibrahima, Amadou",
          },
          arabicName: {
            label: "Nom en arabe *",
            placeholder: "أحمد",
          },
          keyboard: "Clavier",
        },
        divineName: {
          title: "Choisir un Nom divin",
          placeholder: "Sélectionner un Nom divin",
        },
        cta2: {
          calculateResonance: "Calculer la résonance",
          calculateCompatibility: "Calculer la compatibilité",
        },
        disclaimer2: {
          title: "⚖️ Pour réflexion seulement",
          body: "Cette analyse est destinée à la réflexion spirituelle dans le cadre des sciences traditionnelles de ʿIlm al-Asrār. Elle ne constitue pas de règles religieuses, de prédictions futures ou de garanties de résultats.",
        },
        errors: {
          arabicNameRequired: "Le nom arabe est requis",
          divineNameRequired: "Veuillez sélectionner un Nom divin",
          calculationFailed: "Le calcul a échoué. Veuillez vérifier vos entrées.",
          intentionRequired: "Veuillez sélectionner une intention",
        },
        divineNameIntention: {
          helper: "Associez un Nom divin à votre intention spirituelle pour recevoir des conseils traditionnels.",
          intentionSection: {
            title: "Votre Intention Spirituelle",
            placeholder: "Choisir Votre Intention",
            description: "Quel objectif spirituel visez-vous ?",
          },
          divineNameSection: {
            title: "Nom Divin à Évaluer",
            placeholder: "Choisir un Nom Divin",
            hint: "Sélectionnez le Nom divin que vous souhaitez aligner avec cette intention.",
          },
          intentionPicker: {
            title: "Sélectionner l'Intention",
          },
          divineNamePicker: {
            title: "Sélectionner le Nom Divin",
          },
          cta: "Évaluer la Compatibilité",
          whyMatters: "Les sources traditionnelles guident quels Noms s'alignent avec des intentions spécifiques.",
          results: {
            title: "Nom Divin pour Votre Intention",
            tabs: {
              alignment: "Alignement",
              alternatives: "Alternatives",
              guidance: "Conseils",
            },
            alignment: {
              optimal: "OPTIMAL",
              suitable: "ADAPTÉ",
              neutral: "NEUTRE",
              notRecommended: "NON RECOMMANDÉ",
            },
            alignmentSubtext: {
              optimal: "Correspondance Parfaite pour Votre Intention",
              suitable: "Bon Choix pour Votre Intention",
              neutral: "Peut Fonctionner, Mais Considérez les Alternatives",
              notRecommended: "Non Recommandé pour Cette Intention",
            },
            sections: {
              aboutName: "À Propos de Ce Nom Divin",
              traditionalUses: "📖 Usages Traditionnels",
              spiritualInfluence: "🌟 Influence Spirituelle",
              alternatives: "✨ Noms Divins Alternatifs",
              alternativesDesc: "Ces Noms peuvent mieux soutenir votre intention :",
              recommended: "Recommandé",
            },
            intentions: {
              clarity: "Clarté",
              patience: "Patience",
              provision: "Subsistance",
              healing: "Guérison",
              protection: "Protection",
              guidance: "Guidance",
              strength: "Force",
              peace: "Paix",
              knowledge: "Connaissance",
              forgiveness: "Pardon",
            },
            speed: {
              fast: "RAPIDE",
              gradual: "PROGRESSIF",
              subtle: "SUBTIL",
              hidden: "CACHÉ",
            },
            expectation: {
              title: "À Quoi S'Attendre",
            },
            guidance: {
              title: "🧭 Guidance Spirituelle",
              howToUse: {
                title: "🙏 Comment Invoquer Ce Nom",
              },
              steps: {
                step1: {
                  title: "Purifiez Votre Intention",
                  desc: "Commencez avec une intention sincère (niyyah) ne recherchant que la satisfaction d'Allah.",
                },
                step2: {
                  title: "Réfléchissez sur le Sens",
                  desc: "Contemplez comment ce Nom se manifeste dans votre vie et dans la création.",
                },
                step3: {
                  title: "Invoquez avec Révérence",
                  desc: "Invoquez Allah en utilisant ce Nom avec humilité et confiance.",
                },
              },
              disclaimer: "Ceci est une guidance spirituelle uniquement. Les Noms Divins appartiennent à Allah seul. Les résultats dépendent de la sincérité, de la patience et de la sagesse d'Allah.",
            },
            spiritualInfluence: {
              body: "Approfondit la connexion à la qualité divine de {{name}}.",
            },
            misaligned: {
              guidance: "Selon les attributions classiques, {{name}} n'est pas traditionnellement associé à {{intention}}. Considérez les Noms suggérés, qui sont classiquement plus alignés pour cette intention.",
            },
            aligned: {
              optimal: "{{name}} est traditionnellement plus aligné pour {{intention}} selon les enseignements classiques. Ce Nom résonne bien avec votre intention.",
              suitable: "{{name}} ouvre des portes spirituelles adjacentes liées à {{intention}}. C'est un choix adapté pour la réflexion.",
              neutral: "{{name}} a un alignement neutre avec {{intention}} dans les sources classiques. Tous les Noms Divins peuvent être invoqués avec une intention sincère et le respect approprié (adab).",
            },
            alignmentLevel: {
              optimal: "OPTIMAL",
              suitable: "ADAPTÉ",
              neutral: "NEUTRE",
              notRecommended: "NON RECOMMANDÉ",
            },
            alternatives: {
              title: "💡 Noms Divins Alternatifs",
              subtitle: "Ces Noms peuvent mieux soutenir votre intention :",
              recommended: "Recommandé",
            },
            practice: {
              title: "🙏 Comment Invoquer Ce Nom",
              step1: {
                title: "Purifiez Votre Intention",
                desc: "Commencez avec une intention sincère (niyyah) ne recherchant que la satisfaction d'Allah.",
              },
              step2: {
                title: "Réfléchissez sur le Sens",
                desc: "Contemplez comment ce Nom se manifeste dans votre vie et dans la création.",
              },
              step3: {
                title: "Invoquez avec Révérence",
                desc: "Invoquez Allah en utilisant ce Nom avec humilité et confiance.",
              },
              disclaimer: "Ceci est une guidance spirituelle uniquement. Les Noms Divins appartiennent à Allah seul. Les résultats dépendent de la sincérité, de la patience et de la sagesse d'Allah.",
            },
          },
        },
      },

      // Tags (pour les cartes alternatives)
      tags: {
        strength: "Force",
        protection: "Protection",
        provision: "Subsistance",
        guidance: "Guidance",
        clarity: "Clarté",
        patience: "Patience",
        peace: "Paix",
        healing: "Guérison",
        knowledge: "Connaissance",
        forgiveness: "Pardon",
      },

      // Noms Divins (influence courte pour les cartes)
      divineNames: {
        arRahman: {
          meaning: "Le Tout Miséricordieux",
          shortInfluence: "Approfondit la connexion à la qualité divine du Tout Miséricordieux",
        },
        arRaheem: {
          meaning: "Le Miséricordieux",
          shortInfluence: "Approfondit la connexion à la qualité divine du Miséricordieux",
        },
        arRazzaaq: {
          meaning: "Le Pourvoyeur",
          shortInfluence: "Approfondit la connexion à la qualité divine du Pourvoyeur",
        },
        alAzeez: {
          meaning: "Le Précieux / Le Tout-Puissant",
          shortInfluence: "Approfondit la connexion à la qualité divine du Précieux / Le Tout-Puissant",
        },
        alFattaah: {
          meaning: "L'Ouvreur",
          shortInfluence: "Approfondit la connexion à la qualité divine de l'Ouvreur",
        },
        alKhaliq: {
          meaning: "Le Créateur",
          shortInfluence: "Approfondit la connexion à la qualité divine du Créateur",
        },
        asShafi: {
          meaning: "Le Guérisseur",
          shortInfluence: "Approfondit la connexion à la qualité divine du Guérisseur",
        },
        alHakim: {
          meaning: "Le Sage",
          shortInfluence: "Approfondit la connexion à la qualité divine du Sage",
        },
        alAleem: {
          meaning: "L'Omniscient",
          shortInfluence: "Approfondit la connexion à la qualité divine de l'Omniscient",
        },
        asShakur: {
          meaning: "Le Reconnaissant",
          shortInfluence: "Approfondit la connexion à la qualité divine du Reconnaissant",
        },
        alHafiz: {
          meaning: "Le Protecteur",
          shortInfluence: "Approfondit la connexion à la qualité divine du Protecteur",
        },
        alMuqeet: {
          meaning: "Le Pourvoyeur",
          shortInfluence: "Approfondit la connexion à la qualité divine du Pourvoyeur",
        },
        alWahhaab: {
          meaning: "Le Donateur",
          shortInfluence: "Approfondit la connexion à la qualité divine du Donateur",
        },
        alHaadi: {
          meaning: "Le Guide",
          shortInfluence: "Approfondit la connexion à la qualité divine du Guide",
        },
        asSubbooh: {
          meaning: "Le Pur",
          shortInfluence: "Approfondit la connexion à la qualité divine du Pur",
        },
        asSabur: {
          meaning: "Le Patient",
          shortInfluence: "Approfondit la connexion à la qualité divine du Patient",
        },
        alMujeeb: {
          meaning: "Le Répondant",
          shortInfluence: "Approfondit la connexion à la qualité divine du Répondant",
        },
        alWadud: {
          meaning: "L'Aimant",
          shortInfluence: "Approfondit la connexion à la qualité divine de l'Aimant",
        },
        alGhaffar: {
          meaning: "Le Pardonneur",
          shortInfluence: "Approfondit la connexion à la qualité divine du Pardonneur",
        },
        alHaafiz: {
          meaning: "Le Gardien",
          shortInfluence: "Approfondit la connexion à la qualité divine du Gardien",
        },
      },

      // Person ↔ Divine Name Results
      divineNameResults: {
        title: "Résonance du Nom Divin",
        subtitle: "Analyse de Résonance du Nom Divin",
        tabs: {
          resonance: "Résonance",
          guidance: "Conseils",
          practice: "Pratique",
        },
        resonance: {
          title: "Résonance Spirituelle",
          subtitle: "L'énergie de {{person}} s'aligne avec {{name}}",
          spiritualDestiny: {
            title: "Tendance spirituelle principale",
            modNine: "Reste Mod-9:",
          },
          nameAction: {
            title: "Comment ce Nom agit sur vous",
            divineInfluence: "💫 Influence Divine",
          },
          profile: {
            element: "Élément",
            planet: "Planète",
          },
        },
        guidance: {
          manifestation: {
            title: "Chronologie de Manifestation",
            whatToExpect: "⏳ À quoi s'attendre",
          },
          spiritualWisdom: {
            title: "Sagesse Spirituelle",
          },
        },
        practice: {
          traditionalUses: {
            title: "Usages Traditionnels",
          },
          spiritualInfluence: {
            title: "🌟 Influence Spirituelle",
          },
          disclaimer: "Cette analyse de résonance est destinée à la réflexion spirituelle. Les Noms Divins appartiennent à Allah seul. Utilisez-les avec révérence et intention pure.",
        },
        effects: {
          strengthens: "RENFORCE",
          stabilizes: "STABILISE",
          tempers: "TEMPÈRE",
          challenges: "TRANSFORME",
        },
        speed: {
          fast: "RAPIDE",
          delayed: "PROGRESSIF",
          subtle: "SUBTIL",
        },
        intentions: {
          clarity: "Clarté",
          patience: "Patience",
          provision: "Subsistance",
          healing: "Guérison",
          protection: "Protection",
          guidance: "Guidance",
          strength: "Force",
          peace: "Paix",
          knowledge: "Connaissance",
          forgiveness: "Pardon",
        },
        elements: {
          fire: "FEU",
          water: "EAU",
          air: "AIR",
          earth: "TERRE",
        },
        planets: {
          Sun: "Soleil",
          Moon: "Lune",
          Mercury: "Mercure",
          Venus: "Vénus",
          Mars: "Mars",
          Jupiter: "Jupiter",
          Saturn: "Saturne",
        },
        explanations: {
          spiritualMeaning: {
            title: "Signification Spirituelle",
            description: "Changement dynamique et grande capacité d'adaptation. Cette énergie s'épanouit dans la variété et le mouvement.",
          },
        },
        sacredNumber: "Nombre sacré : {{value}}",
        nameActions: {
          strengthens: {
            title: "Taqwiyah (Renforcement)",
            description: "Ce Nom renforce votre tempérament {{element}} inné, amplifiant son expression naturelle.",
          },
          stabilizes: {
            title: "Muʿāwanah (Soutien)",
            description: "Ce Nom porte et stabilise votre nature {{element}}, fournissant un soutien harmonieux.",
          },
          tempers: {
            title: "Tadbīr bi-l-Ḍidd (Tempérance)",
            description: "Ce Nom gouverne votre nature {{element}} par l'opposition, refrénant l'excès et établissant la régulation.",
          },
          challenges: {
            title: "Taṣrīf wa-Taḥwīl (Transformation)",
            description: "Ce Nom transforme votre disposition {{element}}, la raffinant par le changement intérieur plutôt que par le confort.",
          },
        },
        manifestationSpeed: {
          fast: {
            fire: "Votre tempérament permet une réception plus rapide de l'effet apparent de ce Nom. La réflexion peut révéler des changements plus tôt.",
            air: "Votre tempérament permet une réception plus rapide de l'effet apparent de ce Nom. La réflexion peut révéler des changements plus tôt.",
            water: "Votre nature ancrée reçoit l'effet de ce Nom plus graduellement, le stabilisant profondément avec le temps.",
            earth: "Votre nature ancrée reçoit l'effet de ce Nom plus graduellement, le stabilisant profondément avec le temps.",
          },
          gradual: {
            earth: "Votre réception terrestre reflète le déploiement graduel du Nom, construisant des fondations durables par une réception patiente.",
            default: "Ce Nom se déploie graduellement; votre réception s'approfondit par une pratique spirituelle constante au fil du temps.",
          },
          subtle: {
            default: "Ce Nom agit intérieurement. Son effet est subtil, révélé par la transformation intérieure plutôt que par des signes extérieurs.",
          },
        },
        elementLabels: {
          fire: "feu",
          water: "eau",
          air: "air",
          earth: "terre",
        },
        spiritualWisdomText: "Cet alignement favorise une progression régulière et une coopération harmonieuse.",
        qualityLabels: {
          excellent: "Excellent",
          "very-good": "Très Bon",
          good: "Bon",
          moderate: "Modéré",
          challenging: "Fin de cycle",
        },
        modLabel: "Nombre sacré : {{value}}",
      },

      // Person-to-Person Results
      results: {
        tabs: {
          overview: "Aperçu",
          soulConnection: "Connexion de l'Âme",
          harmony: "Harmonie",
          elemental: "Élémentaire",
          planetary: "Planétaire",
          daily: "Quotidien",
          advice: "Conseils",
        },
        header: {
          compatibilityAnalysis: "Compatibilité {{context}}",
        },
        overview: {
          overallCompatibility: "Indice d'Harmonie",
          harmonyDesc: "% global basé sur les dynamiques vécues",
          soulConnectionTitle: "Connexion de l'Âme",
          soulConnectionSubtitle: "Destinée Mod-9",
          twoMetricsExplanation: "L'Harmonie Globale reflète les dynamiques vécues. La Connexion de l'Âme reflète la résonance de destinée sous-jacente. Elles ne correspondent pas toujours — c'est normal.",
          tendencyNotCertainty: "Tendance, pas certitude",
          modeOfUnion: "🜂 MODE D'UNION",
          unionMode: {
            label: "MODE D'UNION",
            balance: "Union par l'équilibre",
            dynamic: "Union dynamique",
            complementary: "Union complémentaire",
          },
          summary: "Résumé",
          quality: "Qualité",
          sacredNumber: "Nombre sacré",
          spiritual: "Connexion de l'Âme",
          elemental: "Élémentaire",
          planetary: "Planétaire",
          daily: "Quotidien",
          harmony: "Harmonie",
        },
        spiritual: {
          title: "Connexion de l'Âme",
          subtitle: "Résonance de destinée spirituelle",
          badge: "Métrique Indépendante",
          classicalLabel: "Indicateur Classique",
          sacredNumberLabel: "Nombre Sacré",
          numberOutOfNine: "{{value}}/9",
          meaning: "🌿 Signification",
          watchOut: "⚡ Point d'attention",
          keyToSuccess: "🔑 Clé du succès",
          howCalculated: "Comment ce nombre a été dérivé",
          formula: "Formule",
          kabir1: "{{name}} Kabīr",
          kabir2: "{{name}} Kabīr",
          formulaText: "({{kabir1}} + {{kabir2}} + 7) mod 9 = {{result}}",
          zeroTreatedAsNine: "0 est traité comme 9",
          contextNote: "Dans {{context}}",
          contextMarriage: "renforce la loyauté et la patience",
          contextFriendship: "renforce la loyauté et l'entraide",
          contextWork: "améliore le respect et la coopération",
          contextFamily: "approfondit les liens familiaux",
          // Contenu simplifié par niveau de score
          watchOut_high: "Quand tout va bien, on peut oublier de nourrir la relation — restez attentifs.",
          watchOut_medium: "Sous stress ou quand vous êtes pressés, la patience peut baisser.",
          watchOut_low: "Les différences apparaissent souvent — cela demande un effort conscient continu.",
          success_high: "Cultivez la gratitude et parlez-vous régulièrement avec le cœur.",
          success_medium: "Parlez calmement et régulièrement, même 5 minutes par jour.",
          success_low: "Acceptez les différences sans chercher à changer l'autre ; trouvez votre rythme.",
        },
        harmony: {
          title: "Indice d'Harmonie",
          subtitle: "Compatibilité pratique dans les dynamiques vécues",
          description: "Cela reflète comment la vie quotidienne tend à se dérouler en fonction de l'équilibre élémentaire, des influences planétaires et des rythmes quotidiens.",
          components: "Composants d'Harmonie",
        },
        elemental: {
          title: "Tempérament élémentaire",
          subtitle: "Équilibre énergétique naturel",
          shortDesc: "Équilibre énergétique naturel",
          balanceType: "Type d'équilibre",
          balanceType_high: "Renforçant",
          balanceType_medium: "Complémentaire",
          balanceType_low: "Tempérant",
          watchOut_fire: "Trop d'intensité peut fatiguer la relation — canalisez l'énergie vers des projets communs.",
          watchOut_water: "Les émotions peuvent déborder — respectez les limites tout en restant empathiques.",
          watchOut_air: "La stimulation mentale peut disperser — ancrez les idées dans l'action.",
          watchOut_earth: "Les routines peuvent devenir rigides — gardez la stabilité tout en restant flexibles.",
          success_fire: "Dirigez votre passion commune vers des objectifs constructifs ; célébrez ensemble.",
          success_water: "Créez de l'espace pour l'expression émotionnelle ; écoutez sans essayer de réparer.",
          success_air: "Alternez dialogue et silence ; laissez les idées mûrir avant d'agir.",
          success_earth: "Construisez des rythmes ensemble ; que la constance devienne votre base.",
        },
        planetary: {
          title: "Harmonie cosmique",
          subtitle: "Influences planétaires",
          shortDesc: "Influences planétaires",
          dominantInfluence: "Influence dominante",
          dominantInfluence_friendly: "Énergies favorables",
          dominantInfluence_neutral: "Influences équilibrées",
          dominantInfluence_opposing: "Tension qui demande patience",
          watchOut_friendly: "Quand c'est facile, on peut tenir l'autre pour acquis — cultivez la gratitude.",
          watchOut_neutral: "Quand une énergie domine, des déséquilibres apparaissent — honorez les deux également.",
          watchOut_opposing: "Des impulsions contradictoires surgissent souvent — reconnaissez celle qui sert le moment.",
          success_friendly: "Profitez des influences favorables tout en restant ancrés dans vos valeurs communes.",
          success_neutral: "Reconnaissez les différences sans jugement ; trouvez des rythmes complémentaires.",
          success_opposing: "Face à la tension, faites une pause ; la patience révèle le chemin le plus sage.",
        },
        daily: {
          title: "Interaction quotidienne",
          subtitle: "Dynamiques du quotidien",
          shortDesc: "Rythme quotidien",
          bestRhythm: "Meilleur rythme",
          bestRhythm_value: "Les journées calmes favorisent cette relation plus que les cycles pressés",
          watchOut_high: "Les routines peuvent devenir mécaniques — mettez de l'intention dans les moments ordinaires.",
          watchOut_low: "Les journées rapides amplifient les tensions — ralentissez quand vous sentez un déséquilibre.",
          success_high: "Gardez de petits rituels quotidiens qui vous reconnectent (café, marche, discussion).",
          success_low: "Planifiez les conversations importantes quand vous êtes tous deux calmes et reposés.",
        },
        advice: {
          title: "Guidance spirituelle",
          traditionalNote: "📜 Note traditionnelle",
        },
        disclaimer: {
          title: "Note traditionnelle",
          body: "Cette analyse est indicative. Elle reflète des tendances et non des certitudes. Les résultats dépendent de l'intention, du comportement et du contexte.",
        },
        microLabels: {
          spiritual: "Alignement, pas perfection",
          elemental: "Facilité naturelle",
          planetary: "Influences favorables",
          daily: "Flux quotidien",
        },
        enums: {
          quality: {
            excellent: "Excellent",
            "very-good": "Très bon",
            good: "Bon",
            moderate: "Modéré",
            challenging: "Difficile",
          },
          elementalQuality: {
            harmonious: "Harmonieux",
            complementary: "Complémentaire",
            balanced: "Équilibré",
            dynamic: "Dynamique",
          },
          interactionType: {
            harmonious: "Harmonieux",
            complementary: "Complémentaire",
            challenging: "Difficile",
            neutral: "Neutre",
          },
          element: {
            fire: "Feu",
            water: "Eau",
            air: "Air",
            earth: "Terre",
          },
          relationship: {
            friendly: "Favorable",
            neutral: "Neutre",
            opposing: "Opposé",
          },
          planetaryRelationship: {
            friendly: "Favorable",
            neutral: "Équilibré",
            opposing: "Tendu",
          },
        },
        tags: {
          active: "Actif",
          growing: "En croissance",
          dynamic: "Dynamique",
          complementary: "Complémentaire",
        },
        independentMetric: "Métrique indépendante",
      },
      
      // Archétypes de Connexion d'Âme (1-9)
      soul: {
        title: "Connexion d'Âme",
        subtitle: "Un marqueur traditionnel de résonance de l'âme",
        independentChip: "Métrique indépendante",
        disclaimer: "Un outil de réflexion des enseignements traditionnels — il ne remplace ni la foi, ni le libre arbitre, ni le conseil avisé.",
        
        blocks: {
          meaning: "Signification",
          marriageOutlook: "Perspective du Mariage",
          watchOut: "Attention",
          keyToSuccess: "Clé du Succès",
        },
        
        howCalculated: {
          title: "Comment ce nombre est calculé",
          constant: "Constante",
          explanation: "Nous additionnons les deux valeurs de noms, ajoutons 7, puis réduisons à un nombre 1–9.",
        },
        
        archetypes: {
          1: {
            title: "Le Chemin Ancré",
            oneLine: "Peut commencer facilement ; plus tard peut sembler stagnant",
            meaning: "Ce motif montre traditionnellement un début facile qui peut plus tard sembler stagnant, surtout en croissance et provision. Le lien émotionnel peut se refroidir avec le temps s'il n'est pas activement entretenu.",
            marriageOutlook: "Le mariage peut commencer en douceur mais nécessite un renouvellement intentionnel pour éviter la complaisance. Concentrez-vous sur des objectifs partagés et des pratiques de gratitude.",
            watchOut: "Froideur émotionnelle et tenir l'autre pour acquis. La croissance en provision peut ralentir sans effort conscient.",
            keyToSuccess: "Objectifs spirituels partagés, pratiques de renouvellement régulières, gratitude et actes de charité (sadaqah) ensemble.",
          },
          2: {
            title: "Le Lien Harmonieux",
            oneLine: "Traditionnellement bon pour la coopération",
            meaning: "Traditionnellement considéré comme favorable au mariage. Ce motif soutient la coopération naturelle, la camaraderie et la compréhension mutuelle. L'équilibre coule plus facilement que l'opposition.",
            marriageOutlook: "Le mariage est traditionnellement soutenu. La camaraderie et le travail d'équipe sont des forces naturelles. Gardez-vous contre la dépendance.",
            watchOut: "Sur-dépendance et éviter les conversations difficiles. Un partenaire peut trop s'appuyer sur l'autre.",
            keyToSuccess: "Communication claire, responsabilité partagée et maintien de la croissance individuelle aux côtés du partenariat.",
          },
          3: {
            title: "Le Chemin de Friction",
            oneLine: "Souvent difficile ; tension et pression",
            meaning: "Ce motif est traditionnellement associé à la difficulté. Des tensions, des désaccords fréquents et des pressions financières peuvent surgir. Nécessite une patience et une discipline significatives.",
            marriageOutlook: "Le mariage peut faire face à des défis continus. La pression en provision et harmonie émotionnelle nécessite souvent un soutien extérieur et une discipline spirituelle.",
            watchOut: "Arguments constants, instabilité financière et épuisement émotionnel. Ce chemin teste l'endurance.",
            keyToSuccess: "Patience (sabr), routines structurées, discipline spirituelle et conseil sage d'aînés de confiance.",
          },
          4: {
            title: "Le Chemin Chargé",
            oneLine: "Épreuves lourdes ; santé et pression",
            meaning: "Traditionnellement vu comme un chemin lourd. Des préoccupations de santé, une pression émotionnelle et un sens de fardeau peuvent être présents, surtout si un partenaire a des schémas émotionnels non résolus.",
            marriageOutlook: "Le mariage peut sembler une épreuve. La santé (physique ou émotionnelle) devient souvent une préoccupation centrale. Nécessite maturité émotionnelle et calme.",
            watchOut: "Épuisement, négligence du bien-être physique ou mental, et ressentiment accumulé par des fardeaux non exprimés.",
            keyToSuccess: "Se concentrer sur la santé (physique et émotionnelle), maturité émotionnelle, routines quotidiennes calmes et rechercher un soutien thérapeutique si nécessaire.",
          },
          5: {
            title: "Le Chemin Béni",
            oneLine: "Traditionnellement béni ; harmonie et croissance",
            meaning: "Traditionnellement considéré comme très favorable. Associé à la bénédiction, l'harmonie naturelle, les enfants et la croissance spirituelle. L'équilibre et l'abondance peuvent couler plus facilement.",
            marriageOutlook: "Le mariage est traditionnellement béni. L'harmonie, les enfants et la vie spirituelle partagée sont souvent soutenus. Gardez-vous contre l'excès et la distraction.",
            watchOut: "Distraction des bénédictions, excès dans le confort et tenir l'abondance pour acquise.",
            keyToSuccess: "Pratiques de gratitude, vie spirituelle structurée ensemble et utiliser les bénédictions pour soutenir les autres.",
          },
          6: {
            title: "Le Chemin d'Épreuve",
            oneLine: "Querelles et tests d'ego",
            meaning: "Ce motif montre traditionnellement des querelles récurrentes et de la discorde. Des tests de colère, d'orgueil et d'ego sont courants. Les schémas peuvent se répéter jusqu'à ce que le travail intérieur soit fait.",
            marriageOutlook: "Le mariage implique souvent des luttes de pouvoir et des conflits répétés. Les deux partenaires doivent travailler sur la conscience de soi et le pardon.",
            watchOut: "Luttes de pouvoir, arguments récurrents et cycles de blâme. L'orgueil et la colère non résolue amplifient la friction.",
            keyToSuccess: "Compétences en résolution de conflits, travail sur soi (surtout colère et ego), pratiques de pardon et rappel spirituel régulier (dhikr).",
          },
          7: {
            title: "Le Chemin Choisi",
            oneLine: "Traditionnellement le meilleur ; bénédictions après obstacles",
            meaning: "Traditionnellement considéré comme le plus favorable au mariage. Peut faire face à des obstacles avant l'union, mais de fortes bénédictions et un alignement suivent souvent. L'harmonie spirituelle est profonde.",
            marriageOutlook: "Le mariage est traditionnellement très béni. Les défis avant l'union renforcent souvent le lien. Ce chemin porte une faveur spirituelle.",
            watchOut: "Orgueil dans la bénédiction, interférence externe avant l'union et supposer que la facilité signifie qu'aucun effort n'est nécessaire.",
            keyToSuccess: "Humilité, confiance dans le timing divin, gratitude et alignement dans les valeurs spirituelles.",
          },
          8: {
            title: "Le Chemin de Patience",
            oneLine: "Très bon à long terme ; luttes initiales",
            meaning: "Ce motif est traditionnellement très bon à long terme, mais les malentendus précoces sont courants. La patience (sabr) transforme cela en un lien fort et durable.",
            marriageOutlook: "Le mariage commence avec confusion ou mauvais jugement mais devient très fort avec le temps. La patience est la clé pour déverrouiller la force de ce lien.",
            watchOut: "Juger la relation trop rapidement au début. La friction précoce peut causer des fins prématurées.",
            keyToSuccess: "Patience (sabr), intelligence émotionnelle, communication douce et donner du temps pour que la compréhension mutuelle s'approfondisse.",
          },
          9: {
            title: "Le Chemin Rompu",
            oneLine: "Traditionnellement déconseillé",
            meaning: "Traditionnellement déconseillé pour le mariage contraignant. Associé à des difficultés sévères, des ruptures soudaines et des schémas de préjudice récurrents. Nécessite une extrême prudence et des conseils.",
            marriageOutlook: "Le mariage est traditionnellement découragé sous ce motif. Si déjà dans ce lien, augmentez les pratiques de protection spirituelle et cherchez un conseil avisé.",
            watchOut: "Séparations soudaines, cycles de préjudice récurrents et schémas qui se répètent malgré les efforts. Ce chemin nécessite vigilance.",
            keyToSuccess: "Ne paniquez pas si cela apparaît. Cherchez conseil auprès de guides spirituels de confiance. Si déjà lié, augmentez les pratiques de protection (duʿāʾ, charité, conseil). Évitez la pensée fataliste — le libre arbitre et la miséricorde divine demeurent.",
          },
          fallback: {
            title: "Connexion d'Âme",
            oneLine: "Motif de résonance spirituelle",
            meaning: "Cela reflète la résonance spirituelle sous-jacente entre les deux noms.",
            marriageOutlook: "Chaque chemin a ses leçons. Approchez avec sagesse et patience.",
            watchOut: "Prudence générale et conscience dans toutes les relations.",
            keyToSuccess: "Cherchez un conseil avisé, maintenez des pratiques spirituelles et honorez le libre arbitre.",
          },
        },
        
        tags: {
          grounded: "Ancré",
          stability: "Stabilité",
          renewal: "Renouvellement",
          harmony: "Harmonie",
          cooperation: "Coopération",
          companionship: "Camaraderie",
          friction: "Friction",
          patience: "Patience",
          discipline: "Discipline",
          burden: "Fardeau",
          health: "Santé",
          maturity: "Maturité",
          blessed: "Béni",
          growth: "Croissance",
          gratitude: "Gratitude",
          trial: "Épreuve",
          forgiveness: "Pardon",
          selfWork: "Travail sur soi",
          chosen: "Choisi",
          alignment: "Alignement",
          longTerm: "Long terme",
          wisdom: "Sagesse",
          caution: "Prudence",
          guidance: "Conseil",
          protection: "Protection",
          reflection: "Réflexion",
        },
        
        // Aperçu de Connexion d'Âme (pour la Carte Aperçu)
        glimpse: {
          fallback: "Motif de connexion spirituelle",
          universal: {
            1: "Début facile ; croissance peut ralentir",
            2: "Généralement fluide et soutenant",
            3: "Friction probable ; patience requise",
            4: "Sensation lourde ; soins nécessaires",
            5: "Flux béni ; harmonie grandit",
            6: "Querelles possibles ; limites claires",
            7: "Meilleur long terme ; testé d'abord",
            8: "Lien profond ; clarté avec le temps",
            9: "Correspondance instable ; éviter précipitation",
          },
          friendship: {
            1: "Commence bien ; peut devenir distant",
            2: "Bonne amitié ; soutien mutuel",
            3: "Clash d'ego ; garder léger",
            4: "Peut sembler lourd ; être doux",
            5: "Lien chaleureux ; grandit avec temps",
            6: "Arguments possibles ; respecter limites",
            7: "Lien loyal après tests précoces",
            8: "Lien fort ; éviter suppositions",
            9: "Dynamique on-off ; protéger paix",
          },
          family: {
            1: "Proximité précoce ; effort nécessaire",
            2: "Liens soutenants ; bonne harmonie",
            3: "Déclencheurs sensibles ; parler doucement",
            4: "Sensation de fardeau ; patience requise",
            5: "Miséricorde et facilité ; lien renforce",
            6: "Cycles de tension ; garder respect",
            7: "Respect grandit par devoir",
            8: "Lien proche ; guérir malentendus",
            9: "Cycles de distance ; garder limites",
          },
          work: {
            1: "Bon départ ; progrès peut stagner",
            2: "Fonctionne bien ; travail d'équipe fiable",
            3: "Risque de conflit ; clarifier rôles",
            4: "Lent et lourd ; structure nécessaire",
            5: "Flux productif ; victoires partagées",
            6: "Disputes possibles ; définir processus",
            7: "Équipe forte une fois rôles clairs",
            8: "Haut potentiel ; aligner attentes",
            9: "Appariement volatile ; règles fermes",
          },
        },
        
        // Significations de la Connexion d'Âme par Contexte de Relation
        meanings: {
          // Contexte Universel (tous les types de relations)
          universal: {
            1: {
              short: "Fondation stable avec besoins de renouvellement",
              meaning: "Cette connexion commence souvent forte et se sent stable. Avec le temps, elle peut nécessiter un renouvellement conscient pour éviter la stagnation. Le lien tend à être ancré mais peut sembler routinier sans effort actif.",
              watchOut: "Tenir la connexion pour acquise ou la laisser devenir purement transactionnelle. L'énergie peut plafonner si non rafraîchie.",
              keyToSuccess: "Vérifications régulières, objectifs partagés et pratiques de renouvellement intentionnelles. La gratitude et l'appréciation active maintiennent ce lien vivant.",
            },
            2: {
              short: "Harmonie naturelle et soutien mutuel",
              meaning: "Ce motif soutient l'équilibre et la coopération. Les personnes dans cette connexion se comprennent souvent naturellement et travaillent bien ensemble. Le respect mutuel tend à couler facilement.",
              watchOut: "Sur-dépendance envers l'autre personne ou éviter les conflits nécessaires. L'équilibre peut devenir dépendance s'il n'est pas surveillé.",
              keyToSuccess: "Maintenir la force individuelle tout en chérissant le lien. Des limites saines et une communication honnête soutiennent cette harmonie.",
            },
            3: {
              short: "Friction et croissance par le défi",
              meaning: "Cette connexion peut impliquer des désaccords fréquents ou de la tension. Elle nécessite souvent patience et maturité pour naviguer. La friction peut mener à la croissance si les deux parties s'engagent à y travailler.",
              watchOut: "Conflit constant sans résolution, ou abandonner trop rapidement. Ce chemin teste l'endurance et la régulation émotionnelle.",
              keyToSuccess: "Communication claire, compétences en résolution de conflits et engagement envers la croissance personnelle. La patience (sabr) transforme la friction en sagesse.",
            },
            4: {
              short: "Fardeau et épreuve, poids émotionnel",
              meaning: "Ce motif peut sembler lourd. Une pression émotionnelle, des fardeaux non dits ou des difficultés récurrentes peuvent surgir. Il nécessite souvent un travail intérieur significatif et de la maturité des deux côtés.",
              watchOut: "Épuisement, ressentiment ou négligence de l'auto-soin. Le poids de cette connexion peut drainer l'énergie s'il n'est pas géré sagement.",
              keyToSuccess: "Prioriser la santé émotionnelle, établir des limites et chercher du soutien au besoin. Des routines calmes et des pratiques thérapeutiques aident à alléger la charge.",
            },
            5: {
              short: "Connexion bénie, flux naturel",
              meaning: "Ce motif est traditionnellement favorable. L'équilibre, la croissance et le bénéfice mutuel tendent à se produire plus naturellement. La connexion se sent souvent soutenante et enrichissante.",
              watchOut: "Tenir les bénédictions pour acquises ou devenir distrait par la facilité. Le confort peut mener à la complaisance.",
              keyToSuccess: "Pratiques de gratitude, utiliser la bénédiction pour soutenir les autres et maintenir la discipline spirituelle ensemble.",
            },
            6: {
              short: "Luttes de pouvoir et tests d'ego",
              meaning: "Cette connexion implique souvent des conflits récurrents autour de l'orgueil, du contrôle ou de perspectives différentes. Les deux parties peuvent lutter avec l'ego et le besoin d'avoir raison.",
              watchOut: "Luttes de pouvoir sans fin, cycles de blâme et colère non résolue. L'orgueil amplifie la friction dans ce motif.",
              keyToSuccess: "Conscience de soi, pratiques de pardon et lâcher le besoin de gagner. Le rappel spirituel (dhikr) adoucit l'ego.",
            },
            7: {
              short: "Profondément béni, aligné spirituellement",
              meaning: "C'est traditionnellement le motif le plus favorable. La connexion porte souvent une harmonie spirituelle et un bénéfice mutuel. Les défis avant le lien peuvent le renforcer une fois formé.",
              watchOut: "Orgueil dans la bénédiction ou supposer que la facilité signifie qu'aucun effort n'est nécessaire. L'interférence externe peut perturber ce lien.",
              keyToSuccess: "Humilité, gratitude et alignement sur des valeurs partagées. Protéger la connexion de la négativité et la nourrir avec soin.",
            },
            8: {
              short: "Début lent, fort avec le temps",
              meaning: "Cette connexion peut commencer avec des malentendus ou de la confusion, mais elle devient plus forte avec le temps. La patience (sabr) révèle la profondeur et la résilience de ce lien.",
              watchOut: "Juger la connexion trop rapidement ou abandonner avant qu'elle ne mûrisse. La friction précoce peut induire en erreur.",
              keyToSuccess: "Donner du temps, pratiquer la patience et communiquer doucement. L'intelligence émotionnelle et la compréhension approfondissent ce lien.",
            },
            9: {
              short: "Chemin difficile, nécessite prudence",
              meaning: "Ce motif est traditionnellement associé à des difficultés récurrentes et des ruptures soudaines. Il nécessite vigilance, protection spirituelle et conseil sage. Approcher avec précaution.",
              watchOut: "Perturbations soudaines, schémas de préjudice récurrents et cycles qui se répètent malgré l'effort. Ce chemin nécessite un discernement sérieux.",
              keyToSuccess: "Chercher conseil auprès de conseillers de confiance, augmenter les pratiques spirituelles (duʿāʾ, charité) et honorer votre intuition. Le libre arbitre et la miséricorde divine demeurent.",
            },
          },
          
          // Contexte Amitié
          friendship: {
            1: {
              short: "Stable mais peut devenir distant",
              meaning: "Cette amitié commence souvent bien et se sent confortable. Avec le temps, elle peut se refroidir ou devenir distante sans contact régulier et activités partagées.",
              watchOut: "S'éloigner en raison de la routine ou de la négligence. L'amitié peut devenir superficielle si non activement maintenue.",
              keyToSuccess: "Temps de qualité régulier, intérêts partagés et vérifications fréquentes. De petits gestes d'attention gardent cette amitié chaleureuse.",
            },
            2: {
              short: "Camaraderie naturelle et facilité",
              meaning: "Cette amitié coule naturellement. La compréhension mutuelle, le soutien et la coopération sont courants. Vous avez tendance à faire ressortir le meilleur l'un de l'autre.",
              watchOut: "Co-dépendance ou éviter les conversations difficiles. La facilité peut masquer des problèmes non abordés.",
              keyToSuccess: "Communication honnête, respect mutuel et célébrer la croissance de chacun. Équilibrer la proximité avec une indépendance saine.",
            },
            3: {
              short: "Désaccords fréquents, tension",
              meaning: "Cette amitié peut impliquer des frictions récurrentes ou des malentendus. Patience et maturité sont nécessaires pour maintenir le lien.",
              watchOut: "Arguments constants qui ne sont pas résolus. L'amitié peut devenir épuisante si le conflit n'est pas géré.",
              keyToSuccess: "Limites claires, résolution de conflits et engagement mutuel envers la croissance. Choisissez vos batailles sagement.",
            },
            4: {
              short: "Énergie lourde, épuisement émotionnel",
              meaning: "Cette amitié peut sembler pesante. Un ou les deux peuvent lutter avec un poids émotionnel, et la connexion peut nécessiter un travail émotionnel significatif.",
              watchOut: "Épuisement émotionnel ou soutien unilatéral. L'amitié peut devenir épuisante sans équilibre.",
              keyToSuccess: "Établir des limites, pratiquer l'auto-soin et être honnête sur vos limites. Chercher l'équilibre entre donner et recevoir.",
            },
            5: {
              short: "Joyeux, mutuellement enrichissant",
              meaning: "Cette amitié est traditionnellement bénie. Rire, croissance et soutien mutuel tendent à couler naturellement. Vous vous élevez mutuellement.",
              watchOut: "Tenir l'amitié pour acquise ou se connecter seulement pendant les bons moments. La facilité peut mener à un engagement superficiel.",
              keyToSuccess: "Montrer de la gratitude, se soutenir mutuellement à travers les défis et approfondir le lien avec des valeurs et expériences partagées.",
            },
            6: {
              short: "Clash d'ego, problèmes d'orgueil",
              meaning: "Cette amitié implique souvent des dynamiques de pouvoir et des clash d'ego. Les deux peuvent lutter pour avoir raison ou se sentir supérieurs.",
              watchOut: "Arguments récurrents sur le contrôle, le jugement ou des opinions différentes. L'orgueil empêche la réconciliation.",
              keyToSuccess: "Pratiquer l'humilité, pardonner rapidement et lâcher le besoin d'avoir raison. Se concentrer sur le respect mutuel.",
            },
            7: {
              short: "Lien profond, loyal et béni",
              meaning: "C'est traditionnellement le meilleur motif d'amitié. La loyauté, la confiance et la connexion spirituelle sont fortes. Vous pouvez vous sentir comme des compagnons choisis.",
              watchOut: "Orgueil dans l'amitié ou supposer qu'elle ne nécessite aucun effort. La jalousie ou l'interférence externe peut lui nuire.",
              keyToSuccess: "Protéger le lien, rester humble et y investir constamment. S'aligner sur des valeurs et un but partagés.",
            },
            8: {
              short: "Début maladroit, grandit avec le temps",
              meaning: "Cette amitié peut commencer avec un mauvais jugement ou de la distance. Avec le temps, elle s'approfondit et devient très forte. La patience révèle sa valeur.",
              watchOut: "Abandonner trop tôt en raison de malentendus précoces. L'amitié a besoin de temps pour mûrir.",
              keyToSuccess: "Être patient, donner de l'espace pour la croissance et communiquer ouvertement. La confiance se construit lentement mais solidement.",
            },
            9: {
              short: "Fragile, sujet à des ruptures soudaines",
              meaning: "Cette amitié est vulnérable à des fins soudaines ou à des préjudices récurrents. Prudence et protection spirituelle sont conseillées.",
              watchOut: "Trahisons inattendues, conflits récurrents ou motifs qui ne se résolvent pas. Le lien peut se briser sans avertissement.",
              keyToSuccess: "Établir des limites claires, faire confiance à votre intuition et ne pas forcer la connexion. Les pratiques spirituelles offrent protection.",
            },
          },
          
          // Contexte Familial
          family: {
            1: {
              short: "Stable mais émotionnellement distant",
              meaning: "Ce lien familial se sent souvent stable et fiable, mais la chaleur émotionnelle peut s'estomper avec le temps sans connexion intentionnelle.",
              watchOut: "Se tenir mutuellement pour acquis ou devenir émotionnellement détaché. La relation peut sembler transactionnelle.",
              keyToSuccess: "Temps de qualité régulier, exprimer l'appréciation et créer des rituels partagés. De petits actes d'amour renouvellent le lien.",
            },
            2: {
              short: "Harmonieux et soutenant",
              meaning: "Cette relation familiale tend à être équilibrée et coopérative. Le respect mutuel et la compréhension naturelle sont courants.",
              watchOut: "Éviter les conflits pour garder la paix, ce qui peut mener à du ressentiment non dit. L'équilibre peut devenir évitement.",
              keyToSuccess: "Communication honnête, célébrer l'un l'autre et aborder les problèmes tôt. Maintenir des limites saines.",
            },
            3: {
              short: "Tension et conflit récurrent",
              meaning: "Ce lien familial peut impliquer des désaccords fréquents ou de la friction émotionnelle. Patience et maturité sont requises pour le maintenir.",
              watchOut: "Arguments non résolus qui construisent du ressentiment. La relation peut devenir une source de stress.",
              keyToSuccess: "Thérapie familiale, communication claire et pratiques de pardon. Établir des routines qui favorisent la paix.",
            },
            4: {
              short: "Fardeaux lourds, pression émotionnelle",
              meaning: "Cette relation familiale peut sembler pesante. Des défis émotionnels ou de santé peuvent être présents, nécessitant soin et patience significatifs.",
              watchOut: "Épuisement du soignant ou ressentiment non dit. Le poids peut endommager les deux parties s'il n'est pas géré.",
              keyToSuccess: "Chercher du soutien externe, établir des limites et prioriser l'auto-soin. Partager le fardeau avec d'autres quand possible.",
            },
            5: {
              short: "Lien béni, joie mutuelle",
              meaning: "Cette relation familiale est traditionnellement favorable. L'amour, le soutien et la croissance tendent à couler naturellement. Vous faites ressortir le meilleur l'un de l'autre.",
              watchOut: "Complaisance ou tenir la bénédiction pour acquise. La facilité peut mener à une connexion superficielle.",
              keyToSuccess: "Exprimer la gratitude, approfondir le lien par des valeurs partagées et se soutenir mutuellement à travers toutes les saisons.",
            },
            6: {
              short: "Luttes de pouvoir, clash d'orgueil",
              meaning: "Ce lien familial implique souvent des problèmes de contrôle, de jugement ou d'ego en conflit. Les deux peuvent lutter avec l'autorité et le respect.",
              watchOut: "Arguments sans fin sur avoir raison ou se contrôler mutuellement. L'orgueil empêche la guérison.",
              keyToSuccess: "Pratiquer le pardon, respecter les différences et se concentrer sur l'amour plutôt que le contrôle. Lâcher le besoin de dominer.",
            },
            7: {
              short: "Profondément connecté, aligné spirituellement",
              meaning: "C'est traditionnellement le meilleur motif familial. L'amour profond, la loyauté et la connexion spirituelle sont présents. Le lien se sent sacré.",
              watchOut: "Orgueil dans la relation ou supposer qu'elle est incassable. L'interférence externe peut encore lui nuire.",
              keyToSuccess: "Protéger le lien, rester humble et le nourrir avec soin constant et pratiques spirituelles partagées.",
            },
            8: {
              short: "Incompris au début, se renforce plus tard",
              meaning: "Cette relation familiale peut commencer avec de la distance ou un mauvais jugement. Avec le temps, elle devient un lien fort et durable.",
              watchOut: "Juger trop rapidement ou abandonner avant que le lien ne mûrisse. La friction précoce peut être trompeuse.",
              keyToSuccess: "Donner du temps, pratiquer la patience et communiquer avec empathie. La connexion profonde se développe graduellement.",
            },
            9: {
              short: "Lien fragile, difficulté récurrente",
              meaning: "Cette relation familiale est vulnérable à des ruptures soudaines ou à des préjudices récurrents. Prudence, prière et conseil sage sont essentiels.",
              watchOut: "Séparations inattendues, schémas nuisibles ou cycles qui ne se résolvent pas. Le lien peut se fracturer sans avertissement.",
              keyToSuccess: "Établir des limites, augmenter la protection spirituelle (duʿāʾ, charité) et chercher conseil. Honorer votre bien-être.",
            },
          },
          
          // Contexte Travail
          work: {
            1: {
              short: "Début productif, peut plafonner",
              meaning: "Cette relation de travail commence souvent bien et se sent stable. Avec le temps, elle peut devenir routine ou stagnante sans énergie fraîche.",
              watchOut: "Complaisance ou manque d'innovation. Le partenariat peut devenir improductif si non renouvelé.",
              keyToSuccess: "Fixer de nouveaux objectifs régulièrement, célébrer les victoires et injecter des idées fraîches. La collaboration active prévient la stagnation.",
            },
            2: {
              short: "Travail d'équipe naturel et équilibre",
              meaning: "Cette connexion de travail soutient la collaboration et le respect mutuel. Vous complétez les forces de l'autre et travaillez bien ensemble.",
              watchOut: "Sur-dépendance l'un envers l'autre ou éviter la responsabilisation nécessaire. L'équilibre peut devenir évitement de décisions difficiles.",
              keyToSuccess: "Rôles clairs, retour honnête et responsabilisation mutuelle. Maintenir le professionnalisme et célébrer la collaboration.",
            },
            3: {
              short: "Friction et désaccords",
              meaning: "Cette relation de travail peut impliquer des clash fréquents ou des styles de travail différents. Patience et communication claire sont nécessaires.",
              watchOut: "Conflit constant qui perturbe la productivité. La tension peut nuire à la fois au travail et à la relation.",
              keyToSuccess: "Communication structurée, limites définies et protocoles de résolution de conflits. Se concentrer sur des objectifs partagés.",
            },
            4: {
              short: "Charge de travail lourde, stress et pression",
              meaning: "Cette connexion de travail peut sembler pesante. Stress, surcharge ou charges de travail déséquilibrées peuvent être courants.",
              watchOut: "Épuisement ou ressentiment d'une contribution inégale. Le partenariat peut devenir insoutenable.",
              keyToSuccess: "Distribuer le travail équitablement, communiquer ouvertement sur la capacité et prioriser le bien-être. Chercher du soutien au besoin.",
            },
            5: {
              short: "Productif et mutuellement bénéfique",
              meaning: "Cette relation de travail est traditionnellement favorable. Collaboration, succès et croissance mutuelle tendent à couler naturellement.",
              watchOut: "Tenir le partenariat pour acquis ou devenir complaisant. Le succès peut mener à un manque de vigilance.",
              keyToSuccess: "Maintenir le professionnalisme, reconnaître les contributions et continuer à innover. Le succès partagé nécessite un effort continu.",
            },
            6: {
              short: "Luttes de pouvoir, conflits d'ego",
              meaning: "Cette connexion de travail implique souvent de la compétition, des problèmes de contrôle ou des styles de travail en conflit. Les deux peuvent lutter avec l'autorité.",
              watchOut: "Batailles de pouvoir improductives ou cycles de blâme. L'orgueil empêche une collaboration efficace.",
              keyToSuccess: "Définir des rôles clairs, pratiquer l'humilité et se concentrer sur des objectifs collectifs plutôt que l'ego individuel.",
            },
            7: {
              short: "Excellent partenariat, vision alignée",
              meaning: "C'est traditionnellement le meilleur motif de travail. Vision partagée, confiance et productivité sont fortes. Vous accomplissez de grandes choses ensemble.",
              watchOut: "Orgueil dans le succès ou supposer que le partenariat ne nécessite aucun entretien. La compétition externe peut créer de la friction.",
              keyToSuccess: "Protéger le partenariat, rester aligné sur les valeurs et investir dans la relation. Célébrer les victoires humblement.",
            },
            8: {
              short: "Début lent, se renforce avec le temps",
              meaning: "Cette relation de travail peut commencer avec désalignement ou mauvaise communication. Avec le temps, elle devient très productive et fiable.",
              watchOut: "Abandonner trop tôt en raison de défis précoces. Le partenariat a besoin de temps pour trouver son rythme.",
              keyToSuccess: "Être patient, clarifier les attentes souvent et donner de l'espace pour l'ajustement. Les partenariats solides prennent du temps.",
            },
            9: {
              short: "Instable, sujet à des fins soudaines",
              meaning: "Cette relation de travail est vulnérable à des changements abrupts, des conflits ou une dissolution du partenariat. La prudence est conseillée.",
              watchOut: "Trahisons inattendues, ruptures de contrat ou problèmes récurrents. Le partenariat peut se terminer sans avertissement.",
              keyToSuccess: "Maintenir des limites professionnelles, documenter les accords et faire confiance à vos instincts. Avoir des plans de secours.",
            },
          },
        },
      },
    },

    // Name Destiny
    nameDestiny: {
      // Étiquettes d'Analyse de Base vs Héritée
      coreAnalysis: "Analyse de Base (Votre nom seulement)",
      coreAnalysisDesc: "Reflète votre nature intérieure et identité personnelle.",
      inheritedInfluences: "Influences Héritées",
      inheritedInfluencesDesc: "Montre comment l'énergie de votre mère influence vos conditions externes.",
      whyMotherName: "Pourquoi ajouter le nom de mère?",
      motherNameExplanation: "Votre nom personnel révèle QUI vous êtes (identité intérieure). Le nom de votre mère révèle les conditions externes qui vous entourent×obstacles, protection et héritage familial.",
      motherNameInfo: "Nom Personnel = QUI vous êtes | Nom + Mère = CE qui vous entoure",
      
      nameChart: {
        title: "Carte du nom",
        subtitle: "Plan spirituel de votre nom",
        total: "Total (Ḥadad Kabīr)",
        saghir: "Racine numérique (Ṣaghīr)",
        tabh: "Élément (Ṭabʿ)",
        burj: "Signe du zodiaque (Burj)",
        planet: "Planète",
        day: "Jour",
        hour: "Heure planétaire n°",
        hourTip: "Nième heure après le lever du soleil. Ordre : Soleil, Vénus, Mercure, Lune, Saturne, Jupiter, Mars.",
        elementHarmony: "Harmonie des éléments",
        harmonious: "✨ Harmonieux",
        nourishing: "🌱 Nourrissant",
        transformative: "⚡ Transformatif",
        unified: "💫 Unifié",
      },
      destinyNumber: {
        title: "Votre Nombre de Destinée",
        subtitle: "Nombre et Station de Destinée Centrale",
        sumOfLetters: "Somme de toutes les valeurs des lettres",
        reducedRoot: "Racine numérique réduite",
      },
      quranicResonance: {
        title: "Résonance Coranique",
        subtitle: "Connexion Divine à Travers Votre Nombre",
      },
      motherOrigin: {
        subtitle: "Votre fondation énergétique héritée",
      },
      inputs: {
        motherName: "Nom de la mère",
        motherHint: "Optionnel × ajoutez pour voir les influences héritées et l'harmonie familiale.",
        motherOptional: "Nom de la mère (optionnel pour les influences héritées)",
      },
      origin: {
        title: "Votre origine spirituelle",
        motherElement: "Élément du nom de la mère (Umm Ḥadad)",
        inheritance: "Héritage des éléments",
        expression: "Expression",
        foundation: "Fondation",
        yourExpression: "Votre expression",
        yourFoundation: "Votre fondation",
        insight: "Aperçu",
        kabir: "Kabīr",
        saghir: "Ṣaghīr",
        hadath: "Ḥadath",
      },
      geometry: {
        title: "Géométrie des lettres (Handasa al-Ḥurūf)",
        vertical: "Vertical (ʿAmūdī)",
        round: "Rond (Mudawwar)",
        flat: "Plat (Musaṭṭaḥ)",
        angular: "Angulaire (Zāwiya)",
        none: "Aucun dans votre nom",
        profile: "Votre profil géométrique",
      },
      triad: {
        title: "Votre triade de l'âme",
        lifeDestiny: "Destin de vie",
        soulUrge: "Appel de l'âme",
        outerPersonality: "Personnalité extérieure",
      },
      guidance: {
        title: "Conseils pratiques",
        yourPath: "Votre chemin",
        yourPathDesc: "Explique la direction et l'énergie naturelle de votre vie.",
        spiritualPractice: "Pratique spirituelle",
        spiritualPracticeDesc: "Habitudes ou réflexions quotidiennes pour équilibrer votre élément.",
        quranicGuidance: "Guidance coranique",
        quranicGuidanceDesc: "Un verset lié à l'énergie de votre nom, uniquement pour la réflexion.",
        practicalAction: "Action pratique",
        practicalActionDesc: "Actions concrètes que vous pouvez entreprendre en accord avec votre destin.",
        shadowToWatch: "Ombre à surveiller",
        shadowToWatchDesc: "Tendances dont il faut être conscient qui peuvent entraver votre croissance.",
      },
      disclaimer: {
        reflectionOnly: "Pour la réflexion uniquement × aucune divination ni avis juridique.",
      },
      elementChart: {
        title: "Carte des éléments du nom",
        subtitle: "Composition et équilibre élémentaire",
        dominant: "Élément dominant",
        personality: "Réflexion sur la personnalité",
        balancingDhikr: "Dhikr d'équilibrage",
        fire: {
          name: "Feu",
          personality: "Votre nom porte l'énergie de la passion, du courage et de l'action audacieuse. Vous êtes naturellement poussé à diriger, initier et transformer.",
        },
        air: {
          name: "Air",
          personality: "Votre nom incarne la clarté intellectuelle, la communication et l'adaptabilité. Vous êtes attiré par la pensée, l'apprentissage et la connexion des idées.",
        },
        water: {
          name: "Eau",
          personality: "Votre nom résonne avec la profondeur émotionnelle, l'empathie et l'intuition. Vous guérissez, nourrissez et suivez naturellement les rythmes de la vie.",
        },
        earth: {
          name: "Terre",
          personality: "Votre nom vous ancre dans le pragmatisme, la fiabilité et la patience. Vous excellez à construire, organiser et apporter de la stabilité.",
        },
        dhikr: {
          fire: "Yā Laṭīf (Le Doux) × pour adoucir l'intensité",
          air: "Yā Ḥakīm (Le Sage) × pour ancrer les pensées",
          water: "Yā Nūr (La Lumière) × pour illuminer les émotions",
          earth: "Yā Fattāḥ (Celui qui ouvre) × pour inviter le flux",
        },
      },
      // Aperçus de Résonance Supérieure
      higherResonance: {
        title: "Aperçus de Résonance Supérieure",
        subtitle: "Nom Divin et Énergie de Couleur dans Votre Nom",
      },
      divineNameResonance: {
        title: "Résonance du Nom Divin",
        subtitle: "Votre nom porte la vibration de :",
        meaning: "Signification",
        spiritualInfluence: "Influence Spirituelle",
        reflection: "Ce que cela signifie pour vous",
        reflectionTip: "Conseil de Réflexion",
      },
      colorResonance: {
        title: "Résonance de Couleur du Nom",
        subtitle: "L'énergie de couleur naturelle de votre nom est :",
        primary: "Couleur Primaire",
        secondary: "Couleur Secondaire",
        meaning: "Signification",
        bestColors: "Meilleures couleurs à porter / utiliser",
        avoidColors: "Couleurs à éviter",
        tip: "Conseil",
        tipIntro: "Utilisez ces couleurs pour les vêtements, l'écriture, la méditation ou les espaces personnels.",
      },
      
      // Sélecteurs de Mode
      inputTypeLabel: "Type d'Entrée",
      understandingLevelLabel: "Niveau de Compréhension",
      
      // Types d'Entrée
      inputTypes: {
        namePerson: "Nom (Personne)",
        nameMotherPair: "Nom + Mère",
        divineName: "Nom Divin",
        quranVerse: "Verset Coranique",
        sentence: "Phrase",
        freeText: "Texte Libre",
      },
      
      // Niveaux de Compréhension
      levels: {
        beginner: "Débutant",
        intermediate: "Intermédiaire",
        classical: "Classique",
      },
      
      // Résultats
      results: {
        yourResults: "Vos Résultats",
        newCalculation: "Nouveau Calcul",
        keyTakeaways: "Points Clés",
        practicalGuidance: "Conseils Pratiques",
        do: "Faire",
        avoid: "Éviter",
        bestTime: "Meilleur Moment",
        sacredNumbers: "Nombres Sacrés",
        grandTotal: "Total",
        total: "Total",
        essence: "Essence",
        completSum: "Somme complète",
        digitalRoot: "Racine numérique",
        kabir: "Kabīr",
        saghir: "Ṣaghīr",
        yourPersonalElement: "Votre Élément Personnel (Ṭabʿ)",
        enhancing: "Amélioration...",
        personalizeExplanation: "✨ Personnaliser",
        enhancedExplanation: "Explication Améliorée",
        personalizedInsight: "💫 Aperçu Personnel",
        divineNameResonance: "Résonance du Nom Divin",
        divineNameResonanceSubtitle: "Le Nom Divin qui résonne avec votre nom",
        elementalComposition: "Composition Élémentaire",
        elementalCompositionSubtitle: "Basé sur les lettres de votre nom (expression extérieure).",
        dominantExpression: "Expression Dominante : ",
        weakElement: "Élément Faible : ",
        balancingActions: "Actions d'Équilibrage",
        zodiacInfluence: "Influence Zodiacale",
        zodiacInfluenceSubtitle: "La planète maîtresse reflète votre nature ; la planète heure active reflète le timing actuel.",
        zodiacInfluenceTooltip: "Le Jour de Puissance vient de la planète maîtresse de votre Burj. Le Meilleur Moment est une fenêtre de pratique basée sur l'élément et la saison.",
        rulingPlanet: "Planète Maîtresse",
        dayOfPower: "Jour de Puissance (Maître du Burj)",
        activeHourPlanet: "Planète Heure Active",
        burjInsight: "Explication du Burj",
        reflectionPrompt: "Quel mot ou phrase ressort le plus pour votre situation actuelle ?",
        advancedContent: "Contenu Avancé",
        classicalDetails: "Détails Classiques",
        classicalDetailsSubtitle: "Terminologie maghribine traditionnelle",
        divisibleBy4: "Divisible par 4 ?",
        divisibleBy12: "Divisible par 12 ?",
        yes: "Oui ✓",
        no: "Non",
        personKabir: "Kabir de la Personne :",
        motherKabir: "Kabir de la Mère :",
        deepInterpretation: "Interprétation Profonde",
        deepInterpretationSubtitle: "Sirr, Basṭ, Kamāl",
        deepInterpretationText: "Cette section est réservée à l'interprétation classique avancée de Sirr (essence cachée), Basṭ (expansion) et Kamāl (perfection). Des calculs supplémentaires peuvent être ajoutés dans les futures mises à jour.",
        maghribiSystem: "Système Maghribi",
        goBack: "Retour",
        noResults: "Aucun résultat à afficher",
        disclaimer: "Pour réflexion uniquement • Pas de divination ou de décision juridique",
      },
      
      // Carte Élément Personnel
      personalElement: {
        title: "VOTRE ÉLÉMENT PERSONNEL (ṬABʿ)",
        fire: "Feu",
        air: "Air",
        water: "Eau",
        earth: "Terre",
        qualities: {
          fire: "Chaud & Sec",
          air: "Chaud & Humide",
          water: "Froid & Humide",
          earth: "Froid & Sec",
        },
        description: {
          fire: "Énergie passionnée et dynamique. Pouvoir transformateur qui anime l'action et illumine le chemin à suivre.",
          air: "Essence intellectuelle et communicative. Sagesse fluide qui relie les idées et facilite la compréhension.",
          water: "Sagesse émotionnelle et intuitive. Nature adaptable qui traverse les défis avec grâce et profondeur.",
          earth: "Fondation ancrée et stable. Force nourricière qui assure sécurité et croissance constante.",
        },
      },
      
      // Carte Résonance du Nom Divin
      divineResonance: {
        title: "Résonance du Nom Divin",
        abjadNote: "Ce Nom résonne avec votre nom à travers le cycle Abjad de 28 lettres.",
        howDerived: "Comment il a été dérivé",
        abjadTotalLabel: "Total Abjad (votre nom)",
        resonanceIndexLabel: "Indice de Résonance (1–28)",
        resonantLetterLabel: "Lettre Résonante",
        letterBreakdownTitle: "Décomposition lettre par lettre",
        dhikrTitle: "Dhikr (Optionnel)",
        suggestedCount: "Nombre suggéré :",
        dhikrDescription: "Ce Nom Divin peut être utilisé dans le dhikr (rappel d'Allah), en recherchant la proximité, le pardon ou l'aide selon son intention (niyyah).",
      },
      
      // Interface du Formulaire
      form: {
        title: "Destinée du Nom",
        heroTitle: "Calculateur de Destinée du Nom",
        heroSubtitle: "Découvrez le plan spirituel encodé dans votre nom à travers la numérologie Abjad sacrée",
        enterNames: "Entrez les Noms",
        bothArabic: "Les deux noms doivent être en écriture arabe",
        yourName: "Votre Nom",
        mothersName: "Nom de la Mère",
        latinNameLabel: "Nom Latin (Français/Anglais)",
        latinPlaceholderPerson: "ex., Ibrahima, Amadou, Ousmane",
        latinPlaceholderMother: "ex., Fatima, Khadija, Aisha",
        arabicNameLabel: "Nom Arabe *",
        arabicPlaceholderPerson: "محمد",
        arabicPlaceholderMother: "فاطمة",
        keyboardButton: "Clavier",
        validationError: "Veuillez entrer un nom arabe valide",
        calculateButton: "✨ Calculer la Destinée",
        calculating: "Calcul en cours...",
        incompleteForm: "Formulaire Incomplet",
        incompleteMessage: "Veuillez entrer les deux noms pour continuer.",
        calculationError: "Erreur de Calcul",
        calculationErrorMessage: "Une erreur s'est produite lors de la génération des insights de destinée.",
        educationTitle: "Qu'est-ce que la Destinée du Nom ?",
        educationContent: "La Destinée du Nom (Qadr al-Asmāʾ) révèle le plan spirituel encodé dans votre nom et le nom de votre mère. En utilisant la numérologie Abjad, nous découvrons les nombres sacrés, l'équilibre élémentaire et les influences célestes qui guident votre chemin de vie.",
        discoveryTitle: "Ce Que Vous Découvrirez",
        discoveryItems: {
          numbers: { icon: "🔢", title: "Nombres Sacrés", desc: "Kabir (total) et Saghir (essence)" },
          element: { icon: "💧", title: "Élément", desc: "Votre élément Tab—Eau, Feu, Terre ou Air" },
          zodiac: { icon: "⭐", title: "Zodiaque", desc: "Votre Burj (constellation) et planète maîtresse" },
          guidance: { icon: "🌙", title: "Guidance", desc: "Insights spirituels pour votre parcours" },
        },
        examplesTitle: "Exemples de Noms",
        examplesContent: "Toutes les entrées doivent être en écriture arabe pour un calcul précis :",
        privacyTitle: "Votre Confidentialité",
        privacyContent: "🔒 Les calculs se font entièrement sur votre appareil. Vos noms ne sont jamais stockés, synchronisés ou partagés—préservant la confidentialité de votre parcours sacré.",
        footer: "Pour réflexion uniquement • Pas de divination ni d'avis juridique",
      },
    },

    planetaryHours: {
      title: "Heures Planétaires",
      currentHour: "Heure Planétaire Actuelle",
      planet: "Planète",
      startTime: "Heure de Début",
      endTime: "Heure de Fin",
      dayHours: "Heures du Jour",
      nightHours: "Heures de la Nuit",

      planets: {
        sun: "Soleil",
        moon: "Lune",
        mars: "Mars",
        mercury: "Mercure",
        jupiter: "Jupiter",
        venus: "Vénus",
        saturn: "Saturne",
      },
    },

    // Planet names
    planets: {
      sun: "Soleil",
      moon: "Lune",
      mars: "Mars",
      mercury: "Mercure",
      jupiter: "Jupiter",
      venus: "Vénus",
      saturn: "Saturne",
    },

    // Zodiac signs
    zodiac: {
      aries: "Bélier",
      taurus: "Taureau",
      gemini: "Gémeaux",
      cancer: "Cancer",
      leo: "Lion",
      virgo: "Vierge",
      libra: "Balance",
      scorpio: "Scorpion",
      sagittarius: "Sagittaire",
      capricorn: "Capricorne",
      aquarius: "Verseau",
      pisces: "Poissons",
    },

    // Aspects
    aspects: {
      conjunction: "Conjonction",
      sextile: "Sextile",
      square: "Carré",
      trine: "Trigone",
      opposition: "Opposition",
      applying: "appliquant",
      separating: "séparant",
      orb: "orbe",
    },

    // UI Labels
    ui: {
      bestTime: "Meilleur Moment",
      avoid: "Éviter",
      recommended: "Recommandé",
      unlockPremium: "Débloquer Premium",
      addNameToActivate: "Ajoutez votre nom pour activer",
      forReflectionOnly: "Pour réflexion uniquement • Pas un avis religieux",
      seeFullDetails: "Voir tous les détails",
      seeLess: "Voir moins",
      upgradeNow: "Mettre à niveau",
      learnMore: "En savoir plus",
    },

    // Day names
    days: {
      sunday: "Dimanche",
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
    },

    // Divine Names (28 names for resonance calculation)
    divineNames: {
      allah: { meaning: "Le Dieu, L'Unique Vrai Dieu" },
      alBaqi: { meaning: "L'Éternel, Le Subsistant" },
      alJami: { meaning: "Le Rassembleur, Celui Qui Unit" },
      adDaim: { meaning: "L'Éternel, Le Permanent" },
      alHadi: { meaning: "Le Guide, Celui Qui Dirige" },
      alWadud: { meaning: "Le Bien-Aimant, Le Très Affectueux" },
      azZaki: { meaning: "Le Pur, L'Immaculé" },
      alHakim: { meaning: "Le Sage, Le Très Sage" },
      atTahir: { meaning: "Le Purificateur, Le Pur" },
      alYaqin: { meaning: "Le Certain, La Certitude" },
      alKarim: { meaning: "Le Généreux, Le Très Généreux" },
      alLatif: { meaning: "Le Subtil, Le Très Bienveillant" },
      alMumin: { meaning: "Le Croyant, Celui Qui Donne la Foi" },
      anNur: { meaning: "La Lumière, L'Illuminateur" },
      asSalam: { meaning: "La Paix, La Source de Paix" },
      alAlim: { meaning: "L'Omniscient, Celui Qui Sait Tout" },
      alFard: { meaning: "L'Unique, Le Seul et Unique" },
      asSabur: { meaning: "Le Patient, Le Très Patient" },
      alQadir: { meaning: "Le Capable, Le Tout-Puissant" },
      arRahman: { meaning: "Le Tout Miséricordieux, Le Bienfaiteur" },
      ashShakur: { meaning: "Le Reconnaissant, Celui Qui Apprécie" },
      atTawwab: { meaning: "Celui Qui Accepte le Repentir" },
      athThabit: { meaning: "Le Ferme, L'Inébranlable" },
      alKhabir: { meaning: "Le Conscient, Le Très Informé" },
      dhulJalal: { meaning: "Le Seigneur de la Majesté et de la Générosité" },
      adDarr: { meaning: "Celui Qui Afflige, Le Correcteur" },
      azZahir: { meaning: "Le Manifeste, L'Évident" },
      alGhani: { meaning: "Le Riche, L'Autosuffisant" },
    },

    stations: {
      1: "Badʾ (البدء) - Commencement",
      2: "Tawāfuq (التوافق) - Harmonie",
      3: "Ibdāʿ (الإبداع) - Créativité",
      4: "Istiqrār (الاستقرار) - Stabilité",
      5: "Taḥawwul (التحول) - Transformation",
      6: "Khidma (الخدمة) - Service",
      7: "Ḥikma (الحكمة) - Sagesse Divine",
      8: "Qudra (القدرة) - Pouvoir Divin",
      9: "Kamāl (الكمال) - Achèvement",
      11: "Illumination Spirituelle",
      22: "Maître Constructeur",
      33: "Maître Enseignant",
    },

    footer: {
      tagline: "Numérologie Islamique & Calculs Spirituels",
      rights: "Tous droits réservés",
      about: "À Propos",
      contact: "Contact",
      privacy: "Politique de Confidentialité",
    },

    // SPIRITUAL STATIONS - Detailed descriptions
    spiritualStations: {
      1: {
        name: "Tawḥīd",
        meaning: "Unité Divine",
        quality: "Leadership, Indépendance, Originalité",
        shadow: "Orgueil, Isolement, Rigidité",
        practice: "Méditez sur l'unité divine. Réfléchissez : « Tout pouvoir appartient à l'Un. »",
        verse: "Dis : Il est Allah, l'Unique (112:1)",
        practical: "Lancez de nouveaux projets, prenez des initiatives, pratiquez l'autonomie. Idéal pour le travail solo."
      },
      2: {
        name: "Muʿāwana",
        meaning: "Assistance Divine",
        quality: "Coopération, Équilibre, Diplomatie",
        shadow: "Indécision, Dépendance, Évitement des conflits",
        practice: "Recherchez l'harmonie dans les relations. Réfléchissez : « Deux valent mieux qu'un. »",
        verse: "Entraidez-vous dans la justice (5:2)",
        practical: "Construisez des partenariats, médiez les conflits, créez l'équilibre. Bon pour le travail d'équipe."
      },
      3: {
        name: "Ibdāʿ",
        meaning: "Expression Créative",
        quality: "Créativité, Communication, Joie",
        shadow: "Énergie dispersée, Superficialité, Commérages",
        practice: "Exprimez l'inspiration divine. Réfléchissez : « La beauté se manifeste à travers moi. »",
        verse: "Lis au nom de ton Seigneur qui a créé (96:1)",
        practical: "Créez de l'art, écrivez, parlez en public, enseignez. Canalisez l'énergie créative."
      },
      4: {
        name: "Istiqrār",
        meaning: "Stabilité",
        quality: "Fondation, Ordre, Discipline",
        shadow: "Rigidité, Limitation, Entêtement",
        practice: "Construisez des fondations solides. Réfléchissez : « La patience est la clé du paradis. »",
        verse: "Allah aime ceux qui sont fermes et constants (61:4)",
        practical: "Organisez, planifiez, construisez des systèmes, établissez des routines. Créez la structure."
      },
      5: {
        name: "Taḥawwul",
        meaning: "Transformation",
        quality: "Liberté, Aventure, Changement",
        shadow: "Agitation, Irresponsabilité, Addiction",
        practice: "Embrassez le changement sacré. Réfléchissez : « Tout change sauf la Face de Dieu. »",
        verse: "Allah ne change pas l'état d'un peuple tant qu'ils ne se changent pas eux-mêmes (13:11)",
        practical: "Voyagez, apprenez de nouvelles compétences, adaptez-vous au changement. Recherchez la variété et l'expérience."
      },
      6: {
        name: "Khidma",
        meaning: "Service",
        quality: "Responsabilité, Soin, Harmonie",
        shadow: "Martyre, Ingérence, Perfectionnisme",
        practice: "Servez avec amour. Réfléchissez : « Les meilleurs sont ceux qui profitent aux autres. »",
        verse: "Les meilleurs d'entre vous sont ceux qui nourrissent les autres (Ahmad)",
        practical: "Aidez la famille, soignez les autres, créez la beauté. Concentrez-vous sur la maison et la communauté."
      },
      7: {
        name: "Ḥikma",
        meaning: "Sagesse Divine",
        quality: "Analyse, Introspection, Spiritualité",
        shadow: "Isolement, Cynisme, Suranalyse",
        practice: "Cherchez la connaissance intérieure. Réfléchissez : « Connais-toi pour connaître ton Seigneur. »",
        verse: "Il donne la sagesse à qui Il veut (2:269)",
        practical: "Étudiez, recherchez, méditez, retirez-vous. Approfondissez la pratique spirituelle."
      },
      8: {
        name: "Qudra",
        meaning: "Pouvoir Divin",
        quality: "Abondance, Autorité, Accomplissement",
        shadow: "Cupidité, Domination, Matérialisme",
        practice: "Gérez l'abondance divine. Réfléchissez : « Je suis un canal pour la provision divine. »",
        verse: "Quoi que vous dépensiez, Il le remplacera (34:39)",
        practical: "Gérez les ressources, dirigez des organisations, créez la richesse. Construisez l'influence."
      },
      9: {
        name: "Kamāl",
        meaning: "Achèvement",
        quality: "Compassion, Sagesse, Amour Universel",
        shadow: "Martyre, Manipulation émotionnelle, Évasion",
        practice: "Servez l'humanité. Réfléchissez : « Je libère avec amour et confiance. »",
        verse: "Aujourd'hui J'ai parachevé pour vous votre religion (5:3)",
        practical: "Terminez les projets, pardonnez, lâchez prise. Enseignez et mentorez les autres."
      },
      11: {
        name: "Illumination Spirituelle",
        meaning: "Éveil spirituel",
        quality: "Intuition, Inspiration, Vision",
        shadow: "Idéalisme excessif, Déconnexion",
        practice: "Canalisez l'inspiration supérieure",
        verse: "Lumière sur lumière",
        practical: "Enseignez, inspirez, guidez avec sagesse spirituelle"
      },
      22: {
        name: "Maître Constructeur",
        meaning: "Manifestation",
        quality: "Construction, Vision pratique, Impact",
        shadow: "Tension, Attentes irréalistes",
        practice: "Construisez des structures durables",
        verse: "Construire avec sagesse",
        practical: "Créez des systèmes, des organisations, un héritage durable"
      },
      33: {
        name: "Maître Enseignant",
        meaning: "Compassion universelle",
        quality: "Guérison, Enseignement, Service",
        shadow: "Surcharge, Sacrifice de soi",
        practice: "Enseignez et guérissez avec amour",
        verse: "Guidez avec compassion",
        practical: "Mentorez, guérissez, servez l'humanité"
      }
    },

    // GEOMETRY - Letter shapes
    geometryKeywords: {
      vertical: ["Aspiration", "Portée spirituelle", "Objectifs", "Croissance"],
      round: ["Compassion", "Plénitude", "Cycles", "Étreinte"],
      flat: ["Stabilité", "Ancrage", "Fondation", "Équilibre"],
      angular: ["Décision", "Acuité", "Clarté", "Transformation"]
    },
    
    geometryProfiles: {
      verticalDominant: "Forte énergie ascendante. Vous aspirez naturellement aux idéaux et aux objectifs supérieurs. Chercheur spirituel avec une dynamique aspirationnelle.",
      roundDominant: "Énergie embrassante et nourricière. Vous contenez et complétez les cycles avec chaleur émotionnelle. Capacité naturelle de compassion.",
      flatDominant: "Fondation ancrée et stable. Vous créez une expansion horizontale avec stabilité pratique. Énergie fiable et connectée à la terre.",
      angularDominant: "Énergie tranchante et décisive. Vous traversez la complexité avec clarté et transformation. Approche directe et ciblée.",
      balanced: "Énergie géométrique équilibrée. Vous avez une polyvalence d'expression, capable d'être aspirationnel, nourricier, ancré ou décisif."
    },

    // INHERITANCE - Mother's element analysis
    inheritanceSame: "Vous exprimez et héritez la même énergie {element}. Identité élémentaire forte et cohérente avec des racines profondes.",
    
    inheritanceCompatible: {
      fireAir: "Vous exprimez avec le Feu mais avez des racines Air. Votre fondation Air alimente votre action Feu - comme le vent attisant les flammes.",
      airFire: "Vous exprimez avec l'Air mais avez des racines Feu. Votre fondation Feu énergise votre mouvement Air - comme la chaleur créant le vent.",
      waterEarth: "Vous exprimez avec l'Eau mais avez des racines Terre. Votre fondation Terre contient votre flux Eau - comme un lit de rivière retenant l'eau.",
      earthWater: "Vous exprimez avec la Terre mais avez des racines Eau. Votre fondation Eau nourrit votre structure Terre - comme la pluie nourrissant le sol."
    },
    
    inheritanceOpposing: {
      fireWater: "Vous exprimez avec le Feu mais avez des racines Eau. Cela crée une tension dynamique - passion équilibrée par profondeur émotionnelle.",
      waterFire: "Vous exprimez avec l'Eau mais avez des racines Feu. Cela crée une tension dynamique - profondeur émotionnelle alimentée par passion intérieure.",
      airEarth: "Vous exprimez avec l'Air mais avez des racines Terre. Cela crée une tension dynamique - mouvement équilibré par stabilité.",
      earthAir: "Vous exprimez avec la Terre mais avez des racines Air. Cela crée une tension dynamique - structure construite sur liberté."
    },

    // PLANETARY QUALITIES
    planetaryQualities: {
      Sun: {
        quality: "Leadership, Autorité, Succès",
        favorable: ["Lancer de nouvelles entreprises", "Rechercher des promotions", "Parler en public", "Projets créatifs"],
        avoid: ["Décisions égoïstes", "Confrontations avec l'autorité"]
      },
      Moon: {
        quality: "Émotion, Intuition, Foyer",
        favorable: ["Affaires familiales", "Guérison émotionnelle", "Travail sur les rêves", "Activités nourricières"],
        avoid: ["Décisions importantes (émotions troublées)", "Questions juridiques"]
      },
      Mercury: {
        quality: "Communication, Apprentissage, Commerce",
        favorable: ["Étude", "Écriture", "Affaires commerciales", "Réseautage social", "Voyage court"],
        avoid: ["Signer des contrats si Mercure rétrograde", "Commérages"]
      },
      Venus: {
        quality: "Amour, Beauté, Harmonie",
        favorable: ["Romance", "Art", "Socialisation", "Embellissement", "Pacification"],
        avoid: ["Critique sévère", "Conflit"]
      },
      Mars: {
        quality: "Action, Courage, Compétition",
        favorable: ["Exercice physique", "Action assertive", "Courage nécessaire", "Chirurgie"],
        avoid: ["Colère", "Décisions impulsives", "Débuter des conflits"]
      },
      Jupiter: {
        quality: "Expansion, Sagesse, Abondance",
        favorable: ["Questions juridiques", "Éducation", "Pratique spirituelle", "Planification long terme", "Générosité"],
        avoid: ["Excès", "Surconfiance"]
      },
      Saturn: {
        quality: "Structure, Discipline, Karma",
        favorable: ["Travail acharné", "Engagements long terme", "Relations avec autorités", "Questions immobilières"],
        avoid: ["Activités ludiques", "Attentes de résultats rapides"]
      }
    },

    // DAILY DHIKR
    dailyDhikr: {
      Fire: {
        benefit: "Renforce la volonté et le courage",
        time: "Après Fajr"
      },
      Water: {
        benefit: "Apporte l'aisance dans les difficultés, adoucit les cœurs",
        time: "Après Maghrib"
      },
      Air: {
        benefit: "Augmente la connaissance et la clarté",
        time: "Après ʿIshā"
      },
      Earth: {
        benefit: "Accorde la patience et la constance",
        time: "Avant de dormir"
      }
    },

    // PERSONAL YEAR THEMES
    personalYearThemes: {
      1: "Nouveaux départs, planter des graines, indépendance",
      2: "Partenariats, patience, coopération",
      3: "Expression créative, joie, expansion sociale",
      4: "Construire des fondations, travail acharné, stabilité",
      5: "Changement, liberté, aventure, événements inattendus",
      6: "Responsabilité, service, affaires familiales, amour",
      7: "Croissance spirituelle, introspection, étude, repos",
      8: "Accomplissement, pouvoir, questions financières, reconnaissance",
      9: "Achèvement, libération, humanitarisme, fins menant à nouveaux départs"
    },

    // COMPATIBILITY - Additional strings
    compatibilityAnalysis: {
      soulJourney: "Le voyage de votre âme passe par la station de",
      destinyInterpretation: "Votre destin de vie ({destiny}) vous appelle à {quality}. Votre âme aspire profondément à {soulQuality}, tandis qu'extérieurement vous exprimez {personalityQuality}. L'intégration vient lorsque vous alignez ces trois dimensions.",
      uniqueDynamic: "Dynamique Unique",
      eachRelationshipTeaches: "Chaque relation enseigne des leçons uniques",
      opportunityForGrowth: "Opportunité de croissance",
      learningThroughDifferences: "Apprentissage à travers les différences",
      balanceIndividuality: "Équilibrer l'individualité avec l'union"
    },

    // WEEKLY RESULTS COMPONENT
    weeklyResults: {
      unableToGenerate: "Impossible de générer les prévisions hebdomadaires. Veuillez entrer un nom arabe valide.",
      badges: {
        best: "Meilleur",
        gentle: "Doux",
        focus: "Focus"
      },
      clickIndicator: "▼",
      timeWindows: "Fenêtres horaires",
      morning: "Matin",
      midday: "Midi",
      afternoon: "Après-midi",
      evening: "Soir",
      closeDetails: "Fermer les détails",
      energyType: "Type d'énergie",
      bestFor: "Idéal pour",
      avoid: "À éviter",
      planetalPhase: "Phase planétaire",
      peakClarity: "Clarté maximale",
      socialEnergy: "Énergie sociale",
      endurancePhase: "Phase d'endurance",
      reviewTime: "Temps de révision",
      classicalTeaching: "Enseignement classique (Leçon",
      forEverythingTime: "Pour chaque chose il y a un temps",
      successFromRightAction: "Le succès vient de la bonne action au bon moment",
      allTips: "Tous les conseils",
      closesIn: "Se termine dans",
      nextWindow: "Prochaine fenêtre",
      peakPerformanceDay: "Jour de performance maximale",
      steadyProgressDay: "Jour de progrès régulier",
      restReflectionDay: "Jour de repos et réflexion",
      overallEnergy: "Énergie globale",
      thisMonthFlow: "Flux de ce mois"
    },

    // DESTINY RESULTS COMPONENT
    destinyResults: {
      unableToCalculate: "Impossible de calculer la destinée. Veuillez entrer un nom.",
      loadingVerse: "Chargement du verset coranique...",
      verseError: "Impossible de charger le verset pour le moment. Veuillez actualiser ou visiter Quran.com directement.",
      arabicText: "Texte arabe",
      englishTranslation: "Traduction anglaise",
      readFullVerse: "Lire le verset complet sur Quran.com",
      ayahOf: "Ayah {ayah} de {total}",
      noVerseData: "Aucune données de verset disponibles pour cette résonance.",
      kabir: "Kabīr",
      hadath: "Ḥadath",
      grandTotal: "Total général",
      element: "Élément",
      strengths: "Forces",
      growthAreas: "Domaines de croissance",
      yourNumbers: "Vos nombres",
      corePersonality: "Personnalité fondamentale",
      innerDesires: "Désirs intérieurs",
      howOthersSee: "Comment les autres vous voient",
      lifePurpose: "But de la vie",
      lifePath: "Chemin de vie",
      soulUrge: "Appel de l'âme",
      personality: "Personnalité",
      destiny: "Destinée",
      coreTalents: "Vos talents principaux & forces naturelles. Les capacités avec lesquelles vous êtes né.",
      whatMakesHappy: "Ce qui vous rend vraiment heureux. Vos désirs les plus profonds & épanouissement intérieur.",
      impressionYouGive: "L'impression que vous donnez. Comment les gens vous voient & vous expérimentent au début.",
      ultimateGoal: "Votre but de vie & ce que vous êtes destiné à accomplir. Votre objectif ultime.",
      specialNumbers: "Nombres spéciaux et leçons",
      lessonsToLearn: "Leçons à apprendre",
      lessonsDescription: "Ces nombres représentent les leçons que votre âme veut apprendre dans cette vie. Ce ne sont pas des obstacles - ce sont des opportunités de croissance.",
      blessedNumbers: "Nombres bénis",
      blessedDescription: "Ce sont des nombres puissants liés à la tradition spirituelle. Ils apportent des bénédictions spéciales et une protection spirituelle à votre vie."
    },

    // COMPATIBILITY RESULTS COMPONENT
    compatibilityResults: {
      unableToCalculate: "Impossible de calculer la compatibilité. Veuillez vous assurer que les deux noms sont entrés.",
      overallCompatibility: "Compatibilité globale",
      threeAnalysisMethods: "Trois méthodes d'analyse",
      spiritualDestiny: "Destinée spirituelle",
      elementalTemperament: "Tempérament élémentaire",
      planetaryCosmic: "Cosmique planétaire",
      remainder: "Reste",
      sharedElement: "Élément",
      recommendations: "Recommandations",
      strengths: "Forces",
      challenges: "Défis",
      // Letter Chemistry Feature
      letterChemistry: "Chimie des Lettres",
      letterChemistryArabic: "Zawāj al-Ḥurūf",
      letterChemistryDesc: "Montre le tempérament élémentaire entre les deux noms. Chaque lettre porte une énergie de Feu, Air, Eau ou Terre × leur mélange forme l'équilibre émotionnel et énergétique de votre connexion.",
      combinedHarmony: "Harmonie Combinée",
      combinedHarmonyExplain: "Plus le pourcentage est élevé, plus le flux des éléments est harmonieux",
      balancingDhikr: "Dhikr d'Équilibre",
      balancingDhikrContext: "Ces dhikr aident à équilibrer les éléments dominants pour une meilleure harmonie.",
      temperament: "Tempérament",
      for: "Pour",
      // Element names
      fire: "Feu",
      air: "Air",
      water: "Eau",
      earth: "Terre",
      // Element temperament descriptions
      fireTemperament: "Tempérament Feu × passionné, créatif, audacieux",
      airTemperament: "Tempérament Air × rapide, intellectuel, communicatif",
      waterTemperament: "Tempérament Eau × calme, émotionnel, intuitif",
      earthTemperament: "Tempérament Terre × stable, pratique, ancré",
      // Balance Advice for Element Pairs
      balanceAdvice: {
        fireFire: "Pratiquez le dhikr calmement ensemble, évitez les décisions hâtives.",
        fireAir: "Synergie créative! Bon pour les projets et idées, mais prenez du temps pour vous calmer ensemble.",
        fireWater: "Équilibrez la passion avec la patience. Refroidissez les flammes avec compréhension.",
        fireEarth: "Combinez vision et planification. Laissez le feu inspirer, la terre exécuter.",
        airAir: "Exprimez les idées clairement, mais ancrez-les dans l'action.",
        airWater: "Exprimez vos sentiments clairement par les mots ou l'art. Écrivez ou chantez ensemble.",
        airEarth: "Les idées rencontrent la praticité. Discutez, puis construisez ensemble.",
        waterWater: "Nourrissez les émotions de l'autre. Créez des espaces sûrs et paisibles.",
        waterEarth: "Cultivez le repos créatif ensemble. Cuisinez, jardinez ou créez de la beauté.",
        earthEarth: "Construisez la stabilité ensemble, mais laissez place à la spontanéité."
      },
      // Dhikr Effects
      dhikrEffects: {
        fireEffect: "Refroidit l'intensité, apporte la douceur",
        airEffect: "Concentre l'esprit, apporte la sagesse",
        waterEffect: "Élève l'émotion vers la clarté",
        earthEffect: "Adoucit la rigidité, ouvre les possibilités"
      },
      
      // UI Labels for Four-Layer Compatibility
      accuracy: "Précision",
      precision: "Précision",
      weight: "poids",
      motherOf: "Mère de",
      
      // Four-Layer UI Text
      whatThisMeans: "💡 Ce que cela signifie",
      showCalculationDetails: "Voir les calculs détaillés",
      understandingTerms: "Comprendre les termes",
      hoverToLearnMore: "Survolez les ℹ️ pour en savoir plus",
      fourLayersTitle: "Quatre Niveaux de Compatibilité",
      inDailyLife: "🏠 Dans la vie quotidienne :",
      challenge: "⚠️ Défi :",
      tip: "💡 Conseil :",
      mostImportantForMarriage: "💜 LE PLUS IMPORTANT POUR LE MARIAGE",
      dailyImpact: "🏠 Impact au quotidien :",
      innerTemperament: "💡 Tempérament Intérieur (الطبع الباطن)",
      cosmicTemperament: "💡 Tempérament Cosmique (الطبع الفلكي)",
      harmony: "Harmonie"
    },

    // ============================================================================
    // SYSTÈME DE COMPATIBILITÉ À QUATRE NIVEAUX
    // ============================================================================
    
    fourLayerCompatibility: {
      // En-tête du formulaire
      title: "Analyse de Compatibilité à Quatre Niveaux",
      titleArabic: "تحليل التوافق الرباعي",
      subtitle: "La méthode traditionnelle complète d'Afrique de l'Ouest",
      description: "Cette analyse examine à la fois vos personnalités conscientes (de vos noms) et vos schémas émotionnels hérités (des noms de vos mères) pour donner la lecture de compatibilité la plus précise.",
      
      // Champs de saisie
      person1Name: "Nom de la Première Personne",
      person2Name: "Nom de la Deuxième Personne",
      person1MotherName: "Nom de la Mère de la Première Personne",
      person2MotherName: "Nom de la Mère de la Deuxième Personne",
      optional: "(Optionnel pour une analyse plus profonde)",
      
      // Info-bulles
      nameTooltip: "💡 Votre nom révèle votre moi conscient × comment vous vous présentez au monde, votre personnalité active et comment les autres vous voient.",
      motherNameTooltip: `💡 Le nom de votre mère révèle votre empreinte émotionnelle × les schémas subconscients, les sentiments et les besoins que vous avez hérités. C'est la fondation sous votre personnalité.

📊 Profondeur de l'analyse :
• Avec les noms seulement : 70% de précision
• Avec les noms des mères : 90-95% de précision

🌍 C'est la méthode traditionnelle préservée par les érudits islamiques d'Afrique de l'Ouest pour la compatibilité matrimoniale sérieuse.

🔒 Confidentialité : Les noms des mères ne sont utilisés que pour le calcul et jamais stockés.`,
      
      // Sélection du mode d'analyse
      analysisMode: "Mode d'Analyse",
      quickAnalysis: "Analyse Rapide (Noms Seulement)",
      quickAnalysisDesc: "Voyez comment vos personnalités conscientes interagissent dans la vie quotidienne. Bon pour la curiosité initiale.",
      quickAccuracy: "70-75% de précision",
      completeAnalysis: "Analyse Complète (Noms + Mères) ⭐ Recommandé",
      completeAnalysisDesc: "La méthode traditionnelle d'Afrique de l'Ouest. Révèle à la fois la chimie de surface et la compatibilité émotionnelle profonde. Essentiel pour les relations sérieuses.",
      completeAccuracy: "90-95% de précision",
      
      // Section du score global
      overallCompatibilityTitle: "Compatibilité Globale",
      overallCompatibilityArabic: "التوافق الشامل",
      overallExplanation: "Ce score est calculé à partir des quatre niveaux de votre connexion, pondéré pour prioriser la fondation émotionnelle (le plus important pour l'harmonie à long terme).",
      
      // Interprétations des scores
      excellent: "EXCELLENT",
      excellentRange: "85-100%",
      excellentMeaning: "Compatibilité exceptionnelle aux niveaux de surface et d'âme. Vos énergies se complètent magnifiquement.",
      
      veryGood: "TRÈS BIEN",
      veryGoodRange: "70-84%",
      veryGoodMeaning: "Forte compatibilité avec des domaines mineurs à cultiver. Cette connexion a un grand potentiel avec un effort mutuel.",
      
      good: "BIEN",
      goodRange: "55-69%",
      goodMeaning: "Compatibilité modérée. Vous pouvez construire une relation harmonieuse avec compréhension, communication et compromis.",
      
      challenging: "DIFFICILE",
      challengingRange: "40-54%",
      challengingMeaning: "Différences significatives d'énergie et d'approche. Cette relation nécessite un effort substantiel, de la patience et une croissance mutuelle.",
      
      difficult: "TRÈS DIFFICILE",
      difficultRange: "0-39%",
      difficultMeaning: "Conflits élémentaires majeurs. Bien que non impossible, ce jumelage fait face à des défis fondamentaux qui nécessitent un engagement profond pour être surmontés.",
      
      // En-têtes des niveaux
      layer1Title: "Compatibilité Quotidienne",
      layer1TitleArabic: "التوافق اليومي",
      layer1Subtitle: "Dynamique de Surface (الديناميكية الظاهرة - al-Dīnāmīkīya al-Ẓāhira)",
      
      layer2Title: "Fondation Émotionnelle",
      layer2TitleArabic: "الأساس العاطفي",
      layer2Subtitle: "Dynamique Profonde (الديناميكية العميقة - al-Dīnāmīkīya al-ʿAmīqa)",
      layer2Badge: "🌟 LE PLUS IMPORTANT POUR L'HARMONIE À LONG TERME",
      
      layer3Title: "Effet de la Personne 1 sur le Noyau Émotionnel de la Personne 2",
      layer4Title: "Effet de la Personne 2 sur le Noyau Émotionnel de la Personne 1",
      crossDynamicsTitle: "Dynamiques d'Influence Croisée",
      crossDynamicsArabic: "الديناميكيات المتقاطعة",
      crossDynamicsExplanation: "Ces niveaux montrent comment l'énergie consciente de chaque personne affecte le noyau émotionnel de l'autre. Pensez-y comme : 'Comment votre personnalité touche-t-elle leur cœur ?'",
      
      // Sections "Ce Que Cela Mesure"
      whatItMeasures: "📖 Ce Que Cela Mesure :",
      basedOn: "🔍 Basé Sur :",
      whyItMatters: "💡 Pourquoi C'est Important :",
      
      // Explications du Niveau 1
      layer1WhatItMeans: "Comment vos personnalités conscientes interagissent au quotidien. C'est l'énergie que vous apportez activement aux conversations, décisions et activités partagées. C'est ce que les gens voient quand ils regardent votre relation.",
      layer1BasedOn: "Les tempéraments élémentaires de vos deux noms (calculés en utilisant la méthode Ḥadath ÷ 4)",
      layer1WhyItMatters: "Cela détermine votre style de communication, la résolution des conflits et si vous vous 'comprenez' naturellement dans les moments quotidiens. Des scores élevés ici signifient un flux facile et naturel dans la vie quotidienne.",
      
      // Explications du Niveau 2
      layer2WhatItMeans: "La compatibilité émotionnelle subconsciente héritée de vos mères. C'est le 'sentiment de chez-soi' que vous créez ensemble×le confort non dit, la sécurité et le lien profond qui existe naturellement ou doit être construit.",
      layer2BasedOn: "Les tempéraments élémentaires des noms de vos deux mères (calculés en utilisant la méthode Ḥadath ÷ 4)",
      layer2WhyItMatters: `C'est LE niveau le plus important pour le mariage et le partenariat à long terme. Voici pourquoi :

• Les schémas émotionnels de votre mère ont façonné comment vous donnez et recevez l'amour
• Ce niveau détermine si vous vous sentez émotionnellement "en sécurité" ensemble
• Des scores élevés ici signifient que vous comprenez intuitivement les besoins de l'autre
• Des scores faibles signifient que vous aurez besoin de travail conscient pour répondre aux besoins émotionnels de l'autre

De nombreux couples avec une grande chimie de surface luttent parce que ce niveau n'est pas harmonieux. Savoir cela à l'avance vous aide à vous préparer.`,
      
      layer2ExampleTitle: "🎭 Exemple Concret :",
      layer2Example: `Ahmad et Layla ont une excellente chimie quotidienne (Feu + Air = 85%).

Mais quand le stress frappe :
• Les racines Eau d'Ahmad (de sa mère) ont besoin de traitement émotionnel et de parole
• Les racines Feu de Layla (de sa mère) ont besoin d'espace et d'action pour se sentir mieux

Sans savoir cela, ils se blessent mutuellement :
• Ahmad se sent abandonné quand Layla prend de l'espace
• Layla se sent étouffée quand Ahmad veut parler

AVEC cette connaissance, ils comprennent : "Nous essayons tous les deux de nous sentir en sécurité×juste de différentes manières."`,
      
      // Tempérament Dual
      dualTemperamentTitle: "🎭 Vos Tempéraments Individuels",
      dualTemperamentArabic: "طبائعكم الفردية",
      dualTemperamentExplanation: "Comprendre le tempérament intérieur (conscient) et cosmique (subconscient) de chaque personne vous aide à voir la personne complète×pas seulement la surface.",
      
      innerTemperament: "Tempérament Intérieur",
      innerTemperamentArabic: "الطبع الباطن",
      innerTemperamentDef: "Votre moi conscient×comment vous vous présentez activement dans le monde. Calculé à partir de VOTRE nom.",
      
      cosmicTemperament: "Tempérament Cosmique",
      cosmicTemperamentArabic: "الطبع الفلكي",
      cosmicTemperamentDef: "Votre empreinte émotionnelle héritée×les schémas subconscients de votre lignée. Calculé à partir du nom de VOTRE MÈRE.",
      
      // Types d'intégration
      fullyAligned: "Pleinement Aligné",
      fullyAlignedMeaning: "Vous êtes authentiquement qui vous semblez être. Ce que les gens voient correspond à ce que vous ressentez à l'intérieur. Cela crée une énergie forte et cohérente.",
      fullyAlignedChallenge: "Peut être TROP de cet élément×manquant d'équilibre des autres.",
      
      naturallyBalanced: "Naturellement Équilibré",
      naturallyBalancedMeaning: "Vos côtés intérieurs et cosmiques se soutiennent mutuellement. Vous avez accès à plusieurs énergies qui fonctionnent ensemble harmonieusement.",
      
      internalComplexity: "Complexité Interne",
      internalComplexityMeaning: "Il y a un écart entre comment vous vous présentez et ce dont vous avez besoin émotionnellement. Les autres peuvent ne pas voir toute votre profondeur. Vous pouvez vous sentir incompris.",
      internalComplexityAdvice: "💡 Votre travail est l'intégration : laisser votre moi intérieur s'exprimer à travers votre moi extérieur. Honorez les deux côtés.",
      
      // Recommandations
      yourPersonalizedGuidance: "💡 Votre Guidance Personnalisée",
      yourPersonalizedGuidanceArabic: "إرشاداتكم الشخصية",
      guidanceIntro: "Basé sur les quatre niveaux de votre compatibilité, voici des conseils spécifiques pour renforcer votre connexion :",
      
      yourNaturalStrengths: "🌟 Vos Forces Naturelles",
      strengthsDesc: "Ces domaines vous viennent facilement. Célébrez-les et maintenez-les :",
      
      areasToNurture: "⚠️ Domaines à Cultiver",
      challengesDesc: "Ces domaines nécessitent une attention consciente, mais la conscience est la moitié de la solution :",
      
      specificPractices: "🛠️ Pratiques Spécifiques",
      practicesDesc: "Essayez ces activités pour équilibrer vos dynamiques élémentaires :",
      
      spiritualBalancing: "🤲 Équilibrage Spirituel",
      dhikrDesc: "Ces phrases sacrées aident à harmoniser vos énergies élémentaires :",
      
      // Glossaire Éducatif
      understandingTheTerms: "[ℹ️ Comprendre les Termes]",
      glossaryTitle: "📚 Glossaire ʿIlm al-Ḥurūf",
      glossaryTitleArabic: "مسرد علم الحروف",
      
      ilmAlHuruf: "ʿIlm al-Ḥurūf",
      ilmAlHurufArabic: "علم الحروف",
      ilmAlHurufDef: "La Science des Lettres × Une science islamique ancienne qui étudie les propriétés mystiques des lettres arabes et leurs valeurs numériques. Chaque lettre porte une énergie spécifique (Feu, Air, Eau ou Terre) et une valeur numérique utilisée pour les calculs spirituels.",
      
      hadath: "al-Ḥadath",
      hadathArabic: "الحدث",
      hadathDef: "L'Essence Numérique × La somme de toutes les valeurs de lettres dans un nom utilisant le système Abjad (أبجد). Ce nombre révèle l'essence spirituelle et les schémas de destin.",
      
      hadathDiv4: "al-Ḥadath ÷ 4",
      hadathDiv4Def: `La méthode classique pour déterminer le tempérament élémentaire (SYSTÈME MAGHRIBI). Le reste quand Ḥadath est divisé par 4 indique l'élément dominant :
• Reste 1 = Feu (النار)
• Reste 2 = Terre (الأرض)
• Reste 3 = Air (الهواء)
• Reste 0 = Eau (الماء)`,
      
      zawajAlHuruf: "Zawāj al-Ḥurūf",
      zawajAlHurufArabic: "زواج الحروف",
      zawajAlHurufDef: "Mariage des Lettres × L'analyse de compatibilité entre deux noms basée sur leur harmonie élémentaire. Comment les lettres se 'marient' ou interagissent entre deux personnes.",
      
      // Transparence des Calculs
      showCalculation: "[📊 Montrer Comment Nous Avons Calculé Cela]",
      calculationBreakdown: "🔢 Détail des Calculs",
      calculationBreakdownArabic: "تفصيل الحسابات",
      
      step1: "Étape 1 : Convertir le nom en valeurs Abjad",
      step2: "Étape 2 : Additionner toutes les valeurs",
      step3: "Étape 3 : Diviser par 4",
      step4: "Étape 4 : Associer le reste à l'élément",
      
      totalHadath: "Total (Ḥadath)",
      quotient: "Quotient",
      remainder: "Reste",
      element: "Élément",
      
      weightingExplanation: "Pourquoi ces poids ? La Fondation Émotionnelle (40%) est la plus importante pour l'harmonie à long terme. La Vie Quotidienne (30%) affecte le bonheur quotidien. Les Dynamiques Croisées (15% chacune) montrent comment vous affectez les noyaux de l'autre."
    },

    // Descriptions des Jumelages d'Éléments (pour les 10 combinaisons)
    elementPairings: {
      fireFire: {
        label: "Feu + Feu : Le Couple Puissant",
        description: "Intense, passionné et rapide. Vous apportez tous les deux une énergie audacieuse et de la détermination à la relation.",
        dailyLife: "La vie quotidienne ensemble semble électrique et excitante. Beaucoup d'action, d'aventure et de spontanéité.",
        challenge: "⚠️ Peut rivaliser ou s'épuiser sans repos. Tous les deux veulent diriger.",
        tip: "💡 Planifiez du temps calme ensemble. Pratiquez l'écoute, pas seulement l'action."
      },
      fireAir: {
        label: "Feu + Air : Le Duo Visionnaire",
        description: "Le Feu transforme les idées de l'Air en action. Créatif, énergisant et plein de possibilités.",
        dailyLife: "Vous vous inspirez constamment. Les conversations mènent à des projets. Les idées deviennent réalité.",
        challenge: "⚠️ Peut négliger la profondeur émotionnelle et les détails pratiques. Toute vision, peu d'ancrage.",
        tip: "💡 Bilans hebdomadaires : 'Comment te sens-tu ?' pas seulement 'Que fais-tu ?'"
      },
      fireWater: {
        label: "Feu + Eau : Vapeur et Transformation",
        description: "La passion rencontre la profondeur. Cela crée soit de la vapeur (transformation) soit de l'évaporation (conflit).",
        dailyLife: "Vos approches de la vie sont opposées. Le Feu agit vite ; l'Eau a besoin de temps pour ressentir. Cela crée des frictions dans les décisions quotidiennes.",
        challenge: "⚠️ Le Feu peut submerger l'Eau. L'Eau peut se retirer du Feu. Les styles de communication s'affrontent.",
        tip: "💡 Feu : Pratiquez l'écoute active et la patience. Eau : Exprimez vos besoins clairement et directement."
      },
      fireEarth: {
        label: "Feu + Terre : La Vision Rencontre la Fondation",
        description: "Le Feu apporte vision et excitation ; la Terre apporte exécution et stabilité. Complémentaire mais à des rythmes différents.",
        dailyLife: "Le Feu veut constamment commencer de nouvelles choses ; la Terre préfère finir ce qui est commencé. Cela crée une tension de planification mais aussi de l'équilibre.",
        challenge: "⚠️ Rythmes différents : Le Feu se précipite, la Terre prend son temps. Peut sembler tirer dans des directions opposées.",
        tip: "💡 Combinez des sessions de planification (Terre) avec des aventures spontanées (Feu). Honorez les deux approches."
      },
      airAir: {
        label: "Air + Air : Le Partenariat Intellectuel",
        description: "Conversations infinies, curiosité partagée et stimulation mentale. Vous comprenez comment l'autre pense.",
        dailyLife: "Vous pouvez parler pendant des heures. Chaque expérience devient une discussion. Apprendre et explorer ensemble est naturel.",
        challenge: "⚠️ Peut trop réfléchir ou éviter la vulnérabilité émotionnelle. Tout dans la tête, pas assez dans le cœur.",
        tip: "💡 Créez des 'zones sans analyse'. Pratiquez le ressenti sans discussion. Touchez plus, parlez moins parfois."
      },
      airWater: {
        label: "Air + Eau : L'Esprit Rencontre le Cœur",
        description: "L'Air donne des mots aux sentiments de l'Eau. L'Eau ajoute de la profondeur aux idées de l'Air. Magnifique quand équilibré.",
        dailyLife: "L'Air aide l'Eau à exprimer les émotions clairement. L'Eau rappelle à l'Air que les sentiments comptent autant que les pensées.",
        challenge: "⚠️ L'Air peut rationaliser les sentiments ; l'Eau peut se sentir incomprise lorsque les émotions sont analysées.",
        tip: "💡 Air : Écrivez des lettres d'amour×utilisez vos mots pour l'émotion. Eau : Partagez vos rêves à voix haute×faites confiance à l'Air pour écouter."
      },
      airEarth: {
        label: "Air + Terre : Les Idées Prennent Racine",
        description: "L'Air rêve, la Terre construit. Des approches opposées qui peuvent se compléter ou s'affronter.",
        dailyLife: "L'Air veut explorer les possibilités ; la Terre veut s'engager dans une voie. Cela crée des frictions décisionnelles quotidiennes.",
        challenge: "⚠️ L'Air peut sembler dispersé pour la Terre ; la Terre peut sembler rigide pour l'Air. Valeurs différentes autour de la structure.",
        tip: "💡 Créez des tableaux de vision ensemble (Air), puis assignez des tâches et des échéances (Terre). Trouvez un terrain d'entente."
      },
      waterWater: {
        label: "Eau + Eau : La Connexion Profonde",
        description: "Compréhension intuitive. Vous ressentez les émotions de l'autre sans mots. L'empathie naturelle circule entre vous.",
        dailyLife: "Un regard dit tout. Vous vous nourrissez instinctivement. La sécurité émotionnelle vient naturellement.",
        challenge: "⚠️ Peut se noyer dans les émotions ensemble. Peut devenir isolé du monde extérieur. Besoin de la perspective de l'Air.",
        tip: "💡 Écrivez dans un journal ensemble, puis discutez de ce que vous avez écrit. Mettez les émotions en mots. Connectez-vous aussi avec les autres."
      },
      waterEarth: {
        label: "Eau + Terre : Croissance Nourricière",
        description: "Harmonie naturelle. L'Eau nourrit la Terre, la Terre retient l'Eau. Comme un jardin×la croissance se produit naturellement.",
        dailyLife: "Vous soutenez la croissance de l'autre sans effort. L'Eau apporte les sentiments, la Terre apporte la stabilité. Équilibré et paisible.",
        challenge: "⚠️ Peut éviter les conflits ou devenir stagnant. Trop confortable peut signifier aucun défi de croissance.",
        tip: "💡 Cuisinez ensemble, jardinez, créez avec vos mains. Embrassez le changement doux×essayez de nouvelles choses mensuellement."
      },
      earthEarth: {
        label: "Terre + Terre : La Fondation Solide",
        description: "Stabilité inébranlable. Loyauté, cohérence et objectifs pratiques partagés. Vous construisez ensemble brique par brique.",
        dailyLife: "Routines fiables, responsabilités partagées et progrès constants. Vous savez à quoi vous attendre de l'autre.",
        challenge: "⚠️ Peut résister au changement ou devenir trop routinier. Tous deux peuvent être têtus. La vie semble sûre mais peut manquer de spontanéité.",
        tip: "💡 Planifiez des 'nouvelles expériences' mensuelles. Brisez les routines ensemble intentionnellement. Invitez l'énergie de l'Air et du Feu."
      }
    },

    // LIFE PATH RESULTS COMPONENT
    lifePathResults: {
      yourLifeNumbers: "Vos nombres de vie",
      introduction: "Ces quatre nombres révèlent votre personnalité fondamentale, vos désirs intérieurs, comment les autres vous voient et le but de votre vie. Considérez-les comme les traits principaux qui façonnent qui vous êtes et le chemin que vous êtes destiné à suivre.",
      whereYouAre: "Où vous en êtes maintenant",
      currentLifePhase: "Phase de vie actuelle",
      phaseOf: "Phase {current} de 9",
      yearOf: "Année {current}/9",
      focusAreas: "Domaines de focus",
      yourAge: "Votre âge",
      years: "ans",
      thisYearMonth: "Énergie de cette année et de ce mois",
      personalYear: "Année personnelle",
      personalMonth: "Mois personnel",
      strengthsChallenges: "Vos forces et opportunités de croissance",
      strengthsDescription: "Chaque nombre de 1 à 9 représente différentes qualités de vie. Vos forces montrent ce dans quoi vous excellez naturellement. Les domaines de croissance montrent où vous pouvez vous développer davantage.",
      whatYouAreStrongAt: "Ce dans quoi vous êtes fort",
      whereYouCanGrow: "Où vous pouvez grandir",
      strength: "Force",
      growthArea: "Domaine de croissance",
      whatMakesCapable: "Ce qui vous rend capable et fiable",
      whatGivesEdge: "Ce qui vous donne un avantage",
      yourNaturalTalent: "Votre talent naturel",
      whatYouExcelAt: "Ce dans quoi vous excellez",
      aQualityToDevelop: "Une qualité à développer",
      areaForImprovement: "Un domaine d'amélioration",
      somethingToWorkOn: "Quelque chose sur lequel travailler",
      keyLifeLesson: "Une leçon de vie clé",
      rightNow: "En ce moment",
      currentStrength: "Votre force actuelle",
      mainStrengthSupporting: "C'est la force principale qui vous soutient en cette saison",
      currentlyWorkingOn: "Actuellement en train de travailler sur",
      yourMainFocus: "Votre focus principal",
      whatLifeTeaching: "C'est ce que la vie vous enseigne maintenant×embrassez-le !",
      numberExplanations: {
        1: { title: "Le Leader", meaning: "Vous êtes naturellement indépendant et motivé à créer de nouvelles choses. Vous préférez prendre vos propres décisions." },
        2: { title: "Le Pacificateur", meaning: "Vous êtes doué pour rassembler les gens et trouver l'harmonie. Vous êtes sensible aux sentiments des autres." },
        3: { title: "Le Créateur", meaning: "Vous vous exprimez facilement et apportez de la joie partout où vous allez. La communication est votre force." },
        4: { title: "Le Bâtisseur", meaning: "Vous êtes fiable et pratique. Vous construisez des fondations solides dans tout ce que vous faites." },
        5: { title: "L'Explorateur", meaning: "Vous aimez la liberté et la variété. Vous vous adaptez rapidement et apprenez d'expériences diverses." },
        6: { title: "Le Soignant", meaning: "Vous êtes responsable et voulez naturellement aider les autres. La famille et le service comptent profondément pour vous." },
        7: { title: "Le Penseur", meaning: "Vous êtes analytique et spirituel. Vous cherchez une compréhension plus profonde des mystères de la vie." },
        8: { title: "L'Accomplisseur", meaning: "Vous êtes ambitieux et concentré sur le succès. Vous avez de fortes capacités en affaires et en leadership." },
        9: { title: "L'Humanitaire", meaning: "Vous vous souciez du monde et voulez faire une différence positive. La compassion vous guide." },
        11: { title: "Le Visionnaire", meaning: "Vous voyez au-delà des choses ordinaires. Vous inspirez les autres et portez des messages spirituels." },
        22: { title: "Le Maître Bâtisseur", meaning: "Vous avez de grandes ambitions de créer quelque chose de durable. Vous transformez les rêves en réalité à grande échelle." }
      }
    },

    // TIMING RESULTS COMPONENT
    timingResults: {
      unableToCalculate: "Impossible de calculer l'heure planétaire. Veuillez réessayer.",
      deepRestNeededToday: "Repos Profond Nécessaire Aujourd'hui",
      todayIsRestDay: "Aujourd'hui est un Jour de Repos",
      criticalLowEnergy: "Énergie critique détectée. Votre esprit se recalibre×honorez ce signal de guérison avec un repos physique et mental profond aujourd'hui.",
      lowHarmonyToday: "Harmonie faible aujourd'hui suggère que c'est un jour de repos stratégique. Concentrez-vous sur la planification et la réflexion plutôt que sur l'exécution et les nouveaux départs.",
      recommendedToday: "Recommandé Aujourd'hui :",
      viewFullWeek: "Voir la Semaine Complète",
      dismiss: "Ignorer",
      restDayActive: "Jour de Repos Actif",
      restDayNote: "Les heures planétaires ci-dessous sont affichées à titre de référence, mais minimisez les activités aujourd'hui.",
      currentPlanetaryHour: "Heure Planétaire Actuelle",
      favorableFor: "Favorable Pour :",
      avoid: "À Éviter :",
      perfectAlignment: "ALIGNEMENT PARFAIT !",
      strongEnergy: "ÉNERGIE FORTE",
      restTime: "TEMPS DE REPOS",
      moderate: "MODÉRÉ",
      windowClosesIn: "La fenêtre se ferme dans :",
      nextWindow: "Prochaine fenêtre {element} :",
      bestForNow: "Idéal pour MAINTENANT :",
      bestForWhenReturns: "Idéal quand votre élément revient :",
      yourPersonalYear: "Votre Année Personnelle",
      recommendedDhikr: "Dhikr Recommandé Aujourd'hui",
      count: "Compte",
      times: "fois",
      bestTime: "Meilleur moment",
      benefit: "Bénéfice",
      actNow: "Agir Maintenant",
      realTimeGuidance: "Guidage en Temps Réel",
      
      // Optimal Sequence translations
      optimalSequenceFor: "Séquence Optimale pour {day}",
      morning: "Matin",
      midday: "Midi",
      afternoon: "Après-midi",
      evening: "Soir",
      bestFor: "Idéal Pour :",
      avoidLabel: "À Éviter :",
      
      // Nouvelles additions pour une meilleure UX
      harmony: "Harmonie :",
      harmonyScore: "Harmonie",
      planetEnergy: "Énergie {planet}",
      yourElement: "Votre {element}",
      hourElement: "{element} de l'heure",
      classicalWisdom: "Sagesse Classique :",
      deepRestQuote: "Man ʿarafa infisāl waqtihi, faqad ḥafaẓa ṭāqatahu",
      deepRestTranslation: "Qui connaît le temps de déconnexion, préserve son énergie",
      restDayQuote: "Al-sukūn qabl al-ḥaraka",
      restDayTranslation: "Le calme avant le mouvement apporte une action bénie",
      minutesLeft: "{minutes} minutes restantes",
      hoursLeft: "{hours} heures restantes",
      alignment: "Alignement",
      energyStatus: "État de l'Énergie",
      timeRemaining: "Temps Restant",
      
      // Guidage des couleurs
      whatToWearToday: "Quoi Porter Aujourd'hui",
      wearTheseColors: "Portez ces couleurs :",
      tryThis: "Essayez ceci :",
      you: "Vous",
      today: "Aujourd'hui",
      perfectFit: "Parfait",
      goingWell: "Bien",
      balanced: "Équilibré",
      needCare: "Attention",
      
      // Section Agir Maintenant
      actNowRealTimeGuidance: "Agir Maintenant - Guidage en Temps Réel",
      useThisTimeFor: "Utilisez ce temps pour :",
      handleRoutineTasks: "Gérer les tâches routinières",
      continueOngoingWork: "Continuer le travail en cours",
      waitForBetterTiming: "Attendre un meilleur moment",
      plentyOfTime: "Beaucoup de temps restant dans cette fenêtre",
      actNowWarning: "AGISSEZ MAINTENANT ! Le moment optimal se termine bientôt.",
      howWeFiguredThisOut: "Comment nous avons déterminé cela",
      howItWorks: "Comment ça fonctionne :",
      planetaryRulerExplanation: "Nous regardons le maître planétaire d'aujourd'hui ({planet}) et quel élément contrôle la plupart des heures d'aujourd'hui ({element}). Ensemble, ils créent la personnalité énergétique du jour.",
      yourFitExplanation: "Votre compatibilité : Votre nature {userElement} et l'énergie {dayElement} d'aujourd'hui sont alignées à {harmonyPercent}% - comme deux personnalités qui s'entendent.",
      dayRuler: "Maître du Jour :",
      mostActive: "Plus Actif :",
      dominantElement: "Dominant :",
      harmonyLabel: "Harmonie :",
      ancientWisdomMessage: "La sagesse ancienne dit que les couleurs et l'énergie fonctionnent ensemble. Portez ce qui vous convient ! 🌀"
    },

    // ACTION BUTTONS & ALIGNMENT
    actionButtons: {
      startImportantTask: "Commencer une tâche importante",
      makeDifficultCall: "Faire un appel difficile",
      sendCriticalEmail: "Envoyer un email critique",
      scheduleForLater: "Planifier pour plus tard",
      restReflect: "Se reposer et réfléchir",
      planPrepare: "Planifier et préparer",
      waitFor: "Attendre {element}",
      handleRoutineTasks: "Gérer les tâches routinières",
      continueOngoingWork: "Continuer le travail en cours",
      waitForBetterTiming: "Attendre un meilleur moment",
      takeBoldAction: "Prendre une action audacieuse",
      writeOrCommunicate: "Écrire ou communiquer",
      brainstormIdeas: "Faire un brainstorming",
      creativeWork: "Travail créatif",
      deepReflection: "Réflexion profonde",
      buildOrOrganize: "Construire ou organiser",
      completeTasks: "Compléter les tâches",
      lowStakesActivities: "Activités à faible enjeu",
      preparationWork: "Travail de préparation"
    },

    // HARMONY & ALIGNMENT
    harmony: {
      perfectAlignment: "Alignement parfait",
      strongAlignment: "Alignement fort",
      moderateAlignment: "Alignement modéré",
      weakAlignment: "Alignement faible",
      opposing: "Opposition",
      harmonious: "Harmonieux",
      transformative: "Transformatif",
      nourishing: "Nourrissant",
      unified: "Unifié",
      excellent: "Excellent",
      veryGood: "Très bien",
      good: "Bon",
      moderate: "Modéré",
      challenging: "Difficile",
      supportive: "Favorable",
      neutral: "Neutre",
    },
    
    // MOMENT STATE
    moment: {
      hold: {
        cause: "Énergies contrastées — pause avant d'agir",
        saturn: "Influence réflexive de Saturne — temps de révision",
      },
      flow: {
        cause: "Énergies alignées — l'élan vous favorise",
        neutral: "Énergies équilibrées — progression régulière",
      },
      act: {
        cause: "Heure dynamique correspond à votre nature — saisissez le moment",
      },
      rest: {
        cause: "Heure douce convient à votre nature — restaurez et réfléchissez",
      },
    },

    // ELEMENT GUIDANCE
    elementGuidance: {
      Fire: {
        bestFor: [
          "Lancer de nouveaux projets",
          "Prendre des décisions importantes",
          "Avoir des conversations nécessitant du courage",
          "Agir avec audace",
          "Diriger et inspirer les autres"
        ],
        avoid: [
          "Traitement émotionnel",
          "Planification détaillée",
          "Travail lent et méthodique"
        ]
      },
      Air: {
        bestFor: [
          "Communiquer et réseauter",
          "Apprendre de nouveaux concepts",
          "Faire du brainstorming",
          "Écrire et articuler",
          "Enseigner et partager les connaissances"
        ],
        avoid: [
          "Travail physique lourd",
          "Travail de profondeur émotionnelle",
          "Engagements à long terme"
        ]
      },
      Water: {
        bestFor: [
          "Traitement émotionnel",
          "Réflexion profonde",
          "Conversations de guérison",
          "Travail intuitif",
          "Flux créatif"
        ],
        avoid: [
          "Décisions rapides",
          "Confrontations",
          "Action agressive"
        ]
      },
      Earth: {
        bestFor: [
          "Construire et organiser",
          "Prendre des engagements",
          "Terminer des projets",
          "Planification financière",
          "Travail physique"
        ],
        avoid: [
          "Changements rapides",
          "Décisions impulsives",
          "Théorisation abstraite"
        ]
      }
    },

    // COLOR GUIDANCE
    colorGuidance: {
      dailyColorGuidance: "Guide des couleurs quotidien",
      yourElement: "Votre élément",
      todayElement: "Élément du jour",
      harmonyLevel: "Niveau d'harmonie",
      primaryColors: "Couleurs principales",
      accentColors: "Couleurs d'accent",
      avoidColors: "Couleurs à éviter",
      energyMessage: "Message énergétique",
      practicalTips: "Conseils pratiques",
      bestEnergyTimes: "Meilleurs moments énergétiques",
      harmonyBreakdown: "Détails de l'harmonie"
    },

    // REST PRACTICES
    restPractices: {
      physicalRest: "Repos physique - dormir, s'allonger, mouvement minimal",
      cancelNonEssential: "Annuler toutes les réunions/tâches non essentielles",
      lightPrayer: "Prière légère ou dhikr seulement (pas de pratique intensive)",
      noDecisions: "Pas de prise de décision aujourd'hui - reporter aux meilleurs jours",
      hydrateNourish: "S'hydrater, se nourrir, être doux avec soi-même",
      silenceMeditation: "20 min de silence ou méditation loin de la lumière vive",
      gentleWalk: "Marche douce à l'ombre (pas d'objectifs, juste présence)",
      journalThoughts: "Noter les pensées sans forcer les solutions",
      postponeDecisions: "Reporter les décisions de leadership jusqu'à demain",
      earlyBedtime: "Coucher tôt pour réparation solaire (avant 22h)",
      byWater: "20 min près de l'eau (réelle ou visualisée)",
      emotionalRelease: "Libération émotionnelle douce - pleurer, écrire, exprimer",
      warmFood: "Se nourrir avec des aliments chauds et réconfortants",
      postponeEmotional: "Reporter les conversations émotionnelles",
      extraSleep: "Sommeil supplémentaire - honorer votre rythme lunaire",
      gentleMovement: "Mouvement très doux uniquement (étirements, marche lente)",
      breathingExercises: "Se calmer avec des exercices de respiration",
      noConflicts: "Pas de conflits ou confrontations aujourd'hui",
      postponePhysical: "Reporter les défis physiques",
      coolDown: "Se rafraîchir avec des exercices de respiration",
      informationFast: "Jeûne d'information - limiter la lecture/messages",
      speakLess: "Parler moins, écouter le silence",
      postponeCommunication: "Reporter les communications importantes",
      simpleTasks: "Tâches simples et à focus unique seulement",
      mentalRest: "Repos mental - pas de résolution de problèmes",
      scaleBack: "Réduire les plans ambitieux",
      postponeTeaching: "Reporter l'enseignement ou le partage de sagesse",
      gratitudePractice: "Pratique de gratitude pour ce qui est",
      restInContentment: "Se reposer dans le contentement, pas l'expansion",
      gentleSelfCare: "Soin personnel doux (bain, musique douce, beauté)",
      noRelationshipDecisions: "Pas de décisions relationnelles aujourd'hui",
      postponeSocial: "Reporter les rassemblements sociaux",
      soloTime: "Temps solo dans un environnement agréable",
      appreciateWithout: "Apprécier sans acquérir",
      releaseRigidity: "Lâcher la rigidité - ne pas forcer la structure",
      postponePlanning: "Reporter la planification à long terme",
      letGoShould: "Lâcher les pensées \"je devrais\"",
      flexibilityExercises: "Exercices de flexibilité douce",
      trustPause: "Faire confiance à la pause avant que la discipline revienne"
    },

    // ============================================================================
    // WEEKLY RESULTS - Complete translations
    // ============================================================================
    weeklyResultsComplete: {
      unableToGenerate: "Impossible de générer les prévisions hebdomadaires. Veuillez entrer un nom arabe valide.",
      best: "Meilleur",
      gentle: "Doux",
      focus: "Focus",
      closeDetails: "Fermer les détails",
      clickToExpand: "Cliquer pour développer",
      peakPerformanceDay: "Jour de performance maximale",
      steadyProgressDay: "Jour de progrès régulier",
      restReflectionDay: "Jour de repos et réflexion",
      allForcesAligned: "Toutes les forces alignées×excellent flux",
      mixedSignals: "Signaux mélangés×procédez avec prudence",
      challengingEnergies: "Énergies difficiles×la patience est nécessaire",
      morning: "🌅 Matin",
      midday: "☀️ Midi",
      afternoon: "🌆 Après-midi",
      evening: "🌙 Soir",
      optimalSequence: "Séquence optimale pour",
      timeWindows: "Fenêtres horaires",
      energyType: "Type d'énergie",
      bestFor: "✓ Idéal pour :",
      avoid: "✗ À éviter :",
      planetalPhase: "Phase planétaire",
      peakLeadership: "Énergie de leadership maximale",
      highVisibility: "Haute visibilité",
      delegationPhase: "Phase de délégation",
      reflectionTime: "Temps de réflexion",
      emotionalClarity: "Clarté émotionnelle",
      empathyPeak: "Pic d'empathie",
      creativeFlow: "Flux créatif",
      deepRestBegins: "Début du repos profond",
      peakPhysicalEnergy: "Énergie physique maximale",
      combatMode: "Mode combat",
      sustainedPush: "Poussée soutenue",
      coolDownNeeded: "Refroidissement nécessaire",
      mentalSharpness: "Acuité mentale",
      communicationPeak: "Pic de communication",
      quickConnections: "Connexions rapides",
      integrationTime: "Temps d'intégration",
      expansionBegins: "Début de l'expansion",
      opportunityWindow: "Fenêtre d'opportunité",
      growthMomentum: "Momentum de croissance",
      wisdomIntegration: "Intégration de la sagesse",
      beautyAppreciation: "Appréciation de la beauté",
      relationshipHarmony: "Harmonie relationnelle",
      pleasureTime: "Temps de plaisir",
      disciplinePeak: "Pic de discipline",
      seriousWorkMode: "Mode de travail sérieux",
      endurancePhase: "Phase d'endurance",
      reviewTime: "Temps de révision",
      classicalTeaching: "Enseignement classique (Leçon 28) :",
      forEverythingTime: "\"Li-kulli shay'in waqtun\"",
      successFromTiming: "(Pour chaque chose il y a un temps) × Le succès vient de la bonne action au bon moment."
    },

    // ============================================================================
    // DESTINY RESULTS - Complete translations
    // ============================================================================
    destinyResultsComplete: {
      unableToCalculate: "Impossible de calculer la destinée. Veuillez entrer un nom.",
      nameChart: "Carte du nom",
      spiritualBlueprint: "Plan spirituel de votre nom",
      totalHadadKabir: "Total (Ḥadad Kabīr)",
      digitalRootSaghir: "Racine numérique (Ṣaghīr)",
      elementTabh: "Élément (Ṭabʿ)",
      zodiacBurj: "Signe du zodiaque (Burj)",
      planetLabel: "Planète",
      dayLabel: "Jour",
      hourLabel: "Heure planétaire n°",
      hourTooltip: "Nième heure après le lever du soleil local. Ordre : Soleil, Vénus, Mercure, Lune, Saturne, Jupiter, Mars.",
      elementHarmony: "Harmonie des éléments",
      harmonious: "✨ Harmonieux",
      nourishing: "🌱 Nourrissant",
      transformative: "⚡ Transformatif",
      unified: "💫 Unifié",
      elementInheritance: "Héritage des éléments",
      expression: "Expression",
      foundation: "Fondation",
      yourExpression: "Votre expression",
      yourFoundation: "Votre fondation",
      quranicResonance: "Résonance coranique",
      arabicText: "Texte arabe",
      englishTranslation: "Traduction anglaise",
      loadingVerse: "Chargement du verset coranique...",
      unableToLoadVerse: "Impossible de charger le verset pour le moment. Veuillez actualiser ou visiter Quran.com directement.",
      verseReferenceValid: "La référence du verset est valide (Sourate {surah}:{ayah}), mais nous avons des difficultés à le récupérer.",
      readFullVerse: "Lire le verset complet sur Quran.com",
      ayahOfTotal: "Ayah {ayah} de {total}",
      noVerseData: "Aucune donnée de verset disponible pour cette résonance.",
      grandTotal: "Total général",
      element: "Élément",
      spiritualOrigin: "Votre origine spirituelle",
      motherElement: "Élément du nom de la mère (Umm Ḥadad)",
      inheritance: "Héritage",
      insight: "Aperçu",
      letterGeometry: "Géométrie des lettres (Handasa al-Ḥurūf)",
      vertical: "Vertical (ʿAmūdī)",
      round: "Rond (Mudawwar)",
      flat: "Plat (Musaṭṭaḥ)",
      angular: "Angulaire (Zāwiya)",
      noneInYourName: "Aucun dans votre nom",
      letters: "lettres",
      geometricProfile: "Votre profil géométrique",
      aspiration: "Aspiration",
      spiritualReach: "Portée spirituelle",
      goals: "Objectifs",
      growth: "Croissance",
      compassion: "Compassion",
      wholeness: "Plénitude",
      cycles: "Cycles",
      embrace: "Étreinte",
      stability: "Stabilité",
      grounding: "Ancrage",
      decisiveness: "Décision",
      sharpness: "Acuité",
      clarity: "Clarté",
      transformation: "Transformation",
      soulTriad: "Votre triade de l'âme",
      lifeDestiny: "Destin de vie",
      soulUrge: "Appel de l'âme",
      outerPersonality: "Personnalité extérieure",
      practicalGuidance: "Conseils pratiques",
      yourPath: "Votre chemin",
      yourPathDesc: "Explique vers quoi votre direction et votre énergie de vie se dirigent naturellement.",
      spiritualPractice: "Pratique spirituelle",
      spiritualPracticeDesc: "Habitudes quotidiennes simples ou réflexions pour équilibrer votre élément.",
      quranicGuidance: "Guidance coranique",
      quranicGuidanceDesc: "Un verset lié à l'énergie de votre nom, uniquement pour réflexion.",
      practicalAction: "Action pratique",
      practicalActionDesc: "Étapes que vous pouvez entreprendre dans la vie quotidienne qui s'alignent avec votre destinée.",
      shadowToWatch: "Ombre à surveiller",
      shadowToWatchDesc: "Tendances dont il faut être conscient qui peuvent entraver votre croissance.",
      reflectionOnly: "Pour réflexion uniquement × pas de divination ni de jugement juridique."
    },

    // ============================================================================
    // COMPATIBILITY RESULTS - Complete translations
    // ============================================================================
    compatibilityResultsComplete: {
      unableToCalculate: "Impossible de calculer la compatibilité. Veuillez vous assurer que les deux noms sont entrés.",
      overallCompatibility: "Compatibilité globale",
      overallHarmonyScore: "Score d'harmonie global",
      threeAnalysisMethods: "Trois méthodes d'analyse",
      spiritualDestiny: "🌙 Destinée spirituelle",
      elementalTemperament: "🌊 Tempérament élémentaire",
      planetaryCosmic: "⭐ Cosmique planétaire",
      remainder: "Reste",
      sharedElement: "Élément",
      excellent: "EXCELLENT",
      veryGood: "TRÈS BON",
      good: "BON",
      moderate: "MODÉRÉ",
      challenging: "DIFFICILE",
      recommendations: "Recommandations",
      strengths: "Forces",
      growthAreas: "Domaines de croissance",
      challenges: "Défis",
      relationship: "Relation",
      advice: "Conseil",
      harmonyScore: "Score d'harmonie"
    },

    // ============================================================================
    // PLANETARY DESCRIPTIONS - Complete translations
    // ============================================================================
    planetaryDescriptions: {
      Sun: {
        name: "Soleil",
        energy: "Leadership et Vitalité",
        quality: "Leadership, Autorité, Succès"
      },
      Moon: {
        name: "Lune",
        energy: "Émotions et Intuition",
        quality: "Émotion, Intuition, Foyer"
      },
      Mars: {
        name: "Mars",
        energy: "Action et Courage",
        quality: "Action, Courage, Compétition"
      },
      Mercury: {
        name: "Mercure",
        energy: "Communication et Apprentissage",
        quality: "Communication, Apprentissage, Commerce"
      },
      Jupiter: {
        name: "Jupiter",
        energy: "Expansion et Sagesse",
        quality: "Expansion, Sagesse, Abondance"
      },
      Venus: {
        name: "Vénus",
        energy: "Amour et Harmonie",
        quality: "Amour, Beauté, Harmonie"
      },
      Saturn: {
        name: "Saturne",
        energy: "Structure et Discipline",
        quality: "Structure, Discipline, Karma"
      }
    },

    // ============================================================================
    // CLASSICAL WISDOM - Keep original with translations
    // ============================================================================
    classicalWisdom: {
      stillnessBeforeMotion: "Al-sukūn qabl al-ḥaraka",
      stillnessExplanation: "(L'immobilité avant le mouvement apporte l'action bénie)",
      whoPlants: "Man zaraʿa khayran ḥaṣada khayran",
      whoPlantsExplanation: "(Qui plante le bien, récolte le bien) × Le moment de la moisson dépend de la graine et de la saison.",
      forEverything: "Li-kulli shay'in waqtun",
      forEverythingExplanation: "(Pour chaque chose il y a un temps) × Le succès vient de la bonne action au bon moment.",
      whoKnowsDisconnection: "Man ʿarafa infisāl waqtihi, faqad ḥafaẓa ṭāqatahu",
      whoKnowsExplanation: "(Qui connaît le moment de la déconnexion, préserve son énergie)"
    },

    // ============================================================================
    // UI COMPONENTS - Onboarding, Glossary, Controls
    // ============================================================================
    onboarding: {
      welcome: "Bienvenue à Asrār Everyday! 🌙",
      enterText: "Entrez Votre Texte",
      understanding: "Comprendre Votre Analyse",
      closeTutorial: "Fermer le tutoriel",
      previousStep: "Étape précédente",
      nextStep: "Étape suivante",
      completeTutorial: "Terminer le tutoriel",
      stepOf: "Étape {current} sur {total}",
      
      // First-Launch Walkthrough
      skip: "Passer",
      next: "Suivant",
      back: "Retour",
      getStarted: "Commencer",
      signIn: "Se connecter",
      signUp: "S'inscrire",
      continueGuest: "Continuer en invité",
      
      s1: {
        title: "Guidance quotidienne",
        body: "Voyez la fenêtre favorable du jour et des actions simples à faire maintenant.",
        b1: "Meilleur moment pour agir",
        b2: "À éviter aujourd'hui",
        b3: "Touchez pour voir les détails",
      },
      s2: {
        title: "Temps divin",
        body: "Découvrez des fenêtres de temps pour la réflexion, l'organisation et le calme.",
        b1: "Jour & influence horaire",
        b2: "Soutien vs. défi",
        b3: "Pour la réflexion uniquement",
      },
      s3: {
        title: "Calculatrice & profil spirituel",
        body: "Explorez des repères liés au nom : élément, tempérament et sens central.",
        b1: "Calculs Kabir & Saghir",
        b2: "Élément & qualité",
        b3: "Explications simples",
      },
      s4: {
        title: "Dhikr & pratique",
        body: "Suivez vos sessions, restez constant et appliquez une méthode guidée (adab).",
        b1: "Compteur de session",
        b2: "Méthode conseillée",
        b3: "Rappels doux",
      },
      s5: {
        title: "Sauvegarder & débloquer",
        body: "Créez un compte pour synchroniser. Premium débloque l'alignement approfondi.",
        b1: "Synchronisation cloud",
        b2: "Premium : Compatibilité avancée",
        b3: "Premium : Guidance personnalisée",
      },

      final: {
        tagline: "Votre chemin, préservé.",
        title: "Commencez votre voyage",
        description: "Créez un compte pour synchroniser et débloquer des fonctionnalités.",
        createAccount: "Créer un compte",
        signIn: "Se connecter",
        continueGuest: "Continuer en invité",
        guestNote: "Vos données restent sur cet appareil.",
        disclaimer: "Cette application soutient la réflexion spirituelle. Elle ne remplace pas les conseils religieux.",
        or: "ou",
      },
    },

    glossary: {
      openTitle: "Ouvrir le Glossaire de Numérologie Islamique",
      closeLabel: "Fermer le glossaire",
      searchPlaceholder: "Rechercher des termes... (ex: 'Saghir', 'élément', 'destinée')",
      noResults: "Aucun terme ne correspond",
    },

    controls: {
      closeKeyboard: "Fermer le clavier",
      closeMenu: "Fermer le menu",
      updateLocation: "Mettre à jour",
    },

    tooltips: {
      umHadad1: "Um Ḥadad (أم حدد) - Requis pour le calcul complet de la Destinée du Nom",
      umHadad2: "Um Ḥadad (أم حدد) - Révèle votre Aṣl al-Rūḥānī (origine spirituelle)",
    },

    // ============================================================================
    // ENERGY DESCRIPTIONS
    // ============================================================================
    energyReturn: {
      fast: "Ce que vous donnez revient rapidement",
      slow: "Ce que vous donnez aujourd'hui prend du temps pour revenir",
    },

    // ============================================================================
    // ERROR MESSAGES
    // ============================================================================
    errors: {
      analysisError: "Impossible d'analyser. Veuillez vérifier votre entrée.",
      verseLoadError: "Impossible de charger le texte du verset. Veuillez réessayer.",
    },

    // ============================================================================
    // SEO & METADATA
    // ============================================================================
    seo: {
      siteTitle: "Asrār Everyday - Calculatrice ʿIlm al-Ḥurūf & ʿIlm al-ʿAdad",
      titleTemplate: "%s | Asrār Everyday",
    },

    dailyGuidance: {
      title: "Guidance Quotidienne",
      todaysFlow: "Flux du Jour",
      elementHarmony: "Harmonie Élémentaire",
      dayElement: "Élément du Jour",
      yourElement: "Votre Élément",
      noElement: "Aucun Élément",
      addProfileHint: "Ajoutez votre date de naissance pour révéler votre élément",
      lunarMansion: "Manoir Lunaire",
      yourMansion: "Votre Manoir",
      mansionHint: "Basé sur votre date de naissance",
      missingDobCta: "Ajoutez votre date de naissance pour calculer votre Manoir Lunaire",
      addBirthDate: "Ajouter la Date de Naissance",
      recommendations: "Guidance pour Aujourd'hui",
      bestFor: "Favorable pour :",
      avoid: "Éviter pour l'instant :",
      peakHours: "Heures de Pointe",
      reflection: "Réflexion Coranique",
      wisdom: "Sagesse Classique",
      wisdomQuote: "Li-kulli shay'in waqtun — Pour chaque chose il y a un temps. Le succès vient de la bonne action au bon moment.",
      wisdomSource: "Sagesse Islamique Classique",
      empty: {
        title: "Guidance Non Disponible",
        message: "Impossible de charger la guidance quotidienne. Veuillez réessayer.",
      },
      timing: {
        favorable: "Flux Favorable",
        transformative: "Fenêtre Transformative",
        delicate: "Timing Délicat",
        neutral: "Flux Neutre",
      },
      relationship: {
        harmonious: "Harmonie Parfaite — Votre élément correspond à l'énergie d'aujourd'hui",
        complementary: "Flux Favorable — Votre élément complète l'énergie d'aujourd'hui",
        transformative: "Dynamique Transformative — Les énergies opposées invitent à la croissance",
        neutral: "État Équilibré — Flux d'énergie neutre",
      },
      elemental: {
        harmonious: {
          description: "Votre nature {userElement} s'aligne parfaitement avec l'énergie {dayElement} du jour — avancez avec confiance et clarté.",
        },
        supportive: {
          description: "Votre nature {userElement} est soutenue par l'énergie {dayElement} du jour — des conditions favorables à l'évolution et à l'action.",
        },
        challenging: {
          description: "Votre nature {userElement} contraste avec l'énergie {dayElement} du jour — pratiquez la patience et une adaptation en douceur.",
        },
        neutral: {
          description: "Votre nature {userElement} et l'énergie {dayElement} du jour restent neutres — des conditions équilibrées pour un progrès stable.",
        },
      },
      elements: {
        fire: {
          description: "Dynamique, initiatrice, expression extérieure",
        },
        water: {
          description: "Intuitive, réceptive, nature fluide",
        },
        air: {
          description: "Intellectuelle, communicative, claire",
        },
        earth: {
          description: "Stable, ancrée, pratique",
        },
      },
    },

    divineTimingInsights: {
      header: {
        title: "Aperçus",
        loading: "Synchronisation de votre chronologie...",
      },
      loading: {
        message: "Analyse de vos schémas...",
      },
      empty: {
        title: "Pas encore de données",
        subtitle: "Enregistrez vos bilans quotidiens pour construire vos aperçus personnalisés.",
        cta: "Commencer le bilan",
      },
      disclaimer: "Pour la réflexion seulement • Pas une règle",
      metrics: {
        checkIns: "bilans",
        dayStreak: "jours consécutifs",
        harmony: "harmonie",
      },
      summary: {
        thisWeek: "Cette semaine",
        avgHarmony: "Harmonie moyenne",
        trend: "Tendance",
      },
      trendStates: {
        improving: "Élan en hausse",
        declining: "Élan en repli",
        stable: "Rythme stable",
        change: "{value}% vs période précédente",
      },
      sections: {
        currentAlignment: "Alignement actuel",
        patternMap: "Carte des motifs",
        patternHint: "Touchez une case pour revoir son harmonie et sa constance.",
        segments: "Segments temporels",
        intentions: "Thèmes d'intention",
        recommendations: "Recommandations",
      },
      patternDetail: {
        title: "{day} • {segment}",
        count: "{count} bilans enregistrés",
        empty: "Aucun bilan enregistré pour le moment.",
        placeholder: "Touchez un carré pour afficher ses détails.",
      },
      segments: {
        preDawn: "Avant l'aube",
        morning: "Matin",
        midday: "Midi",
        afternoon: "Après-midi",
        evening: "Soir",
        night: "Nuit",
      },
      segmentStats: {
        checkins: "{count} bilans",
        success: "{value}% favorables",
        energy: "{value}% énergie moyenne",
      },
      intentions: {
        summary: "{count} bilans • Favorable : {segments}",
      },
      heatmapLegend: {
        title: "Échelle d'harmonie",
        low: "Faible",
        medium: "Équilibrée",
        high: "Élevée",
      },
    },

    // DIVINE TIMING SPIRITUAL COMPONENTS
    divineTiming: {
      // Screen 1: Advanced Timing Analysis - Home/Intro
      home: {
        title: "Analyse avancée des timings",
        subtitle: "Recevez une guidance complète en intégrant tous les systèmes de timing : Alignement du moment, Guidance du jour et Heures planétaires.",
        cards: {
          currentHour: {
            label: "Heure actuelle",
          },
          dailyEnergy: {
            label: "Énergie du jour",
          },
        },
        features: {
          harmonyScore: "Score d'harmonie (0-100)",
          timeline: "Chronologie optimale sur 7 jours",
          actionSteps: "Étapes d'action pratiques",
        },
        intentions: {
          question: "Quelle est votre intention aujourd'hui ?",
          newBeginning: "Nouveau départ",
          journey: "Voyage",
          communication: "Communication",
          connection: "Connexion",
          learning: "Apprentissage",
          restRecovery: "Repos & récupération",
          generalReflection: "Réflexion générale",
        },
        weekdays: {
          sun: "Dim",
          mon: "Lun",
          tue: "Mar",
          wed: "Mer",
          thu: "Jeu",
          fri: "Ven",
          sat: "Sam",
        },
        weekdaysLong: {
          sunday: "Dimanche",
          monday: "Lundi",
          tuesday: "Mardi",
          wednesday: "Mercredi",
          thursday: "Jeudi",
          friday: "Vendredi",
          saturday: "Samedi",
        },
        cta: "Obtenir l'analyse avancée",
      },
      // Ask Divine Timing (AI Guidance Input)
      askDivineTiming: {
        title: "Demander le Timing Divin",
        subtitle: "Recevez une guidance spirituelle pour votre question",
        questionLabel: "Votre question",
        questionPlaceholder: "ex. Est-ce un bon moment pour commencer mes révisions ?",
        category: "Catégorie *",
        timeFrame: "Période",
        urgency: "Urgence",
        charCount: "{count}/200",
        categories: {
          study_exam: "Études",
          work_career: "Travail",
          money_business: "Finances",
          travel: "Voyage",
          relationships_family: "Relations",
          health_wellbeing: "Santé",
          spiritual_practice: "Spiritualité",
          decisions_general: "Décision",
        },
        timeFrameOptions: {
          today: "Aujourd'hui",
          this_week: "Cette semaine",
          this_month: "Ce mois-ci",
        },
        urgencyOptions: {
          low: "Faible",
          medium: "Moyenne",
          high: "Élevée",
        },
        actions: {
          getGuidance: "Obtenir une guidance",
          reflectDifferent: "Réfléchir sur une autre intention",
        },
        errors: {
          enterQuestion: "Veuillez entrer votre question",
          selectCategory: "Veuillez sélectionner une catégorie",
          tooLong: "La question doit contenir 200 caractères ou moins",
        },
      },
      // Results Screens - All tabs and data translations
      results: {
        // Header
        header: {
          intentToday: "Votre intention aujourd'hui :",
        },
        // Section titles
        section: {
          divineTiming: "Divine Timing",
          currentMomentAnalysis: "Analyse du moment actuel",
          practicalSteps: "Étapes pratiques",
          bestTimeNext24h: "Meilleur moment dans les 24 heures",
          sevenDayOutlook: "Perspective sur 7 jours",
        },
        // Field labels
        labels: {
          timingQuality: "Qualité du timing",
          cycleState: "État du cycle",
          elementalTone: "Ton élémental",
          reflectiveGuidance: "Guidance réflexive",
          harmony: "Harmonie",
          hourlyStatus: "État horaire",
          planetaryHour: "Heure planétaire",
          dailyQuality: "Qualité du jour",
        },
        // Timing quality values
        qualities: {
          favorable: "Favorable",
          neutral: "Neutre",
          delicate: "Délicat",
          mixed: "Mixte",
          challenging: "Difficile",
        },
        // Cycle states
        states: {
          completion_closure: "Achèvement / Clôture",
          initiation: "Initiation",
          growth_expansion: "Croissance / Expansion",
          review_restraint: "Révision / Retenue",
        },
        // Guidance levels
        guidanceLevels: {
          act: "→ Engagez-vous consciemment",
          slow: "⊙ Procédez délibérément",
          observe: "◐ Réfléchissez avant d'agir",
        },
        // Alert/Recommendation levels
        alerts: {
          proceedWithCaution: "Procéder avec prudence",
          proceedConfidently: "Procéder en toute confiance",
          highlyFavorable: "Moment très favorable",
          actNow: "Bon moment pour agir",
          waitForBetterTime: "Envisager d'attendre",
        },
        // Guidance messages (from DivineTimingService)
        guidance: {
          // Quality-based messages
          supportive_reflection: "Les conditions semblent favorables à la réflexion et à l'action considérée.",
          energy_flows_align: "Les flux d'énergie s'alignent bien pour un engagement attentif.",
          mindful_participation: "Un bon moment pour une participation consciente avec ce qui se présente à vous.",
          conditions_neutral: "Les conditions sont neutres — bonnes pour les activités routinières.",
          steady_as_you_go: "Énergie régulière — ni en poussant ni en résistant.",
          balanced_window: "Une fenêtre équilibrée pour les tâches quotidiennes.",
          timing_feels_delicate: "Le timing semble délicat — procédez doucement si nécessaire.",
          consider_pausing: "Cela peut être un moment pour faire une pause et observer.",
          quiet_reflection: "Mieux adapté à une réflexion tranquille qu'à une action décisive.",
        },
        // Cycle state descriptions
        cycles: {
          ongoing_efforts: "Les efforts en cours peuvent être nourris.",
          current_projects: "Les projets en cours peuvent progresser régulièrement.",
          gentle_continuation: "Un temps pour une continuation douce.",
          new_beginnings: "De nouveaux départs peuvent prendre racine.",
          fresh_initiatives: "De nouvelles initiatives peuvent être explorées.",
          planting_seeds: "Considérez ceci comme un temps pour planter des graines.",
          winding_down: "Les choses peuvent naturellement se terminer.",
          completion_near: "L'achèvement ou la clôture peut être proche.",
          finishing_touches: "Un temps pour les touches finales, pas pour de nouveaux départs.",
          watchful_waiting: "L'attente vigilante est conseillée.",
          careful_review: "Révision attentive avant d'avancer.",
          patience_serves: "La patience vous sert maintenant.",
        },
        // Practical Steps (from AdvancedDivineTimingService)
        steps: {
          // Highly favorable
          exceptionally_aligned: "✨ Les conditions sont exceptionnellement alignées - c'est un moment optimal pour agir",
          act_within_2_hours: "Prenez votre décision/mouvement dans les 2 prochaines heures pendant que l'alignement est fort",
          combine_prayer_trust: "Combinez avec la prière (duʿāʾ) et la confiance en la sagesse divine",
          // Act now
          timing_favorable: "✓ Le timing actuel est favorable pour votre intention",
          proceed_confident_mindful: "Procédez avec confiance mais restez attentif",
          track_unfold: "Suivez comment les choses se déroulent pour référence future",
          // Proceed with caution
          mixed_proceed_care: "⚠ Le timing est mixte - procédez si nécessaire mais avec un soin supplémentaire",
          wait_if_not_urgent: "Envisagez d'attendre une meilleure fenêtre si ce n'est pas urgent",
          increase_prayers_istikharah: "Augmentez les prières et l'istikhārah pour obtenir des conseils",
          // Wait for better time
          consider_delaying: "⏸ Envisagez de reporter si possible",
          review_timeline: "Examinez la chronologie pour les fenêtres optimales à venir",
          planning_preparation: "Utilisez ce temps pour la planification et la préparation",
          // Intention-specific
          document_decision_process: "Documentez votre processus de décision pour réflexion future",
          double_check_arrangements: "Vérifiez tous les arrangements et ayez des plans de secours",
          prepare_words_carefully: "Préparez vos mots soigneusement et choisissez le bon médium",
          approach_empathy_patience: "Approchez avec empathie et patience",
          structured_study_schedule: "Créez un horaire d'étude structuré et un environnement calme",
          handle_obligations_first: "Assurez-vous que toutes les obligations sont gérées avant de prendre du temps libre",
          reflect_seek_counsel: "Réfléchissez à votre situation spécifique et cherchez des conseils qualifiés",
        },
        // Quran Reflection
        quranReflection: {
          title: "Réflexion coranique",
          mode: {
            auto: "Auto",
            manual: "Manuel",
          },
          prompt: "Lisez ce verset lentement. Quel mot résonne avec vous aujourd'hui ?",
          readOnQuran: "Lire sur Quran.com",
          forContemplation: "Pour la contemplation uniquement",
          hideTranslation: "Masquer la traduction",
          disclaimer: "Ce verset est présenté pour la réflexion uniquement. Pour des interprétations strictes et des conseils religieux, consultez des savants qualifiés.",
        },
        // Reflection Prompts (from QuranReflectionService)
        reflectionPrompts: {
          // Favorable prompts
          read_verse_slowly_resonate: "Lisez ce verset lentement. Quel mot résonne avec vous aujourd'hui ?",
          clarity_mindful_action: "Réfléchissez à la façon dont ce verset parle de clarté et d'action consciente.",
          wisdom_current_path: "Considérez quelle sagesse ce verset offre pour votre chemin actuel.",
          // Neutral prompts
          invite_consider_today: "Qu'est-ce que ce verset vous invite à considérer aujourd'hui ?",
          balance_patience_observation: "Réfléchissez à l'équilibre, la patience et l'observation attentive.",
          notice_draws_attention: "Remarquez quelle partie de ce verset attire votre attention.",
          // Delicate prompts
          read_patience_comfort: "Lisez ce verset avec patience. Quel réconfort offre-t-il ?",
          trust_stillness_contemplation: "Réfléchissez à la confiance, au calme et à la contemplation attentive.",
          wisdom_in_waiting: "Considérez comment ce verset parle de la sagesse dans l'attente.",
        },
        // AI Guidance
        aiGuidance: {
          title: "Guidance spirituelle assistée par IA",
          badge: "IA",
          description: "Obtenez des conseils personnalisés basés sur votre profil Abjad et le timing actuel",
          cta: "Demander la guidance IA",
          changeIntention: "Changer d'intention",
        },
        aiGuidanceCard: {
          header: "Guidance assistée par l'IA",
          verdict: {
            highlyFavorable: "TRÈS FAVORABLE",
            favorable: "FAVORABLE",
            mixed: "CONDITIONS MIXTES",
            unfavorable: "PROCÉDER AVEC PRUDENCE",
          },
          sections: {
            summary: "Résumé",
            contextualInsight: "Perspective contextuelle",
            spiritualAlignment: "Alignement spirituel",
            personalizedSteps: "Étapes recommandées",
            optimalTiming: "Timing optimal",
            abjadWisdom: "Sagesse Abjad",
          },
          fields: {
            harmonyScore: "Score d'harmonie",
            zahir: "Ẓāhir (extérieur)",
            batin: "Bāṭin (intérieur)",
            bestTime: "Meilleur moment",
            nextOptimal: "Prochaine fenêtre",
            avoid: "À éviter",
            today: "Aujourd'hui",
            thisWeek: "Cette semaine",
            thisMonth: "Ce mois-ci",
          },
          actions: {
            askAnother: "Poser une autre question",
            seeMore: "Voir plus",
          },
        },
        // CTA buttons
        cta: {
          reflectDifferentIntention: "Réfléchir sur une intention différente",
        },
        // Disclaimer
        disclaimer: "Cette guidance est pour la réflexion spirituelle uniquement et ne remplace pas la prière, l'istikhārah ou les conseils religieux qualifiés.",
      },
      spiritualDepth: {
        divineName: "Nom Divin",
        quranicVerse: "Verset Coranique",
        spiritualSignificance: "Signification spirituelle",
        relatedNames: "Noms associés",
        recommendedRecitation: "Récitation recommandée",
        reflectionPrompt: "Réflexion",
        beginDhikr: "Commencer le Dhikr",
        relevanceToThisHour: "Pertinence pour cette heure",
        inTheNameOfAllah: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux",
      },
      disclaimer: {
        importantNotice: "Avis Important",
        pleaseReadCarefully: "Veuillez lire attentivement avant d'utiliser le module Divine Timing",
        natureOfThisTool: "Nature de cet outil",
        toolDescription: "Cet outil fournit une réflexion spirituelle et des conseils de timing basés sur les traditions islamiques classiques des heures planétaires (Sāʿāt al-Falakiyya / الساعات الفلكية). Il s'agit d'un guide pour l'optimisation du timing spirituel et la réflexion personnelle.",
        essentialPoints: "Points Essentiels à Comprendre",
        notDivination: "Ce N'EST PAS de la divination",
        notDivinationText: "Cet outil ne prédit PAS l'avenir et ne garantit PAS de résultats. La divination (kāhana / كهانة) est interdite en Islam. Nous proposons uniquement des suggestions de timing basées sur la sagesse traditionnelle.",
        freeWillAndQadr: "Le libre arbitre et le Qadr",
        freeWillText: "Votre libre arbitre (ikhtiyār / اختيار) et vos choix restent les vôtres. Tous les résultats sont déterminés par Allah seul (Qadr / قدر). Utilisez cette sagesse comme outil de réflexion, pas comme remplacement de votre jugement.",
        notLegalGuidance: "Ce n'est pas un avis juridique islamique",
        notLegalGuidanceText: "Cet outil n'est PAS une fatwa (فتوى) ou un avis juridique islamique. Pour des questions religieuses, consultez des savants qualifiés. Pour des décisions importantes, consultez des professionnels.",
        recommendedUse: "Usage recommandé",
        recommendedUseText: "Utilisez cet outil pour : l'optimisation du timing des actions, la réflexion spirituelle, la compréhension des cycles naturels, et l'enrichissement de votre pratique spirituelle. Combinez toujours avec la prière (duʿāʾ / دعاء), la sagesse pratique (ḥikma / حكمة), et l'ijtihad personnel.",
        classicalSources: "Sources classiques",
        classicalSourcesText: "Les calculs des heures planétaires sont basés sur des traditions islamiques classiques (ʿIlm al-Ḥurūf, Shams al-Maʿārif, etc.). Les connexions spirituelles avec les Noms Divins et les versets coraniques sont présentées pour la réflexion et l'enrichissement spirituel, pas comme prescriptions obligatoires.",
        knowledgeOfUnseen: "La connaissance de l'invisible appartient à Allah seul",
        quranReference: "Coran 10:20",
        iHaveReadAndUnderstand: "J'ai lu et je comprends - Continuer",
        byContinuingYouAgree: "En continuant, vous acceptez d'utiliser cet outil comme guide de réflexion, pas comme source d'autorité absolue.",
      },
      // PHASE 2: Heures de Prière, Manoirs Lunaires, Alignement
      prayerTimes: {
        prayerTimes: "Heures de Prière",
        currentPeriod: "Période actuelle",
        nextPrayer: "Prochaine prière",
        in: "dans",
        betweenPrayers: "Entre les Prières",
        planetarySynergy: "Synergie Planétaire",
        viewAll: "Voir tout",
        hide: "Masquer",
        now: "Actuel",
        next: "Prochain",
        calculationsBasedOn: "Calculs basés sur",
        yourLocation: "votre position",
        specialPrayerTime: "Temps Spécial de Prière",
      },
      lunarMansion: {
        lunarMansion: "Manoir Lunaire",
        moonPhase: "Phase Lunaire",
        element: "Élément",
        planetaryRuler: "Gouverneur Planétaire",
        divineQuality: "Qualité Divine",
        spiritualFocus: "Focus Spirituel",
        lunarPlanetarySynergy: "Synergie Lunaire-Planétaire",
        hideDetails: "Masquer les détails",
        viewActivitiesWisdom: "Voir activités et sagesse",
        favorableFor: "Favorable Pour",
        unfavorableFor: "Défavorable Pour",
        classicalWisdom: "Sagesse Classique",
        constellation: "Constellation",
        calculatingLunarMansion: "Calcul du manoir lunaire...",
      },
      alignment: {
        personalAlignment: "Alignement Personnel",
        alignmentBreakdown: "Détails de l'Alignement",
        elementalHarmony: "Harmonie Élémentaire",
        planetaryResonance: "Résonance Planétaire",
        numericalAlignment: "Alignement Numérique",
        sacredConnection: "Connexion Sacrée",
        recommendations: "Recommandations",
        yourBestHoursToday: "Vos Meilleures Heures Aujourd'hui",
        planetaryHour: "Heure planétaire",
        basedOnSpiritualEssence: "Basé sur votre essence spirituelle et les énergies planétaires",
      },
      // PHASE 3: Contenu Éducatif
      education: {
        learningCenter: "Centre d'Apprentissage",
        planetGuides: "Guides Planétaires",
        glossary: "Glossaire",
        energyFlow: "Flux d'Énergie",
        selectPlanet: "Sélectionner une Planète",
        overview: "Aperçu",
        spiritualWisdom: "Sagesse Spirituelle",
        practicalGuide: "Guide Pratique",
        classicalSources: "Sources Classiques",
        primaryDivineName: "Nom Divin Principal",
        relatedDivineNames: "Noms Divins Associés",
        islamicHistoricalContext: "Contexte Historique Islamique",
        spiritualQualities: "Qualités Spirituelles",
        relatedSpiritualConcepts: "Concepts Spirituels Associés",
        spiritualExamples: "Exemples Spirituels",
        favorableActivities: "Activités Favorables",
        activitiesToAvoid: "Activités à Éviter",
        classicalTeachings: "Enseignements Classiques",
        position: "Position",
        recommendedDhikr: "Dhikr Recommandé",
        source: "Source",
        energyFlowChart: "Flux d'Énergie Quotidien",
        currentHour: "Heure Actuelle",
        excellentHours: "Heures Excellentes",
        goodHours: "Bonnes Heures",
        challengingHours: "Heures Difficiles",
        harmonyScore: "Score d'Harmonie",
        introduction: "Introduction",
        islamicContext: "Contexte Islamique",
        howItWorks: "Comment Ça Marche",
        faq: "FAQ",
        comprehensiveGuide: "Guide complet des heures planétaires dans la tradition islamique",
        searchTerms: "Rechercher des termes",
        showingTerms: "Affichage de",
        terms: "termes",
        allTerms: "Tous les Termes",
        planets: "Planètes",
        elements: "Éléments",
        divineNames: "Noms Divins",
        concepts: "Concepts",
        practices: "Pratiques",
        related: "Associé",
        noTermsFound: "Aucun terme trouvé correspondant à votre recherche",
        element: "Élément",
        day: "Jour",
        metal: "Métal",
      },
    },

    // ============================================================================
    // STRATÉGIE DU NOM DE LA MÈRE - Système double-mode Name Destiny
    // ============================================================================
    mothersNameStrategy: {
      // Sélecteur de Mode Name Destiny
      modeSelector: {
        title: "Choisissez Votre Type de Lecture",
        generalMode: {
          title: "Explorer un Nom",
          icon: "📖",
          description: "Découvrez le sens spirituel et les caractéristiques générales de n'importe quel nom",
          bestFor: "Idéal pour : Apprendre sur les noms, exploration culturelle, aperçus généraux",
        },
        personalMode: {
          title: "Ma Lecture Personnelle",
          icon: "✨",
          description: "Obtenez VOTRE profil spirituel unique - personnalisé à votre plan d'âme exact",
          bestFor: "Idéal pour : Découverte de soi, guidance spirituelle, transformation personnelle",
          recommended: "⭐ Recommandé",
        },
        whyPersonalBetter: "Pourquoi personnel est meilleur :",
        reason1: "Votre plan spirituel exact (pas seulement des traits généraux)",
        reason2: "Unique à VOUS (pas quelqu'un d'autre avec votre nom)",
        reason3: "Guidance et insights plus précis",
      },

      // Formulaires d'entrée Name Destiny
      nameInput: {
        generalModeHeader: "Exploration Générale de Nom",
        generalModeSubtitle: "Explorer le sens du nom uniquement - non personnalisé pour vous",
        personalModeHeader: "Profil Spirituel Personnel",
        personalModeSubtitle: "Votre lecture unique - nécessite le nom de votre mère",
        switchToPersonal: "Passer à la Lecture Personnelle",
        switchToGeneral: "Passer à l'Exploration Générale",
        motherNameRequired: "Nom de la Mère (Requis pour Lecture Personnelle)",
        motherNameOptional: "Nom de la Mère (Optionnel)",
        whyRequired: "Pourquoi le nom de la mère est-il requis ?",
        learnMore: "En Savoir Plus",
      },

      // Résultats généraux avec CTA de mise à niveau
      generalResults: {
        modeLabel: "📖 Exploration Générale de Nom",
        limitedInsight: "Aperçu Limité - Caractéristiques générales uniquement",
        upgradePrompt: "Voulez-vous VOTRE profil spirituel unique ?",
        upgradeButton: "✨ Obtenir Ma Lecture Personnelle",
        upgradeBenefits: "La lecture personnelle inclut :",
        benefit1: "Votre plan spirituel exact (Aṣl al-Rūḥānī)",
        benefit2: "Guidance personnalisée unique à VOUS",
        benefit3: "Aperçus plus profonds sur le voyage de votre âme",
        generalOnly: "Ceci est une analyse générale pour le nom '{name}' - pas spécifique à vous.",
      },

      // Emphase des résultats personnels
      personalResults: {
        modeLabel: "✨ Profil Spirituel Personnel",
        uniqueToYou: "Unique à VOUS - Pas quelqu'un d'autre avec votre nom",
        yourExactBlueprint: "Votre Plan Spirituel Exact",
        calculatedFrom: "Calculé à partir de : {name} + {motherName}",
        thisIsYours: "Cette lecture est unique à votre âme - personne d'autre n'aura ce profil exact.",
      },

      // Module Life Path - Nom de mère requis
      lifePath: {
        motherNameRequired: "Nom de la Mère (Requis)",
        whyRequired: "Pourquoi le nom de la mère est-il requis ?",
        explanation: "Le Chemin de Vie est personnel à VOUS",
        detailedExplanation: "Votre Chemin de Vie ne concerne pas seulement votre nom - il s'agit de VOTRE voyage unique à travers la vie. Le nom de votre mère garantit que cette lecture reflète votre plan spirituel spécifique, pas seulement un modèle général pour tous ceux qui portent votre nom.",
        cannotSubmit: "Veuillez entrer le nom de votre mère pour continuer",
        validationError: "Le nom de la mère est requis pour le calcul du Chemin de Vie",
      },

      // Module Divine Timing - Nom de mère requis
      divineTiming: {
        motherNameRequired: "Nom de la Mère (Requis)",
        whyRequired: "Pourquoi le nom de la mère est-il requis ?",
        explanation: "Divine Timing est calculé pour VOS influences planétaires spécifiques",
        detailedExplanation: "Les heures planétaires affectent chaque personne différemment en fonction de sa signature spirituelle unique. Le nom de votre mère personnalise ces calculs à votre plan d'âme exact, garantissant que les conseils de timing sont précis pour VOUS spécifiquement.",
        cannotSubmit: "Veuillez entrer le nom de votre mère pour continuer",
        validationError: "Le nom de la mère est requis pour le calcul du Divine Timing",
      },

      // Modal Éducatif - Explication du nom de la mère
      explanation: {
        title: "Pourquoi le Nom de la Mère Importe",
        subtitle: "Le principe spirituel derrière les lectures personnalisées",
        
        section1: {
          title: "Le Principe : Votre Plan d'Âme Unique",
          text: "Dans la tradition sénégalaise de ʿIlm al-Ḥurūf, votre identité spirituelle complète (Aṣl al-Rūḥānī) est formée de votre nom + le nom de votre mère. Cela crée une signature numérique et élémentaire unique qui vous appartient seul.",
        },

        section2: {
          title: "Pourquoi C'est Important",
          point1: {
            title: "Sans le nom de la mère :",
            text: "Vous obtenez les caractéristiques générales du nom 'Muhammad' - partagées par des millions de personnes",
          },
          point2: {
            title: "Avec le nom de la mère :",
            text: "Vous obtenez VOTRE profil unique - Muhammad + Fatima = différent de Muhammad + Aisha",
          },
        },

        section3: {
          title: "Exemple : Deux Personnes Nommées Muhammad",
          person1: "Muhammad (mère : Fatima) = Valeur numérique X → Dominant Feu → Chemin spirituel unique A",
          person2: "Muhammad (mère : Khadija) = Valeur numérique Y → Dominant Eau → Chemin spirituel différent B",
          conclusion: "Même nom, mères différentes = plans spirituels complètement différents",
        },

        section4: {
          title: "Confidentialité & Respect",
          point1: "Le nom de votre mère n'est jamais stocké ni partagé",
          point2: "Les calculs se font instantanément dans votre navigateur uniquement",
          point3: "Nous honorons la confiance sacrée du nom de votre mère (um ḥadad / أم حدد)",
        },

        section5: {
          title: "Quand Utiliser Chaque Mode",
          generalMode: {
            title: "Mode Général (Nom Uniquement) :",
            use1: "Explorer des prénoms de bébé ou significations de noms",
            use2: "Recherche culturelle ou historique",
            use3: "Apprendre sur les modèles de noms",
          },
          personalMode: {
            title: "Mode Personnel (Nom + Nom de la Mère) :",
            use1: "VOTRE guidance spirituelle",
            use2: "Décisions de vie et timing",
            use3: "Travail de découverte de soi profonde",
          },
        },

        closeButton: "Je Comprends",
      },

      // Logique de mise à niveau automatique
      autoUpgrade: {
        detected: "Nom de la mère détecté - passage à la Lecture Personnelle",
        switchingMode: "Passage au mode Personnel pour des résultats précis",
      },
    },

    // ============================================================================
    // MODULE ISTIKHARA - Istikharah al-Asmā' (الاستخارة بالأسماء)
    // ============================================================================
    istikhara: {
      // Panneau principal
      title: "Istikharah al-Asmā'",
      titleArabic: "الاستخارة بالأسماء",
      subtitle: "Guidance Spirituelle par les Noms",
      formInstruction: "Entrez deux noms pour recevoir une guidance spirituelle",
      description: "Cherchez la guidance divine en examinant la connexion spirituelle entre deux noms en utilisant la science sacrée du ʿIlm al-Ḥurūf.",
      
      // Éducation & Introduction
      educationTitle: "Qu'est-ce que Ilm al-Ḥurūf ?",
      educationText: "Ilm al-Ḥurūf (Science des Lettres) est une tradition mystique islamique ancienne qui explore la signification spirituelle des lettres arabes et de leurs valeurs numériques. Chaque lettre possède des qualités sacrées qui révèlent des vérités plus profondes sur les noms et leur résonance cosmique.",
      
      discoveryTitle: "Ce Que Vous Découvrirez",
      
      examplesTitle: "Exemples de Noms",
      examplesText: "Pour des résultats précis, les noms doivent être en écriture arabe. Exemples:\n\n• محمد (Muhammad)\n• علي (Ali)\n• فاطمة (Fatima)\n• خديجة (Khadija)\n• إبراهيم (Ibrahim)\n• عائشة (Aisha)\n\nUtilisez la recherche latine ci-dessous pour trouver des translittérations arabes.",
      
      privacyTitle: "Votre Confidentialité",
      privacyText: "🔒 Vos données ne sont jamais stockées ni partagées. Tous les calculs se font localement sur votre appareil.",
      
      arabicName: "Nom Arabe",
      helperText: "Les noms doivent être en écriture arabe pour des résultats précis",
      
      // Recherche par nom latin
      latinSearch: {
        label: "Rechercher par Nom Latin",
        placeholder: "p.ex., Muhammad, Fatima, Ibrahim",
        suggestionsHint: "Suggestions de la base de données en temps réel",
      },
      
      // Éléments de découverte
      discovery: {
        element: {
          title: "Votre Élément",
          desc: "Feu, Terre, Air ou Eau basé sur votre signature numérique",
        },
        personality: {
          title: "Traits de Personnalité",
          desc: "Aperçus profonds du tempérament et du caractère",
        },
        career: {
          title: "Guidance Professionnelle",
          desc: "Chemins professionnels alignés avec votre nature spirituelle",
        },
        powerDay: {
          title: "Votre Jour de Pouvoir",
          desc: "Le jour le plus propice pour les décisions importantes",
        },
        spiritual: {
          title: "Pratiques Spirituelles",
          desc: "Dhikr personnalisé, guidance de charité et offrandes sacrées",
        },
      },
      
      // Validation
      validation: {
        missingNames: "Veuillez entrer les deux noms pour continuer",
        nameRequired: "Le nom est requis",
      },
      
      // Section formulaire
      form: {
        title: "Entrez les Noms pour la Guidance",
        personName: "Nom de la Personne",
        personNamePlaceholder: "p.ex., Muhammad, Fatima, Ibrahim",
        motherName: "Nom de la Mère",
        motherNamePlaceholder: "p.ex., Khadija, Aisha, Maryam",
        latinName: "Nom en lettres latines",
        latinNamePlaceholder: "ex : Muhammad, Fatima, Aisha",
        latinNameHint: "Écrivez votre nom en lettres latines — l'équivalent arabe sera affiché",
        calculateButton: "Chercher la Guidance",
        clearButton: "Effacer",
        validationError: "Veuillez entrer les deux noms pour continuer",
        bothNamesRequired: "Les deux noms sont requis pour une guidance précise",
        arabicRequiredNote: "Les noms doivent être en écriture arabe pour des résultats précis",
      },
      
      // Section résultats
      results: {
        title: "Votre Guidance Spirituelle",
        calculatedFor: "Guidance pour {person} (mère : {mother})",
        burujRemainder: "Reste Buruj",
        element: "Élément Dominant",
        exportError: "Échec de l'exportation des résultats en PDF",
        
        // Navigation par onglets
        tabs: {
          overview: "Aperçu",
          personality: "Personnalité",
          career: "Guidance Professionnelle",
          blessedDay: "Jour Béni",
          spiritual: "Pratique Spirituelle",
        },
      },
      
      // Onglet Aperçu
      overview: {
        intermediate: "Intermédiaire",
        calculation: "Calcul",
        element: "Élément",
        modality: "Modalité",
        planetaryRuler: "Maître Planétaire",
        temperament: "Tempérament",
        symbolism: "Symbolisme",
        spiritualQuality: "Qualité Spirituelle",
        classicalReference: "Référence Classique",
        classicalReferenceSource: "Al-Bīrūnī - Al-Qānūn al-Masʿūdī",
        elementColors: "Élément & Couleurs",
        yourElement: "Votre Élément",
        elementOf: "Élément {number} sur 4",
        associatedColors: "Couleurs Associées",
        fireDesc: "🔥 Le Feu représente la passion, la transformation et l'illumination spirituelle",
        earthDesc: "🌍 La Terre représente la stabilité, la manifestation et la sagesse ancrée",
        airDesc: "💨 L'Air représente l'intellect, la communication et l'élévation spirituelle",
        waterDesc: "💧 L'Eau représente l'émotion, la purification et le flux divin",
        abjadNumerology: "Numérologie Abjad",
        abjadDesc: "La science sacrée de ʿIlm al-Ḥurūf (علم الحروف) - calcul des valeurs spirituelles à partir des lettres arabes",
        personNameTotal: "Total du Nom de la Personne",
        motherNameTotal: "Total du Nom de la Mère",
        combinedTotal: "Total Combiné",
        burujCalculation: "Calcul du Reste Buruj",
        divineNamesDhikr: "Dhikr des Noms Divins",
        dhikrDesc: "Nombre de récitations recommandé basé sur votre calcul Abjad",
        recitationCount: "Nombre de Récitations",
        personalized: "Personnalisé",
        repetitions: "répétitions",
        practiceTips: "Conseils de Pratique",
        tip1: "Réciter après la prière Fajr ou Maghrib",
        tip2: "Maintenir l'état de wudu (ablution)",
        tip3: "Se concentrer sur l'intention et la présence",
        spiritualNote: "Chaque récitation porte la barakah (bénédiction) de votre signature spirituelle unique",
        // Nouvelles traductions UX guidée
        spiritualPattern: "Modèle Spirituel",
        spiritualIndicators: "Indicateurs Spirituels",
        ruler: "Maître",
        quality: "Qualité",
        spiritualGuidance: "Guidance Spirituelle",
        reciteNames: "Récitez les Noms Divins",
        times: "fois pour l'alignement spirituel",
        embraceElement: "Embrassez",
        qualities: "qualités par la présence attentive",
        contemplate: "Contemplez",
        wisdom: "sagesse dans les moments de décision",
        showDetails: "Afficher les Détails Spirituels",
        hideDetails: "Masquer les Détails Spirituels",
        abjadCalculations: "Calculs Abjad",
      },
      
      // Profil de personnalité
      personality: {
        title: "Profil de Personnalité",
        subtitle: "Traits de Caractère & Tempérament",
        coreTraits: "Traits Fondamentaux",
        strengths: "Forces",
        challenges: "Défis",
        guidance: "Guidance Spirituelle",
        elementalInfluence: "Influence Élémentaire",
        colors: "Couleurs Harmonieuses",
      },
      
      // Guidance professionnelle
      career: {
        title: "Guidance Professionnelle & Vocation",
        subtitle: "Chemins Alignés avec Votre Nature Spirituelle",
        idealFields: "Domaines Professionnels Idéaux",
        workStyle: "Style de Travail",
        bestEnvironments: "Meilleurs Environnements",
        leadershipStyle: "Approche du Leadership",
        collaboration: "Style de Collaboration",
        avoidCareers: "Carrières à Aborder avec Prudence",
      },
      
      // Jour béni
      blessedDay: {
        title: "Votre Jour Béni",
        subtitle: "Jour Optimal pour les Actions Importantes",
        primaryDay: "Jour Béni Principal",
        planetaryRuler: "Maître Planétaire",
        bestActivities: "Meilleures Activités pour ce Jour",
        spiritualPractices: "Pratiques Spirituelles Recommandées",
        timing: "Timing Optimal",
        morningBlessings: "Matin (après Fajr)",
        middayBlessings: "Midi (Ẓuhr à ʿAṣr)",
        eveningBlessings: "Soir (après Maghrib)",
      },
      
      // Pratique spirituelle
      spiritual: {
        title: "Pratique Spirituelle & Croissance",
        subtitle: "Pratiques pour Renforcer Votre Connexion",
        recommendedSadaqah: "Sadaqah Recommandée",
        sadaqahType: "Type de Charité",
        sadaqahBenefit: "Bénéfice Spirituel",
        sadaqahTiming: "Meilleur Moment",
        dhikrPractice: "Dhikr Recommandé",
        dhikrName: "Nom Divin",
        dhikrCount: "Compte Suggéré",
        dhikrTime: "Meilleur Moment",
        dhikrBenefit: "Bénéfice",
        dailyPractice: "Pratique Quotidienne",
        weeklyPractice: "Pratique Hebdomadaire",
        monthlyPractice: "Pratique Mensuelle",
      },
      
      // Descriptions des éléments (français)
      elements: {
        fire: {
          name: "Feu",
          nameArabic: "النار (al-Nār)",
          quality: "Passionné, Dynamique, Transformateur",
          description: "L'énergie du Feu apporte l'audace, la créativité et le pouvoir transformateur. Ceux qui ont une dominance Feu sont des leaders naturels qui inspirent le changement.",
        },
        earth: {
          name: "Terre",
          nameArabic: "الأرض (al-Arḍ)",
          quality: "Stable, Pratique, Ancré",
          description: "L'énergie de la Terre apporte la stabilité, la fiabilité et la sagesse pratique. Ceux qui ont une dominance Terre construisent des fondations durables.",
        },
        air: {
          name: "Air",
          nameArabic: "الهواء (al-Hawāʾ)",
          quality: "Intellectuel, Communicatif, Adaptable",
          description: "L'énergie de l'Air apporte la clarté, la communication et le pouvoir intellectuel. Ceux qui ont une dominance Air excellent dans la connaissance et la connexion.",
        },
        water: {
          name: "Eau",
          nameArabic: "الماء (al-Māʾ)",
          quality: "Émotionnel, Intuitif, Fluide",
          description: "L'énergie de l'Eau apporte l'empathie, l'intuition et la profondeur émotionnelle. Ceux qui ont une dominance Eau guérissent et nourrissent naturellement.",
        },
      },
      
      // Éléments d'interface
      ui: {
        loading: "Calcul de la guidance spirituelle...",
        error: "Impossible de calculer la guidance. Veuillez vérifier les noms et réessayer.",
        backToForm: "Entrer de Nouveaux Noms",
        printResults: "Imprimer la Guidance",
        shareResults: "Partager",
        expandAll: "Développer Toutes les Sections",
        collapseAll: "Réduire Toutes les Sections",
      },
      
      // Pied de page éducatif
      education: {
        title: "À Propos d'Istikharah al-Asmā'",
        whatIsIt: "Qu'est-ce que c'est ?",
        whatIsItText: "Istikharah al-Asmā' (الاستخارة بالأسماء) est une pratique islamique traditionnelle qui cherche la guidance divine en analysant la résonance spirituelle entre les noms en utilisant le ʿIlm al-Ḥurūf (Science des Lettres).",
        howItWorks: "Comment ça fonctionne ?",
        howItWorksText: "En calculant les valeurs Abjad des deux noms et en appliquant le système Buruj (12 restes mappés à 4 éléments), nous révélons le tempérament spirituel et la guidance divine spécifiques à cette connexion.",
        isItPermissible: "Est-ce permis ?",
        isItPermissibleText: "Cette pratique est enracinée dans la tradition savante islamique d'Afrique de l'Ouest, en particulier le ʿIlm al-Ḥurūf sénégalais. Elle est utilisée pour la réflexion et la guidance, pas pour la divination. Combinez toujours avec la prière (duʿāʾ) et consultez des savants qualifiés pour les décisions importantes.",
      },
      
      // Avertissement
      disclaimer: {
        title: "Avis Important",
        text: "Cet outil fournit une réflexion spirituelle basée sur les sciences islamiques traditionnelles. Ce n'est PAS de la divination (kāhana), qui est interdite. Utilisez-le comme guide de réflexion personnelle, toujours combiné avec la prière (duʿāʾ), la sagesse pratique (ḥikma), et la consultation de savants qualifiés. Tous les résultats sont déterminés par Allah seul (Qadr).",
      },

      // Onboarding
      onboarding: {
        // Indicateur de progression
        stepOf: "Votre voyage — {current} / {total}",

        skip: "Passer",
        next: "Suivant",
        back: "Retour",
        getStarted: "Commencer",
        signIn: "Se Connecter",
        signUp: "S'Inscrire",
        continueGuest: "Continuer en invité",
        
        s1: {
          tagline: "Une fenêtre claire pour aujourd'hui.",
          credibility: "Conçu pour la réflexion, pas la prédiction.",
          title: "Guidance quotidienne",
          body: "Voyez la fenêtre favorable du jour et des actions simples à faire maintenant.",
          b1: "Meilleur moment pour agir",
          b2: "À éviter aujourd'hui",
          b3: "Touchez pour voir les détails",
        },
        s2: {
          tagline: "Heures sacrées, pas temps aléatoire.",
          credibility: "Basé sur les principes du temps sacré et les systèmes d'heures planétaires.",
          title: "Temps divin",
          body: "Découvrez des fenêtres de temps pour la réflexion, l'organisation et le calme.",
          b1: "Jour & influence horaire",
          b2: "Soutien vs. défi",
          b3: "Pour la réflexion uniquement",
        },
        s3: {
          tagline: "Votre nom porte une structure.",
          credibility: "Inspiré par les correspondances traditionnelles lettres-nombres (Abjad).",
          title: "Calculatrice & Profil spirituel",
          body: "Explorez des repères liés au nom : élément, tempérament et sens central.",
          b1: "Kabir & Saghir",
          b2: "Élément & qualité",
          b3: "Explications simples",
        },
        s4: {
          tagline: "Constance avant intensité.",
          credibility: "Fondé sur l'adab, la présence et la continuité.",
          title: "Dhikr & pratique",
          body: "Suivez vos sessions, restez constant et appliquez une méthode guidée (adab).",
          b1: "Compteur de session",
          b2: "Méthode conseillée",
          b3: "Rappels doux",
        },
        s5: {
          tagline: "Votre chemin, préservé.",
          credibility: "Vos données restent privées et sécurisées.",
          title: "Sauvegarder & débloquer",
          body: "Créez un compte pour synchroniser. Premium débloque l'alignement approfondi.",
          b1: "Synchronisation cloud",
          b2: "Insights premium",
          b3: "Mode invité disponible",
        },

        // Écran final (Sauvegarder & débloquer)
        final: {
          tagline: "Votre chemin, préservé.",
          title: "Sauvegarder & débloquer",
          description: "Synchronisez votre profil spirituel et débloquez des outils plus profonds quand vous êtes prêt.",
          createAccount: "Créer un compte",
          signIn: "Se connecter",
          continueGuest: "Continuer en invité",
          guestNote: "Vos données restent sur cet appareil.",
          premium: {
            title: "Outils spirituels avancés",
            item1: "Compatibilité & résonance relationnelle",
            item2: "Istikhara guidée & enquête spirituelle",
            item3: "Alignement des Noms divins & intentions",
            subtext: "Disponible pour les membres cherchant une exploration plus profonde.",
          },
          disclaimer: "Cette application soutient la réflexion et la conscience spirituelle. Elle ne remplace pas les conseils religieux ou professionnels.",
          or: "ou",
        },
      },
    },
  },
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.en;
