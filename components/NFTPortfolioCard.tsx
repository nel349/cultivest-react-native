import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  TrendingUp, Award, Hash, Coins 
} from 'lucide-react-native';
import { PortfolioNFT } from '@/types/api';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

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
      <View style={styles.cardContent}>
        {/* Header with NFT Icon */}
        <View style={styles.header}>
          <View style={styles.nftIcon}>
            <Award size={24} color={Colors.brand.green} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Portfolio Deed</Text>
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
            <TrendingUp size={16} color={Colors.brand.green} />
            <Text style={styles.statText}>{portfolioNFT.positionCount} Plants</Text>
          </View>
          <View style={styles.statItem}>
            <Hash size={16} color={Colors.text.tertiary} />
            <Text style={styles.statText}>NFT #{portfolioNFT.tokenId}</Text>
          </View>
          <View style={styles.statItem}>
            <Coins size={16} color={Colors.crypto.bitcoin} />
            <Text style={styles.statText}>Certified</Text>
          </View>
        </View>

        {/* Growth Indicator */}
        <View style={styles.growthIndicator}>
          <TrendingUp size={20} color={Colors.brand.green} />
          <Text style={styles.growthText}>Your garden is growing!</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.base,
    borderRadius: Spacing.lg,
    ...Shadow.md,
  },
  cardContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.background.tertiary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  nftIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.medium,
  },
  primaryBadge: {
    backgroundColor: Colors.brand.green,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.md,
  },
  primaryText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  valueSection: {
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  portfolioName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  totalValue: {
    fontSize: Typography.size['4xl'],
    fontWeight: Typography.weight.heavy,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  valueLabel: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.medium,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.tertiary,
    borderRadius: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  growthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  growthText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.brand.green,
  },
});