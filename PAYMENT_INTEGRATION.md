# 💳 Payment Integration - Complete Setup Guide

## ✅ What's Implemented

### Backend APIs (Next.js API Routes)

1. **`/api/payment/create-order`** - POST
   - Creates Razorpay order
   - Validates plan and user data
   - Returns order ID for checkout

2. **`/api/payment/verify`** - POST
   - Verifies payment signature
   - Updates subscription status
   - Returns subscription data

3. **`/api/subscription`** - GET/POST
   - Manages subscription status
   - Tracks JD analysis usage
   - Handles subscription updates

### Frontend Integration

1. **Payment Service** (`src/lib/payment.ts`)
   - Loads Razorpay SDK dynamically
   - Handles payment flow
   - Manages success/failure callbacks

2. **Razorpay Config** (`src/lib/razorpay.ts`)
   - Plan configurations (₹99, ₹299, ₹999)
   - Razorpay instance setup
   - Payment options builder

3. **PricingModal** (Updated)
   - Real payment integration
   - Error handling
   - Success notifications
   - Loading states

4. **AuthContext** (Updated)
   - `updateSubscriptionFromPayment()` - Updates subscription after payment
   - `incrementJDCount()` - Tracks usage
   - Payment data persistence

---

## 🚀 Setup Instructions

### Step 1: Get Razorpay Credentials

1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Go to Dashboard → Settings → API Keys
3. Copy **Key ID** and **Key Secret**
4. For testing, use **Test Mode** keys

### Step 2: Configure Environment Variables

Create `.env.local` file in project root:

```env
# Razorpay Keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

**Important:**

- `RAZORPAY_KEY_ID` - Server-side only (never exposed to client)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Client-side (same as KEY_ID)
- Never commit `.env.local` to git!

### Step 3: Test Payment Flow

1. **Start Dev Server:**

   ```bash
   npm run dev
   ```

2. **Test Workflow:**
   - Sign in / Create account
   - Go to JD Match page
   - Click "Unlock Now" button
   - Select a pricing plan
   - Payment modal opens with Razorpay checkout
   - Use test card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - Complete payment
   - Subscription updates automatically

3. **Razorpay Test Cards:**
   - Success: `4111 1111 1111 1111`
   - Failure: `4000 0000 0000 0002`
   - See more: [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)

---

## 📊 Payment Flow Diagram

```
User Clicks "Select Plan"
        ↓
Frontend: initiatePayment()
        ↓
API: POST /api/payment/create-order
        ↓
Razorpay: Creates Order
        ↓
Frontend: Opens Razorpay Checkout Modal
        ↓
User: Completes Payment
        ↓
Razorpay: Sends payment success to frontend
        ↓
Frontend: Calls /api/payment/verify
        ↓
API: Verifies signature with HMAC-SHA256
        ↓
API: Returns subscription data
        ↓
Frontend: Updates AuthContext
        ↓
