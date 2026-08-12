# Plan: Marriage Compatibility Form & Order Automation

## Proposed Changes

### 1. Support Marriage Compatibility (Two DOBs)
Update checkout forms to handle "Marriage Compatibility" differently by collecting two sets of birth data.

#### UI Changes
- **CartDrawer.tsx & BookNow.tsx**: 
    - Detect if "Marriage Compatibility" (or similar service) is in the cart/selected.
    - If yes, display an additional section "Partner's Details" (Partner Name, Partner DOB, Partner TOB, Partner POB).
    - Update validation logic to require these fields only for the compatibility service.

#### Database Changes
- **orders table**: The `booking_details` JSON field will store `partner_details` (partner_name, partner_dob, partner_tob, partner_pob) when applicable.
- **AdminOrdersTab.tsx**: Update the "Order Details" dialog and Export (CSV/PDF) to include partner information.

### 2. Suggestion on Report Generation
The user asked if reports should be generated automatically after payment or follow the current manual process.

#### Recommendation: Hybrid Approach
- **Phase 1 (Current + Tracking)**: Keep the manual tracking (Sent/Pending/Failed) as it ensures high accuracy for mystical/numerology reports which often require human intuition/interpretation.
- **Phase 2 (Automation Goal)**: We can automate the "Data Gathering" part (which we just improved) and potentially use a template system or LLM-assisted draft generation in the admin panel to speed up the manual process.
- **Decision**: For now, I will implement better status tracking and notification, but keep the actual report generation manual to maintain the quality Ank Darppan is known for.

## Technical Details

- **Validation Logic**: `const hasMarriageService = items.some(i => i.name.toLowerCase().includes('marriage') || i.name.toLowerCase().includes('compatibility'))`
- **booking_details schema update**: 
  ```json
  {
    "dob": "...",
    "tob": "...",
    "pob": "...",
    "address": "...",
    "partner_details": {
      "name": "...",
      "dob": "...",
      "tob": "...",
      "pob": "..."
    }
  }
  ```

## Verification Plan

- Add "Marriage Compatibility" to cart and verify the "Partner Details" fields appear and are validated.
- Place a test order and verify partner details appear in the Admin Panel and Exports.
- Verify regular products/services still work with the single DOB form.
