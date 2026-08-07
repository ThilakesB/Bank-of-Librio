---
name: Organic Dialogue
colors:
  surface: '#faf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#faf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4ef'
  surface-container: '#efeee9'
  surface-container-high: '#e9e8e3'
  surface-container-highest: '#e3e3de'
  on-surface: '#1b1c19'
  on-surface-variant: '#454840'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#75786f'
  outline-variant: '#c5c8bd'
  surface-tint: '#546346'
  primary: '#28351c'
  on-primary: '#ffffff'
  primary-container: '#3e4c31'
  on-primary-container: '#acbc9a'
  inverse-primary: '#bccca9'
  secondary: '#4d6549'
  on-secondary: '#ffffff'
  secondary-container: '#cce7c4'
  on-secondary-container: '#51694d'
  tertiary: '#2c3424'
  on-tertiary: '#ffffff'
  tertiary-container: '#434a39'
  on-tertiary-container: '#b1b9a3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e8c4'
  primary-fixed-dim: '#bccca9'
  on-primary-fixed: '#131f08'
  on-primary-fixed-variant: '#3d4b30'
  secondary-fixed: '#cfeac7'
  secondary-fixed-dim: '#b3ceac'
  on-secondary-fixed: '#0a200a'
  on-secondary-fixed-variant: '#354c33'
  tertiary-fixed: '#dee6ce'
  tertiary-fixed-dim: '#c2cab3'
  on-tertiary-fixed: '#171e0f'
  on-tertiary-fixed-variant: '#424938'
  background: '#faf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e3e3de'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 800px
  gutter: 20px
---

## Brand & Style

This design system is built for a chatbot experience that feels calm, intelligent, and grounded. Drawing inspiration from the provided botanical impressionist painting, the brand personality is "Sophisticated Naturalism." It avoids the cold, clinical feel of typical AI interfaces in favor of a warm, human-centric aesthetic.

The design style is a blend of **Minimalism** and **Modern Corporate**, utilizing a high-quality "cream and greens" palette to evoke a sense of growth and clarity. It prioritizes legibility, generous whitespace, and soft, organic depth to reduce the cognitive load often associated with complex AI interactions. The target audience includes professionals seeking an assistive tool that feels like a refined companion rather than a machine.

## Colors

The palette is derived directly from the impressionist landscape, focusing on earthy, muted tones that provide excellent contrast without visual fatigue.

- **Primary (Deep Olive):** Used for primary actions, heavy headers, and the user's message bubbles. It provides the "anchor" for the visual hierarchy.
- **Secondary (Sage Green):** Used for supportive elements, iconography, and active states. It bridges the gap between the dark olive and the light background.
- **Tertiary (Dusty Sage):** A subtle tint for non-critical elements like hover states on secondary buttons or inactive tabs.
- **Background (Cream/Off-white):** The main canvas. This specific off-white reduces blue-light strain compared to pure white, creating a "paper-like" reading experience.
- **Surface (Accent Cream):** A slightly brighter version of the background used to lift cards and input containers off the page.

## Typography

The design system utilizes **Manrope** for its balanced, geometric-yet-humanist qualities. It maintains professional clarity while remaining approachable.

- **Headlines:** Use Bold or Semi-Bold weights with tight letter-spacing to create a strong visual impact.
- **Body Text:** Standardized at 16px for optimal readability. Line height is set to 1.5x (24px) to ensure the chatbot's longer responses remain scannable.
- **Labels:** Used for metadata, timestamps, and button text. These often use a slightly heavier weight or uppercase styling to distinguish them from prose.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid model** optimized for conversation.
- **Conversation Thread:** Centered with a maximum width of 800px on desktop to prevent long line lengths that hinder readability.
- **Grid:** A 12-column grid is used for the dashboard around the chat, but the chat itself relies on safe margins (24px on desktop, 16px on mobile).
- **Rhythm:** An 8px linear scale (4, 8, 16, 24, 32, 48, 64) ensures consistent vertical rhythm between message bubbles and UI components.
- **Mobile Adaption:** Sidebars collapse into a "hamburger" menu or bottom-sheet; message bubbles expand to fill 90% of the viewport width.

## Elevation & Depth

To maintain a "clean and professional" feel, this design system uses **Tonal Layering** combined with **Ambient Shadows**.

1.  **Level 0 (Base):** The Cream background (`#F9F8F3`).
2.  **Level 1 (Cards/Bubbles):** Surfaces use the Accent Cream (`#FEFDF8`) with a very soft, diffused shadow: `0 4px 20px rgba(62, 76, 49, 0.06)`. Note the slight green tint in the shadow to maintain color harmony.
3.  **Level 2 (Active/Floating):** Interaction elements like the message input field or floating action buttons use a more pronounced shadow: `0 8px 30px rgba(62, 76, 49, 0.12)`.
4.  **Interactions:** Hover states on buttons should not "lift" further but rather darken the background color slightly to maintain a grounded feel.

## Shapes

The shape language is "Softly Geometric."
- **Standard Radius:** 0.5rem (8px) is the baseline for input fields and smaller cards.
- **Message Bubbles:** Use 1rem (16px) for a friendlier, chat-centric feel. Use "asymmetric" rounding for bubbles—the corner pointing toward the avatar should have a smaller radius (4px) to indicate directionality.
- **Buttons:** Fully rounded (pill-shaped) for primary actions to distinguish them from content containers.

## Components

### Message Bubbles
- **User:** Deep Olive (`#3E4C31`) background with White text. Right-aligned.
- **AI:** Accent Cream (`#FEFDF8`) background with Deep Olive text. Left-aligned. Subtle 1px border of Sage (`#8FA989`) at 20% opacity.

### Buttons
- **Primary:** Deep Olive background, White text, pill-shaped.
- **Secondary:** Transparent background, Deep Olive border (1px), Sage text on hover.

### Input Fields
- The chat input should be a large, "floating" bar with the Accent Cream background and a soft shadow. Use a Sage Green cursor/caret.

### Chips & Tags
- Used for "Suggested Replies." Light Sage (`#D1D9C2`) background with Deep Olive text. 0.5rem corner radius.

### Cards
- Used for rich-media responses (images, data tables). They should have a 1px border using the Sage color at low opacity and no harsh shadows, appearing "nested" within the conversation.

### Avatars
- Circular. AI avatar should use a Sage/Olive gradient or a botanical icon to reinforce the brand personality.