User: Gets instant access to premium features
```

---

## 🔐 Security Features

1. **Signature Verification**
   - Server-side HMAC-SHA256 validation
   - Prevents payment tampering
   - Ensures payment authenticity

2. **Environment Variables**
   - Secret keys never exposed to client
   - Separate keys for test/production

3. **HTTPS Required**
   - Razorpay requires HTTPS in production
   - Use Vercel/Netlify for auto-SSL

---

## 💾 Subscription Management

### Plan Details

```typescript
{
  single: {
    price: ₹99,
    features: ["1 JD Analysis", "Full Report", "7 days validity"],
    maxAnalysis: 1
  },
  weekly: {
    price: ₹299,
    features: ["Unlimited JD", "Priority Support", "7 days validity"],
    validityDays: 7
  },
  monthly: {
    price: ₹999,
    features: ["Unlimited JD", "Advanced Analytics", "30 days validity"],
    validityDays: 30
  }
}
```

### Usage Tracking

- **JD Analysis Count:** Increments on every analysis
- **Access Check:** `hasPremiumAccess()` validates:
  - Active subscription status
  - Expiry date (for time-based plans)
  - Usage limits (for single plan)

---

## 📧 Email Receipts (TODO)

To send email receipts after payment:

1. **Install Nodemailer:**

   ```bash
   npm install nodemailer
   ```

2. **Configure SMTP:**

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

3. **Create Email Service:**

   ```typescript
   // src/lib/email.ts
   import nodemailer from "nodemailer";

   export async function sendPaymentReceipt(
     email: string,
     plan: string,
     amount: number,
     paymentId: string,
   ) {
     const transporter = nodemailer.createTransport({
       host: process.env.SMTP_HOST,
       port: Number(process.env.SMTP_PORT),
       auth: {
         user: process.env.SMTP_USER,
         pass: process.env.SMTP_PASS,
       },
     });

     await transporter.sendMail({
       from: '"SkillAlign" <noreply@skillalign.com>',
       to: email,
       subject: "Payment Successful - SkillAlign",
       html: `
         <h1>Thank you for your purchase!</h1>
         <p>Plan: ${plan}</p>
         <p>Amount: ₹${amount / 100}</p>
         <p>Payment ID: ${paymentId}</p>
       `,
     });
   }
   ```

4. **Call in verify API:**
   ```typescript
   // After payment verification
   await sendPaymentReceipt(
     userEmail,
     plan.name,
     plan.amount,
     razorpay_payment_id,
   );
   ```

---

## 🗄️ Database Integration (TODO)

Current: Uses `localStorage` for mock data
Production: Move to real database

### Recommended Stack:

**Option 1: Prisma + PostgreSQL**

```bash
npm install @prisma/client prisma
npx prisma init
```

**Option 2: MongoDB + Mongoose**

```bash
npm install mongodb mongoose
```

**Option 3: Supabase (Easiest)**

- Built-in Auth + Database
- Free tier available
- [Supabase.com](https://supabase.com)

### Schema Example (Prisma):

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())

  subscription Subscription?
  payments     Payment[]
}

model Subscription {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])

  plan            String
  status          String
  expiresAt       DateTime?
  jdAnalysisCount Int      @default(0)
  maxJdAnalysis   Int?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Payment {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  razorpayOrderId   String
  razorpayPaymentId String
  amount            Int
  plan              String
  status            String

  createdAt   DateTime @default(now())
}
```

---

## 🧪 Testing Checklist

- [ ] Test successful payment with test card
- [ ] Test failed payment scenario
- [ ] Test payment cancellation (close modal)
- [ ] Verify subscription updates correctly
- [ ] Check JD analysis count increments
- [ ] Test access control (free vs premium features)
- [ ] Test subscription expiry logic
- [ ] Verify signature validation works
- [ ] Test with real Razorpay account (live mode)

---

## 🚨 Common Issues & Fixes

### 1. "Razorpay is not defined"

**Fix:** Script not loaded. Check `loadRazorpayScript()` returns true.

### 2. "Invalid signature"

**Fix:** Ensure `RAZORPAY_KEY_SECRET` matches your account.

### 3. Payment succeeds but subscription not updating

**Fix:** Check `/api/payment/verify` is called and returning success.

### 4. "Network error"

**Fix:** Check API routes are accessible. Verify Next.js dev server is running.

---

## 📈 Production Checklist

Before going live:

- [ ] Switch to **Live Mode** keys in Razorpay dashboard
- [ ] Update `.env.production` with live keys
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Set up webhook for payment notifications
- [ ] Implement database instead of localStorage
- [ ] Add email receipts
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Test with real money (small amount)
- [ ] Comply with GST regulations (India)
- [ ] Add refund policy page
- [ ] Terms & Conditions
- [ ] Privacy Policy

---

## 🎯 Next Steps

1. **Webhooks:** Handle payment events from Razorpay
2. **Refunds:** Implement refund API
3. **Invoices:** Generate PDF invoices
4. **Analytics:** Track conversion rates
5. **Discount Codes:** Implement coupon system
6. **Subscription Renewal:** Auto-renewal logic

---

## 📚 Resources

- [Razorpay Docs](https://razorpay.com/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Payment Gateway Testing](https://razorpay.com/docs/payments/payments/test-card-details/)

---

**🎉 Payment integration is ready! Test it now and start monetizing!**
