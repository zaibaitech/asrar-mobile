import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function PrayerGuidancePrayerRoute() {
	const router = useRouter();
	const params = useLocalSearchParams<{ prayerId?: string }>();

	useEffect(() => {
		const prayerId = params.prayerId;

		router.replace({
			pathname: '/prayer-guidance',
			params: typeof prayerId === 'string' ? { prayer: prayerId } : undefined,
		});
	}, [params.prayerId, router]);

	return (
		<View style={styles.container}>
			<ActivityIndicator />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

