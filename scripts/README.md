# Data Fetching Scripts

These scripts fetch complete Islamic datasets from free public APIs.

## Available Scripts

### 1. Fetch Divine Names (99 Names of Allah)
```bash
npx ts-node scripts/fetch-divine-names.ts
```

**Source**: Al Aladhan API (https://api.aladhan.com)
- ✅ Free, no authentication required
- ✅ All 99 names with English meanings
- ✅ Abjad values auto-calculated using our Maghribi system

### 2. Fetch Qur'an Surahs (All 114)
```bash
npx ts-node scripts/fetch-quran-surahs.ts
```

**Source**: Al Quran Cloud API (https://alquran.cloud)
- ✅ Free, no authentication required
- ✅ Complete surah metadata (names, ayah counts, revelation type)
- ✅ Arabic names and English translations

## Usage

1. Install ts-node if not already installed:
```bash
npm install -D ts-node
```

2. Run either script:
```bash
npx ts-node scripts/fetch-divine-names.ts > data/divine-names-generated.ts
npx ts-node scripts/fetch-quran-surahs.ts > data/quran-surahs-generated.ts
```

3. Review the generated files and copy to replace the current data files.

## API Sources

| Data | API | Free | Auth Required | Rate Limit |
|------|-----|------|---------------|------------|
| Divine Names | Al Aladhan | ✅ Yes | ❌ No | None |
| Qur'an Surahs | Al Quran Cloud | ✅ Yes | ❌ No | Reasonable |

## Notes

- **French Translations**: The APIs provide English only. French translations need to be added manually or from another source.
- **Abjad Calculation**: Done locally using our existing `ABJAD_MAGHRIBI` constant.
- **Spiritual Influence**: Generated contextually based on the divine name meanings.
- **Rate Limiting**: Quran script includes 100ms delay between requests to be respectful.

## Alternative APIs

If the above don't work, here are alternatives:

### Divine Names
- Islamic Network API: `https://islamicnetwork.herokuapp.com/api/names`
- Quran.com API (has names): `https://api.quran.com/api/v4/chapter_infos`

### Qur'an Data
- Tanzil API: `http://tanzil.net/docs/download`
- Quran.com API: `https://api.quran.com/api/v4/chapters`
- Every Ayah API: `https://everyayah.com/`

## Output Format

Both scripts generate complete TypeScript files ready to replace:
- `data/divine-names.ts`
- `data/quran-surahs.ts`

The generated code includes:
- Type definitions
- Complete data arrays
- Helper functions
- JSDoc comments
