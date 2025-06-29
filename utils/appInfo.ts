export const getAppInfo = async (): Promise<string> => {
  return `Welcome to Cultivest! 

This is your cryptocurrency investment platform with the following features:

🔐 Multi-Chain Wallet Support: We support Bitcoin, Algorand, and Solana - giving you access to multiple cryptocurrency networks.

💳 Easy Investment: Use your credit card or bank account to buy cryptocurrency through our secure MoonPay integration.

🎯 Smart Portfolio: Track all your investments in one place with real-time pricing and performance metrics.

🎉 Achievement System: Celebrate your investment milestones with our built-in celebration features.

📱 Cross-Platform: Access your portfolio on any device with full synchronization.

🛡️ Security First: Your private keys are generated locally and never leave your device.

To get started, complete the wallet setup process by following each step. Once ready, you can navigate to the investment tab to make your first cryptocurrency purchase.

Would you like to know more about any specific feature?`;
};

export const getFeatureInfo = (feature: string): string => {
  const featureMap: Record<string, string> = {
    'wallet': 'Your wallet supports Bitcoin, Algorand, and Solana. Private keys are generated locally for maximum security.',
    'investment': 'Invest using credit card or bank account through MoonPay. Start with as little as $10.',
    'portfolio': 'Track all your investments with real-time pricing, performance charts, and transaction history.',
    'security': 'Your private keys never leave your device. We use industry-standard encryption and security practices.',
  };
  
  return featureMap[feature.toLowerCase()] || 'Feature information not available.';
}; 