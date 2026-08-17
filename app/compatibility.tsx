/**
 * Compatibility Screen — RETIRED
 * =================================
 * Legacy abjad-only compatibility calculator, superseded by
 * app/(tabs)/compatibility.tsx (the canonical Compatibility screen, which
 * includes this same abjad comparison as one of its calculation types,
 * properly mounted inside the real tab navigator). This top-level duplicate
 * rendered its own hand-rolled BottomTabBar, which could swap out the real
 * tab bar and route to dead links — kept only as a redirect so any stray
 * deep link or cached bookmark still lands somewhere correct.
 */

import { Redirect } from 'expo-router';

export default function CompatibilityScreen() {
  return <Redirect href="/(tabs)/compatibility" />;
}
