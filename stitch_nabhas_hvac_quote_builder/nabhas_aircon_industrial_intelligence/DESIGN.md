---
name: Nabhas Aircon Industrial Intelligence
colors:
  surface: '#f8f9ff'
  surface-dim: '#cddbf1'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d6e3fa'
  on-surface: '#0f1c2d'
  on-surface-variant: '#404943'
  inverse-surface: '#243142'
  inverse-on-surface: '#eaf1ff'
  outline: '#717973'
  outline-variant: '#c0c9c1'
  surface-tint: '#34684f'
  primary: '#002919'
  on-primary: '#ffffff'
  primary-container: '#05412b'
  on-primary-container: '#77ad91'
  inverse-primary: '#9bd3b4'
  secondary: '#a43c16'
  on-secondary: '#ffffff'
  secondary-container: '#fe7e53'
  on-secondary-container: '#6d1e00'
  tertiary: '#00291a'
  on-tertiary: '#ffffff'
  tertiary-container: '#00412b'
  on-tertiary-container: '#65b08d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b7efcf'
  primary-fixed-dim: '#9bd3b4'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#1a5039'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59d'
  on-secondary-fixed: '#390b00'
  on-secondary-fixed-variant: '#842600'
  tertiary-fixed: '#a6f3cb'
  tertiary-fixed-dim: '#8ad6b0'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0f1c2d'
  surface-variant: '#d6e3fa'
  hvac-cool: '#0A84FF'
  hvac-warm: '#FF9500'
  slate-surface: '#F8FAFC'
  border-muted: '#E2E8F0'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  grid-margin: 24px
  grid-gutter: 16px
  step-indicator-gap: 32px
  table-cell-padding: 12px 16px
---

## Brand & Style

The brand personality for Nabhas Aircon is defined by **High-Trust Industrial Modernism**. It balances the rugged, dependable nature of HVAC engineering with the precision and clarity of modern SaaS cost estimation. The target audience—contractors, estimators, and project managers—requires a tool that feels authoritative and unwavering.

The design style is **Corporate / Modern** with a focus on **Information Density**. We move away from the organic heritage of the logo’s history and toward a systematic, structured aesthetic. The interface prioritizes functional clarity through strong vertical alignment, precise data visualization, and a "built-to-last" visual weight. It evokes an emotional response of confidence, professional rigor, and technical expertise.

## Colors

The palette is anchored by the deep, authoritative **Industrial Green** (#05412B) from the brand mark, serving as the primary color for navigation and primary actions. **Terracotta Orange** (#BE4F28) is utilized strategically as an accent color for status indicators, call-to-actions, and highlights that require immediate attention in a technical workflow.

The core of the interface relies on a sophisticated range of **Professional Greys** (Neutrals). We utilize a "Slate" sub-palette for surfaces to ensure high-contrast legibility for complex data tables. 

**Functional Color Mapping:**
- **Primary:** Navigation, primary buttons, and structural headers.
- **Secondary:** Alerts, destructive actions, or critical "Next" steps in multi-step flows.
- **Named Colors:** `hvac-cool` and `hvac-warm` are reserved for temperature-specific data points or performance metrics.

## Typography

The typography system uses a pairing of **Hanken Grotesk** for headlines and **Inter** for all functional UI elements. 

- **Hanken Grotesk** provides a sharp, contemporary "engineered" feel for large titles and brand moments.
- **Inter** is used for its exceptional legibility in data-dense environments. In estimation tables, use the `data-mono` variant (Inter with tabular figures enabled) to ensure that numeric values align vertically for easy comparison.
- **Scale:** On mobile devices, `display-lg` should downscale to the `headline-lg` size to maintain readability without excessive horizontal scrolling.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. The main workspace (estimation engine) uses a fluid 12-column grid to maximize the visibility of technical drawings and data tables. However, secondary modals and report summaries are centered within a fixed-width container (max-width: 1200px) to prevent line lengths from becoming unreadable.

**Rhythm:**
- A **4px baseline grid** governs all spacing.
- **Desktop:** 12 columns, 24px margins, 16px gutters.
- **Tablet:** 8 columns, 16px margins, 16px gutters.
- **Mobile:** 4 columns, 16px margins, 12px gutters. Reflow complex tables into card-based layouts for mobile views.

## Elevation & Depth

This design system utilizes **Tonal Layers** rather than heavy shadows to convey depth, maintaining an "industrial blueprint" feel.

- **Level 0 (Surface):** Used for the main background. Employs `slate-surface`.
- **Level 1 (Card):** White surfaces with a `1px` border of `border-muted`. No shadow.
- **Level 2 (Active/Floating):** Used for dropdowns and popovers. Minimal, crisp shadow (4px blur, 10% opacity) with a tinted neutral color.
- **Level 3 (Overlay):** Full-page modals. Uses a semi-transparent backdrop blur (8px) to keep the context of the underlying data visible.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding softens the industrial nature of the product without making it appear "playful" or consumer-grade. It maintains a sense of precision.

- **Buttons & Inputs:** `rounded-sm` (4px).
- **Cards & Sections:** `rounded-lg` (8px).
- **Status Chips:** `rounded-xl` (12px) to provide a visual distinction from actionable buttons.

## Components

### Form Elements
Inputs must feature clear, top-aligned labels in `label-sm`. Active states use a `2px` stroke of the primary industrial green. Validation errors utilize the secondary terracotta orange for immediate visibility.

### Multi-Step Progress Indicators
Located at the top of the estimation flow. Use a horizontal "Stepper" with the primary color for completed steps and a muted neutral for upcoming ones. Use a connector line of 2px thickness to emphasize the linear progression of the quote.

### Quote Summary Tables
- **Header:** Sticky headers with a dark grey background and white `label-md` text.
- **Rows:** Alternating "zebra" stripes (using `slate-surface`) to assist the eye in tracking data across columns.
- **Totals:** The bottom "Total Quote" row should be emphasized with a double-border top and bold `headline-sm` typography.

### Chips & Badges
Small, high-contrast labels for "Pending", "Approved", and "Revised" quote statuses. Use secondary terracotta orange for "Urgent" or "Revised" to draw the eye.

### Action Buttons
Primary actions use solid `primary_color_hex` with white text. Secondary actions (e.g., "Add Line Item") use an outlined style with a `1px` border to keep the visual hierarchy clear.