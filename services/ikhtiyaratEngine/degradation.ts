/**
 * Same-day degradation warning.
 * Ported from asrar.app's src/lib/ikhtiyarat/degradation.ts, with an
 * added Arabic branch (the source only has en/fr — see note below).
 *
 * Detects when conditions materially change within the day relative to
 * the chosen bestWindow — a hard-fail rule fires at some later sampled
 * hour that wasn't present at bestWindow (or the reverse: bestWindow
 * hard-fails but an earlier window in the day was clean). Computed
 * entirely from the 3-hour samples evaluateElection already produced
 * (ElectionResult.allWindows) — no new astronomy.
 */

import { ElectionResult, RuleResult } from './types';

export interface DegradationNote {
  /** The rule that newly appears (or disappears) relative to bestWindow. */
  rule: RuleResult;
  /** Local hour-of-day (0-23) at which the change is first observed. */
  hour: number;
  /** True if a hard fail newly APPEARS after bestWindow; false if bestWindow itself hard-fails but an earlier window was clean. */
  worsensLater: boolean;
}

/**
 * Finds the first window (relative to bestWindow.time) whose hasHardFail
 * differs from bestWindow.hasHardFail, and identifies the specific
 * hard-fail rule responsible. Returns null if no such change exists
 * (the common case — most days don't flip mid-day).
 */
export function findDayDegradation(result: ElectionResult): DegradationNote | null {
  const { bestWindow, allWindows } = result;

  if (!bestWindow.hasHardFail) {
    // bestWindow is clean — look for a LATER window that newly hard-fails.
    const laterHardFail = allWindows.find(
      w => w.time.getTime() > bestWindow.time.getTime() && w.hasHardFail,
    );
    if (!laterHardFail) return null;
    const rule = laterHardFail.rules.find(r => r.status === 'hardfail');
    if (!rule) return null;
    return {
      rule,
      hour: getLocalHour(laterHardFail.time, result.date),
      worsensLater: true,
    };
  }

  // bestWindow itself hard-fails (isLeastAfflicted case) — check whether an
  // EARLIER window in the day was clean, meaning things started fine and
  // degraded before the engine had to fall back.
  const earlierClean = allWindows.find(
    w => w.time.getTime() < bestWindow.time.getTime() && !w.hasHardFail,
  );
  if (!earlierClean) return null;
  const rule = bestWindow.rules.find(r => r.status === 'hardfail');
  if (!rule) return null;
  return {
    rule,
    hour: getLocalHour(bestWindow.time, result.date),
    worsensLater: false,
  };
}

/** Hour-of-day for a window time, relative to the day's local midnight (result.date). */
function getLocalHour(windowTime: Date, dayStart: Date): number {
  return Math.round((windowTime.getTime() - dayStart.getTime()) / (60 * 60 * 1000)) % 24;
}

/**
 * Formats the degradation note as a one-line string, e.g.
 * "Conditions worsen later this day — Moon combust after ~22:00."
 * Returns null if there's nothing to report.
 *
 * NOTE: the 'ar' branch's phrasing is a new translation (DRAFT — needs
 * native/scholarly review before shipping), since the source app only
 * ships en/fr for this string. label_ar on the rule itself is also a
 * fresh translation where the source rule didn't provide one — see the
 * election rule files for per-rule DRAFT markers.
 */
export function getDayDegradationNote(result: ElectionResult, lang: 'en' | 'fr' | 'ar'): string | null {
  const note = findDayDegradation(result);
  if (!note) return null;

  const hourStr = `${note.hour.toString().padStart(2, '0')}:00`;

  if (lang === 'fr') {
    const ruleLabel = note.rule.label_fr;
    return note.worsensLater
      ? `Les conditions se détériorent plus tard ce jour — ${ruleLabel} après ~${hourStr}.`
      : `Les conditions s'améliorent plus tôt ce jour — ${ruleLabel} avant ~${hourStr}.`;
  }
  if (lang === 'ar') {
    const ruleLabel = note.rule.label_ar;
    // DRAFT translation — needs native/scholarly review.
    return note.worsensLater
      ? `تتدهور الأحوال لاحقًا في هذا اليوم — ${ruleLabel} بعد الساعة ${hourStr} تقريبًا.`
      : `كانت الأحوال أفضل في وقت سابق من هذا اليوم — ${ruleLabel} قبل الساعة ${hourStr} تقريبًا.`;
  }
  const ruleLabel = note.rule.label_en;
  return note.worsensLater
    ? `Conditions worsen later this day — ${ruleLabel} after ~${hourStr}.`
    : `Conditions were better earlier this day — ${ruleLabel} before ~${hourStr}.`;
}
