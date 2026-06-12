# Design Specification

## Color Palette

### Primary Color Scheme: Modern Tech
- **Primary**: `#6366F1` (Indigo) - Main brand color, used for primary actions, headers
- **Secondary**: `#06B6D4` (Cyan) - Complementary color, used for highlights and secondary actions
- **Accent**: `#EC4899` (Pink) - Urgent/CTA color, used for call-to-action buttons and critical highlights
- **Dark**: `#111827` (Deep Blue-Gray) - Text and dark backgrounds
- **Light**: `#FAFAFA` (Off-White) - Background for content sections, subtle backgrounds

### Color Usage Guidelines
- Primary (`#6366F1`): 
  - Headers
  - Primary buttons
  - Section titles
  - Active states
- Secondary (`#06B6D4`):
  - Hover states
  - Secondary buttons
  - Decorative elements
- Accent (`#EC4899`):
  - Call-to-action buttons
  - Important notifications
  - Highlight critical information
- Dark (`#111827`):
  - Body text
  - Footer background
  - Dark mode base
- Light (`#FAFAFA`):
  - Page background
  - Card backgrounds
  - Alternating section backgrounds

## Typography

### Font Families
- **Headings**: Montserrat (Google Fonts)
  - Weight: 600 (Semi-Bold) for headers
  - Weight: 700 (Bold) for critical titles
- **Body Text**: Open Sans (Google Fonts)
  - Weight: 400 (Regular) for main content
  - Weight: 600 (Semi-Bold) for emphasized text

### Typography Scale
```css
:root {
  /* Headings */
  --font-h1: clamp(2.5rem, 5vw, 3.5rem);   /* Large page titles */
  --font-h2: clamp(2rem, 4vw, 3rem);       /* Section headers */
  --font-h3: clamp(1.5rem, 3vw, 2.25rem);  /* Subsection headers */
  --font-h4: clamp(1.25rem, 2.5vw, 1.75rem); /* Small headers */

  /* Body Text */
  --font-body: clamp(1rem, 2vw, 1.125rem);  /* Main content */
  --font-small: clamp(0.875rem, 1.5vw, 1rem); /* Captions, metadata */
}
```

## Spacing System
```css
:root {
  /* Spacing Scale (rem-based for responsiveness) */
  --space-xs: 0.5rem;    /* 8px */
  --space-sm: 1rem;      /* 16px */
  --space-md: 1.5rem;    /* 24px */
  --space-lg: 2.5rem;    /* 40px */
  --space-xl: 4rem;      /* 64px */
  --space-xxl: 6rem;     /* 96px */
}
```

## Component Style Rules

### Global Component Principles
- **Border Radius**: Soft, modern rounded corners
  ```css
  --border-radius-sm: 0.25rem;   /* 4px */
  --border-radius-md: 0.5rem;    /* 8px */
  --border-radius-lg: 0.75rem;   /* 12px */
  ```

- **Shadows**: Subtle, modern depth
  ```css
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.15);
  ```

### Button Styles
```css
.btn {
  border-radius: var(--border-radius-md);
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  &:hover {
    background-color: darken(var(--color-primary), 10%);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: white;
}

.btn-accent {
  background-color: var(--color-accent);
  color: white;
}
```

### Card Styles
```css
.card {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  background-color: white;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-4px);
  }
}
```

## Wireframe Descriptions

### 1. Navigation Bar
- **Layout**: Flex, space-between
- **Height**: 80px
- **Components**:
  - Logo (left-aligned)
  - Navigation Links (center)
  - CTA Button (right-aligned)
- **Mobile**: Hamburger menu, full-screen overlay navigation

### 2. Hero Section
- **Layout**: Flex, row on desktop, column on mobile
- **Background**: Gradient or subtle pattern
- **Left Side (Text)**:
  - Large headline (h1)
  - Subheadline (paragraph)
  - Primary CTA button
- **Right Side (Image/Graphic)**:
  - Responsive image or illustration
  - Max width: 50% on desktop

### 3. Features Grid
- **Layout**: CSS Grid, responsive
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
- **Card Structure**:
  - Icon/Illustration
  - Feature Title (h3)
  - Feature Description
  - Optional: Hover effect

### 4. Pricing Table
- **Layout**: Flex or Grid
- **Card Design**:
  - Highlighted "Most Popular" option
  - Clear price
  - Feature list
  - CTA button
- **Responsive**: Stacked on mobile, inline on desktop

### 5. Testimonials Section
- **Layout**: Carousel or Grid
- **Testimonial Card**:
  - Quote text
  - Client avatar
  - Client name & title
  - Company logo (optional)

### 6. Footer
- **Layout**: Multi-column grid
- **Sections**:
  - Logo
  - Quick Links
  - Contact Information
  - Social Media Icons
  - Copyright notice

## Accessibility Considerations
- Minimum color contrast ratio: 4.5:1
- Keyboard navigable
- Semantic HTML
- ARIA labels where necessary

## Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px and above

## Performance Notes
- Use CSS `clamp()` for fluid typography
- Minimize use of expensive CSS properties
- Prefer flexbox and grid for layouts