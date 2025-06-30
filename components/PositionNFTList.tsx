import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { 
  Bitcoin, Coins, DollarSign, TrendingUp, ArrowUpRight, Hash
} from 'lucide-react-native';
import { PositionNFT } from '@/types/api';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

const assetIcons: { [key: string]: any } = {
  '1': Bitcoin,     // Bitcoin
  '2': Coins,       // Algorand  
  '3': DollarSign,  // USDC
  '4': Coins,       // Solana (using Coins icon for now)
};

const assetPlantThemes: { [key: string]: any } = {
  '1': { plant: TrendingUp, color: Colors.crypto.bitcoin, bgColor: Colors.background.tertiary, name: 'Bitcoin Position' },
  '2': { plant: ArrowUpRight, color: Colors.crypto.algorand, bgColor: Colors.background.tertiary, name: 'Algorand Position' },
  '3': { plant: Coins, color: Colors.crypto.usdc, bgColor: Colors.background.tertiary, name: 'USDC Position' },
  '4': { plant: TrendingUp, color: Colors.crypto.solana, bgColor: Colors.background.tertiary, name: 'Solana Position' },
};

interface PositionNFTListProps {
  positions: PositionNFT[];
  onPositionPress?: (position: PositionNFT) => void;
}

export function PositionNFTList({ positions, onPositionPress }: PositionNFTListProps) {
  const renderPosition = ({ item, index }: { item: PositionNFT; index: number }) => {
    const theme = assetPlantThemes[item.assetType] || assetPlantThemes['2'];
    const IconComponent = assetIcons[item.assetType] || Coins;
    const PlantComponent = theme.plant;
    
    const value = parseFloat(item.purchaseValue) / 100; // Convert from cents
    const holdings = parseFloat(item.holdings);
    
    return (
      <TouchableOpacity
        style={[styles.positionCard, { marginBottom: index === positions.length - 1 ? 0 : Spacing.md }]}
        onPress={() => onPositionPress?.(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          {/* Asset Icon with Plant Theme */}
          <View style={styles.iconContainer}>
            <View style={[styles.assetIcon, { backgroundColor: theme.color }]}>
              <IconComponent size={20} color={Colors.text.primary} />
            </View>
            <View style={[styles.plantIcon, { backgroundColor: theme.bgColor }]}>
              <PlantComponent size={16} color={theme.color} />
            </View>
          </View>

          {/* Position Info */}
          <View style={styles.positionInfo}>
            <Text style={styles.assetName}>{item.assetTypeName} Plant</Text>
            <Text style={styles.plantTheme}>{theme.name}</Text>
            <View style={styles.nftInfo}>
              <Hash size={12} color={Colors.text.tertiary} />
              <Text style={styles.tokenId}>Plant Certificate #{item.tokenId}</Text>
            </View>
          </View>

          {/* Position Value */}
          <View style={styles.positionValue}>
            <Text style={styles.valueAmount}>${value.toFixed(2)}</Text>
            <Text style={styles.holdingsText}>
              {item.assetType === '1' 
                ? `${(holdings / 100000000).toFixed(8)} BTC` // Satoshis to BTC
                : item.assetType === '2'
                ? `${(holdings / 1000000).toFixed(2)} ALGO` // microALGO to ALGO
                : item.assetType === '3'
                ? `${(holdings / 100).toFixed(2)} USDC` // Cents to USDC
                : item.assetType === '4'
                ? `${(holdings / 1000000000).toFixed(6)} SOL` // Lamports to SOL
                : `${holdings} units`
              }
            </Text>
            <View style={[styles.certifiedBadge, { backgroundColor: theme.bgColor }]}>
              <Text style={[styles.certifiedText, { color: theme.color }]}>Certified NFT</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!positions || positions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TrendingUp size={48} color={Colors.text.tertiary} />
        <Text style={styles.emptyTitle}>No Plant Certificates Yet</Text>
        <Text style={styles.emptySubtitle}>Start investing to grow your digital garden!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Plant Certificates</Text>
      <FlatList
        data={positions}
        renderItem={renderPosition}
        keyExtractor={(item) => item.tokenId}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} // Disable scroll since it's inside a ScrollView
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.base,
  },
  positionCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: Spacing.lg,
    ...Shadow.sm,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.background.tertiary,
  },
  iconContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  assetIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  },
  positionInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  plantTheme: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.xs,
  },
  nftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tokenId: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.medium,
  },
  positionValue: {
    alignItems: 'flex-end',
  },
  valueAmount: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  holdingsText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.xs,
  },
  certifiedBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.sm,
  },
  certifiedText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
  },
  emptyContainer: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing.lg,
    borderRadius: Spacing.lg,
    padding: Spacing['2xl'],
    alignItems: 'center',
    ...Shadow.sm,
  },
  emptyTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});