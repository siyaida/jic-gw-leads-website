# GW × JIC Design System

## Brand Identity

### Overview
The JIC GW Leads Website represents an exclusive partnership between George Washington University (GW) and Jeddah International College (JIC). The visual language conveys prestige, ambition, and Saudi Vision 2030 alignment — blending American academic excellence with Saudi engineering leadership.

### Tone of Voice
- Authoritative yet approachable
- Aspirational but grounded in facts
- Bilingual-first (Arabic primary, English secondary)

---

## Color Palette

### Primary Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--navy-900` | `#050a14` | Page background, deepest layer |
| `--navy-800` | `#0a1628` | Section backgrounds, cards |
| `--navy-700` | `#132240` | Card surfaces, elevated elements |
| `--gold` | `#C9A227` | Primary accent, CTAs, highlights |
| `--gold-light` | `#e8d46b` | Hover states, glows |
| `--gold-dark` | `#a88420` | Gradients, shadows |

### Neutral Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--offwhite` | `#f5f5f0` | Primary text on dark |
| `--white` | `#ffffff` | Headlines, high emphasis |
| `--graytext` | `#94a3b8` | Body text, descriptions |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--success` | `#10b981` | Valid states, positive signals |
| `--danger` | `#ef4444` | Errors, invalid states |

### Gradient Patterns
```css
/* Hero background */
radial-gradient(ellipse at 10% 20%, rgba(88,28,135,0.22) 0%, transparent 55%),
radial-gradient(ellipse at 90% 80%, rgba(19,80,120,0.18) 0%, transparent 50%),
radial-gradient(ellipse at 50% 50%, rgba(201,162,39,0.06) 0%, transparent 45%),
linear-gradient(180deg, var(--navy-900) 0%, var(--navy-800) 50%, var(--navy-900) 100%)

/* Primary button */
linear-gradient(135deg, var(--gold), var(--gold-dark))

/* Progress bar */
linear-gradient(90deg, var(--gold-dark), var(--gold))
```

---

## Typography

### Font Stack
```css
/* English / LTR */
font-family: 'Inter', 'Noto Sans Arabic', sans-serif;

/* Arabic / RTL */
font-family: 'Noto Sans Arabic', 'Inter', sans-serif;
```

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Hero) | `clamp(2.2rem, 5vw, 4rem)` | 800 | 1.15 |
| H2 (Section) | `clamp(1.8rem, 3.5vw, 2.6rem)` | 700 | 1.25 |
| H3 (Card) | `1.1rem–1.3rem` | 700 | 1.3 |
| Body | `0.9rem–1.05rem` | 400 | 1.7 |
| Label | `0.75rem–0.8rem` | 700 | 1.2 |
| Button | `0.95rem` | 600 | 1 |

---

## Spacing System

### Section Spacing
- Desktop: `5rem` (80px) vertical padding
- Mobile: `3.5rem` (56px) vertical padding

### Container
- Max width: `1200px`
- Horizontal padding: `1.5rem` (desktop), `1rem` (mobile)

### Component Spacing
| Token | Value |
|-------|-------|
| xs | `0.25rem` (4px) |
| sm | `0.5rem` (8px) |
| md | `1rem` (16px) |
| lg | `1.5rem` (24px) |
| xl | `2.5rem` (40px) |
| 2xl | `3rem` (48px) |

---

## Component Library

### Buttons

#### Primary Button (`.btn-primary`)
- Background: gold gradient
- Text: navy-900
- Shadow: `0 8px 32px rgba(201,162,39,0.3)`
- Hover: shimmer sweep + translateY(-3px) + scale(1.03)

#### Secondary Button (`.btn-secondary`)
- Background: `rgba(255,255,255,0.06)`
- Border: `1px solid rgba(255,255,255,0.15)`
- Hover: border glow gold + translateY(-3px)

### Cards

#### Glass Card (`.glass-card`)
- Background: linear gradient with transparency
- Backdrop filter: `blur(16px)`
- Border: `1px solid rgba(201,162,39,0.12)`
- Border radius: `20px`
- Hover: translateY(-8px), enhanced border glow

#### Feature Card (`.feature-card`)
- 3D tilt on hover: `perspective(800px) rotateX(1deg) rotateY(-1deg)`
- Enhanced shadow on hover

