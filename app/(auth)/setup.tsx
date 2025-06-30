import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Shield, CircleCheck as CheckCircle, ArrowRight, Wallet, Award, ChevronDown, ChevronUp, Leaf, Sprout, Flower } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function SetupScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Navigate to main app - funding will be set up in the dashboard
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const setupStatus = [
    { key: 'wallets', icon: CheckCircle, title: 'Multi-Chain Wallets ✅', color: Colors.brand.green },
    { key: 'nft', icon: Award, title: 'Portfolio NFT ✅', color: Colors.brand.green },
    { key: 'funding', icon: Wallet, title: 'Funding Ready ⚡', color: Colors.crypto.bitcoin },
    { key: 'security', icon: Shield, title: 'Security Active 🛡️', color: Colors.brand.green }
  ];

  const availableAssets = [
    { name: 'Bitcoin', symbol: 'BTC', color: Colors.crypto.bitcoin },
    { name: 'Algorand', symbol: 'ALGO', color: Colors.crypto.algorand },
    { name: 'Solana', symbol: 'SOL', color: Colors.crypto.solana }
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.backgroundPrimary}
        style={[styles.gradient, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        {/* Decorative elements removed for clean dark theme */}

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.headerSection}>
              <View style={styles.iconContainer}>
                <Award size={40} color={Colors.brand.green} />
              </View>
              <Text style={styles.title}>Investment Garden Ready! 🌱</Text>
              <Text style={styles.subtitle}>
                Multi-chain wallets & Portfolio NFT created. Start investing across cryptocurrencies.
              </Text>
            </View>

            {/* Status Grid - Dark Cards */}
            <View style={styles.statusCardContainer}>
              <Text style={styles.sectionTitle}>Setup Complete</Text>
              <View style={styles.statusGrid}>
                {setupStatus.map((item, index) => (
                  <View key={index} style={styles.statusCard}>
                    <View style={[styles.statusIconContainer, { backgroundColor: `${item.color}20` }]}>
                      <item.icon size={20} color={item.color} />
                    </View>
                    <Text style={styles.statusCardText}>{item.title}</Text>
                  </View>
                ))}
              </View>
            </View>

          {/* Accordion Sections */}
          <View style={styles.accordionContainer}>
            {/* Portfolio NFT Accordion */}
            <TouchableOpacity 
              style={styles.accordionHeader}
              onPress={() => toggleSection('nft')}
              activeOpacity={0.8}
            >
              <View style={styles.accordionTitleContainer}>
                <Award size={18} color={Colors.brand.green} />
                <Text style={styles.accordionTitle}>Your Portfolio NFT</Text>
              </View>
              {expandedSection === 'nft' ? 
                <ChevronUp size={18} color={Colors.brand.green} /> : 
                <ChevronDown size={18} color={Colors.brand.green} />
              }
            </TouchableOpacity>
            {expandedSection === 'nft' && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionText}>
                  Digital certificate tracking all investments across Bitcoin, Algorand & Solana with real-time performance updates.
                </Text>
              </View>
            )}

            {/* Available Assets Accordion */}
            <TouchableOpacity 
              style={styles.accordionHeader}
              onPress={() => toggleSection('assets')}
              activeOpacity={0.8}
            >
              <View style={styles.accordionTitleContainer}>
                <Wallet size={18} color={Colors.brand.green} />
                <Text style={styles.accordionTitle}>Supported Assets</Text>
              </View>
              {expandedSection === 'assets' ? 
                <ChevronUp size={18} color={Colors.brand.green} /> : 
                <ChevronDown size={18} color={Colors.brand.green} />
              }
            </TouchableOpacity>
            {expandedSection === 'assets' && (
              <View style={styles.accordionContent}>
                <View style={styles.assetsGrid}>
                  {availableAssets.map((asset, index) => (
                    <View key={index} style={styles.assetItem}>
                      <View style={[styles.assetDot, { backgroundColor: asset.color }]} />
                      <Text style={styles.assetText}>{asset.symbol}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Security Accordion */}
            <TouchableOpacity 
              style={styles.accordionHeader}
              onPress={() => toggleSection('security')}
              activeOpacity={0.8}
            >
              <View style={styles.accordionTitleContainer}>
                <Shield size={18} color={Colors.brand.green} />
                <Text style={styles.accordionTitle}>Security Features</Text>
              </View>
              {expandedSection === 'security' ? 
                <ChevronUp size={18} color={Colors.brand.green} /> : 
                <ChevronDown size={18} color={Colors.brand.green} />
              }
            </TouchableOpacity>
            {expandedSection === 'security' && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionText}>
                  • Professional custodial security{'\n'}
                  • Bank-grade encryption{'\n'}
                  • Future self-custody options
                </Text>
              </View>
            )}
          </View>

            {/* Call to Action */}
            <TouchableOpacity
              style={[styles.continueButton, isLoading && styles.buttonDisabled]}
              onPress={handleComplete}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? [Colors.button.disabled, Colors.button.disabled] : Colors.gradients.primary}
                style={styles.buttonGradient}
              >
                <Text style={styles.continueButtonText}>
                  {isLoading ? 'Opening your garden...' : 'Start Investing 🚀'}
                </Text>
                {!isLoading && <ArrowRight size={20} color={Colors.brand.white} />}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  gradient: {
    flex: 1,
  },
  // Decorative elements removed for clean dark theme
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    paddingBottom: Spacing['4xl'],
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
    marginTop: Spacing['2xl'],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.base,
    ...Shadow.lg,
  },
  title: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.size.base,
    paddingHorizontal: Spacing.base,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.xs,
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  statusText: {
    fontSize: Typography.size.xs,
    color: Colors.text.primary,
    fontWeight: Typography.weight.semibold,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  accordionContainer: {
    marginBottom: Spacing['2xl'],
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
    ...Shadow.sm,
  },
  accordionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  accordionContent: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: 16,
    padding: Spacing.lg,
    marginTop: -2,
    marginBottom: Spacing.base,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  accordionText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
    fontWeight: Typography.weight.medium,
  },
  assetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  assetDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  assetText: {
    fontSize: Typography.size.xs,
    color: Colors.text.primary,
    fontWeight: Typography.weight.bold,
  },
  continueButton: {
    borderRadius: 20,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.lg,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: 20,
    gap: Spacing.sm,
  },
  continueButtonText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.brand.white,
  },
  statusCardContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    padding: Spacing.lg,
    marginVertical: Spacing.lg,
    ...Shadow.lg,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: 16,
    padding: Spacing.base,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    width: '48%',
    minHeight: 100,
    maxHeight: 120,
  },
  statusIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statusCardText: {
    fontSize: Typography.size.xs,
    color: Colors.text.primary,
    fontWeight: Typography.weight.semibold,
    textAlign: 'center',
    lineHeight: 16,
  },
});