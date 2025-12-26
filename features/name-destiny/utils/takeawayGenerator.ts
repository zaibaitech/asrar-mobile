/**
 * Generate Key Takeaways based on result data
 */

import { type ElementType } from '../../../utils/elementTheme';
import { InputType } from '../types/enums';

export function generateKeyTakeaways(
  totalKabir: number,
  saghir: number,
  element: ElementType,
  burj: string,
  inputType: InputType,
  language: 'en' | 'fr' | 'ar' = 'en'
): string[] {
  const templates = {
    en: {
      [InputType.NAME_PERSON]: [
        `Your sacred number (${totalKabir}) reveals your unique spiritual blueprint.`,
        `${element} element guides your natural tendencies and power times.`,
        `${burj} constellation marks your moments of heightened potential.`,
      ],
      [InputType.NAME_MOTHER_PAIR]: [
        `Your combined lineage number (${totalKabir}) reveals family patterns and destiny threads.`,
        `Dominant ${element} energy shapes your life approach and spiritual practice.`,
        `${burj} influence highlights your most potent spiritual moments.`,
      ],
      [InputType.DIVINE_NAME]: [
        `This sacred name carries the vibration ${totalKabir}, a gateway to divine reflection.`,
        `${element} element embodies specific divine qualities for contemplation.`,
        `Meditate on this during ${burj} season for deeper resonance.`,
      ],
      [InputType.QURAN_VERSE]: [
        `This verse vibrates at ${totalKabir}, connecting to specific spiritual stations.`,
        `${element} quality within reveals layers of meaning and wisdom.`,
        `Reflect during ${burj} periods for enhanced understanding.`,
      ],
      [InputType.SENTENCE]: [
        `This phrase carries numerical essence ${totalKabir} with ${element} qualities.`,
        `Use as dhikr or reflection during ${element}-aligned times.`,
        `${burj} periods amplify its spiritual impact.`,
      ],
      [InputType.FREE_TEXT]: [
        `Your text resonates at ${totalKabir}, revealing its energetic signature.`,
        `${element} element within suggests specific contemplative approaches.`,
        `Consider ${burj} timing for related spiritual work.`,
      ],
    },
    fr: {
      [InputType.NAME_PERSON]: [
        `Votre nombre sacré (${totalKabir}) révèle votre plan spirituel unique.`,
        `L'élément ${element} guide vos tendances naturelles et moments de puissance.`,
        `La constellation ${burj} marque vos moments de potentiel accru.`,
      ],
      [InputType.NAME_MOTHER_PAIR]: [
        `Votre nombre de lignée combiné (${totalKabir}) révèle les modèles familiaux et les fils du destin.`,
        `L'énergie ${element} dominante façonne votre approche de la vie et votre pratique spirituelle.`,
        `L'influence ${burj} met en évidence vos moments spirituels les plus puissants.`,
      ],
      [InputType.DIVINE_NAME]: [
        `Ce nom sacré porte la vibration ${totalKabir}, une porte vers la réflexion divine.`,
        `L'élément ${element} incarne des qualités divines spécifiques pour la contemplation.`,
        `Méditez là-dessus pendant la saison ${burj} pour une résonance plus profonde.`,
      ],
      [InputType.QURAN_VERSE]: [
        `Ce verset vibre à ${totalKabir}, se connectant à des stations spirituelles spécifiques.`,
        `La qualité ${element} à l'intérieur révèle des couches de sens et de sagesse.`,
        `Réfléchissez pendant les périodes ${burj} pour une compréhension améliorée.`,
      ],
      [InputType.SENTENCE]: [
        `Cette phrase porte l'essence numérique ${totalKabir} avec des qualités ${element}.`,
        `Utilisez comme dhikr ou réflexion pendant les temps alignés ${element}.`,
        `Les périodes ${burj} amplifient son impact spirituel.`,
      ],
      [InputType.FREE_TEXT]: [
        `Votre texte résonne à ${totalKabir}, révélant sa signature énergétique.`,
        `L'élément ${element} à l'intérieur suggère des approches contemplatives spécifiques.`,
        `Considérez le timing ${burj} pour le travail spirituel connexe.`,
      ],
    },
    ar: {
      [InputType.NAME_PERSON]: [
        `رقمك المقدس (${totalKabir}) يكشف عن مخططك الروحي الفريد.`,
        `عنصر ${element} يوجه ميولك الطبيعية وأوقات قوتك.`,
        `كوكبة ${burj} تحدد لحظات إمكاناتك المتزايدة.`,
      ],
      [InputType.NAME_MOTHER_PAIR]: [
        `رقم نسبك المشترك (${totalKabir}) يكشف عن أنماط العائلة وخيوط القدر.`,
        `طاقة ${element} المهيمنة تشكل نهج حياتك وممارستك الروحية.`,
        `تأثير ${burj} يسلط الضوء على لحظاتك الروحية الأكثر قوة.`,
      ],
      [InputType.DIVINE_NAME]: [
        `هذا الاسم المقدس يحمل ذبذبة ${totalKabir}، بوابة للتأمل الإلهي.`,
        `عنصر ${element} يجسد صفات إلهية محددة للتأمل.`,
        `تأمل في هذا خلال موسم ${burj} لرنين أعمق.`,
      ],
      [InputType.QURAN_VERSE]: [
        `هذه الآية تهتز عند ${totalKabir}، متصلة بمحطات روحية محددة.`,
        `صفة ${element} بداخلها تكشف طبقات من المعنى والحكمة.`,
        `تأمل خلال فترات ${burj} لفهم محسّن.`,
      ],
      [InputType.SENTENCE]: [
        `هذه العبارة تحمل جوهرًا رقميًا ${totalKabir} بصفات ${element}.`,
        `استخدمها كذكر أو تأمل خلال الأوقات المتوافقة مع ${element}.`,
        `فترات ${burj} تضخم تأثيرها الروحي.`,
      ],
      [InputType.FREE_TEXT]: [
        `نصك يتردد صداه عند ${totalKabir}، كاشفًا عن توقيعه الطاقي.`,
        `عنصر ${element} بداخله يقترح نهجًا تأمليًا محددًا.`,
        `فكر في توقيت ${burj} للعمل الروحي ذي الصلة.`,
      ],
    },
  };

  const typeTemplates = templates[language][inputType];
  return typeTemplates || templates[language][InputType.NAME_PERSON];
}
