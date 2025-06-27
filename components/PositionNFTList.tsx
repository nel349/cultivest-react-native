import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bitcoin, Coins, DollarSign, Sprout, Leaf, Flower, Hash
} from 'lucide-react-native';
import { PositionNFT } from '@/types/api';

const assetIcons = {
  '1': Bitcoin,     // Bitcoin
  '2': Coins,       // Algorand  
  '3': DollarSign,  // USDC
};

const assetPlantThemes = {
  '1': { plant: Sprout, color: '#FF9500', bgColor: '#FFF3E0', name: 'Bitcoin Sprout' },
  '2': { plant: Leaf, color: '#58CC02', bgColor: '#E8F5E8', name: 'Algorand Leaf' },
  '3': { plant: Flower, color: '#00D4AA', bgColor: '#E0F7F4', name: 'USDC Flower' },
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
        style={[styles.positionCard, { marginBottom: index === positions.length - 1 ? 0 : 12 }]}
        onPress={() => onPositionPress?.(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FFFFFF', '#FAFAFA']}
          style={styles.cardGradient}
        >
          {/* Asset Icon with Plant Theme */}
          <View style={styles.iconContainer}>
            <View style={[styles.assetIcon, { backgroundColor: theme.color }]}>
              <IconComponent size={20} color="#FFFFFF" />
            </View>
            <View style={[styles.plantIcon, { backgroundColor: theme.bgColor }]}>
              <PlantComponent size={16} color={theme.color} />
            </View>
          </View>

          {/* Position Info */}
          <View style={styles.positionInfo}>
            <Text style={styles.assetName}>{item.assetTypeName} Plant 🌱</Text>
            <Text style={styles.plantTheme}>{theme.name}</Text>
            <View style={styles.nftInfo}>
              <Hash size={12} color="#8B9DC3" />
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
                : `${(holdings / 100).toFixed(2)} USDC` // Cents to USDC
              }
            </Text>
            <View style={[styles.certifiedBadge, { backgroundColor: theme.bgColor }]}>
              <Text style={[styles.certifiedText, { color: theme.color }]}>Certified NFT</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (!positions || positions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Sprout size={48} color="#C4C4C4" />
        <Text style={styles.emptyTitle}>No Plant Certificates Yet</Text>
        <Text style={styles.emptySubtitle}>Start investing to grow your digital garden! 🌱</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Plant Certificates 💎</Text>
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  positionCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
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
    borderColor: '#FFFFFF',
  },
  positionInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  plantTheme: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
    marginBottom: 4,
  },
  nftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tokenId: {
    fontSize: 10,
    color: '#8B9DC3',
    fontWeight: '500',
  },
  positionValue: {
    alignItems: 'flex-end',
  },
  valueAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  holdingsText: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
    marginBottom: 4,
  },
  certifiedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  certifiedText: {
    fontSize: 9,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});