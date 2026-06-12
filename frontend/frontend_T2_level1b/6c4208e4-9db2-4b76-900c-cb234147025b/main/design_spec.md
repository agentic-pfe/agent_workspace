# Stackr Design Specification

## Brand Identity
- **Name**: Stackr
- **Tagline**: Streamline Your Workflow, Amplify Your Productivity

## Color Palette
### Primary Color Scheme
- Primary: `#4361EE` (Deep Blue) - Main brand color, used for primary actions and headers
- Secondary: `#7209B7` (Deep Purple) - Accent color for highlights and secondary elements
- Accent: `#F72585` (Vibrant Pink) - Call-to-action and urgent elements
- Dark: `#212529` - Text and dark backgrounds
- Light: `#F8F9FA` - Background and light sections

### Color Usage Guidelines
- Primary (`#4361EE`): Buttons, section headers, key interactive elements
- Secondary (`#7209B7`): Decorative highlights, section backgrounds
- Accent (`#F72585`): CTAs, important badges, hover states
- Dark (`#212529`): Body text, footer background
- Light (`#F8F9FA`): Alternating section backgrounds, card backgrounds

## Typography
### Font Families
- **Headings**: Montserrat (Bold, Modern, Technical)
- **Body Text**: Open Sans (Clean, Readable)

### Type Scale
- H1: `clamp(2.5rem, 5vw, 3.5rem)` - Hero headlines
- H2: `clamp(2rem, 4vw, 3rem)` - Section headers
- H3: `clamp(1.5rem, 3vw, 2.25rem)` - Subsection headers
- Body Text: `clamp(1rem, 2vw, 1.125rem)` - Main content
- Small Text: `0.875rem` - Captions, metadata

## Spacing System
- **Base Unit**: 8px
- **Spacing Scale**:
  - XXS: 4px
  - XS: 8px
  - SM: 16px
  - MD: 24px
  - LG: 32px
  - XL: 48px
  - XXL: 64px

## Component Style Rules
### Buttons
- **Primary Button**:
  - Background: Primary color (`#4361EE`)
  - Text: White
  - Hover: Slightly darker shade
  - Border-radius: 8px
  - Padding: 12px 24px
  - Box-shadow: Subtle elevation

- **Secondary Button**:
  - Background: Transparent
  - Border: 2px solid primary color
  - Text: Primary color
  - Hover: Light background fill

### Cards
- Border-radius: 12px
- Box-shadow: Subtle elevation
- Padding: 24px
- Hover effect: Slight scale-up, increased shadow

## Wireframe Sections

### 1. Navigation
- Logo (left)
- Nav links (center)
- CTA button (right)
- Mobile: Hamburger menu

### 2. Hero Section
- Left: Large headline, subheadline, primary CTA
- Right: Product screenshot/illustration
- Background: Gradient or subtle pattern

### 3. Features Grid
- 3-4 feature cards
- Icon + Title + Description
- Responsive: 1 column (mobile), 3 columns (desktop)

### 4. Pricing Table
- 3 tiers: Basic, Pro, Enterprise
- Clearly differentiated features
- Annual/Monthly toggle
- Most popular tier highlighted

### 5. Testimonials
- Customer quotes
- Logos of companies
- Optional: Individual avatars

### 6. Footer
- Logo
- Quick links
- Social media icons
- Copyright notice
- Newsletter signup (optional)

## Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+

## Accessibility Considerations
- Minimum color contrast ratio: 4.5:1
- Keyboard navigable
- ARIA labels where necessary
- Reduced motion support

## Performance
- Optimize images
- Lazy loading
- Minimal external dependencies
- Critical CSS inlined

## Interaction Design
- Smooth scroll
- Hover states on interactive elements
- Subtle animations (fade-in, scale)
- Responsive to touch and mouse interactions