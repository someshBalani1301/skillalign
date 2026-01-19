# 🚀 Quick Start - Payment Integration

## Setup in 5 Minutes

### 1. Get Razorpay Test Keys (2 min)

1. Go to https://dashboard.razorpay.com/signup
2. Sign up (use Google for faster signup)
3. After login, click "Test Mode" toggle (top right)
4. Go to Settings → API Keys
5. Click "Generate Test Keys"
6. Copy your keys

### 2. Configure Environment (1 min)

Create `.env.local` in project root:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### 3. Test Payment (2 min)

```bash
npm run dev
```

1. Go to http://localhost:3000
2. Sign in or create account
3. Navigate to JD Match page
4. Click "Unlock Now" button
5. Select any plan
6. Use test card: **4111 1111 1111 1111**
7. CVV: **123**, Expiry: **12/25**
8. Submit payment
9. ✅ Success! Check your subscription updated

## Test Cards

| Card Number         | Result     |
| ------------------- | ---------- |
| 4111 1111 1111 1111 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Decline |
| 5555 5555 5555 4444 | ✅ Success |

All test cards accept:

- Any CVV (3 digits)
- Any future expiry date
- Any cardholder name

## Features Implemented

✅ Razorpay payment gateway integration
✅ Order creation API
✅ Payment signature verification  
✅ Subscription management
✅ Usage tracking (JD analysis count)
✅ Access control (premium features)
✅ Real-time subscription updates
✅ Error handling & user feedback
✅ Loading states
✅ Security (HMAC signature verification)

## What Happens After Payment?

1. **Order Created** → Razorpay generates order ID
2. **Payment Modal Opens** → User enters card details
3. **Payment Processed** → Razorpay validates payment
4. **Signature Verified** → Server validates authenticity
5. **Subscription Updated** → User gets instant access
6. **Features Unlocked** → Premium content visible

## Plans Available

| Plan        | Price | Features                              |
| ----------- | ----- | ------------------------------------- |
| Single JD   | ₹99   | 1 analysis, Full report, 7 days       |
| Weekly Pro  | ₹299  | Unlimited, Priority support, 7 days   |
| Monthly Pro | ₹999  | Unlimited, Advanced features, 30 days |

## Next Steps

### For Production:

1. Get live Razorpay keys
2. Deploy to Vercel/Netlify (auto HTTPS)
3. Update environment variables
4. Test with real money
5. Enable webhooks for notifications

### Optional Enhancements:

- Email receipts (nodemailer)
- Database integration (Prisma/Supabase)
- Invoice generation (PDF)
- Refund handling
- Discount codes
- Subscription renewal reminders

## Troubleshooting

**Payment modal not opening?**

- Check console for errors
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
- Ensure script loads (Network tab)

**Payment succeeds but subscription not updating?**

- Check `/api/payment/verify` is called
- Verify secret key matches
- Check browser console for errors

**"Invalid signature" error?**

- Ensure `RAZORPAY_KEY_SECRET` is correct
- Check keys are from same account (test/live)

## Support

- Razorpay Docs: https://razorpay.com/docs
- Test Integration: https://razorpay.com/docs/payments/payments/test-integration/
- Contact: support@razorpay.com

---

**🎉 You're ready to accept payments!**
