import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors, Typography, Spacing } from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerStyle: { backgroundColor: Colors.background.primary }, headerTintColor: Colors.text.primary }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.background.primary,
  },
  text: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  link: {
    marginTop: Spacing.base,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.background.tertiary,
  },
  linkText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.brand.green,
  },
});
