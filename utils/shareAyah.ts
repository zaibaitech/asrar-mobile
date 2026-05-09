import * as Clipboard from 'expo-clipboard';
import { Linking, Share } from 'react-native';

export type ShareLocale = 'en' | 'fr' | 'ar';
export type ShareAyahPlatform = 'whatsapp' | 'facebook' | 'x' | 'system' | 'copyLink' | 'copyText';

export interface ShareAyahParams {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  locale: ShareLocale;
}

export interface ShareAyahLinks {
  deepLink: string;
  webLink: string;
  preferredLink: string;
}

export interface ShareAyahResult {
  ok: boolean;
  error?: string;
}

const APP_SCHEME = 'asrariya://quran';
const SHARE_BASE = 'https://asrar.app/share/quran';

export function buildAyahLinks(surahNumber: number, ayahNumber: number): ShareAyahLinks {
  const deepLink = `${APP_SCHEME}/${surahNumber}/${ayahNumber}`;
  const webLink = `${SHARE_BASE}/${surahNumber}/${ayahNumber}`;

  return {
    deepLink,
    webLink,
    // Web share link is preferred:
    // - Works for recipients who don't have the app (shows ayah + install prompt)
    // - OS intercepts the HTTPS link and opens the app directly if installed
    preferredLink: webLink,
  };
}

export function formatAyahShareText(params: ShareAyahParams): string {
  const links = buildAyahLinks(params.surahNumber, params.ayahNumber);
  const heading = params.locale === 'ar'
    ? `سورة ${params.surahName} ${params.surahNumber}:${params.ayahNumber}`
    : params.locale === 'fr'
      ? `Sourate ${params.surahName} ${params.surahNumber}:${params.ayahNumber}`
      : `Surah ${params.surahName} ${params.surahNumber}:${params.ayahNumber}`;
  const source = params.locale === 'ar'
    ? 'مشاركة من Asrariya'
    : params.locale === 'fr'
      ? 'Partage depuis Asrariya'
      : 'Shared from Asrariya';

  return [
    heading,
    params.arabicText.trim(),
    params.translation.trim(),
    source,
    links.webLink,
  ].join('\n');
}

export async function copyAyahLink(params: ShareAyahParams): Promise<ShareAyahResult> {
  try {
    const links = buildAyahLinks(params.surahNumber, params.ayahNumber);
    await Clipboard.setStringAsync(links.preferredLink);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: normalizeError(error) };
  }
}

export async function copyAyahText(params: ShareAyahParams): Promise<ShareAyahResult> {
  try {
    const text = formatAyahShareText(params);
    await Clipboard.setStringAsync(text);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: normalizeError(error) };
  }
}

export async function shareAyahToPlatform(
  platform: ShareAyahPlatform,
  params: ShareAyahParams
): Promise<ShareAyahResult> {
  try {
    const text = formatAyahShareText(params);
    const links = buildAyahLinks(params.surahNumber, params.ayahNumber);

    if (platform === 'copyLink') {
      return copyAyahLink(params);
    }

    if (platform === 'copyText') {
      return copyAyahText(params);
    }

    if (platform === 'system') {
      await Share.share({
        message: text,
        url: links.preferredLink,
      });
      return { ok: true };
    }

    const url = buildPlatformShareUrl(platform, text, links.preferredLink);
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      return { ok: false, error: 'Unable to open share target.' };
    }

    await Linking.openURL(url);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: normalizeError(error) };
  }
}

function buildPlatformShareUrl(platform: 'whatsapp' | 'facebook' | 'x', text: string, link: string): string {
  const encodedText = encodeURIComponent(text);
  const encodedLink = encodeURIComponent(link);

  if (platform === 'whatsapp') {
    return `https://wa.me/?text=${encodedText}`;
  }

  if (platform === 'facebook') {
    // Facebook sharer: u= is the URL to preview (generates OG card), quote= is the caption
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodedText}`;
  }

  return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedLink}`;
}

function normalizeError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Share action failed.';
}
