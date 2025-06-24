import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  ArrowLeft, BookOpen, TrendingUp, Shield, 
  Bitcoin, Zap, Target, Award, Lock, DollarSign
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function EducationScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('bitcoin');

  const categories = [
    { id: 'bitcoin', title: 'Bitcoin Basics', icon: Bitcoin },
    { id: 'investing', title: 'Smart Investing', icon: TrendingUp },
    { id: 'security', title: 'Stay Safe', icon: Shield },
    { id: 'strategies', title: 'Strategies', icon: Target },
  ];

  const educationContent = {
    bitcoin: [
      {
        title: 'What is Bitcoin? 🪙',
        content: 'Bitcoin is digital gold - the first and most trusted cryptocurrency. It\'s scarce (only 21M will ever exist), decentralized, and has been growing in value since 2009.',
        keyPoints: ['Digital gold standard', 'Limited supply (21M max)', 'Decentralized network', 'Store of value']
      },
      {
        title: 'Why Bitcoin Matters 🚀',
        content: 'Major institutions like Tesla, MicroStrategy, and countries like El Salvador hold Bitcoin. It\'s becoming digital property for the internet age.',
        keyPoints: ['Institutional adoption', 'Inflation hedge', 'Global accessibility', 'Future of money']
      },
      {
        title: 'Bitcoin vs Traditional Assets 📊',
        content: 'Bitcoin has outperformed stocks, bonds, and gold over the past decade. It\'s the best-performing asset class of the 21st century.',
        keyPoints: ['Higher long-term returns', 'Lower correlation to stocks', 'Digital scarcity', '24/7 markets']
      }
    ],
    investing: [
      {
        title: 'Dollar-Cost Averaging 📈',
        content: 'Invest small amounts regularly instead of timing the market. This reduces volatility and builds wealth consistently over time.',
        keyPoints: ['Reduces timing risk', 'Builds discipline', 'Lower average cost', 'Stress-free investing']
      },
      {
        title: 'The HODLing Strategy 💎',
        content: 'HODL (Hold On for Dear Life) means buying and holding Bitcoin long-term, regardless of short-term price movements.',
        keyPoints: ['Long-term mindset', 'Ignore short-term noise', 'Compound growth', 'Proven strategy']
      },
      {
        title: 'Risk Management 🛡️',
        content: 'Only invest what you can afford to lose. Start small, learn, and gradually increase your Bitcoin allocation as you get comfortable.',
        keyPoints: ['Start with small amounts', 'Never invest borrowed money', 'Diversify gradually', 'Understand volatility']
      }
    ],
    security: [
      {
        title: 'Custodial vs Self-Custody 🔐',
        content: 'Cultivest provides secure custodial wallets. As you grow, consider learning about self-custody with hardware wallets.',
        keyPoints: ['Custodial = easy to start', 'Self-custody = you control keys', 'Both have their place', 'Start simple, grow complex']
      },
      {
        title: 'Protecting Your Accounts 🔒',
        content: 'Use strong passwords, enable 2FA, and never share your login details. Be wary of phishing attempts and scams.',
        keyPoints: ['Strong unique passwords', 'Two-factor authentication', 'Verify all communications', 'Trust but verify']
      },
      {
        title: 'Avoiding Scams 🚨',
        content: 'If it sounds too good to be true, it probably is. Bitcoin doesn\'t need get-rich-quick schemes - it IS the long-term wealth builder.',
        keyPoints: ['No guaranteed returns', 'Avoid "double your Bitcoin"', 'Stick to reputable platforms', 'Education is protection']
      }
    ],
    strategies: [
      {
        title: '80/20 Portfolio Strategy 🎯',
        content: 'Consider 80% stable investments (like USDCa earning yield) and 20% Bitcoin for growth. Adjust based on your risk tolerance.',
        keyPoints: ['Balance stability & growth', 'Customize to your risk level', 'Rebalance periodically', 'Stay disciplined']
      },
      {
        title: 'The Bitcoin Standard 🥇',
        content: 'Some investors go "Bitcoin-only" - holding 100% Bitcoin. This is higher risk but potentially higher reward for true believers.',
        keyPoints: ['Maximum Bitcoin exposure', 'Higher volatility', 'Conviction-based', 'Not for beginners']
      },
      {
        title: 'Building Your Stack 🔗',
        content: 'Start with any amount, even $5. Consistency beats timing. Build your Bitcoin stack slowly and steadily over months and years.',
        keyPoints: ['Start with any amount', 'Consistency is key', 'Think in years not days', 'Stack sats steadily']
      }
    ]
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#1A1A1A', '#2E2E2E']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Learn & Grow</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Category Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryTab, isSelected && styles.categoryTabActive]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <IconComponent 
                  size={20} 
                  color={isSelected ? '#FFFFFF' : '#8B9DC3'} 
                />
                <Text style={[styles.categoryTabText, isSelected && styles.categoryTabTextActive]}>
                  {category.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {educationContent[selectedCategory].map((item, index) => (
            <View key={index} style={styles.contentCard}>
              <LinearGradient
                colors={['#FFFFFF', '#F8F8F8']}
                style={styles.cardGradient}
              >
                <Text style={styles.contentTitle}>{item.title}</Text>
                <Text style={styles.contentText}>{item.content}</Text>
                
                <View style={styles.keyPoints}>
                  <Text style={styles.keyPointsTitle}>Key Points:</Text>
                  {item.keyPoints.map((point, pointIndex) => (
                    <View key={pointIndex} style={styles.keyPointItem}>
                      <View style={styles.bullet} />
                      <Text style={styles.keyPointText}>{point}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>
          ))}

          {/* Call to Action */}
          <View style={styles.ctaCard}>
            <LinearGradient
              colors={['#F7931A', '#FF9500']}
              style={styles.ctaGradient}
            >
              <Bitcoin size={32} color="#FFFFFF" />
              <Text style={styles.ctaTitle}>Ready to Start Your Bitcoin Journey?</Text>
              <Text style={styles.ctaText}>
                Apply what you've learned and make your first Bitcoin investment today.
              </Text>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => router.push('/(tabs)/invest')}
              >
                <Text style={styles.ctaButtonText}>Start Investing</Text>
                <TrendingUp size={20} color="#F7931A" />
              </TouchableOpacity>
            </LinearGradient>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  categoryTabs: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  categoryTabActive: {
    backgroundColor: '#F7931A',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B9DC3',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentCard: {
    marginBottom: 16,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 20,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5A5A5A',
    marginBottom: 16,
  },
  keyPoints: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F7931A',
  },
  keyPointsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F7931A',
    marginRight: 12,
  },
  keyPointText: {
    fontSize: 14,
    color: '#5A5A5A',
    flex: 1,
  },
  ctaCard: {
    marginBottom: 40,
  },
  ctaGradient: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F7931A',
  },
});