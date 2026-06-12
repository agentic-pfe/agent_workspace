# Stackr Design Specification

## Design System Overview
Stackr is a modern SaaS platform targeting tech-savvy professionals. The design system reflects a professional, innovative, and trustworthy brand identity.

## Color Palette
### Primary Color Scheme: Modern Tech
- **Primary**: `#6366F1` (Indigo) - Core brand color, used for primary actions and headers
- **Secondary**: `#06B6D4` (Cyan) - Complementary accent, used for highlights and secondary elements
- **Accent**: `#EC4899` (Pink) - Energetic CTA color, used for call-to-action buttons and urgent elements
- **Dark**: `#111827` (Deep Navy) - Primary text and dark backgrounds
- **Light**: `#FAFAFA` (Soft Gray) - Background sections, card backgrounds

## Typography
### Font Pairing
- **Headings**: Montserrat (Google Font)
  - Weight: 600 (Semi-Bold) for headings
  - Weight: 700 (Bold) for strong emphasis
- **Body Text**: Open Sans (Google Font)
  - Weight: 400 (Regular) for body copy
  - Weight: 500 (Medium) for subtle emphasis

### Type Scale
- **H1**: 2.5rem (40px) - Large page titles, hero headlines
- **H2**: 2rem (32px) - Section headers
- **H3**: 1.5rem (24px) - Subsection headers
- **H4**: 1.25rem (20px) - Small section headers
- **Body Text**: 1rem (16px) - Standard paragraph text
- **Small Text**: 0.875rem (14px) - Captions, metadata

## Spacing System
Based on an 8px base scale for consistent rhythm:
- **XXS**: 4px
- **XS**: 8px
- **SM**: 16px
- **MD**: 24px
- **LG**: 32px
- **XL**: 48px
- **XXL**: 64px

## Component Style Rules

### Buttons
- **Border Radius**: 6px (slightly rounded)
- **Padding**: 12px 24px
- **Font Size**: 1rem
- **Font Weight**: 600
- **Hover Effect**: 
  - Slight elevation (box-shadow)
  - 2% scale increase
- **Variants**:
  - Primary: Indigo background, white text
  - Secondary: Cyan outline, cyan text
  - Accent: Pink background, white text

### Cards
- **Border Radius**: 8px
- **Box Shadow**: Subtle, 0 4px 6px rgba(0,0,0,0.1)
- **Padding**: 24px
- **Hover State**: 
  - Slight elevation
  - Soft scale increase (101%)

### Navigation
- **Height**: 80px
- **Padding**: 0 48px
- **Logo Size**: 150px wide
- **Nav Item Spacing**: 24px between items
- **Active/Hover State**: Underline with accent color

## Wireframe Descriptions

### 1. Navigation Header
- Logo (left-aligned)
- Navigation links (center)
- CTA Button (right-aligned)
- Responsive: Hamburger menu on mobile

### 2. Hero Section
- Large headline (H1)
- Subheadline paragraph
- Primary CTA button
- Secondary supportive button
- Optional hero image or illustration
- Background: Soft gradient or subtle pattern

### 3. Features Section
- Grid layout (3 columns on desktop)
- Each feature card includes:
  - Icon
  - Title (H3)
  - Description paragraph
  - Optional screenshot or illustration

### 4. Social Proof
- Customer logos
- Testimonial quotes
- Statistical achievements
- Trust indicators (awards, certifications)

### 5. Pricing Section
- Pricing cards
- Clear feature comparisons
- Annual/Monthly toggle
- Prominent CTA for each tier

### 6. Call-to-Action Section
- Large, compelling headline
- Short persuasive paragraph
- Primary CTA button
- Background: Accent color or gradient

### 7. Footer
- Logo
- Navigation links
- Social media icons
- Copyright notice
- Newsletter signup (optional)

## Responsive Considerations
- Mobile-first design approach
- Fluid typography using `clamp()`
- Responsive grid systems
- Touch-friendly interaction targets

## Accessibility Guidelines
- Color contrast ratio: Minimum 4.5:1
- Keyboard navigable
- Screen reader compatible
- Reduced motion support

## Performance Notes
- Optimize web fonts
- Use system font fallbacks
- Minimal, efficient CSS
- Lazy load images

---

*Design Specification for Stackr SaaS Marketing Website*
*Version 1.0 - Initial Design System*