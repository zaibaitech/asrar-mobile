import { Redirect, useLocalSearchParams } from 'expo-router';

export default function QuranAyahLinkRedirect() {
  const { surahNumber, ayahNumber } = useLocalSearchParams<{
    surahNumber?: string;
    ayahNumber?: string;
  }>();

  const normalizedSurah = surahNumber || '1';
  const normalizedAyah = ayahNumber || '1';

  return (
    <Redirect
      href={{
        pathname: '/(tabs)/quran/[surahNumber]',
        params: {
          surahNumber: normalizedSurah,
          scrollToAyah: normalizedAyah,
        },
      }}
    />
  );
}
