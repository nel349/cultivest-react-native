import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TreePine, Award, Hash, TrendingUp, Coins 
} from 'lucide-react-native';
import { PortfolioNFT } from '@/types/api';

interface NFTPortfolioCardProps {
  portfolioNFT: PortfolioNFT;
  onPress?: () => void;
}

export function NFTPortfolioCard({ portfolioNFT, onPress }: NFTPortfolioCardProps) {
  // Calculate total portfolio value from positions
  const totalValue = portfolioNFT.positions?.reduce((sum, position) => {
    return sum + (parseFloat(position.purchaseValue) / 100); // Convert from cents
  }, 0) || 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F8F8']}
        style={styles.cardGradient}
      >
        {/* Header with NFT Icon */}
        <View style={styles.header}>
          <View style={styles.nftIcon}>
            <Award size={24} color="#58CC02" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Portfolio Deed 🏡</Text>
            <Text style={styles.subtitle}>Your Digital Garden Certificate</Text>
          </View>
          {portfolioNFT.isPrimary && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryText}>Primary</Text>
            </View>
          )}
        </View>

        {/* Portfolio Value */}
        <View style={styles.valueSection}>
          <Text style={styles.portfolioName}>{portfolioNFT.customName}</Text>
          <Text style={styles.totalValue}>${totalValue.toFixed(2)}</Text>
          <Text style={styles.valueLabel}>Total Garden Value</Text>
        </View>

        {/* NFT Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <TreePine size={16} color="#58CC02" />
            <Text style={styles.statText}>{portfolioNFT.positionCount} Plants</Text>
          </View>
          <View style={styles.statItem}>
            <Hash size={16} color="#8B9DC3" />
            <Text style={styles.statText}>NFT #{portfolioNFT.tokenId}</Text>
          </View>
          <View style={styles.statItem}>
            <Coins size={16} color="#FF9500" />
            <Text style={styles.statText}>Certified</Text>
          </View>
        </View>

        {/* Growth Indicator */}
        <View style={styles.growthIndicator}>
          <TrendingUp size={20} color="#58CC02" />
          <Text style={styles.growthText}>Your garden is growing! 🌱</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E8F5E8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nftIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  primaryBadge: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  valueSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  portfolioName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 4,
  },
  valueLabel: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(88, 204, 2, 0.05)',
    borderRadius: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  growthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  growthText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#58CC02',
  },
});