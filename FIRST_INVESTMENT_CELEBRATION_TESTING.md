# First Investment Celebration Testing Guide 🎉

This guide helps you test the complete first investment celebration flow from backend detection to frontend confetti animations.

## Prerequisites

1. **Database Migration**: Run the SQL migration first:
   ```bash
   # In the backend directory
   # Execute: cultivest-backend/scripts/add-first-investment-tracking.sql
   # Execute: cultivest-backend/scripts/add-user-preferences-table.sql
   ```

2. **Backend Running**: Ensure the backend is running on `localhost:3000`

3. **Test User**: Have a test user account that hasn't made any investments yet

## Testing Scenarios

### Scenario 1: First Investment via Auto-Fund (Development Mode)

**Steps:**
1. Open the React Native app in development mode
2. Go to the Invest tab
3. Select Bitcoin and any amount
4. Confirm "Continue with MoonPay" in the development alert
5. Let MoonPay fail (sandbox limitation)
6. Wait 10-30 seconds for webhook to process auto-funding
7. **Expected Result**: Celebration screen should appear automatically with:
   - 🎊 Multi-burst confetti animation
   - 🏆 Golden trophy with pulsing animation
   - 💰 Investment details card with asset-specific colors
   - 🌱 Garden-themed celebration messaging
   - 🎯 "View My Garden" and "Continue Growing" buttons

### Scenario 2: Manual Backend Testing

**Using HTTP Test Files:**
```bash
# Test the backend endpoints directly
# File: cultivest-backend/test-first-investment.http

# 1. Check user's current status (should be no investments)
GET http://localhost:3000/api/v1/user/first-investment-status?userID=YOUR_USER_ID

# 2. Set auto-fund preference
POST http://localhost:3000/api/v1/debug/set-auto-fund-preference
{
  "userID": "YOUR_USER_ID", 
  "autoFundOnFailure": true
}

# 3. Check status after "investment" (simulate completed investment)
# Use the SQL commands in the test file
```

### Scenario 3: App Resume Detection

**Steps:**
1. Start an investment flow but don't complete it
2. Manually create a first investment via backend/database
3. Background the app and bring it back to foreground
4. Navigate to Portfolio tab
5. **Expected Result**: Celebration should trigger automatically

### Scenario 4: Portfolio Tab Detection

**Steps:**
1. Complete an investment via any method
2. Navigate to Portfolio tab
3. Pull to refresh the portfolio
4. **Expected Result**: If it's the first investment, celebration should appear

## Celebration Features to Verify

### ✅ Animation Sequence
- [ ] Multi-burst confetti with 5 sequential explosions
- [ ] Trophy scales and pulses continuously
- [ ] Content slides in with smooth timing
- [ ] Haptic feedback on screen load
- [ ] Decorative stars and hearts pulse in background

### ✅ Content Accuracy
- [ ] Correct asset name and emoji (₿ for Bitcoin, ⚡ for Algorand, etc.)
- [ ] Proper investment amount formatting ($XX.XX)
- [ ] Asset-specific color schemes
- [ ] Garden-themed messaging ("planted your first seed")

### ✅ Navigation
- [ ] "View My Garden" button navigates to Portfolio tab
- [ ] "Continue Growing" button navigates to Portfolio tab
- [ ] Back navigation handling

### ✅ Backend Integration
- [ ] First investment detection works correctly
- [ ] User's `first_investment_completed_at` timestamp is set
- [ ] Investment has `is_first_investment = true` flag
- [ ] Subsequent investments don't trigger celebration

## Backend API Testing

### Check First Investment Status
```bash
curl "http://localhost:3000/api/v1/user/first-investment-status?userID=YOUR_USER_ID"
```

Expected response for first investment:
```json
{
  "success": true,
  "data": {
    "hasCompletedFirstInvestment": true,
    "shouldShowCelebration": true,
    "celebration": {
      "message": "🎉 First investment completed!"
    }
  }
}
```

### Set Auto-Fund Preference
```bash
curl -X POST "http://localhost:3000/api/v1/debug/set-auto-fund-preference" \
  -H "Content-Type: application/json" \
  -d '{"userID": "YOUR_USER_ID", "autoFundOnFailure": true}'
```

## Troubleshooting

### Celebration Not Showing
1. **Check Console Logs**: Look for celebration monitoring messages
2. **Verify Database**: Ensure user has `first_investment_completed_at` set
3. **Check Investment Count**: Only works for the very first completed investment
4. **Navigation Issues**: Ensure expo-router is working correctly

### Animation Issues
1. **Libraries**: Ensure `react-native-confetti-cannon` is installed
2. **Performance**: May be slower on older devices
3. **Timing**: Animations have specific delays - wait for full sequence

### Backend Issues
1. **Database Schema**: Run both SQL migrations
2. **Environment**: Ensure development mode is detected correctly
3. **Webhook Processing**: Check backend logs for investment creation

## Test Data Cleanup

To reset a user for re-testing:
```sql
-- Reset user's first investment status
UPDATE users SET first_investment_completed_at = NULL WHERE user_id = 'YOUR_USER_ID';

-- Remove all investments for user
DELETE FROM investments WHERE user_id = 'YOUR_USER_ID';

-- Reset auto-fund preference
DELETE FROM user_preferences WHERE user_id = 'YOUR_USER_ID';
```

## Success Criteria

The feature is working correctly when:
- ✅ First investment is detected automatically
- ✅ Celebration screen appears with full animation sequence
- ✅ Asset-specific styling and content is correct
- ✅ Navigation works from both buttons
- ✅ Subsequent investments don't trigger celebration
- ✅ App resume detection works
- ✅ Backend APIs return correct data

## Debug Console Messages

Look for these log messages during testing:
- `🎯 First investment check for user`
- `🎊 First investment detected! Showing celebration...`
- `👀 Starting celebration monitoring`
- `🎉 Navigating to celebration screen`
- `🎊 Confetti animation completed`

## Performance Notes

- Confetti animations may cause brief frame drops on older devices
- Monitoring polls every 10 seconds for 5 minutes maximum
- Celebration check has 2-second delay on app resume to ensure webhook processing
- Uses singleton pattern for efficient memory usage 