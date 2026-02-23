import { getClassicalPlanetaryRuling, getAlignmentStatusFromPlanet } from '../services/MomentAlignmentService';

console.log('\n=== CLASSICAL PLANETARY RULING TEST ===\n');
console.log('Testing all 7 traditional planets:\n');

const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

const emojiMap: Record<string, string> = {
  Sun: '☀️',
  Moon: '☽',
  Mars: '♂',
  Mercury: '☿',
  Jupiter: '♃',
  Venus: '♀',
  Saturn: '♄',
};

const statusEmoji: Record<string, string> = {
  ACT: '🟢',
  MAINTAIN: '🟡',
  HOLD: '🟣',
};

const statusLabel: Record<string, string> = {
  ACT: 'Excellent Time',
  MAINTAIN: 'Neutral',
  HOLD: 'Proceed Mindfully',
};

console.log('| Planet      | Classical Ruling | Status Badge          |');
console.log('|-------------|------------------|-----------------------|');

for (const planet of planets) {
  const ruling = getClassicalPlanetaryRuling(planet);
  const status = getAlignmentStatusFromPlanet(planet);
  const emoji = emojiMap[planet];
  const badge = statusEmoji[status];
  const label = statusLabel[status];
  
  console.log(`| ${emoji} ${planet.padEnd(8)} | ${ruling.padEnd(16)} | ${badge} ${label.padEnd(18)} |`);
}

console.log('\n=== EXPECTED BEHAVIOR ===\n');
console.log('✅ Benefics (Sun, Jupiter, Venus) → FAVORABLE → 🟢 Excellent Time');
console.log('✅ Neutral (Moon, Mercury) → NEUTRAL → 🟡 Neutral');
console.log('✅ Malefics (Saturn, Mars) → CAUTIOUS → 🟣 Proceed Mindfully');
console.log('\n=== TEST COMPLETE ===\n');
