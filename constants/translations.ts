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
      whoAmI: "Who Am I",
    },
    
    // Drawer Menu
    drawer: {
      profileSettings: "PROFILE & SETTINGS",
      myProfile: "My Profile",
      aiSettings: "AI Settings",
      tools: "TOOLS",
      abjadCalculator: "Abjad Calculator",
      nameDestiny: "Name Destiny",
      zikr: "Dhikr & Wird",
      compatibility: "Compatibility",
      whoAmI: "Who Am I",
      divineTiming: "Divine Timing",
      notifications: "NOTIFICATIONS",
      notificationSettings: "Notification Settings",
      notificationTest: "Test Notifications",
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

    planetCondition: {
      label: "Planet condition",
      scoreLabel: "Score",
      status: {
        Favorable: "Favorable",
        Neutral: "Neutral",
        Restricted: "Restricted",
        Avoid: "Avoid",
      },
      reasons: {
        DIGNITY_EXALTATION: "Exaltation (Sharaf): strongest support.",
        DIGNITY_DOMICILE: "Domicile (Bayt): steady and reliable.",
        DIGNITY_DETRIMENT: "Detriment (Wabāl): friction and instability.",
        DIGNITY_FALL: "Fall (Hubūṭ): weakened expression.",
        DIGNITY_NEUTRAL: "Neutral: balanced tone.",
        DEGREE_EXALTATION_PEAK_NEAR: "Near the exaltation peak (±3°): extra lift.",
        DEGREE_EXALTATION_NEAR: "Close to the exaltation peak (±7°): slight lift.",
        DEGREE_CRITICAL_TRANSITION: "Critical degree (0–1° or 29–30°): transitional instability.",
      },
    },

    // Manazil Screen (Detail)
    manazilScreen: {
      currentMoonPosition: "Current Moon Position",
      liveIndicator: "🔴 LIVE - Updates in real-time",
      moonStrength: "Moon Strength",
      mansion: "Mansion",
      quality: "Quality",
      changesEvery: "Changes every ~2.4 days",
      cosmicDialogueTitle: "🌌 Cosmic Dialogue",
      mansionWisdomTitle: "🏛️ Mansion Wisdom",
      fromYourName: "From your name: {name}",
      staticNeverChanges: "Static - never changes",
      needTimingGuidanceTitle: "⏰ Need Timing Analysis?",
      needTimingGuidanceSubtitle: "Check these screens for spiritual timing:",
      dailyEnergyLinkTitle: "Daily Energy",
      dailyEnergyLinkSubtitle: "See the overall timing for today.",
      momentAlignmentLinkTitle: "Moment Alignment",
      momentAlignmentLinkSubtitle: "See timing for right now (hour-by-hour).",
      timingGuidanceNote: "Scores update every few minutes.",
      elementalStatus: {
        harmonious: "Harmonious",
        balanced: "Balanced",
        tension: "Tension",
        bothAre: "Both are {element} — naturally supportive.",
        proceedMindfully: "{element1} and {element2} create contrast — proceed mindfully.",
        neutralEnergy: "{element1} and {element2} are different but not opposed — adaptable energy.",
      },
      relationship: {
        title: "Mansion Relationship",
        subtitle: "How today's Moon element interacts with your personal mansion.",
        yourEssence: "Your essence",
        currentMoon: "Current Moon",
        howToNavigate: "How to navigate today",
        bestCompatibility: "Best compatibility",
        whenMoonIn: "When the Moon is in {element}, your personal mansion is especially supported.",
        nextMoon: "Next {element} Moon: {relativeTime} ({date})",
        today: "today",
        tomorrow: "tomorrow",
        inDays: "in {count} days",
        nextWeek: "next week",
        inWeeks: "in {count} weeks",
        inMonths: "in {count} months",
        tips: {
          harmonious1: "Amplify your natural gifts",
          harmonious2: "Trust your spiritual instincts",
          harmonious3: "Work with your element's strengths",
          balanced1: "Work with both energies consciously",
          balanced2: "Find the bridge between elements",
          balanced3: "Let balance be your teacher",
          tension1: "Move gently and stay present",
          tension2: "Choose one simple, grounded next step",
          tension3: "Prioritize calm, clarity, and intention",
        },
      },
      personalMessage: {
        title: "Personal Message",
        subtitle: "For your personal mansion: {name}",
        forYourNature: "For your {element} nature",
        messageHarmonious: "Today's {moonElement} Moon harmonizes with your {personalElement} essence. Your natural gifts are amplified — trust your instincts and work with your strengths.",
        messageTension: "Today's {moonElement} Moon creates dynamic tension with your {personalElement} nature. This isn't bad — it's growth through balance. Move mindfully and stay present.",
        messageBalanced: "Today's {moonElement} Moon brings neutral energy to your {personalElement} essence. This creates space for conscious choice — you can lean into either energy as needed.",
      },
    },

    notifications: {
      harmony: {
        favorableTitle: "🌟 Favorable Window",
        transformativeTitle: "✨ Transformative Window",
        delicateTitle: "⚠️ Gentle Timing",
        updateTitle: "⏰ Timing Update",
        personalNoteAligned: "Aligned with your {element} element.",
        favorableBody: "A favorable hour is beginning for {activity}. {planet} hour • {element}.{personalNote} Open Moment Alignment for what’s supported now.",
        transformativeBody: "A transformative hour is beginning for {activity}. {planet} hour • {element}.{personalNote} Open Moment Alignment for what’s supported now.",
        delicateBody: "A delicate hour is beginning. Move gently and stay mindful. {planet} hour • {element}.{personalNote}",
      },
      timing: {
        // New component translations (TimingGuidanceCard, TodayDetailsCard, CollapsibleEducationalSection)
        currentTiming: "Current Timing",
        hour: "Hour",
        endsAt: "Ends at",
        nextBestHour: "Next Best Hour",
        inHours: "in",
        expectedQuality: "Expected Quality",
        suggestion: "Suggestion",
        proceedNow: "Proceed now",
        waitForBetter: "Wait for better timing if possible",
        excellentTiming: "Excellent timing right now!",
        todaysDetails: "Today's Details",
        dayRuler: "Day Ruler",
        element: "Element",
        quality: "Quality",
        whyThisTiming: "Why This Timing?",
        elementHarmony: "Element Harmony",
        momentAlignment: "Moment Alignment",
        planetaryResonance: "Planetary Resonance",
        whatThisMeans: "What This Means",
        // Legacy translations
        harmonyHigh: "highly favorable energies",
        harmonyBalanced: "balanced energies with potential for growth",
        harmonyReflective: "reflective energies, good for inner work",
        personalNoteSameElement: "Your element ({element}) is strongly activated today.",
        morningTitle: "{emoji} Morning Briefing — {dayName}",
        morningBody: "Today carries {elementName} energy with {harmonyText}. Current hour: {planet}.{personalNote} Open Daily Guidance for personalized recommendations.",
        alignmentTitle: "✨ Alignment Peak — {elementUpper}",
        alignmentBody: "Strong {element} alignment right now. Best for {activity}. Open Moment Alignment for your next step.",
      },
      prayer: {
        prayerTitle: "🕌 {prayerName} Prayer",
        prayerBody: "It’s time for {prayerName} ({arabic}). {glimpse}Tap for Prayer Guidance + times.",
        reminderTitle: "⏰ {prayerName} in {minutes} min",
        reminderBody: "Prepare now: wudu, intention, and calm focus. {glimpse}Tap for Prayer Guidance.",
        guidanceGlimpse: "Now: {planet} hour • {element}. {note} ",
        guidanceNoteAligned: "Strong resonance for you.",
        guidanceNoteSupportive: "Supportive tone—move steadily.",
        guidanceNoteChallenging: "Challenging tone—go gently.",
        guidanceNoteNeutral: "Balanced tone—stay mindful.",
        testTitle: "🕌 Test Prayer Notification",
        testBodySoundOn: "Testing adhan sound",
        testBodySoundOff: "Testing notification (sound disabled)",
      },
      detail: {
        back: "Back",
        title: "Notification",
        tip: "Tip: Android may collapse notification bodies in the tray; this screen always shows the full text.",
        openPrayerTimes: "Open Prayer Times",
        openPrayerGuidance: "Open Prayer Guidance",
        openDivineTiming: "Open Divine Timing",
        openDailyCheckIn: "Open Daily Check-In",
        openMomentAlignment: "Open Moment Alignment",
        openDailyGuidance: "Open Daily Energy",
      },
    },
    
    // Widgets (Home Screen Cards)
    widgets: {
      planetTransit: {
        title: "Planet Transit",
        subtitle: "Long-term",
        cta: "See your impact →",
        timeScale: "Long-term (weeks/months)",
        updated: "Updated {time} ago",
      },
      dailyEnergy: {
        title: "Daily Energy",
        todaysElement: "Today's Element",
        dayRuler: "Day Ruler",
        bestFor: "BEST FOR",
        todaysFocus: "Today's Focus",
        forReflection: "For reflection",
        viewDetails: "View details",
        peakHours: "{planet} hours (check Moment Alignment for specific times)",
        windows: {
          neutral: "Neutral Window",
          favorable: "Favorable Window",
          transformative: "Transformative Window",
          delicate: "Delicate Window",
        },
        energyDescriptions: {
          fire: "Dynamic & energizing",
          water: "Flowing & emotional",
          air: "Mental & communicative",
          earth: "Grounding & structured",
        },
        planetaryFocus: {
          saturn: "Finish what you started, build solid foundations",
          jupiter: "Expand your horizons, embrace opportunities",
          mars: "Take bold action, assert yourself",
          venus: "Nurture relationships, appreciate beauty",
          mercury: "Communicate clearly, learn something new",
          moon: "Trust your intuition, tend to emotions",
          sun: "Lead with confidence, express yourself",
        },
        activities: {
          jupiter: {
            excellent: {
              0: "Starting new learning or teaching",
              1: "Business expansion and opportunities",
              2: "Seeking guidance or mentorship",
              3: "Travel planning or philosophical study",
              4: "Social connections and networking",
            },
            lessFavorable: {
              0: "Detailed technical work (wait for Mercury day)",
              1: "Financial conservatism (Jupiter encourages expansion)",
            },
          },
          mars: {
            excellent: {
              0: "Physical training and athletics",
              1: "Starting bold initiatives",
              2: "Competitive activities",
              3: "Overcoming obstacles",
              4: "Decisive action",
            },
            lessFavorable: {
              0: "Delicate negotiations",
              1: "Emotional conversations",
              2: "Patience-requiring tasks",
              3: "Passive or overly cautious approaches",
            },
          },
          mercury: {
            excellent: {
              0: "Writing and communication",
              1: "Learning and study",
              2: "Business negotiations",
              3: "Planning and strategizing",
              4: "Short trips and errands",
            },
            lessFavorable: {
              0: "Emotional decision-making",
              1: "Heavy physical labor",
              2: "Long-term commitments without analysis",
            },
          },
          venus: {
            excellent: {
              0: "Relationship building",
              1: "Creative and artistic work",
              2: "Beauty and aesthetic pursuits",
              3: "Social gatherings",
              4: "Financial agreements",
            },
            lessFavorable: {
              0: "Aggressive action",
              1: "Confrontation",
              2: "Harsh criticism",
            },
          },
          saturn: {
            excellent: {
              0: "Completing long-term projects",
              1: "Building structures and systems",
              2: "Discipline and focus work",
              3: "Administrative tasks",
              4: "Long-term planning",
            },
            lessFavorable: {
              0: "Spontaneous decisions",
              1: "Starting creative new projects",
              2: "Social leisure activities",
            },
          },
          sun: {
            excellent: {
              0: "Leadership and taking charge",
              1: "Self-expression and creativity",
              2: "Public presentations",
              3: "Personal branding",
              4: "Confidence-building activities",
            },
            lessFavorable: {
              0: "Submissive roles",
              1: "Background support work",
              2: "Self-deprecation",
            },
          },
          moon: {
            excellent: {
              0: "Emotional healing and reflection",
              1: "Nurturing and caregiving",
              2: "Intuitive work",
              3: "Family time",
              4: "Self-care and rest",
            },
            lessFavorable: {
              0: "Aggressive action",
              1: "Logical-only decisions",
              2: "Emotional suppression",
            },
          },
          common: {
            waitForBetterTiming: "Starting major new initiatives (wait for better timing)",
          },
        },
        // Planetary Judgment Card
        planetaryJudgment: {
          title: "Planetary Judgment",
          cosmicVerdict: "TODAY'S COSMIC VERDICT",
          status: {
            supportive: "Supportive Day",
            neutral: "Neutral Day",
            cautious: "Mindful Day",
          },
          classicalTerms: {
            supportive: "Benefic",
            neutral: "Neutral",
            cautious: "Malefic",
          },
          intro: "Today is ruled by {planet}.",
          rulerTone: {
            sun: "The Sun brings vitality, leadership, and self-expression. A day for confidence and visibility.",
            moon: "The Moon governs emotions, intuition, and nurturing. A day for inner work and family.",
            mars: "Mars energizes action, courage, and competition. A day for bold moves but watch for conflict.",
            mercury: "Mercury rules communication, learning, and commerce. A day for study and negotiation.",
            jupiter: "Jupiter expands opportunities, wisdom, and good fortune. A day for growth and generosity.",
            venus: "Venus brings harmony, beauty, and relationships. A day for love and aesthetics.",
            saturn: "Saturn demands discipline, structure, and patience. A day for completing long-term work.",
          },
          phaseModifier: {
            amplify: "The waxing Moon amplifies today's energy—seize the momentum.",
            soften: "The waning Moon softens the intensity—reflect before acting.",
            neutral: "The Moon is in transition—balance action with contemplation.",
          },
          bestForLabel: "Best For",
          avoidLabel: "Avoid",
          disclaimer: "Classical guidance based on planetary rulership. Your personal chart may modify these influences.",
          bestFor: {
            sun: {
              0: "Leadership and taking charge",
              1: "Public presentations and visibility",
              2: "Self-expression and creativity",
            },
            moon: {
              0: "Emotional healing and reflection",
              1: "Family time and nurturing",
              2: "Intuitive decisions",
            },
            mars: {
              0: "Physical training and athletics",
              1: "Starting bold initiatives",
              2: "Competitive activities",
            },
            mercury: {
              0: "Writing and communication",
              1: "Learning and study",
              2: "Business negotiations",
            },
            jupiter: {
              0: "Expansion and growth opportunities",
              1: "Teaching and learning",
              2: "Travel and philosophical study",
            },
            venus: {
              0: "Relationship building",
              1: "Creative and artistic work",
              2: "Beauty and aesthetic pursuits",
            },
            saturn: {
              0: "Completing long-term projects",
              1: "Building structures and systems",
              2: "Discipline and focus work",
            },
          },
          avoid: {
            sun: {
              0: "Submissive roles",
              1: "Background support work",
              2: "Self-deprecation",
            },
            moon: {
              0: "Aggressive confrontation",
              1: "Purely logical decisions",
              2: "Emotional suppression",
            },
            mars: {
              0: "Delicate negotiations",
              1: "Emotional conversations",
              2: "Patience-requiring tasks",
            },
            mercury: {
              0: "Emotional decision-making",
              1: "Heavy physical labor",
              2: "Long-term commitments without analysis",
            },
            jupiter: {
              0: "Overpromising",
              1: "Reckless expansion",
              2: "Ignoring practical details",
            },
            venus: {
              0: "Aggressive action",
              1: "Harsh criticism",
              2: "Confrontation",
            },
            saturn: {
              0: "Spontaneous decisions",
              1: "Starting creative new projects",
              2: "Social leisure activities",
            },
          },
        },
        scope: {
          day: "Today's Day Ruler",
        },
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
      dailyGuidance: {
        title: "Daily Guidance",
        dayRuler: "Day ruler",
        yourElement: "You",
        bestForLabel: "Best for",
        reflection: "For reflection",
        windows: {
          neutral: "Neutral Window",
          favorable: "Favorable Window",
          transformative: "Transformative Window",
          delicate: "Delicate Window",
        },
        alignment: {
          supportive: "Supportive Balance",
          neutral: "Balanced Energy",
          challenging: "Dynamic Tension",
        },
        focuses: {
          neutral: {
            0: "Balance routine with spontaneity",
            1: "Maintain steady energy throughout",
            2: "Ground yourself in the present",
          },
          favorable: {
            0: "Seize opportunities that align",
            1: "Trust your natural flow today",
            2: "Express yourself authentically",
          },
          transformative: {
            0: "Notice the shift and adapt gently",
            1: "Let insight guide your next step",
            2: "Embrace change with patience",
          },
          delicate: {
            0: "Slow down and protect your focus",
            1: "Observe before reacting",
            2: "Choose calm over urgency",
          },
        },
        cta: "View details →",
      },

      manazil: {
        title: "Manazil",
        badge: "Your Resonance",
        completeProfile: "Complete profile",
        advancedPractices: "Advanced practices",
        todaysMansion: "Today's Mansion",
        yourMansion: "Your Mansion",
        dailyElement: "Daily Element",
        yourElement: "Your Element",
        resonanceLabel: "Resonance",
        guidanceLabel: "Guidance",
        understandResonance: "View details →",
        favorable: "Favorable",
        balanced: "Balanced",
        delicate: "Delicate",
        resonanceLevels: {
          supportive: "Supportive",
          harmonious: "Harmonious",
          neutral: "Neutral",
          challenging: "Challenging",
          transformative: "Transformative",
        },
        guidanceByResonance: {
          supportive: "Strong alignment today. Move with confidence and keep momentum.",
          harmonious: "A helpful match. Collaborate, learn, and build steadily.",
          neutral: "Balanced tone. Your intention determines the outcome—choose clarity.",
          challenging: "Some friction is likely. Simplify, finish essentials, and be gentle.",
          transformative: "High tension can catalyze growth. Go slowly and choose wisdom over force.",
        },
        realTime: "Real-time",
        approximate: "Approximate",
        currentMansion: "Current Mansion:",
        yourBaseline: "Your Baseline",
        reflection: "For reflection",
        today: "🌙 Manazil today: {name}",
        todayApprox: "≈ Manazil today (approx): {name}",
        personal: "Your Baseline Mansion: {name}",
        personalMissing: "🧿 Your Manazil: complete profile",
        personalizedFor: "Personalized for",
        resonance: {
          harmonious: "Resonance: strongly aligned",
          supportive: "Resonance: supportive",
          challenging: "Resonance: challenging",
          neutral: "Resonance: balanced",
        },
        advice: {
          bestForLabel: "Best for",
          avoidLabel: "Avoid",
          bestForShort: {
            fire: "Initiative",
            water: "Gentle repair",
            air: "Clear planning",
            earth: "Structure & completion",
          },
          bestFor: {
            fire: "initiative, courageous action, starting what matters",
            water: "reflection, healing, spiritual practice, gentle repair",
            air: "learning, communication, planning, clear conversations",
            earth: "structure, consistency, finances, finishing what’s planned",
          },
          avoid: {
            fire: "impulsive conflict, rushing, burning out",
            water: "overwhelm, emotional spirals, taking on too much",
            air: "overthinking, scattered attention, empty debate",
            earth: "stubbornness, rigidity, delaying decisions",
          },
          resonance: {
            harmonious: "Your personal Manazil is strongly in tune with today—lean in.",
            supportive: "Today supports your baseline—steady progress wins.",
            challenging: "Today may feel tense—go gently and simplify.",
            neutral: "Balanced tone—choose the clearest next step.",
          },
        },
        compactAdvice: "Seize opportunities that align",
        cta: "View details →",
      },
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
      whoAmI: {
        title: "Who Am I",
        description: "Deep self-analysis through name numerology: element, personality, career & spiritual path",
      },
      guidedIstikhara: {
        title: "Guided Istikhārah",
        description: "Learn the traditional prayer method and track your spiritual decisions",
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
      asrariya: {
        title: "Practice Timing",
        description: "Find the optimal moments for your spiritual practices",
      },
      prayerTimes: {
        title: "Prayer Times",
        description: "Daily prayer times based on your location",
      },
      quran: {
        title: "Quran",
        description: "Read the Quran with translations and bookmarks",
      },
      qibla: {
        title: "Qibla",
        description: "Find the direction to Kaaba for prayer",
      },
      dhikrCounter: {
        title: "Dhikr Counter",
        description: "Digital tasbih for counting dhikr and remembrance",
      },
      zikr: {
        title: "Dhikr & Wird",
        description: "Remembrance of Allah for inner peace",
      },
    },

    // Zikr Module
    zikr: {
      title: "Dhikr & Wird",
      subtitle: "Remembrance of Allah for inner peace",
      todayProgress: "Today",
      allTimeProgress: "All Time",
      favorites: "Favorites",
      noFavorites: "No Favorites Yet",
      noFavoritesHint: "Tap the heart on any dhikr to add it to your favorites",
      goalReached: "Goal reached!",
      categories: {
        all: "All",
        favorites: "Favorites",
        istighfar: "Istighfār",
        salawat: "Ṣalawāt",
        divineNames: "Divine Names",
        morningEvening: "Morning & Evening",
        custom: "Custom",
      },
      sessions: {
        fajr: "Fajr",
        morning: "Morning",
        dhuhr: "Ẓuhr",
        asr: "ʿAṣr",
        maghrib: "Maghrib",
        isha: "ʿIshāʾ",
        tahajjud: "Tahajjud",
        other: "Other",
      },
      stats: {
        streak: "day streak",
        total: "total",
      },
      actions: {
        add: "Add",
        cancel: "Cancel",
        customAmount: "Custom Amount",
        enterNumber: "Enter a number...",
      },
    },

    // Prayer Times Screen
    prayerTimes: {
      title: "Prayer Times",
      next: "NEXT",
      inTime: "in {{time}}",
      noPrayer: "No prayer",
      getGuidance: "Get Prayer Guidance",
      tapForGuidance: "Tap to see Prayer Guidance",
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
      buttons: {
        learnMore: "Learn More",
        collapse: "Show Less",
        tapToLearn: "Tap to learn more",
      },
      retry: "Retry",
      on: "ON",
      off: "OFF",
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
      element: "Element",
      you: "You",
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
      // Quality levels (TimingGuidanceCard)
      quality: {
        excellent: "Excellent",
        good: "Good",
        moderate: "Moderate",
        weak: "Weak",
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
          act: "Excellent Time",
          maintain: "Neutral",
          hold: "Proceed Mindfully",
          aligned: "Aligned",
          steady: "Steady",
          mindful: "Mindful",
        },
        hint: {
          act: "Sun, Jupiter, or Venus hour — proceed with confidence",
          maintain: "Moon or Mercury hour — steady as you go",
          hold: "Saturn or Mars hour — exercise patience",
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
            // Carte d'alignement (contexte spirituel)
            alignmentLevel: {
              exceptional: "EXCEPTIONNEL",
              strong: "FORT",
              favorable: "FAVORABLE",
              moderate: "MODÉRÉ",
              balanced: "ÉQUILIBRÉ",
              challenging: "DIFFICILE",
            },
            alignmentDescription: {
              exceptional:
                "Votre nature {userElement} s'aligne parfaitement avec cette heure {hourElement}. Moment optimal pour le travail spirituel.",
              strong:
                "Votre nature {userElement} harmonise fortement avec cette heure {hourElement}. Excellentes conditions pour la pratique.",
              favorable:
                "Votre nature {userElement} fonctionne bien avec cette heure {hourElement}. Bon moment pour les activités spirituelles.",
              moderate:
                "Votre nature {userElement} a une compatibilité modérée avec cette heure {hourElement}. Pratique régulière recommandée.",
              balanced:
                "Votre nature {userElement} recherche l'équilibre avec cette heure {hourElement}. Concentrez-vous sur l'équilibre dans la pratique.",
              challenging:
                "Votre nature {userElement} rencontre son opposé durant cette heure {hourElement}. Gardez des pratiques douces, ancrées et constantes.",
            },
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
          rulesLabel: "Sign",
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

      planetTransitDetails: {
        title: "Planet Transit",
        explainer: "Shows the ruling planetary energy and how it interacts with your spiritual nature.",
        explainers: {
          currentHour: "Shows the active planetary hour (changes through the day) and how it interacts with your spiritual nature.",
          tomorrowRuler: "Shows tomorrow’s planetary day ruler (weekday influence) and how it interacts with your spiritual nature.",
        },
        subtitleNow: "Your current planetary hour — personalized to your profile",
        subtitleNextDay: "Tomorrow's ruler — personalized to your profile",
        error: "Unable to load details right now.",
        nextChange: "Next change in {countdown}",
        sections: {
          dayEnergy: "Day Energy",
          currentHour: "Current Hour",
          tomorrowRuler: "Tomorrow's Day Ruler",
          yourNature: "Your Nature",
          resonance: "Resonance",
          context: "Based on elemental relationships in traditional spiritual astrology.",
        },
        hints: {
          currentHour: "This is the active planetary hour (it changes through the day).",
          tomorrowRuler: "This is tomorrow’s planetary day ruler (weekday influence).",
        },
        pills: {
          element: "Element",
          sign: "Sign",
          dayRuler: "Day ruler",
        },
        yourZodiac: "Your zodiac: {zodiac}",
        yourElement: "Your element: {element}",
        yourBurj: "Your burj: {burj}",
        dayRuler: "Day ruler: {ruler}",
        missingProfile: "Add your date of birth to personalize these insights.",
        completeProfile: "Complete profile",
        resonanceNoProfile: "Complete your profile to see personalized resonance.",
        resonanceType: {
          supportive: "Supportive",
          challenging: "Challenging",
          neutral: "Neutral",
        },
        harmony: {
          harmonious: {
            label: "Harmonious",
            description: "A strong match: your {userElement} nature aligns with {contextElement} energy.",
            whatToDo: "Good for steady progress, clear intentions, and finishing what you started.",
            bestFor: "Best for today: Steady progress, clear intentions, completing tasks",
            avoid: "Better to avoid: Rushing, overcommitting, starting too many new things",
          },
          supportive: {
            label: "Supportive",
            description: "Supportive flow: your {userElement} is helped by {contextElement} energy.",
            whatToDo: "Good for collaboration, learning, and gentle forward motion.",
            bestFor: "Best for today: Collaboration, learning, seeking advice",
            avoid: "Better to avoid: Isolation, stubbornness, forcing outcomes",
          },
          neutral: {
            label: "Neutral",
            description: "Balanced mix: your {userElement} meets {contextElement} without friction.",
            whatToDo: "Good for routine tasks and measured decisions.",
            bestFor: "Best for today: Routine tasks, planning, reflection",
            avoid: "Better to avoid: Major decisions, extremes, impulsiveness",
          },
          challenging: {
            label: "Challenging",
            description: "Transformative tension: your {userElement} meets opposing {contextElement} energy.",
            whatToDo: "Slow down, review, and avoid impulsive choices — let clarity arrive.",
            bestFor: "Best for today: Review, patience, inner reflection",
            avoid: "Better to avoid: Impulsive choices, confrontation, rushing",
          },
        },
        disclaimer: "For reflection only • Not a ruling",
        influenceEngine: {
          personalInfluence: "Personalized Influence",
          collectiveInfluence: "Collective Influence",
          collectiveImpact: "Collective Impact",
          cosmicWeather: "Cosmic Weather",
          forYou: "For You",
          howRelates: "How This Relates to You",
          detailedGuidance: "Detailed Guidance",
          guidanceDescription: "Personalized advice for this planetary influence",
          bestForNow: "Best For Now",
          betterToAvoid: "Better to Avoid",
          reflectivePractices: "Reflective Practices",
          items: {
            takingAlignedAction: "Taking aligned action",
            makingImportantDecisions: "Making important decisions",
            beginningNewInitiatives: "Beginning new initiatives",
            buildMeaningfulConnections: "Build meaningful connections",
            createBeauty: "Create beauty",
            trustYourNaturalInstincts: "Trust your natural instincts",
            observationAndPatience: "Observation and patience",
            planningWithoutRushing: "Planning without rushing",
            seekingClarityBeforeActing: "Seeking clarity before acting",
            forcingDecisions: "Forcing decisions",
            majorCommitments: "Major commitments",
            hastyActions: "Hasty actions",
            completingExistingWork: "Completing existing work",
            reflectionAndReview: "Reflection and review",
            releasingWhatNoLongerServes: "Releasing what no longer serves",
            startingNewProjects: "Starting new projects",
            majorDecisions: "Major decisions",
            pushingAgainstResistance: "Pushing against resistance",
            acceptLimitations: "Accept limitations",
            buildFoundationsSlowly: "Build foundations slowly",
            rebellionAgainstStructure: "Rebellion against structure",
            shortcuts: "Shortcuts",
            disciplineAndCommitment: "Discipline and commitment",
            longTermPlanning: "Long-term planning",
            laziness: "Laziness",
            avoidingResponsibility: "Avoiding responsibility",
            harvestLessonsLearned: "Harvest lessons learned",
            honorCommitmentsMade: "Honor commitments made",
            bitterness: "Bitterness",
            regretWithoutAction: "Regret without action",
            opennessToExpansion: "Openness to expansion",
            learningAndTeaching: "Learning and teaching",
            overconfidence: "Overconfidence",
            excess: "Excess",
            growthOpportunities: "Growth opportunities",
            sharingWisdom: "Sharing wisdom",
            greed: "Greed",
            takingMoreThanNeeded: "Taking more than needed",
            integrateWhatWasGained: "Integrate what was gained",
            shareBlessings: "Share blessings",
            hoarding: "Hoarding",
            prideInAchievements: "Pride in achievements",
            assessChallengesCarefully: "Assess challenges carefully",
            buildCourage: "Build courage",
            impulsiveAnger: "Impulsive anger",
            rushingIntoConflict: "Rushing into conflict",
            courageousAction: "Courageous action",
            defendingTruth: "Defending truth",
            aggression: "Aggression",
            harmingOthers: "Harming others",
            completeBattlesWisely: "Complete battles wisely",
            forgiveWhenAble: "Forgive when able",
            prolongingConflict: "Prolonging conflict",
            holdingGrudges: "Holding grudges",
            exploreValuesAndDesires: "Explore values and desires",
            appreciateBeauty: "Appreciate beauty",
            attachmentToFleetingPleasures: "Attachment to fleeting pleasures",
            vanity: "Vanity",
            releaseAttachments: "Release attachments",
            appreciateWhatRemains: "Appreciate what remains",
            clingingToWhatsEnding: "Clinging to what’s ending",
            jealousy: "Jealousy",
            listenMoreThanSpeak: "Listen more than speak",
            gatherInformation: "Gather information",
            gossip: "Gossip",
            hastyConclusions: "Hasty conclusions",
            clearCommunication: "Clear communication",
            deception: "Deception",
            withholdingTruth: "Withholding truth",
            concludeConversations: "Conclude conversations",
            summarizeLearnings: "Summarize learnings",
            overExplaining: "Over-explaining",
            endlessDebate: "Endless debate",
            clarifyIntentions: "Clarify intentions",
            identifyPurpose: "Identify purpose",
            egoDrivenAction: "Ego-driven action",
            seekingValidation: "Seeking validation",
            leadWithIntegrity: "Lead with integrity",
            shineYourGifts: "Shine your gifts",
            arrogance: "Arrogance",
            overshadowingOthers: "Overshadowing others",
            acknowledgeAchievementsHumbly: "Acknowledge achievements humbly",
            rest: "Rest",
            burnout: "Burnout",
            pride: "Pride",
            honorEmotions: "Honor emotions",
            nurtureYourself: "Nurture yourself",
            emotionalReactivity: "Emotional reactivity",
            ignoringFeelings: "Ignoring feelings",
            trustIntuition: "Trust intuition",
            careForOthers: "Care for others",
            emotionalManipulation: "Emotional manipulation",
            codependency: "Codependency",
            releaseEmotionalBaggage: "Release emotional baggage",
            forgive: "Forgive",
            holdingOntoPain: "Holding onto pain",
            collaborateWithTheEnergy: "Collaborate with the energy",
            forcingYourWayAlone: "Forcing your way alone",
            stayFlexibleAndObservant: "Stay flexible and observant",
            strongCommitmentsEitherWay: "Strong commitments either way",
            patienceAndLearningFromFriction: "Patience and learning from friction",
            fightingAgainstTheCurrent: "Fighting against the current",
            procrastination: "Procrastination",
            ignoringOpportunities: "Ignoring opportunities",
            excessiveHesitation: "Excessive hesitation",
            superficiality: "Superficiality",
            excessIndulgence: "Excess indulgence",
            doubtingYourselfUnnecessarily: "Doubting yourself unnecessarily",
            purposefulActionWithIntention: "Purposeful action with intention",
            actsOfKindness: "Acts of kindness",
            artisticExpression: "Artistic expression",

            // Reflective practices (translated for Premium guidance lists)
            istighfarSeekingForgiveness: "Istighfār (seeking forgiveness)",
            duaForGuidance: "Duʿāʾ for guidance",
            contemplationAndSilence: "Contemplation and silence",
            shukrGratitude: "Shukr (gratitude)",
            salawatUponTheProphet: "Ṣalawāt upon the Prophet ﷺ",
            tasbihGlorification: "Tasbīḥ (glorification of Allah)",
            closingPrayersAndGratitude: "Closing prayers and gratitude",
            restAndRestoration: "Rest and restoration",
            patienceSabr: "Patience (Ṣabr)",
            trustInDivineTimingTawakkul: "Trust in divine timing (Tawakkul)",
            consistentWorship: "Consistent worship",
            fulfillingObligations: "Fulfilling obligations",
            gratitudeForTrials: "Gratitude for trials",
            duaForRelief: "Duʿāʾ for relief",
            seekingKnowledge: "Seeking knowledge",
            generosityInMeasure: "Generosity in measure",
            sadaqahCharity: "Ṣadaqah (charity)",
            teachingOthers: "Teaching others",
            humility: "Humility",
            passingKnowledgeForward: "Passing knowledge forward",
            controllingAngerGhayz: "Controlling anger (Ghayẓ)",
            seekingCalm: "Seeking calm",
            jihadAlNafsInnerStruggle: "Jihād al-Nafs (inner struggle)",
            righteousEffort: "Righteous effort",
            forgivenessAfw: "Forgiveness (ʿAfw)",
            peaceMaking: "Peace-making",
            gratitudeForBlessings: "Gratitude for blessings",
            moderation: "Moderation",
            contentmentQanah: "Contentment (Qanāʿah)",
            trustInProvision: "Trust in provision",
            mindfulSpeech: "Mindful speech",
            activeListening: "Active listening",
            speakingTruthWithWisdom: "Speaking truth with wisdom",
            sharingKnowledge: "Sharing knowledge",
            silenceWhenNeeded: "Silence when needed",
            reflectionOnWords: "Reflection on words",
            ikhlasSincerity: "Ikhlas (sincerity)",
            purifyingIntention: "Purifying intention",
            humilityInService: "Humility in service",
            authenticExpression: "Authentic expression",
            gratitudeToAllah: "Gratitude to Allah",
            renewal: "Renewal",
            dhikrForPeace: "Dhikr for peace",
            selfCompassion: "Self-compassion",
            prayerForEmotionalHealing: "Prayer for emotional healing",
            actsOfNurturing: "Acts of nurturing",
            emotionalCleansingDua: "Emotional cleansing duʿāʾ",
            lettingGo: "Letting go",
          },
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

        currentHour: {
          endsIn: "تنتهي خلال {minutes}د",
        },
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
      
      // Prayer Guidance - Classical Planetary Hour Practices
      prayerGuidance: {
        title: "Prayer Guidance",
        subtitle: "Classical planetary hour practices from traditional sources",

        // UI labels used by the Prayer Guidance screens/cards
        ui: {
          headerSubtitle: "Personalized spiritual guidance based on classical Islamic sciences",
          currentHour: "Current Hour: {planet} {arabicName}",
          currentHourLabel: "Current Hour",
          hourOfTwelve: "Hour {number}/12",
          day: "Day",
          night: "Night",
          generating: "Generating guidance...",

          forEveryone: "For Everyone",
          forPractitioners: "For Practitioners",
          primaryFocus: "Primary",
          spiritualPrimary: "Spiritual practice is primary; worldly alignment is secondary.",
          dhikrTitle: "Recommended Dhikr",
          quranTitle: "Quranic Recitation",
          duaTitle: "Recommended Duas",
          intentionsTitle: "Spiritual Intentions (Niyyah)",
          sunnahTitle: "Sunnah Practices",
          adabTitle: "Proper Manners (Adab)",
          expandAdvanced: "View Advanced Guidance",
          collapseAdvanced: "Hide Advanced Guidance",
          classicalReferences: "Traditional References",
          traditionalContext: "Traditional Context",
          naturalAlignment: "Natural Alignment",

          profileHintTitle: "Complete your profile to personalize guidance",
          profileHintBody: "Add your Arabic name in Profile so we can compute your Abjad signature and element.",
          goToProfile: "Go to Profile",
          missingArabicName: "Missing: Arabic name",

          emptyTitle: "Select a Prayer",
          emptyBody: "Choose a prayer above to receive spiritual guidance tailored to your abjad profile and the current planetary hour.",

          footerBasedOn: "✨ Guidance based on your abjad value ({abjad}) and element ({element})",
          sources: "Sources: {source}",

          // Shared card labels
          spiritualContext: "Spiritual Context",
          yourElement: "Your Element",
          hourNumber: "Hour Number",
          timeRemaining: "Time Remaining",
          dayRuler: "Day Ruler",
          next: "Next",
          current: "Current",
          selectPrayer: "Select Prayer",
          changePrayer: "Change",
          guidanceFor: "{prayer} Prayer",

          // Divine name card
          recommendedDivineName: "Recommended Divine Name",
          reciteCount: "Recite {count}×",
          abjadValueLabel: "Abjad Value: {value}",
          showReasoning: "▶ Show Reasoning",
          hideReasoning: "▼ Hide Reasoning",
          planetaryAlignment: "🪐 Planetary Alignment:",
          elementalResonance: "💫 Elemental Resonance:",
          numerologicalSignificance: "🔢 Numerological Significance:",
          classicalSource: "📚 Classical Source:",
          spiritualBenefits: "✨ Spiritual Benefits:",

          // Classical wisdom card
          classicalWisdom: "Classical Wisdom",
          noClassicalGuidance: "No specific classical guidance for this hour",
          modernContext: "In Today's Context",
          modernContextExplanation: "These classical terms refer to spiritual practices that can be understood in contemporary ways—setting intentions, creating beneficial routines, and working with positive symbols and practices.",
          show: "Show",
          hide: "Hide",

          // Spiritual context alignment (warning) card
          alignmentLevel: {
            exceptional: "EXCEPTIONAL",
            strong: "STRONG",
            favorable: "FAVORABLE",
            moderate: "MODERATE",
            balanced: "BALANCED",
            challenging: "CHALLENGING",
          },
          alignmentDescription: {
            exceptional:
              "Your {userElement} nature perfectly aligns with this {hourElement} hour. Optimal time for spiritual work.",
            strong:
              "Your {userElement} nature harmonizes strongly with this {hourElement} hour. Excellent conditions for practice.",
            favorable:
              "Your {userElement} nature works well with this {hourElement} hour. Good time for spiritual activities.",
            moderate:
              "Your {userElement} nature has moderate compatibility with this {hourElement} hour. Steady practice recommended.",
            balanced:
              "Your {userElement} nature seeks balance with this {hourElement} hour. Focus on equilibrium in practice.",
            challenging:
              "Your {userElement} nature meets its opposite in this {hourElement} hour. Keep practices gentle, grounded, and consistent.",
          },

          // Adhkar list
          sunnahAdhkar: "Sunnah Adhkar",
          noAdhkarAvailable: "No adhkar available",
          showTranslation: "Show Translation",
          hideTranslation: "Hide Translation",
          progressCompleted: "{completed} / {total} completed",
          resetAll: "Reset All",

          // Dhikr counter
          dhikrCounter: "Dhikr Counter",
          percentComplete: "{percent}% Complete",
          completedAlhamdulillah: "✨ Completed! Alhamdulillah ✨",
          complete: "✓ Complete",
          tapToCount: "Tap to Count",
          reset: "Reset",
          dhikrHelper: "Tap the button each time you recite the Divine Name",
        },
        
        // Days of the week
        days: {
          Sunday: "Sunday",
          Monday: "Monday",
          Tuesday: "Tuesday",
          Wednesday: "Wednesday",
          Thursday: "Thursday",
          Friday: "Friday",
          Saturday: "Saturday",
        },
        
        // Planets
        planets: {
          Sun: "Sun",
          Moon: "Moon",
          Mars: "Mars",
          Mercury: "Mercury",
          Jupiter: "Jupiter",
          Venus: "Venus",
          Saturn: "Saturn",
        },
        
        // Hour labels
        hours: {
          hour: "Hour",
          hourNumber: "Hour {number}",
          rulingPlanet: "Ruling Planet",
          recommendedWorks: "Recommended Works",
          avoidWorks: "Works to Avoid",
          classicalText: "Classical Text",
          source: "Source",
          tradition: "Tradition",
        },
        
        // Classical works/practices
        works: {
          // Hour 1: Sun - Talismans and sacred works
          talismansSeals: {
            name: "Talismans and Blessed Seals",
            description: "Lawful talismans and blessed seals for protection and spiritual benefit",
          },
          reversalWork: {
            name: "Reversal Work (al-Radd)",
            description: "Practices for turning away harm and negative influences",
          },
          alMaski: {
            name: "Al-Maski",
            description: "Traditional binding practice for spiritual protection",
          },
          hinduBinding: {
            name: "Hindu Binding (al-Qabd al-Hindi)",
            description: "Classical method of spiritual binding from Eastern traditions",
          },
          burntWoolInk: {
            name: "Burnt Wool Ink (Midād al-Ṣūf al-Maḥrūq)",
            description: "Sacred ink preparation used in traditional spiritual writing",
          },

          nightWorks: {
            name: "Nocturnal Works",
            description: "Operations specifically intended for deep night; often avoided in bright, solar hours even if it is currently night",
          },

          // Fallback/default keys used by the Prayer Guidance engine when a specific manuscript hour is not available
          waterRelated: {
            name: "Water-Related Works",
            description: "Purification, cleansing, reconciliation, and gentle emotional work",
          },
          travelMovement: {
            name: "Travel and Movement",
            description: "Journeys, relocations, and initiating movement in lawful matters",
          },
          ironMetalwork: {
            name: "Iron and Metalwork",
            description: "Forge, tools, cutting, and heavy metal-related operations (often avoided in soft lunar/venusian hours)",
          },
          combatDefense: {
            name: "Defense and Confrontation",
            description: "Protective and confrontational work that requires firmness and restraint",
          },
          marriageFamily: {
            name: "Marriage and Family Matters",
            description: "Affairs of marriage, bonding, and family harmony",
          },
          studyKnowledge: {
            name: "Study and Knowledge",
            description: "Learning, reading, writing, research, and seeking understanding",
          },
          herbMedicine: {
            name: "Herbs and Medicine",
            description: "Remedies, herb work, and health-related practice (within lawful means)",
          },
          seekingKingsNobles: {
            name: "Seeking Kings and Nobles",
            description: "Seeking favor with authority, benefactors, and those in leadership",
          },
          landProperty: {
            name: "Land and Property",
            description: "Property matters, agriculture, long-term growth, and lawful expansion",
          },
          magicalWorkings: {
            name: "Coercive or Aggressive Workings",
            description: "Confrontational or coercive operations that contradict Jupiter’s benevolent, expansive quality",
          },
          imprisonmentBondage: {
            name: "Imprisonment and Bondage",
            description: "Restrictive work, constraints, and binding operations",
          },
          saturnWorks: {
            name: "Saturnian Works",
            description: "Discipline, boundaries, endings, and long-term endurance (used carefully)",
          },
          
          // Hour 2: Venus - Harmony and favor
          correctnessSweetness: {
            name: "Works for Correctness and Sweetness",
            description: "Practices to bring harmony, correctness, and pleasant relations",
          },
          dominanceRulers: {
            name: "Dominance Over Rulers",
            description: "Seeking favor and influence with authority figures",
          },
          worksJudges: {
            name: "Works on Judges and Leaders",
            description: "Practices related to gaining favor in legal or leadership matters",
          },
          
          // Hour 3: Mercury - Learning and communication
          learningStudy: {
            name: "Learning and Study",
            description: "Educational pursuits, study, and acquiring knowledge",
          },
          communication: {
            name: "Communication",
            description: "Writing, speaking, and all forms of communication",
          },
          tradeCommerce: {
            name: "Trade and Commerce",
            description: "Business dealings, trade, and commercial activities",
          },
          
          // Hour 4: Moon - Journeys and emotional work
          journeysTravel: {
            name: "Journeys and Travel",
            description: "Physical and spiritual journeys, travel preparations",
          },
          waterWorks: {
            name: "Water Works",
            description: "Activities related to water, purification, and cleansing",
          },
          emotionalMatters: {
            name: "Emotional Matters",
            description: "Working with emotions, feelings, and inner states",
          },
          
          // Hour 5: Saturn - Binding and restriction
          bindingRestriction: {
            name: "Binding and Restriction",
            description: "Practices to bind, restrict, or contain negative influences",
          },
          protectionWork: {
            name: "Protection Work",
            description: "Establishing spiritual protection and boundaries",
          },
          marriageMatters: {
            name: "Marriage Matters",
            description: "Activities related to marriage and partnerships (avoid during Saturn)",
          },
          joyfulWorks: {
            name: "Joyful Works",
            description: "Celebrations and joyful activities (avoid during Saturn)",
          },
          
          // Hour 6: Jupiter - Expansion and blessings
          seekingFavor: {
            name: "Seeking Favor",
            description: "Requesting blessings, favors, and divine assistance",
          },
          wealthExpansion: {
            name: "Wealth and Expansion",
            description: "Practices for abundance, prosperity, and growth",
          },
          religiousMatters: {
            name: "Religious Matters",
            description: "Spiritual practices, worship, and religious activities",
          },
          
          // Hour 7: Mars - Courage and conflict
          courageStrength: {
            name: "Courage and Strength",
            description: "Building inner strength, courage, and determination",
          },
          conflictResolution: {
            name: "Conflict Resolution",
            description: "Dealing with conflicts and confrontations",
          },
          peacefulNegotiations: {
            name: "Peaceful Negotiations",
            description: "Peace-making and diplomatic activities (avoid during Mars)",
          },
          
          // Hour 8: Sun (returns) - Authority and leadership
          authorityLeadership: {
            name: "Authority and Leadership",
            description: "Matters of authority, leadership, and governance",
          },
          honorsRecognition: {
            name: "Honors and Recognition",
            description: "Seeking recognition, honors, and public acknowledgment",
          },
          
          // Hour 9: Venus (returns) - Love and beauty
          loveAttraction: {
            name: "Love and Attraction",
            description: "Matters of love, affection, and attraction",
          },
          beautyArts: {
            name: "Beauty and Arts",
            description: "Artistic pursuits, beauty, and aesthetic matters",
          },
          harmonyPeace: {
            name: "Harmony and Peace",
            description: "Creating harmony, peace, and pleasant conditions",
          },
          
          // Hour 10: Mercury (returns) - Writing and contracts
          writingDocumentation: {
            name: "Writing and Documentation",
            description: "Writing, recording, and documentation activities",
          },
          contractsAgreements: {
            name: "Contracts and Agreements",
            description: "Legal contracts, agreements, and formal arrangements",
          },
          intellectualPursuits: {
            name: "Intellectual Pursuits",
            description: "Mental work, research, and intellectual activities",
          },
          
          // Hour 11: Moon (returns) - Dreams and intuition
          dreamsVisions: {
            name: "Dreams and Visions",
            description: "Working with dreams, visions, and spiritual insights",
          },
          intuitionWork: {
            name: "Intuition Work",
            description: "Developing and following intuition and inner guidance",
          },
          feminineMatters: {
            name: "Feminine Matters",
            description: "Activities related to feminine energy and women's concerns",
          },
          
          // Hour 12: Saturn (returns) - Endings and depth
          endingsClosures: {
            name: "Endings and Closures",
            description: "Completing cycles, endings, and bringing closure",
          },
          deepMeditation: {
            name: "Deep Meditation",
            description: "Profound meditation, contemplation, and inner work",
          },
          ancestralWork: {
            name: "Ancestral Work",
            description: "Connecting with ancestors and lineage",
          },
          newBeginnings: {
            name: "New Beginnings",
            description: "Starting new ventures (avoid during Saturn's final hour)",
          },
        },
      },
      
      // Divine Names Planetary Correspondences
      divineNamesPlanetary: {
        title: "Divine Names & Planetary Hours",
        subtitle: "Classical correspondences between Divine Names and celestial timing",
        
        // Divine Name meanings
        names: {
          alQawiyy: { meaning: "The All-Strong" },
          alQahhar: { meaning: "The Subduer" },
          alWadud: { meaning: "The Most Loving" },
          asSabur: { meaning: "The Patient" },
          arRazzaq: { meaning: "The Provider" },
          alHakim: { meaning: "The All-Wise" },
          alAlim: { meaning: "The All-Knowing" },
          asSami: { meaning: "The All-Hearing" },
          alHadi: { meaning: "The Guide" },
          anNur: { meaning: "The Light" },
          alLatif: { meaning: "The Subtle" },
          alJamil: { meaning: "The Beautiful" },
          alHafiz: { meaning: "The Preserver" },
          alMuqaddim: { meaning: "The Expediter" },
          arRahman: { meaning: "The Beneficent" },
          arRahim: { meaning: "The Merciful" },
          alMalik: { meaning: "The King" },
          alMumin: { meaning: "The Granter of Security" },
          alWahhab: { meaning: "The Bestower" },
          alKabir: { meaning: "The Great" },
          alMujib: { meaning: "The Responsive" },
          alWajid: { meaning: "The Finder" },
          alMughni: { meaning: "The Enricher" },
          alMuakhkhir: { meaning: "The Delayer" },
          alHalim: { meaning: "The Forbearing" },
          alHaqq: { meaning: "The Truth" },
          alHadi2: { meaning: "The Guide (variant)" },
        },
        
        // Benefits (translation keys)
        benefits: {
          // Mars/Strength
          overcomingObstacles: "Overcoming obstacles",
          physicalStrength: "Physical and spiritual strength",
          protectionFromWeakness: "Protection from weakness",
          authorityInDealings: "Authority in dealings",
          overcomingOppression: "Overcoming oppression",
          breakingBadHabits: "Breaking bad habits",
          dominanceOverNafs: "Dominance over lower self",
          protectionFromEnemies: "Protection from enemies",
          
          // Venus/Love
          increasingLove: "Increasing love between people",
          marriageHarmony: "Marriage and relationship harmony",
          softeningHearts: "Softening hearts",
          acceptancePopularity: "Acceptance and popularity",
          patience: "Cultivating patience",
          endurance: "Building endurance",
          emotionalStability: "Emotional stability",
          peacefulResolution: "Peaceful resolution",
          
          // Jupiter/Expansion
          provision: "Divine provision",
          abundance: "Abundance and prosperity",
          sustenance: "Sustenance in all forms",
          blessingsInWealth: "Blessings in wealth",
          wisdom: "Wisdom and discernment",
          soundJudgment: "Sound judgment",
          understanding: "Deep understanding",
          guidedDecisions: "Divinely guided decisions",
          
          // Mercury/Knowledge
          knowledge: "Knowledge and learning",
          learning: "Enhanced learning ability",
          memory: "Improved memory",
          answeredPrayers: "Answered prayers",
          beingHeard: "Being heard and understood",
          communication: "Clear communication",
          receptivity: "Receptivity to guidance",
          
          // Sun/Guidance
          guidance: "Divine guidance",
          clarity: "Mental and spiritual clarity",
          rightPath: "Walking the right path",
          spiritualDirection: "Spiritual direction",
          spiritualLight: "Spiritual light and illumination",
          illumination: "Inner illumination",
          insightClarity: "Insight and clarity",
          removingDarkness: "Removing spiritual darkness",
          
          // Moon/Intuition
          gentleness: "Gentleness in character",
          subtlety: "Subtlety and refinement",
          easeInDifficulty: "Ease in difficult situations",
          refinedManners: "Refined manners",
          beauty: "Beauty in all forms",
          innerBeauty: "Inner beauty and grace",
          beautifulCharacter: "Beautiful character",
          aestheticSense: "Aesthetic sense",
          
          // Saturn/Protection
          protection: "Divine protection",
          preservation: "Preservation from harm",
          safetyGuarding: "Safety and guarding",
          shieldingFromHarm: "Shielding from harm",
          advancement: "Advancement in rank",
          priority: "Priority in matters",
          precedence: "Precedence over others",
          timingAlignment: "Perfect timing alignment",
          
          // Additional benefits
          mercy: "Divine mercy",
          compassion: "Compassion for all creation",
          divineGrace: "Divine grace",
          universalBeneficence: "Universal beneficence",
          specificMercy: "Specific divine mercy",
          forgiveness: "Forgiveness of sins",
          lovingKindness: "Loving-kindness",
          compassionateHeart: "Compassionate heart",
          sovereignty: "Sovereignty over affairs",
          kingship: "Spiritual kingship",
          authority: "Righteous authority",
          leadership: "Leadership through service",
          faith: "Strengthening faith",
          security: "Inner security",
          trust: "Trust in the Divine",
          innerPeace: "Inner peace and tranquility",
          generosity: "Generosity of spirit",
          gifts: "Divine gifts",
          blessings: "Abundant blessings",
          abundantGiving: "Abundant giving",
          greatness: "Spiritual greatness",
          magnitude: "Magnitude of vision",
          majesty: "Divine majesty",
          awe: "Spiritual awe",
          responsiveness: "Divine responsiveness",
          openDoors: "Opening of doors",
          acceptance: "Acceptance of prayers",
          finding: "Finding what is lost",
          discovery: "Discovery of truth",
          attainment: "Attainment of goals",
          fulfillment: "Spiritual fulfillment",
          enrichment: "Spiritual enrichment",
          sufficiency: "Self-sufficiency",
          independence: "Independence from creation",
          contentment: "Contentment with provision",
          delay: "Beneficial delay",
          postponement: "Wise postponement",
          timingControl: "Control of timing",
          forbearance: "Forbearance with others",
          clemency: "Clemency and mercy",
          truth: "Manifestation of truth",
          reality: "Understanding reality",
          justice: "Divine justice",
          authenticity: "Authenticity of being",
          direction: "Clear direction",
          spiritualGuidance: "Comprehensive spiritual guidance",
        },
      },
      
      // Prayer Adhkar Database
      prayerAdhkar: {
        title: "Prayer Adhkar",
        subtitle: "Authentic remembrances after the five daily prayers",
        
        // Prayer names
        prayers: {
          Fajr: "Fajr",
          Dhuhr: "Dhuhr",
          Asr: "Asr",
          Maghrib: "Maghrib",
          Isha: "Isha",
        },
        
        // Tradition names
        traditions: {
          Shadhili: "Shadhili Tradition",
          Tijani: "Tijani Tradition",
          Qadiri: "Qadiri Tradition",
          Naqshbandi: "Naqshbandi Tradition",
          WestAfricanScholarly: "West African Scholarly Tradition",
        },
        
        // Benefits of Sunnah adhkar and classical practices
        benefits: {
          glorificationPurification: "Glorification and purification of the heart",
          gratitudeContentment: "Gratitude and contentment in all circumstances",
          magnificationReverence: "Magnification and reverence of the Divine Majesty",
          protectionUntilNext: "Protection until next prayer; guard from evil",
          tawhidAffirmationMorning: "Tawhid affirmation; protection from morning until evening",
          protectionEvilEye: "Protection from evil eye, magic, and envy",
          protectionWhispersShaytan: "Protection from whispers of shaytan and evil thoughts",
          morningProtection: "Morning protection and acknowledgment of Divine sovereignty",
          paradiseGuarantee: "Guarantee of Paradise if recited sincerely in morning",
          spiritualIllumination: "Spiritual illumination at dawn; clarity of heart and mind",
          trustProvision: "Trust in Divine provision for the day ahead",
          strengtheningTrials: "Strengthening against trials; treasure from Paradise",
          tawhidEquivalent: "Tawhid affirmation; equivalent to one-third of Quran",
          protectionEvil: "Protection from evil and harm",
          protectionWhispers: "Protection from whispers and evil thoughts",
          forgivenessSeaFoam: "Forgiveness of sins even if numerous as sea foam",
          vitalityMidday: "Vitality and sustenance during midday; spiritual renewal",
          openingProvision: "Opening of provision and sustenance",
          forgivenessEvenFled: "Forgiveness of sins even if one fled from battle",
          gentlenessDifficulties: "Gentleness in difficulties; resolution of complex matters",
          strengthCompleteDay: "Strength to complete the day; overcoming obstacles",
          tawhidAffirmationEvening: "Tawhid affirmation; protection from evening until morning",
          eveningProtection: "Evening protection and acknowledgment of Divine sovereignty",
          beautificationCharacter: "Beautification of character; spiritual radiance at sunset",
          concealmentFaults: "Concealment of faults; Divine protection from exposure",
          increasingLoveHearts: "Increasing love in hearts; harmony in relationships",
          remembranceSleep: "Remembrance before sleep; submission to Divine will",
          comprehensiveProtection: "Comprehensive protection from worldly and spiritual ailments",
          protectionNight: "Protection throughout the night; guardianship while asleep",
          peacefulSleep: "Peaceful sleep; tranquility of heart and mind",
          securityFear: "Security from fear; protection from nighttime anxieties",
          tawhidAffirmation: "Tawhid affirmation",
        },
        
        // Planetary connection descriptions
        planetaryConnections: {
          sunFajr: "Sun - Fajr hours ruled by celestial light",
          mercuryProvision: "Mercury - Planet of provision and sustenance",
          sunPeak: "Sun - Peak solar energy at Dhuhr",
          jupiterAbundance: "Jupiter - Planet of expansion and abundance",
          venusGentleness: "Venus - Planet of gentleness and harmony",
          venusBeauty: "Venus - Planet of beauty and harmony",
          moonConcealment: "Moon - Planet of concealment and protection",
          saturnProtection: "Saturn - Planet of protection and preservation",
          moonNight: "Moon - Planet of night and peaceful rest",
          saturnSecurity: "Saturn - Planet of security and boundaries",
        },
        
        // UI labels
        labels: {
          sunnahAdhkar: "Sunnah Adhkar",
          classicalPractices: "Classical Practices",
          count: "Count",
          times: "{count}x",
          benefit: "Benefit",
          source: "Source",
          tradition: "Tradition",
          planetaryConnection: "Planetary Connection",
          arabic: "Arabic",
          transliteration: "Transliteration",
          translation: "Translation",
          afterPrayer: "After {prayer} Prayer",
          completed: "Completed",
          remaining: "{count} remaining",
        },
      },
      
      // Daily Guidance Details Screen
      dailyGuidanceDetails: {
        title: "Daily Energy",
        sections: {
          dayRuler: "Day Ruler",
          dailyWindow: "Daily Window",
          elementalHarmony: "Elemental Harmony",
          manazil: "Manazil (Lunar Mansion)",
          bestFor: "Best For",
          whyThis: "Why This?",
        },
        manazil: {
          title: "Your lunar baseline",
          baseline: "Baseline: #{index} — {name}",
          hint: "This is a stable signature derived from your birth date. Use it as an extra lens for reflection alongside today’s guidance.",
          missing: "Complete your profile (DOB) to unlock your Manazil baseline.",
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
        // Collapsible section subtitles for better UX
        collapsible: {
          personalizedInsights: "Personalized insights",
          planetaryDetails: "Detailed breakdown",
          lunarGuidance: "Tonight's lunar energy",
          yourPersonalFilter: "Your personal filter",
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
          ascendantLens: "Ascendant Lens",
      nextPlanetHour: "Next Planet Hour",

        ascendant: {
          title: "Ascendant (Rising Sign)",
          summary: "Your Ascendant is {sign} ({element} tone). It describes how you meet the day and how you initiate action.",
          elementHints: {
            fire: "Ascendant Fire: lead with courage, start cleanly, keep momentum — but avoid rushing.",
            water: "Ascendant Water: lead with gentleness, intuition, and sincerity — but avoid absorbing everything.",
            air: "Ascendant Air: lead with clarity, conversation, and learning — but avoid scattered attention.",
            earth: "Ascendant Earth: lead with structure, patience, and completion — but avoid rigidity.",
          },
          blend: {
            harmonious: "Today naturally supports your Ascendant tone — keep it simple and consistent.",
            complementary: "Today complements your Ascendant tone — act steadily and communicate intentions.",
            transformative: "Today challenges your Ascendant tone — slow down, choose one priority, and stay mindful.",
            neutral: "Today is balanced with your Ascendant tone — let your intention guide your pace.",
          },
        },
      startsAt: "Starts at",
      todayBlessing: "Today's Blessing",
      tomorrow: "Tomorrow",
      tapToSetLocation: "Tap to set location",
    },

    // Daily Energy (shared keys)
    dailyEnergy: {
      // Classical Day Status (distinct from Moment Alignment's hourly "Time")
      status: {
        favorable: "Favorable Day",
        neutral: "Balanced Day",
        cautious: "Mindful Day",
      },
      planets: {
        sun: "Sun",
        moon: "Moon",
        mercury: "Mercury",
        venus: "Venus",
        mars: "Mars",
        jupiter: "Jupiter",
        saturn: "Saturn",
      },
      planetaryStrength: {
        title: "Planetary Strength",
        dataUnavailableTitle: "Data unavailable",
        unableToLoadData: "Unable to load planetary strength data right now.",
        todaysEnergy: "Today's energy",
        rulerLabel: "Ruler",
        bestWork: "Best for work",
        bestReflection: "Best for reflection",
        watchOut: "Watch out",
        todaysOverallEnergy: "Today's overall energy",
        averageOfAll: "Average of all planets",
        todaysRuler: "Today's ruler",
        quality: "Quality",
        impactOnDaily: "Impact on today",
        points: "{value} pts",
        recommendedHours: "Recommended hours",
        detailedAnalysis: "Detailed analysis",
        degreeStrength: "Degree strength",
        dignityLabel: "Dignity",
        qualities: {
          excellent: "Excellent",
          good: "Good",
          moderate: "Moderate",
          weak: "Weak",
        },
        rulerAdvice: {
          veryStrong: "{planet} is strongly supported today — act with clarity and confidence.",
          strong: "{planet} supports steady progress today — move forward with intention.",
          moderate: "{planet} is balanced today — keep steps simple and consistent.",
          weak: "{planet} is under strain today — slow down and simplify commitments.",
          veryWeak: "{planet} is challenged today — prioritize protection, patience, and smaller aims.",
        },
      },
      guidance: {
        title: "Recommendations",
        cautions: "Cautions",
        useStrongHours: "Use {planet} strong hours ({percent}%) for important work.",
        useStrongHoursSpiritual: "Use {planet} strong hours ({percent}%) for spiritual practice.",
        avoidWeakHours: "Avoid {planet} and {planet2} hours when possible.",
      },
      breakdown: {
        todaysRuler: {
          degreeEarly: "Early degree ({degree}°): influence still forming.",
          degreeGaining: "Gaining strength ({degree}°): momentum building.",
          degreePeak: "Peak strength ({degree}°): strongest expression.",
          degreeWeakening: "Weakening ({degree}°): focus on completion.",
          dignityOwn: "Domicile: steady and reliable.",
          dignityExalted: "Exalted: supported and elevated.",
          dignityDetriment: "Detriment: friction and mixed results.",
          dignityFall: "Fall: muted — go gently.",
          dignityNeutral: "Neutral: balanced tone.",
          combust: "Combust: weakened by proximity to the Sun.",
          beams: "Under the beams: reduced clarity.",
          clear: "Clear: not affected by the Sun.",
          retrograde: "Retrograde: better for review and inner work.",
        },
      },
      // Planetary Judgment Card
      planetaryJudgment: {
        title: "Planetary Judgment",
        cosmicVerdict: "TODAY'S COSMIC VERDICT",
        status: {
          supportive: "Supportive Day",
          neutral: "Neutral Day",
          cautious: "Mindful Day",
        },
        classicalTerms: {
          supportive: "Benefic",
          neutral: "Neutral",
          cautious: "Malefic",
        },
        intro: "Today is ruled by {planet}.",
        rulerTone: {
          sun: "The Sun brings vitality, leadership, and self-expression. A day for confidence and visibility.",
          moon: "The Moon governs emotions, intuition, and nurturing. A day for inner work and family.",
          mars: "Mars energizes action, courage, and competition. A day for bold moves but watch for conflict.",
          mercury: "Mercury rules communication, learning, and commerce. A day for study and negotiation.",
          jupiter: "Jupiter expands opportunities, wisdom, and good fortune. A day for growth and generosity.",
          venus: "Venus brings harmony, beauty, and relationships. A day for love and aesthetics.",
          saturn: "Saturn demands discipline, structure, and patience. A day for completing long-term work.",
        },
        phaseModifier: {
          amplify: "The waxing Moon amplifies today's energy—seize the momentum.",
          soften: "The waning Moon softens the intensity—reflect before acting.",
          neutral: "The Moon is in transition—balance action with contemplation.",
        },
        bestForLabel: "Best For",
        avoidLabel: "Avoid",
        disclaimer: "Classical guidance based on planetary rulership. Your personal chart may modify these influences.",
        bestFor: {
          sun: {
            0: "Leadership and taking charge",
            1: "Public presentations and visibility",
            2: "Self-expression and creativity",
          },
          moon: {
            0: "Emotional healing and reflection",
            1: "Family time and nurturing",
            2: "Intuitive decisions",
          },
          mars: {
            0: "Physical training and athletics",
            1: "Starting bold initiatives",
            2: "Competitive activities",
          },
          mercury: {
            0: "Writing and communication",
            1: "Learning and study",
            2: "Business negotiations",
          },
          jupiter: {
            0: "Expansion and growth opportunities",
            1: "Teaching and learning",
            2: "Travel and philosophical study",
          },
          venus: {
            0: "Relationship building",
            1: "Creative and artistic work",
            2: "Beauty and aesthetic pursuits",
          },
          saturn: {
            0: "Completing long-term projects",
            1: "Building structures and systems",
            2: "Discipline and focus work",
          },
        },
        avoid: {
          sun: {
            0: "Submissive roles",
            1: "Background support work",
            2: "Self-deprecation",
          },
          moon: {
            0: "Aggressive confrontation",
            1: "Purely logical decisions",
            2: "Emotional suppression",
          },
          mars: {
            0: "Delicate negotiations",
            1: "Emotional conversations",
            2: "Patience-requiring tasks",
          },
          mercury: {
            0: "Emotional decision-making",
            1: "Heavy physical labor",
            2: "Long-term commitments without analysis",
          },
          jupiter: {
            0: "Overpromising",
            1: "Reckless expansion",
            2: "Ignoring practical details",
          },
          venus: {
            0: "Aggressive action",
            1: "Harsh criticism",
            2: "Confrontation",
          },
          saturn: {
            0: "Spontaneous decisions",
            1: "Starting creative new projects",
            2: "Social leisure activities",
          },
        },
      },
      scope: {
        day: "Today's Day Ruler",
      },
      alignmentOverview: {
        title: "Alignment Overview",
        dayRulerLabel: "Today's Ruler",
        yourRulerLabel: "Your Ruler",
        elementsLabel: "Elements",
        elementHarmony: "Element Harmony",
        planetHarmony: "Planet Harmony",
        verdict: {
          excellent: "Excellent alignment today.",
          good: "Good alignment today.",
          moderate: "Mixed alignment today.",
          challenging: "Challenging alignment today.",
        },
      },

      spiritualPractice: {
        title: "Recommended Spiritual Practice",
        recommendedTodayTitle: "Recommended Today",
        betterToWaitForTitle: "Better to Wait For",

        items: {
          grounding: "Keep close to the earth: simple routines, clean food, steady breath.",
          protection: "Protect the heart: seek refuge, keep wudūʾ if you can, and avoid agitation.",
          repentance: "Return softly: istighfār, repairing wrongs, and a guarded tongue.",
          discipline: "Choose discipline over impulse: finish what is necessary, leave what is extra.",
          silence: "Reduce speech and noise: let the day pass with dignity and restraint.",

          supportiveDhikr: "Gentle dhikr with presence: let the tongue match the heart.",
          openingDua: "Make duʿāʾ with good hope: ask for guidance, ease, and right action.",
          goodIntention: "Set a clear intention: seek benefit without excess, and begin with adab.",
          charity: "Give something small in charity: it opens doors without stirring the ego.",
          reconciliation: "Mend ties and soften harshness: a small kindness carries great weight.",

          cleanIntention: "Keep intentions clean and modest: do what is sound, leave what is doubtful.",
          modestDhikr: "Short, consistent dhikr: better a little with sincerity than much without.",
          fulfillDuties: "Fulfill duties first: prayer on time, obligations before extras.",
          shortDua: "A brief duʿāʾ at the opening and closing of your day.",
          gratitude: "Practice gratitude quietly: name your blessings, and do not chase what is absent.",

          controlledCaution: "If you feel drawn to more, keep it brief and contained—avoid excess.",
        },

        matchItems: {
          sun: "A short practice for clarity and noble intention—without pride.",
          moon: "A short practice for mercy and inward calm—without drowning in emotion.",
          mercury: "A short practice for understanding and truthful speech—without restlessness.",
          venus: "A short practice for harmony and gentleness—without indulgence.",
          mars: "A short practice for courage with restraint—without anger or haste.",
          jupiter: "A short practice for wisdom and expansion of خير—without overreach.",
          saturn: "A short practice for patience and steadfastness—without hardness of heart.",
        },

        waitItems: {
          loveAttraction: "Matters of affection and attraction—better on {days}.",
          expansionBigAsks: "Big requests and expansive openings—better on {days}.",
          deepEmotionalOpening: "Deep emotional openings—better on {days}.",
          hardConfrontation: "Harsh confrontation—better on {days} if needed.",
          overStrictVows: "Overly strict vows and heavy self-imposed burdens—better on {days}.",
          heavyEmotionalWork: "Heavy emotional work—better on {days}.",
          bigExpansion: "Large expansions and risky commitments—better on {days}.",
        },
      },
      // Section Headers (Narrative System)
      todaysRuler: "TODAY'S PLANETARY RULER",
      yourPlanet: "YOUR BIRTH PLANET",
      todaysAlignment: "TODAY'S ALIGNMENT",
      lunarInfluence: "LUNAR INFLUENCE",
      whatThisMeans: "What This Means For You",
      excellentForToday: "Excellent For Today",
      lessFavorable: "Less Favorable",
      bestForToday: "Best For Today",
      currentTransit: "Current Transit",
      peakHours: "Peak Hours",
      transitIn: "In {sign}{dignity}",

      // Day descriptions
      dayEnergy: {
        expansion: "expansion, wisdom, and growth",
        action: "action, courage, and decisive movement",
        communication: "communication, learning, and commerce",
        love: "love, beauty, and harmony",
        discipline: "discipline, structure, and mastery",
        vitality: "vitality, leadership, and personal power",
        intuition: "emotions, intuition, and nurturing",
      },

      // Alignment factors
      factors: {
        planetaryFriendship: "Planetary Friendship",
        elementalHarmony: "Elemental Harmony",
        dailyStrength: "Daily Strength",
      },

      // Relationship descriptions
      friendship: {
        strongFriends: "Strong Friends",
        friends: "Friends",
        neutral: "Neutral",
        tension: "Tension",
      },

      // Synthesis templates
      synthesis: {
        excellent: "Excellent {day} energy! {day}'s day of {quality} harmonizes beautifully with your {user}-{element} nature. {lunar}. Today favors {activities}.",
        good: "Good {day} energy. {day}'s {quality} works well with your {user}-{element} nature. {lunar}. Favorable for {activities}.",
        moderate: "Balanced {day} energy. {day}'s {quality} offers steady support. {lunar}. Good for {activities}.",
        challenging: "Reflective {day} energy. {day}'s {quality} invites careful navigation. {lunar}. Better for {activities}.",
      },

      // Lunar additions
      lunarPhase: {
        waxing: "The waxing moon adds building momentum",
        waning: "The waning moon supports release and completion",
        full: "The full moon amplifies all energies",
        new: "The new moon offers fresh beginnings",
      },

      // Strength labels
      strengthLabels: {
        veryStrong: "Very Strong",
        strong: "Strong",
        moderate: "Moderate",
        weak: "Weak",
        veryWeak: "Very Weak",
      },

      // Source labels
      sourceLabels: {
        fromName: "From Name + Mother's Name",
        fromBirthChart: "From Birth Chart",
        default: "Default (Sun)",
      },
    },

    // Planetary Strength Analysis (detailed cards)
    planetaryStrengthAnalysis: {
      labels: {
        power: "Power",
        calculationBreakdown: "Calculation breakdown",
        degree: "Degree",
        dignity: "Dignity",
        combustion: "Sun proximity",
      },
      statuses: {
        degreeWeak: "Weak",
        degreeModerate: "Moderate",
        degreeStrong: "Strong",
        degreeWeakening: "Weakening",
        dignityDomicile: "Domicile",
        dignityExalted: "Exalted",
        dignityDetriment: "Detriment",
        dignityFall: "Fall",
        dignityNeutral: "Neutral",
        combustionClear: "Clear",
        combustionBeams: "Under beams",
        combustionCombust: "Combust",
      },
      formula: {
        retrograde: "Retrograde modifier: {percent}% of normal power",
        finalPower: "Final power: {value}%",
      },
      cards: {
        degreePosition: "Degree position",
        essentialDignity: "Essential dignity",
        sunProximity: "Sun proximity",
        retrogradeMotion: "Retrograde motion",
      },
      sections: {
        challengesTitle: "Challenges",
        recommendationsTitle: "Recommendations",
      },
      suitability: {
        outerWork: "Outer work",
        innerWork: "Inner work",
        limitedOuterWork: "Limited outer work",
      },
    },

    // Screens
    screens: {
      // Planet Transit Screen (System 1 - Long-term)
      planetTransit: {
        title: "Planet Transit",
        headerSubtitle: "Long-term",
        explanation: "Shows where a planet is in the zodiac — its long-term position that changes over weeks, months, or years.",
        personalizedNote: "Personalized to your elemental nature",
        practices: {
          title: "Planet-Specific Practices",
          minutesShort: "min",
          divineNames: {
            title: "Divine Names",
            description: "Divine names recommended for {planet} energy",
            forCategory: "For {category}",
            repetitionsLabel: "Repetitions:",
            purposeLabel: "🎯 Purpose",
            durationLabel: "Duration:",
            categories: {
              protection: "Protection",
              influence: "Influence",
              clarity: "Clarity",
              prayer: "Prayer",
              dignity: "Dignity",
              leadership: "Leadership",
              justice: "Justice",
              career: "Career",
            },
            purposes: {
              jupiter: {
                protection: "Divine protection and guardianship",
                taskheer: "Attracting favor, softening hearts (Taskhīr)",
                accounting: "Divine accounting, keeping track",
                ijaba: "Having prayers answered (Ijābah)",
                haiba: "Commanding respect, dignified presence (Haybah)",
                leadership: "Strength in leadership, personal growth",
                rights: "Restoring respect, reclaiming rights",
                career: "Strengthening job role, establishing firm position",
              },
            },
            howTo: {
              label: "💡 How to Practice",
              step1: "Complete wuḍūʾ and face Qiblah",
              step2: "Sit in quiet, clean space",
              step3: "Set intention for {category}",
              step4: "Recite with focus and reverence",
              step5: "Use prayer beads for counting",
            },
            actions: {
              startPractice: "Start Practice",
              setReminder: "Set Reminder",
            },
          },
        },
        summary: {
          bestNow: "Strongest now",
          weakNow: "Weakest now",
        },
        
        currentTransit: "Current Transit",
        timeScale: "Long-term (weeks/months)",
        in: "in",
        signProgress: "Sign progress",
        degreeInSign: "Degree in sign",
        
        retrograde: "Retrograde",
        retrogradeArabic: "راجع",
        nearingChange: "Approaching sign change",
        
        duration: {
          title: "Transit Duration",
          enteredSign: "Entered sign",
          leavesSign: "Leaves sign",
          total: "Duration",
        },
        durationStats: {
          elapsed: "Elapsed",
          remaining: "Remaining",
          total: "Total",
        },
        timeline: {
          now: "Now",
        },
        
        dataSource: {
          title: "Data Source",
          api: "NASA JPL Horizons (Ephemeris)",
          cached: "Cached ephemeris data",
          lastUpdated: "Last updated",
        },
        
        spiritualQuality: {
          title: "Spiritual Quality",
          saad: "Sa'd (سَعْد) — Auspicious",
          nahs: "Naḥs (نَحْس) — Challenging",
        },
        
        meaning: {
          title: "Theme & Meaning",
        },
        
        resonance: {
          title: "Resonance with Your Nature",
          description: "How this transit interacts with your {{element}} element:",
          levels: {
            strong: "Strong",
            harmonious: "Harmonious",
            neutral: "Neutral",
            growth: "Growth",
            challenge: "Challenge",
          },
          arabicTerms: {
            harmonious: "سَكِينَة",
            supportive: "تَوَافُق",
            neutral: "تَوَازُن",
            challenging: "تَحَوُّل",
          },
          context: "Based on elemental relationships in traditional spiritual astrology.",
        },
        quickImpact: {
          title: "Quick Impact",
          subtitle: "How this feels for you right now",
        },
        why: {
          title: "Why it feels this way",
          body: "This transit blends your elemental nature with the sign’s tone, shaping how you experience communication, mood, and momentum today.",
          show: "Why it feels this way",
          hide: "Hide details",
        },
        focus: {
          title: "Today’s focus",
          communication: "Communication",
          patience: "Patience",
          reflection: "Reflection",
        },
        
        classicalWisdom: {
          title: "Classical Wisdom",
          arabicTradition: "From Arabic Astronomical Tradition",
        },
        degree: {
          title: "Position in Sign",
          explanation: "{{degree}} of 30° (~{{percent}}% through this sign).",
          phases: {
            early: "Early (0-10°)",
            middle: "Middle (10-20°)",
            late: "Late (20-30°)",
          },
        },
        dignity: {
          title: "Dignity Analysis",
          state: "State",
          baseModifier: "Base modifier",
          degreeModifier: "Degree modifier",
          finalStrength: "Final strength",
          whatThisMeans: "What this means",
          suitableFor: "Suitable for",
          avoid: "Avoid",
          betterTiming: "Better timing",
          states: {
            sharaf: "Exalted (Sharaf)",
            bayt: "Domicile (Bayt)",
            qubul: "Neutral (Qubūl)",
            wabal: "Detriment (Wabāl)",
            hubut: "Fall (Hubūṭ)",
          },
          explanations: {
            sharaf: "This planet is in a sign where its qualities are elevated and supported, making actions more effective and outcomes clearer.",
            bayt: "This planet is in its home sign, where its nature expresses smoothly and reliably.",
            qubul: "This placement is balanced: neither strongly supported nor strongly challenged.",
            wabal: "This placement can create friction or mixed results; move with care and simplify commitments.",
            hubut: "This placement tends to feel heavy or blocked; timing, patience, and gentler goals help.",
          },
        },
        dignityGuidance: {
          generic: {
            sharaf: {
              whatThisMeans: "With {planet} exalted in {sign}, momentum is supportive. Act with clarity and good intention.",
              suitableFor: {
                1: "Leadership and visibility",
                2: "Important conversations and commitments",
                3: "Launching initiatives and setting direction",
              },
              avoid: {
                1: "Overconfidence or rushing without consultation",
                2: "Forcing outcomes or escalating conflicts",
              },
              betterTiming: {
                1: "Act during supportive hours and keep intentions clean",
                2: "Choose clear, bounded commitments",
              },
            },
            bayt: {
              whatThisMeans: "With {planet} in its domicile in {sign}, its influence is steady and reliable. Build consistently.",
              suitableFor: {
                1: "Sustained work and disciplined effort",
                2: "Routines and long‑term plans",
                3: "Organizing and strengthening foundations",
              },
              avoid: {
                1: "Assuming everything will work without structure",
                2: "Overloading your schedule",
              },
              betterTiming: {
                1: "Small consistent steps over big pushes",
                2: "Follow a plan and track progress",
              },
            },
            qubul: {
              whatThisMeans: "With {planet} neutral in {sign}, outcomes depend more on choices than conditions. Keep intentions clean and steps simple.",
              suitableFor: {
                1: "Everyday tasks and maintenance",
                2: "Testing ideas before committing fully",
                3: "Reflection and calibration",
              },
              avoid: {
                1: "Expecting a dramatic push from the sky",
                2: "Overcomplicating decisions",
              },
              betterTiming: {
                1: "Clarify priorities first, then act",
                2: "Move with a measured pace",
              },
            },
            wabal: {
              whatThisMeans: "With {planet} in detriment in {sign}, there may be friction. Progress is possible with restraint and boundaries.",
              suitableFor: {
                1: "Reviewing, simplifying, and reducing load",
                2: "Low‑stakes planning and gentle corrections",
                3: "Inner work and patience‑based goals",
              },
              avoid: {
                1: "High‑pressure decisions or irreversible commitments",
                2: "Escalating conflicts or forcing outcomes",
              },
              betterTiming: {
                1: "Wait for clearer signals before major moves",
                2: "Reduce commitments and keep boundaries",
              },
            },
            hubut: {
              whatThisMeans: "With {planet} in fall in {sign}, energy can feel muted. Choose smaller aims and protect your attention.",
              suitableFor: {
                1: "Rest, recovery, and restoration",
                2: "Rebuilding confidence through small wins",
                3: "Prayer, grounding, and steady routines",
              },
              avoid: {
                1: "Overextending or demanding quick results",
                2: "Starting heavy burdens without support",
              },
              betterTiming: {
                1: "Postpone launches and negotiations when possible",
                2: "Focus on essentials and let time do its work",
              },
            },
          },
        },
        personalized: {
          title: "Personalized Impact",
          lead: "As a {{element}} nature with {{sign}}, this transit shapes how you process and express energy.",
          point1: "Your natural depth meets a more expressive, outward tone.",
          point2: "Communication may feel faster or more direct than your comfort zone.",
          point3: "Use your element strengths to balance this transit’s pace and tone.",
        },

        context: {
          title: {
            personal: "Personal Transit",
            collective: "Cosmic Weather",
          },
          desc: {
            personal: "This planet is transiting your sign directly — its themes tend to land more personally in your choices and daily rhythm.",
            collective: "Not in your sign — read this as collective weather. See below for what it emphasizes and how it can reach you.",
          },
        },

        lens: {
          badge: {
            personal: "Personal transit lens",
            collective: "Collective transit lens",
          },
          sections: {
            about: "About this transit",
            collective: "Collective influence",
            resonance: "How it reaches you",
            degree: "Degree phase",
          },
          collectiveTemplate: "When {{planet}} is in {{sign}}, it emphasizes {{theme}}. This is the shared “weather” that everyone experiences in different ways.",
          resonanceBase: {
            personal: "Because this is a personal transit (in your sign), these themes tend to land more directly in your choices and daily rhythm.",
            collective: "Even if it’s not in your sign, you may feel it indirectly through external pressure, shifts in pace, added responsibility, or delayed outcomes.",
          },
          degreePhases: {
            early: "Settling-in phase: the influence is establishing—avoid overly decisive moves.",
            middle: "Stable phase: constructive alignment is more available—measure beats urgency.",
            late: "Closing phase: focus on completion, not initiation—wrap up before restarting.",
          },
          planetFunction: {
            sun: "The Sun governs authority, vitality, clarity, and purpose.",
            moon: "The Moon governs moods, memory, nourishment, and the rhythms of daily life.",
            mercury: "Mercury governs speech, trade, learning, and the movement of information.",
            venus: "Venus governs harmony, affection, beauty, and the ease of relationships.",
            mars: "Mars governs drive, conflict, courage, and decisive action.",
            jupiter: "Jupiter governs growth, wisdom, generosity, and meaningful expansion.",
            saturn: "Saturn governs structure, limits, responsibility, time, and endurance.",
          },
          signThemes: {
            aries: "initiative, leadership, and courageous beginnings",
            taurus: "stability, resources, and steady building",
            gemini: "communication, learning, and quick exchange",
            cancer: "home, protection, and emotional security",
            leo: "visibility, authority, and creative confidence",
            virgo: "details, health, and practical refinement",
            libra: "balance, agreements, and relationship dynamics",
            scorpio: "depth, boundaries, and transformative pressure",
            sagittarius: "belief, exploration, and broader meaning",
            capricorn: "duty, institutions, and long-term structure",
            aquarius: "community, innovation, and collective systems",
            pisces: "compassion, sensitivity, and dissolving old forms",
          },
          elementTails: {
            water: "Water nature often absorbs this quietly rather than confrontationally.",
            fire: "Fire nature tends to feel it as urgency—channel it into clean action.",
            earth: "Earth nature tends to seek structure—steady routines help.",
            air: "Air nature often feels it mentally—name priorities to reduce scatter.",
          },
        },
        daily: {
          title: "Today’s Guidance",
          morning: "This morning",
          morningText: "Ground your intentions before engaging with bold communication.",
          afternoon: "This afternoon",
          afternoonText: "Channel creative confidence while staying emotionally aware.",
          evening: "This evening",
          eveningText: "Let intensity soften; restore through calm reflection.",
        },
        signComparison: {
          title: "Your Sign vs Transit Sign",
          yourSign: "Your sign",
          transitSign: "Transit sign",
          insight: "Contrasting energies can create powerful growth when balanced.",
        },
        balancing: {
          title: "How to Balance This Energy",
          subtitle: "Classical methods from Islamic spiritual sciences",
          methodsLabel: "Classical Remedies",
          repetitions: "Repetitions",
          bestTime: "Best time",
          startCounter: "Start Counter",
          source: "Source",
          challenge: "{userElement} nature meets {transitElement} energy — apply the remedies below for steadiness.",
          disclaimer: "Traditional practices for reflection and balance.",
          methods: {
            latif: {
              title: "Recite Al-Laṭīf",
              titleArabic: "اللَّطِيف",
              instruction: "Traditionally recited to soften opposing energies and bring gentleness. Say: “Yā Laṭīf”.",
              numerology: "Abjad value: 129 (ل=30, ط=9, ي=10, ف=80)",
              bestTime: "After Fajr or during Jupiter’s hour",
              source: "Classical dhikr practice",
            },
            halim: {
              title: "Recite Al-Ḥalīm",
              titleArabic: "الحَلِيم",
              instruction: "Traditionally recited for patience and forbearance. Say: “Yā Ḥalīm”.",
              numerology: "Abjad value: 88 (ح=8, ل=30, ي=10, م=40)",
              bestTime: "When feeling restless or stuck",
              source: "Classical spiritual practice",
            },
            hajah: {
              title: "Ṣalāt al-Ḥājah",
              titleArabic: "صلاة الحاجة",
              instruction: "Perform the Prayer of Need (2 rakʿahs), asking for ease and balance.",
              bestTime: "Last third of the night",
              source: "Prophetic tradition",
            },
            letters: {
              title: "Balanced Letter Meditation",
              titleArabic: "تأمل الحروف المتوازنة",
              instruction: "Contemplate the letters م and ن together as a symbol of balance. Write them gently and reflect.",
              bestTime: "During moments of inner conflict",
              source: "Traditional ʿIlm al-Ḥurūf practice",
            },
            mubin: {
              title: "Recite Al-Mubīn",
              titleArabic: "المُبِين",
              instruction: "Traditionally recited for clarity and direction. Say: “Yā Mubīn”.",
              numerology: "Abjad value: 102 (م=40, ب=2, ي=10, ن=50)",
              bestTime: "After ʿAṣr",
              source: "Classical Sufi practice",
            },
            shukr: {
              title: "Dhikr of Gratitude",
              titleArabic: "ذِكر الشُكر",
              instruction: "Recite “Alḥamdu lillāh” with gratitude to reinforce harmony.",
              bestTime: "Throughout the day",
              source: "Quranic encouragement (14:7)",
            },
            hakim: {
              title: "Recite Al-Ḥakīm",
              titleArabic: "الحَكِيم",
              instruction: "Traditionally recited to seek balanced judgment. Say: “Yā Ḥakīm”.",
              numerology: "Abjad value: 78 (ح=8, ك=20, ي=10, م=40)",
              bestTime: "Wednesday during Mercury’s hour",
              source: "Traditional ʿIlm al-Ḥurūf practice",
            },
            istighfar: {
              title: "Istighfār",
              titleArabic: "الاستغفار",
              instruction: "Recite “Astaghfirullāh al-ʿAẓīm” to purify the heart and renew intention.",
              bestTime: "Before dawn (Saḥar)",
              source: "Prophetic tradition",
            },
            salawat: {
              title: "Ṣalawāt on the Prophet",
              titleArabic: "الصلاة على النبي",
              instruction: "Recite: “Allāhumma ṣalli ʿalā Muḥammad” to invite barakah and balance.",
              bestTime: "Friday and after prayers",
              source: "Quranic command (33:56)",
            },
          },
        },
        // ─────────────────────────────────────────────────────────────────────
        // SPIRITUAL PRACTICE (Degree-Based Classical Framework)
        // Based on ʿIlm al-Asrār: Entry (0-10°), Strength (10-20°), Exit (20-30°)
        // ─────────────────────────────────────────────────────────────────────
        spiritual: {
          title: "Spiritual Practice",
          phaseLabel: {
            entry: "Entering",
            strength: "Active",
            exit: "Exiting",
          },
          status: {
            entry: "The influence is forming. Focus on purification, not action.",
            strength: "This transit is at full strength. Spiritual work is supported.",
            exit: "The influence is fading. Seal and protect, do not initiate.",
          },
          guidance: {
            entry: "Focus on istighfār and general dhikr (lā ilāha illa Llāh). Avoid binding intentions or starting major spiritual works.",
            strength: "Best time for focused dhikr and duʿāʾ. Spiritual focus: ${focusText}",
            exit: "Seal what was started. Focus on protective dhikr, ṣalawāt, and gratitude. Avoid new spiritual initiatives.",
          },
          focus: {
            sun: "Tawḥīd, purpose, and clarity of intention",
            moon: "Emotional balance and intuition",
            mercury: "Knowledge, speech, and learning",
            venus: "Harmony, love, and beauty",
            mars: "Courage, discipline, cutting obstacles",
            jupiter: "Expansion, rizq, and wisdom",
            saturn: "Patience, endurance, karmic repair",
          },
          avoid: {
            sun: "Ego inflation, arrogance",
            moon: "Decisions driven by mood",
            mercury: "Gossip, overthinking",
            venus: "Excess pleasure, attachment",
            mars: "Anger, impulsiveness",
            jupiter: "Arrogance, excess",
            saturn: "Heavy works unless guided, despair",
          },
          recommendedDhikr: "Recommended Dhikr",
          entryNote: "During entry phase, focus on general dhikr like lā ilāha illa Llāh",
          exitNote: "During exit phase, focus on protective dhikr and ṣalawāt",
          disclaimer: "For reflection, not ruling. Based on classical Islamic esoteric tradition.",
        },
        // ─────────────────────────────────────────────────────────────────────
        // ENHANCED SPIRITUAL PRACTICE (Dhikr Tiers + Planetary Hour Timing)
        // Classical ʿAdad system with timing optimization
        // ─────────────────────────────────────────────────────────────────────
        practice: {
          title: "Spiritual Practice",
          phase: {
            entry: "Entering",
            strength: "Active",
            exit: "Exiting",
          },
          counts: {
            title: "Recommended Count",
            tier: {
              quick: "Quick",
              standard: "Standard",
              deep: "Deep",
            },
            estimate: "~{minutes} min",
          },
          timing: {
            title: "Best Time",
            nextPlanetHour: "Next {planet} hour: {start}–{end}",
            in: "in {time}",
            tomorrow: "Tomorrow",
            activeNow: "Active now until {end}",
            unavailable: "Planetary hour data unavailable",
          },
          strength: {
            peak: "Peak",
            strong: "Strong",
            supportive: "Supportive",
            gentle: "Gentle",
          },
          fallback: {
            title: "If you can't wait",
            afterPrayer: "Do the Quick tier after the next prayer.",
          },
          disclaimer: "For reflection, not ruling. Based on classical Islamic esoteric tradition.",
        },
        history: {
          title: "Transit History",
          previous: "Previous sign",
          next: "Next sign",
          estimated: "Estimated",
          current: "Currently here",
        },
      },
      
      // Moment Alignment Screen (System 3 - Hourly)
      momentAlignment: {
        title: "Moment Alignment",
        headerSubtitle: "Current Hour",
        explanation: "Shows the active planetary hour (changes through the day) and how it interacts with your spiritual nature.",
        
        currentHour: "Current Hour",
        hourNumber: "Hour {{current}} of {{total}}",
        nextChange: "Next change",
        
        transitContext: {
          title: "Transit Context (Long-term)",
          description: "Beyond the hourly energy, here is where this planet is in the zodiac long-term:",
          planetIn: "{{planet}} is in {{sign}} ({{signArabic}})",
          viewDetails: "View full transit details",
        },

        currentHourPlanet: {
          title: "Current Hour Planet",
          subtitle: "Ruling this moment",
          viewAllPlanets: "View All 7 Planets",
        },
      },
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
      subtitle: "The Noble Quran with translations",
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
      playAudio: "Play Audio",
      pauseAudio: "Pause Audio",
      reciter: "Reciter: Mishary Alafasy",
      audioLoading: "Loading audio...",
    },
    
    // Moment Alignment Detail
    momentDetail: {
      title: "Moment Alignment",
      noName: "No Name Set",
      addNameMessage: "Add your name in Name Destiny to unlock moment alignment guidance.",
      goToNameDestiny: "Go to Name Destiny",
      updated: "Updated",
      zahirOutward: "Name + Mother (Personal)",
      hourQuality: "Hour Quality",
      whyThisStatus: "Why This Status?",
      guidanceTitle: "Guidance",
      bestNow: "Better for:",
      avoidNow: "Avoid for now:",
      disclaimer: "For reflection only • Not a ruling",

      cards: {
        currentHour: "Current Hour",
        yourPlanet: "Your Planet",
        transitConditions: "Transit Conditions",
        alignmentAnalysis: "Alignment Analysis",
        whatThisMeans: "What This Means",
        excellentFor: "Excellent For",
        avoidNow: "Avoid Now",
        showTimeline: "Show Timeline",
        hourEndsIn: "Hour ends in",
        nextHour: "Next Hour",

        status: {
          act: "Act",
          maintain: "Maintain",
          hold: "Hold",
          act_desc: "Favorable conditions — act with intention",
          maintain_desc: "Favorable conditions for steady progress",
          hold_desc: "Challenging conditions — wait for better timing",
        },

        transit: {
          dignity: "Dignity",
          house: "House",
          strength: "Current Hour Power",
          overallNote: "Your {planet} transit overall: {quality}. Tap for details →",
          positionalPower: "Positional Power",
          positionalSubtext: "Based on house position & dignity (for action now)",
          transitQuality: "Transit Quality",
          transitQualitySubtext: "Overall planetary strength (suits your nature)",
          explanation: "Positional power is {positional}, while overall transit quality is {quality}",
          viewFullAnalysis: "View full {planet} transit analysis →",
          angular: "Angular",
          succedent: "Succedent",
          cadent: "Cadent",
          house_10_angular: "House 10 - Career & Status",
          exceptional: "Exceptional",
          strong: "Strong",
          moderate: "Moderate",
          weak: "Weak",
        },

        analysis: {
          planetaryFriendship: "Planetary Friendship",
          planetaryResonance: "Planetary Resonance",
          samePlanet: "Same Planet",
          highIntensity: "High intensity",
          elementalHarmony: "Elemental Harmony",
          transitStrength: "Current Hour Power",
          strong: "Strong",
          moderate: "Moderate",
          weak: "Weak",
          exceptional: "Exceptional",
        },

        source: {
          nameMotherPersonal: "Source: Name + Mother (Personal)",
          birthChart: "Source: Birth Chart",
        },
      },

      authenticTiming: {
        title: "Authentic Timing",
        hourRuler: "Hour Ruler Strength",
        elemental: "Elemental Relationship",
        opening: "{planet} hour guidance (reflection-focused).",
        nextHour: "Next hour: {planet} begins in {minutes}m.",

        timingAnalysisTitle: "Timing Analysis",
        planetaryConditionsTitle: "Planetary Conditions",
        dignityLabel: "Dignity",
        positionLabel: "Zodiac Position",
        strengthLabel: "Condition",
        interpretationLabel: "Interpretation",
        whyThisStatusTitle: "Why This Status?",
        showDetails: "Show details",
        hideDetails: "Hide details",
        noEnhancements: "No specific enhancements suggested right now.",
        noCautions: "No cautions flagged for this moment.",
        recommendedLabel: "Recommended",
        cautionsLabel: "Cautions",
        personalPlanetLabel: "Your Planet",
        personalElementLabel: "Your Element",
        factors: {
          elementCompatibility: "Elemental Harmony",
          planetaryResonance: "Planetary Resonance",
          manazilAlignment: "Manazil Alignment",
          practiceMapping: "Practice Mapping",
        },
      },

      currentHour: {
        endsIn: "Ends in {minutes}m",
      },
      
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
        zahir: "Personal",
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
          bullet1: "Your personal element perfectly matches the hour's element—natural alignment.",
          bullet2: "This creates flow for initiating, communicating, and deciding.",
          bullet3: "Alignment window lasts for this planetary hour; observe how it shifts.",
        },
        maintain: {
          bullet1: "Your personal element is compatible with the hour's element—supportive conditions.",
          bullet2: "Good for steady progress and follow-through without forcing.",
          bullet3: "Maintain calm effort; alignment shifts each hour.",
        },
        hold: {
          bullet1: "Your personal element conflicts with the hour's element—pause is advised.",
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

      // Time of Birth (Optional)
      birthTime: {
        title: "Time of Birth (Optional)",
        subtitle: "Used to calculate your Ascendant (Rising Sign)",
        selectPlaceholder: "Select your birth time",
        clear: "Clear time",
      },

      // Birth Location (Optional)
      birthLocation: {
        title: "Birth Location (Optional)",
        subtitle: "Used to calculate your Ascendant (Rising Sign)",
        label: "Birth Location",
        placeholder: "City, Country (optional)",
        latitude: "Latitude",
        longitude: "Longitude",
        editCoordinates: "Edit coordinates",
        clear: "Clear birth location",
        hint: "Enter coordinates for your birthplace, or use the locate icon to fill from your current position.",
      },
      
      // Astrological Profile
      astro: {
        title: "Your Astrological Profile",
        sign: "Burj (Sign)",
        element: "Element",
        ascendant: "Ascendant",
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
        title: "Current Location (Optional)",
        subtitle: "For accurate prayer times and timing calculations",
        label: "Current Location",
        placeholder: "Search city or country",
        autoDetect: "Type to search, or tap the location icon to auto-detect",
        clear: "Clear current location",
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

      // Password Reset
      resetPasswordTitle: "Reset Password",
      resetPasswordSubtitle: "Set a new password for your account.",
      updatePasswordButton: "Update Password",
      
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

    // Asrariya Practice Timing
    asrariya: {
      title: "Practice Timing",
      subtitle: "Find Your Optimal Spiritual Windows",
      selectPractice: "Select a Practice",
      currentTiming: "Current Timing Analysis",
      noProfile: "Complete your profile to get personalized timing",
      practices: {
        protection: "Protection",
        protectionDesc: "Shield yourself from spiritual and physical harm",
        healing: "Healing",
        healingDesc: "Restore body, mind, and soul to harmony",
        manifestation: "Manifestation",
        manifestationDesc: "Bring your intentions into reality",
        guidance: "Guidance",
        guidanceDesc: "Seek direction and clarity on your path",
        gratitude: "Gratitude",
        gratitudeDesc: "Express thankfulness and appreciation",
        knowledge: "Knowledge",
        knowledgeDesc: "Pursue learning and understanding",
        provision: "Provision",
        provisionDesc: "Seek sustenance and abundance",
        general: "General Practice",
        generalDesc: "Balanced spiritual development",
      },
      timing: {
        optimal: "Optimal",
        favorable: "Favorable",
        moderate: "Moderate",
        challenging: "Challenging",
        avoid: "Avoid",
      },
      layers: {
        element: "Element Compatibility",
        planetary: "Planetary Resonance",
        manazil: "Lunar Mansion",
        practice: "Practice Alignment",
      },
      recommendation: "Recommendation",
      overallScore: "Overall Score",
      personalizedFor: "Personalized for your spiritual profile",
      analyzing: "Analyzing timing...",
      timingAnalysis: "Timing Analysis For You",
      overallTimingQualityTitle: "OVERALL TIMING QUALITY",
      overallTimingQualityHint: "Combines all spiritual factors for this moment",
      optimalUntil: "Optimal window until",
      errors: {
        unableToCalculateTiming: "Unable to calculate timing",
        unableToLoadAnalysis: "Unable to load analysis",
      },
      whyThisRating: "Why This Rating?",
      breakdown: {
        rulingPlanetStrength: "Ruling Planet Strength",
        rulingPlanetStrengthDesc: "Your ruling planet's compatibility with today's ruler (30% of planetary resonance, factored into overall score)",
        todaysRulerTitle: "Today's Ruler ({planet})",
        todaysRulerFallback: "Today's ruler",
        todaysRulerStrong: "{planet}{arabic} is very strong today. Excellent overall day energy for all {planet}-related activities.",
        todaysRulerGood: "{planet}{arabic} has good strength today. Favorable day energy for {planet} work.",
        todaysRulerModerate: "{planet}{arabic} has moderate strength today. Proceed with awareness for {planet} activities.",
        todaysRulerWeak: "{planet}{arabic} is weak today. Consider alternative days for major {planet} work.",
        todaysRulerVeryWeak: "{planet}{arabic} is very weak today. Avoid major {planet} decisions or work.",
      },
      whatThisMeans: "What This Means For You",
      recommended: "Recommended Now",
      cautions: "Be Mindful Of",
      betterTiming: "Better Timing",
    },
    
    // Unified Timing Badges
    timing: {
      compatible: "Compatible",
      ratings: {
        excellent: "EXCELLENT TIME",
        good: "GOOD TIME",
        moderate: "PROCEED MINDFULLY",
        weak: "PROCEED WITH CAUTION",
        unfavorable: "UNFAVORABLE TIME",
      },

      shortDescriptions: {
        veryStrong: "Very strong {planet} hour",
        strong: "Strong {planet} hour",
        moderate: "Moderate {planet} hour",
        weak: "Weak {planet} hour",
        veryWeak: "Very weak {planet} hour",

        perfectAlignment: "Perfect alignment",
        supportiveFlow: "Supportive flow",
        neutral: "Neutral energy",
        minorTension: "Minor elemental tension",
      },

      guidance: {
        recommended: "Recommended:",
        goodFor: "Good for:",
        approach: "Approach:",
        avoid: "Avoid:",
        betterTiming: "Better timing:",
      },
      badges: {
        optimal: {
          label: "Excellent Time",
          action: "Excellent time — proceed with confidence",
          description: "This is one of your best windows. All factors align beautifully for your practice.",
          hint: "Excellent alignment — proceed confidently",
        },
        act: {
          label: "Good Time",
          action: "Good time — proceed",
          description: "Favorable conditions support your practice. Move forward with intention.",
          hint: "Favorable conditions — act with intention",
        },
        maintain: {
          label: "Proceed Mindfully",
          action: "Workable — stay mindful",
          description: "This timing is workable but requires awareness. Some tension exists that can be navigated.",
          hint: "Workable timing — maintain balance",
        },
        careful: {
          label: "Proceed with Caution",
          action: "Challenging — proceed only if necessary",
          description: "This isn't your natural time. If you must proceed, add grounding practices.",
          hint: "Challenging energies — proceed carefully",
        },
        hold: {
          label: "Unfavorable Time",
          action: "Best to wait — see alternatives",
          description: "Strong opposing factors. Unless urgent, wait for a better window.",
          hint: "Wait for better timing",
        },
      },
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
        birth: {
          title: "Birth Profile",
          subtitle: "Date • Time • Place",
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
          // Power Days by Element
          powerDay: {
            fire: "Tuesday (Mars) and Sunday (Sun)",
            water: "Monday (Moon) and Friday (Venus)",
            air: "Wednesday (Mercury)",
            earth: "Thursday (Jupiter) and Saturday (Saturn)",
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
      // Arabic names (classical Islamic cosmology)
      fireArabic: "نار",
      waterArabic: "ماء",
      airArabic: "هواء",
      earthArabic: "تراب",
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
      hourAfterNext: "Hour After Next",
      hourNumber: "Hour #{number}",
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

      wording: {
        shared: {
          powerVsPermission: "Power is not permission: a strong hour can magnify both benefit and harm.",
          samePlanetIntensity: "If this hour is ruled by your planet, intensity increases — act with restraint.",
        },

        sun: {
          status: "Radiant Time",
          meaning: "Visibility, authority, and clear intention; what is begun is seen.",
          bestFor: [
            "Leadership and setting direction",
            "Public matters and reputation",
            "Invocations for clarity and purpose",
            "Honoring elders and rightful authority",
          ],
          avoid: [
            "Pride and self-display",
            "Overpromising",
            "Acting without sincerity",
          ],
          note: "Increase in power; guard the heart from vanity and harshness.",
        },

        moon: {
          status: "Reflective Time",
          meaning: "Receptive, changing currents; suited to tending, listening, and returning.",
          bestFor: [
            "Purification and gentle devotion",
            "Care of home, family, and needs",
            "Dream-work, reflection, and duʿāʾ",
          ],
          avoid: [
            "Irreversible decisions",
            "Binding vows made in haste",
          ],
          note: "Changeability increases; seek steadiness and avoid wavering promises.",
        },

        mercury: {
          status: "Mutable Time",
          meaning: "Movement of mind and message; swift exchange, craft, and calculation.",
          bestFor: [
            "Study, writing, and memorization",
            "Trade, errands, and short travel",
            "Planning and problem-solving",
            "Learning languages and skills",
          ],
          avoid: [
            "Gossip and needless argument",
            "Hasty agreements",
            "Deception and double-speech",
          ],
          note: "Quickness increases; verify words and keep intentions clean.",
        },

        venus: {
          status: "Harmonious Time",
          meaning: "Union, affection, and beauty; hearts soften and manners refine.",
          bestFor: [
            "Reconciliation and mending ties",
            "Art, adornment, and pleasant gatherings",
            "Kindness, charity, and gifts",
            "Marriage discussions and mutual consent",
          ],
          avoid: [
            "Indulgence and distraction",
            "Vanity",
            "Neglecting obligations",
          ],
          note: "Ease increases; keep modesty and do not trade duty for pleasure.",
        },

        mars: {
          status: "Forceful Time",
          meaning: "Heat, severing, and courage; actions cut quickly and consequences follow.",
          bestFor: [
            "Disciplined effort and training",
            "Protection and guarding boundaries",
            "Decisive action with restraint",
          ],
          avoid: [
            "Anger and quarrels",
            "Reckless risks",
            "Starting conflict",
          ],
          note: "Force increases; do not confuse strength with permission.",
        },

        jupiter: {
          status: "Expansive Time",
          meaning: "Increase, ease, and generosity; openings in counsel and learning.",
          bestFor: [
            "Teaching and seeking knowledge",
            "Counsel, mediation, and wise planning",
            "Charity and widening provision",
            "Blessed beginnings with gratitude",
          ],
          avoid: [
            "Arrogance",
            "Excess and waste",
          ],
          note: "Expansion increases; keep gratitude and avoid swelling of the ego.",
        },

        saturn: {
          status: "Restrictive Time",
          meaning: "Constraint, patience, and endurance; what is built is slow and tested.",
          bestFor: [
            "Long work requiring stamina",
            "Sobriety, repentance, and restraint",
            "Planning, boundaries, and structure",
            "Ending what must end cleanly",
          ],
          avoid: [
            "Haste",
            "Beginning pleasures that dull the heart",
            "Hard-heartedness",
          ],
          note: "Restriction increases; accept the pace and keep mercy in the intention.",
        },
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
      // Arabic names (classical Islamic astronomy)
      sunArabic: "الشمس",
      moonArabic: "القمر",
      marsArabic: "المريخ",
      mercuryArabic: "عطارد",
      jupiterArabic: "المشتري",
      venusArabic: "الزهرة",
      saturnArabic: "زحل",
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
      // Arabic names (classical Islamic astronomy)
      ariesArabic: "الحمل",
      taurusArabic: "الثور",
      geminiArabic: "الجوزاء",
      cancerArabic: "السرطان",
      leoArabic: "الأسد",
      virgoArabic: "السنبلة",
      libraArabic: "الميزان",
      scorpioArabic: "العقرب",
      sagittariusArabic: "القوس",
      capricornArabic: "الجدي",
      aquariusArabic: "الدلو",
      piscesArabic: "الحوت",
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
• Names only: Quick method
• With mothers' names: Traditional method (recommended)

🌍 This is the traditional method preserved by West African Islamic scholars for serious marriage compatibility.

🔒 Privacy: Mother's names are used only for calculation and never stored.`,
      
      // Analysis Mode Selection
      analysisMode: "Analysis Mode",
      quickAnalysis: "Quick Analysis (Names Only)",
      quickAnalysisDesc: "See how your conscious personalities interact in daily life. Good for initial curiosity.",
      quickAccuracy: "Quick method",
      completeAnalysis: "Complete Analysis (Names + Mothers) ⭐ Recommended",
      completeAnalysisDesc: "The traditional West African method. Reveals both surface chemistry and deep emotional compatibility. Essential for serious relationships.",
      completeAccuracy: "Traditional method",
      
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
      
      // Welcome/Splash Screen
      splash: {
        appName: "Asrariya",
        subtitle: "✦ ʿIlm al-Ḥurūf ✦",
        description: "Discover the sacred science of letters and divine names through ancient wisdom and cosmic timing",
        features: {
          calculator: "Sacred Name Calculator",
          timing: "Divine Timing Guidance",
          insights: "Personalized Insights",
        },
        getStarted: "Get Started",
      },
      
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

    // ============================================================================
    // PREMIUM SECTIONS - Titles & Descriptions for PremiumSection components
    // ============================================================================
    premiumSections: {
      // Who Am I / Istikhara Overview
      spiritualDetails: {
        title: "Spiritual Details",
        description: "Unlock deeper spiritual practices",
      },
      // Prayer Guidance
      prayerGuidance: {
        title: "Prayer Guidance",
        description: "Unlock personalized spiritual practices",
      },
      // Compatibility - Person to Person
      soulConnection: {
        title: "Soul Connection",
        description: "Explore the spiritual bond between souls",
      },
      harmonyAnalysis: {
        title: "Harmony Analysis",
        description: "Discover elemental and cosmic harmony",
      },
      personalizedAdvice: {
        title: "Personalized Advice",
        description: "Get actionable recommendations",
      },
      compatibilitySummary: {
        title: "Compatibility Summary",
        description: "Unlock detailed interpretation",
      },
      // Compatibility - Person to Divine Name / Divine Name to Intention
      divineGuidance: {
        title: "Divine Guidance",
        description: "Discover manifestation and spiritual wisdom",
      },
      practiceGuide: {
        title: "Practice Guide",
        description: "Learn traditional recitation methods",
      },
      practiceGuidance: {
        title: "Practice Guidance",
        description: "Learn how to work with this Divine Name",
      },
      // Divine Timing
      aiGuidance: {
        title: "AI Guidance",
        description: "Get personalized spiritual guidance",
      },
      // Moment Alignment Detail
      personalGuidance: {
        title: "Personal Guidance",
        description: "Discover what actions are favored now",
      },
      // Daily Guidance Details
      bestFor: {
        title: "Best For",
        description: "Personal action guidance",
      },
      // Name Destiny Results
      aiEnhancement: {
        title: "AI Enhancement",
        description: "Personal interpretation of your name",
      },
      divineNameResonance: {
        title: "Divine Name Resonance",
        description: "Discover your resonant Divine Names",
      },
      quranResonance: {
        title: "Quranic Resonance",
        description: "Discover verses that resonate with your name",
      },
      keyTakeaways: {
        title: "Key Takeaways",
        description: "Practical guidance for your path",
      },
      // Manazil
      manazilPractices: {
        title: "Lunar Mansion Practices",
        description: "Unlock traditional practices for this mansion",
      },
      // Planet Transit Details
      transitGuidance: {
        title: "Transit Guidance",
        description: "Personalized planetary transit insights",
      },
      planetaryPractices: {
        title: "Planetary Practices",
        description: "Spiritual practices for this transit",
      },
      // Calculator Enhanced Results
      advancedAnalysis: {
        title: "Advanced Analysis",
        description: "Deeper numerical insights",
      },
      // Results (Istikhara Results tabs)
      personality: {
        title: "Personality Insights",
        description: "Discover your deep personality traits",
      },
      career: {
        title: "Career Guidance",
        description: "Career direction based on your spiritual profile",
      },
      blessedDay: {
        title: "Your Blessed Day",
        description: "Discover your most favorable day",
      },
      spiritualPractice: {
        title: "Spiritual Practice",
        description: "Personalized spiritual practices",
      },
      // Name Destiny Results
      aiPersonalization: {
        title: "AI Personalization",
        description: "Get personalized AI-powered interpretation of your element",
      },
      spiritualGuidanceInsights: {
        title: "Spiritual Guidance",
        description: "Personalized insights and practical guidance for your path",
      },
      // Planet Transit Details
      personalizedImpact: {
        title: "Personalized Impact",
        description: "Discover how this transit affects your elemental nature",
      },
      personalizedInsights: {
        title: "Personalized Insights",
        description: "Discover your nature, daily guidance, balancing methods, and more",
      },
      // Daily Guidance Details
      bestActionsToday: {
        title: "Best Actions Today",
        description: "Discover what activities align best with today's energy",
      },
      // Relationship Compatibility
      interpretation: {
        title: "Interpretation",
        description: "Discover what this connection means for you",
      },
      spiritualAnalysis: {
        title: "Spiritual Analysis",
        description: "Explore the deep spiritual connection",
      },
      elementalAnalysis: {
        title: "Elemental Analysis",
        description: "Understand the harmony of natural energies",
      },
      planetaryAnalysis: {
        title: "Planetary Analysis",
        description: "Discover cosmic influences",
      },
      // Calculator Enhanced Results  
      deepNumerologicalAnalysis: {
        title: "Deep Numerological Analysis",
        description: "Unlock AI insights, elemental composition, and advanced calculation methods",
      },
      // AI Guidance (Divine Timing)
      aiSpiritualGuidance: {
        title: "AI Spiritual Guidance",
        description: "Get personalized guidance based on your spiritual profile and current timing",
      },
      // Manazil
      spiritualPractices: {
        title: "Spiritual Practices",
        description: "Adhkar, angels, Quran verses, and wafq for this mansion",
      },
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
          hourlyStatus: "Moment Status",
          planetaryHour: "Planetary Hour",
          dailyQuality: "Day Flow",
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
        tapForGuidance: "Tap to see Prayer Guidance",
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
    // ============================================================================
    // WHO AM I MODULE - Deep Self-Analysis Through Sacred Numerology
    // ============================================================================
    istikhara: {
      // Main panel
      title: "Who Am I",
      titleArabic: "مَن أنا",
      subtitle: "Discover Your True Self",
      formInstruction: "Enter your name and mother's name for deep self-analysis",
      description: "Discover your element, personality, career path, and spiritual practices through the sacred science of ʿIlm al-Ḥurūf.",
      
      // Method Selector
      methodSelector: {
        label: "Choose Calculation Method:",
        nameBased: {
          title: "Name-Based",
          badge: "CLASSICAL",
          description: "Traditional ʿIlm al-Ḥurūf method using your name + mother's name",
        },
        birthDate: {
          title: "Birth Date",
          badge: "QUICK",
          description: "Simpler method using only your date of birth",
        },
      },
      
      // Birth date form
      birthDateForm: {
        selectDate: "Select Your Birth Date",
        tapToSelect: "Tap to select your birth date",
        pleaseSelect: "Please select your birth date",
        birthTime: "Birth Time (Optional)",
        birthTimeHint: "Add your birth time to unlock Ascendant & Descendant calculations",
        tapToSetTime: "Tap to set birth time (if known)",
        birthLocation: "Birth Location (Optional)",
        birthLocationHint: "Add your birth city for accurate Ascendant calculation",
        searchCity: "Search for a city...",
        whatYouDiscover: "What You'll Discover:",
        sunSign: "Your Sun Sign (Burj)",
        elementalNature: "Your elemental nature",
        moonSign: "Moon Sign (lunar placement)",
        ascendant: "Ascendant (Rising Sign)",
        descendant: "Descendant Sign",
        unlockHint: "Add birth time & location above to unlock Ascendant & Descendant",
        yearNotNeeded: "Year is not needed for basic calculations",
        monthLabel: "Month (1-12)",
        dayLabel: "Day (1-31)",
        useFullDate: "Use Full Birth Date",
        useMonthDayOnly: "Just Month & Day",
        fullDateDesc: "For complete analysis with Moon Sign",
        monthDayDesc: "Quick Burj calculation only",
      },

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
        title: "Discover Who You Are",
        personName: "Your Name",
        personNamePlaceholder: "e.g., Muhammad, Fatima, Ibrahim",
        motherName: "Mother's Name",
        motherNamePlaceholder: "e.g., Khadija, Aisha, Maryam",
        latinName: "Latin Name",
        latinNamePlaceholder: "e.g., Muhammad, Fatima, Aisha",
        latinNameHint: "Type your name in Latin letters — we'll show the Arabic equivalent",
        calculateButton: "Discover Myself",
        clearButton: "Clear",
        validationError: "Please enter both names to continue",
        bothNamesRequired: "Both names are required for accurate analysis",
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
          health: "Health",
        },
      },

      // Health Awareness Tab
      health: {
        title: "Health Awareness",
        subtitle: "Traditional wisdom for your spiritual nature (not medical advice)",
        sections: {
          watchOutFor: "⚠️ Watch Out For",
          thingsToAvoid: "🚫 Things to Avoid",
          foodsThatHelpYou: "🍎 Foods That Help You",
          spiritualProtection: "🛡️ Spiritual Protection",
          westAfricanTraditions: "🌍 West African Traditions",
        },
        disclaimer: "💡 This is traditional spiritual guidance, not medical advice. For health concerns, consult a qualified clinician.",
        empty: {
          title: "Health Awareness",
          text: "No data is available for this sign yet.",
        },
        a11y: {
          toggle: "Expand or collapse health awareness",
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

        // Welcome/Splash Screen
        splash: {
          appName: "Asrariya",
          subtitle: "✦ ʿIlm al-Ḥurūf ✦",
          description: "Découvrez la science sacrée des lettres et des noms divins à travers la sagesse ancienne et le timing cosmique",
          features: {
            calculator: "Calculateur de Nom Sacré",
            timing: "Guidance du Timing Divin",
            insights: "Aperçus Personnalisés",
          },
          getStarted: "Commencer",
        },

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
          tagline: "Your name carries a structure.",
          credibility: "Inspired by traditional Abjad correspondences.",
          title: "Calculator & Spiritual Profile",
          body: "Explore markers linked to your name: element, temperament, and core meaning.",
          b1: "Kabir & Saghir calculations",
          b2: "Element & temperament",
          b3: "Simple, grounded explanations",
        },
        s3: {
          tagline: "Sacred hours, not random time.",
          credibility: "Based on planetary hour systems.",
          title: "Divine Timing",
          body: "Discover windows of time for reflection and inner calm.",
          b1: "Day & hourly planetary influence",
          b2: "Harmonious and constricted hours",
          b3: "A contemplative guide, not authority",
        },
        s4: {
          tagline: "Consistency before intensity.",
          credibility: "Built upon adab, presence, and continuity.",
          title: "Dhikr & Practice",
          body: "Track sessions, stay consistent, follow guided method.",
          b1: "Session counter with intention",
          b2: "Guided methodology (adab)",
          b3: "Gentle reminders for continuity",
        },
        s5: {
          tagline: "Your path, preserved.",
          credibility: "Your data stays private and secure.",
          title: "Begin Your Journey",
          body: "Sync your spiritual profile across devices.",
          b1: "Private and secure data",
          b2: "Sync across devices",
          b3: "Continue without account",
        },

        // Final Screen (Save & Unlock)
        final: {
          tagline: "Your path, preserved.",
          title: "Begin Your Journey",
          description: "Create an account to sync your profile and unlock advanced features.",
          createAccount: "Create Account",
          signIn: "Sign In",
          continueGuest: "Continue as Guest",
          guestNote: "Your data stays on this device only.",
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

    // Day ruler labels
    dayRulers: {
      sunday: {
        name: "Sunday • Sun Day",
        desc: "Day of vitality, leadership, and personal power",
        element: "Fire",
        planet: "Sun",
        arabicName: "الأحد • يوم الشمس",
      },
      monday: {
        name: "Monday • Moon Day",
        desc: "Day of emotions, intuition, and nurturing",
        element: "Water",
        planet: "Moon",
        arabicName: "الاثنين • يوم القمر",
      },
      tuesday: {
        name: "Tuesday • Mars Day",
        desc: "Day of action, courage, and decisive movement",
        element: "Fire",
        planet: "Mars",
        arabicName: "الثلاثاء • يوم المريخ",
      },
      wednesday: {
        name: "Wednesday • Mercury Day",
        desc: "Day of communication, learning, and commerce",
        element: "Air",
        planet: "Mercury",
        arabicName: "الأربعاء • يوم عطارد",
      },
      thursday: {
        name: "Thursday • Jupiter Day",
        desc: "Day of expansion, wisdom, and growth",
        element: "Air",
        planet: "Jupiter",
        arabicName: "الخميس • يوم المشتري",
      },
      friday: {
        name: "Friday • Venus Day",
        desc: "Day of love, beauty, and harmony",
        element: "Water",
        planet: "Venus",
        arabicName: "الجمعة • يوم الزهرة",
      },
      saturday: {
        name: "Saturday • Saturn Day",
        desc: "Day of discipline, structure, and mastery",
        element: "Earth",
        planet: "Saturn",
        arabicName: "السبت • يوم زحل",
      },
    },

    // Planetary relationship descriptions
    planetaryRelations: {
      // Sun relationships
      "Sun-Moon": "The Sun illuminates the Moon's emotional depths with clarity and warmth",
      "Sun-Mars": "The Sun energizes Mars's courage with vital force and leadership",
      "Sun-Jupiter": "The Sun expands Jupiter's wisdom with radiant optimism",
      "Sun-Mercury": "The Sun and Mercury work together neutrally, blending intellect with vitality",
      "Sun-Venus": "The Sun and Venus create creative tension between self and relationships",
      "Sun-Saturn": "The Sun and Saturn face challenges between spontaneity and structure",

      // Moon relationships
      "Moon-Sun": "The Moon reflects the Sun's vitality through emotional wisdom",
      "Moon-Mercury": "The Moon harmonizes Mercury's thoughts with intuitive feeling",
      "Moon-Mars": "The Moon and Mars balance emotional depth with decisive action",
      "Moon-Jupiter": "The Moon and Jupiter blend nurturing with expansive generosity",
      "Moon-Venus": "The Moon flows naturally with Venus in matters of love and beauty",
      "Moon-Saturn": "The Moon and Saturn struggle between emotion and control",

      // Mars relationships
      "Mars-Sun": "Mars channels the Sun's vitality into bold, decisive action",
      "Mars-Moon": "Mars supports the Moon's emotions with protective courage",
      "Mars-Jupiter": "Mars joins Jupiter's wisdom with dynamic, purposeful action",
      "Mars-Mercury": "Mars and Mercury create tension between impulsiveness and deliberation",
      "Mars-Venus": "Mars and Venus struggle between assertion and harmony",
      "Mars-Saturn": "Mars and Saturn work together neutrally, balancing action with discipline",

      // Mercury relationships
      "Mercury-Sun": "Mercury serves the Sun by clarifying purpose with intellectual precision",
      "Mercury-Venus": "Mercury harmonizes with Venus, blending beauty with intelligent expression",
      "Mercury-Moon": "Mercury and the Moon balance rational thought with emotional intuition",
      "Mercury-Mars": "Mercury and Mars face friction between careful thought and bold action",
      "Mercury-Jupiter": "Mercury and Jupiter work together neutrally, combining detail with vision",
      "Mercury-Saturn": "Mercury and Saturn balance analysis with practical wisdom",

      // Jupiter relationships
      "Jupiter-Sun": "Jupiter expands the Sun's leadership with philosophical wisdom",
      "Jupiter-Moon": "Jupiter blesses the Moon's nurturing with generous abundance",
      "Jupiter-Mars": "Jupiter guides Mars's courage with wisdom and ethical action",
      "Jupiter-Mercury": "Jupiter and Mercury work together neutrally, balancing breadth with detail",
      "Jupiter-Venus": "Jupiter and Venus create tension between expansion and refinement",
      "Jupiter-Saturn": "Jupiter and Saturn work together neutrally, balancing growth with limits",

      // Venus relationships
      "Venus-Mercury": "Venus enriches Mercury's communication with grace and beauty",
      "Venus-Saturn": "Venus harmonizes with Saturn, creating lasting beauty through discipline",
      "Venus-Mars": "Venus and Mars struggle between harmony and conflict",
      "Venus-Jupiter": "Venus and Jupiter create tension between intimacy and expansion",
      "Venus-Sun": "Venus and the Sun work together neutrally in creative expression",
      "Venus-Moon": "Venus and the Moon blend naturally in emotional and aesthetic harmony",

      // Saturn relationships
      "Saturn-Mercury": "Saturn supports Mercury's analysis with structured, practical wisdom",
      "Saturn-Venus": "Saturn gives Venus's beauty enduring form through patience",
      "Saturn-Jupiter": "Saturn and Jupiter work together neutrally, balancing discipline with hope",
      "Saturn-Mars": "Saturn and Mars work together neutrally, tempering action with caution",
      "Saturn-Sun": "Saturn and the Sun face challenges between limitation and self-expression",
      "Saturn-Moon": "Saturn and the Moon struggle between emotional warmth and cold reserve",
    },

    // Elemental relationship descriptions
    elementalRelations: {
      "Fire-Fire": "Fire strengthens Fire — passion meets passion with amplified vitality",
      "Fire-Air": "Air fans Fire — ideas energize action, creating dynamic movement",
      "Fire-Water": "Fire and Water create steam — creative tension requiring balance",
      "Fire-Earth": "Fire and Earth work together — grounding passionate action",

      "Water-Water": "Water deepens Water — emotional currents flow together harmoniously",
      "Water-Earth": "Earth grounds Water — emotions find stable, nourishing form",
      "Water-Air": "Water and Air create mist — feelings meet thoughts adaptably",
      "Water-Fire": "Water and Fire create steam — emotional depth meets passionate intensity",
      "water-fire": "Water and Fire create steam — emotional depth meets passionate intensity",

      "Air-Air": "Air amplifies Air — mental clarity and communication multiply",
      "Air-Fire": "Fire energizes Air — thoughts ignite into inspired action",
      "Air-Earth": "Air and Earth work together — ideas meet practical reality",
      "Air-Water": "Air and Water create mist — rational thought meets emotional depth",

      "Earth-Earth": "Earth solidifies Earth — stability and structure reinforce powerfully",
      "Earth-Water": "Water nourishes Earth — emotional depth enriches practical growth",
      "Earth-Fire": "Earth grounds Fire — structure channels passionate energy",
      "Earth-Air": "Earth and Air work together — grounding abstract ideas into form",
    },
  },

  fr: {
    // Days of the week
    days: {
      monday: "lundi",
      tuesday: "mardi",
      wednesday: "mercredi",
      thursday: "jeudi",
      friday: "vendredi",
      saturday: "samedi",
      sunday: "dimanche",
    },

    // Moon phase
    moonPhase: {
      dayOfMonth: "Jour du Mois",
      moonPower: "Puissance Lunaire",
      phaseEnergy: "Énergie de Phase",
    },

    // Footer disclaimer
    disclaimer: "Pour réflexion seulement - Pas une règle",

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
      whoAmI: "Qui Suis-Je",
    },

    drawer: {
      profileSettings: "PROFIL & PARAMÈTRES",
      myProfile: "Mon Profil",
      aiSettings: "Paramètres IA",
      tools: "OUTILS",
      abjadCalculator: "Calculatrice Abjad",
      nameDestiny: "Destinée des Noms",
      zikr: "Dhikr & Wird",
      compatibility: "Compatibilité",
      whoAmI: "Qui Suis-Je",
      divineTiming: "Moment Divin",
      notifications: "NOTIFICATIONS",
      notificationSettings: "Paramètres de Notifications",
      notificationTest: "Tester les Notifications",
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

    planetCondition: {
      label: "Condition de la planète",
      scoreLabel: "Score",
      status: {
        Favorable: "Favorable",
        Neutral: "Neutre",
        Restricted: "Restreint",
        Avoid: "À éviter",
      },
      reasons: {
        DIGNITY_EXALTATION: "Exaltation (Sharaf) : soutien maximal.",
        DIGNITY_DOMICILE: "Domicile (Bayt) : stable et fiable.",
        DIGNITY_DETRIMENT: "Exil (Wabāl) : friction et instabilité.",
        DIGNITY_FALL: "Chute (Hubūṭ) : expression affaiblie.",
        DIGNITY_NEUTRAL: "Neutre : ton équilibré.",
        DEGREE_EXALTATION_PEAK_NEAR: "Proche du degré de pic d'exaltation (±3°) : bonus.",
        DEGREE_EXALTATION_NEAR: "Près du pic d'exaltation (±7°) : léger bonus.",
        DEGREE_CRITICAL_TRANSITION: "Degré critique (0–1° ou 29–30°) : instabilité de transition.",
      },
    },

    // Écran Manazil (détail)
    manazilScreen: {
      currentMoonPosition: "Position lunaire actuelle",
      liveIndicator: "🔴 EN DIRECT - Mise à jour en temps réel",
      moonStrength: "Force de la Lune",
      mansion: "Mansion",
      quality: "Qualité",
      changesEvery: "Change environ tous les ~2,4 jours",
      cosmicDialogueTitle: "🌌 Dialogue cosmique",
      mansionWisdomTitle: "🏛️ Sagesse de la demeure",
      fromYourName: "D'après votre nom : {name}",
      staticNeverChanges: "Statique - ne change jamais",
      needTimingGuidanceTitle: "⏰ Besoin d'analyse du timing ?",
      needTimingGuidanceSubtitle: "Consultez ces écrans pour le timing spirituel :",
      dailyEnergyLinkTitle: "Énergie du jour",
      dailyEnergyLinkSubtitle: "Voir le timing global pour aujourd'hui.",
      momentAlignmentLinkTitle: "Alignement du moment",
      momentAlignmentLinkSubtitle: "Voir le timing pour l'instant présent (heure par heure).",
      timingGuidanceNote: "Les scores se mettent à jour toutes les quelques minutes.",
      elementalStatus: {
        harmonious: "Harmonie",
        balanced: "Équilibré",
        tension: "Tension",
        bothAre: "Les deux sont {element} — énergie naturellement soutenante.",
        proceedMindfully: "{element1} et {element2} créent un contraste — avancez avec attention.",
        neutralEnergy: "{element1} et {element2} sont différents sans être opposés — énergie adaptable.",
      },
      relationship: {
        title: "Relation entre demeures",
        subtitle: "Comment l'élément lunaire du moment interagit avec votre demeure personnelle.",
        yourEssence: "Votre essence",
        currentMoon: "Lune actuelle",
        howToNavigate: "Comment naviguer aujourd'hui",
        bestCompatibility: "Meilleure compatibilité",
        whenMoonIn: "Quand la Lune est en {element}, votre demeure personnelle est particulièrement soutenue.",
        nextMoon: "Prochaine Lune en {element} : {relativeTime} ({date})",
        today: "aujourd'hui",
        tomorrow: "demain",
        inDays: "dans {count} jours",
        nextWeek: "la semaine prochaine",
        inWeeks: "dans {count} semaines",
        inMonths: "dans {count} mois",
        tips: {
          harmonious1: "Amplifiez vos dons naturels",
          harmonious2: "Faites confiance à votre intuition",
          harmonious3: "Travaillez avec les forces de votre élément",
          balanced1: "Travaillez avec les deux énergies consciemment",
          balanced2: "Trouvez le pont entre les éléments",
          balanced3: "Laissez l'équilibre vous guider",
          tension1: "Avancez doucement et restez présent",
          tension2: "Choisissez une prochaine étape simple et ancrée",
          tension3: "Priorisez le calme, la clarté et l'intention",
        },
      },
      personalMessage: {
        title: "Message personnel",
        subtitle: "Pour votre demeure personnelle : {name}",
        forYourNature: "Pour votre nature {element}",
        messageHarmonious: "La Lune {moonElement} d'aujourd'hui s'harmonise avec votre essence {personalElement}. Vos dons naturels sont amplifiés — faites confiance à votre intuition.",
        messageTension: "La Lune {moonElement} d'aujourd'hui crée une tension dynamique avec votre nature {personalElement}. Ce n'est pas négatif — c'est une croissance par l'équilibre. Avancez avec présence.",
        messageBalanced: "La Lune {moonElement} d'aujourd'hui apporte une énergie neutre à votre essence {personalElement}. Cela ouvre un espace de choix conscient — adaptez-vous selon le besoin.",
      },
    },

    notifications: {
      harmony: {
        favorableTitle: "🌟 Début d'une heure favorable",
        transformativeTitle: "✨ Ouverture d'une fenêtre transformatrice",
        delicateTitle: "⚠️ Période délicate à venir",
        updateTitle: "⏰ Mise à jour du timing",
        personalNoteAligned: "Votre élément {element} est aligné.",
        favorableBody: "Une heure favorable commence pour {activity}. Heure de {planet} • {element}.{personalNote} Ouvrez Alignement du moment pour voir ce qui est soutenu maintenant.",
        transformativeBody: "Une fenêtre transformatrice commence pour {activity}. Heure de {planet} • {element}.{personalNote} Ouvrez Alignement du moment pour voir ce qui est soutenu maintenant.",
        delicateBody: "Une heure délicate commence. Avancez avec douceur et présence. Heure de {planet} • {element}.{personalNote}",
      },
      timing: {
        // New component translations (TimingGuidanceCard, TodayDetailsCard, CollapsibleEducationalSection)
        currentTiming: "Timing Actuel",
        hour: "Heure",
        endsAt: "Se termine à",
        nextBestHour: "Prochaine Meilleure Heure",
        inHours: "dans",
        expectedQuality: "Qualité attendue",
        suggestion: "Suggestion",
        proceedNow: "Procédez maintenant",
        waitForBetter: "Attendez un meilleur timing si possible",
        excellentTiming: "Excellent timing maintenant!",
        todaysDetails: "Détails du jour",
        dayRuler: "Maître du jour",
        element: "Élément",
        quality: "Qualité",
        whyThisTiming: "Pourquoi ce timing?",
        elementHarmony: "Harmonie élémentaire",
        momentAlignment: "Alignement du moment",
        planetaryResonance: "Résonance planétaire",
        whatThisMeans: "Que cela signifie",
        // Legacy translations
        harmonyHigh: "des énergies très favorables",
        harmonyBalanced: "des énergies équilibrées, propices à l'évolution",
        harmonyReflective: "des énergies introspectives, idéales pour le travail intérieur",
        personalNoteSameElement: "Votre élément ({element}) est fortement activé aujourd'hui.",
        morningTitle: "{emoji} Briefing du matin — {dayName}",
        morningBody: "Aujourd'hui porte une énergie {elementName} avec {harmonyText}. Heure actuelle : {planet}.{personalNote} Ouvrez Guidance pour des recommandations personnalisées.",
        alignmentTitle: "✨ Pic d'alignement — {elementUpper}",
        alignmentBody: "Fort alignement {element} maintenant. Idéal pour {activity}. Ouvrez Alignement du moment pour votre prochaine étape.",
      },
      prayer: {
        prayerTitle: "🕌 Prière de {prayerName}",
        prayerBody: "C’est l’heure de {prayerName} ({arabic}). {glimpse}Appuyez pour la guidance + les horaires.",
        reminderTitle: "⏰ {prayerName} dans {minutes} min",
        reminderBody: "Préparez-vous : ablutions, intention et calme. {glimpse}Appuyez pour la guidance.",
        guidanceGlimpse: "Maintenant : heure de {planet} • {element}. {note} ",
        guidanceNoteAligned: "Forte résonance pour vous.",
        guidanceNoteSupportive: "Énergie soutenante — avancez avec constance.",
        guidanceNoteChallenging: "Énergie exigeante — allez doucement.",
        guidanceNoteNeutral: "Énergie équilibrée — restez attentif.",
        testTitle: "🕌 Notification test",
        testBodySoundOn: "Test du son de l’adhan",
        testBodySoundOff: "Test de notification (son désactivé)",
      },
      detail: {
        back: "Retour",
        title: "Notification",
        tip: "Astuce : Android peut réduire le texte dans le volet ; cet écran affiche toujours le contenu complet.",
        openPrayerTimes: "Ouvrir les heures de prière",
        openPrayerGuidance: "Ouvrir Guidance de prière",
        openDivineTiming: "Ouvrir Moment Divin",
        openDailyCheckIn: "Ouvrir Bilan Quotidien",
        openMomentAlignment: "Ouvrir Alignement du moment",
        openDailyGuidance: "Ouvrir Énergie du Jour",
      },
    },
    
    // Widgets (Cartes de la Page d'Accueil)
    widgets: {
      planetTransit: {
        title: "Transit Planétaire",
        subtitle: "Long terme",
        cta: "Voir impact →",
        timeScale: "Long terme (semaines/mois)",
        updated: "Mis à jour il y a {time}",
      },
      dailyEnergy: {
        title: "Énergie du Jour",
        todaysElement: "Élément du Jour",
        dayRuler: "Maître du Jour",
        bestFor: "IDÉAL POUR",
        todaysFocus: "Focus du Jour",
        forReflection: "Pour réflexion",
        viewDetails: "Voir détails",
        peakHours: "Heures de {planet} (vérifier Alignement du Moment pour les heures spécifiques)",
        windows: {
          neutral: "Fenêtre neutre",
          favorable: "Fenêtre favorable",
          transformative: "Fenêtre transformatrice",
          delicate: "Fenêtre délicate",
        },
        energyDescriptions: {
          fire: "Dynamique & énergisant",
          water: "Fluide & émotionnel",
          air: "Mental & communicatif",
          earth: "Ancrant & structuré",
        },
        planetaryFocus: {
          saturn: "Terminez ce que vous avez commencé, construisez des bases solides",
          jupiter: "Élargissez vos horizons, saisissez les opportunités",
          mars: "Agissez avec audace, affirmez-vous",
          venus: "Cultivez les relations, appréciez la beauté",
          mercury: "Communiquez clairement, apprenez quelque chose de nouveau",
          moon: "Faites confiance à votre intuition, occupez-vous de vos émotions",
          sun: "Dirigez avec confiance, exprimez-vous",
        },
        activities: {
          jupiter: {
            excellent: {
              0: "Commencer un nouvel apprentissage ou enseignement",
              1: "Expansion des affaires et opportunités",
              2: "Chercher des conseils ou du mentorat",
              3: "Planification de voyages ou études philosophiques",
              4: "Connexions sociales et réseautage",
            },
            lessFavorable: {
              0: "Travail technique détaillé (attendre le jour de Mercure)",
              1: "Conservatisme financier (Jupiter encourage l'expansion)",
            },
          },
          mars: {
            excellent: {
              0: "Entraînement physique et athlétisme",
              1: "Lancer des initiatives audacieuses",
              2: "Activités compétitives",
              3: "Surmonter les obstacles",
              4: "Action décisive",
            },
            lessFavorable: {
              0: "Négociations délicates",
              1: "Conversations émotionnelles",
              2: "Tâches nécessitant de la patience",
              3: "Approches passives ou trop prudentes",
            },
          },
          mercury: {
            excellent: {
              0: "Écriture et communication",
              1: "Apprentissage et étude",
              2: "Négociations commerciales",
              3: "Planification et stratégie",
              4: "Trajets courts et courses",
            },
            lessFavorable: {
              0: "Décisions émotionnelles",
              1: "Travail physique intense",
              2: "Engagements à long terme sans analyse",
            },
          },
          venus: {
            excellent: {
              0: "Construction de relations",
              1: "Travail créatif et artistique",
              2: "Poursuite de la beauté et de l'esthétique",
              3: "Rassemblements sociaux",
              4: "Accords financiers",
            },
            lessFavorable: {
              0: "Action agressive",
              1: "Confrontation",
              2: "Critique sévère",
            },
          },
          saturn: {
            excellent: {
              0: "Achèvement de projets à long terme",
              1: "Construction de structures et systèmes",
              2: "Travail de discipline et de concentration",
              3: "Tâches administratives",
              4: "Planification à long terme",
            },
            lessFavorable: {
              0: "Décisions spontanées",
              1: "Lancement de nouveaux projets créatifs",
              2: "Activités de loisirs sociaux",
            },
          },
          sun: {
            excellent: {
              0: "Leadership et prise de responsabilités",
              1: "Auto-expression et créativité",
              2: "Présentations publiques",
              3: "Image de marque personnelle",
              4: "Activités renforçant la confiance",
            },
            lessFavorable: {
              0: "Rôles soumis",
              1: "Travail de soutien en arrière-plan",
              2: "Auto-dépréciation",
            },
          },
          moon: {
            excellent: {
              0: "Guérison émotionnelle et réflexion",
              1: "Soins et attention aux autres",
              2: "Travail intuitif",
              3: "Temps en famille",
              4: "Soins personnels et repos",
            },
            lessFavorable: {
              0: "Action agressive",
              1: "Décisions uniquement logiques",
              2: "Suppression émotionnelle",
            },
          },
          common: {
            waitForBetterTiming: "Lancer de grandes nouvelles initiatives (attendre un meilleur timing)",
          },
        },
        // Planetary Judgment Card
        planetaryJudgment: {
          title: "Jugement Planétaire",
          cosmicVerdict: "VERDICT COSMIQUE DU JOUR",
          status: {
            supportive: "Jour Favorable",
            neutral: "Jour Neutre",
            cautious: "Jour Prudent",
          },
          classicalTerms: {
            supportive: "Bénéfique",
            neutral: "Neutre",
            cautious: "Maléfique",
          },
          intro: "Aujourd'hui est régi par {planet}.",
          rulerTone: {
            sun: "Le Soleil apporte vitalité, leadership et expression de soi. Un jour pour la confiance et la visibilité.",
            moon: "La Lune gouverne les émotions, l'intuition et le soin. Un jour pour le travail intérieur et la famille.",
            mars: "Mars énergise l'action, le courage et la compétition. Un jour pour les mouvements audacieux mais attention aux conflits.",
            mercury: "Mercure régit la communication, l'apprentissage et le commerce. Un jour pour l'étude et la négociation.",
            jupiter: "Jupiter élargit les opportunités, la sagesse et la bonne fortune. Un jour pour la croissance et la générosité.",
            venus: "Vénus apporte harmonie, beauté et relations. Un jour pour l'amour et l'esthétique.",
            saturn: "Saturne exige discipline, structure et patience. Un jour pour compléter les travaux à long terme.",
          },
          phaseModifier: {
            amplify: "La Lune croissante amplifie l'énergie du jour—saisissez l'élan.",
            soften: "La Lune décroissante adoucit l'intensité—réfléchissez avant d'agir.",
            neutral: "La Lune est en transition—équilibrez action et contemplation.",
          },
          bestForLabel: "Idéal Pour",
          avoidLabel: "À Éviter",
          disclaimer: "Guidance classique basée sur la maîtrise planétaire. Votre thème personnel peut modifier ces influences.",
          bestFor: {
            sun: {
              0: "Leadership et prise de responsabilités",
              1: "Présentations publiques et visibilité",
              2: "Auto-expression et créativité",
            },
            moon: {
              0: "Guérison émotionnelle et réflexion",
              1: "Temps en famille et soins",
              2: "Décisions intuitives",
            },
            mars: {
              0: "Entraînement physique et athlétisme",
              1: "Lancer des initiatives audacieuses",
              2: "Activités compétitives",
            },
            mercury: {
              0: "Écriture et communication",
              1: "Apprentissage et étude",
              2: "Négociations commerciales",
            },
            jupiter: {
              0: "Opportunités d'expansion et croissance",
              1: "Enseignement et apprentissage",
              2: "Voyage et études philosophiques",
            },
            venus: {
              0: "Construction de relations",
              1: "Travail créatif et artistique",
              2: "Beauté et esthétique",
            },
            saturn: {
              0: "Achèvement de projets à long terme",
              1: "Construction de structures et systèmes",
              2: "Travail de discipline et concentration",
            },
          },
          avoid: {
            sun: {
              0: "Rôles soumis",
              1: "Travail de soutien en arrière-plan",
              2: "Auto-dépréciation",
            },
            moon: {
              0: "Confrontation agressive",
              1: "Décisions purement logiques",
              2: "Suppression émotionnelle",
            },
            mars: {
              0: "Négociations délicates",
              1: "Conversations émotionnelles",
              2: "Tâches nécessitant patience",
            },
            mercury: {
              0: "Décisions émotionnelles",
              1: "Travail physique intense",
              2: "Engagements long terme sans analyse",
            },
            jupiter: {
              0: "Surengagement",
              1: "Expansion imprudente",
              2: "Ignorer les détails pratiques",
            },
            venus: {
              0: "Action agressive",
              1: "Critique sévère",
              2: "Confrontation",
            },
            saturn: {
              0: "Décisions spontanées",
              1: "Lancer de nouveaux projets créatifs",
              2: "Activités de loisirs sociaux",
            },
          },
        },
        scope: {
          day: "Maître du Jour",
        },
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
      dailyGuidance: {
        title: "Guidance",
        dayRuler: "Planète",
        yourElement: "Vous",
        bestForLabel: "Idéal pour",
        reflection: "Réflexion",
        windows: {
          neutral: "Fenêtre neutre",
          favorable: "Fenêtre favorable",
          transformative: "Fenêtre transformatrice",
          delicate: "Fenêtre délicate",
        },
        alignment: {
          supportive: "Équilibre favorable",
          neutral: "Énergie équilibrée",
          challenging: "Tension dynamique",
        },
        focuses: {
          neutral: {
            0: "Équilibrer routine et spontanéité",
            1: "Maintenir une énergie stable",
            2: "S'ancrer dans le présent",
          },
          favorable: {
            0: "Saisir les opportunités alignées",
            1: "Faire confiance à votre flux naturel",
            2: "S'exprimer authentiquement",
          },
          transformative: {
            0: "Accueillir le changement en douceur",
            1: "Laisser l'intuition guider le pas suivant",
            2: "Avancer avec patience",
          },
          delicate: {
            0: "Ralentir et protéger votre attention",
            1: "Observer avant de réagir",
            2: "Choisir le calme plutôt que l'urgence",
          },
        },
        cta: "Détails →",
      },

      manazil: {
        title: "Manazil",
        badge: "Votre Résonance",
        completeProfile: "Compléter le profil",
        advancedPractices: "Pratiques avancées",
        todaysMansion: "Demeure du jour",
        yourMansion: "Votre demeure",
        dailyElement: "Élément du jour",
        yourElement: "Votre élément",
        resonanceLabel: "Résonance",
        guidanceLabel: "Guidance",
        understandResonance: "Voir les détails →",
        favorable: "Favorable",
        balanced: "Équilibrée",
        delicate: "Délicate",
        resonanceLevels: {
          supportive: "Favorable",
          harmonious: "Harmonieuse",
          neutral: "Neutre",
          challenging: "Exigeante",
          transformative: "Transformatrice",
        },
        guidanceByResonance: {
          supportive: "Fort alignement aujourd’hui. Avancez avec confiance et gardez l’élan.",
          harmonious: "Accord utile. Collaborez, apprenez, et construisez avec constance.",
          neutral: "Tonalité équilibrée. Votre intention guide le résultat—choisissez la clarté.",
          challenging: "Un peu de friction. Simplifiez, terminez l’essentiel, allez doucement.",
          transformative: "Tension élevée, potentiel de percée. Ralentissez et choisissez la sagesse.",
        },
        realTime: "Temps réel",
        approximate: "Approximatif",
        currentMansion: "Demeure actuelle :",
        yourBaseline: "Votre Base",
        reflection: "Pour réflexion",
        today: "🌙 Manazil du jour : {name}",
        todayApprox: "≈ Manazil du jour (approx.) : {name}",
        personal: "Votre Demeure de Base : {name}",
        personalMissing: "🧿 Votre Manazil : complétez le profil",
        personalizedFor: "Personnalisé pour",
        resonance: {
          harmonious: "Résonance : fortement alignée",
          supportive: "Résonance : favorable",
          challenging: "Résonance : exigeante",
          neutral: "Résonance : équilibrée",
        },
        advice: {
          bestForLabel: "Idéal pour",
          avoidLabel: "À éviter",
          bestForShort: {
            fire: "Initiative",
            water: "Réparation douce",
            air: "Plan clair",
            earth: "Structure & accomplissement",
          },
          bestFor: {
            fire: "initiative, action courageuse, commencer l’essentiel",
            water: "réflexion, guérison, pratique spirituelle, réparation douce",
            air: "apprentissage, communication, planification, échanges clairs",
            earth: "structure, constance, finances, finir ce qui est prévu",
          },
          avoid: {
            fire: "conflits impulsifs, précipitation, épuisement",
            water: "submersion, spirales émotionnelles, trop en faire",
            air: "sur-analyse, dispersion, débats stériles",
            earth: "entêtement, rigidité, remettre à plus tard",
          },
          resonance: {
            harmonious: "Votre Manazil personnel est très accordé au jour—avancez.",
            supportive: "Le jour soutient votre base—progrès réguliers.",
            challenging: "Le jour peut être tendu—allez doucement, simplifiez.",
            neutral: "Énergie équilibrée—choisissez le prochain pas clair.",
          },
        },
        compactAdvice: "Saisis les opportunités alignées",
        cta: "Voir détails →",
      },
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
      whoAmI: {
        title: "Qui Suis-Je",
        description: "Auto-analyse approfondie par numérologie: élément, personnalité, carrière & chemin spirituel",
      },
      guidedIstikhara: {
        title: "Istikharah Guidée",
        description: "Apprenez la méthode traditionnelle de prière et suivez vos décisions spirituelles",
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
      asrariya: {
        title: "Timing des Pratiques",
        description: "Trouvez les moments optimaux pour vos pratiques spirituelles",
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
      zikr: {
        title: "Dhikr & Wird",
        description: "Souvenir d'Allah pour la paix intérieure",
      },
    },

    // Zikr Module
    zikr: {
      title: "Dhikr & Wird",
      subtitle: "Souvenir d'Allah pour la paix intérieure",
      todayProgress: "Aujourd'hui",
      allTimeProgress: "Total",
      favorites: "Favoris",
      noFavorites: "Pas de favoris",
      noFavoritesHint: "Appuyez sur le cœur sur n'importe quel dhikr pour l'ajouter à vos favoris",
      goalReached: "Objectif atteint !",
      categories: {
        all: "Tous",
        favorites: "Favoris",
        istighfar: "Istighfār",
        salawat: "Ṣalawāt",
        divineNames: "Noms Divins",
        morningEvening: "Matin & Soir",
        custom: "Personnalisé",
      },
      sessions: {
        fajr: "Fajr",
        morning: "Matin",
        dhuhr: "Ẓuhr",
        asr: "ʿAṣr",
        maghrib: "Maghrib",
        isha: "ʿIshāʾ",
        tahajjud: "Tahajjud",
        other: "Autre",
      },
      stats: {
        streak: "jours consécutifs",
        total: "total",
      },
      actions: {
        add: "Ajouter",
        cancel: "Annuler",
        customAmount: "Montant personnalisé",
        enterNumber: "Entrez un nombre...",
      },
    },

    // Prayer Times Screen
    prayerTimes: {
      title: "Horaires de prière",
      next: "SUIVANT",
      inTime: "dans {{time}}",
      noPrayer: "Pas de prière",
      getGuidance: "Obtenir des conseils de prière",
      tapForGuidance: "Appuyez pour voir les conseils de prière",
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
      tapToExpand: "Appuyez pour développer",
      tapToLearnMore: "Appuyez pour en savoir plus",
      buttons: {
        learnMore: "En Savoir Plus",
        collapse: "Afficher Moins",
        tapToLearn: "Appuyez pour en savoir plus",
      },
      retry: "Réessayer",
      on: "OUI",
      off: "NON",
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
      element: "Élément",
      you: "Vous",
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
      // Quality levels (TimingGuidanceCard)
      quality: {
        excellent: "Excellent",
        good: "Bon",
        moderate: "Modéré",
        weak: "Faible",
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
          act: "Excellent",
          maintain: "Neutre",
          hold: "Prudence",
          aligned: "Aligné",
          steady: "Stable",
          mindful: "Prudence",
        },
        hint: {
          act: "Heure de Soleil, Jupiter ou Vénus — procédez avec confiance",
          maintain: "Heure de Lune ou Mercure — continuez sereinement",
          hold: "Heure de Saturne ou Mars — faites preuve de patience",
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
          rulesLabel: "Signe",
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

      planetTransitDetails: {
        title: "Transit Planétaire",
        explainer: "Affiche l'énergie planétaire dominante et comment elle interagit avec votre nature spirituelle.",
        explainers: {
          currentHour: "Affiche l’heure planétaire active (elle change au fil de la journée) et comment elle interagit avec votre nature spirituelle.",
          tomorrowRuler: "Affiche le régent planétaire de demain (influence du jour de la semaine) et comment il interagit avec votre nature spirituelle.",
        },
        subtitleNow: "Votre heure planétaire actuelle — personnalisée selon votre profil",
        subtitleNextDay: "Le régent de demain — personnalisé selon votre profil",
        error: "Impossible de charger les détails pour le moment.",
        nextChange: "Prochain changement dans {countdown}",
        sections: {
          dayEnergy: "Énergie du Jour",
          currentHour: "Heure actuelle",
          tomorrowRuler: "Régent de demain",
          yourNature: "Votre Nature",
          resonance: "Résonance",
          context: "Basé sur les relations élémentaires dans l'astrologie spirituelle traditionnelle.",
        },
        hints: {
          currentHour: "C’est l’heure planétaire active (elle change au fil de la journée).",
          tomorrowRuler: "C’est le régent planétaire de demain (influence du jour de la semaine).",
        },
        pills: {
          element: "Élément",
          sign: "Signe",
          dayRuler: "Régent du jour",
        },
        yourZodiac: "Votre signe : {zodiac}",
        yourElement: "Votre élément : {element}",
        yourBurj: "Votre burj : {burj}",
        dayRuler: "Régent du jour : {ruler}",
        missingProfile: "Ajoutez votre date de naissance pour personnaliser ces aperçus.",
        completeProfile: "Compléter le profil",
        resonanceNoProfile: "Complétez votre profil pour voir une résonance personnalisée.",
        resonanceType: {
          supportive: "Supportif",
          challenging: "Transformateur",
          neutral: "Neutre",
        },
        harmony: {
          harmonious: {
            label: "Harmonieux",
            description: "Forte affinité : votre nature {userElement} s'aligne avec l'énergie {contextElement}.",
            whatToDo: "Idéal pour progresser régulièrement, clarifier l'intention et finaliser ce qui est en cours.",
            bestFor: "Idéal aujourd'hui : Progrès régulier, intentions claires, finalisation des tâches",
            avoid: "Mieux vaut éviter : Précipitation, surengagement, trop de nouveaux départs",
          },
          supportive: {
            label: "Supportif",
            description: "Flux supportif : votre {userElement} est aidé par l'énergie {contextElement}.",
            whatToDo: "Idéal pour collaborer, apprendre et avancer en douceur.",
            bestFor: "Idéal aujourd'hui : Collaboration, apprentissage, recherche de conseils",
            avoid: "Mieux vaut éviter : Isolement, entêtement, forcer les résultats",
          },
          neutral: {
            label: "Neutre",
            description: "Mélange équilibré : votre {userElement} rencontre {contextElement} sans friction.",
            whatToDo: "Idéal pour les tâches routinières et les décisions mesurées.",
            bestFor: "Idéal aujourd'hui : Tâches routinières, planification, réflexion",
            avoid: "Mieux vaut éviter : Décisions majeures, extrêmes, impulsivité",
          },
          challenging: {
            label: "Transformateur",
            description: "Tension transformatrice : votre {userElement} rencontre l'énergie opposée {contextElement}.",
            whatToDo: "Ralentissez, révisez, évitez l'impulsivité — laissez la clarté apparaître.",
            bestFor: "Idéal aujourd'hui : Révision, patience, réflexion intérieure",
            avoid: "Mieux vaut éviter : Choix impulsifs, confrontation, précipitation",
          },
        },
        disclaimer: "Pour réflexion • Pas un avis religieux",
        influenceEngine: {
          personalInfluence: "Influence Personnelle",
          collectiveInfluence: "Influence Collective",
          collectiveImpact: "Impact Collectif",
          cosmicWeather: "Météo Cosmique",
          forYou: "Pour Vous",
          howRelates: "Votre Connexion",
          detailedGuidance: "Conseils Détaillés",
          guidanceDescription: "Conseils personnalisés pour cette influence",
          bestForNow: "Meilleur maintenant",
          betterToAvoid: "Mieux éviter",
          reflectivePractices: "Pratiques Spirituelles",
          items: {
            takingAlignedAction: "Prendre des actions alignées",
            makingImportantDecisions: "Prendre des décisions importantes",
            beginningNewInitiatives: "Commencer de nouvelles initiatives",
            buildMeaningfulConnections: "Établir des connexions significatives",
            createBeauty: "Créer de la beauté",
            trustYourNaturalInstincts: "Faire confiance à vos instincts naturels",
            observationAndPatience: "Observation et patience",
            planningWithoutRushing: "Planifier sans se précipiter",
            seekingClarityBeforeActing: "Chercher la clarté avant d’agir",
            forcingDecisions: "Forcer des décisions",
            majorCommitments: "Engagements majeurs",
            hastyActions: "Actions hâtives",
            completingExistingWork: "Terminer ce qui est déjà en cours",
            reflectionAndReview: "Réflexion et bilan",
            releasingWhatNoLongerServes: "Lâcher ce qui ne sert plus",
            startingNewProjects: "Démarrer de nouveaux projets",
            majorDecisions: "Décisions majeures",
            pushingAgainstResistance: "Forcer malgré les résistances",
            acceptLimitations: "Accepter les limites",
            buildFoundationsSlowly: "Construire des bases lentement",
            rebellionAgainstStructure: "Rébellion contre la structure",
            shortcuts: "Raccourcis",
            disciplineAndCommitment: "Discipline et engagement",
            longTermPlanning: "Planification à long terme",
            laziness: "Paresse",
            avoidingResponsibility: "Éviter les responsabilités",
            harvestLessonsLearned: "Récolter les leçons apprises",
            honorCommitmentsMade: "Honorer les engagements pris",
            bitterness: "Amertume",
            regretWithoutAction: "Regret sans passage à l’action",
            opennessToExpansion: "Ouverture à l’expansion",
            learningAndTeaching: "Apprendre et enseigner",
            overconfidence: "Excès de confiance",
            excess: "Excès",
            growthOpportunities: "Opportunités de croissance",
            sharingWisdom: "Partager la sagesse",
            greed: "Avidité",
            takingMoreThanNeeded: "Prendre plus que nécessaire",
            integrateWhatWasGained: "Intégrer ce qui a été acquis",
            shareBlessings: "Partager les bienfaits",
            hoarding: "Thésauriser",
            prideInAchievements: "Fierté des accomplissements",
            assessChallengesCarefully: "Évaluer les défis avec attention",
            buildCourage: "Cultiver le courage",
            impulsiveAnger: "Colère impulsive",
            rushingIntoConflict: "Se précipiter dans le conflit",
            courageousAction: "Action courageuse",
            defendingTruth: "Défendre la vérité",
            aggression: "Agressivité",
            harmingOthers: "Faire du mal aux autres",
            completeBattlesWisely: "Conclure les batailles avec sagesse",
            forgiveWhenAble: "Pardonner quand c’est possible",
            prolongingConflict: "Prolonger le conflit",
            holdingGrudges: "Rancune",
            exploreValuesAndDesires: "Explorer valeurs et désirs",
            appreciateBeauty: "Apprécier la beauté",
            attachmentToFleetingPleasures: "Attachement aux plaisirs passagers",
            vanity: "Vanité",
            releaseAttachments: "Relâcher les attachements",
            appreciateWhatRemains: "Apprécier ce qui reste",
            clingingToWhatsEnding: "S’accrocher à ce qui se termine",
            jealousy: "Jalousie",
            listenMoreThanSpeak: "Écouter plus que parler",
            gatherInformation: "Rassembler des informations",
            gossip: "Commérages",
            hastyConclusions: "Conclusions hâtives",
            clearCommunication: "Communication claire",
            deception: "Tromperie",
            withholdingTruth: "Retenir la vérité",
            concludeConversations: "Conclure les conversations",
            summarizeLearnings: "Synthétiser les apprentissages",
            overExplaining: "Trop expliquer",
            endlessDebate: "Débat sans fin",
            clarifyIntentions: "Clarifier les intentions",
            identifyPurpose: "Identifier le but",
            egoDrivenAction: "Action guidée par l’ego",
            seekingValidation: "Chercher la validation",
            leadWithIntegrity: "Mener avec intégrité",
            shineYourGifts: "Rayonner vos dons",
            arrogance: "Arrogance",
            overshadowingOthers: "Éclipser les autres",
            acknowledgeAchievementsHumbly: "Reconnaître ses réussites avec humilité",
            rest: "Repos",
            burnout: "Épuisement",
            pride: "Orgueil",
            honorEmotions: "Honorer ses émotions",
            nurtureYourself: "Prendre soin de vous",
            emotionalReactivity: "Réactivité émotionnelle",
            ignoringFeelings: "Ignorer ses ressentis",
            trustIntuition: "Faire confiance à l’intuition",
            careForOthers: "Prendre soin des autres",
            emotionalManipulation: "Manipulation émotionnelle",
            codependency: "Codépendance",
            releaseEmotionalBaggage: "Libérer les bagages émotionnels",
            forgive: "Pardonner",
            holdingOntoPain: "S’accrocher à la douleur",
            collaborateWithTheEnergy: "Collaborer avec l’énergie",
            forcingYourWayAlone: "Forcer seul(e) votre chemin",
            stayFlexibleAndObservant: "Rester flexible et observateur",
            strongCommitmentsEitherWay: "Engagements forts dans un sens ou dans l’autre",
            patienceAndLearningFromFriction: "Patience et apprentissage par la friction",
            fightingAgainstTheCurrent: "Lutter contre le courant",
            procrastination: "Procrastination",
            ignoringOpportunities: "Ignorer les opportunités",
            excessiveHesitation: "Hésitation excessive",
            superficiality: "Superficialité",
            excessIndulgence: "Excès d'indulgence",
            doubtingYourselfUnnecessarily: "Douter de vous inutilement",
            purposefulActionWithIntention: "Action intentionnelle avec détermination",
            actsOfKindness: "Actes de gentillesse",
            artisticExpression: "Expression artistique",

            // Pratiques spirituelles
            istighfarSeekingForgiveness: "Istighfār (demande de pardon)",
            duaForGuidance: "Duʿāʾ pour la guidance",
            contemplationAndSilence: "Contemplation et silence",
            shukrGratitude: "Shukr (gratitude)",
            salawatUponTheProphet: "Ṣalawāt sur le Prophète ﷺ",
            tasbihGlorification: "Tasbīḥ (glorification d’Allah)",
            closingPrayersAndGratitude: "Prières de clôture et gratitude",
            restAndRestoration: "Repos et restauration",
            patienceSabr: "Patience (Ṣabr)",
            trustInDivineTimingTawakkul: "Confiance dans le timing divin (Tawakkul)",
            consistentWorship: "Adoration régulière",
            fulfillingObligations: "Accomplir ses obligations",
            gratitudeForTrials: "Gratitude face aux épreuves",
            duaForRelief: "Duʿāʾ pour le soulagement",
            seekingKnowledge: "Recherche du savoir",
            generosityInMeasure: "Générosité avec mesure",
            sadaqahCharity: "Ṣadaqah (aumône)",
            teachingOthers: "Enseigner aux autres",
            humility: "Humilité",
            passingKnowledgeForward: "Transmettre le savoir",
            controllingAngerGhayz: "Maîtriser la colère (Ghayẓ)",
            seekingCalm: "Rechercher le calme",
            jihadAlNafsInnerStruggle: "Jihād al-Nafs (lutte intérieure)",
            righteousEffort: "Effort juste",
            forgivenessAfw: "Pardon (ʿAfw)",
            peaceMaking: "Réconciliation",
            gratitudeForBlessings: "Gratitude pour les bienfaits",
            moderation: "Modération",
            contentmentQanah: "Contentement (Qanāʿah)",
            trustInProvision: "Confiance dans la subsistance",
            mindfulSpeech: "Parole consciente",
            activeListening: "Écoute active",
            speakingTruthWithWisdom: "Dire la vérité avec sagesse",
            sharingKnowledge: "Partager le savoir",
            silenceWhenNeeded: "Silence quand nécessaire",
            reflectionOnWords: "Réflexion sur les mots",
            ikhlasSincerity: "Ikhlas (sincérité)",
            purifyingIntention: "Purifier l’intention",
            humilityInService: "Humilité au service",
            authenticExpression: "Expression authentique",
            gratitudeToAllah: "Gratitude envers Allah",
            renewal: "Renouveau",
            dhikrForPeace: "Dhikr pour la paix",
            selfCompassion: "Auto-compassion",
            prayerForEmotionalHealing: "Prière pour la guérison émotionnelle",
            actsOfNurturing: "Actes de soin",
            emotionalCleansingDua: "Duʿāʾ de purification émotionnelle",
            lettingGo: "Lâcher prise",
          },
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
      
      // Guidance de Prière - Pratiques Planétaires Classiques
      prayerGuidance: {
        title: "Guidance de Prière",
        subtitle: "Pratiques classiques des heures planétaires issues de sources traditionnelles",

        // Libellés UI utilisés par les écrans/cartes de Guidance de Prière
        ui: {
          headerSubtitle: "Guidance spirituelle personnalisée basée sur les sciences islamiques classiques",
          currentHour: "Heure actuelle : {planet} {arabicName}",
          currentHourLabel: "Heure actuelle",
          hourOfTwelve: "Heure {number}/12",
          day: "Jour",
          night: "Nuit",
          generating: "Génération de la guidance...",

          forEveryone: "Pour Tous",
          forPractitioners: "Pour les Praticiens",
          primaryFocus: "Principal",
          spiritualPrimary: "La pratique spirituelle est prioritaire ; l’alignement mondain est secondaire.",
          dhikrTitle: "Dhikr Recommandé",
          quranTitle: "Récitation Coranique",
          duaTitle: "Invocations Recommandées",
          intentionsTitle: "Intentions Spirituelles (Niyyah)",
          sunnahTitle: "Pratiques de la Sunna",
          adabTitle: "Bonnes Manières (Adab)",
          expandAdvanced: "Voir les Conseils Avancés",
          collapseAdvanced: "Masquer les Conseils Avancés",
          classicalReferences: "Références Traditionnelles",
          traditionalContext: "Contexte Traditionnel",
          naturalAlignment: "Alignement Naturel",

          profileHintTitle: "Complétez votre profil pour personnaliser la guidance",
          profileHintBody: "Ajoutez votre nom arabe dans Profil afin de calculer votre signature Abjad et votre élément.",
          goToProfile: "Aller au profil",
          missingArabicName: "Manquant : nom arabe",

          emptyTitle: "Choisir une prière",
          emptyBody: "Choisissez une prière ci-dessus pour recevoir une guidance spirituelle adaptée à votre profil abjad et à l'heure planétaire actuelle.",

          footerBasedOn: "✨ Guidance basée sur votre valeur abjad ({abjad}) et votre élément ({element})",
          sources: "Sources : {source}",

          // Libellés communs
          spiritualContext: "Contexte spirituel",
          yourElement: "Votre élément",
          hourNumber: "Numéro de l'heure",
          timeRemaining: "Temps restant",
          dayRuler: "Régent du jour",
          next: "Suivante",
          current: "Actuelle",
          selectPrayer: "Choisir une prière",
          changePrayer: "Changer",
          guidanceFor: "Prière {prayer}",

          // Carte Nom divin
          recommendedDivineName: "Nom divin recommandé",
          reciteCount: "Réciter {count}×",
          abjadValueLabel: "Valeur Abjad : {value}",
          showReasoning: "▶ Voir le raisonnement",
          hideReasoning: "▼ Masquer le raisonnement",
          planetaryAlignment: "🪐 Alignement planétaire :",
          elementalResonance: "💫 Résonance élémentaire :",
          numerologicalSignificance: "🔢 Signification numérologique :",
          classicalSource: "📚 Source classique :",
          spiritualBenefits: "✨ Bienfaits spirituels :",

          // Carte Sagesse classique
          classicalWisdom: "Sagesse classique",
          noClassicalGuidance: "Aucune guidance classique spécifique pour cette heure",
          modernContext: "Dans le contexte d'aujourd'hui",
          modernContextExplanation: "Ces termes classiques font référence à des pratiques spirituelles qui peuvent être comprises de manière contemporaine—fixer des intentions, créer des routines bénéfiques et travailler avec des symboles et pratiques positifs.",
          show: "Afficher",
          hide: "Masquer",

          // Carte d'alignement (contexte spirituel)
          alignmentLevel: {
            exceptional: "EXCEPTIONNEL",
            strong: "FORT",
            favorable: "FAVORABLE",
            moderate: "MODÉRÉ",
            balanced: "ÉQUILIBRÉ",
            challenging: "DIFFICILE",
          },
          alignmentDescription: {
            exceptional:
              "Votre nature {userElement} s'aligne parfaitement avec cette heure {hourElement}. Moment optimal pour le travail spirituel.",
            strong:
              "Votre nature {userElement} harmonise fortement avec cette heure {hourElement}. Excellentes conditions pour la pratique.",
            favorable:
              "Votre nature {userElement} fonctionne bien avec cette heure {hourElement}. Bon moment pour les activités spirituelles.",
            moderate:
              "Votre nature {userElement} a une compatibilité modérée avec cette heure {hourElement}. Pratique régulière recommandée.",
            balanced:
              "Votre nature {userElement} recherche l'équilibre avec cette heure {hourElement}. Concentrez-vous sur l'équilibre dans la pratique.",
            challenging:
              "Votre nature {userElement} rencontre son opposé durant cette heure {hourElement}. Gardez des pratiques douces, ancrées et constantes.",
          },

          // Adhkar
          sunnahAdhkar: "Adhkar de la Sunnah",
          noAdhkarAvailable: "Aucun adhkar disponible",
          showTranslation: "Afficher la traduction",
          hideTranslation: "Masquer la traduction",
          progressCompleted: "{completed} / {total} complétés",
          resetAll: "Tout réinitialiser",

          // Compteur
          dhikrCounter: "Compteur de dhikr",
          percentComplete: "{percent}% terminé",
          completedAlhamdulillah: "✨ Terminé ! Alhamdulillah ✨",
          complete: "✓ Terminé",
          tapToCount: "Appuyez pour compter",
          reset: "Réinitialiser",
          dhikrHelper: "Appuyez sur le bouton à chaque récitation du Nom divin",
        },
        
        // Jours de la semaine
        days: {
          Sunday: "Dimanche",
          Monday: "Lundi",
          Tuesday: "Mardi",
          Wednesday: "Mercredi",
          Thursday: "Jeudi",
          Friday: "Vendredi",
          Saturday: "Samedi",
        },
        
        // Planètes
        planets: {
          Sun: "Soleil",
          Moon: "Lune",
          Mars: "Mars",
          Mercury: "Mercure",
          Jupiter: "Jupiter",
          Venus: "Vénus",
          Saturn: "Saturne",
        },
        
        // Étiquettes des heures
        hours: {
          hour: "Heure",
          hourNumber: "Heure {number}",
          rulingPlanet: "Planète Gouvernante",
          recommendedWorks: "Travaux Recommandés",
          avoidWorks: "Travaux à Éviter",
          classicalText: "Texte Classique",
          source: "Source",
          tradition: "Tradition",
        },
        
        // Travaux/pratiques classiques
        works: {
          // Heure 1: Soleil - Talismans et travaux sacrés
          talismansSeals: {
            name: "Talismans et Sceaux Bénis",
            description: "Talismans licites et sceaux bénis pour la protection et le bénéfice spirituel",
          },
          reversalWork: {
            name: "Travail de Retournement (al-Radd)",
            description: "Pratiques pour détourner le mal et les influences négatives",
          },
          alMaski: {
            name: "Al-Maski",
            description: "Pratique traditionnelle de liaison pour la protection spirituelle",
          },
          hinduBinding: {
            name: "Liaison Hindoue (al-Qabd al-Hindi)",
            description: "Méthode classique de liaison spirituelle des traditions orientales",
          },
          burntWoolInk: {
            name: "Encre de Laine Brûlée (Midād al-Ṣūf al-Maḥrūq)",
            description: "Préparation d'encre sacrée utilisée dans l'écriture spirituelle traditionnelle",
          },

          nightWorks: {
            name: "Travaux Nocturnes",
            description: "Opérations destinées au cœur de la nuit ; souvent évitées dans les heures solaires même s'il fait nuit",
          },

          // Clés de secours utilisées par le moteur lorsque les données manuscrites ne sont pas disponibles
          waterRelated: {
            name: "Travaux liés à l'eau",
            description: "Purification, apaisement, réconciliation et travail émotionnel doux",
          },
          travelMovement: {
            name: "Voyage et mouvement",
            description: "Déplacements, voyages et mise en mouvement dans des affaires licites",
          },
          ironMetalwork: {
            name: "Fer et métallurgie",
            description: "Forge, outils, coupe et opérations liées au métal (souvent évitées dans les heures lunaires/vénusiennes)",
          },
          combatDefense: {
            name: "Défense et confrontation",
            description: "Travail protecteur et confrontant qui exige fermeté et retenue",
          },
          marriageFamily: {
            name: "Mariage et famille",
            description: "Affaires de mariage, de lien et d'harmonie familiale",
          },
          studyKnowledge: {
            name: "Étude et connaissance",
            description: "Apprentissage, lecture, écriture, recherche et quête de compréhension",
          },
          herbMedicine: {
            name: "Herbes et médecine",
            description: "Remèdes, travail avec les herbes et pratiques liées à la santé (dans des moyens licites)",
          },
          seekingKingsNobles: {
            name: "Recherche de rois et de nobles",
            description: "Recherche de faveur auprès de l'autorité, de bienfaiteurs et de dirigeants",
          },
          landProperty: {
            name: "Terre et propriété",
            description: "Questions de propriété, agriculture, croissance à long terme et expansion licite",
          },
          magicalWorkings: {
            name: "Opérations coercitives ou agressives",
            description: "Opérations confrontantes ou coercitives qui contredisent la qualité bienveillante et expansive de Jupiter",
          },
          imprisonmentBondage: {
            name: "Emprisonnement et servitude",
            description: "Travaux restrictifs, contraintes et opérations de liaison",
          },
          saturnWorks: {
            name: "Travaux saturniens",
            description: "Discipline, limites, fins et endurance au long cours (à utiliser avec prudence)",
          },
          
          // Heure 2: Vénus - Harmonie et faveur
          correctnessSweetness: {
            name: "Travaux de Justesse et de Douceur",
            description: "Pratiques pour apporter harmonie, justesse et relations agréables",
          },
          dominanceRulers: {
            name: "Domination sur les Dirigeants",
            description: "Recherche de faveur et d'influence auprès des figures d'autorité",
          },
          worksJudges: {
            name: "Travaux sur les Juges et Leaders",
            description: "Pratiques liées à l'obtention de faveur dans les affaires juridiques ou de leadership",
          },
          
          // Heure 3: Mercure - Apprentissage et communication
          learningStudy: {
            name: "Apprentissage et Étude",
            description: "Poursuites éducatives, étude et acquisition de connaissances",
          },
          communication: {
            name: "Communication",
            description: "Écriture, parole et toutes formes de communication",
          },
          tradeCommerce: {
            name: "Commerce et Négoce",
            description: "Affaires commerciales, négoce et activités commerciales",
          },
          
          // Heure 4: Lune - Voyages et travail émotionnel
          journeysTravel: {
            name: "Voyages et Déplacements",
            description: "Voyages physiques et spirituels, préparatifs de voyage",
          },
          waterWorks: {
            name: "Travaux d'Eau",
            description: "Activités liées à l'eau, purification et nettoyage",
          },
          emotionalMatters: {
            name: "Affaires Émotionnelles",
            description: "Travail avec les émotions, sentiments et états intérieurs",
          },
          
          // Heure 5: Saturne - Liaison et restriction
          bindingRestriction: {
            name: "Liaison et Restriction",
            description: "Pratiques pour lier, restreindre ou contenir les influences négatives",
          },
          protectionWork: {
            name: "Travail de Protection",
            description: "Établissement de protection spirituelle et de frontières",
          },
          marriageMatters: {
            name: "Affaires de Mariage",
            description: "Activités liées au mariage et aux partenariats (à éviter pendant Saturne)",
          },
          joyfulWorks: {
            name: "Travaux Joyeux",
            description: "Célébrations et activités joyeuses (à éviter pendant Saturne)",
          },
          
          // Heure 6: Jupiter - Expansion et bénédictions
          seekingFavor: {
            name: "Recherche de Faveur",
            description: "Demande de bénédictions, faveurs et assistance divine",
          },
          wealthExpansion: {
            name: "Richesse et Expansion",
            description: "Pratiques pour l'abondance, la prospérité et la croissance",
          },
          religiousMatters: {
            name: "Affaires Religieuses",
            description: "Pratiques spirituelles, adoration et activités religieuses",
          },
          
          // Heure 7: Mars - Courage et conflit
          courageStrength: {
            name: "Courage et Force",
            description: "Construction de force intérieure, courage et détermination",
          },
          conflictResolution: {
            name: "Résolution de Conflits",
            description: "Gestion des conflits et confrontations",
          },
          peacefulNegotiations: {
            name: "Négociations Pacifiques",
            description: "Activités de pacification et diplomatiques (à éviter pendant Mars)",
          },
          
          // Heure 8: Soleil (retour) - Autorité et leadership
          authorityLeadership: {
            name: "Autorité et Leadership",
            description: "Questions d'autorité, de leadership et de gouvernance",
          },
          honorsRecognition: {
            name: "Honneurs et Reconnaissance",
            description: "Recherche de reconnaissance, d'honneurs et d'acknowledgment public",
          },
          
          // Heure 9: Vénus (retour) - Amour et beauté
          loveAttraction: {
            name: "Amour et Attraction",
            description: "Questions d'amour, d'affection et d'attraction",
          },
          beautyArts: {
            name: "Beauté et Arts",
            description: "Poursuites artistiques, beauté et questions esthétiques",
          },
          harmonyPeace: {
            name: "Harmonie et Paix",
            description: "Création d'harmonie, de paix et de conditions agréables",
          },
          
          // Heure 10: Mercure (retour) - Écriture et contrats
          writingDocumentation: {
            name: "Écriture et Documentation",
            description: "Activités d'écriture, d'enregistrement et de documentation",
          },
          contractsAgreements: {
            name: "Contrats et Accords",
            description: "Contrats légaux, accords et arrangements formels",
          },
          intellectualPursuits: {
            name: "Poursuites Intellectuelles",
            description: "Travail mental, recherche et activités intellectuelles",
          },
          
          // Heure 11: Lune (retour) - Rêves et intuition
          dreamsVisions: {
            name: "Rêves et Visions",
            description: "Travail avec les rêves, visions et insights spirituels",
          },
          intuitionWork: {
            name: "Travail d'Intuition",
            description: "Développement et suivi de l'intuition et de la guidance intérieure",
          },
          feminineMatters: {
            name: "Affaires Féminines",
            description: "Activités liées à l'énergie féminine et aux préoccupations des femmes",
          },
          
          // Heure 12: Saturne (retour) - Fins et profondeur
          endingsClosures: {
            name: "Fins et Clôtures",
            description: "Complétion de cycles, fins et apport de clôture",
          },
          deepMeditation: {
            name: "Méditation Profonde",
            description: "Méditation profonde, contemplation et travail intérieur",
          },
          ancestralWork: {
            name: "Travail Ancestral",
            description: "Connexion avec les ancêtres et la lignée",
          },
          newBeginnings: {
            name: "Nouveaux Débuts",
            description: "Démarrage de nouvelles entreprises (à éviter pendant la dernière heure de Saturne)",
          },
        },
      },
      
      // Noms Divins et Correspondances Planétaires
      divineNamesPlanetary: {
        title: "Noms Divins & Heures Planétaires",
        subtitle: "Correspondances classiques entre les Noms Divins et le timing céleste",
        
        // Significations des Noms Divins
        names: {
          alQawiyy: { meaning: "Le Très-Fort" },
          alQahhar: { meaning: "Le Dominateur" },
          alWadud: { meaning: "Le Très-Aimant" },
          asSabur: { meaning: "Le Patient" },
          arRazzaq: { meaning: "Le Pourvoyeur" },
          alHakim: { meaning: "Le Très-Sage" },
          alAlim: { meaning: "L'Omniscient" },
          asSami: { meaning: "L'Audient" },
          alHadi: { meaning: "Le Guide" },
          anNur: { meaning: "La Lumière" },
          alLatif: { meaning: "Le Subtil" },
          alJamil: { meaning: "Le Beau" },
          alHafiz: { meaning: "Le Préservateur" },
          alMuqaddim: { meaning: "Celui qui Avance" },
          arRahman: { meaning: "Le Tout-Miséricordieux" },
          arRahim: { meaning: "Le Très-Miséricordieux" },
          alMalik: { meaning: "Le Roi" },
          alMumin: { meaning: "Le Garant de la Sécurité" },
          alWahhab: { meaning: "Le Donateur" },
          alKabir: { meaning: "Le Grand" },
          alMujib: { meaning: "Celui qui Répond" },
          alWajid: { meaning: "Celui qui Trouve" },
          alMughni: { meaning: "L'Enrichisseur" },
          alMuakhkhir: { meaning: "Celui qui Retarde" },
          alHalim: { meaning: "Le Clément" },
          alHaqq: { meaning: "La Vérité" },
          alHadi2: { meaning: "Le Guide (variante)" },
        },
        
        // Bienfaits (clés de traduction)
        benefits: {
          // Mars/Force
          overcomingObstacles: "Surmonter les obstacles",
          physicalStrength: "Force physique et spirituelle",
          protectionFromWeakness: "Protection contre la faiblesse",
          authorityInDealings: "Autorité dans les affaires",
          overcomingOppression: "Surmonter l'oppression",
          breakingBadHabits: "Briser les mauvaises habitudes",
          dominanceOverNafs: "Domination du nafs inférieur",
          protectionFromEnemies: "Protection contre les ennemis",
          
          // Vénus/Amour
          increasingLove: "Augmenter l'amour entre les gens",
          marriageHarmony: "Harmonie conjugale et relationnelle",
          softeningHearts: "Adoucir les cœurs",
          acceptancePopularity: "Acceptation et popularité",
          patience: "Cultiver la patience",
          endurance: "Développer l'endurance",
          emotionalStability: "Stabilité émotionnelle",
          peacefulResolution: "Résolution pacifique",
          
          // Jupiter/Expansion
          provision: "Provision divine",
          abundance: "Abondance et prospérité",
          sustenance: "Subsistance sous toutes formes",
          blessingsInWealth: "Bénédictions dans la richesse",
          wisdom: "Sagesse et discernement",
          soundJudgment: "Jugement sain",
          understanding: "Compréhension profonde",
          guidedDecisions: "Décisions guidées divinement",
          
          // Mercure/Connaissance
          knowledge: "Connaissance et apprentissage",
          learning: "Capacité d'apprentissage accrue",
          memory: "Mémoire améliorée",
          answeredPrayers: "Prières exaucées",
          beingHeard: "Être entendu et compris",
          communication: "Communication claire",
          receptivity: "Réceptivité à la guidance",
          
          // Soleil/Guidance
          guidance: "Guidance divine",
          clarity: "Clarté mentale et spirituelle",
          rightPath: "Marcher sur le droit chemin",
          spiritualDirection: "Direction spirituelle",
          spiritualLight: "Lumière spirituelle et illumination",
          illumination: "Illumination intérieure",
          insightClarity: "Insight et clarté",
          removingDarkness: "Élimination des ténèbres spirituelles",
          
          // Lune/Intuition
          gentleness: "Douceur de caractère",
          subtlety: "Subtilité et raffinement",
          easeInDifficulty: "Facilité dans les situations difficiles",
          refinedManners: "Manières raffinées",
          beauty: "Beauté sous toutes ses formes",
          innerBeauty: "Beauté intérieure et grâce",
          beautifulCharacter: "Beau caractère",
          aestheticSense: "Sens esthétique",
          
          // Saturne/Protection
          protection: "Protection divine",
          preservation: "Préservation du mal",
          safetyGuarding: "Sécurité et garde",
          shieldingFromHarm: "Protection contre le mal",
          advancement: "Avancement en rang",
          priority: "Priorité dans les affaires",
          precedence: "Préséance sur les autres",
          timingAlignment: "Alignement parfait du timing",
          
          // Bienfaits additionnels
          mercy: "Miséricorde divine",
          compassion: "Compassion pour toute la création",
          divineGrace: "Grâce divine",
          universalBeneficence: "Bienfaisance universelle",
          specificMercy: "Miséricorde divine spécifique",
          forgiveness: "Pardon des péchés",
          lovingKindness: "Bienveillance aimante",
          compassionateHeart: "Cœur compatissant",
          sovereignty: "Souveraineté sur les affaires",
          kingship: "Royauté spirituelle",
          authority: "Autorité juste",
          leadership: "Leadership par le service",
          faith: "Renforcement de la foi",
          security: "Sécurité intérieure",
          trust: "Confiance en le Divin",
          innerPeace: "Paix intérieure et tranquillité",
          generosity: "Générosité d'esprit",
          gifts: "Dons divins",
          blessings: "Bénédictions abondantes",
          abundantGiving: "Don abondant",
          greatness: "Grandeur spirituelle",
          magnitude: "Magnitude de vision",
          majesty: "Majesté divine",
          awe: "Crainte spirituelle",
          responsiveness: "Réactivité divine",
          openDoors: "Ouverture de portes",
          acceptance: "Acceptation des prières",
          finding: "Trouver ce qui est perdu",
          discovery: "Découverte de la vérité",
          attainment: "Atteinte des objectifs",
          fulfillment: "Accomplissement spirituel",
          enrichment: "Enrichissement spirituel",
          sufficiency: "Autosuffisance",
          independence: "Indépendance de la création",
          contentment: "Contentement avec la provision",
          delay: "Retard bénéfique",
          postponement: "Report sage",
          timingControl: "Contrôle du timing",
          forbearance: "Indulgence envers les autres",
          clemency: "Clémence et miséricorde",
          truth: "Manifestation de la vérité",
          reality: "Compréhension de la réalité",
          justice: "Justice divine",
          authenticity: "Authenticité de l'être",
          direction: "Direction claire",
          spiritualGuidance: "Guidance spirituelle complète",
        },
      },
      
      // Prayer Adhkar Database
      prayerAdhkar: {
        title: "Adhkar de prière",
        subtitle: "Invocations authentiques après les cinq prières quotidiennes",
        
        // Prayer names
        prayers: {
          Fajr: "Fajr",
          Dhuhr: "Dhuhr",
          Asr: "Asr",
          Maghrib: "Maghrib",
          Isha: "Isha",
        },
        
        // Tradition names
        traditions: {
          Shadhili: "Tradition Shadhili",
          Tijani: "Tradition Tijani",
          Qadiri: "Tradition Qadiri",
          Naqshbandi: "Tradition Naqshbandi",
          WestAfricanScholarly: "Tradition savante ouest-africaine",
        },
        
        // Benefits of Sunnah adhkar and classical practices
        benefits: {
          glorificationPurification: "Glorification et purification du cœur",
          gratitudeContentment: "Gratitude et contentement en toutes circonstances",
          magnificationReverence: "Magnification et révérence de la Majesté Divine",
          protectionUntilNext: "Protection jusqu'à la prochaine prière ; garde contre le mal",
          tawhidAffirmationMorning: "Affirmation du tawhid ; protection du matin au soir",
          protectionEvilEye: "Protection contre le mauvais œil, la magie et l'envie",
          protectionWhispersShaytan: "Protection contre les murmures de shaytan et les mauvaises pensées",
          morningProtection: "Protection matinale et reconnaissance de la souveraineté divine",
          paradiseGuarantee: "Garantie du Paradis si récité sincèrement le matin",
          spiritualIllumination: "Illumination spirituelle à l'aube ; clarté du cœur et de l'esprit",
          trustProvision: "Confiance en la providence divine pour la journée",
          strengtheningTrials: "Renforcement contre les épreuves ; trésor du Paradis",
          tawhidEquivalent: "Affirmation du tawhid ; équivalent à un tiers du Coran",
          protectionEvil: "Protection contre le mal et les préjudices",
          protectionWhispers: "Protection contre les murmures et les mauvaises pensées",
          forgivenessSeaFoam: "Pardon des péchés même s'ils sont nombreux comme l'écume de la mer",
          vitalityMidday: "Vitalité et subsistance à midi ; renouveau spirituel",
          openingProvision: "Ouverture de la provision et de la subsistance",
          forgivenessEvenFled: "Pardon des péchés même si on a fui le combat",
          gentlenessDifficulties: "Douceur dans les difficultés ; résolution de problèmes complexes",
          strengthCompleteDay: "Force pour terminer la journée ; surmonter les obstacles",
          tawhidAffirmationEvening: "Affirmation du tawhid ; protection du soir au matin",
          eveningProtection: "Protection du soir et reconnaissance de la souveraineté divine",
          beautificationCharacter: "Embellissement du caractère ; rayonnement spirituel au coucher du soleil",
          concealmentFaults: "Dissimulation des fautes ; protection divine contre l'exposition",
          increasingLoveHearts: "Augmentation de l'amour dans les cœurs ; harmonie dans les relations",
          remembranceSleep: "Rappel avant le sommeil ; soumission à la volonté divine",
          comprehensiveProtection: "Protection complète contre les maux mondains et spirituels",
          protectionNight: "Protection toute la nuit ; gardiennage pendant le sommeil",
          peacefulSleep: "Sommeil paisible ; tranquillité du cœur et de l'esprit",
          securityFear: "Sécurité contre la peur ; protection contre les angoisses nocturnes",
          tawhidAffirmation: "Affirmation du tawhid",
        },
        
        // Planetary connection descriptions
        planetaryConnections: {
          sunFajr: "Soleil - Les heures de Fajr gouvernées par la lumière céleste",
          mercuryProvision: "Mercure - Planète de la provision et de la subsistance",
          sunPeak: "Soleil - Pic d'énergie solaire à Dhuhr",
          jupiterAbundance: "Jupiter - Planète d'expansion et d'abondance",
          venusGentleness: "Vénus - Planète de douceur et d'harmonie",
          venusBeauty: "Vénus - Planète de beauté et d'harmonie",
          moonConcealment: "Lune - Planète de dissimulation et de protection",
          saturnProtection: "Saturne - Planète de protection et de préservation",
          moonNight: "Lune - Planète de la nuit et du repos paisible",
          saturnSecurity: "Saturne - Planète de sécurité et de limites",
        },
        
        // UI labels
        labels: {
          sunnahAdhkar: "Adhkar Sunnah",
          classicalPractices: "Pratiques classiques",
          count: "Nombre",
          times: "{count} fois",
          benefit: "Bienfait",
          source: "Source",
          tradition: "Tradition",
          planetaryConnection: "Connexion planétaire",
          arabic: "Arabe",
          transliteration: "Translittération",
          translation: "Traduction",
          afterPrayer: "Après la prière de {prayer}",
          completed: "Terminé",
          remaining: "{count} restant",
        },
      },
      
      // Daily Guidance Details Screen  
      dailyGuidanceDetails: {
        title: "Énergie du Jour",
        sections: {
          dayRuler: "Planète du jour",
          dailyWindow: "Fenêtre quotidienne",
          elementalHarmony: "Harmonie élémentaire",
          manazil: "Manāzil (demeure lunaire)",
          bestFor: "Idéal pour",
          whyThis: "Pourquoi?",
          ascendantLens: "Prisme de l’Ascendant",
        },

        ascendant: {
          title: "Ascendant (signe levant)",
          summary: "Votre Ascendant est {sign} (ton {element}). Il décrit votre manière d’entrer en action et d’aborder la journée.",
          elementHints: {
            fire: "Ascendant Feu : démarrez avec courage et élan — mais évitez de vous précipiter.",
            water: "Ascendant Eau : avancez avec douceur et intuition — mais évitez d’absorber tout.",
            air: "Ascendant Air : avancez par la clarté et la communication — mais évitez la dispersion.",
            earth: "Ascendant Terre : avancez avec structure et patience — mais évitez la rigidité.",
          },
          blend: {
            harmonious: "Aujourd’hui soutient naturellement votre ton d’Ascendant — restez simple et constant.",
            complementary: "Aujourd’hui complète votre ton d’Ascendant — avancez posément et exprimez vos intentions.",
            transformative: "Aujourd’hui met votre ton d’Ascendant à l’épreuve — ralentissez et choisissez une seule priorité.",
            neutral: "Aujourd’hui est équilibré avec votre ton d’Ascendant — laissez votre intention régler le rythme.",
          },
        },
        manazil: {
          title: "Votre signature lunaire",
          baseline: "Base : n°{index} — {name}",
          hint: "C’est une signature stable dérivée de votre date de naissance. Utilisez-la comme un prisme supplémentaire, en complément de la guidance du jour.",
          missing: "Complétez votre profil (date de naissance) pour débloquer votre Manāzil de base.",
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
        // Sous-titres des sections pliables pour une meilleure UX
        collapsible: {
          personalizedInsights: "Analyse personnalisée",
          planetaryDetails: "Répartition détaillée",
          lunarGuidance: "Énergie lunaire ce soir",
          yourPersonalFilter: "Votre filtre personnel",
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

    // Énergie du Jour (clés partagées)
    dailyEnergy: {
      // Statut classique du jour (distinct de "Time" pour l'alignement horaire)
      status: {
        favorable: "Jour Favorable",
        neutral: "Jour Équilibré",
        cautious: "Jour Prudent",
      },
      planets: {
        sun: "Soleil",
        moon: "Lune",
        mercury: "Mercure",
        venus: "Vénus",
        mars: "Mars",
        jupiter: "Jupiter",
        saturn: "Saturne",
      },
      planetaryStrength: {
        title: "Force planétaire",
        dataUnavailableTitle: "Données indisponibles",
        unableToLoadData: "Impossible de charger la force planétaire pour le moment.",
        todaysEnergy: "Énergie du jour",
        rulerLabel: "Maître",
        bestWork: "Idéal pour le travail",
        bestReflection: "Idéal pour la réflexion",
        watchOut: "À surveiller",
        todaysOverallEnergy: "Énergie globale du jour",
        averageOfAll: "Moyenne de toutes les planètes",
        todaysRuler: "Maître du jour",
        quality: "Qualité",
        impactOnDaily: "Impact sur la journée",
        points: "{value} pts",
        recommendedHours: "Heures recommandées",
        detailedAnalysis: "Analyse détaillée",
        degreeStrength: "Force du degré",
        dignityLabel: "Dignité",
        qualities: {
          excellent: "Excellente",
          good: "Bonne",
          moderate: "Modérée",
          weak: "Faible",
        },
        rulerAdvice: {
          veryStrong: "{planet} est fortement soutenu aujourd’hui — agissez avec clarté et confiance.",
          strong: "{planet} soutient un progrès régulier — avancez avec intention.",
          moderate: "{planet} est équilibré aujourd’hui — restez simple et constant.",
          weak: "{planet} est sous tension aujourd’hui — ralentissez et simplifiez.",
          veryWeak: "{planet} est fortement challengé aujourd’hui — privilégiez la patience et de petits objectifs.",
        },
      },
      guidance: {
        title: "Recommandations",
        cautions: "Prudences",
        useStrongHours: "Utilisez les heures fortes de {planet} ({percent}%) pour les tâches importantes.",
        useStrongHoursSpiritual: "Utilisez les heures fortes de {planet} ({percent}%) pour la pratique spirituelle.",
        avoidWeakHours: "Évitez les heures de {planet} et {planet2} si possible.",
      },
      breakdown: {
        todaysRuler: {
          degreeEarly: "Début ({degree}°) : l’influence se forme encore.",
          degreeGaining: "En montée ({degree}°) : l’élan se construit.",
          degreePeak: "Sommet ({degree}°) : expression la plus forte.",
          degreeWeakening: "En baisse ({degree}°) : privilégiez la finalisation.",
          dignityOwn: "Domicile : stable et fiable.",
          dignityExalted: "Exaltation : soutenu et élevé.",
          dignityDetriment: "Exil : friction et résultats mixtes.",
          dignityFall: "Chute : énergie atténuée — allez doucement.",
          dignityNeutral: "Neutre : ton équilibré.",
          combust: "Combustion : affaibli par la proximité du Soleil.",
          beams: "Sous les rayons : clarté réduite.",
          clear: "Clair : non affecté par le Soleil.",
          retrograde: "Rétrograde : mieux pour révision et travail intérieur.",
        },
      },
      // Carte du Jugement Planétaire
      planetaryJudgment: {
        title: "Jugement Planétaire",
        cosmicVerdict: "VERDICT COSMIQUE DU JOUR",
        status: {
          supportive: "Jour Favorable",
          neutral: "Jour Neutre",
          cautious: "Jour Prudent",
        },
        classicalTerms: {
          supportive: "Bénéfique",
          neutral: "Neutre",
          cautious: "Maléfique",
        },
        intro: "Aujourd'hui est régi par {planet}.",
        rulerTone: {
          sun: "Le Soleil apporte vitalité, leadership et expression de soi. Un jour pour la confiance et la visibilité.",
          moon: "La Lune gouverne les émotions, l'intuition et le soin. Un jour pour le travail intérieur et la famille.",
          mars: "Mars énergise l'action, le courage et la compétition. Un jour pour les mouvements audacieux mais attention aux conflits.",
          mercury: "Mercure régit la communication, l'apprentissage et le commerce. Un jour pour l'étude et la négociation.",
          jupiter: "Jupiter élargit les opportunités, la sagesse et la bonne fortune. Un jour pour la croissance et la générosité.",
          venus: "Vénus apporte harmonie, beauté et relations. Un jour pour l'amour et l'esthétique.",
          saturn: "Saturne exige discipline, structure et patience. Un jour pour compléter les travaux à long terme.",
        },
        phaseModifier: {
          amplify: "La Lune croissante amplifie l'énergie du jour—saisissez l'élan.",
          soften: "La Lune décroissante adoucit l'intensité—réfléchissez avant d'agir.",
          neutral: "La Lune est en transition—équilibrez action et contemplation.",
        },
        bestForLabel: "Idéal Pour",
        avoidLabel: "À Éviter",
        disclaimer: "Guidance classique basée sur la maîtrise planétaire. Votre thème personnel peut modifier ces influences.",
        bestFor: {
          sun: {
            0: "Leadership et prise de responsabilités",
            1: "Présentations publiques et visibilité",
            2: "Auto-expression et créativité",
          },
          moon: {
            0: "Guérison émotionnelle et réflexion",
            1: "Temps en famille et soins",
            2: "Décisions intuitives",
          },
          mars: {
            0: "Entraînement physique et athlétisme",
            1: "Lancer des initiatives audacieuses",
            2: "Activités compétitives",
          },
          mercury: {
            0: "Écriture et communication",
            1: "Apprentissage et étude",
            2: "Négociations commerciales",
          },
          jupiter: {
            0: "Opportunités d'expansion et croissance",
            1: "Enseignement et apprentissage",
            2: "Voyage et études philosophiques",
          },
          venus: {
            0: "Construction de relations",
            1: "Travail créatif et artistique",
            2: "Beauté et esthétique",
          },
          saturn: {
            0: "Achèvement de projets à long terme",
            1: "Construction de structures et systèmes",
            2: "Travail de discipline et concentration",
          },
        },
        avoid: {
          sun: {
            0: "Rôles soumis",
            1: "Travail de soutien en arrière-plan",
            2: "Auto-dépréciation",
          },
          moon: {
            0: "Confrontation agressive",
            1: "Décisions purement logiques",
            2: "Suppression émotionnelle",
          },
          mars: {
            0: "Négociations délicates",
            1: "Conversations émotionnelles",
            2: "Tâches nécessitant patience",
          },
          mercury: {
            0: "Décisions émotionnelles",
            1: "Travail physique intense",
            2: "Engagements long terme sans analyse",
          },
          jupiter: {
            0: "Surengagement",
            1: "Expansion imprudente",
            2: "Ignorer les détails pratiques",
          },
          venus: {
            0: "Action agressive",
            1: "Critique sévère",
            2: "Confrontation",
          },
          saturn: {
            0: "Décisions spontanées",
            1: "Lancer de nouveaux projets créatifs",
            2: "Activités de loisirs sociaux",
          },
        },
      },
      scope: {
        day: "Maître du Jour",
      },
      alignmentOverview: {
        title: "Aperçu de l'alignement",
        dayRulerLabel: "Maître du jour",
        yourRulerLabel: "Votre maître",
        elementsLabel: "Éléments",
        elementHarmony: "Harmonie élémentaire",
        planetHarmony: "Harmonie planétaire",
        verdict: {
          excellent: "Excellent alignement aujourd'hui.",
          good: "Bon alignement aujourd'hui.",
          moderate: "Alignement mitigé aujourd'hui.",
          challenging: "Alignement difficile aujourd'hui.",
        },
      },

      spiritualPractice: {
        title: "Pratique spirituelle recommandée",
        recommendedTodayTitle: "Recommandé aujourd'hui",
        betterToWaitForTitle: "Mieux vaut attendre",

        items: {
          grounding: "Restez ancré : routines simples, nourriture saine, souffle régulier.",
          protection: "Protégez le cœur : demandez refuge, gardez les ablutions si possible, évitez l'agitation.",
          repentance: "Revenez avec douceur : istighfār, réparer les torts, langue surveillée.",
          discipline: "Choisissez la discipline plutôt que l'impulsion : terminez le nécessaire, laissez le superflu.",
          silence: "Réduisez parole et bruit : traversez la journée avec dignité et retenue.",

          supportiveDhikr: "Dhikr doux avec présence : que la langue suive le cœur.",
          openingDua: "Faites duʿāʾ avec bonne espérance : guidance, facilité, juste action.",
          goodIntention: "Fixez une intention claire : bénéfice sans excès, commencez avec adab.",
          charity: "Donnez une petite aumône : elle ouvre les portes sans nourrir l'ego.",
          reconciliation: "Réparez les liens et adoucissez la dureté : une petite bonté pèse lourd.",

          cleanIntention: "Gardez des intentions propres et modestes : faites le sûr, laissez le douteux.",
          modestDhikr: "Dhikr court et constant : un peu avec sincérité vaut mieux que beaucoup sans.",
          fulfillDuties: "Accomplissez d'abord les devoirs : prière à l'heure, obligations avant les surérogatoires.",
          shortDua: "Un duʿāʾ bref au début et à la fin de votre journée.",
          gratitude: "Pratiquez la gratitude en silence : nommez les bienfaits, ne poursuivez pas l'absent.",

          controlledCaution: "Si vous ressentez l'appel à plus, gardez-le bref et contenu — évitez l'excès.",
        },

        matchItems: {
          sun: "Une pratique brève pour la clarté et l'intention noble — sans orgueil.",
          moon: "Une pratique brève pour la miséricorde et le calme intérieur — sans se noyer dans l'émotion.",
          mercury: "Une pratique brève pour la compréhension et la parole vraie — sans agitation.",
          venus: "Une pratique brève pour l'harmonie et la douceur — sans indulgence.",
          mars: "Une pratique brève pour le courage avec retenue — sans colère ni précipitation.",
          jupiter: "Une pratique brève pour la sagesse et l'ouverture du خير — sans débordement.",
          saturn: "Une pratique brève pour la patience et la constance — sans dureté du cœur.",
        },

        waitItems: {
          loveAttraction: "Affection et attraction — plutôt {days}.",
          expansionBigAsks: "Grandes demandes et ouvertures expansives — plutôt {days}.",
          deepEmotionalOpening: "Ouvertures émotionnelles profondes — plutôt {days}.",
          hardConfrontation: "Confrontation dure — plutôt {days} si nécessaire.",
          overStrictVows: "Vœux trop stricts et charges auto-imposées — plutôt {days}.",
          heavyEmotionalWork: "Travail émotionnel lourd — plutôt {days}.",
          bigExpansion: "Grandes expansions et engagements risqués — plutôt {days}.",
        },
      },
      // En-têtes de section (Système narratif)
      todaysRuler: "PLANÈTE DU JOUR",
      yourPlanet: "VOTRE PLANÈTE DE NAISSANCE",
      todaysAlignment: "ALIGNEMENT DU JOUR",
      lunarInfluence: "INFLUENCE LUNAIRE",
      whatThisMeans: "Ce que cela signifie pour vous",
      excellentForToday: "Excellent pour aujourd'hui",
      lessFavorable: "Moins favorable",
      bestForToday: "Meilleur pour aujourd'hui",
      currentTransit: "Transit actuel",
      peakHours: "Heures de pointe",
      transitIn: "En {sign}{dignity}",

      // Descriptions des jours
      dayEnergy: {
        expansion: "expansion, sagesse et croissance",
        action: "action, courage et mouvement décisif",
        communication: "communication, apprentissage et commerce",
        love: "amour, beauté et harmonie",
        discipline: "discipline, structure et maîtrise",
        vitality: "vitalité, leadership et pouvoir personnel",
        intuition: "émotions, intuition et soin",
      },

      // Facteurs d'alignement
      factors: {
        planetaryFriendship: "Amitié planétaire",
        elementalHarmony: "Harmonie élémentaire",
        dailyStrength: "Force quotidienne",
      },

      // Relations
      friendship: {
        strongFriends: "Amis forts",
        friends: "Amis",
        neutral: "Neutre",
        tension: "Tension",
      },

      // Templates de synthèse
      synthesis: {
        excellent: "Excellente énergie {day}! Le jour de {day} avec {quality} s'harmonise magnifiquement avec votre nature {user}-{element}. {lunar}. Aujourd'hui favorise {activities}.",
        good: "Bonne énergie {day}. Le {quality} de {day} fonctionne bien avec votre nature {user}-{element}. {lunar}. Favorable pour {activities}.",
        moderate: "Énergie {day} équilibrée. Le {quality} de {day} offre un soutien stable. {lunar}. Bon pour {activities}.",
        challenging: "Énergie {day} réflexive. Le {quality} de {day} invite à une navigation prudente. {lunar}. Mieux pour {activities}.",
      },

      // Phases lunaires
      lunarPhase: {
        waxing: "La lune croissante ajoute un élan de construction",
        waning: "La lune décroissante favorise le relâchement et l'achèvement",
        full: "La pleine lune amplifie toutes les énergies",
        new: "La nouvelle lune offre de nouveaux départs",
      },

      // Labels de force
      strengthLabels: {
        veryStrong: "Très fort",
        strong: "Fort",
        moderate: "Modéré",
        weak: "Faible",
        veryWeak: "Très faible",
      },

      // Labels de source
      sourceLabels: {
        fromName: "Du nom + nom de la mère",
        fromBirthChart: "De la carte natale",
        default: "Par défaut (Soleil)",
      },
    },

    // Analyse de force planétaire
    planetaryStrengthAnalysis: {
      labels: {
        power: "Puissance",
        calculationBreakdown: "Détail du calcul",
        degree: "Degré",
        dignity: "Dignité",
        combustion: "Proximité du Soleil",
      },
      statuses: {
        degreeWeak: "Faible",
        degreeModerate: "Modérée",
        degreeStrong: "Forte",
        degreeWeakening: "En baisse",
        dignityDomicile: "Domicile",
        dignityExalted: "Exaltation",
        dignityDetriment: "Exil",
        dignityFall: "Chute",
        dignityNeutral: "Neutre",
        combustionClear: "Clair",
        combustionBeams: "Sous les rayons",
        combustionCombust: "Combustion",
      },
      formula: {
        retrograde: "Modificateur rétrograde : {percent}% de la puissance normale",
        finalPower: "Puissance finale : {value}%",
      },
      cards: {
        degreePosition: "Position en degré",
        essentialDignity: "Dignité essentielle",
        sunProximity: "Proximité du Soleil",
        retrogradeMotion: "Mouvement rétrograde",
      },
      sections: {
        challengesTitle: "Défis",
        recommendationsTitle: "Recommandations",
      },
      suitability: {
        outerWork: "Travail extérieur",
        innerWork: "Travail intérieur",
        limitedOuterWork: "Travail extérieur limité",
      },
    },

    // Écrans
    screens: {
      // Écran de Transit Planétaire (Système 1 - Long terme)
      planetTransit: {
        title: "Transit Planétaire",
        headerSubtitle: "Long terme",
        explanation: "Indique où se trouve une planète dans le zodiaque — sa position à long terme qui change sur des semaines, des mois ou des années.",
        personalizedNote: "Personnalisé à votre nature élémentaire",
        practices: {
          title: "Pratiques Planétaires Spécifiques",
          minutesShort: "min",
          divineNames: {
            title: "Noms Divins",
            description: "Noms divins recommandés pour l'énergie de {planet}",
            forCategory: "Pour {category}",
            repetitionsLabel: "Répétitions:",
            purposeLabel: "🎯 Objectif",
            durationLabel: "Durée:",
            categories: {
              protection: "Protection",
              influence: "Influence",
              clarity: "Clarté",
              prayer: "Prière",
              dignity: "Dignité",
              leadership: "Leadership",
              justice: "Justice",
              career: "Carrière",
            },
            purposes: {
              jupiter: {
                protection: "Protection divine et tutelle",
                taskheer: "Attirer la faveur, adoucir les cœurs (Taskhīr)",
                accounting: "Comptabilité divine, tenir registre",
                ijaba: "Exaucement des invocations (Ijābah)",
                haiba: "Inspirer le respect, présence digne (Haybah)",
                leadership: "Force dans le leadership, croissance personnelle",
                rights: "Rétablir le respect, récupérer ses droits",
                career: "Renforcer sa fonction, établir une position solide",
              },
            },
            howTo: {
              label: "💡 Comment Pratiquer",
              step1: "Faire wuḍūʾ et faire face à la Qiblah",
              step2: "S'asseoir dans un espace calme",
              step3: "Définir l'intention pour {category}",
              step4: "Réciter avec concentration",
              step5: "Utiliser un tasbih pour compter",
            },
            actions: {
              startPractice: "Commencer",
              setReminder: "Rappel",
            },
          },
        },
        summary: {
          bestNow: "Les plus fortes maintenant",
          weakNow: "Les plus faibles maintenant",
        },
        
        currentTransit: "Transit Actuel",
        timeScale: "Long terme (semaines/mois)",
        in: "en",
        signProgress: "Progression dans le signe",
        degreeInSign: "Degré dans le signe",
        
        retrograde: "Rétrograde",
        retrogradeArabic: "راجع",
        nearingChange: "Changement de signe imminent",
        
        duration: {
          title: "Durée du Transit",
          enteredSign: "Entré dans le signe",
          leavesSign: "Quitte le signe",
          total: "Durée",
        },
        durationStats: {
          elapsed: "Écoulé",
          remaining: "Restant",
          total: "Total",
        },
        timeline: {
          now: "Maintenant",
        },
        
        dataSource: {
          title: "Source de Données",
          api: "NASA JPL Horizons (Éphémérides)",
          cached: "Données éphémérides en cache",
          lastUpdated: "Dernière mise à jour",
        },
        
        spiritualQuality: {
          title: "Qualité Spirituelle",
          saad: "Sa'd (سَعْد) — Propice",
          nahs: "Naḥs (نَحْس) — Difficile",
        },
        
        meaning: {
          title: "Thème & Signification",
        },
        
        resonance: {
          title: "Résonance avec Votre Nature",
          description: "Comment ce transit interagit avec votre élément {{element}} :",
          levels: {
            strong: "Fort",
            harmonious: "Harmonieux",
            neutral: "Neutre",
            growth: "Croissance",
            challenge: "Défi",
          },
          arabicTerms: {
            harmonious: "سَكِينَة",
            supportive: "تَوَافُق",
            neutral: "تَوَازُن",
            challenging: "تَحَوُّل",
          },
          context: "Basé sur les relations élémentaires dans l'astrologie spirituelle traditionnelle.",
        },
        quickImpact: {
          title: "Impact Immédiat",
          subtitle: "Comment cela se ressent pour vous",
        },
        why: {
          title: "Pourquoi cela se ressent ainsi",
          body: "Ce transit mélange votre nature élémentaire avec le ton du signe, influençant la communication, l’humeur et l’élan du jour.",
          show: "Pourquoi cela se ressent ainsi",
          hide: "Masquer les détails",
        },
        focus: {
          title: "Focus du jour",
          communication: "Communication",
          patience: "Patience",
          reflection: "Réflexion",
        },
        
        classicalWisdom: {
          title: "Sagesse Classique",
          arabicTradition: "De la Tradition Astronomique Arabe",
        },
        degree: {
          title: "Position dans le Signe",
          explanation: "{{degree}} sur 30° (~{{percent}}% de ce signe).",
          phases: {
            early: "Début (0-10°)",
            middle: "Milieu (10-20°)",
            late: "Fin (20-30°)",
          },
        },
        dignity: {
          title: "Analyse de dignité",
          state: "État",
          baseModifier: "Modificateur de base",
          degreeModifier: "Modificateur du degré",
          finalStrength: "Force finale",
          whatThisMeans: "Ce que cela signifie",
          suitableFor: "Favorable pour",
          avoid: "À éviter",
          betterTiming: "Meilleur timing",
          states: {
            sharaf: "Exaltation (Sharaf)",
            bayt: "Domicile (Bayt)",
            qubul: "Neutre (Qubūl)",
            wabal: "Exil (Wabāl)",
            hubut: "Chute (Hubūṭ)",
          },
          explanations: {
            sharaf: "La planète est exaltée : ses qualités sont élevées et soutenues, rendant l’action plus efficace.",
            bayt: "La planète est en domicile : son influence s’exprime avec stabilité et fiabilité.",
            qubul: "Placement neutre : ni fortement soutenu, ni fortement contrarié.",
            wabal: "Placement difficile : friction possible, avancez avec prudence et limites claires.",
            hubut: "Chute : énergie atténuée ; patience et objectifs plus doux aident.",
          },
        },
        dignityGuidance: {
          generic: {
            sharaf: {
              whatThisMeans: "Avec {planet} exalté en {sign}, l’élan est favorable. Agissez avec clarté et intention.",
              suitableFor: {
                1: "Leadership et visibilité",
                2: "Conversations et engagements importants",
                3: "Lancer des initiatives",
              },
              avoid: {
                1: "Excès de confiance ou précipitation",
                2: "Forcer les résultats",
              },
              betterTiming: {
                1: "Agissez quand l’esprit est clair et l’intention propre",
                2: "Choisissez des engagements délimités",
              },
            },
            bayt: {
              whatThisMeans: "Avec {planet} en domicile en {sign}, l’influence est stable. Construisez dans la durée.",
              suitableFor: {
                1: "Travail soutenu et discipline",
                2: "Routines et plans à long terme",
                3: "Organisation et consolidation",
              },
              avoid: {
                1: "Manquer de structure",
                2: "Surcharger l’agenda",
              },
              betterTiming: {
                1: "Petits pas constants",
                2: "Suivre un plan et mesurer les progrès",
              },
            },
            qubul: {
              whatThisMeans: "Avec {planet} neutre en {sign}, les résultats dépendent surtout des choix. Restez simple.",
              suitableFor: {
                1: "Tâches quotidiennes",
                2: "Tester avant de s’engager",
                3: "Réflexion et ajustements",
              },
              avoid: {
                1: "Attendre un grand “push”",
                2: "Complexifier les décisions",
              },
              betterTiming: {
                1: "Clarifier les priorités d’abord",
                2: "Avancer à un rythme mesuré",
              },
            },
            wabal: {
              whatThisMeans: "Avec {planet} en exil en {sign}, la friction est possible. Progressez avec retenue et limites.",
              suitableFor: {
                1: "Revoir et simplifier",
                2: "Planifier sans enjeu majeur",
                3: "Travail intérieur et patience",
              },
              avoid: {
                1: "Décisions sous pression",
                2: "Escalader les conflits",
              },
              betterTiming: {
                1: "Attendre des signaux plus clairs",
                2: "Réduire les engagements",
              },
            },
            hubut: {
              whatThisMeans: "Avec {planet} en chute en {sign}, l’énergie peut être faible. Visez petit et protégez l’attention.",
              suitableFor: {
                1: "Repos et récupération",
                2: "Petites victoires",
                3: "Prière et routines",
              },
              avoid: {
                1: "Se surmener",
                2: "Exiger des résultats rapides",
              },
              betterTiming: {
                1: "Reporter les lancements si possible",
                2: "Se concentrer sur l’essentiel",
              },
            },
          },
        },
        personalized: {
          title: "Impact Personnalisé",
          lead: "En tant que nature {{element}} avec {{sign}}, ce transit façonne votre énergie et votre expression.",
          point1: "Votre profondeur naturelle rencontre un ton plus expressif et visible.",
          point2: "La communication peut sembler plus rapide ou directe.",
          point3: "Utilisez vos forces élémentaires pour équilibrer le rythme et le ton.",
        },

        context: {
          title: {
            personal: "Transit Personnel",
            collective: "Météo Cosmique",
          },
          desc: {
            personal: "Cette planète traverse votre signe — ses thèmes tendent à se manifester plus personnellement dans vos choix et votre rythme quotidien.",
            collective: "Pas dans votre signe — lisez-le comme une météo collective. Voir ci-dessous ce que cela met en avant et comment cela peut vous atteindre.",
          },
        },

        lens: {
          badge: {
            personal: "Lecture du transit personnel",
            collective: "Lecture du transit collectif",
          },
          sections: {
            about: "À propos de ce transit",
            collective: "Influence collective",
            resonance: "Comment cela vous atteint",
            degree: "Phase de degrés",
          },
          collectiveTemplate: "Quand {{planet}} est en {{sign}}, cela met en avant {{theme}}. C’est la “météo” collective que tout le monde ressent à sa manière.",
          resonanceBase: {
            personal: "Comme il s’agit d’un transit personnel (dans votre signe), ces thèmes ont tendance à se manifester plus directement dans vos choix et votre rythme.",
            collective: "Même si ce n’est pas dans votre signe, vous pouvez le ressentir indirectement via une pression extérieure, un changement de rythme, plus de responsabilités ou des délais.",
          },
          degreePhases: {
            early: "Phase d’installation : l’influence se met en place — évitez les décisions trop tranchées.",
            middle: "Phase stable : une construction patiente est favorisée — mieux vaut la mesure que la précipitation.",
            late: "Phase de clôture : privilégiez la finition plutôt que l’initiation — terminez avant de relancer.",
          },
          planetFunction: {
            sun: "Le Soleil gouverne l’autorité, la vitalité, la clarté et le sens.",
            moon: "La Lune gouverne les humeurs, la mémoire, la protection et les rythmes du quotidien.",
            mercury: "Mercure gouverne la parole, les échanges, l’apprentissage et la circulation de l’information.",
            venus: "Vénus gouverne l’harmonie, l’affection, la beauté et la douceur des relations.",
            mars: "Mars gouverne l’élan, le conflit, le courage et l’action décisive.",
            jupiter: "Jupiter gouverne la croissance, la sagesse, la générosité et l’expansion.",
            saturn: "Saturne gouverne la structure, les limites, la responsabilité, le temps et l’endurance.",
          },
          signThemes: {
            aries: "l’initiative, le leadership et les commencements courageux",
            taurus: "la stabilité, les ressources et la construction patiente",
            gemini: "la communication, l’apprentissage et les échanges rapides",
            cancer: "le foyer, la protection et la sécurité émotionnelle",
            leo: "la visibilité, l’autorité et la confiance créative",
            virgo: "les détails, la santé et l’amélioration pratique",
            libra: "l’équilibre, les accords et les dynamiques relationnelles",
            scorpio: "la profondeur, les limites et la pression transformatrice",
            sagittarius: "les croyances, l’exploration et le sens plus large",
            capricorn: "le devoir, les institutions et la structure à long terme",
            aquarius: "la communauté, l’innovation et les systèmes collectifs",
            pisces: "la compassion, la sensibilité et la dissolution des anciennes formes",
          },
          elementTails: {
            water: "La nature Eau l’absorbe souvent en silence plutôt que dans la confrontation.",
            fire: "La nature Feu le ressent souvent comme une urgence — canalisez-la dans une action claire.",
            earth: "La nature Terre cherche souvent la structure — les routines stables aident.",
            air: "La nature Air le ressent souvent mentalement — clarifiez vos priorités pour éviter la dispersion.",
          },
        },
        daily: {
          title: "Conseils du Jour",
          morning: "Ce matin",
          morningText: "Ancrez vos intentions avant une communication audacieuse.",
          afternoon: "Cet après-midi",
          afternoonText: "Canalisez la confiance créative tout en restant sensible.",
          evening: "Ce soir",
          eveningText: "Adoucissez l’intensité et ressourcez-vous calmement.",
        },
        signComparison: {
          title: "Votre Signe vs Signe du Transit",
          yourSign: "Votre signe",
          transitSign: "Signe du transit",
          insight: "Les contrastes peuvent créer une croissance puissante quand ils sont équilibrés.",
        },
        balancing: {
          title: "Comment Équilibrer Cette Énergie",
          subtitle: "Méthodes classiques des sciences spirituelles islamiques",
          methodsLabel: "Remèdes Classiques",
          repetitions: "Répétitions",
          bestTime: "Meilleur moment",
          startCounter: "Commencer le compteur",
          source: "Source",
          challenge: "La nature {userElement} rencontre l’énergie {transitElement} — appliquez les remèdes ci‑dessous pour plus de stabilité.",
          disclaimer: "Pratiques traditionnelles pour la réflexion et l’équilibre.",
          methods: {
            latif: {
              title: "Réciter Al‑Laṭīf",
              titleArabic: "اللَّطِيف",
              instruction: "Traditionnellement récité pour adoucir les oppositions. Dites : “Yā Laṭīf”.",
              numerology: "Valeur abjad : 129 (ل=30, ط=9, ي=10, ف=80)",
              bestTime: "Après Fajr ou durant l’heure de Jupiter",
              source: "Pratique de dhikr classique",
            },
            halim: {
              title: "Réciter Al‑Ḥalīm",
              titleArabic: "الحَلِيم",
              instruction: "Traditionnellement récité pour la patience. Dites : “Yā Ḥalīm”.",
              numerology: "Valeur abjad : 88 (ح=8, ل=30, ي=10, م=40)",
              bestTime: "Quand vous sentez l’agitation",
              source: "Pratique spirituelle classique",
            },
            hajah: {
              title: "Ṣalāt al‑Ḥājah",
              titleArabic: "صلاة الحاجة",
              instruction: "Effectuez la Prière du Besoin (2 rakʿahs) en demandant l’apaisement.",
              bestTime: "Dernier tiers de la nuit",
              source: "Tradition prophétique",
            },
            letters: {
              title: "Méditation des lettres",
              titleArabic: "تأمل الحروف المتوازنة",
              instruction: "Contemplez les lettres م et ن comme symbole d’équilibre. Écrivez‑les doucement et méditez.",
              bestTime: "Lors d’un conflit intérieur",
              source: "ʿIlm al‑Ḥurūf traditionnel",
            },
            mubin: {
              title: "Réciter Al‑Mubīn",
              titleArabic: "المُبِين",
              instruction: "Traditionnellement récité pour la clarté. Dites : “Yā Mubīn”.",
              numerology: "Valeur abjad : 102 (م=40, ب=2, ي=10, ن=50)",
              bestTime: "Après ʿAṣr",
              source: "Pratique soufie classique",
            },
            shukr: {
              title: "Dhikr de gratitude",
              titleArabic: "ذِكر الشُكر",
              instruction: "Récitez “Alḥamdu lillāh” pour renforcer l’harmonie.",
              bestTime: "Tout au long de la journée",
              source: "Encouragement coranique (14:7)",
            },
            hakim: {
              title: "Réciter Al‑Ḥakīm",
              titleArabic: "الحَكِيم",
              instruction: "Traditionnellement récité pour un jugement équilibré. Dites : “Yā Ḥakīm”.",
              numerology: "Valeur abjad : 78 (ح=8, ك=20, ي=10, م=40)",
              bestTime: "Mercredi durant l’heure de Mercure",
              source: "ʿIlm al‑Ḥurūf traditionnel",
            },
            istighfar: {
              title: "Istighfār",
              titleArabic: "الاستغفار",
              instruction: "Récitez “Astaghfirullāh al‑ʿAẓīm” pour purifier le cœur et renouveler l’intention.",
              bestTime: "Avant l’aube (Saḥar)",
              source: "Tradition prophétique",
            },
            salawat: {
              title: "Ṣalawāt sur le Prophète",
              titleArabic: "الصلاة على النبي",
              instruction: "Récitez : “Allāhumma ṣalli ʿalā Muḥammad” pour la barakah et l’équilibre.",
              bestTime: "Vendredi et après les prières",
              source: "Commandement coranique (33:56)",
            },
          },
        },
        // Pratique Spirituelle (Cadre Classique basé sur les Degrés)
        spiritual: {
          title: "Pratique Spirituelle",
          phaseLabel: {
            entry: "Entrée",
            strength: "Actif",
            exit: "Sortie",
          },
          status: {
            entry: "L'influence se forme. Concentrez-vous sur la purification, pas l'action.",
            strength: "Ce transit est à pleine puissance. Le travail spirituel est soutenu.",
            exit: "L'influence s'estompe. Sceller et protéger, ne pas initier.",
          },
          guidance: {
            entry: "Concentrez-vous sur l'istighfār et le dhikr général (lā ilāha illa Llāh). Évitez de lier des intentions ou de commencer des travaux spirituels majeurs.",
            strength: "Meilleur moment pour le dhikr ciblé et le duʿāʾ. Focus spirituel : ${focusText}",
            exit: "Scellez ce qui a été commencé. Concentrez-vous sur le dhikr protecteur, les ṣalawāt et la gratitude. Évitez les nouvelles initiatives spirituelles.",
          },
          focus: {
            sun: "Tawḥīd, but et clarté d'intention",
            moon: "Équilibre émotionnel et intuition",
            mercury: "Connaissance, parole et apprentissage",
            venus: "Harmonie, amour et beauté",
            mars: "Courage, discipline, couper les obstacles",
            jupiter: "Expansion, rizq et sagesse",
            saturn: "Patience, endurance, réparation karmique",
          },
          avoid: {
            sun: "Inflation de l'ego, arrogance",
            moon: "Décisions dictées par l'humeur",
            mercury: "Commérage, suranalyse",
            venus: "Excès de plaisir, attachement",
            mars: "Colère, impulsivité",
            jupiter: "Arrogance, excès",
            saturn: "Travaux lourds sans guidance, désespoir",
          },
          recommendedDhikr: "Dhikr Recommandé",
          entryNote: "En phase d'entrée, concentrez-vous sur le dhikr général comme lā ilāha illa Llāh",
          exitNote: "En phase de sortie, concentrez-vous sur le dhikr protecteur et les ṣalawāt",
          disclaimer: "Pour réflexion, pas prescription. Basé sur la tradition ésotérique islamique classique.",
        },
        // ─────────────────────────────────────────────────────────────────────
        // PRATIQUE SPIRITUELLE AMÉLIORÉE (Niveaux de Dhikr + Timing Heure Planétaire)
        // Système classique ʿAdad avec optimisation du timing
        // ─────────────────────────────────────────────────────────────────────
        practice: {
          title: "Pratique Spirituelle",
          phase: {
            entry: "Entrée",
            strength: "Actif",
            exit: "Sortie",
          },
          counts: {
            title: "Nombre Recommandé",
            tier: {
              quick: "Rapide",
              standard: "Standard",
              deep: "Approfondi",
            },
            estimate: "~{minutes} min",
          },
          timing: {
            title: "Meilleur Moment",
            nextPlanetHour: "Prochaine heure de {planet} : {start}–{end}",
            in: "dans {time}",
            tomorrow: "Demain",
            activeNow: "Actif maintenant jusqu'à {end}",
            unavailable: "Données d'heure planétaire indisponibles",
          },
          strength: {
            peak: "Pic",
            strong: "Fort",
            supportive: "Favorable",
            gentle: "Doux",
          },
          fallback: {
            title: "Si vous ne pouvez pas attendre",
            afterPrayer: "Faites le niveau Rapide après la prochaine prière.",
          },
          disclaimer: "Pour réflexion, pas prescription. Basé sur la tradition ésotérique islamique classique.",
        },
        history: {
          title: "Historique du Transit",
          previous: "Signe précédent",
          next: "Signe suivant",
          estimated: "Estimé",
          current: "Vous êtes ici",
        },
      },
      
      // Écran d'Alignement du Moment (Système 3 - Horaire)
      momentAlignment: {
        title: "Alignement du Moment",
        headerSubtitle: "Heure Actuelle",
        explanation: "Indique l'heure planétaire active (change tout au long de la journée) et comment elle interagit avec votre nature spirituelle.",
        
        currentHour: "Heure Actuelle",
        hourNumber: "Heure {{current}} de {{total}}",
        nextChange: "Prochain changement",
        
        transitContext: {
          title: "Contexte de Transit (Long terme)",
          description: "Au-delà de l'énergie horaire, voici où se trouve cette planète dans le zodiaque à long terme :",
          planetIn: "{{planet}} est en {{sign}} ({{signArabic}})",
          viewDetails: "Voir les détails complets du transit",
        },

        currentHourPlanet: {
          title: "Planète de l’Heure Actuelle",
          subtitle: "Règne sur ce moment",
          viewAllPlanets: "Voir les 7 planètes",
        },
      },
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
      playAudio: "Écouter l'Audio",
      pauseAudio: "Mettre en Pause",
      reciter: "Récitateur: Mishary Alafasy",
      audioLoading: "Chargement de l'audio...",
    },
    
    // Moment Alignment Detail
    momentDetail: {
      title: "Alignement du Moment",
      noName: "Aucun Nom Défini",
      addNameMessage: "Ajoutez votre nom dans Destinée du Nom pour débloquer l'alignement du moment.",
      goToNameDestiny: "Aller à Destinée du Nom",
      updated: "Mis à jour",
      zahirOutward: "Nom + Mère (Personnel)",
      hourQuality: "Qualité de l'heure",
      whyThisStatus: "Pourquoi ce statut ?",
      guidanceTitle: "Guidance",
      bestNow: "Favorable pour :",
      avoidNow: "Éviter pour l'instant :",
      disclaimer: "Pour réflexion seulement • Pas une règle",

      cards: {
        currentHour: "Heure Actuelle",
        yourPlanet: "Votre Planète",
        transitConditions: "Conditions de Transit",
        alignmentAnalysis: "Analyse d'Alignement",
        whatThisMeans: "Ce Que Cela Signifie",
        excellentFor: "Excellent Pour",
        avoidNow: "À Éviter Maintenant",
        showTimeline: "Afficher la Chronologie",
        hourEndsIn: "L'heure se termine dans",
        nextHour: "Prochaine Heure",

        status: {
          act: "Agir",
          maintain: "Maintenir",
          hold: "Attendre",
          act_desc: "Conditions favorables — agissez avec intention",
          maintain_desc: "Conditions favorables — progressez régulièrement",
          hold_desc: "Conditions difficiles — attendez un meilleur timing",
        },

        transit: {
          dignity: "Dignité",
          house: "Maison",
          strength: "Puissance de l'heure actuelle",
          overallNote: "Transit global de {planet} : {quality}. Appuyez pour les détails →",
          positionalPower: "Puissance Positionnelle",
          positionalSubtext: "Basée sur la position de la maison et la dignité (pour agir maintenant)",
          transitQuality: "Qualité du Transit",
          transitQualitySubtext: "Force planétaire globale (correspond à votre nature)",
          explanation: "La puissance positionnelle est {positional}, tandis que la qualité du transit est {quality}",
          viewFullAnalysis: "Voir l'analyse complète du transit de {planet} →",
          angular: "Angulaire",
          succedent: "Succédent",
          cadent: "Cadent",
          house_10_angular: "Maison 10 - Carrière et Statut",
          exceptional: "Exceptionnel",
          strong: "Fort",
          moderate: "Modéré",
          weak: "Faible",
        },

        analysis: {
          planetaryFriendship: "Amitié Planétaire",
          planetaryResonance: "Résonance Planétaire",
          samePlanet: "Même Planète",
          highIntensity: "Intensité élevée",
          elementalHarmony: "Harmonie Élémentaire",
          transitStrength: "Puissance de l'heure actuelle",
          strong: "Fort",
          moderate: "Modéré",
          weak: "Faible",
          exceptional: "Exceptionnel",
        },

        source: {
          nameMotherPersonal: "Source : Nom + Mère (Personnel)",
          birthChart: "Source : Thème Natal",
        },
      },

      authenticTiming: {
        title: "Timing Authentique",
        hourRuler: "Force du maître de l'heure",
        elemental: "Relation élémentaire",
        opening: "Conseils pour l'heure de {planet} (réflexion seulement).",
        nextHour: "Prochaine heure : {planet} commence dans {minutes}m.",

        timingAnalysisTitle: "Analyse du timing",
        planetaryConditionsTitle: "Conditions planétaires",
        dignityLabel: "Dignité",
        positionLabel: "Position zodiacale",
        strengthLabel: "Condition",
        interpretationLabel: "Interprétation",
        whyThisStatusTitle: "Pourquoi ce statut ?",
        showDetails: "Afficher les détails",
        hideDetails: "Masquer les détails",
        noEnhancements: "Aucune amélioration spécifique suggérée pour l'instant.",
        noCautions: "Aucune prudence signalée pour ce moment.",
        recommendedLabel: "Recommandé",
        cautionsLabel: "Précautions",
        personalPlanetLabel: "Votre planète",
        personalElementLabel: "Votre élément",
        factors: {
          elementCompatibility: "Harmonie élémentaire",
          planetaryResonance: "Résonance planétaire",
          manazilAlignment: "Alignement des Manāzil",
          practiceMapping: "Correspondance de pratique",
        },
      },

      currentHour: {
        endsIn: "Se termine dans {minutes}m",
      },
      
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
        zahir: "Personnel",
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
          bullet1: "Votre élément personnel correspond parfaitement à l'élément de l'heure—alignement naturel.",
          bullet2: "Cela crée un flux pour initier, communiquer et décider.",
          bullet3: "La fenêtre d'alignement dure cette heure planétaire ; observez comment elle évolue.",
        },
        maintain: {
          bullet1: "Votre élément personnel est compatible avec l'élément de l'heure—conditions favorables.",
          bullet2: "Bon pour un progrès régulier et le suivi sans forcer.",
          bullet3: "Maintenez un effort calme ; l'alignement change chaque heure.",
        },
        hold: {
          bullet1: "Votre élément personnel contraste avec l'élément de l'heure—suggère un rythme plus doux.",
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

      // Heure de naissance (optionnel)
      birthTime: {
        title: "Heure de naissance (optionnel)",
        subtitle: "Utilisée pour calculer votre Ascendant (signe levant)",
        selectPlaceholder: "Sélectionnez votre heure de naissance",
        clear: "Effacer l'heure",
      },

      // Lieu de naissance (optionnel)
      birthLocation: {
        title: "Lieu de naissance (optionnel)",
        subtitle: "Utilisé pour calculer votre Ascendant (signe levant)",
        label: "Lieu de naissance",
        placeholder: "Ville, Pays (optionnel)",
        latitude: "Latitude",
        longitude: "Longitude",
        editCoordinates: "Modifier les coordonnées",
        clear: "Effacer le lieu de naissance",
        hint: "Entrez les coordonnées de votre lieu de naissance, ou utilisez l'icône de localisation pour remplir depuis votre position actuelle.",
      },
      
      // Profil astrologique
      astro: {
        title: "Votre profil astrologique",
        sign: "Burj (signe)",
        element: "Élément",
        ascendant: "Ascendant",
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
        title: "Localisation actuelle (optionnel)",
        subtitle: "Pour des heures de prière précises et des calculs de timing",
        label: "Localisation actuelle",
        placeholder: "Rechercher une ville ou un pays",
        autoDetect: "Tapez pour rechercher, ou touchez l'icône pour détecter automatiquement",
        clear: "Effacer la localisation actuelle",
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

      // Réinitialisation du mot de passe
      resetPasswordTitle: "Réinitialiser le mot de passe",
      resetPasswordSubtitle: "Définissez un nouveau mot de passe pour votre compte.",
      updatePasswordButton: "Mettre à jour le mot de passe",
      
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

    // Asrariya Practice Timing
    asrariya: {
      title: "Timing des Pratiques",
      subtitle: "Trouvez Vos Fenêtres Spirituelles Optimales",
      selectPractice: "Sélectionnez une Pratique",
      currentTiming: "Analyse du Timing Actuel",
      noProfile: "Complétez votre profil pour obtenir un timing personnalisé",
      practices: {
        protection: "Protection",
        protectionDesc: "Protégez-vous des dangers spirituels et physiques",
        healing: "Guérison",
        healingDesc: "Restaurez l'harmonie du corps, de l'esprit et de l'âme",
        manifestation: "Manifestation",
        manifestationDesc: "Réalisez vos intentions",
        guidance: "Guidance",
        guidanceDesc: "Cherchez direction et clarté sur votre chemin",
        gratitude: "Gratitude",
        gratitudeDesc: "Exprimez reconnaissance et appréciation",
        knowledge: "Connaissance",
        knowledgeDesc: "Poursuivez l'apprentissage et la compréhension",
        provision: "Provision",
        provisionDesc: "Recherchez subsistance et abondance",
        general: "Pratique Générale",
        generalDesc: "Développement spirituel équilibré",
      },
      timing: {
        optimal: "Optimal",
        favorable: "Favorable",
        moderate: "Modéré",
        challenging: "Difficile",
        avoid: "Éviter",
      },
      layers: {
        element: "Compatibilité Élémentaire",
        planetary: "Résonance Planétaire",
        manazil: "Mansion Lunaire",
        practice: "Alignement de Pratique",
      },
      recommendation: "Recommandation",
      overallScore: "Score Global",
      personalizedFor: "Personnalisé pour votre profil spirituel",
      analyzing: "Analyse du timing...",
      timingAnalysis: "Analyse du Timing Pour Vous",
      overallTimingQualityTitle: "QUALITÉ GLOBALE DU TIMING",
      overallTimingQualityHint: "Combine tous les facteurs spirituels pour ce moment",
      optimalUntil: "Fenêtre optimale jusqu'à",
      errors: {
        unableToCalculateTiming: "Impossible de calculer le timing",
        unableToLoadAnalysis: "Impossible de charger l'analyse",
      },
      whyThisRating: "Pourquoi Cette Évaluation ?",
      breakdown: {
        rulingPlanetStrength: "Force de la planète gouvernante",
        rulingPlanetStrengthDesc: "La compatibilité entre votre planète gouvernante et le maître du jour (30% de la résonance planétaire, intégrée au score global)",
        todaysRulerTitle: "Maître du jour ({planet})",
        todaysRulerFallback: "Maître du jour",
        todaysRulerStrong: "{planet}{arabic} est très forte aujourd'hui. Excellente énergie globale pour toutes les activités liées à {planet}.",
        todaysRulerGood: "{planet}{arabic} a une bonne force aujourd'hui. Énergie favorable pour le travail de {planet}.",
        todaysRulerModerate: "{planet}{arabic} a une force modérée aujourd'hui. Procédez avec attention pour les activités de {planet}.",
        todaysRulerWeak: "{planet}{arabic} est faible aujourd'hui. Envisagez d'autres jours pour un travail majeur de {planet}.",
        todaysRulerVeryWeak: "{planet}{arabic} est très faible aujourd'hui. Évitez les décisions ou travaux majeurs de {planet}.",
      },
      whatThisMeans: "Ce Que Cela Signifie Pour Vous",
      recommended: "Recommandé Maintenant",
      cautions: "Soyez Attentif À",
      betterTiming: "Meilleur Moment",
    },
    
    // Unified Timing Badges
    timing: {
      compatible: "Compatible",
      ratings: {
        excellent: "MOMENT EXCELLENT",
        good: "BON MOMENT",
        moderate: "PROCÉDEZ AVEC ATTENTION",
        weak: "PROCÉDEZ AVEC PRUDENCE",
        unfavorable: "MOMENT DÉFAVORABLE",
      },

      shortDescriptions: {
        veryStrong: "Heure de {planet} très forte",
        strong: "Heure de {planet} forte",
        moderate: "Heure de {planet} modérée",
        weak: "Heure de {planet} faible",
        veryWeak: "Heure de {planet} très faible",

        perfectAlignment: "Alignement parfait",
        supportiveFlow: "Flux favorable",
        neutral: "Énergie neutre",
        minorTension: "Légère tension élémentaire",
      },

      guidance: {
        recommended: "Recommandé :",
        goodFor: "Bon pour :",
        approach: "Approche :",
        avoid: "À éviter :",
        betterTiming: "Meilleur timing :",
      },
      badges: {
        optimal: {
          label: "Moment Excellent",
          action: "Excellent moment — procédez avec confiance",
          description: "C'est l'une de vos meilleures fenêtres. Tous les facteurs s'alignent magnifiquement.",
          hint: "Excellent alignement — procédez avec confiance",
        },
        act: {
          label: "Bon Moment",
          action: "Bon moment — agissez",
          description: "Des conditions favorables soutiennent votre pratique. Avancez avec intention.",
          hint: "Conditions favorables — agissez avec intention",
        },
        maintain: {
          label: "Procédez avec Attention",
          action: "Praticable — restez attentif",
          description: "Ce timing est praticable mais demande de l'attention. Une certaine tension existe.",
          hint: "Timing praticable — maintenez l'équilibre",
        },
        careful: {
          label: "Procédez avec Prudence",
          action: "Difficile — procédez seulement si nécessaire",
          description: "Ce n'est pas votre moment naturel. Si vous devez continuer, ajoutez des pratiques d'ancrage.",
          hint: "Énergies difficiles — procédez avec prudence",
        },
        hold: {
          label: "Moment Défavorable",
          action: "Mieux vaut attendre — voir alternatives",
          description: "Facteurs fortement opposés. Sauf urgence, attendez une meilleure fenêtre.",
          hint: "Attendez un meilleur moment",
        },
      },
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
        birth: {
          title: "Profil de Naissance",
          subtitle: "Date • Heure • Lieu",
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
          // Power Days by Element
          powerDay: {
            fire: "Mardi (Mars) et Dimanche (Soleil)",
            water: "Lundi (Lune) et Vendredi (Vénus)",
            air: "Mercredi (Mercure)",
            earth: "Jeudi (Jupiter) et Samedi (Saturne)",
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
    
    // Disclaimer (extended)
    disclaimerFull: {
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
      // Noms arabes (cosmologie islamique classique)
      fireArabic: "نار",
      waterArabic: "ماء",
      airArabic: "هواء",
      earthArabic: "تراب",
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

        lens: {
          badge: {
            personal: "عدسة العبور الشخصي",
            collective: "عدسة العبور العام",
          },
          sections: {
            about: "عن هذا العبور",
            collective: "الأثر العام",
            resonance: "كيف يصل إليك",
            degree: "مرحلة الدرجة",
          },
          collectiveTemplate: "عندما يكون {{planet}} في {{sign}}، يبرز معنى {{theme}}. هذا يصف “الطقس” العام الذي يلمسه الجميع بطرق مختلفة.",
          resonanceBase: {
            personal: "لأنه عبور شخصي (يمس برجك مباشرة)، تميل هذه المعاني إلى الظهور بشكل أوضح في قراراتك وإيقاعك اليومي.",
            collective: "حتى لو لم يكن في برجك، قد تشعر به عبر ضغط خارجي، تغيّر في الإيقاع، مسؤوليات إضافية، أو تأخير في النتائج.",
          },
          degreePhases: {
            early: "مرحلة التثبيت: الأثر يدخل ويتشكل — يُفضَّل تجنّب القرارات الحاسمة الآن.",
            middle: "مرحلة مستقرة: يمكن البناء بهدوء — الانضباط أوضح نفعًا من العجلة.",
            late: "مرحلة ختامية: ركّز على الإتمام لا البدء — أغلق الملفات قبل فتح أخرى.",
          },
          planetFunction: {
            sun: "الشمس تدل على السلطة والحيوية والوضوح والغاية.",
            moon: "القمر يدل على المزاج والذاكرة والتغذية وإيقاع الحياة اليومية.",
            mercury: "عطارد يدل على الكلام والتجارة والتعلّم وحركة المعلومات.",
            venus: "الزهرة تدل على الانسجام والمودة والجمال وسهولة العلاقات.",
            mars: "المريخ يدل على الاندفاع والصراع والشجاعة والحسم في الفعل.",
            jupiter: "المشتري يدل على النمو والحكمة والكرم والاتساع النافع.",
            saturn: "زحل يدل على البنية والحدود والمسؤولية والزمن والصبر.",
          },
          signThemes: {
            aries: "المبادرة والقيادة والبدايات الجريئة",
            taurus: "الثبات والموارد والبناء المتدرّج",
            gemini: "التواصل والتعلّم وسرعة التبادل",
            cancer: "البيت والحماية والأمان العاطفي",
            leo: "الظهور والهيبة والثقة الإبداعية",
            virgo: "التفاصيل والصحة والتحسين العملي",
            libra: "التوازن والاتفاقات وديناميات العلاقات",
            scorpio: "العمق والحدود والضغط التحويلي",
            sagittarius: "المعتقد والمعرفة والمعنى الأوسع",
            capricorn: "الواجب والمؤسسات والبنية بعيدة المدى",
            aquarius: "الجماعة والابتكار والأنظمة العامة",
            pisces: "الرحمة والحساسية وتفكك الأشكال القديمة",
          },
          elementTails: {
            water: "طبيعة الماء تمتص هذا غالبًا بهدوء لا بمواجهة.",
            fire: "طبيعة النار تشعر به كعجلة — وجّهه إلى فعلٍ واضح.",
            earth: "طبيعة التراب تميل إلى طلب البنية — تنفعها العادات الثابتة.",
            air: "طبيعة الهواء تشعر به ذهنيًا — سمِّ الأولويات لتخفيف التشتت.",
          },
        },
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
      hourAfterNext: "Heure après la suivante",
      hourNumber: "Heure #{number}",
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

      wording: {
        shared: {
          powerVsPermission: "La puissance n’est pas la permission : une heure forte peut amplifier le bien comme le tort.",
          samePlanetIntensity: "Si cette heure est gouvernée par votre planète, l’intensité augmente — agissez avec retenue.",
        },

        sun: {
          status: "Temps Rayonnant",
          meaning: "Visibilité, autorité et intention claire; ce qui commence se voit.",
          bestFor: [
            "Diriger et fixer une direction",
            "Affaires publiques et réputation",
            "Invocations pour la clarté et le but",
            "Honorer les anciens et l’autorité légitime",
          ],
          avoid: [
            "Orgueil et mise en scène",
            "Promettre trop",
            "Agir sans sincérité",
          ],
          note: "La puissance augmente; protégez le cœur de la vanité et de la dureté.",
        },

        moon: {
          status: "Temps Réfléchissant",
          meaning: "Courants réceptifs et changeants; propice au soin, à l’écoute et au retour.",
          bestFor: [
            "Purification et dévotion douce",
            "Soins du foyer, de la famille et des besoins",
            "Rêves, réflexion et duʿāʾ",
          ],
          avoid: [
            "Décisions irréversibles",
            "Vœux conclus dans la hâte",
          ],
          note: "La variabilité augmente; recherchez la stabilité et évitez les promesses hésitantes.",
        },

        mercury: {
          status: "Temps Mutable",
          meaning: "Mouvement de l’esprit et du message; échange rapide, artisanat et calcul.",
          bestFor: [
            "Étude, écriture et mémorisation",
            "Commerce, courses et courts déplacements",
            "Planification et résolution de problèmes",
            "Apprentissage des langues et des compétences",
          ],
          avoid: [
            "Bavardage et dispute inutile",
            "Accords hâtifs",
            "Tromperie et double discours",
          ],
          note: "La rapidité augmente; vérifiez les mots et gardez l’intention pure.",
        },

        venus: {
          status: "Temps Harmonieux",
          meaning: "Union, affection et beauté; les cœurs s’adoucissent et les manières se raffinent.",
          bestFor: [
            "Réconciliation et réparation des liens",
            "Art, parure et rencontres agréables",
            "Bonté, charité et dons",
            "Discussions de mariage et consentement mutuel",
          ],
          avoid: [
            "Indulgence et distraction",
            "Vanité",
            "Négliger les obligations",
          ],
          note: "L’aisance augmente; gardez la modestie et ne troquez pas le devoir contre le plaisir.",
        },

        mars: {
          status: "Temps Impérieux",
          meaning: "Chaleur, coupure et courage; l’action tranche vite et les conséquences suivent.",
          bestFor: [
            "Effort discipliné et entraînement",
            "Protection et garde des limites",
            "Action décisive avec retenue",
          ],
          avoid: [
            "Colère et querelles",
            "Risques imprudents",
            "Déclencher un conflit",
          ],
          note: "La force augmente; ne confondez pas puissance et permission.",
        },

        jupiter: {
          status: "Temps Expansif",
          meaning: "Accroissement, aisance et générosité; ouvertures dans le conseil et l’étude.",
          bestFor: [
            "Enseigner et rechercher la connaissance",
            "Conseil, médiation et planification sage",
            "Charité et élargir la subsistance",
            "Bons commencements avec gratitude",
          ],
          avoid: [
            "Arrogance",
            "Excès et gaspillage",
          ],
          note: "L’expansion augmente; gardez la gratitude et évitez l’enflure de l’ego.",
        },

        saturn: {
          status: "Temps Restrictif",
          meaning: "Contrainte, patience et endurance; ce qui se bâtit est lent et éprouvé.",
          bestFor: [
            "Travail long demandant de l’endurance",
            "Sobriété, repentir et retenue",
            "Planification, limites et structure",
            "Clore proprement ce qui doit se terminer",
          ],
          avoid: [
            "Hâte",
            "Commencer des plaisirs qui émoussent le cœur",
            "Dureté du cœur",
          ],
          note: "La restriction augmente; acceptez le rythme et gardez la miséricorde dans l’intention.",
        },
      },
    },

    // Moon Phase System
    moon: {
      phases: {
        new: "Nouvelle Lune",
        waxing_crescent: "Premier croissant (croissante)",
        first_quarter: "Premier quartier",
        waxing_gibbous: "Gibbeuse croissante",
        full: "Pleine Lune",
        waning_gibbous: "Gibbeuse décroissante",
        last_quarter: "Dernier quartier",
        waning_crescent: "Dernier croissant (décroissante)",
      },

      phasesArabic: {
        new: "المحاق",
        waxing_crescent: "الهلال المتزايد",
        first_quarter: "التربيع الأول",
        waxing_gibbous: "الأحدب المتزايد",
        full: "البدر",
        waning_gibbous: "الأحدب المتناقص",
        last_quarter: "التربيع الثاني",
        waning_crescent: "الهلال المتناقص",
      },

      new: {
        title: "Temps de repos et d’intention",
        description: "Comme l’heure la plus sombre avant l’aube, c’est un temps de calme, de réflexion, et de fixation d’intentions. Économisez votre énergie.",
        suitable: {
          category: "Pratique spirituelle",
          activity1: "Repos et restauration",
          activity2: "Contemplation profonde",
          activity3: "Travail intérieur",
          spiritual1: "Prières de nuit (Tahajjud)",
          spiritual2: "Tawbah (repentir)",
          spiritual3: "Jeûne",
        },
        notSuitable: {
          category: "Action extérieure",
          activity1: "Démarrer de nouveaux projets",
          activity2: "Lancements majeurs",
          activity3: "Accords d’affaires",
          reason: "La Lune sombre manque de lumière et d’élan pour les commencements extérieurs. Attendez le retour de la lumière.",
        },
      },

      waxing_crescent: {
        title: "Temps de nouveaux départs",
        description: "Comme une graine qui perce la terre, l’intention devient visible. La lumière croissante soutient le lancement, la mise en route et l’élan.",
        suitable: {
          category: "Croissance et nouveaux projets",
          activity1: "Démarrer une activité",
          activity2: "Nouvelles relations",
          activity3: "Apprendre de nouvelles compétences",
          activity4: "Projets créatifs",
          spiritual1: "Duʿāʾ pour l’augmentation",
          spiritual2: "Invocations (adhkār)",
          spiritual3: "Fixer des objectifs",
        },
        notSuitable: {
          category: "Fins et libération",
          activity1: "Grandes ruptures",
          activity2: "Dissipation/éloignement",
          activity3: "Couper les liens",
          reason: "La lumière croissante s’oppose au relâchement et à la clôture. La Lune veut bâtir, non diminuer.",
        },
      },

      first_quarter: {
        title: "Temps d’action et de croissance",
        description: "La Lune est à moitié éclairée et l’énergie monte. Agissez avec décision, traversez les obstacles et avancez avec confiance.",
        suitable: {
          category: "Défi et progression",
          activity1: "Agir sur les plans lancés",
          activity2: "Surmonter les obstacles",
          activity3: "Décisions importantes",
          activity4: "Activité physique",
          spiritual1: "Pratiques de protection",
          spiritual2: "Dhikr de force et de fermeté",
          spiritual3: "Travail de volonté",
        },
        notSuitable: {
          category: "Affaires délicates",
          activity1: "Négociations de paix",
          activity2: "Guérison douce",
          activity3: "Travail réceptif",
          reason: "La lumière croissante apporte tension et effort. Préférez le travail doux pendant la phase décroissante.",
        },
      },

      waxing_gibbous: {
        title: "Temps de raffinement",
        description: "Presque pleine, la lumière révèle ce qui demande ajustement. Idéal pour améliorer, affiner et préparer l’achèvement.",
        suitable: {
          category: "Manifestation et achèvement",
          activity1: "Terminer des projets",
          activity2: "Dernière poussée vers les objectifs",
          activity3: "Travail de manifestation",
          activity4: "Événements importants",
          spiritual1: "Pratiques de pleine Lune",
          spiritual2: "Intention et concrétisation",
          spiritual3: "Rituels d’énergie élevée",
        },
        notSuitable: {
          category: "Travail discret/caché",
          activity1: "Travail secret",
          activity2: "Réflexion silencieuse",
          activity3: "Pratiques cachées",
          reason: "La Lune presque pleine est brillante et exposée. Si la discrétion est nécessaire, choisissez une phase plus sombre.",
        },
      },

      full: {
        title: "Temps d’aboutissement",
        description: "Comme un arbre chargé de fruits mûrs, c’est un pic de manifestation. Célébrez, finalisez des jalons, et annoncez avec sagesse.",
        suitable: {
          category: "Culmination et guérison",
          activity1: "Travail de guérison",
          activity2: "Clarté et dévoilement",
          activity3: "Cérémonies d’achèvement",
          activity4: "Rassemblements",
          activity5: "Rituels de pleine Lune",
          spiritual1: "Prières de pleine Lune",
          spiritual2: "Rituels de guérison",
          spiritual3: "Pratiques communautaires",
          spiritual4: "Clarté de vision",
        },
        notSuitable: {
          category: "Nouveaux commencements",
          activity1: "Démarrer de nouveaux projets",
          activity2: "Introspection silencieuse",
          activity3: "Travail secret",
          reason: "L’énergie de la pleine Lune est extérieure et révélatrice. Pour commencer, préférez le croissant croissant.",
        },
      },

      waning_gibbous: {
        title: "Temps de gratitude et de partage",
        description: "La lumière décroît. Partagez ce que vous avez créé, remerciez pour ce qui a été reçu, et commencez à relâcher ce qui ne sert plus.",
        suitable: {
          category: "Achèvement et gratitude",
          activity1: "Finir des projets",
          activity2: "Exprimer la gratitude",
          activity3: "Enseigner/partager",
          activity4: "Organiser",
          spiritual1: "Pratiques de gratitude",
          spiritual2: "Shukr (remerciement)",
          spiritual3: "Travail de bénédiction",
          spiritual4: "Enseignement",
        },
        notSuitable: {
          category: "Grandes nouvelles entreprises",
          activity1: "Commencer de grands projets",
          activity2: "Initier des relations",
          activity3: "Nouveaux engagements",
          reason: "La Lune décroissante va vers la clôture. Les nouveaux départs appartiennent à la phase croissante.",
        },
      },

      last_quarter: {
        title: "Temps de libération et de nettoyage",
        description: "La moitié de la lumière demeure. Libérez activement ce qui freine, clarifiez, rompez d’anciens schémas, et faites place au nouveau.",
        suitable: {
          category: "Libération et purification",
          activity1: "Rompre des schémas négatifs",
          activity2: "Nettoyage",
          activity3: "Pardon",
          activity4: "Mettre fin avec respect",
          spiritual1: "Rituels de purification",
          spiritual2: "Pratiques de pardon",
          spiritual3: "Cérémonies de libération",
          spiritual4: "Travail de tawbah (repentir)",
        },
        notSuitable: {
          category: "Nouvelle croissance",
          activity1: "Démarrer de nouveaux projets",
          activity2: "Expansion",
          activity3: "Nouveaux engagements",
          reason: "L’énergie décroissante soutient la libération, non la croissance. Les nouveaux projets prospèrent pendant la phase croissante.",
        },
      },

      waning_crescent: {
        title: "Temps d’achèvement et d’abandon",
        description: "Le dernier filet de lumière. Terminez, fermez les boucles, pratiquez le pardon, et préparez le repos. Lâchez prise avec grâce.",
        suitable: {
          category: "Réflexion profonde",
          activity1: "Méditation",
          activity2: "Introspection",
          activity3: "Clôtures finales",
          activity4: "Retraite spirituelle",
          spiritual1: "Prières de nuit",
          spiritual2: "Dhikr profond",
          spiritual3: "Iʿtikāf (retraite)",
          spiritual4: "Jeûne",
        },
        notSuitable: {
          category: "Entreprises actives",
          activity1: "Commencer des projets",
          activity2: "Activités majeures",
          activity3: "Travail public",
          reason: "La Lune presque sombre appelle au repos. Attendez la nouvelle lumière pour commencer de nouvelles entreprises.",
        },
      },

      harmony: {
        waxing_active: "Alignement parfait ! La lumière croissante s’accorde avec l’énergie active de {{dayRuler}}. Bon timing pour initier et avancer.",
        waxing_active_rec: "Propice à l’action mesurée, aux débuts, et à l’élan.",

        waning_reflective: "Alignement parfait ! La lumière décroissante s’harmonise avec la nature réfléchie de {{dayRuler}}. Bon timing pour terminer et revenir vers l’intérieur.",
        waning_reflective_rec: "Concentrez-vous sur l’achèvement, le lâcher-prise, et le travail intérieur.",

        waxing_reflective: "Timing mixte. La Lune croissante veut construire, mais {{dayRuler}} appelle à la réflexion. Choisissez avec soin.",
        waxing_reflective_rec: "Préférez les projets doux et intérieurs; évitez l’agressivité.",

        waning_active: "Timing mixte. La Lune décroissante veut relâcher, mais {{dayRuler}} appelle à l’action. Avancez avec discernement.",
        waning_active_rec: "Finissez l’essentiel plutôt que de commencer trop de nouveau.",

        neutral: "Alignement modéré. La Lune et {{dayRuler}} donnent des conditions équilibrées.",
        neutral_rec: "Avancez avec attention; démarrer et terminer sont possibles avec mesure.",
      },

      ui: {
        lunarTiming: "Timing Lunaire",
        moonPhase: "Phase Lunaire",
        lunarDay: "Jour Lunaire",
        dayOfMonth: "Jour {{day}} sur 30",
        moonPower: "Puissance Lunaire",
        waxing: "Croissante (en croissance)",
        waning: "Décroissante (en diminution)",
        learnMore: "En savoir plus",
        fullGuide: "Guide lunaire complet",
        moonDayHarmony: "Harmonie Lune-Jour",
        perfectAlignment: "Alignement parfait",
        goodAlignment: "Bon alignement",
        neutralAlignment: "Alignement neutre",
        challengingAlignment: "Alignement difficile",
        suitableFor: "Meilleur pour",
        notSuitableFor: "À éviter",
        whyThisMatters: "Pourquoi cela compte",
        traditionalWisdom: "Sagesse traditionnelle",
        practicalExample: "Exemple pratique",
        spiritualGuidance: "Guidance spirituelle",
        rest: "Repos",
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
      // Noms arabes (astronomie islamique classique)
      sunArabic: "الشمس",
      moonArabic: "القمر",
      marsArabic: "المريخ",
      mercuryArabic: "عطارد",
      jupiterArabic: "المشتري",
      venusArabic: "الزهرة",
      saturnArabic: "زحل",
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
      // Noms arabes (astronomie islamique classique)
      ariesArabic: "الحمل",
      taurusArabic: "الثور",
      geminiArabic: "الجوزاء",
      cancerArabic: "السرطان",
      leoArabic: "الأسد",
      virgoArabic: "السنبلة",
      libraArabic: "الميزان",
      scorpioArabic: "العقرب",
      sagittariusArabic: "القوس",
      capricornArabic: "الجدي",
      aquariusArabic: "الدلو",
      piscesArabic: "الحوت",
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

      // الطاقة اليومية (مفاتيح مشتركة)
      dailyEnergy: {
        planets: {
          sun: "الشمس",
          moon: "القمر",
          mercury: "عطارد",
          venus: "الزهرة",
          mars: "المريخ",
          jupiter: "المشتري",
          saturn: "زحل",
        },
        planetaryStrength: {
          title: "قوة الكواكب",
          dataUnavailableTitle: "البيانات غير متاحة",
          unableToLoadData: "تعذّر تحميل بيانات قوة الكواكب الآن.",
          todaysEnergy: "طاقة اليوم",
          rulerLabel: "الحاكم",
          bestWork: "الأفضل للعمل",
          bestReflection: "الأفضل للتأمل",
          watchOut: "تنبيه",
          todaysOverallEnergy: "طاقة اليوم العامة",
          averageOfAll: "متوسط جميع الكواكب",
          todaysRuler: "حاكم اليوم",
          quality: "الجودة",
          impactOnDaily: "الأثر على اليوم",
          points: "{value} نقطة",
          recommendedHours: "الساعات الموصى بها",
          detailedAnalysis: "تحليل مفصّل",
          degreeStrength: "قوة الدرجة",
          dignityLabel: "المنزلة",
          qualities: {
            excellent: "ممتاز",
            good: "جيد",
            moderate: "متوسط",
          },
          rulerAdvice: {
            veryStrong: "{planet} مدعوم بقوة اليوم — تصرّف بوضوح وثقة.",
            strong: "{planet} يدعم تقدّمًا ثابتًا — تقدّم بنية واضحة.",
            moderate: "{planet} متوازن اليوم — أبقِ الخطوات بسيطة.",
            weak: "{planet} تحت ضغط — هدّئ الوتيرة وقلّل الالتزامات.",
            veryWeak: "{planet} مُتعب اليوم — قدّم الصبر والحماية وأهدافًا أصغر.",
          },
        },
        guidance: {
          title: "توصيات",
          cautions: "محاذير",
          useStrongHours: "استعمل ساعات {planet} القوية ({percent}%) للأمور المهمة.",
          useStrongHoursSpiritual: "استعمل ساعات {planet} القوية ({percent}%) للعمل الروحي.",
          avoidWeakHours: "تجنّب ساعات {planet} و{planet2} إن أمكن.",
        },
        breakdown: {
          todaysRuler: {
            degreeEarly: "بداية الدرجة ({degree}°): التأثير ما زال يتشكل.",
            degreeGaining: "يزداد قوة ({degree}°): الزخم يبنى.",
            degreePeak: "قمة القوة ({degree}°): أقوى تعبير.",
            degreeWeakening: "يتراجع ({degree}°): ركّز على الإتمام.",
            dignityOwn: "بيت: ثابت وموثوق.",
            dignityExalted: "شرف: مدعوم ومُعزَّز.",
            dignityDetriment: "وبال: احتكاك ونتائج مختلطة.",
            dignityFall: "هبوط: طاقة خافتة — كن لطيفًا.",
            dignityNeutral: "قبول: توازن.",
            combust: "احتراق: يضعف لقربه من الشمس.",
            beams: "تحت الشعاع: وضوح أقل.",
            clear: "سليم: غير متأثر بالشمس.",
            retrograde: "تراجع: أنسب للمراجعة والعمل الداخلي.",
          },
        },
      },

      planetaryStrengthAnalysis: {
        labels: {
          power: "القوة",
          calculationBreakdown: "تفصيل الحساب",
          degree: "الدرجة",
          dignity: "المنزلة",
          combustion: "قرب الشمس",
        },
        statuses: {
          degreeWeak: "ضعيف",
          degreeModerate: "متوسط",
          degreeStrong: "قوي",
          degreeWeakening: "يتراجع",
          dignityDomicile: "بيت",
          dignityExalted: "شرف",
          dignityDetriment: "وبال",
          dignityFall: "هبوط",
          dignityNeutral: "قبول",
          combustionClear: "سليم",
          combustionBeams: "تحت الشعاع",
          combustionCombust: "احتراق",
        },
        formula: {
          retrograde: "معامل التراجع: {percent}% من القوة المعتادة",
          finalPower: "القوة النهائية: {value}%",
        },
        cards: {
          degreePosition: "موضع الدرجة",
          essentialDignity: "المنزلة الأساسية",
          sunProximity: "قرب الشمس",
          retrogradeMotion: "حركة التراجع",
        },
        sections: {
          challengesTitle: "التحديات",
          recommendationsTitle: "التوصيات",
        },
        suitability: {
          outerWork: "عمل خارجي",
          innerWork: "عمل داخلي",
          limitedOuterWork: "عمل خارجي محدود",
        },
      },
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
• Avec les noms seulement : Méthode rapide
• Avec les noms des mères : Méthode traditionnelle (recommandée)

🌍 C'est la méthode traditionnelle préservée par les érudits islamiques d'Afrique de l'Ouest pour la compatibilité matrimoniale sérieuse.

🔒 Confidentialité : Les noms des mères ne sont utilisés que pour le calcul et jamais stockés.`,
      
      // Sélection du mode d'analyse
      analysisMode: "Mode d'Analyse",
      quickAnalysis: "Analyse Rapide (Noms Seulement)",
      quickAnalysisDesc: "Voyez comment vos personnalités conscientes interagissent dans la vie quotidienne. Bon pour la curiosité initiale.",
      quickAccuracy: "Méthode rapide",
      completeAnalysis: "Analyse Complète (Noms + Mères) ⭐ Recommandé",
      completeAnalysisDesc: "La méthode traditionnelle d'Afrique de l'Ouest. Révèle à la fois la chimie de surface et la compatibilité émotionnelle profonde. Essentiel pour les relations sérieuses.",
      completeAccuracy: "Méthode traditionnelle",
      
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
      
      // Welcome/Splash Screen
      splash: {
        appName: "Asrariya",
        subtitle: "✦ ʿIlm al-Ḥurūf ✦",
        description: "Découvrez la science sacrée des lettres et des noms divins à travers la sagesse ancienne et le timing cosmique",
        features: {
          calculator: "Calculateur de Nom Sacré",
          timing: "Guidance du Timing Divin",
          insights: "Aperçus Personnalisés",
        },
        getStarted: "Commencer",
      },
      
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

    // ============================================================================
    // PREMIUM SECTIONS - Titres & Descriptions pour les composants PremiumSection
    // ============================================================================
    premiumSections: {
      // Who Am I / Istikhara Overview
      spiritualDetails: {
        title: "Détails spirituels",
        description: "Débloquez des pratiques spirituelles approfondies",
      },
      // Prayer Guidance
      prayerGuidance: {
        title: "Guidance de prière",
        description: "Débloquez des pratiques spirituelles personnalisées",
      },
      // Compatibility - Person to Person
      soulConnection: {
        title: "Connexion des âmes",
        description: "Explorez le lien spirituel entre les âmes",
      },
      harmonyAnalysis: {
        title: "Analyse d'harmonie",
        description: "Découvrez l'harmonie élémentaire et cosmique",
      },
      personalizedAdvice: {
        title: "Conseils personnalisés",
        description: "Obtenez des recommandations pratiques",
      },
      compatibilitySummary: {
        title: "Résumé de compatibilité",
        description: "Débloquez l'interprétation détaillée",
      },
      // Compatibility - Person to Divine Name / Divine Name to Intention
      divineGuidance: {
        title: "Guidance divine",
        description: "Découvrez la manifestation et la sagesse spirituelle",
      },
      practiceGuide: {
        title: "Guide de pratique",
        description: "Apprenez les méthodes de récitation traditionnelles",
      },
      practiceGuidance: {
        title: "Guidance de pratique",
        description: "Apprenez à travailler avec ce Nom Divin",
      },
      // Divine Timing
      aiGuidance: {
        title: "Guidance IA",
        description: "Obtenez une guidance spirituelle personnalisée",
      },
      // Moment Alignment Detail
      personalGuidance: {
        title: "Guidance personnelle",
        description: "Découvrez quelles actions sont favorisées maintenant",
      },
      // Daily Guidance Details
      bestFor: {
        title: "Idéal pour",
        description: "Guidance d'action personnelle",
      },
      // Name Destiny Results
      aiEnhancement: {
        title: "Amélioration IA",
        description: "Interprétation personnelle de votre nom",
      },
      divineNameResonance: {
        title: "Résonance des Noms Divins",
        description: "Découvrez vos Noms Divins résonnants",
      },
      quranResonance: {
        title: "Résonance coranique",
        description: "Découvrez les versets qui résonnent avec votre nom",
      },
      keyTakeaways: {
        title: "Points clés",
        description: "Guidance pratique pour votre chemin",
      },
      // Manazil
      manazilPractices: {
        title: "Pratiques des Manazil",
        description: "Débloquez les pratiques traditionnelles pour cette mansion",
      },
      // Planet Transit Details
      transitGuidance: {
        title: "Guidance de transit",
        description: "Aperçus personnalisés des transits planétaires",
      },
      planetaryPractices: {
        title: "Pratiques planétaires",
        description: "Pratiques spirituelles pour ce transit",
      },
      // Calculator Enhanced Results
      advancedAnalysis: {
        title: "Analyse avancée",
        description: "Aperçus numériques approfondis",
      },
      // Results (Istikhara Results tabs)
      personality: {
        title: "Aperçus de personnalité",
        description: "Découvrez vos traits de personnalité profonds",
      },
      career: {
        title: "Guidance de carrière",
        description: "Direction de carrière basée sur votre profil spirituel",
      },
      blessedDay: {
        title: "Votre jour béni",
        description: "Découvrez votre jour le plus favorable",
      },
      spiritualPractice: {
        title: "Pratique spirituelle",
        description: "Pratiques spirituelles personnalisées",
      },
      // Name Destiny Results additional
      aiPersonalization: {
        title: "Personnalisation IA",
        description: "Obtenez une interprétation personnalisée par IA de votre élément",
      },
      spiritualGuidanceInsights: {
        title: "Guidance spirituelle",
        description: "Aperçus personnalisés et guidance pratique pour votre chemin",
      },
      // Planet Transit Details additional
      personalizedImpact: {
        title: "Impact personnalisé",
        description: "Découvrez comment ce transit affecte votre nature élémentaire",
      },
      personalizedInsights: {
        title: "Aperçus personnalisés",
        description: "Découvrez votre nature, guidance quotidienne, méthodes d'équilibre, et plus",
      },
      // Daily Guidance Details additional
      bestActionsToday: {
        title: "Meilleures actions aujourd'hui",
        description: "Découvrez quelles activités s'alignent le mieux avec l'énergie d'aujourd'hui",
      },
      // Relationship Compatibility
      interpretation: {
        title: "Interprétation",
        description: "Découvrez ce que cette connexion signifie pour vous",
      },
      spiritualAnalysis: {
        title: "Analyse spirituelle",
        description: "Explorez la connexion spirituelle profonde",
      },
      elementalAnalysis: {
        title: "Analyse élémentaire",
        description: "Comprenez l'harmonie des énergies naturelles",
      },
      planetaryAnalysis: {
        title: "Analyse planétaire",
        description: "Découvrez les influences cosmiques",
      },
      // Calculator Enhanced Results additional
      deepNumerologicalAnalysis: {
        title: "Analyse numérologique approfondie",
        description: "Débloquez les aperçus IA, composition élémentaire, et méthodes de calcul avancées",
      },
      // AI Guidance (Divine Timing)
      aiSpiritualGuidance: {
        title: "Guidance spirituelle IA",
        description: "Obtenez une guidance personnalisée basée sur votre profil spirituel et le timing actuel",
      },
      // Manazil additional
      spiritualPractices: {
        title: "Pratiques spirituelles",
        description: "Adhkar, anges, versets coraniques, et wafq pour cette mansion",
      },
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
          hourlyStatus: "Statut du moment",
          planetaryHour: "Heure planétaire",
          dailyQuality: "Flux du jour",
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
        tapForGuidance: "Appuyez pour voir les conseils de prière",
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
    // MODULE QUI SUIS-JE - Analyse Profonde à Travers la Numérologie Sacrée
    // ============================================================================
    istikhara: {
      // Panneau principal
      title: "Qui Suis-Je",
      titleArabic: "مَن أنا",
      subtitle: "Découvrez Votre Véritable Nature",
      formInstruction: "Entrez votre nom et celui de votre mère pour une analyse approfondie",
      description: "Découvrez votre élément, personnalité, chemin de carrière et pratiques spirituelles à travers la science sacrée du ʿIlm al-Ḥurūf.",
      
      // Sélecteur de méthode
      methodSelector: {
        label: "Choisissez la méthode de calcul :",
        nameBased: {
          title: "Par le Nom",
          badge: "CLASSIQUE",
          description: "Méthode traditionnelle ʿIlm al-Ḥurūf utilisant votre nom + nom de la mère",
        },
        birthDate: {
          title: "Date de Naissance",
          badge: "RAPIDE",
          description: "Méthode simplifiée utilisant uniquement votre date de naissance",
        },
      },
      
      // Formulaire date de naissance
      birthDateForm: {
        selectDate: "Sélectionnez Votre Date de Naissance",
        tapToSelect: "Appuyez pour sélectionner votre date de naissance",
        pleaseSelect: "Veuillez sélectionner votre date de naissance",
        birthTime: "Heure de Naissance (Optionnel)",
        birthTimeHint: "Ajoutez votre heure de naissance pour débloquer les calculs d'Ascendant et Descendant",
        tapToSetTime: "Appuyez pour définir l'heure de naissance (si connue)",
        birthLocation: "Lieu de Naissance (Optionnel)",
        birthLocationHint: "Ajoutez votre ville de naissance pour un calcul précis de l'Ascendant",
        searchCity: "Rechercher une ville...",
        whatYouDiscover: "Ce Que Vous Découvrirez :",
        sunSign: "Votre Signe Solaire (Burj)",
        elementalNature: "Votre nature élémentaire",
        moonSign: "Signe Lunaire (placement lunaire)",
        ascendant: "Ascendant (Signe Montant)",
        descendant: "Signe Descendant",
        unlockHint: "Ajoutez l'heure et le lieu de naissance ci-dessus pour débloquer l'Ascendant et le Descendant",
        yearNotNeeded: "L'année n'est pas nécessaire pour les calculs de base",
        monthLabel: "Mois (1-12)",
        dayLabel: "Jour (1-31)",
        useFullDate: "Utiliser la Date Complète",
        useMonthDayOnly: "Juste Mois & Jour",
        fullDateDesc: "Pour une analyse complète avec le Signe Lunaire",
        monthDayDesc: "Calcul rapide Burj uniquement",
      },

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
        title: "Découvrez Qui Vous Êtes",
        personName: "Votre Nom",
        personNamePlaceholder: "p.ex., Muhammad, Fatima, Ibrahim",
        motherName: "Nom de la Mère",
        motherNamePlaceholder: "p.ex., Khadija, Aisha, Maryam",
        latinName: "Nom en lettres latines",
        latinNamePlaceholder: "ex : Muhammad, Fatima, Aisha",
        latinNameHint: "Écrivez votre nom en lettres latines — l'équivalent arabe sera affiché",
        calculateButton: "Me Découvrir",
        clearButton: "Effacer",
        validationError: "Veuillez entrer les deux noms pour continuer",
        bothNamesRequired: "Les deux noms sont requis pour une analyse précise",
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
          health: "Santé",
        },
      },

      // Onglet Vigilance santé
      health: {
        title: "Vigilance santé",
        subtitle: "Sagesse traditionnelle pour ta nature spirituelle (pas un avis médical)",
        sections: {
          watchOutFor: "⚠️ Points d'attention",
          thingsToAvoid: "🚫 Choses à éviter",
          foodsThatHelpYou: "🍎 Aliments qui t'aident",
          spiritualProtection: "🛡️ Protection spirituelle",
          westAfricanTraditions: "🌍 Traditions ouest-africaines",
        },
        disclaimer: "💡 Ceci est une guidance spirituelle traditionnelle, pas un avis médical. En cas de souci de santé, consultez un professionnel qualifié.",
        empty: {
          title: "Vigilance santé",
          text: "Aucune donnée n'est disponible pour ce signe pour l'instant.",
        },
        a11y: {
          toggle: "Développer ou réduire la section vigilance santé",
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
          tagline: "Votre nom porte une structure.",
          credibility: "Inspiré par les correspondances Abjad.",
          title: "Calculatrice & Profil spirituel",
          body: "Explorez les marqueurs liés à votre nom : élément, tempérament et sens central.",
          b1: "Calculs Kabir & Saghir",
          b2: "Élément & tempérament",
          b3: "Explications simples",
        },
        s3: {
          tagline: "Heures sacrées, pas temps aléatoire.",
          credibility: "Basé sur les heures planétaires.",
          title: "Temps divin",
          body: "Découvrez des fenêtres pour la réflexion et le calme intérieur.",
          b1: "Influence planétaire (jour & heure)",
          b2: "Heures harmonieuses et contraintes",
          b3: "Guide contemplatif, pas autorité",
        },
        s4: {
          tagline: "Constance avant intensité.",
          credibility: "Fondé sur l'adab, la présence et la continuité.",
          title: "Dhikr & pratique",
          body: "Suivez vos sessions, restez constant, appliquez une méthode guidée.",
          b1: "Compteur de session (intention)",
          b2: "Méthodologie guidée (adab)",
          b3: "Rappels doux pour la continuité",
        },
        s5: {
          tagline: "Votre chemin, préservé.",
          credibility: "Vos données restent privées et sécurisées.",
          title: "Commencez votre voyage",
          body: "Synchronisez votre profil spirituel entre appareils.",
          b1: "Données privées et sécurisées",
          b2: "Synchronisation entre appareils",
          b3: "Continuer sans compte",
        },

        // Écran final (Sauvegarder & débloquer)
        final: {
          tagline: "Votre chemin, préservé.",
          title: "Commencez votre voyage",
          description: "Créez un compte pour synchroniser votre profil et débloquer des fonctionnalités avancées.",
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

    // Labels des maîtres des jours
    dayRulers: {
      sunday: {
        name: "Dimanche • Jour du Soleil",
        desc: "Jour de vitalité, leadership et pouvoir personnel",
        element: "Feu",
        planet: "Soleil",
        arabicName: "الأحد • يوم الشمس",
      },
      monday: {
        name: "Lundi • Jour de la Lune",
        desc: "Jour des émotions, intuition et soin",
        element: "Eau",
        planet: "Lune",
        arabicName: "الاثنين • يوم القمر",
      },
      tuesday: {
        name: "Mardi • Jour de Mars",
        desc: "Jour d'action, courage et mouvement décisif",
        element: "Feu",
        planet: "Mars",
        arabicName: "الثلاثاء • يوم المريخ",
      },
      wednesday: {
        name: "Mercredi • Jour de Mercure",
        desc: "Jour de communication, apprentissage et commerce",
        element: "Air",
        planet: "Mercure",
        arabicName: "الأربعاء • يوم عطارد",
      },
      thursday: {
        name: "Jeudi • Jour de Jupiter",
        desc: "Jour d'expansion, sagesse et croissance",
        element: "Air",
        planet: "Jupiter",
        arabicName: "الخميس • يوم المشتري",
      },
      friday: {
        name: "Vendredi • Jour de Vénus",
        desc: "Jour d'amour, beauté et harmonie",
        element: "Eau",
        planet: "Vénus",
        arabicName: "الجمعة • يوم الزهرة",
      },
      saturday: {
        name: "Samedi • Jour de Saturne",
        desc: "Jour de discipline, structure et maîtrise",
        element: "Terre",
        planet: "Saturne",
        arabicName: "السبت • يوم زحل",
      },
    },

    // Descriptions des relations planétaires (French - simplified)
    planetaryRelations: {
      "Sun-Moon": "Le Soleil illumine les profondeurs émotionnelles de la Lune",
      "Sun-Mars": "Le Soleil énergise le courage de Mars",
      "Sun-Jupiter": "Le Soleil élargit la sagesse de Jupiter",
      "Sun-Mercury": "Le Soleil et Mercure travaillent ensemble naturellement",
      "Sun-Venus": "Le Soleil et Vénus créent une tension créative",
      "Sun-Saturn": "Le Soleil et Saturne font face à des défis",
      "Moon-Sun": "La Lune reflète la vitalité du Soleil",
      "Moon-Mercury": "La Lune harmonise les pensées de Mercure",
      "Moon-Mars": "La Lune et Mars équilibrent émotion et action",
      "Moon-Jupiter": "La Lune et Jupiter mélangent soin et générosité",
      "Moon-Venus": "La Lune s'écoule naturellement avec Vénus",
      "Moon-Saturn": "La Lune et Saturne luttent entre émotion et contrôle",
      "Mars-Sun": "Mars canalise la vitalité du Soleil en action",
      "Mars-Moon": "Mars soutient les émotions de la Lune",
      "Mars-Jupiter": "Mars rejoint la sagesse de Jupiter",
      "Mars-Mercury": "Mars et Mercure créent de la tension",
      "Mars-Venus": "Mars et Vénus luttent entre assertion et harmonie",
      "Mars-Saturn": "Mars et Saturne travaillent ensemble neutralement",
      "Mercury-Sun": "Mercure sert le Soleil avec précision",
      "Mercury-Venus": "Mercure s'harmonise avec Vénus",
      "Mercury-Moon": "Mercure et la Lune équilibrent raison et émotion",
      "Mercury-Mars": "Mercure et Mars font face à des frictions",
      "Mercury-Jupiter": "Mercure et Jupiter travaillent ensemble neutralement",
      "Mercury-Saturn": "Mercure et Saturne équilibrent analyse et sagesse",
      "Jupiter-Sun": "Jupiter élargit le leadership du Soleil",
      "Jupiter-Moon": "Jupiter bénit le soin de la Lune",
      "Jupiter-Mars": "Jupiter guide le courage de Mars",
      "Jupiter-Mercury": "Jupiter et Mercure travaillent ensemble neutralement",
      "Jupiter-Venus": "Jupiter et Vénus créent de la tension",
      "Jupiter-Saturn": "Jupiter et Saturne travaillent ensemble neutralement",
      "Venus-Mercury": "Vénus enrichit la communication de Mercure",
      "Venus-Saturn": "Vénus s'harmonise avec Saturne",
      "Venus-Mars": "Vénus et Mars luttent entre harmonie et conflit",
      "Venus-Jupiter": "Vénus et Jupiter créent de la tension",
      "Venus-Sun": "Vénus et le Soleil travaillent ensemble neutralement",
      "Venus-Moon": "Vénus et la Lune se mélangent naturellement",
      "Saturn-Mercury": "Saturne soutient l'analyse de Mercure",
      "Saturn-Venus": "Saturne donne à la beauté de Vénus une forme durable",
      "Saturn-Jupiter": "Saturne et Jupiter travaillent ensemble neutralement",
      "Saturn-Mars": "Saturne et Mars travaillent ensemble neutralement",
      "Saturn-Sun": "Saturne et le Soleil font face à des défis",
      "Saturn-Moon": "Saturne et la Lune luttent entre chaleur et réserve",
    },

    // Relations élémentaires (French - simplified)
    elementalRelations: {
      "Fire-Fire": "Le Feu renforce le Feu — passion amplifiée",
      "Fire-Air": "L'Air attise le Feu — dynamisme créatif",
      "Fire-Water": "Le Feu et l'Eau créent de la vapeur — tension créative",
      "Fire-Earth": "Le Feu et la Terre travaillent ensemble — action ancrée",
      "Water-Water": "L'Eau approfondit l'Eau — fluidité harmonieuse",
      "Water-Earth": "La Terre ancre l'Eau — émotions stabilisées",
      "Water-Air": "L'Eau et l'Air créent de la brume — adaptable",
      "Water-Fire": "L'Eau et le Feu créent de la vapeur — intensité",
      "water-fire": "L'Eau et le Feu créent de la vapeur — intensité",
      "Air-Air": "L'Air amplifie l'Air — clarté mentale multipliée",
      "Air-Fire": "Le Feu énergise l'Air — pensées enflammées",
      "Air-Earth": "L'Air et la Terre travaillent ensemble — idées pratiques",
      "Air-Water": "L'Air et l'Eau créent de la brume — raison et émotion",
      "Earth-Earth": "La Terre solidifie la Terre — stabilité renforcée",
      "Earth-Water": "L'Eau nourrit la Terre — croissance enrichie",
      "Earth-Fire": "La Terre ancre le Feu — énergie canalisée",
      "Earth-Air": "La Terre et l'Air travaillent ensemble — idées concrétisées",
    },
  },
  ar: {
        // Moment Alignment Screen (Hourly)
        momentAlignment: {
          currentHourPlanet: {
            title: "كوكب الساعة الحالية",
            subtitle: "يحكم هذه اللحظة",
            viewAllPlanets: "عرض الكواكب السبعة",
          },
        },

    // Minimal Arabic translations. Any missing keys fall back to EN automatically.
    nav: {
      home: "الرئيسية",
      calculator: "الحاسبة",
      whoAmI: "مَن أنا",
      advanced: "الاستخارة",
    },
    
    common: {
      buttons: {
        learnMore: "اعرف المزيد",
        collapse: "إظهار أقل",
        tapToLearn: "اضغط لمعرفة المزيد",
      },

      loading: "جارٍ التحميل...",
      retry: "إعادة المحاولة",
      on: "تشغيل",
      off: "إيقاف",
      unknown: "—",
      element: "العنصر",
      you: "أنت",

      // Elements - shared across features
      elements: {
        air: "هواء",
        fire: "نار",
        water: "ماء",
        earth: "أرض",
      },
      // Quality levels (TimingGuidanceCard)
      quality: {
        excellent: "ممتاز",
        good: "جيد",
        moderate: "معتدل",
        weak: "ضعيف",
      },
    },

    planetCondition: {
      label: "حالة الكوكب",
      scoreLabel: "النتيجة",
      status: {
        Favorable: "مُواتٍ",
        Neutral: "محايد",
        Restricted: "مُقيَّد",
        Avoid: "تجنّب",
      },
      reasons: {
        DIGNITY_EXALTATION: "شرف (Exaltation): دعم قوي للغاية.",
        DIGNITY_DOMICILE: "بيت (Domicile): ثبات وارتياح.",
        DIGNITY_DETRIMENT: "وبال (Detriment): احتكاك وعدم استقرار.",
        DIGNITY_FALL: "هبوط (Fall): ضعف في التعبير.",
        DIGNITY_NEUTRAL: "محايد: توازن عام.",
        DEGREE_EXALTATION_PEAK_NEAR: "قريب من ذروة الشرف (±3°): زيادة قوة.",
        DEGREE_EXALTATION_NEAR: "قريب من ذروة الشرف (±7°): زيادة بسيطة.",
        DEGREE_CRITICAL_TRANSITION: "درجة حرجة (0–1° أو 29–30°): عدم استقرار انتقالي.",
      },
    },

    // شاشة المنازل (التفاصيل)
    manazilScreen: {
      currentMoonPosition: "موقع القمر الحالي",
      liveIndicator: "🔴 مباشر - تحديث فوري",
      moonStrength: "قوة القمر",
      mansion: "المنزلة",
      quality: "الجودة",
      changesEvery: "يتغير كل ~2.4 يوم",
      cosmicDialogueTitle: "🌌 حوار كوني",
      mansionWisdomTitle: "🏛️ حكمة المنزلة",
      fromYourName: "من اسمك: {name}",
      staticNeverChanges: "ثابت - لا يتغير أبداً",
      needTimingGuidanceTitle: "⏰ تحتاج تحليل التوقيت؟",
      needTimingGuidanceSubtitle: "اطّلع على هذه الشاشات للتوقيت الروحي:",
      dailyEnergyLinkTitle: "طاقة اليوم",
      dailyEnergyLinkSubtitle: "اعرض التوقيت العام لليوم.",
      momentAlignmentLinkTitle: "محاذاة اللحظة",
      momentAlignmentLinkSubtitle: "اعرض التوقيت لهذه اللحظة (ساعة بساعة).",
      timingGuidanceNote: "تتحدّث الدرجات كل بضع دقائق.",
      elementalStatus: {
        harmonious: "انسجام",
        balanced: "توازن",
        tension: "توتر",
        bothAre: "كلاهما {element} — طاقة داعمة طبيعيًا.",
        proceedMindfully: "{element1} و{element2} بينهما تباين — سر بوعي.",
        neutralEnergy: "{element1} و{element2} مختلفان دون تعارض — طاقة مرنة.",
      },
      relationship: {
        title: "علاقة المنازل",
        subtitle: "كيف يتفاعل عنصر القمر الحالي مع منزلك الشخصي.",
        yourEssence: "جوهرك",
        currentMoon: "القمر الحالي",
        howToNavigate: "كيف تتعامل اليوم",
        bestCompatibility: "أفضل توافق",
        whenMoonIn: "عندما يكون القمر في {element} تكون منزلك الشخصي مدعومة بشكل خاص.",
        nextMoon: "القمر التالي في {element}: {relativeTime} ({date})",
        today: "اليوم",
        tomorrow: "غداً",
        inDays: "بعد {count} أيام",
        nextWeek: "الأسبوع القادم",
        inWeeks: "بعد {count} أسابيع",
        inMonths: "بعد {count} أشهر",
        tips: {
          harmonious1: "ضاعف مواهبك الطبيعية",
          harmonious2: "ثق بحدسك الروحي",
          harmonious3: "اعمل مع نقاط قوة عنصرك",
          balanced1: "اعمل مع الطاقتين بوعي",
          balanced2: "ابحث عن الجسر بين العنصرين",
          balanced3: "دع التوازن يكون معلّمك",
          tension1: "تحرّك بلطف وابق حاضرًا",
          tension2: "اختر خطوة تالية بسيطة ومُؤسَّسة",
          tension3: "قدّم الهدوء والوضوح والنية",
        },
      },
      personalMessage: {
        title: "رسالة شخصية",
        subtitle: "لمنزلك الشخصي: {name}",
        forYourNature: "لطبيعتك {element}",
        messageHarmonious: "قمر {moonElement} اليوم ينسجم مع جوهرك {personalElement}. تُضخَّم مواهبك الطبيعية — ثق بحدسك واعمل مع نقاط قوتك.",
        messageTension: "قمر {moonElement} اليوم يخلق توترًا بنّاءً مع طبيعتك {personalElement}. ليس سيئًا — إنه نمو عبر التوازن. تحرّك بوعي وابق حاضرًا.",
        messageBalanced: "قمر {moonElement} اليوم يجلب طاقة محايدة إلى جوهرك {personalElement}. يفتح ذلك مساحة لاختيار واعٍ — يمكنك الميل لأي طاقة بحسب الحاجة.",
      },
    },

    notifications: {
      // Timing section for notifications and cards (TimingGuidanceCard, TodayDetailsCard, CollapsibleEducationalSection)
      timing: {
        currentTiming: "التوقيت الحالي",
        hour: "الساعة",
        endsAt: "ينتهي في",
        nextBestHour: "الساعة الأفضل التالية",
        inHours: "في",
        expectedQuality: "الجودة المتوقعة",
        suggestion: "الاقتراح",
        proceedNow: "تابع الآن",
        waitForBetter: "انتظر توقيتًا أفضل إن أمكن",
        excellentTiming: "توقيت ممتاز الآن!",
        todaysDetails: "تفاصيل اليوم",
        dayRuler: "حاكم اليوم",
        element: "العنصر",
        quality: "الجودة",
        whyThisTiming: "لماذا هذا التوقيت؟",
        elementHarmony: "الانسجام العنصري",
        momentAlignment: "محاذاة اللحظة",
        planetaryResonance: "الرنين الكوكبي",
        whatThisMeans: "ما يعني هذا",
      },
    },

    planetaryHours: {
      title: "الساعات الكوكبية",
      currentHour: "الساعة الكوكبية الحالية",
      hourAfterNext: "الساعة بعد التالية",
      hourNumber: "الساعة رقم {number}",
      planet: "الكوكب",
      startTime: "وقت البداية",
      endTime: "وقت النهاية",
      dayHours: "ساعات النهار",
      nightHours: "ساعات الليل",

      planets: {
        sun: "الشمس",
        moon: "القمر",
        mars: "المريخ",
        mercury: "عطارد",
        jupiter: "المشتري",
        venus: "الزهرة",
        saturn: "زحل",
      },

      wording: {
        shared: {
          powerVsPermission: "القوّة ليست إذنًا: قد تُعظّم الساعة القوية النفع والضرر معًا.",
          samePlanetIntensity: "إذا كانت هذه الساعة محكومة بكوكبك، تزداد الكثافة — فاعمل بضبطٍ للنفس.",
        },

        sun: {
          status: "وقت إشراق",
          meaning: "ظهورٌ وسلطانٌ ووضوحُ نيّة؛ ما يُبتدأ يُرى.",
          bestFor: [
            "القيادة وتحديد الاتجاه",
            "الأمور العلنية والسمعة",
            "أذكار/دعاء لصفاء القصد",
            "تعظيم الكبار والسلطة بحق",
          ],
          avoid: [
            "الكِبر وحبّ الظهور",
            "الإفراط في الوعود",
            "العمل بلا إخلاص",
          ],
          note: "تعلو القوّة؛ فاحرس القلب من العُجب والغلظة.",
        },

        moon: {
          status: "وقت انعكاس",
          meaning: "تياراتٌ قابلةٌ ومتبدّلة؛ تصلح للرعاية والإنصات والرجوع.",
          bestFor: [
            "الطهارة وعبادةٌ بلطف",
            "شؤون البيت والأهل والحوائج",
            "تأمّلٌ ورؤى ودعاء",
          ],
          avoid: [
            "قرارات لا رجعة فيها",
            "نذورٌ وعهودٌ على عَجَل",
          ],
          note: "يزداد التبدّل؛ فالزم الثبات وتجنّب وعدًا متردّدًا.",
        },

        mercury: {
          status: "وقت تحوّل",
          meaning: "حركةُ الذهن والرسالة؛ سرعةُ تبادلٍ وصنعةٌ وحساب.",
          bestFor: [
            "الدراسة والكتابة والحفظ",
            "التجارة والحوائج والتنقّل القريب",
            "التخطيط وحلّ المشكلات",
            "تعلّم اللغات والمهارات",
          ],
          avoid: [
            "اللغو والجدال بلا فائدة",
            "اتفاقاتٌ على استعجال",
            "خداعٌ وازدواجُ كلام",
          ],
          note: "تزيد السرعة؛ فَثَبِّت اللفظ وتحقّق من الخبر.",
        },

        venus: {
          status: "وقت انسجام",
          meaning: "ألفةٌ ومودّةٌ وجمال؛ تلين القلوب وتتهذّب الطباع.",
          bestFor: [
            "الإصلاح وجبر الخواطر",
            "الفنون والزينة ومجالس السكينة",
            "الإحسان والصدقة والهدية",
            "حديثُ زواجٍ برضا الطرفين",
          ],
          avoid: [
            "انغماسٌ ولهو",
            "زهوٌ وتفاخر",
            "تضييع الواجبات",
          ],
          note: "تزيد السهولة؛ فاحفظ الحياء ولا تُبدّل الواجب بالمتعة.",
        },

        mars: {
          status: "وقت شدّة",
          meaning: "حرارةٌ وقطعٌ وبأس؛ الفعل يُحسم سريعًا وتتبعه العواقب.",
          bestFor: [
            "سعيٌ منضبطٌ وتدريب",
            "حراسةٌ وصونُ الحدود",
            "حسمٌ مع ضبط النفس",
          ],
          avoid: [
            "غضبٌ وخصومة",
            "مخاطرةٌ طائشة",
            "ابتداءُ نزاع",
          ],
          note: "تزيد القوّة؛ فلا تجعل الشدّة إذنًا.",
        },

        jupiter: {
          status: "وقت اتّساع",
          meaning: "زيادةٌ ولُطفٌ وسخاء؛ انفتاحٌ في المشورة والعلم.",
          bestFor: [
            "تعليمٌ وطلبُ علم",
            "مشورةٌ ووساطةٌ وتدبيرٌ حكيم",
            "صدقةٌ وتوسعةُ رزق",
            "بداياتٌ مع شكر",
          ],
          avoid: [
            "تَعالٍ",
            "إسرافٌ وتبذير",
          ],
          note: "يزداد الاتساع؛ فاثبت على الشكر وتجنّب تضخّم النفس.",
        },

        saturn: {
          status: "وقت تقييد",
          meaning: "قيدٌ وصبرٌ وجلَد؛ ما يُبنى بطيءٌ وممحوص.",
          bestFor: [
            "عملٌ طويلٌ يحتاج صبرًا",
            "زهدٌ وتوبةٌ وكفّ النفس",
            "تخطيطٌ وحدودٌ ونظام",
            "ختمُ ما يجب ختمه بصفاء",
          ],
          avoid: [
            "العَجَلة",
            "ابتداءُ لذّات تُضعف القلب",
            "قسوةُ القلب",
          ],
          note: "يزداد القيد؛ فاقبل الإيقاع واحمل الرحمة في النية.",
        },
      },
    },

    // Zodiac (used by Planet Transit screen hero)
    zodiac: {
      aries: "الحمل",
      taurus: "الثور",
      gemini: "الجوزاء",
      cancer: "السرطان",
      leo: "الأسد",
      virgo: "السنبلة",
      libra: "الميزان",
      scorpio: "العقرب",
      sagittarius: "القوس",
      capricorn: "الجدي",
      aquarius: "الدلو",
      pisces: "الحوت",

      // Keep explicit Arabic keys for compatibility with existing lookups
      ariesArabic: "الحمل",
      taurusArabic: "الثور",
      geminiArabic: "الجوزاء",
      cancerArabic: "السرطان",
      leoArabic: "الأسد",
      virgoArabic: "السنبلة",
      libraArabic: "الميزان",
      scorpioArabic: "العقرب",
      sagittariusArabic: "القوس",
      capricornArabic: "الجدي",
      aquariusArabic: "الدلو",
      piscesArabic: "الحوت",
    },

    // Screens
    screens: {
      // Planet Transit Screen (System 1 - Long-term)
      planetTransit: {
        title: "عبور الكواكب",
        headerSubtitle: "طويل المدى",
        explanation: "يعرض موقع الكوكب في الأبراج — وهو موضع طويل المدى يتغير خلال أسابيع أو أشهر أو سنوات.",
        personalizedNote: "مُخصّص حسب طبيعتك العنصرية",
        practices: {
          title: "ممارسات خاصة بالكوكب",
          minutesShort: "دقائق",
          divineNames: {
            title: "الأسماء الإلهية",
            description: "أسماء الله الحسنى الموصى بها لطاقة {planet}",
            forCategory: "للـ {category}",
            repetitionsLabel: "التكرارات:",
            purposeLabel: "🎯 الغرض",
            durationLabel: "المدة المقدرة:",
            howTo: {
              label: "💡 كيفية الممارسة",
              step1: "توضأ وواجه القبلة",
              step2: "اجلس في مكان هادئ ونظيف",
              step3: "اضبط نيتك لـ{category}",
              step4: "اتلُ بتركيز وخشوع",
              step5: "استخدم السبحة للعد",
            },
            actions: {
              startPractice: "ابدأ الممارسة",
              setReminder: "ضع تذكيرًا",
            },
          },
        },
        summary: {
          bestNow: "الأقوى الآن",
          weakNow: "الأضعف الآن",
        },

        currentTransit: "العبور الحالي",
        timeScale: "طويل المدى (أسابيع/أشهر)",
        in: "في",
        signProgress: "تقدّم داخل البرج",
        degreeInSign: "الدرجة داخل البرج",

        retrograde: "متراجع",
        retrogradeArabic: "راجع",
        nearingChange: "اقتراب تغيير البرج",

        duration: {
          title: "مدة العبور",
          enteredSign: "دخل البرج",
          leavesSign: "يغادر البرج",
          total: "المدة",
        },
        durationStats: {
          elapsed: "انقضى",
          remaining: "متبقٍ",
          total: "الإجمالي",
        },
        timeline: {
          now: "الآن",
        },

        dataSource: {
          title: "مصدر البيانات",
          api: "NASA JPL Horizons (الإفيميريدس)",
          cached: "بيانات إفيميريدس مخزنة",
          lastUpdated: "آخر تحديث",
        },

        spiritualQuality: {
          title: "الجودة الروحية",
          saad: "سَعْد — مُبارك",
          nahs: "نَحْس — صعب",
        },

        meaning: {
          title: "المعنى والموضوع",
        },

        resonance: {
          title: "الرنين مع طبيعتك",
          description: "كيف يتفاعل هذا العبور مع عنصر {{element}} لديك:",
          levels: {
            strong: "قوي",
            harmonious: "منسجم",
            neutral: "متوازن",
            growth: "نمو",
            challenge: "تحدّي",
          },
          arabicTerms: {
            harmonious: "سَكِينَة",
            supportive: "تَوَافُق",
            neutral: "تَوَازُن",
            challenging: "تَحَوُّل",
          },
          context: "استنادًا إلى العلاقات العنصرية في علم الفلك الروحي التقليدي.",
        },

        quickImpact: {
          title: "الأثر السريع",
          subtitle: "كيف تشعر به الآن",
        },

        why: {
          title: "لماذا تشعر بهذا الشكل",
          body: "يمزج هذا العبور بين طبيعتك العنصرية ونبرة البرج، فيؤثر على التواصل والمزاج والزخم اليوم.",
          show: "لماذا تشعر بهذا الشكل",
          hide: "إخفاء التفاصيل",
        },

        focus: {
          title: "تركيز اليوم",
          communication: "التواصل",
          patience: "الصبر",
          reflection: "التأمل",
        },

        classicalWisdom: {
          title: "حكمة كلاسيكية",
          arabicTradition: "من التراث الفلكي العربي",
        },

        degree: {
          title: "الموقع داخل البرج",
          explanation: "{{degree}} من 30° (~{{percent}}% داخل هذا البرج).",
          phases: {
            early: "بداية (0–10°)",
            middle: "وسط (10–20°)",
            late: "نهاية (20–30°)",
          },
        },
        dignity: {
          title: "تحليل منزلة الكوكب",
          state: "الحالة",
          baseModifier: "المعامل الأساسي",
          degreeModifier: "معامل الدرجة",
          finalStrength: "القوة النهائية",
          whatThisMeans: "ماذا يعني هذا",
          suitableFor: "مناسب لـ",
          avoid: "تجنّب",
          betterTiming: "توقيت أفضل",
          states: {
            sharaf: "شرف",
            bayt: "بيت",
            qubul: "قبول",
            wabal: "وبال",
            hubut: "هبوط",
          },
          explanations: {
            sharaf: "الكوكب في شرفه: صفاته مُعزَّزة ومدعومة.",
            bayt: "الكوكب في بيته: تأثيره أكثر ثباتًا وموثوقية.",
            qubul: "قبول: وضع متوازن لا يدعم ولا يعارض بقوة.",
            wabal: "وبال: قد يظهر احتكاك أو نتائج مختلطة؛ امضِ بحذر.",
            hubut: "هبوط: قد تبدو الطاقة أثقل؛ الصبر وأهداف أصغر تساعد.",
          },
        },
        dignityGuidance: {
          generic: {
            sharaf: {
              whatThisMeans: "مع {planet} في الشرف داخل {sign}، الزخم داعم. تصرّف بوضوح وحسن نية.",
              suitableFor: {
                1: "القيادة والظهور",
                2: "محادثات وقرارات مهمة",
                3: "بدء مبادرات وتحديد اتجاه",
              },
              avoid: {
                1: "الاندفاع أو الثقة الزائدة",
                2: "فرض النتائج أو تصعيد الخلاف",
              },
              betterTiming: {
                1: "اختر وضوحًا وحدودًا للالتزامات",
                2: "حافظ على النية النظيفة والخطوة الثابتة",
              },
            },
            bayt: {
              whatThisMeans: "مع {planet} في البيت داخل {sign}، التأثير ثابت. ابنِ باستمرار.",
              suitableFor: {
                1: "عمل منتظم وانضباط",
                2: "روتين وخطط بعيدة المدى",
                3: "تنظيم وتقوية الأسس",
              },
              avoid: {
                1: "غياب الهيكلة",
                2: "تحميل النفس فوق الطاقة",
              },
              betterTiming: {
                1: "خطوات صغيرة مستمرة",
                2: "التزم بخطة وتتبّع التقدّم",
              },
            },
            qubul: {
              whatThisMeans: "مع {planet} في القبول داخل {sign}، النتيجة تعتمد على الاختيارات. ابقِ الأمور بسيطة.",
              suitableFor: {
                1: "مهام يومية وصيانة",
                2: "اختبار قبل الالتزام",
                3: "مراجعة وضبط",
              },
              avoid: {
                1: "انتظار دفعة كبيرة دون عمل",
                2: "تعقيد القرارات",
              },
              betterTiming: {
                1: "وضّح الأولويات أولًا",
                2: "تحرّك بوتيرة متزنة",
              },
            },
            wabal: {
              whatThisMeans: "مع {planet} في الوبال داخل {sign}، قد تظهر صعوبة. تقدّم بضبط وحدود.",
              suitableFor: {
                1: "مراجعة وتخفيف الحمل",
                2: "تخطيط منخفض المخاطر",
                3: "عمل داخلي وصبر",
              },
              avoid: {
                1: "قرارات تحت ضغط",
                2: "تصعيد النزاعات",
              },
              betterTiming: {
                1: "انتظر إشارات أوضح",
                2: "قلّل الالتزامات",
              },
            },
            hubut: {
              whatThisMeans: "مع {planet} في الهبوط داخل {sign}، قد تخفت الطاقة. اختر أهدافًا أصغر واحمِ انتباهك.",
              suitableFor: {
                1: "راحة وتعافٍ",
                2: "انتصارات صغيرة",
                3: "دعاء وروتين",
              },
              avoid: {
                1: "الإرهاق",
                2: "طلب نتائج سريعة",
              },
              betterTiming: {
                1: "أجّل البدايات إن أمكن",
                2: "ركّز على الضروري",
              },
            },
          },
        },

        personalized: {
          title: "تأثير مُخصّص",
          lead: "بصفتك طبيعة {{element}} مع {{sign}}، يشكّل هذا العبور كيفية استقبال الطاقة والتعبير عنها.",
          point1: "عمقك الطبيعي يلتقي بنبرة أكثر ظهورًا وتعبيرًا.",
          point2: "قد يبدو التواصل أسرع أو أكثر مباشرة مما اعتدت.",
          point3: "استخدم نقاط قوة عنصرك لموازنة إيقاع هذا العبور ونبرته.",
        },

        context: {
          title: {
            personal: "عبور شخصي",
            collective: "طقس كوني عام",
          },
          desc: {
            personal: "هذا الكوكب يعبر برجك مباشرة — تميل معانيه إلى الظهور بشكل أكثر شخصية في قراراتك وإيقاعك اليومي.",
            collective: "ليس في برجك — اقرأه كطقس عام. انظر أدناه: ماذا يبرز وكيف يصل إليك.",
          },
        },

        lens: {
          badge: {
            personal: "عدسة العبور الشخصي",
            collective: "عدسة العبور العام",
          },
          sections: {
            about: "عن هذا العبور",
            collective: "الأثر العام",
            resonance: "كيف يصل إليك",
            degree: "مرحلة الدرجة",
          },
          collectiveTemplate:
            "عندما يكون {{planet}} في {{sign}}، يبرز معنى {{theme}}. هذا يصف “الطقس” العام الذي يلمسه الجميع بطرق مختلفة.",
          resonanceBase: {
            personal: "لأنه عبور شخصي (يمس برجك مباشرة)، تميل هذه المعاني إلى الظهور بشكل أوضح في قراراتك وإيقاعك اليومي.",
            collective:
              "حتى لو لم يكن في برجك، قد تشعر به عبر ضغط خارجي، تغيّر في الإيقاع، مسؤوليات إضافية، أو تأخير في النتائج.",
          },
          degreePhases: {
            early: "مرحلة التثبيت: الأثر يدخل ويتشكل — يُفضَّل تجنّب القرارات الحاسمة الآن.",
            middle: "مرحلة مستقرة: يمكن البناء بهدوء — الانضباط أوضح نفعًا من العجلة.",
            late: "مرحلة ختامية: ركّز على الإتمام لا البدء — أغلق الملفات قبل فتح أخرى.",
          },
          planetFunction: {
            sun: "الشمس تدل على السلطة والحيوية والوضوح والغاية.",
            moon: "القمر يدل على المزاج والذاكرة والتغذية وإيقاع الحياة اليومية.",
            mercury: "عطارد يدل على الكلام والتجارة والتعلّم وحركة المعلومات.",
            venus: "الزهرة تدل على الانسجام والمودة والجمال وسهولة العلاقات.",
            mars: "المريخ يدل على الاندفاع والصراع والشجاعة والحسم في الفعل.",
            jupiter: "المشتري يدل على النمو والحكمة والكرم والاتساع النافع.",
            saturn: "زحل يدل على البنية والحدود والمسؤولية والزمن والصبر.",
          },
          signThemes: {
            aries: "المبادرة والقيادة والبدايات الجريئة",
            taurus: "الثبات والموارد والبناء المتدرّج",
            gemini: "التواصل والتعلّم وسرعة التبادل",
            cancer: "البيت والحماية والأمان العاطفي",
            leo: "الظهور والهيبة والثقة الإبداعية",
            virgo: "التفاصيل والصحة والتحسين العملي",
            libra: "التوازن والاتفاقات وديناميات العلاقات",
            scorpio: "العمق والحدود والضغط التحويلي",
            sagittarius: "المعتقد والمعرفة والمعنى الأوسع",
            capricorn: "الواجب والمؤسسات والبنية بعيدة المدى",
            aquarius: "الجماعة والابتكار والأنظمة العامة",
            pisces: "الرحمة والحساسية وتفكك الأشكال القديمة",
          },
          elementTails: {
            water: "طبيعة الماء تمتص هذا غالبًا بهدوء لا بمواجهة.",
            fire: "طبيعة النار تشعر به كعجلة — وجّهه إلى فعلٍ واضح.",
            earth: "طبيعة التراب تميل إلى طلب البنية — تنفعها العادات الثابتة.",
            air: "طبيعة الهواء تشعر به ذهنيًا — سمِّ الأولويات لتخفيف التشتت.",
          },
        },

        daily: {
          title: "إرشاد اليوم",
          morning: "هذا الصباح",
          morningText: "ثبّت نيتك قبل الدخول في تواصل جريء.",
          afternoon: "هذا بعد الظهر",
          afternoonText: "وجّه الثقة الإبداعية مع بقاء الحسّ العاطفي حاضرًا.",
          evening: "هذا المساء",
          eveningText: "خفّف حدّة الشدة واستعد الهدوء بالتأمل.",
        },

        signComparison: {
          title: "برجك مقابل برج العبور",
          yourSign: "برجك",
          transitSign: "برج العبور",
          insight: "قد يصنع التباين نموًا قويًا عندما يُوازن بحكمة.",
        },

        balancing: {
          title: "كيف تُوازن هذه الطاقة",
          subtitle: "طرق كلاسيكية من العلوم الروحية الإسلامية",
          methodsLabel: "العلاجات الكلاسيكية",
          repetitions: "التكرارات",
          bestTime: "أفضل وقت",
          startCounter: "ابدأ العدّاد",
          source: "المصدر",
          challenge: "طبيعة {userElement} تلتقي بطاقة {transitElement} — طبّق العلاجات أدناه للثبات.",
          disclaimer: "ممارسات تقليدية للتأمل وتحقيق التوازن.",
          methods: {
            latif: {
              title: "تلاوة اللَّطِيف",
              titleArabic: "اللَّطِيف",
              instruction: "يُتلى تقليديًا لتليين الطاقات المتعارضة وإحضار اللطف. قل: «يا لطيف».",
              numerology: "قيمة الأبجد: 129 (ل=30، ط=9، ي=10، ف=80)",
              bestTime: "بعد الفجر أو في ساعة المشتري",
              source: "ممارسة ذكر كلاسيكية",
            },
            halim: {
              title: "تلاوة الحَلِيم",
              titleArabic: "الحَلِيم",
              instruction: "يُتلى تقليديًا للصبر والحِلم. قل: «يا حليم».",
              numerology: "قيمة الأبجد: 88 (ح=8، ل=30، ي=10، م=40)",
              bestTime: "عند الشعور بالقلق أو التعثّر",
              source: "ممارسة روحية كلاسيكية",
            },
            hajah: {
              title: "صلاة الحاجة",
              titleArabic: "صلاة الحاجة",
              instruction: "أدِّ صلاة الحاجة (ركعتان) واطلب اليسر والتوازن.",
              bestTime: "الثلث الأخير من الليل",
              source: "السنة النبوية",
            },
            letters: {
              title: "تأمل الحروف المتوازنة",
              titleArabic: "تأمل الحروف المتوازنة",
              instruction: "تأمل الحرفين م و ن معًا رمزًا للتوازن. اكتبْهما برفق وتأمل.",
              bestTime: "في لحظات الصراع الداخلي",
              source: "علم الحروف التقليدي",
            },
            mubin: {
              title: "تلاوة المُبِين",
              titleArabic: "المُبِين",
              instruction: "يُتلى تقليديًا للوضوح والهداية. قل: «يا مبين».",
              numerology: "قيمة الأبجد: 102 (م=40، ب=2، ي=10، ن=50)",
              bestTime: "بعد العصر",
              source: "ممارسة صوفية كلاسيكية",
            },
            shukr: {
              title: "ذكر الشكر",
              titleArabic: "ذِكر الشُكر",
              instruction: "ردد «الحمد لله» بامتنان لتقوية الانسجام.",
              bestTime: "طوال اليوم",
              source: "توجيه قرآني (14:7)",
            },
            hakim: {
              title: "تلاوة الحَكِيم",
              titleArabic: "الحَكِيم",
              instruction: "يُتلى تقليديًا لطلب الحكمة والتوازن. قل: «يا حكيم».",
              numerology: "قيمة الأبجد: 78 (ح=8، ك=20، ي=10، م=40)",
              bestTime: "الأربعاء في ساعة عطارد",
              source: "علم الحروف التقليدي",
            },
            istighfar: {
              title: "الاستغفار",
              titleArabic: "الاستغفار",
              instruction: "ردد «أستغفر الله العظيم» لتصفية القلب وتجديد النية.",
              bestTime: "وقت السحر قبل الفجر",
              source: "السنة النبوية",
            },
            salawat: {
              title: "الصلاة على النبي",
              titleArabic: "الصلاة على النبي",
              instruction: "ردد: «اللهم صلِّ على محمد» لطلب البركة والتوازن.",
              bestTime: "الجمعة وبعد الصلوات",
              source: "أمر قرآني (33:56)",
            },
          },
        },

        // الممارسة الروحية (الإطار الكلاسيكي القائم على الدرجات)
        spiritual: {
          title: "الممارسة الروحية",
          phaseLabel: {
            entry: "دخول",
            strength: "فعّال",
            exit: "خروج",
          },
          status: {
            entry: "التأثير يتشكّل. ركّز على التطهير لا الفعل.",
            strength: "هذا العبور في أوج قوته. العمل الروحي مدعوم.",
            exit: "التأثير يتلاشى. اختم واحمِ، لا تبدأ جديدًا.",
          },
          guidance: {
            entry: "ركّز على الاستغفار والذكر العام (لا إله إلا الله). تجنّب ربط النيات أو بدء أعمال روحية كبيرة.",
            strength: "أفضل وقت للذكر المركّز والدعاء. التركيز الروحي: ${focusText}",
            exit: "اختم ما بدأته. ركّز على الذكر الحامي والصلوات والشكر. تجنّب المبادرات الروحية الجديدة.",
          },
          focus: {
            sun: "التوحيد والغاية ووضوح النية",
            moon: "التوازن العاطفي والحدس",
            mercury: "العلم والكلام والتعلّم",
            venus: "الانسجام والمحبة والجمال",
            mars: "الشجاعة والانضباط وإزالة العوائق",
            jupiter: "التوسع والرزق والحكمة",
            saturn: "الصبر والتحمل وإصلاح الأثر",
          },
          avoid: {
            sun: "تضخم الأنا والغرور",
            moon: "القرارات المبنية على المزاج",
            mercury: "النميمة وكثرة التفكير",
            venus: "الإفراط في الملذات والتعلق",
            mars: "الغضب والتهور",
            jupiter: "الكبر والإسراف",
            saturn: "الأعمال الثقيلة دون إرشاد واليأس",
          },
          recommendedDhikr: "الذكر الموصى به",
          entryNote: "في مرحلة الدخول، ركّز على الذكر العام مثل لا إله إلا الله",
          exitNote: "في مرحلة الخروج، ركّز على الذكر الحامي والصلوات",
          disclaimer: "للتأمل لا للفتوى. مبني على التراث الإسلامي الروحي الكلاسيكي.",
        },
        // ─────────────────────────────────────────────────────────────────────
        // الممارسة الروحية المُحسّنة (مراتب الذكر + توقيت الساعة الفلكية)
        // نظام العَدَد الكلاسيكي مع تحسين التوقيت
        // ─────────────────────────────────────────────────────────────────────
        practice: {
          title: "الممارسة الروحية",
          phase: {
            entry: "دخول",
            strength: "فعّال",
            exit: "خروج",
          },
          counts: {
            title: "العدد الموصى به",
            tier: {
              quick: "سريع",
              standard: "معتدل",
              deep: "عميق",
            },
            estimate: "~{minutes} دقيقة",
          },
          timing: {
            title: "أفضل وقت",
            nextPlanetHour: "ساعة {planet} القادمة: {start}–{end}",
            in: "خلال {time}",
            tomorrow: "غدًا",
            activeNow: "نشط الآن حتى {end}",
            unavailable: "بيانات الساعة الفلكية غير متاحة",
          },
          strength: {
            peak: "ذروة",
            strong: "قوي",
            supportive: "مؤيد",
            gentle: "لطيف",
          },
          fallback: {
            title: "إن لم تستطع الانتظار",
            afterPrayer: "أدِّ المرتبة السريعة بعد الصلاة القادمة.",
          },
          disclaimer: "للتأمل لا للفتوى. مبني على التراث الإسلامي الروحي الكلاسيكي.",
        },

        history: {
          title: "تاريخ العبور",
          previous: "البرج السابق",
          next: "البرج التالي",
          estimated: "تقديري",
          current: "هنا الآن",
        },
      },
    },
    
    // Home screen modules
    modules: {
      whoAmI: {
        title: "مَن أنا",
        description: "تحليل ذاتي عميق عبر علم الحروف: العنصر والشخصية والمهنة والمسار الروحي",
      },
    },
    
    // Who Am I module (istikhara key for compatibility)
    istikhara: {
      title: "مَن أنا",
      titleArabic: "مَن أنا",
      subtitle: "اكتشف ذاتك الحقيقية",
      formInstruction: "أدخل اسمك واسم والدتك للتحليل العميق",
      
      // محدد الطريقة
      methodSelector: {
        label: "اختر طريقة الحساب:",
        nameBased: {
          title: "بالاسم",
          badge: "كلاسيكي",
          description: "الطريقة التقليدية لعلم الحروف باستخدام اسمك + اسم الأم",
        },
        birthDate: {
          title: "تاريخ الميلاد",
          badge: "سريع",
          description: "طريقة مبسطة باستخدام تاريخ ميلادك فقط",
        },
      },
      
      // نموذج تاريخ الميلاد
      birthDateForm: {
        selectDate: "اختر تاريخ ميلادك",
        tapToSelect: "اضغط لاختيار تاريخ ميلادك",
        pleaseSelect: "يرجى اختيار تاريخ ميلادك",
        birthTime: "وقت الميلاد (اختياري)",
        birthTimeHint: "أضف وقت ميلادك لفتح حسابات الطالع والغارب",
        tapToSetTime: "اضغط لتحديد وقت الميلاد (إن كان معروفًا)",
        birthLocation: "مكان الميلاد (اختياري)",
        birthLocationHint: "أضف مدينة ميلادك لحساب دقيق للطالع",
        searchCity: "ابحث عن مدينة...",
        whatYouDiscover: "ما ستكتشفه:",
        sunSign: "برجك الشمسي",
        elementalNature: "طبيعتك العنصرية",
        moonSign: "برج القمر (الموضع القمري)",
        ascendant: "الطالع (البرج الصاعد)",
        descendant: "الغارب",
        unlockHint: "أضف وقت ومكان الميلاد أعلاه لفتح الطالع والغارب",
        yearNotNeeded: "السنة ليست مطلوبة للحسابات الأساسية",
        monthLabel: "الشهر (1-12)",
        dayLabel: "اليوم (1-31)",
        useFullDate: "استخدم التاريخ الكامل",
        useMonthDayOnly: "الشهر واليوم فقط",
        fullDateDesc: "للتحليل الكامل مع برج القمر",
        monthDayDesc: "حساب البرج السريع فقط",
      },

      educationTitle: "ما هو علم الحروف؟",
      discoveryTitle: "ما ستكتشفه",
      examplesTitle: "أمثلة على الأسماء",
      privacyTitle: "خصوصيتك",
      arabicName: "الاسم بالعربية",
      helperText: "يجب أن تكون الأسماء بالخط العربي للحصول على نتائج دقيقة",
      form: {
        personName: "اسمك",
        motherName: "اسم الأم",
        latinName: "الاسم باللاتينية",
        calculateButton: "اكتشف ذاتي",
      },
      validation: {
        missingNames: "يرجى إدخال كلا الاسمين للمتابعة",
        nameRequired: "الاسم مطلوب",
      },

      // نتائج "مَن أنا"
      results: {
        tabs: {
          overview: "نظرة عامة",
          personality: "الشخصية",
          career: "المهنة",
          blessedDay: "اليوم المبارك",
          spiritual: "الممارسة الروحية",
          health: "الصحة",
        },
      },

      // تبويب التنبيه الصحي
      health: {
        title: "التنبيه الصحي",
        subtitle: "حكمة تقليدية لطبيعتك الروحية (ليست نصيحة طبية)",
        sections: {
          watchOutFor: "⚠️ انتبه لـ",
          thingsToAvoid: "🚫 تجنّب",
          foodsThatHelpYou: "🍎 أطعمة نافعة لك",
          spiritualProtection: "🛡️ حماية روحية",
          westAfricanTraditions: "🌍 تقاليد غرب إفريقيا",
        },
        disclaimer: "💡 هذه إرشادات روحية تقليدية وليست نصيحة طبية. للمشكلات الصحية استشر مختصًا مؤهلًا.",
        empty: {
          title: "التنبيه الصحي",
          text: "لا توجد بيانات لهذا البرج بعد.",
        },
        a11y: {
          toggle: "توسيع أو طي قسم التنبيه الصحي",
        },
      },
    },
    
    // Asrariya Practice Timing
    asrariya: {
      title: "توقيت الممارسات",
      subtitle: "اكتشف أفضل الأوقات لممارساتك الروحية",
      selectPractice: "اختر الممارسة",
      currentTiming: "تحليل التوقيت الحالي",
      noProfile: "أكمل ملفك الشخصي للحصول على توقيت مُخصّص",
      practices: {
        protection: "الحماية",
        protectionDesc: "احمِ نفسك من الأذى الروحي والجسدي",
        healing: "الشفاء",
        healingDesc: "استعد انسجام الجسد والعقل والروح",
        manifestation: "التجلّي",
        manifestationDesc: "حقّق نواياك",
        guidance: "الهداية",
        guidanceDesc: "اطلب التوجيه والوضوح في طريقك",
        gratitude: "الشكر",
        gratitudeDesc: "عبّر عن الامتنان والتقدير",
        knowledge: "العلم",
        knowledgeDesc: "اسعَ للتعلّم والفهم",
        provision: "الرزق",
        provisionDesc: "اطلب القوت والوفرة",
        general: "ممارسة عامة",
        generalDesc: "تطوّر روحي متوازن",
      },
      timing: {
        optimal: "مثالي",
        favorable: "مُناسب",
        moderate: "معتدل",
        challenging: "صعب",
        avoid: "تجنّب",
      },
      layers: {
        element: "توافق العنصر",
        planetary: "الرنين الكوكبي",
        manazil: "المنزل القمري",
        practice: "توافق الممارسة",
      },
      recommendation: "التوصية",
      overallScore: "الدرجة الإجمالية",
      personalizedFor: "مُخصّص لملفك الروحي",
      analyzing: "جارٍ تحليل التوقيت...",
      timingAnalysis: "تحليل التوقيت لك",
      overallTimingQualityTitle: "جودة التوقيت الإجمالية",
      overallTimingQualityHint: "يجمع كل العوامل الروحية لهذه اللحظة",
      optimalUntil: "النافذة المثالية حتى",
      errors: {
        unableToCalculateTiming: "تعذّر حساب التوقيت",
        unableToLoadAnalysis: "تعذّر تحميل التحليل",
      },
      whyThisRating: "لماذا هذا التقييم؟",
      breakdown: {
        rulingPlanetStrength: "قوة كوكب الحاكم",
        rulingPlanetStrengthDesc: "توافق كوكبك الحاكم مع حاكم اليوم (30% من الرنين الكوكبي، مدرج في النسبة المئوية الإجمالية)",
        todaysRulerTitle: "حاكم اليوم ({planet})",
        todaysRulerFallback: "حاكم اليوم",
        todaysRulerStrong: "{planet}{arabic} قوي جدًا اليوم. طاقة يوم ممتازة لكل ما يتعلق بـ {planet}.",
        todaysRulerGood: "{planet}{arabic} قوي اليوم. طاقة يوم مناسبة لأعمال {planet}.",
        todaysRulerModerate: "{planet}{arabic} قوته متوسطة اليوم. تابع بوعي في أنشطة {planet}.",
        todaysRulerWeak: "{planet}{arabic} ضعيف اليوم. فكّر في أيام أخرى لأعمال {planet} الكبيرة.",
        todaysRulerVeryWeak: "{planet}{arabic} ضعيف جدًا اليوم. تجنّب القرارات أو الأعمال الكبيرة المرتبطة بـ {planet}.",
      },
      whatThisMeans: "ماذا يعني هذا لك",
      recommended: "موصى به الآن",
      cautions: "انتبه لـ",
      betterTiming: "توقيت أفضل",
    },
    
    // Unified Timing Badges
    timing: {
      compatible: "متوافق",
      ratings: {
        excellent: "وقت ممتاز",
        good: "وقت جيد",
        moderate: "تابع بوعي",
        weak: "تابع بحذر",
        unfavorable: "وقت غير مناسب",
      },

      shortDescriptions: {
        veryStrong: "ساعة {planet} قوية جدًا",
        strong: "ساعة {planet} قوية",
        moderate: "ساعة {planet} متوسطة",
        weak: "ساعة {planet} ضعيفة",
        veryWeak: "ساعة {planet} ضعيفة جدًا",

        perfectAlignment: "انسجام تام",
        supportiveFlow: "تدفق داعم",
        neutral: "طاقة محايدة",
        minorTension: "توتر عنصري طفيف",
      },

      guidance: {
        recommended: "موصى به:",
        goodFor: "مناسب لـ:",
        approach: "النهج:",
        avoid: "تجنب:",
        betterTiming: "توقيت أفضل:",
      },
      badges: {
        optimal: {
          label: "وقت ممتاز",
          action: "وقت ممتاز — تقدّم بثقة",
          description: "هذه من أفضل نوافذك. جميع العوامل تتناغم بشكل جميل.",
          hint: "توافق ممتاز — تقدّم بثقة",
        },
        act: {
          label: "وقت جيد",
          action: "وقت جيد — تقدّم",
          description: "الظروف المواتية تدعم ممارستك. تقدّم بنية صادقة.",
          hint: "ظروف مواتية — تصرّف بنية",
        },
        maintain: {
          label: "تابع بوعي",
          action: "قابل للتطبيق — ابقَ منتبهًا",
          description: "هذا التوقيت قابل للتطبيق لكنه يتطلب وعيًا. يوجد بعض التوتر.",
          hint: "توقيت قابل للتطبيق — حافظ على التوازن",
        },
        careful: {
          label: "تابع بحذر",
          action: "صعب — تقدّم فقط إذا لزم الأمر",
          description: "هذا ليس وقتك الطبيعي. إذا كان لا بد من المتابعة، أضف ممارسات التأريض.",
          hint: "طاقات صعبة — تقدّم بحذر",
        },
        hold: {
          label: "وقت غير مناسب",
          action: "الأفضل الانتظار — انظر البدائل",
          description: "عوامل معارضة قوية. إلا في حالة الضرورة، انتظر نافذة أفضل.",
          hint: "انتظر توقيتًا أفضل",
        },
      },
    },
    
    onboarding: {
      // Welcome/Splash Screen
      splash: {
        appName: "أسراريا",
        subtitle: "✦ عِلْم الحُرُوف ✦",
        description: "اكتشف علم الحروف والأسماء الإلهية من خلال الحكمة القديمة والتوقيت الكوني",
        features: {
          calculator: "حاسبة الاسم المقدس",
          timing: "إرشاد التوقيت الإلهي",
          insights: "رؤى شخصية",
        },
        getStarted: "ابدأ",
      },
    },
    
    prayerGuidance: {
      title: "إرشاد الصلاة",
      subtitle: "ممارسات الساعات الكوكبية الكلاسيكية من مصادر تقليدية",
      hours: {
        recommendedWorks: "الأعمال الموصى بها",
        avoidWorks: "أعمال يُتجنّب فعلها",
      },
      ui: {
        headerSubtitle: "إرشاد روحي مُخصّص مبني على العلوم الإسلامية الكلاسيكية",
        currentHour: "الساعة الحالية: {planet} {arabicName}",
        currentHourLabel: "الساعة الحالية",
        hourOfTwelve: "الساعة {number}/12",
        day: "نهار",
        night: "ليل",
        generating: "جارٍ توليد الإرشاد...",

        forEveryone: "للجميع",
        forPractitioners: "للممارسين",
        primaryFocus: "أساسي",
        spiritualPrimary: "الممارسة الروحية هي الأساس؛ والمواءمة الدنيوية ثانوية.",
        dhikrTitle: "ذكر مُوصى به",
        quranTitle: "تلاوة قرآنية",
        duaTitle: "أدعية مُوصى بها",
        intentionsTitle: "النّوايا الروحية (النية)",
        sunnahTitle: "ممارسات السنّة",
        adabTitle: "الآداب الصحيحة",
        expandAdvanced: "عرض الإرشاد المتقدم",
        collapseAdvanced: "إخفاء الإرشاد المتقدم",
        classicalReferences: "مراجع تقليدية",
        traditionalContext: "السياق التقليدي",
        naturalAlignment: "التوافق الطبيعي",

        profileHintTitle: "أكمل ملفك الشخصي لتخصيص الإرشاد",
        profileHintBody: "أضف اسمك العربي في الملف الشخصي حتى نتمكن من حساب بصمتك الأبجدية وعنصرك.",
        goToProfile: "اذهب إلى الملف الشخصي",
        missingArabicName: "مفقود: الاسم العربي",

        emptyTitle: "اختر صلاة",
        emptyBody: "اختر صلاة أعلاه للحصول على إرشاد روحي مُناسب لملفك الأبجدي والساعة الكوكبية الحالية.",

        footerBasedOn: "✨ إرشاد مبني على قيمة الأبجد ({abjad}) والعنصر ({element})",
        sources: "المصادر: {source}",

        spiritualContext: "السياق الروحي",
        yourElement: "عنصرك",
        hourNumber: "رقم الساعة",
        timeRemaining: "الوقت المتبقي",
        dayRuler: "حاكم اليوم",
        next: "التالي",
        current: "الحالي",
        selectPrayer: "اختر صلاة",
        changePrayer: "تغيير",
        guidanceFor: "صلاة {prayer}",

        recommendedDivineName: "الاسم الإلهي الموصى به",
        reciteCount: "ردّد {count}×",
        abjadValueLabel: "قيمة الأبجد: {value}",
        showReasoning: "▶ عرض السبب",
        hideReasoning: "▼ إخفاء السبب",
        planetaryAlignment: "🪐 توافق كوكبي:",
        elementalResonance: "💫 رنين عنصري:",
        numerologicalSignificance: "🔢 دلالة عددية:",
        classicalSource: "📚 مصدر كلاسيكي:",
        spiritualBenefits: "✨ فوائد روحية:",

        classicalWisdom: "حكمة كلاسيكية",
        noClassicalGuidance: "لا توجد إرشادات كلاسيكية محددة لهذه الساعة",
        modernContext: "في سياق اليوم",
        modernContextExplanation: "تشير هذه المصطلحات الكلاسيكية إلى ممارسات روحية يمكن فهمها بطرق معاصرة—تحديد النوايا، وإنشاء روتينات مفيدة، والعمل مع الرموز والممارسات الإيجابية.",
        show: "إظهار",
        hide: "إخفاء",

        sunnahAdhkar: "أذكار السنة",
        noAdhkarAvailable: "لا توجد أذكار متاحة",
        showTranslation: "إظهار الترجمة",
        hideTranslation: "إخفاء الترجمة",
        progressCompleted: "{completed} / {total} مكتمل",
        resetAll: "إعادة تعيين الكل",

        dhikrCounter: "عداد الذكر",
        percentComplete: "{percent}% مكتمل",
        completedAlhamdulillah: "✨ اكتمل! الحمد لله ✨",
        complete: "✓ اكتمل",
        tapToCount: "اضغط للعد",
        reset: "إعادة تعيين",
        dhikrHelper: "اضغط على الزر في كل مرة تذكر فيها الاسم الإلهي",
      },
    },

    // ============================================================================
    // PREMIUM SECTIONS - عناوين ووصف لمكونات PremiumSection
    // ============================================================================
    premiumSections: {
      // Who Am I / Istikhara Overview
      spiritualDetails: {
        title: "التفاصيل الروحية",
        description: "افتح ممارسات روحية أعمق",
      },
      // Prayer Guidance
      prayerGuidance: {
        title: "إرشاد الصلاة",
        description: "افتح ممارسات روحية مخصصة",
      },
      // Compatibility - Person to Person
      soulConnection: {
        title: "اتصال الأرواح",
        description: "استكشف الرابطة الروحية بين الأرواح",
      },
      harmonyAnalysis: {
        title: "تحليل الانسجام",
        description: "اكتشف الانسجام العنصري والكوني",
      },
      personalizedAdvice: {
        title: "نصائح مخصصة",
        description: "احصل على توصيات عملية",
      },
      compatibilitySummary: {
        title: "ملخص التوافق",
        description: "افتح التفسير التفصيلي",
      },
      // Compatibility - Person to Divine Name / Divine Name to Intention
      divineGuidance: {
        title: "الإرشاد الإلهي",
        description: "اكتشف التجلي والحكمة الروحية",
      },
      practiceGuide: {
        title: "دليل الممارسة",
        description: "تعلم طرق التلاوة التقليدية",
      },
      practiceGuidance: {
        title: "إرشاد الممارسة",
        description: "تعلم كيفية العمل مع هذا الاسم الإلهي",
      },
      // Divine Timing
      aiGuidance: {
        title: "إرشاد الذكاء الاصطناعي",
        description: "احصل على إرشاد روحي مخصص",
      },
      // Moment Alignment Detail
      personalGuidance: {
        title: "إرشاد شخصي",
        description: "اكتشف الأعمال المفضلة الآن",
      },
      // Daily Guidance Details
      bestFor: {
        title: "الأفضل لـ",
        description: "إرشاد العمل الشخصي",
      },
      // Name Destiny Results
      aiEnhancement: {
        title: "تحسين الذكاء الاصطناعي",
        description: "تفسير شخصي لاسمك",
      },
      divineNameResonance: {
        title: "رنين الأسماء الإلهية",
        description: "اكتشف أسماءك الإلهية المتناغمة",
      },
      quranResonance: {
        title: "الرنين القرآني",
        description: "اكتشف الآيات التي تتناغم مع اسمك",
      },
      keyTakeaways: {
        title: "النقاط الرئيسية",
        description: "إرشاد عملي لمسارك",
      },
      // Manazil
      manazilPractices: {
        title: "ممارسات المنازل",
        description: "افتح الممارسات التقليدية لهذا المنزل",
      },
      // Planet Transit Details
      transitGuidance: {
        title: "إرشاد العبور",
        description: "رؤى مخصصة لعبور الكواكب",
      },
      planetaryPractices: {
        title: "الممارسات الكوكبية",
        description: "ممارسات روحية لهذا العبور",
      },
      // Calculator Enhanced Results
      advancedAnalysis: {
        title: "تحليل متقدم",
        description: "رؤى عددية أعمق",
      },
      // Results (Istikhara Results tabs)
      personality: {
        title: "رؤى الشخصية",
        description: "اكتشف سماتك الشخصية العميقة",
      },
      career: {
        title: "إرشاد المسار المهني",
        description: "اتجاه المهنة بناءً على ملفك الروحي",
      },
      blessedDay: {
        title: "يومك المبارك",
        description: "اكتشف يومك الأكثر ملاءمة",
      },
      spiritualPractice: {
        title: "الممارسة الروحية",
        description: "ممارسات روحية مخصصة",
      },
      // Name Destiny Results additional
      aiPersonalization: {
        title: "التخصيص بالذكاء الاصطناعي",
        description: "احصل على تفسير مخصص بالذكاء الاصطناعي لعنصرك",
      },
      spiritualGuidanceInsights: {
        title: "الإرشاد الروحي",
        description: "رؤى مخصصة وإرشاد عملي لمسارك",
      },
      // Planet Transit Details additional
      personalizedImpact: {
        title: "التأثير المخصص",
        description: "اكتشف كيف يؤثر هذا العبور على طبيعتك العنصرية",
      },
      personalizedInsights: {
        title: "رؤى مخصصة",
        description: "اكتشف طبيعتك، الإرشاد اليومي، طرق التوازن، والمزيد",
      },
      // Daily Guidance Details additional
      bestActionsToday: {
        title: "أفضل الأعمال اليوم",
        description: "اكتشف الأنشطة التي تتوافق مع طاقة اليوم",
      },
      // Relationship Compatibility
      interpretation: {
        title: "التفسير",
        description: "اكتشف ما تعنيه هذه العلاقة لك",
      },
      spiritualAnalysis: {
        title: "التحليل الروحي",
        description: "استكشف الرابطة الروحية العميقة",
      },
      elementalAnalysis: {
        title: "التحليل العنصري",
        description: "افهم انسجام الطاقات الطبيعية",
      },
      planetaryAnalysis: {
        title: "التحليل الكوكبي",
        description: "اكتشف التأثيرات الكونية",
      },
      // Calculator Enhanced Results additional
      deepNumerologicalAnalysis: {
        title: "تحليل عددي معمق",
        description: "افتح رؤى الذكاء الاصطناعي، التركيب العنصري، وطرق الحساب المتقدمة",
      },
      // AI Guidance (Divine Timing)
      aiSpiritualGuidance: {
        title: "إرشاد روحي بالذكاء الاصطناعي",
        description: "احصل على إرشاد مخصص بناءً على ملفك الروحي والتوقيت الحالي",
      },
      // Manazil additional
      spiritualPractices: {
        title: "الممارسات الروحية",
        description: "أذكار، ملائكة، آيات قرآنية، ووفق لهذا المنزل",
      },
    },

    home: {
      nextPlanetHour: "الساعة الكوكبية التالية",
      startsAt: "تبدأ عند",
      planetTransitDetails: {
        title: "عبور الكواكب",
        explainers: {
          tomorrowRuler: "يعرض حاكم كوكب الغد (تأثير يوم الأسبوع) وكيف يتفاعل مع طبيعتك الروحية.",
        },
        subtitleNextDay: "حاكم الغد — مُخصّص حسب ملفك",
        error: "تعذر تحميل التفاصيل الآن.",
        nextChange: "التغيير التالي بعد {countdown}",
        sections: {
          tomorrowRuler: "حاكم الغد",
          yourNature: "طبيعتك",
        },
        pills: {
          element: "العنصر",
          dayRuler: "حاكم اليوم",
        },
        missingProfile: "أضف تاريخ ميلادك لتخصيص هذه الرؤى.",
        completeProfile: "أكمل الملف",
        resonanceNoProfile: "أكمل ملفك لرؤية رنين مُخصّص.",
        harmony: {
          harmonious: {
            label: "منسجم",
            description: "توافق قوي: طبيعتك {userElement} تنسجم مع طاقة {contextElement}.",
          },
          supportive: {
            label: "داعمة",
            description: "تدفق داعم: عنصرك {userElement} يستفيد من طاقة {contextElement}.",
          },
          neutral: {
            label: "متوازن",
            description: "مزيج متوازن: عنصرك {userElement} يلتقي {contextElement} دون احتكاك.",
          },
          challenging: {
            label: "تحويلي",
            description: "توتر تحويلي: طبيعتك {userElement} تلتقي طاقة {contextElement} المقابلة.",
          },
        },
        disclaimer: "للتأمل فقط • ليس حكمًا شرعيًا",
        influenceEngine: {
          personalInfluence: "التأثير الشخصي",
          collectiveInfluence: "التأثير الجماعي",
          collectiveImpact: "التأثير الجماعي",
          cosmicWeather: "الطقس الكوني",
          forYou: "لك",
          howRelates: "كيف يتعلق بك",
          detailedGuidance: "إرشادات مفصلة",
          guidanceDescription: "نصائح شخصية لهذا التأثير الكوكبي",
          bestForNow: "الأفضل الآن",
          betterToAvoid: "من الأفضل تجنبه",
          reflectivePractices: "ممارسات روحية",
        },
      },
    },

    prayerTimes: {
      title: "أوقات الصلاة",
      next: "التالي",
      inTime: "بعد {{time}}",
      noPrayer: "لا صلاة",
      getGuidance: "احصل على إرشاد الصلاة",
      tapForGuidance: "اضغط لرؤية إرشاد الصلاة",
      calculationMethod: "طريقة الحساب",
      method: {
        mwl: "رابطة العالم الإسلامي",
      },
      timesBasedOnLocation: "يتم حساب الأوقات بناءً على موقعك الحالي والمنطقة الزمنية.",
      configureAdhan: "إعداد إشعارات الأذان",
    },

    momentDetail: {
      cards: {
        currentHour: "الساعة الكوكبية الحالية",
        yourPlanet: "كوكبك",
        transitConditions: "ظروف العبور",
        alignmentAnalysis: "تحليل المحاذاة",
        whatThisMeans: "ماذا يعني هذا",
        excellentFor: "ممتاز لـ",
        avoidNow: "يُفضّل تجنّب",
        showTimeline: "عرض الجدول الزمني الكامل",
        hourEndsIn: "تنتهي الساعة خلال",
        nextHour: "الساعة التالية",

        status: {
          act: "وقت ممتاز",
          maintain: "محايد",
          hold: "تابع بحذر",
          act_desc: "ساعة الشمس أو المشتري أو الزهرة — تابع بثقة",
          maintain_desc: "ساعة القمر أو عطارد — استمر بثبات",
          hold_desc: "ساعة زحل أو المريخ — تحلَّ بالصبر",
        },

        transit: {
          dignity: "المنزلة",
          house: "البيت",
          strength: "قوة الساعة الحالية",
          overallNote: "عبور {planet} العام: {quality}. اضغط للتفاصيل →",
          positionalPower: "القوة الموضعية",
          positionalSubtext: "بناءً على موضع البيت والمنزلة (للعمل الآن)",
          transitQuality: "جودة العبور",
          transitQualitySubtext: "القوة الكوكبية الإجمالية (تناسب طبيعتك)",
          explanation: "القوة الموضعية {positional}، بينما جودة العبور {quality}",
          viewFullAnalysis: "عرض التحليل الكامل لعبور {planet} →",
          angular: "زاوي",
          succedent: "تالي",
          cadent: "ساقط",
          house_10_angular: "البيت العاشر - المهنة والمكانة",
          exceptional: "قوة استثنائية",
          strong: "وضع قوي",
          moderate: "متوسطة",
          weak: "ضعيفة",
        },

        analysis: {
          planetaryFriendship: "الانسجام الكوكبي",
          planetaryResonance: "الرنين الكوكبي",
          samePlanet: "نفس الكوكب",
          highIntensity: "كثافة عالية",
          elementalHarmony: "الانسجام العنصري",
          transitStrength: "قوة الساعة الحالية",
          strong: "قوية",
          moderate: "متوسطة",
          weak: "ضعيفة",
          exceptional: "استثنائية",
        },

        source: {
          nameMotherPersonal: "المصدر: الاسم + الأم (شخصي)",
          birthChart: "المصدر: الخريطة الولادية",
        },
      },
      authenticTiming: {
        title: "التوقيت الأصيل",
        hourRuler: "قوة حاكم الساعة",
        elemental: "العلاقة العنصرية",
        opening: "إرشاد ساعة {planet} (للتأمل).",
        nextHour: "الساعة التالية: يبدأ {planet} بعد {minutes} د.",

        timingAnalysisTitle: "تحليل التوقيت",
        planetaryConditionsTitle: "الظروف الكوكبية",
        dignityLabel: "الكرامة",
        positionLabel: "الموضع الفلكي",
        strengthLabel: "الحالة",
        interpretationLabel: "التفسير",
        whyThisStatusTitle: "لماذا هذا الوضع؟",
        showDetails: "عرض التفاصيل",
        hideDetails: "إخفاء التفاصيل",
        noEnhancements: "لا توجد تحسينات محددة مقترحة الآن.",
        noCautions: "لا توجد تنبيهات لهذا التوقيت.",
        recommendedLabel: "مستحسن",
        cautionsLabel: "تنبيهات",
        personalPlanetLabel: "كوكبك",
        personalElementLabel: "عنصرك",
        factors: {
          elementCompatibility: "الانسجام العنصري",
          planetaryResonance: "الرنين الكوكبي",
          manazilAlignment: "محاذاة المنازل",
          practiceMapping: "مطابقة الممارسة",
        },
      },
      timeline: {
        in: "بعد",
      },
    },

    widgets: {
      dailyEnergy: {
        title: "طاقة اليوم",
        todaysElement: "عنصر اليوم",
        dayRuler: "حاكم اليوم",
        bestFor: "الأفضل لـ",
        todaysFocus: "تركيز اليوم",
        forReflection: "للتأمل",
        viewDetails: "عرض التفاصيل",
        windows: {
          neutral: "فترة متوازنة",
          favorable: "نافذة ملائمة",
          transformative: "نافذة تحول",
          delicate: "توقيت لطيف",
        },
        energyDescriptions: {
          fire: "ديناميكي ومنشط",
          water: "متدفق وعاطفي",
          air: "ذهني وتواصلي",
          earth: "مؤسس ومنظم",
        },
        planetaryFocus: {
          saturn: "أكمل ما بدأته، وابنِ أساسًا متينًا",
          jupiter: "وسّع آفاقك، واغتنم الفرص",
          mars: "اتخذ خطوة جريئة وكن حازمًا",
          venus: "اعتنِ بالعلاقات وقدّر الجمال",
          mercury: "تواصل بوضوح وتعلّم شيئًا جديدًا",
          moon: "اتبع حدسك واعتنِ بمشاعرك",
          sun: "قد بثقة وعبّر عن نفسك",
        },
      },
      manazil: {
        title: "المنازل",
        badge: "رنينك",
        completeProfile: "أكمل الملف",
        advancedPractices: "ممارسات متقدمة",
        todaysMansion: "منزلة اليوم",
        yourMansion: "منزلتك",
        dailyElement: "عنصر اليوم",
        yourElement: "عنصرك",
        resonanceLabel: "الرنين",
        guidanceLabel: "إرشاد",
        understandResonance: "عرض التفاصيل →",
        favorable: "ملائم",
        balanced: "متوازن",
        delicate: "لطيف",
        resonanceLevels: {
          supportive: "داعمة",
          harmonious: "منسجمة",
          neutral: "متوازنة",
          challenging: "صعبة",
          transformative: "تحويلية",
        },
        guidanceByResonance: {
          supportive: "انسجام قوي اليوم. تحرّك بثقة وحافظ على الزخم.",
          harmonious: "توافق مساعد. تعاون، تعلّم، وابنِ بخطوات ثابتة.",
          neutral: "توازن عام. نيتك تحدد النتيجة—اختر الوضوح.",
          challenging: "قد يظهر احتكاك. بسّط، أنجز الأساسيات، وكن لطيفًا.",
          transformative: "توتر مرتفع قد يفتح بابًا للنمو. تمهّل واختر الحكمة.",
        },
        realTime: "فوري",
        approximate: "تقريبي",
        currentMansion: "المنزل الحالي:",
        yourBaseline: "أساسك",
        reflection: "للتأمل",
        today: "🌙 منازل اليوم: {name}",
        todayApprox: "≈ منازل اليوم (تقريبي): {name}",
        personal: "منزل أساسك: {name}",
        personalMissing: "🧿 منزلك: أكمل الملف الشخصي",
        personalizedFor: "مُخصّص لـ",
        resonance: {
          harmonious: "التوافق: قوي",
          supportive: "التوافق: داعم",
          challenging: "التوافق: صعب",
          neutral: "التوافق: متوازن",
        },
        advice: {
          bestForLabel: "مناسب لـ",
          avoidLabel: "تجنب",
          bestForShort: {
            fire: "مبادرة",
            water: "إصلاح لطيف",
            air: "تخطيط واضح",
            earth: "تنظيم وإتمام",
          },
          bestFor: {
            fire: "البدء والمبادرة والعمل الشجاع",
            water: "التأمل والتهدئة والشفاء",
            air: "التعلم والتواصل والتخطيط",
            earth: "الثبات والتنظيم وإكمال المهام",
          },
          avoid: {
            fire: "الاندفاع والخصام والإرهاق",
            water: "الضغط العاطفي وتحمل أكثر من اللازم",
            air: "الإفراط في التفكير والتشتت",
            earth: "العناد والجمود والتأجيل",
          },
          resonance: {
            harmonious: "انسجام قوي مع منزلك الشخصي—تقدم بثقة.",
            supportive: "اليوم يدعم أساسك—خطوات ثابتة.",
            challenging: "قد يكون اليوم متوتراً—خفف الإيقاع وبسّط.",
            neutral: "توازن عام—اختر الخطوة الأوضح.",
          },
        },
        compactAdvice: "اغتنم الفرص المتوافقة",
        cta: "عرض التفاصيل →",
      },
    },
    
    // Moon Phase System
    moon: {
      phases: {
        new: "المحاق",
        waxing_crescent: "الهلال المتزايد",
        first_quarter: "التربيع الأول",
        waxing_gibbous: "الأحدب المتزايد",
        full: "البدر",
        waning_gibbous: "الأحدب المتناقص",
        last_quarter: "التربيع الثاني",
        waning_crescent: "الهلال المتناقص",
      },
      
      phasesArabic: {
        new: "المحاق",
        waxing_crescent: "الهلال المتزايد",
        first_quarter: "التربيع الأول",
        waxing_gibbous: "الأحدب المتزايد",
        full: "البدر",
        waning_gibbous: "الأحدب المتناقص",
        last_quarter: "التربيع الثاني",
        waning_crescent: "الهلال المتناقص",
      },
      
      new: {
        title: "وقت للراحة والنية",
        description: "مثل أحلك ساعة قبل الفجر، هذا وقت للهدوء والتأمل وتحديد النية والاستعداد للدورة القادمة. احفظ طاقتك.",
        suitable: {
          category: "ممارسة روحية",
          activity1: "راحة واستعادة",
          activity2: "تأمل عميق",
          activity3: "عمل داخلي",
          spiritual1: "قيام الليل (تهجد)",
          spiritual2: "توبة",
          spiritual3: "صيام",
        },
        notSuitable: {
          category: "عمل خارجي",
          activity1: "بدء مشاريع جديدة",
          activity2: "إطلاقات كبيرة",
          activity3: "اتفاقات عمل",
          reason: "المحاق يفتقر إلى الضوء والزخم للبدايات الخارجية. انتظر عودة النور.",
        },
      },
      
      waxing_crescent: {
        title: "وقت لبدايات جديدة",
        description: "مثل بذرة تشقّ التراب، تصبح النوايا مرئية. ضوء القمر المتزايد يدعم البدء وغرس البذور وبناء الزخم.",
        suitable: {
          category: "النمو والبدايات",
          activity1: "بدء عمل أو مشروع",
          activity2: "علاقات جديدة",
          activity3: "تعلّم مهارات جديدة",
          activity4: "مشاريع إبداعية",
          spiritual1: "دعاء للزيادة",
          spiritual2: "أذكار",
          spiritual3: "تثبيت الأهداف",
        },
        notSuitable: {
          category: "إنهاء وتخلٍّ",
          activity1: "قطيعات كبيرة",
          activity2: "تفكيك وترك",
          activity3: "قطع الروابط",
          reason: "الضوء المتزايد يناسب البناء لا الإغلاق. للتخلّي والإنهاء اختر مراحل التناقص.",
        },
      },
      
      first_quarter: {
        title: "وقت للعمل والنمو",
        description: "القمر نصف مضيء والطاقة في صعود. وقت للحسم وتجاوز العقبات ودفع المشاريع للأمام بثقة.",
        suitable: {
          category: "تحدٍ وتقدّم",
          activity1: "العمل على الخطط القائمة",
          activity2: "تجاوز العقبات",
          activity3: "قرارات مهمة",
          activity4: "نشاط بدني",
          spiritual1: "ممارسات الحماية",
          spiritual2: "ذكر للقوة والثبات",
          spiritual3: "عمل الإرادة والانضباط",
        },
        notSuitable: {
          category: "أمور لطيفة/حساسة",
          activity1: "مفاوضات سلام",
          activity2: "شفاء لطيف",
          activity3: "عمل استقبال وسكون",
          reason: "يزداد التوتر والجهد مع الضوء المتزايد. العمل اللطيف ينسجم أكثر مع مرحلة التناقص.",
        },
      },
      
      waxing_gibbous: {
        title: "وقت للتهذيب والتحسين",
        description: "قريب من الامتلاء، يكشف ضوء القمر ما يحتاج تعديلًا. مناسب لتنقيح العمل وتحسينه والاستعداد للإتمام.",
        suitable: {
          category: "تحقّق وإتمام",
          activity1: "إنهاء المشاريع",
          activity2: "دفعة أخيرة نحو الأهداف",
          activity3: "عمل التجلي والتحقّق",
          activity4: "أحداث مهمة",
          spiritual1: "ممارسات ما قبل البدر",
          spiritual2: "نية وتثبيت",
          spiritual3: "طقوس طاقة عالية",
        },
        notSuitable: {
          category: "عمل خفي/سري",
          activity1: "عمل سري",
          activity2: "تأمل صامت",
          activity3: "ممارسات في الخفاء",
          reason: "القمر شبه الكامل ساطع ومكشوف. إن لزمك الكتمان فاختر مرحلة أغمق.",
        },
      },
      
      full: {
        title: "وقت للذروة",
        description: "كشجرة مثقلة بثمر ناضج، هذا ذروة الظهور. احتفل بالإنجازات، وأتمّ المحطات الكبرى، وأعلن بحكمة.",
        suitable: {
          category: "اكتمال وشفاء",
          activity1: "عمل الشفاء",
          activity2: "وضوح وانكشاف",
          activity3: "مراسم إتمام",
          activity4: "تجمعات",
          activity5: "طقوس البدر",
          spiritual1: "أدعية البدر",
          spiritual2: "طقوس الشفاء",
          spiritual3: "ممارسات جماعية",
          spiritual4: "وضوح البصيرة",
        },
        notSuitable: {
          category: "بدايات جديدة",
          activity1: "بدء مشاريع جديدة",
          activity2: "استبطان صامت",
          activity3: "عمل سري",
          reason: "طاقة البدر خارجية وكاشفة. للبدايات اختر الهلال المتزايد.",
        },
      },
      
      waning_gibbous: {
        title: "وقت للشكر والمشاركة",
        description: "يبدأ الضوء بالتناقص. وقت لمشاركة ما صنعت، وشكر ما أُعطي، والبدء في ترك ما لم يعد ينفع.",
        suitable: {
          category: "إتمام وشكر",
          activity1: "إنهاء أعمال",
          activity2: "إظهار الامتنان",
          activity3: "تعليم/مشاركة",
          activity4: "تنظيم",
          spiritual1: "ممارسات الامتنان",
          spiritual2: "شكر",
          spiritual3: "عمل البركة",
          spiritual4: "التعليم",
        },
        notSuitable: {
          category: "مشاريع جديدة كبيرة",
          activity1: "بدء مشاريع كبيرة",
          activity2: "بدء علاقات",
          activity3: "التزامات جديدة",
          reason: "القمر المتناقص يميل إلى الإغلاق. البدايات أنسب في مرحلة التزايد.",
        },
      },
      
      last_quarter: {
        title: "وقت للتحرير والتنقية",
        description: "يبقى نصف الضوء. اترك ما يعيقك، وأزل العوائق، واقطع العادات القديمة، وافتح مساحة للدورة الجديدة.",
        suitable: {
          category: "تحرير وتطهير",
          activity1: "كسر أنماط سلبية",
          activity2: "تنظيف",
          activity3: "مغفرة",
          activity4: "إنهاء باحترام",
          spiritual1: "طقوس التطهير",
          spiritual2: "ممارسات المغفرة",
          spiritual3: "مراسم التحرير",
          spiritual4: "عمل التوبة",
        },
        notSuitable: {
          category: "نمو جديد",
          activity1: "بدء مشاريع جديدة",
          activity2: "توسّع",
          activity3: "التزامات جديدة",
          reason: "طاقة التناقص تدعم التحرير لا النمو. المشاريع الجديدة تزدهر في مرحلة التزايد.",
        },
      },
      
      waning_crescent: {
        title: "وقت للإتمام والتسليم",
        description: "آخر خيط من الضوء. أتمّ ما تبقى، وأغلق الأطراف، وتمرّن على العفو، واستعدّ لمرحلة الراحة. اترك بلطف.",
        suitable: {
          category: "تأمل عميق",
          activity1: "تأمل",
          activity2: "استبطان",
          activity3: "إغلاقات نهائية",
          activity4: "خلوة روحية",
          spiritual1: "قيام الليل",
          spiritual2: "ذكر عميق",
          spiritual3: "اعتكاف",
          spiritual4: "صيام",
        },
        notSuitable: {
          category: "مبادرات نشطة",
          activity1: "بدء مشاريع",
          activity2: "أنشطة كبيرة",
          activity3: "عمل علني",
          reason: "القمر القريب من المحاق يدعو للراحة. انتظر ولادة الهلال لبدء أمور جديدة.",
        },
      },
      
      harmony: {
        waxing_active: "انسجامٌ ممتاز! ضوء القمر المتزايد يوافق طاقة {{dayRuler}} النشطة. توقيت مناسب للبدايات والمبادرة.",
        waxing_active_rec: "يناسب العمل المنضبط والبدايات وبناء الزخم.",
        
        waning_reflective: "انسجامٌ ممتاز! ضوء القمر المتناقص ينسجم مع طبيعة {{dayRuler}} التأملية. وقت مناسب للإتمام والعمل الداخلي.",
        waning_reflective_rec: "ركّز على إنهاء ما بدأته، وترك ما انتهى، وممارساتٍ روحية داخلية.",
        
        waxing_reflective: "توقيتٌ مختلط. القمر المتزايد يدعو للبناء، لكن {{dayRuler}} يدعو للتأمل. اختر أفعالك بحذر.",
        waxing_reflective_rec: "ابدأ أعمالًا لطيفة أو داخلية، وتجنّب الاندفاع الخارجي.",
        
        waning_active: "توقيتٌ مختلط. القمر المتناقص يدعو للترك، لكن {{dayRuler}} يدعو للفعل. وازن هذا التوتر بحكمة.",
        waning_active_rec: "ركّز على إتمام الأعمال بدل بدء الكثير من الجديد.",
        
        neutral: "توافقٌ متوسط. القمر و{{dayRuler}} يوجدان توازنًا عامًا.",
        neutral_rec: "تقدّم بوعي؛ البدء والإتمام ممكنان مع رعايةٍ وحذر.",
      },
      
      ui: {
        lunarTiming: "التوقيت القمري",
        moonPhase: "طور القمر",
        lunarDay: "اليوم القمري",
        dayOfMonth: "اليوم {{day}} من 30",
        moonPower: "قوة القمر",
        waxing: "متزايد (ينمو)",
        waning: "متناقص (ينخفض)",
        learnMore: "اعرف المزيد",
        fullGuide: "الدليل القمري الكامل",
        moonDayHarmony: "انسجام القمر واليوم",
        perfectAlignment: "انسجام ممتاز",
        goodAlignment: "انسجام جيد",
        neutralAlignment: "انسجام محايد",
        challengingAlignment: "انسجام متعب",
        suitableFor: "أنسب لـ",
        notSuitableFor: "تجنّب",
        whyThisMatters: "لماذا يهم هذا",
        traditionalWisdom: "حكمة تقليدية",
        practicalExample: "مثال عملي",
        spiritualGuidance: "إرشاد روحي",
        rest: "راحة",
      },
    },

    // Daily Energy - نظام السرد الجديد
    dailyEnergy: {
      // حالة اليوم الكلاسيكية (مختلفة عن "الوقت" في محاذاة اللحظة)
      status: {
        favorable: "يوم مواتٍ",
        neutral: "يوم متوازن",
        cautious: "يوم يستدعي التأني",
      },
      // عناوين الأقسام
      todaysRuler: "حاكم اليوم الكوكبي",
      yourPlanet: "كوكبك الشخصي",
      todaysAlignment: "توافق اليوم",
      lunarInfluence: "التأثير القمري",
      whatThisMeans: "ماذا يعني هذا لك",
      excellentForToday: "ممتاز لليوم",
      lessFavorable: "أقل ملاءمة",
      bestForToday: "الأفضل لليوم",
      currentTransit: "العبور الحالي",
      peakHours: "ساعات الذروة",
      transitIn: "في {sign}{dignity}",

      spiritualPractice: {
        title: "الممارسة الروحية الموصى بها",
        recommendedTodayTitle: "موصى به اليوم",
        betterToWaitForTitle: "الأفضل تأجيله",

        items: {
          grounding: "الزم الأرض: روتين بسيط، طعام طيب، ونَفَس ثابت.",
          protection: "احفظ القلب: استعذ بالله، وحافظ على الوضوء إن استطعت، وابتعد عن الاضطراب.",
          repentance: "ارجع بلطف: استغفار، إصلاح ما فسد، ولسانٌ محروس.",
          discipline: "قدّم الانضباط على الاندفاع: أتمّ الضروري، واترك الزائد.",
          silence: "قلّل الكلام والضوضاء: دع اليوم يمضي بوقارٍ وكفّ.",

          supportiveDhikr: "ذِكرٌ لطيف بحضور: ليوافق اللسانُ القلب.",
          openingDua: "ادعُ بحسن الظن: هداية، تيسير، وعملٌ راشد.",
          goodIntention: "نوِّ نيةً واضحة: نفعٌ بلا إفراط، وابدأ بالأدب.",
          charity: "تصدّق بشيءٍ يسير: يفتح الأبواب ولا يوقظ الأنا.",
          reconciliation: "أصلح ما انقطع ولِنْ ما اشتد: إحسانٌ صغيرٌ يزن كثيرًا.",

          cleanIntention: "طهّر النية واعتدل: خذ بالمتيقَّن واترك المشتبه.",
          modestDhikr: "ذِكرٌ قصيرٌ دائم: قليلٌ بإخلاص خيرٌ من كثيرٍ بلا حضور.",
          fulfillDuties: "ابدأ بالفرائض: صلاةٌ في وقتها، وحقوقٌ قبل النوافل.",
          shortDua: "دعاءٌ يسير في أول يومك وآخره.",
          gratitude: "اشكر بهدوء: عدِّد النِّعم ولا تطارد الغائب.",

          controlledCaution: "إن مالت نفسك إلى المزيد فاجعله قصيرًا محصورًا—واحذر الإفراط.",
        },

        matchItems: {
          sun: "ممارسةٌ قصيرة لصفاء النية وعلوّ الهمّة—بلا كِبر.",
          moon: "ممارسةٌ قصيرة للرحمة وسكينة الباطن—بلا غرقٍ في العاطفة.",
          mercury: "ممارسةٌ قصيرة للفهم والصدق في القول—بلا قلقٍ وتشتّت.",
          venus: "ممارسةٌ قصيرة للألفة واللين—بلا ترفٍ وإغراء.",
          mars: "ممارسةٌ قصيرة للشجاعة مع كفّ النفس—بلا غضبٍ ولا عجلة.",
          jupiter: "ممارسةٌ قصيرة للحكمة وتوسعة الخير—بلا مجاوزة.",
          saturn: "ممارسةٌ قصيرة للصبر والثبات—بلا قسوةٍ في القلب.",
        },

        waitItems: {
          loveAttraction: "أمور المودّة والجذب—أحسنُها في {days}.",
          expansionBigAsks: "الطلبات الكبيرة وفتح الأبواب الواسعة—أحسنُها في {days}.",
          deepEmotionalOpening: "الانفتاح العاطفي العميق—أحسنُه في {days}.",
          hardConfrontation: "المواجهة القاسية—أحسنُها في {days} إن لزم.",
          overStrictVows: "التشدد في النذور والأحمال على النفس—أحسنُه في {days}.",
          heavyEmotionalWork: "العمل العاطفي الثقيل—أحسنُه في {days}.",
          bigExpansion: "التوسّع الكبير والالتزامات الخطرة—أحسنُها في {days}.",
        },
      },

      // أوصاف الأيام
      dayEnergy: {
        expansion: "التوسع والحكمة والنمو",
        action: "العمل والشجاعة والحركة الحاسمة",
        communication: "التواصل والتعلم والتجارة",
        love: "الحب والجمال والانسجام",
        discipline: "الانضباط والبنية والإتقان",
        vitality: "الحيوية والقيادة والقوة الشخصية",
        intuition: "المشاعر والحدس والرعاية",
      },

      // عوامل التوافق
      factors: {
        planetaryFriendship: "الصداقة الكوكبية",
        elementalHarmony: "الانسجام العنصري",
        dailyStrength: "القوة اليومية",
      },

      // العلاقات
      friendship: {
        strongFriends: "أصدقاء أقوياء",
        friends: "أصدقاء",
        neutral: "محايد",
        tension: "توتر",
      },

      // قوالب التركيب
      synthesis: {
        excellent: "طاقة {day} ممتازة! يوم {day} ذو {quality} ينسجم بشكل جميل مع طبيعتك {user}-{element}. {lunar}. اليوم يفضل {activities}.",
        good: "طاقة {day} جيدة. {quality} {day} يعمل بشكل جيد مع طبيعتك {user}-{element}. {lunar}. ملائم لـ {activities}.",
        moderate: "طاقة {day} متوازنة. {quality} {day} يقدم دعمًا ثابتًا. {lunar}. جيد لـ {activities}.",
        challenging: "طاقة {day} تأملية. {quality} {day} يدعو إلى التنقل الحذر. {lunar}. أفضل لـ {activities}.",
      },

      // الأطوار القمرية
      lunarPhase: {
        waxing: "القمر المتزايد يضيف زخمًا متصاعدًا",
        waning: "القمر المتناقص يدعم الإطلاق والإكمال",
        full: "البدر يضخم كل الطاقات",
        new: "المحاق يقدم بدايات جديدة",
      },

      // تسميات القوة
      strengthLabels: {
        veryStrong: "قوي جدًا",
        strong: "قوي",
        moderate: "معتدل",
        weak: "ضعيف",
        veryWeak: "ضعيف جدًا",
      },

      // تسميات المصدر
      sourceLabels: {
        fromName: "من الاسم + اسم الأم",
        fromBirthChart: "من الخريطة الفلكية",
        default: "افتراضي (الشمس)",
      },

      // محرّك حالة الكوكب (منزلة + ذروة الشرف بالدرجات + الدرجات الحرجة)
      // بطاقة الحكم الكوكبي
      planetaryJudgment: {
        title: "الحكم الكوكبي",
        cosmicVerdict: "حكم الكون لليوم",
        status: {
          supportive: "يوم داعم",
          neutral: "يوم محايد",
          cautious: "يوم يستدعي التأني",
        },
        classicalTerms: {
          supportive: "سعد",
          neutral: "محايد",
          cautious: "نحس",
        },
        intro: "اليوم يحكمه {planet}.",
        rulerTone: {
          sun: "الشمس تجلب الحيوية والقيادة والتعبير عن الذات. يوم للثقة والظهور.",
          moon: "القمر يحكم المشاعر والحدس والرعاية. يوم للعمل الداخلي والعائلة.",
          mars: "المريخ ينشط العمل والشجاعة والمنافسة. يوم للتحركات الجريئة لكن احذر الصراع.",
          mercury: "عطارد يحكم التواصل والتعلم والتجارة. يوم للدراسة والتفاوض.",
          jupiter: "المشتري يوسع الفرص والحكمة والحظ. يوم للنمو والكرم.",
          venus: "الزهرة تجلب الانسجام والجمال والعلاقات. يوم للحب والجماليات.",
          saturn: "زحل يتطلب الانضباط والبنية والصبر. يوم لإتمام الأعمال طويلة المدى.",
        },
        phaseModifier: {
          amplify: "القمر المتزايد يضخم طاقة اليوم—اغتنم الزخم.",
          soften: "القمر المتناقص يخفف الحدة—تأمل قبل التصرف.",
          neutral: "القمر في مرحلة انتقالية—وازن بين العمل والتأمل.",
        },
        bestForLabel: "الأفضل لـ",
        avoidLabel: "تجنب",
        disclaimer: "إرشاد كلاسيكي مبني على حكم الكواكب. خريطتك الشخصية قد تعدل هذه التأثيرات.",
        bestFor: {
          sun: {
            0: "القيادة وتحمل المسؤولية",
            1: "العروض العامة والظهور",
            2: "التعبير عن الذات والإبداع",
          },
          moon: {
            0: "الشفاء العاطفي والتأمل",
            1: "الوقت العائلي والرعاية",
            2: "القرارات الحدسية",
          },
          mars: {
            0: "التدريب البدني والرياضة",
            1: "إطلاق المبادرات الجريئة",
            2: "الأنشطة التنافسية",
          },
          mercury: {
            0: "الكتابة والتواصل",
            1: "التعلم والدراسة",
            2: "المفاوضات التجارية",
          },
          jupiter: {
            0: "فرص التوسع والنمو",
            1: "التعليم والتعلم",
            2: "السفر والدراسات الفلسفية",
          },
          venus: {
            0: "بناء العلاقات",
            1: "العمل الإبداعي والفني",
            2: "الجمال والجماليات",
          },
          saturn: {
            0: "إتمام المشاريع طويلة المدى",
            1: "بناء الهياكل والأنظمة",
            2: "العمل المنضبط والمركز",
          },
        },
        avoid: {
          sun: {
            0: "الأدوار الخاضعة",
            1: "العمل الخلفي الداعم",
            2: "التقليل من الذات",
          },
          moon: {
            0: "المواجهة العدوانية",
            1: "القرارات المنطقية البحتة",
            2: "كبت المشاعر",
          },
          mars: {
            0: "المفاوضات الحساسة",
            1: "المحادثات العاطفية",
            2: "المهام التي تتطلب الصبر",
          },
          mercury: {
            0: "القرارات العاطفية",
            1: "العمل البدني الشاق",
            2: "الالتزامات طويلة المدى بدون تحليل",
          },
          jupiter: {
            0: "الإفراط في الوعود",
            1: "التوسع المتهور",
            2: "تجاهل التفاصيل العملية",
          },
          venus: {
            0: "التصرف العدواني",
            1: "النقد القاسي",
            2: "المواجهة",
          },
          saturn: {
            0: "القرارات العفوية",
            1: "بدء مشاريع إبداعية جديدة",
            2: "أنشطة الترفيه الاجتماعي",
          },
        },
      },
      scope: {
        day: "حاكم اليوم",
      },
      alignmentOverview: {
        title: "نظرة عامة على التوافق",
        dayRulerLabel: "حاكم اليوم",
        yourRulerLabel: "حاكمك",
        elementsLabel: "العناصر",
        elementHarmony: "انسجام العناصر",
        planetHarmony: "انسجام الكواكب",
        verdict: {
          excellent: "توافق ممتاز اليوم.",
          good: "توافق جيد اليوم.",
          moderate: "توافق متوسط اليوم.",
          challenging: "توافق صعب اليوم.",
        },
      },
      planets: {
        sun: "الشمس",
        moon: "القمر",
        mars: "المريخ",
        mercury: "عطارد",
        jupiter: "المشتري",
        venus: "الزهرة",
        saturn: "زحل",
      },
    },

    // تسميات حكام الأيام
    dayRulers: {
      sunday: {
        name: "الأحد • يوم الشمس",
        desc: "يوم الحيوية والقيادة والقوة الشخصية",
        element: "النار",
        planet: "الشمس",
        arabicName: "الأحد • يوم الشمس",
      },
      monday: {
        name: "الاثنين • يوم القمر",
        desc: "يوم المشاعر والحدس والرعاية",
        element: "الماء",
        planet: "القمر",
        arabicName: "الاثنين • يوم القمر",
      },
      tuesday: {
        name: "الثلاثاء • يوم المريخ",
        desc: "يوم العمل والشجاعة والحركة الحاسمة",
        element: "النار",
        planet: "المريخ",
        arabicName: "الثلاثاء • يوم المريخ",
      },
      wednesday: {
        name: "الأربعاء • يوم عطارد",
        desc: "يوم التواصل والتعلم والتجارة",
        element: "الهواء",
        planet: "عطارد",
        arabicName: "الأربعاء • يوم عطارد",
      },
      thursday: {
        name: "الخميس • يوم المشتري",
        desc: "يوم التوسع والحكمة والنمو",
        element: "الهواء",
        planet: "المشتري",
        arabicName: "الخميس • يوم المشتري",
      },
      friday: {
        name: "الجمعة • يوم الزهرة",
        desc: "يوم الحب والجمال والانسجام",
        element: "الماء",
        planet: "الزهرة",
        arabicName: "الجمعة • يوم الزهرة",
      },
      saturday: {
        name: "السبت • يوم زحل",
        desc: "يوم الانضباط والبنية والإتقان",
        element: "الأرض",
        planet: "زحل",
        arabicName: "السبت • يوم زحل",
      },
    },

    // أوصاف العلاقات الكوكبية (العربية - مبسطة)
    planetaryRelations: {
      "Sun-Moon": "الشمس تضيء أعماق القمر العاطفية",
      "Sun-Mars": "الشمس تمد شجاعة المريخ بالطاقة",
      "Sun-Jupiter": "الشمس توسع حكمة المشتري",
      "Sun-Mercury": "الشمس وعطارد يعملان معًا بشكل طبيعي",
      "Sun-Venus": "الشمس والزهرة يخلقان توترًا إبداعيًا",
      "Sun-Saturn": "الشمس وزحل يواجهان تحديات",
      "Moon-Sun": "القمر يعكس حيوية الشمس",
      "Moon-Mercury": "القمر ينسجم مع أفكار عطارد",
      "Moon-Mars": "القمر والمريخ يوازنان العاطفة والعمل",
      "Moon-Jupiter": "القمر والمشتري يمزجان الرعاية والكرم",
      "Moon-Venus": "القمر يتدفق طبيعيًا مع الزهرة",
      "Moon-Saturn": "القمر وزحل يصارعان بين العاطفة والتحكم",
      "Mars-Sun": "المريخ يوجه حيوية الشمس إلى العمل",
      "Mars-Moon": "المريخ يدعم عواطف القمر",
      "Mars-Jupiter": "المريخ ينضم إلى حكمة المشتري",
      "Mars-Mercury": "المريخ وعطارد يخلقان توترًا",
      "Mars-Venus": "المريخ والزهرة يصارعان بين التأكيد والانسجام",
      "Mars-Saturn": "المريخ وزحل يعملان معًا بحياد",
      "Mercury-Sun": "عطارد يخدم الشمس بدقة",
      "Mercury-Venus": "عطارد ينسجم مع الزهرة",
      "Mercury-Moon": "عطارد والقمر يوازنان العقل والعاطفة",
      "Mercury-Mars": "عطارد والمريخ يواجهان احتكاكًا",
      "Mercury-Jupiter": "عطارد والمشتري يعملان معًا بحياد",
      "Mercury-Saturn": "عطارد وزحل يوازنان التحليل والحكمة",
      "Jupiter-Sun": "المشتري يوسع قيادة الشمس",
      "Jupiter-Moon": "المشتري يبارك رعاية القمر",
      "Jupiter-Mars": "المشتري يوجه شجاعة المريخ",
      "Jupiter-Mercury": "المشتري وعطارد يعملان معًا بحياد",
      "Jupiter-Venus": "المشتري والزهرة يخلقان توترًا",
      "Jupiter-Saturn": "المشتري وزحل يعملان معًا بحياد",
      "Venus-Mercury": "الزهرة تثري تواصل عطارد",
      "Venus-Saturn": "الزهرة تنسجم مع زحل",
      "Venus-Mars": "الزهرة والمريخ يصارعان بين الانسجام والصراع",
      "Venus-Jupiter": "الزهرة والمشتري يخلقان توترًا",
      "Venus-Sun": "الزهرة والشمس يعملان معًا بحياد",
      "Venus-Moon": "الزهرة والقمر يمتزجان طبيعيًا",
      "Saturn-Mercury": "زحل يدعم تحليل عطارد",
      "Saturn-Venus": "زحل يعطي جمال الزهرة شكلاً دائمًا",
      "Saturn-Jupiter": "زحل والمشتري يعملان معًا بحياد",
      "Saturn-Mars": "زحل والمريخ يعملان معًا بحياد",
      "Saturn-Sun": "زحل والشمس يواجهان تحديات",
      "Saturn-Moon": "زحل والقمر يصارعان بين الدفء والبرودة",
    },

    // العلاقات العنصرية (العربية - مبسطة)
    elementalRelations: {
      "Fire-Fire": "النار تقوي النار — عاطفة مضخمة",
      "Fire-Air": "الهواء يؤجج النار — ديناميكية إبداعية",
      "Fire-Water": "النار والماء يخلقان بخارًا — توتر إبداعي",
      "Fire-Earth": "النار والأرض يعملان معًا — عمل مثبت",
      "Water-Water": "الماء يعمق الماء — سيولة منسجمة",
      "Water-Earth": "الأرض تثبت الماء — عواطف مستقرة",
      "Water-Air": "الماء والهواء يخلقان ضبابًا — قابل للتكيف",
      "Water-Fire": "الماء والنار يخلقان بخارًا — شدة",
      "water-fire": "الماء والنار يخلقان بخارًا — شدة",
      "Air-Air": "الهواء يضخم الهواء — وضوح ذهني مضاعف",
      "Air-Fire": "النار تمد الهواء بالطاقة — أفكار ملتهبة",
      "Air-Earth": "الهواء والأرض يعملان معًا — أفكار عملية",
      "Air-Water": "الهواء والماء يخلقان ضبابًا — عقل وعاطفة",
      "Earth-Earth": "الأرض تصلب الأرض — استقرار معزز",
      "Earth-Water": "الماء يغذي الأرض — نمو مثري",
      "Earth-Fire": "الأرض تثبت النار — طاقة موجهة",
      "Earth-Air": "الأرض والهواء يعملان معًا — أفكار متجسدة",
    },
  },
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.en;
