# AI Settings Access Guide

## ✅ How to Access AI Settings

### Method 1: Home Screen (Easiest) ⚡
1. Open the app
2. Look at the **top-right corner** of the home screen
3. Tap the **✨ sparkles icon** (purple icon next to profile)
4. You're now in AI Settings!

### Method 2: Profile Screen
1. Tap the **profile icon** (person icon) in the top-right
2. Scroll down past the "Save Profile" button
3. Tap the **"AI Settings"** button (purple button with sparkles icon)

### Method 3: Via AIBadge (When Available)
1. On any AI-enhanced content (when you see "AI Enhanced" badge)
2. Tap the **AIBadge**
3. An alert will appear
4. Tap **"AI Settings"** button

---

## ⚙️ How to Enable AI

Once you're in AI Settings:

1. **Toggle ON** the "Enable AI Assistance" switch
2. **Select a Tone**:
   - 🧘 Calm & Reassuring
   - ⚡ Concise & Direct
   - 🌙 Reflective & Contemplative
   - 📜 Poetic & Lyrical

3. **Read and Acknowledge** the disclaimer
4. **Save** your settings

---

## 🎯 How to Use AI Enhancement

After enabling AI:

1. Go to any module (Compatibility, Name Destiny, Calculator, Divine Timing)
2. Look for the **"✨ Personalize Analysis"** button (purple gradient button)
3. Tap it
4. Wait a few seconds for AI to process
5. Content will be enhanced with personalized insights!

---

## 🔍 What Gets Enhanced

### Compatibility Module
- ✨ Summary interpretation
- ✨ Spiritual destiny explanation
- ✨ Elemental temperament explanation  
- ✨ Planetary cosmic explanation
- 💫 Personalized relationship insight

### Name Destiny Module
- ✨ Overall interpretation
- ✨ Spiritual significance
- ✨ Personal guidance
- 💫 Life path insight

### Calculator Module
- ✨ Numerical meaning
- ✨ Elemental significance
- ✨ Burj/zodiac connection
- ✨ Calculation type-specific insight
- 💫 Personalized guidance

### Divine Timing Module (Peak Windows)
- ✨ Segment-specific guidance
- ✨ Recommended activities
- ✨ Spiritual wisdom
- 💫 Personalized timing insight

---

## 🐛 Troubleshooting

### AI Button Not Showing?
- Make sure AI is **enabled in settings**
- Check that you have an internet connection
- Verify the Groq API key is configured

### Content Not Changing?
- Enable AI in settings first (it's OFF by default)
- Check the console/terminal for error messages
- Make sure you're clicking the enhancement button
- Wait a few seconds - AI processing takes time

### How to Verify AI is Working?
Look for these indicators:
- Purple **"✨ Personalize Analysis"** button appears
- After clicking, button shows "Enhancing..." with loading spinner
- When complete, content changes and **AIBadge** appears
- Enhanced sections have richer, more personalized text

---

## 📱 UI Locations

```
Home Screen (index.tsx)
├── Header
│   ├── Brand Name
│   └── Icons (Right)
│       ├── ✨ AI Settings (NEW!)
│       └── 👤 Profile

Profile Screen (profile.tsx)
├── Profile Form
├── Save Profile Button
├── 🎨 AI Settings Button (NEW!)
└── Clear All Data

AI Settings Screen (ai-settings.tsx)
├── Enable/Disable Toggle
├── Tone Selection
├── Disclaimer
└── Save Button
```

---

## 🎨 Visual Indicators

- **Purple sparkles icon** ✨ = AI Settings access
- **Purple gradient button** = AI Enhancement available
- **"AI Enhanced" badge** = Content has been personalized
- **Loading spinner** = AI is processing

---

## 📝 Notes

- AI is **OFF by default** for privacy
- All AI processing happens through Groq API
- You must enable AI before any enhancement works
- Different tones produce different writing styles
- Each module can be enhanced independently
