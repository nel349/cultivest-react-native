import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  ArrowLeft, BookOpen, TrendingUp, Shield, 
  Bitcoin, Zap, Target, Award, Lock, DollarSign
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

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
        title: 'What is Bitcoin?',
        content: 'Bitcoin is digital gold - the first and most trusted cryptocurrency. It\'s scarce (only 21M will ever exist), decentralized, and has been growing in value since 2009.',
        keyPoints: ['Digital gold standard', 'Limited supply (21M max)', 'Decentralized network', 'Store of value']
      },
      {
        title: 'Why Bitcoin Matters',
        content: 'Major institutions like Tesla, MicroStrategy, and countries like El Salvador hold Bitcoin. It\'s becoming digital property for the internet age.',
        keyPoints: ['Institutional adoption', 'Inflation hedge', 'Global accessibility', 'Future of money']
      },
      {
        title: 'Bitcoin vs Traditional Assets',
        content: 'Bitcoin has outperformed stocks, bonds, and gold over the past decade. It\'s the best-performing asset class of the 21st century.',
        keyPoints: ['Higher long-term returns', 'Lower correlation to stocks', 'Digital scarcity', '24/7 markets']
      }
    ],
    investing: [
      {
        title: 'Dollar-Cost Averaging',
        content: 'Invest small amounts regularly instead of timing the market. This reduces volatility and builds wealth consistently over time.',
        keyPoints: ['Reduces timing risk', 'Builds discipline', 'Lower average cost', 'Stress-free investing']
      },
      {
        title: 'The HODLing Strategy',
        content: 'HODL (Hold On for Dear Life) means buying and holding Bitcoin long-term, regardless of short-term price movements.',
        keyPoints: ['Long-term mindset', 'Ignore short-term noise', 'Compound growth', 'Proven strategy']
      },
      {
        title: 'Risk Management',
        content: 'Only invest what you can afford to lose. Start small, learn, and gradually increase your Bitcoin allocation as you get comfortable.',
        keyPoints: ['Start with small amounts', 'Never invest borrowed money', 'Diversify gradually', 'Understand volatility']
      }
    ],
    security: [
      {
        title: 'Custodial vs Self-Custody',
        content: 'Cultivest provides secure custodial wallets. As you grow, consider learning about self-custody with hardware wallets.',
        keyPoints: ['Custodial = easy to start', 'Self-custody = you control keys', 'Both have their place', 'Start simple, grow complex']
      },
      {
        title: 'Protecting Your Accounts',
        content: 'Use strong passwords, enable 2FA, and never share your login details. Be wary of phishing attempts and scams.',
        keyPoints: ['Strong unique passwords', 'Two-factor authentication', 'Verify all communications', 'Trust but verify']
      },
      {
        title: 'Avoiding Scams',
        content: 'If it sounds too good to be true, it probably is. Bitcoin doesn\'t need get-rich-quick schemes - it IS the long-term wealth builder.',
        keyPoints: ['No guaranteed returns', 'Avoid "double your Bitcoin"', 'Stick to reputable platforms', 'Education is protection']
      }
    ],
    strategies: [
      {
        title: '80/20 Portfolio Strategy',
        content: 'Consider 80% stable investments (like USDCa earning yield) and 20% Bitcoin for growth. Adjust based on your risk tolerance.',
        keyPoints: ['Balance stability & growth', 'Customize to your risk level', 'Rebalance periodically', 'Stay disciplined']
      },
      {
        title: 'The Bitcoin Standard',
        content: 'Some investors go "Bitcoin-only" - holding 100% Bitcoin. This is higher risk but potentially higher reward for true believers.',
        keyPoints: ['Maximum Bitcoin exposure', 'Higher volatility', 'Conviction-based', 'Not for beginners']
      },
      {
        title: 'Building Your Stack',
        content: 'Start with any amount, even $5. Consistency beats timing. Build your Bitcoin stack slowly and steadily over months and years.',
        keyPoints: ['Start with any amount', 'Consistency is key', 'Think in years not days', 'Stack sats steadily']
      }
    ]
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={Colors.gradients.backgroundPrimary}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text.primary} />
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
                  color={isSelected ? Colors.text.primary : Colors.text.tertiary} 
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
          {educationContent[selectedCategory as keyof typeof educationContent].map((item, index) => (
            <View key={index} style={styles.contentCard}>
              <View style={styles.cardContent}>
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
              </View>
            </View>
          ))}

          {/* Call to Action */}
          <View style={styles.ctaCard}>
            <LinearGradient
              colors={Colors.gradients.primary}
              style={styles.ctaGradient}
            >
              <Bitcoin size={32} color={Colors.text.primary} />
              <Text style={styles.ctaTitle}>Ready to Start Your Bitcoin Journey?</Text>
              <Text style={styles.ctaText}>
                Apply what you've learned and make your first Bitcoin investment today.
              </Text>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => router.push('/(tabs)/invest')}
              >
                <Text style={styles.ctaButtonText}>Start Investing</Text>
                <TrendingUp size={20} color={Colors.text.primary} />
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.heavy,
    color: Colors.text.primary,
  },
  headerRight: {
    width: 40, // Balance the back button
  },
  categoryTabs: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.lg,
    marginRight: Spacing.md,
    gap: Spacing.sm,
  },
  categoryTabActive: {
    backgroundColor: Colors.brand.green,
  },
  categoryTabText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.tertiary,
  },
  categoryTabTextActive: {
    color: Colors.text.primary,
    fontWeight: Typography.weight.semibold,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  contentCard: {
    marginBottom: Spacing.lg,
    borderRadius: Spacing.lg,
    ...Shadow.md,
  },
  cardContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
  },
  contentTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  contentText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  keyPoints: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: Spacing.md,
    padding: Spacing.base,
  },
  keyPointsTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brand.green,
    marginRight: Spacing.sm,
  },
  keyPointText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    flex: 1,
  },
  ctaCard: {
    marginBottom: Spacing['2xl'],
    borderRadius: Spacing.lg,
    ...Shadow.lg,
  },
  ctaGradient: {
    borderRadius: Spacing.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  ctaText: {
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  ctaButtonText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.brand.green,
  },
});