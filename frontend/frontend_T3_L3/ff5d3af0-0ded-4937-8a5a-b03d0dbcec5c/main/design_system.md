# Forma Studio Design System

## Overview
Forma Studio's design system is built on principles of minimalism, clarity, and professional elegance. Our visual language communicates trust, creativity, and precision.

## Color Palette
### Primary Color Scheme
- **Primary**: #1D4ED8 (Deep Blue) - Used for primary actions, headers, and key accents
- **Secondary**: #475569 (Slate Gray) - Supporting color for backgrounds and secondary elements
- **Accent**: #DC2626 (Vibrant Red) - Highlights, CTAs, and urgent actions
- **Dark**: #0F172A (Midnight Blue) - Text and footer backgrounds
- **Light**: #F1F5F9 (Soft Gray) - Background sections, alternating content areas

### Color Usage Guidelines
- Primary (Deep Blue): Headers, main buttons, section titles
- Secondary (Slate Gray): Supporting elements, secondary buttons
- Accent (Vibrant Red): Call-to-action buttons, important highlights
- Dark (Midnight Blue): Body text, dark section backgrounds
- Light (Soft Gray): Content section backgrounds, alternating zones

## Typography
### Font Families
- **Headings**: 'Montserrat', sans-serif
- **Body Text**: 'Open Sans', sans-serif

### Font Sizes & Hierarchy
- **Base Font Size**: 16px
- **Headings**:
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)
- **Body Text**:
  - Regular: 1rem (16px)
  - Small: 0.875rem (14px)

### Typography Rules
- Headings: Bold weight (600-700)
- Body Text: Regular weight (400)
- Line height: 1.6 for readability
- Letter spacing: Slightly expanded for modern feel

## Spacing Scale
Consistent spacing using rem units for scalability:
- XXS: 0.25rem (4px)
- XS: 0.5rem (8px)
- SM: 1rem (16px)
- MD: 1.5rem (24px)
- LG: 2rem (32px)
- XL: 3rem (48px)
- XXL: 4rem (64px)

## Component Styles

### Buttons
```css
.btn {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #1D4ED8;
  color: white;
  border: 2px solid #1D4ED8;
}

.btn-primary:hover {
  background-color: #2563EB;
  box-shadow: 0 4px 6px rgba(29, 78, 216, 0.25);
}

.btn-secondary {
  background-color: #475569;
  color: white;
  border: 2px solid #475569;
}
```

### Navigation
```css
.nav {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #0F172A;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #1D4ED8;
}

.nav-cta {
  background-color: #DC2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}
```

### Cards
```css
.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(15, 23, 42, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(15, 23, 42, 0.15);
}
```

## Accessibility Considerations
- Minimum color contrast ratio: 4.5:1
- Focus states with 3px outline
- Keyboard navigable components
- Semantic HTML structure

## Responsive Design
- Mobile-first approach
- Fluid typography using `clamp()`
- Flexible grid systems
- Breakpoints: 
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+

## Design Principles
1. Clarity over complexity
2. Consistent visual language
3. User-centric design
4. Performance and accessibility first