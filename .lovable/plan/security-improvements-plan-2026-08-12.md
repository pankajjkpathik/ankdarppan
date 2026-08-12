# Security Improvements Plan

Load security issues from scan results and fix identified vulnerabilities in RLS, authentication, and API handling.

## Proposed Changes

### Database Security (RLS & Permissions)
- **Implement `user_roles` check in all admin-facing tables**: Ensure `products`, `services`, `blogs`, and `coupons` mutations are restricted to users with the 'admin' role using the `has_role` function.
- **Strict RLS for `profiles`**: Ensure users can only read/update their own profiles, while admins can view all.
- **Secure `orders` updates**: Restrict status updates and booking detail modifications to admins only (currently authenticated users might be able to update their own orders if not careful).

### Application Security
- **Admin Access Control**: Enhance `ProtectedRoute.tsx` to check for the 'admin' role in `user_roles` table, not just authentication status.
- **Disable Public Admin Signup**: Disable the `/admin/signup` route by adding a check or removing it from `App.tsx` now that the initial admin should be created.
- **Input Validation**: Add server-side validation logic (where possible via RLS or Edge Functions) to ensure data integrity.

### Authentication Flow
- **Password Strength**: Enforce minimum password length and basic complexity in `Auth.tsx` and `ResetPassword.tsx`.
- **Secure Redirects**: Ensure `redirectTo` logic in `Auth.tsx` only redirects to internal routes to prevent open redirect vulnerabilities.

## Technical Details

### SQL Updates
```sql
-- Example: Strict Admin RLS for products
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Strict Profiles RLS
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
```

### Components
- `ProtectedRoute.tsx`: Update to fetch role from `user_roles`.
- `AdminSignup.tsx`: Add a "System Locked" state or restrict access.

## Verification Plan

### Automated Tests
- Run database linter to verify no public tables lack RLS.
- Verify RLS policies via Supabase dashboard (simulated).

### Manual Verification
- Attempt to access `/admin` with a non-admin account.
- Attempt to mutate products/blogs via browser console with a non-admin account.
- Verify that admin signup is no longer accessible to the public.
