# Plan - Service Discounts and Razorpay Order Sync

Extend the discount/coupon system to Services and fix the Razorpay order reflection in the admin dashboard.

## User Review Required

> [!IMPORTANT]
> The "Free Shipping for India" logic is already in place for products. Services usually don't have shipping; I will ensure the Service checkout flow (`BookNow.tsx`) correctly skips shipping logic while applying coupons.

- Do you want a flat percentage discount field on the Service itself (like a sale price), or only via Coupon codes? (I will implement both for maximum flexibility).

## Proposed Changes

### Database & Backend
- Add `discount_price` (or use `old_price` pattern) to the `services` table.
- Update `razorpay-order` edge function to accept `user_id` and ensure it's saved in the `orders` table (this fixes the "missing orders" issue if the client failed to pass it).
- Enhance `razorpay-verify` to handle potential failures in status updates.

### Admin Dashboard
- **AdminServicesTab**: Add fields for `old_price` to show discounts on the site.
- **AdminProductsTab**: (Already has `old_price`, will verify discount display).
- **AdminOrdersTab**: Add filters to see "Paid" vs "Pending" orders more clearly to help tracking.

### Checkout & Services
- **BookNow.tsx**: 
    - Add a Coupon entry field (matching the Cart flow).
    - Calculate `grandTotal` with the coupon before calling Razorpay.
- **ServicesSection/Services.tsx**:
    - Update UI to show the original price crossed out if a discount exists.

### Tracking Fix
- The user mentioned orders are not reflecting in Admin. 
- I will ensure `razorpay-order` creates a record with `status='pending'` and `razorpay-order_id`.
- The `razorpay-verify` function MUST update this record to `status='paid'`. 
- If the user is seeing payments but no orders, it likely means the `insert` into the `orders` table is failing or the `razorpay_order_id` is not being saved correctly.

## Technical Details
- SQL migration to add `old_price` to `services` table.
- Update `CartDrawer` and `BookNow` to pass `coupon_code` to `razorpay-order` for backend validation if possible (optional but safer).
- Ensure RLS for `orders` allows `service_role` (Edge Functions) to update status without restrictions.
