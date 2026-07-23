---
name: Warm Crumb
colors:
  surface: '#fcf9f2'
  surface-dim: '#dcdad3'
  surface-bright: '#fcf9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ec'
  surface-container: '#f0eee7'
  surface-container-high: '#ebe8e1'
  surface-container-highest: '#e5e2db'
  on-surface: '#1c1c18'
  on-surface-variant: '#56423e'
  inverse-surface: '#31312c'
  inverse-on-surface: '#f3f0ea'
  outline: '#89726d'
  outline-variant: '#ddc0ba'
  surface-tint: '#9f402d'
  primary: '#9f402d'
  on-primary: '#ffffff'
  primary-container: '#e2725b'
  on-primary-container: '#5a0d02'
  inverse-primary: '#ffb4a5'
  secondary: '#74593f'
  on-secondary: '#ffffff'
  secondary-container: '#fed9b8'
  on-secondary-container: '#795d43'
  tertiary: '#745853'
  on-tertiary: '#ffffff'
  tertiary-container: '#ac8b85'
  on-tertiary-container: '#3c2622'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a5'
  on-primary-fixed: '#3e0500'
  on-primary-fixed-variant: '#802918'
  secondary-fixed: '#ffdcbe'
  secondary-fixed-dim: '#e3c0a0'
  on-secondary-fixed: '#2a1704'
  on-secondary-fixed-variant: '#5a422a'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#e3beb8'
  on-tertiary-fixed: '#2b1613'
  on-tertiary-fixed-variant: '#5b403c'
  background: '#fcf9f2'
  on-background: '#1c1c18'
  surface-variant: '#e5e2db'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Quicksand
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Quicksand
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 16px
  stack-md: 32px
  stack-lg: 80px
---

## Brand & Style
The design system is centered on the concept of "Handcrafted Comfort." It targets a premium yet approachable audience looking for artisanal, small-batch baked goods. The visual language evokes the warmth of a modern kitchen—clean, organic, and inviting.

The design style is a blend of **Minimalism** and **Tactile Softness**. By utilizing generous whitespace (the "flour" of the design), we allow high-resolution photography of golden-brown textures and melty chocolate to be the focal point. The interface avoids sharp edges, opting for "doughy," rounded geometries that feel safe and indulgent.

## Colors
This design system uses a palette inspired by the baking process:
- **Primary (Terracotta):** Used for key actions and brand callouts. It represents the heat of the oven and provides a high-contrast strike against the cream background.
- **Secondary (Pastel Peach):** Used for section backgrounds and soft highlights. It provides a gentle transition between white space and content.
- **Tertiary (Dark Chocolate):** Reserved for typography and iconography. It provides the necessary grounding and legibility while maintaining the "cocoa" narrative.
- **Neutral (Cream):** The base canvas. It is warmer than pure white, making the digital experience feel more organic and less clinical.

## Typography
The typographic hierarchy relies on a sophisticated "High-Low" pairing. 
- **Headlines:** Playfair Display provides an editorial, premium feel. Use "Headline-XL" sparingly for hero sections to establish the artisanal authority.
- **Body:** Inter ensures maximum readability for ingredient lists and descriptions. It stays out of the way of the imagery.
- **Labels & UI:** Quicksand adds a final touch of "roundness" to functional elements like buttons, tags, and prices, reinforcing the friendly brand voice.

## Layout & Spacing
The layout follows a **Fluid Grid** model with an emphasis on "breathable" vertical stacks. 

- **Desktop:** 12-column grid. Hero sections should use a minimum of 80px (`stack-lg`) of vertical padding to ensure the product photography feels "exhibited" rather than just displayed.
- **Mobile:** 4-column grid. Margins are tightened to 20px, but vertical spacing between product cards remains generous to prevent the UI from feeling cluttered.
- **Alignment:** Center-align typography for storytelling sections (About Us, Brand Story); left-align for functional sections (Shop, Checkout).

## Elevation & Depth
In this design system, depth is used to suggest "softness" rather than height. 

- **Ambient Shadows:** Avoid harsh, black shadows. Use very large blur radii (20px+) with low-opacity (8-12%) Dark Chocolate (#3E2723) tints. This makes cards look like they are resting on a soft surface.
- **Tonal Layers:** Use Pastel Peach (#FFDAB9) as a "Layer 1" background to group related items, while the main canvas stays Cream.
- **Interaction:** On hover, buttons and cards should slightly lift (increase shadow spread) to mimic the tactile feel of a soft cookie being picked up.

## Shapes
The shape language is "Full and Soft." All containers should avoid 90-degree angles.
- **Standard Cards:** Use `rounded-lg` (1rem) for product cards.
- **Buttons & Inputs:** Use `rounded-xl` (1.5rem) or full pill-shaping to reinforce the "bubble" aesthetic.
- **Images:** Product photography should either be full-bleed or use a `rounded-xl` corner radius to match the container.

## Components
- **Primary Buttons:** Filled with Terracotta (#E2725B). Typography is Quicksand Semi-Bold in Cream (#FCF9F2). High-rounded corners are mandatory.
- **Product Cards:** Cream background on Peach sections, or White on Cream sections. Use soft ambient shadows and generous internal padding (24px).
- **Chips/Tags:** Used for flavors (e.g., "Gluten-Free," "New"). Use Pastel Peach backgrounds with Dark Chocolate text in Quicksand Bold.
- **Input Fields:** Thick 2px borders in a lightened version of Dark Chocolate (opacity 20%), or a solid Cream background with a soft inset shadow for a "pressed dough" effect.
- **Lists:** Ingredient or feature lists should use custom iconography—small "cookie crumb" dots or organic hand-drawn checkmarks in Terracotta.
- **Cookie Cake Customizer:** A specialized component using large, circular radio buttons to represent different cake sizes and topping selections.