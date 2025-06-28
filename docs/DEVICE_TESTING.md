# Device Testing Configuration

## Physical Device vs Simulator Setup

When developing React Native apps with Expo, you need different API configurations depending on whether you're testing on a physical device or simulator.

### Current Setup

Your local IP address: `192.168.1.184`
Current API configuration is set in `app.json` under `expo.extra.apiUrl`

### Quick Commands

```bash
# For testing on physical device
npm run config:device

# For testing on simulator/emulator  
npm run config:simulator

# Check your current local IP
npm run config:ip
```

### Manual Configuration

If you need to manually update the IP address:

1. Get your local IP: `ifconfig | grep "inet " | grep -v "127.0.0.1" | head -1 | awk '{print $2}'`
2. Update `app.json` > `expo.extra.apiUrl` with your IP
3. Restart your Expo development server

### Why This is Needed

- **Physical devices**: Cannot access `localhost` from your computer, need your computer's local network IP
- **Simulators/Emulators**: Run on the same machine, can access `localhost` directly

### Troubleshooting

1. **Device can't connect**: 
   - Ensure both device and computer are on the same WiFi network
   - Check if your router allows device-to-device communication
   - Try disabling firewall temporarily

2. **IP address changed**:
   - Run `npm run config:device` to auto-update with current IP
   - This can happen when reconnecting to WiFi

3. **Still using old URL**:
   - Restart Expo development server
   - Clear React Native cache: `npx expo start --clear` 