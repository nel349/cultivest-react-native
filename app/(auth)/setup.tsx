import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Shield, CircleCheck as CheckCircle, ArrowRight, Wallet, Award, ChevronDown, ChevronUp, Leaf, Sprout, Flower } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    { key: 'wallets', icon: CheckCircle, title: 'Multi-Chain Wallets ✅', color: '#58CC02' },
    { key: 'nft', icon: Award, title: 'Portfolio NFT ✅', color: '#58CC02' },
    { key: 'funding', icon: Wallet, title: 'Funding Ready ⚡', color: '#F7931A' },
    { key: 'security', icon: Shield, title: 'Security Active 🛡️', color: '#58CC02' }
  ];

  const availableAssets = [
    { name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
    { name: 'Algorand', symbol: 'ALGO', color: '#00D4AA' },
    { name: 'Solana', symbol: 'SOL', color: '#9945FF' }
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={['#89E5AB', '#58CC02', '#46A302']}
        style={styles.gradient}
      >
        {/* Decorative Plants */}
        <View style={styles.decorationContainer}>
          <View style={[styles.plantDecor, { top: 80 + insets.top, left: 25 }]}>
            <Leaf size={18} color="rgba(255,255,255,0.3)" />
          </View>
          <View style={[styles.plantDecor, { top: 160 + insets.top, right: 30 }]}>
            <Sprout size={16} color="rgba(255,255,255,0.2)" />
          </View>
          <View style={[styles.plantDecor, { bottom: 120, left: 40 }]}>
            <Flower size={20} color="rgba(255,255,255,0.25)" />
          </View>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.headerSection}>
              <View style={styles.iconContainer}>
                <Award size={32} color="#58CC02" />
              </View>
              <Text style={styles.title}>Investment Garden Ready! 🌱</Text>
              <Text style={styles.subtitle}>
                Multi-chain wallets & Portfolio NFT created. Start investing across cryptocurrencies.
              </Text>
            </View>

            {/* Status Grid - White Cards */}
            <View style={styles.statusCardContainer}>
              <Text style={styles.sectionTitle}>Setup Complete</Text>
              <View style={styles.statusGrid}>
                {setupStatus.map((item, index) => (
                  <View key={index} style={styles.statusCard}>
                    <View style={styles.statusIconContainer}>
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
                <Award size={18} color="#58CC02" />
                <Text style={styles.accordionTitle}>Your Portfolio NFT</Text>
              </View>
              {expandedSection === 'nft' ? 
                <ChevronUp size={18} color="#58CC02" /> : 
                <ChevronDown size={18} color="#58CC02" />
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
                <Wallet size={18} color="#58CC02" />
                <Text style={styles.accordionTitle}>Supported Assets</Text>
              </View>
              {expandedSection === 'assets' ? 
                <ChevronUp size={18} color="#58CC02" /> : 
                <ChevronDown size={18} color="#58CC02" />
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
                <Shield size={18} color="#58CC02" />
                <Text style={styles.accordionTitle}>Security Features</Text>
              </View>
              {expandedSection === 'security' ? 
                <ChevronUp size={18} color="#58CC02" /> : 
                <ChevronDown size={18} color="#58CC02" />
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
                colors={isLoading ? ['#C0C0C0', '#C0C0C0'] : ['#FFFFFF', '#F0F0F0']}
                style={styles.buttonGradient}
              >
                <Text style={styles.continueButtonText}>
                  {isLoading ? 'Opening your garden...' : 'Start Investing 🚀'}
                </Text>
                {!isLoading && <ArrowRight size={20} color="#58CC02" />}
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
  },
  gradient: {
    flex: 1,
  },
  decorationContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  plantDecor: {
    position: 'absolute',
    opacity: 0.6,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: Math.min(24, width * 0.06),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    width: '48%',
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
    flex: 1,
  },
  accordionContainer: {
    flex: 1,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(88, 204, 2, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accordionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
    marginLeft: 10,
  },
  accordionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: -2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(88, 204, 2, 0.1)',
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  accordionText: {
    fontSize: 14,
    color: '#5A5A5A',
    lineHeight: 20,
    fontWeight: '500',
  },
  assetsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(88, 204, 2, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(88, 204, 2, 0.1)',
  },
  assetDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  assetText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '700',
  },
  continueButton: {
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#58CC02',
  },
  statusCardContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(88, 204, 2, 0.1)',
    width: '48%',
    minHeight: 100,
    maxHeight: 120,
  },
  statusIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(88, 204, 2, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusCardText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
});