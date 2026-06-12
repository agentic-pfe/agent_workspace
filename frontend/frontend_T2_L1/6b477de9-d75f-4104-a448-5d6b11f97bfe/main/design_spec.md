# Stackr Design Specification

## Brand Overview
**Product**: Stackr
**Tagline**: Streamline Your Development Workflow
**Target Audience**: Startup Founders, Development Teams, Tech Entrepreneurs

## Color Palette
### Primary Color System
- **Primary**: #6366F1 (Indigo)
  - Role: Primary actions, headers, key UI elements
  - Hover: #4338CA (darker indigo)
  - Active: #3730A3 (deepest indigo)

- **Secondary**: #06B6D4 (Cyan)
  - Role: Highlights, secondary actions, accent backgrounds
  - Hover: #0891B2 (darker cyan)
  - Active: #0E7490 (deep cyan)

- **Accent**: #EC4899 (Vibrant Pink)
  - Role: Call-to-action, urgent actions, critical highlights
  - Hover: #DB2777 (deeper pink)
  - Active: #BE185D (darkest pink)

### Neutral Color Palette
- **Dark**: #111827 (Deep Navy)
  - Role: Primary text, dark backgrounds
- **Gray**: #6B7280 (Medium Gray)
  - Role: Secondary text, borders, dividers
- **Light**: #F3F4F6 (Light Gray)
  - Role: Background sections, subtle backgrounds
- **White**: #FFFFFF 
  - Role: Primary background, card backgrounds

### Semantic Colors
- **Success**: #10B981 (Emerald Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Bright Red)

## Typography System
### Font Families
- **Headings**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI"
- **Body**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI"

### Font Scale
- **h1**: 2.5rem (40px) / Line Height: 1.2 / Weight: 700
- **h2**: 2rem (32px) / Line Height: 1.3 / Weight: 700
- **h3**: 1.5rem (24px) / Line Height: 1.4 / Weight: 600
- **h4**: 1.25rem (20px) / Line Height: 1.5 / Weight: 600
- **h5**: 1.125rem (18px) / Line Height: 1.5 / Weight: 500
- **h6**: 1rem (16px) / Line Height: 1.5 / Weight: 500
- **Body Text**: 1rem (16px) / Line Height: 1.6 / Weight: 400
- **Small Text**: 0.875rem (14px) / Line Height: 1.5 / Weight: 400

## Spacing System
### Base Unit: 0.5rem (8px)
- **Micro**: 0.25rem (4px)
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 1.5rem (24px)
- **X-Large**: 2rem (32px)
- **XX-Large**: 3rem (48px)

## Component Style Rules

### Buttons
#### Primary Button
- Background: #6366F1 (Indigo)
- Text Color: #FFFFFF
- Border Radius: 0.5rem
- Padding: 0.75rem 1.5rem
- Hover: Darker indigo (#4338CA)
- Shadow: Subtle elevation (0 4px 6px rgba(0,0,0,0.1))

#### Secondary Button
- Background: Transparent
- Border: 2px solid #6366F1
- Text Color: #6366F1
- Border Radius: 0.5rem
- Padding: 0.75rem 1.5rem
- Hover: Light background with 10% opacity

### Cards
- Background: #FFFFFF
- Border Radius: 0.75rem
- Padding: 1.5rem
- Shadow: 0 10px 15px rgba(0,0,0,0.05)
- Hover Effect: Slight elevation, shadow intensification

### Form Elements
- Input Fields:
  - Border: 1px solid #D1D5DB
  - Border Radius: 0.5rem
  - Padding: 0.75rem 1rem
  - Focus State: 2px solid #6366F1
- Checkboxes & Radio Buttons:
  - Accent Color: #6366F1
  - Border Radius: 0.25rem

## Wireframe Descriptions

### Navbar
- Logo (Left-aligned)
  - Stackr logo in primary indigo
  - Responsive sizing (larger on desktop, compact on mobile)
- Navigation Links (Center)
  - Features
  - Pricing
  - Resources
  - About
- CTA Button (Right-aligned)
  - "Start Free Trial" in primary button style
- Mobile Hamburger Menu
  - Animated menu icon
  - Full-screen overlay navigation

### Hero Section
- Headline (Large h1)
  - "Accelerate Your Development Workflow"
- Subheadline (Body Text)
  - Concise explanation of Stackr's core value proposition
- Dual CTA Buttons
  - Primary: "Start Free Trial"
  - Secondary: "Watch Demo"
- Hero Image/Illustration
  - Abstract representation of development workflow
  - Isometric or flat design style
  - Color palette matching brand colors

### Features Grid
- 4-6 Feature Cards
- Each Card Structure:
  - Icon (Outlined, stroke-based)
  - Feature Title (h3)
  - Feature Description (Body Text)
  - Optional: Hover state with more details
- Grid Layout
  - 3 columns on desktop
  - 2 columns on tablet
  - 1 column on mobile

### Pricing Table
- 3 Tiers: Startup, Growth, Enterprise
- Consistent Card Design
- Each Tier Card Includes:
  - Tier Name
  - Monthly/Annual Price
  - Feature Checklist
  - CTA Button
- Recommended Tier Highlight
  - Most Popular Tier with accent background

### Testimonials Section
- Social Proof Cards
- Customer Logos
- Quote Styling
  - Large quotation marks
  - Customer name and title
  - Company logo
- Carousel or Grid Layout

### Footer
- 4 Column Layout
  - Product Links
  - Company Information
  - Resources
  - Legal & Contact
- Social Media Icons
- Newsletter Signup
- Copyright Notice

## Responsive Considerations
- Mobile-first design approach
- Fluid typography
- Flexible grid systems
- Touch-friendly interaction targets

## Accessibility Guidelines
- WCAG 2.1 AA Compliance
- Minimum color contrast ratio: 4.5:1
- Keyboard navigable
- Screen reader friendly

## Performance & Animation
- Subtle, meaningful animations
- Reduced motion support
- Performance-first design principles