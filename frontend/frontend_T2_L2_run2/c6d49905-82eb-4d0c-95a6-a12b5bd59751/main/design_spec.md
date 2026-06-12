# Design Specification

## Color Palette

### Primary Color Scheme: Modern Tech
- **Primary**: `#6366F1` (Indigo) - Main brand color, headers, primary actions
- **Secondary**: `#06B6D4` (Cyan) - Highlights, secondary actions, decorative elements
- **Accent**: `#EC4899` (Pink) - Call-to-actions, urgent elements, badges
- **Dark**: `#111827` (Deep Blue-Gray) - Text, footer background, dark sections
- **Light**: `#FAFAFA` (Off-White) - Background, alternating sections, subtle backgrounds

### Color Usage Guidelines
- Use primary color for main headings, primary buttons
- Use secondary color for secondary buttons, section highlights
- Use accent color for CTAs, urgent actions, important badges
- Use dark color for body text, footer
- Use light color for background sections, card backgrounds

## Typography

### Font Families
- **Headings**: Montserrat (Bold, characterful)
- **Body Text**: Open Sans (Clean, readable)

### Type Scale (Mobile-First Fluid Typography)
```css
:root {
  /* Headings */
  --h1-size: clamp(2.25rem, 5vw, 3.5rem);   /* 36px → 56px */
  --h2-size: clamp(1.75rem, 4vw, 2.75rem);  /* 28px → 44px */
  --h3-size: clamp(1.5rem, 3vw, 2.25rem);   /* 24px → 36px */
  --h4-size: clamp(1.25rem, 2.5vw, 1.75rem); /* 20px → 28px */

  /* Body Text */
  --body-size: clamp(0.95rem, 2vw, 1.125rem);  /* 15px → 18px */
  --small-size: clamp(0.8rem, 1.5vw, 0.9rem);  /* 13px → 14px */
}
```

### Typography Rules
- Headings: Montserrat, bold weight (600-700)
- Body: Open Sans, regular weight (400)
- Line height: 1.5 for body, 1.2 for headings
- Letter spacing: -0.02em for headings, normal for body text

## Spacing System
```css
:root {
  /* Spacing Scale (rem-based) */
  --space-xs: 0.5rem;    /* 8px */
  --space-sm: 0.75rem;   /* 12px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-xxl: 3rem;     /* 48px */
  --space-xxxl: 4rem;    /* 64px */
}
```

## Component Style Rules

### Buttons
```css
.btn {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: var(--space-sm) var(--space-lg);
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.btn-primary {
  background-color: #6366F1;
  color: white;
  border: 2px solid #6366F1;
}

.btn-primary:hover {
  background-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0,0,0,0.15);
}

.btn-secondary {
  background-color: #06B6D4;
  color: white;
  border: 2px solid #06B6D4;
}
```

### Cards
```css
.card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: var(--space-lg);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
}
```

### Form Inputs
```css
.form-input {
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  padding: var(--space-sm) var(--space-md);
  font-family: 'Open Sans', sans-serif;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #6366F1;
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}
```

## Wireframe Descriptions

### 1. Navigation Bar
- Fixed top position
- Logo (left-aligned)
- Nav links (center or right-aligned)
- CTA button (far right)
- Mobile: Hamburger menu
- Responsive: Flex layout
- Background: Translucent white or light color
- Box shadow on scroll

### 2. Hero Section
- Full-width container
- Two-column layout (desktop)
- Stacked layout (mobile)
- Left column: Large headline, subtext, dual CTAs
- Right column: Hero image or illustration
- Background: Gradient or subtle pattern
- Minimum height: 80vh on desktop

### 3. Features Grid
- 3-column grid (desktop)
- 2-column grid (tablet)
- 1-column grid (mobile)
- Each feature card:
  - Icon
  - Title
  - Short description
  - Optional link/CTA
- Consistent spacing
- Hover effects on cards

### 4. Pricing Table
- Responsive grid layout
- 3 pricing tiers
- Each tier as a card
- Highlighted/recommended tier
- Clear price
- Feature list
- CTA button
- Yearly/monthly toggle

### 5. Testimonials Section
- Social proof cards
- Customer quotes
- Customer avatars
- Company logos
- Carousel or grid layout
- Background: Light alternate color

### 6. Footer
- 4-column layout (desktop)
- Stacked layout (mobile)
- Logo
- Navigation links
- Social media icons
- Newsletter signup
- Copyright notice
- Background: Dark color
- Subtle top border or separator

## Accessibility Considerations
- Color contrast ratio: Minimum 4.5:1
- Focus states for all interactive elements
- Keyboard navigable
- Semantic HTML
- ARIA labels where necessary

## Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1440px
- Large Desktop: 1441px+

## Performance & Best Practices
- Use CSS `clamp()` for fluid typography
- Prefer flexbox and grid for layouts
- Minimize use of absolute positioning
- Optimize for reduced motion