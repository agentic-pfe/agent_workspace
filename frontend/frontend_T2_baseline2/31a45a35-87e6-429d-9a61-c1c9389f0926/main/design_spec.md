# Stackr Design Specification

## Color Palette
- Primary: #2563EB (Vibrant Blue) — Headers, Primary Actions
- Secondary: #10B981 (Emerald Green) — Highlights, Secondary Actions
- Accent: #F59E0B (Warm Gold) — CTAs, Urgent Elements
- Dark: #1E293B (Deep Slate) — Text, Dark Backgrounds
- Light: #F8FAFC (Soft Cloud) — Background Sections

## Typography
- Heading Font: Montserrat (Bold, Modern)
  - Weights: 600 (Semibold), 700 (Bold)
  - Scale: 
    - H1: clamp(2.5rem, 5vw, 3.5rem)
    - H2: clamp(2rem, 4vw, 3rem)
    - H3: clamp(1.5rem, 3vw, 2.25rem)

- Body Font: Open Sans (Clean, Readable)
  - Weights: 400 (Regular), 500 (Medium)
  - Scale:
    - Body: clamp(1rem, 2vw, 1.125rem)
    - Small: clamp(0.875rem, 1.5vw, 1rem)

## Spacing System
- Base Unit: 8px
- Spacing Scale:
  - xs: 4px
  - sm: 8px
  - md: 16px
  - lg: 24px
  - xl: 32px
  - xxl: 48px

## Component Style Rules
- Border Radius:
  - sm: 4px
  - md: 8px
  - lg: 12px
  - pill: 9999px

- Shadows:
  - sm: 0 1px 3px rgba(0,0,0,0.1)
  - md: 0 4px 6px rgba(0,0,0,0.1)
  - lg: 0 10px 25px rgba(0,0,0,0.15)

- Transitions:
  - Standard: 0.3s ease-in-out
  - Hover Transform: translateY(-2px)

## Wireframe Sections

### 1. Navigation
- Logo (Left)
- Nav Links (Center)
- CTA Button (Right)
- Mobile Hamburger Menu

### 2. Hero Section
- Left: Text (Headline, Subheadline, Primary CTA)
- Right: Illustrative Image/Graphic
- Background: Soft Gradient

### 3. Features Grid
- 3-Column Responsive Grid
- Icon + Title + Description
- Hover Effects
- Alternating Background Colors

### 4. Pricing Table
- 3 Tiers (Basic, Pro, Enterprise)
- Comparison Table
- Highlighted "Recommended" Tier
- Annual/Monthly Toggle

### 5. Testimonials
- Customer Quotes
- Avatar + Name + Company
- Carousel/Grid Layout
- Social Proof Indicators

### 6. Footer
- Logo
- Navigation Links
- Social Media Icons
- Copyright
- Newsletter Signup

## Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## Accessibility Considerations
- Minimum Color Contrast: 4.5:1
- Keyboard Navigation Support
- ARIA Labels
- Reduced Motion Alternatives