#### Employer Card (`.employer-card`)
- Filter transition: opacity + scale over 450ms
- Hover: translateY(-3px) with border color shift

### Form Elements

#### Floating Label (`.form-floating`)
- Label transitions from inside input to above on focus/fill
- Background match to prevent text overlap

#### Validation States
- `.is-valid`: green border + checkmark icon
- `.is-invalid`: red border + X icon + shake animation

### Navigation

#### Navbar (`.navbar`)
- Fixed position, transparent → blurred on scroll
- Transition: padding + background over 400ms

#### Mobile Drawer (`.mobile-drawer`)
- Full-screen overlay with backdrop blur
- Focus trap implemented in JS
- Body scroll lock when open

### Feedback Components

#### Urgency Bar (`.urgency-bar`)
- Pulsing glow animation on pseudo-element
- Gold gradient border with 3s loop

#### Trust Badge (`.trust-badge`)
- Pill shape with icon + text
- Hover: tooltip reveal with detail text

#### Success Modal
- Centered overlay with confetti animation
- 20 randomized confetti pieces
- Escape key to dismiss

---

## Animation Tokens

### Easing Curves
| Name | Value | Usage |
|------|-------|-------|
| Reveal | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll reveals, transitions |
| Spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Accordion, icon rotation |
| Magnetic | `cubic-bezier(0.16, 1, 0.3, 1)` | Button hover offset |

### Durations
| Token | Value | Usage |
|-------|-------|-------|
| fast | `0.2s` | Color changes, micro-interactions |
| normal | `0.35s–0.4s` | Hover states, reveals |
| slow | `0.8s` | Scroll reveal entrance |
| counter | `1.8s` | Number count-up |
| progress | `1.5s` | Progress bar fill |

### Keyframes
| Name | Description |
|------|-------------|
| `meshShift` | Hero background gradient drift (12s infinite) |
| `floatParticle` | Gold particle float (6–13s infinite) |
| `urgencyPulse` | Urgency bar glow pulse (3s infinite) |
| `scarcityPulse` | Limited seats pulse (2.5s infinite) |
| `marqueeScroll` | Infinite horizontal scroll (30s linear) |
| `shake` | Form validation error shake (0.4s) |
| `spin` | Loading spinner (0.8s linear) |
| `confettiFall` | Modal confetti drop (1.2s) |

---

## Layout Patterns

### Grid Systems
```css
/* Feature grid */
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));

/* Employer grid */
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

/* Dual CTA */
grid-template-columns: 1fr 1fr; /* → 1fr on mobile */

/* Footer */
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
```

### Responsive Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | `< 768px` | Single column, hidden nav, hamburger menu |
| Tablet | `768px–1024px` | 2-column grids |
| Desktop | `> 1024px` | Full layout, all effects enabled |

---

## Accessibility Standards

### Requirements
- All interactive elements have `:focus-visible` outline (2px solid gold)
- `prefers-reduced-motion` disables all animations
- Skip-to-content link as first focusable element
- ARIA states on accordion (expanded, controls, region)
- Focus trap in mobile navigation
- Color contrast: all text meets WCAG AA against backgrounds

### RTL Support
- `html[data-lang="ar"]` triggers `direction: rtl`
- All margin/padding left/right pairs have RTL overrides
- Marquee animation reverses for Arabic
- 3D tilt rotateY direction flips for Arabic

---

## Assets

### Icons
- Uses emoji for feature icons (native rendering, no font dependency)
- Validation icons: ✓ and ✕ characters
- Scroll-to-top: ↑ character

### Images
- All images use `loading="lazy"` by default
- `data-src` pattern for lazysizes fallback
- No external image dependencies in core design

---

## Usage Guidelines

### Adding a New Section
1. Wrap in `<section class="section">`
2. Use `<div class="section-container">` for max-width wrapper
3. Apply `.reveal` class to elements for scroll animation
4. Add `.reveal-delay-N` for staggered entrance (1–8)

### Adding a New Card
1. Use `.glass-card` or `.feature-card`
2. Add `.tilt-card` for 3D hover effect
3. Ensure proper color contrast for text

### Adding a Form
1. Wrap inputs in `.form-group`
2. For floating labels, add `.form-floating` class
3. Include `.validation-icon` span for feedback
4. Submit button must be `<button type="submit">`

---

*Design System Version: 1.0*
*Last Updated: 2026-05-08*
