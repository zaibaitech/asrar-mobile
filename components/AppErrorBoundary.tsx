import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// @ts-ignore - __DEV__ is defined by React Native
declare const __DEV__: boolean;

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message?: string;
};

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error('[AppErrorBoundary] Unhandled error:', error);
    }
  }

  private reset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.subtitle} numberOfLines={3}>
          {this.state.message || 'The app hit an unexpected error.'}
        </Text>
        <TouchableOpacity style={styles.button} onPress={this.reset} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0b0710',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(139, 115, 85, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.5)',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
