# Stackr Design Specification

## Design Philosophy
Stackr is a modern, professional SaaS tool targeting startup founders and development teams. The design aims to communicate efficiency, innovation, and trustworthiness through a clean, tech-forward visual language.

## Color Palette
### Primary Color Scheme
- **Primary**: #2563EB (Vibrant Blue) - Core brand color, used for primary actions, headers, and key highlights
- **Secondary**: #06B6D4 (Bright Cyan) - Complementary accent, used for secondary actions and decorative elements
- **Accent**: #F59E0B (Warm Gold) - Attention-grabbing color for CTAs, important highlights, and urgency indicators

### Neutral Color Palette
- **Dark**: #1E293B (Deep Slate Blue) - Primary text color, dark backgrounds
- **Light**: #F8FAFC (Soft Off-White) - Background for alternating sections, light text
- **Gray**: #64748B (Medium Gray) - Supporting text, borders, subtle separators

## Typography System
### Font Families
- **Headings**: Montserrat (Bold, Modern, Tech-forward)
- **Body Text**: Open Sans (Clean, Readable, Professional)

### Font Scale
- **H1**: 2.5rem (48px) - Large, impactful headlines
- **H2**: 2rem (36px) - Section headers
- **H3**: 1.5rem (24px) - Subsection headers
- **H4**: 1.25rem (20px) - Small headers, card titles
- **Body Text**: 1rem (16px) - Standard paragraph text
- **Small Text**: 0.875rem (14px) - Captions, footnotes

## Spacing System
- **Base Unit**: 0.5rem (8px)
- **Spacing Scale**:
  - xs: 0.5rem (8px)
  - sm: 1rem (16px)
  - md: 1.5rem (24px)
  - lg: 2rem (32px)
  - xl: 3rem (48px)
  - xxl: 4rem (64px)

## Component Style Rules
### Buttons
- **Primary Button**:
  - Background: #2563EB (Primary Blue)
  - Text Color: white
  - Hover: Slight elevation, 2px shadow
  - Padding: 0.75rem 1.5rem
  - Border Radius: 0.5rem

- **Secondary Button**:
  - Background: transparent
  - Border: 2px solid #06B6D4
  - Text Color: #06B6D4
  - Hover: Light background fill
  - Padding: 0.75rem 1.5rem
  - Border Radius: 0.5rem

### Cards
- **Default Card**:
  - Background: white
  - Border Radius: 0.75rem
  - Box Shadow: 0 4px 6px rgba(0,0,0,0.1)
  - Padding: 1.5rem
  - Hover Effect: Subtle elevation, slight shadow increase

## Wireframe Descriptions

### Navbar
- Logo (left-aligned)
- Navigation Links (center)
  - Features
  - Pricing
  - Testimonials
  - Contact
- CTA Button (right-aligned): "Get Started"
- Mobile: Hamburger menu, full-screen overlay navigation

### Hero Section
- Left Side:
  - Large Headline (H1)
  - Subheadline (Paragraph)
  - Primary CTA Button
  - Secondary Information Button
- Right Side:
  - Large, illustrative product screenshot/graphic
- Mobile: Stacked layout, centered content

### Features Grid
- 3x3 Grid Layout
- Each Feature Card:
  - Icon
  - Title (H3)
  - Description
  - Optional "Learn More" link
- Responsive: 1 column mobile, 2 columns tablet, 3 columns desktop

### Pricing Table
- 3 Tiers: 
  1. Starter
  2. Professional
  3. Enterprise
- Each Tier Card:
  - Title
  - Monthly/Annual Price
  - Feature List
  - CTA Button
- Hover Effects
- Most Popular Tier Highlighted

### Testimonials Section
- Grid or Carousel Layout
- 3-4 Customer Testimonials
- Each Testimonial:
  - Quote
  - Customer Name
  - Customer Company/Role
  - Optional Customer Logo

### Footer
- Logo
- Navigation Links
- Social Media Icons
- Copyright Notice
- Newsletter Signup (Optional)

## Interaction & Animation Guidelines
- Subtle Transitions: 0.3s ease-in-out
- Hover States: Slight scale (1.02), shadow increase
- No Aggressive Animations
- Respect `prefers-reduced-motion`

## Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px and above