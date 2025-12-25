/**
 * Name Destiny Form Route - redirects to form.tsx
 */

import { Redirect } from 'expo-router';

export default function NameDestinyIndex() {
  return <Redirect href="/(tabs)/name-destiny/form" />;
}
