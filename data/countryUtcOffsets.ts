/**
 * Country -> UTC offset range (hours)
 * ======================================
 * A small curated table used only to narrow the DOB ingress-ambiguity
 * detection window (services/ProfileDerivationService.ts). Not a general
 * timezone database — deliberately coarse (min/max standard-time offset
 * per country, ignoring DST and sub-national exceptions) since the only
 * use is bounding a ~24h-wide window, not computing an exact instant.
 *
 * Multi-timezone countries (e.g. Russia, USA, Australia) still narrow the
 * detection window meaningfully even without picking a specific region —
 * e.g. selecting "Russia" rules out the UTC-11..+1 half of the default
 * range entirely.
 *
 * Offsets are standard-time hours from UTC (no DST adjustment — DST shifts
 * are at most 1h and are within the tolerance the ~1-day proximity check
 * already carries).
 */

export interface CountryOffsetRange {
  minOffset: number; // UTC offset, hours (can be fractional, e.g. India +5.5)
  maxOffset: number;
}

export const COUNTRY_UTC_OFFSETS: Record<string, CountryOffsetRange> = {
  // Pacific / Oceania
  'Kiribati': { minOffset: 12, maxOffset: 14 },
  'Samoa': { minOffset: 13, maxOffset: 13 },
  'Tonga': { minOffset: 13, maxOffset: 13 },
  'New Zealand': { minOffset: 12, maxOffset: 12.75 },
  'Fiji': { minOffset: 12, maxOffset: 12 },
  'Australia': { minOffset: 8, maxOffset: 10.5 },
  'Papua New Guinea': { minOffset: 10, maxOffset: 11 },
  'Solomon Islands': { minOffset: 11, maxOffset: 11 },
  'Vanuatu': { minOffset: 11, maxOffset: 11 },
  'Marshall Islands': { minOffset: 12, maxOffset: 12 },
  'Nauru': { minOffset: 12, maxOffset: 12 },
  'Tuvalu': { minOffset: 12, maxOffset: 12 },
  'Micronesia': { minOffset: 10, maxOffset: 11 },
  'Palau': { minOffset: 9, maxOffset: 9 },

  // East Asia
  'Japan': { minOffset: 9, maxOffset: 9 },
  'South Korea': { minOffset: 9, maxOffset: 9 },
  'North Korea': { minOffset: 9, maxOffset: 9 },
  'China': { minOffset: 8, maxOffset: 8 },
  'Taiwan': { minOffset: 8, maxOffset: 8 },
  'Mongolia': { minOffset: 7, maxOffset: 8 },
  'Hong Kong': { minOffset: 8, maxOffset: 8 },

  // Southeast Asia
  'Indonesia': { minOffset: 7, maxOffset: 9 },
  'Philippines': { minOffset: 8, maxOffset: 8 },
  'Vietnam': { minOffset: 7, maxOffset: 7 },
  'Thailand': { minOffset: 7, maxOffset: 7 },
  'Cambodia': { minOffset: 7, maxOffset: 7 },
  'Laos': { minOffset: 7, maxOffset: 7 },
  'Myanmar': { minOffset: 6.5, maxOffset: 6.5 },
  'Malaysia': { minOffset: 8, maxOffset: 8 },
  'Singapore': { minOffset: 8, maxOffset: 8 },
  'Brunei': { minOffset: 8, maxOffset: 8 },
  'East Timor': { minOffset: 9, maxOffset: 9 },

  // South Asia
  'India': { minOffset: 5.5, maxOffset: 5.5 },
  'Sri Lanka': { minOffset: 5.5, maxOffset: 5.5 },
  'Bangladesh': { minOffset: 6, maxOffset: 6 },
  'Nepal': { minOffset: 5.75, maxOffset: 5.75 },
  'Bhutan': { minOffset: 6, maxOffset: 6 },
  'Pakistan': { minOffset: 5, maxOffset: 5 },
  'Afghanistan': { minOffset: 4.5, maxOffset: 4.5 },
  'Maldives': { minOffset: 5, maxOffset: 5 },

  // Central Asia
  'Kazakhstan': { minOffset: 5, maxOffset: 6 },
  'Uzbekistan': { minOffset: 5, maxOffset: 5 },
  'Turkmenistan': { minOffset: 5, maxOffset: 5 },
  'Tajikistan': { minOffset: 5, maxOffset: 5 },
  'Kyrgyzstan': { minOffset: 6, maxOffset: 6 },

  // Middle East
  'Saudi Arabia': { minOffset: 3, maxOffset: 3 },
  'United Arab Emirates': { minOffset: 4, maxOffset: 4 },
  'Qatar': { minOffset: 3, maxOffset: 3 },
  'Kuwait': { minOffset: 3, maxOffset: 3 },
  'Bahrain': { minOffset: 3, maxOffset: 3 },
  'Oman': { minOffset: 4, maxOffset: 4 },
  'Yemen': { minOffset: 3, maxOffset: 3 },
  'Iraq': { minOffset: 3, maxOffset: 3 },
  'Iran': { minOffset: 3.5, maxOffset: 3.5 },
  'Israel': { minOffset: 2, maxOffset: 3 },
  'Palestine': { minOffset: 2, maxOffset: 3 },
  'Jordan': { minOffset: 2, maxOffset: 3 },
  'Lebanon': { minOffset: 2, maxOffset: 3 },
  'Syria': { minOffset: 2, maxOffset: 3 },
  'Turkey': { minOffset: 3, maxOffset: 3 },

  // Africa
  'Egypt': { minOffset: 2, maxOffset: 2 },
  'Libya': { minOffset: 2, maxOffset: 2 },
  'Tunisia': { minOffset: 1, maxOffset: 1 },
  'Algeria': { minOffset: 1, maxOffset: 1 },
  'Morocco': { minOffset: 0, maxOffset: 1 },
  'Mauritania': { minOffset: 0, maxOffset: 0 },
  'Senegal': { minOffset: 0, maxOffset: 0 },
  'Mali': { minOffset: 0, maxOffset: 0 },
  'Gambia': { minOffset: 0, maxOffset: 0 },
  'Guinea': { minOffset: 0, maxOffset: 0 },
  'Guinea-Bissau': { minOffset: 0, maxOffset: 0 },
  'Sierra Leone': { minOffset: 0, maxOffset: 0 },
  'Liberia': { minOffset: 0, maxOffset: 0 },
  "Cote d'Ivoire": { minOffset: 0, maxOffset: 0 },
  'Ghana': { minOffset: 0, maxOffset: 0 },
  'Togo': { minOffset: 0, maxOffset: 0 },
  'Benin': { minOffset: 1, maxOffset: 1 },
  'Nigeria': { minOffset: 1, maxOffset: 1 },
  'Niger': { minOffset: 1, maxOffset: 1 },
  'Chad': { minOffset: 1, maxOffset: 1 },
  'Cameroon': { minOffset: 1, maxOffset: 1 },
  'Central African Republic': { minOffset: 1, maxOffset: 1 },
  'Sudan': { minOffset: 2, maxOffset: 2 },
  'South Sudan': { minOffset: 2, maxOffset: 2 },
  'Ethiopia': { minOffset: 3, maxOffset: 3 },
  'Eritrea': { minOffset: 3, maxOffset: 3 },
  'Djibouti': { minOffset: 3, maxOffset: 3 },
  'Somalia': { minOffset: 3, maxOffset: 3 },
  'Kenya': { minOffset: 3, maxOffset: 3 },
  'Uganda': { minOffset: 3, maxOffset: 3 },
  'Tanzania': { minOffset: 3, maxOffset: 3 },
  'Rwanda': { minOffset: 2, maxOffset: 2 },
  'Burundi': { minOffset: 2, maxOffset: 2 },
  'DR Congo': { minOffset: 1, maxOffset: 2 },
  'Congo': { minOffset: 1, maxOffset: 1 },
  'Gabon': { minOffset: 1, maxOffset: 1 },
  'Angola': { minOffset: 1, maxOffset: 1 },
  'Zambia': { minOffset: 2, maxOffset: 2 },
  'Malawi': { minOffset: 2, maxOffset: 2 },
  'Mozambique': { minOffset: 2, maxOffset: 2 },
  'Zimbabwe': { minOffset: 2, maxOffset: 2 },
  'Botswana': { minOffset: 2, maxOffset: 2 },
  'Namibia': { minOffset: 1, maxOffset: 1 },
  'South Africa': { minOffset: 2, maxOffset: 2 },
  'Lesotho': { minOffset: 2, maxOffset: 2 },
  'Eswatini': { minOffset: 2, maxOffset: 2 },
  'Madagascar': { minOffset: 3, maxOffset: 3 },
  'Burkina Faso': { minOffset: 0, maxOffset: 0 },

  // Europe
  'United Kingdom': { minOffset: 0, maxOffset: 0 },
  'Ireland': { minOffset: 0, maxOffset: 0 },
  'Portugal': { minOffset: 0, maxOffset: 0 },
  'Iceland': { minOffset: 0, maxOffset: 0 },
  'Spain': { minOffset: 0, maxOffset: 1 },
  'France': { minOffset: 1, maxOffset: 1 },
  'Germany': { minOffset: 1, maxOffset: 1 },
  'Italy': { minOffset: 1, maxOffset: 1 },
  'Netherlands': { minOffset: 1, maxOffset: 1 },
  'Belgium': { minOffset: 1, maxOffset: 1 },
  'Switzerland': { minOffset: 1, maxOffset: 1 },
  'Austria': { minOffset: 1, maxOffset: 1 },
  'Poland': { minOffset: 1, maxOffset: 1 },
  'Czech Republic': { minOffset: 1, maxOffset: 1 },
  'Slovakia': { minOffset: 1, maxOffset: 1 },
  'Hungary': { minOffset: 1, maxOffset: 1 },
  'Sweden': { minOffset: 1, maxOffset: 1 },
  'Norway': { minOffset: 1, maxOffset: 1 },
  'Denmark': { minOffset: 1, maxOffset: 1 },
  'Finland': { minOffset: 2, maxOffset: 2 },
  'Greece': { minOffset: 2, maxOffset: 2 },
  'Romania': { minOffset: 2, maxOffset: 2 },
  'Bulgaria': { minOffset: 2, maxOffset: 2 },
  'Ukraine': { minOffset: 2, maxOffset: 2 },
  'Belarus': { minOffset: 3, maxOffset: 3 },
  'Russia': { minOffset: 2, maxOffset: 12 },
  'Moldova': { minOffset: 2, maxOffset: 2 },
  'Serbia': { minOffset: 1, maxOffset: 1 },
  'Croatia': { minOffset: 1, maxOffset: 1 },
  'Bosnia and Herzegovina': { minOffset: 1, maxOffset: 1 },
  'Albania': { minOffset: 1, maxOffset: 1 },
  'North Macedonia': { minOffset: 1, maxOffset: 1 },

  // North America
  'United States': { minOffset: -10, maxOffset: -5 },
  'Canada': { minOffset: -8.5, maxOffset: -3.5 },
  'Mexico': { minOffset: -8, maxOffset: -6 },

  // Central America / Caribbean
  'Guatemala': { minOffset: -6, maxOffset: -6 },
  'Belize': { minOffset: -6, maxOffset: -6 },
  'Honduras': { minOffset: -6, maxOffset: -6 },
  'El Salvador': { minOffset: -6, maxOffset: -6 },
  'Nicaragua': { minOffset: -6, maxOffset: -6 },
  'Costa Rica': { minOffset: -6, maxOffset: -6 },
  'Panama': { minOffset: -5, maxOffset: -5 },
  'Cuba': { minOffset: -5, maxOffset: -5 },
  'Jamaica': { minOffset: -5, maxOffset: -5 },
  'Haiti': { minOffset: -5, maxOffset: -5 },
  'Dominican Republic': { minOffset: -4, maxOffset: -4 },
  'Trinidad and Tobago': { minOffset: -4, maxOffset: -4 },

  // South America
  'Colombia': { minOffset: -5, maxOffset: -5 },
  'Venezuela': { minOffset: -4, maxOffset: -4 },
  'Ecuador': { minOffset: -5, maxOffset: -5 },
  'Peru': { minOffset: -5, maxOffset: -5 },
  'Bolivia': { minOffset: -4, maxOffset: -4 },
  'Brazil': { minOffset: -5, maxOffset: -2 },
  'Paraguay': { minOffset: -4, maxOffset: -4 },
  'Uruguay': { minOffset: -3, maxOffset: -3 },
  'Argentina': { minOffset: -3, maxOffset: -3 },
  'Chile': { minOffset: -6, maxOffset: -4 },
  'Guyana': { minOffset: -4, maxOffset: -4 },
  'Suriname': { minOffset: -3, maxOffset: -3 },
};

/** Alphabetically sorted country names, for a picker UI. */
export const COUNTRY_NAMES: string[] = Object.keys(COUNTRY_UTC_OFFSETS).sort((a, b) => a.localeCompare(b));

export function getCountryOffsetRange(countryName: string): CountryOffsetRange | undefined {
  return COUNTRY_UTC_OFFSETS[countryName];
}
