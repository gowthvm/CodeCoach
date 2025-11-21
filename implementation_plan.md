# Implementation Plan - UI/UX Aesthetic Enhancements

## Goal Description
Implement the comprehensive UI/UX aesthetic enhancements proposed in `UI_UX_AESTHETIC_SUGGESTIONS.md` to elevate CodeCoach to a premium, modern standard. This includes typography updates, a richer color palette, glassmorphism effects, micro-interactions, and component polishing.

## User Review Required
> [!IMPORTANT]
> This plan involves significant changes to the global design system (`globals.css`, `tailwind.config.ts`). The visual identity of the app will change noticeably.

## Proposed Changes

### 1. Dependencies
#### [NEW]
- `framer-motion`: For smooth page transitions and micro-interactions.

### 2. Typography & Global Config
#### [MODIFY] [layout.tsx](file:///c:/Users/Gowtham/Desktop/CodeCoach/app/layout.tsx)
- Import `Inter` and `JetBrains_Mono` from `next/font/google`.
- Apply them to the `body` and define CSS variables.

#### [MODIFY] [tailwind.config.ts](file:///c:/Users/Gowtham/Desktop/CodeCoach/tailwind.config.ts)
- Add font families (`sans`, `mono`).
- Extend color palette with "richer" tokens.
- Add custom animations/keyframes if needed.

### 3. Global Styles & Theme
#### [MODIFY] [globals.css](file:///c:/Users/Gowtham/Desktop/CodeCoach/app/globals.css)
- Update CSS variables for Light and Dark modes with the new "Deep Jungle" / "Electric Emerald" palette.
- Add `.glass` utility class for the premium frosted effect.
- Add mesh gradient background utilities.

### 4. UI Components Polish
#### [MODIFY] [button.tsx](file:///c:/Users/Gowtham/Desktop/CodeCoach/components/ui/button.tsx)
- Add hover scale and brightness effects.
- Update variants to use the new shadow/glow styles.

#### [MODIFY] [card.tsx](file:///c:/Users/Gowtham/Desktop/CodeCoach/components/ui/card.tsx)
- Increase border radius to `xl`.
- Apply glassmorphism background by default or via variant.

#### [MODIFY] [input.tsx](file:///c:/Users/Gowtham/Desktop/CodeCoach/components/ui/input.tsx)
- Remove default border, use background fill with focus highlight.

### 5. Layout & Page Animations
#### [MODIFY] [page.tsx](file:///c:/Users/Gowtham/Desktop/CodeCoach/app/page.tsx) (Landing)
- Implement `framer-motion` for entry animations.
- Update hero section with mesh gradient background.

#### [MODIFY] [page.tsx](file:///c:/Users/Gowtham/Desktop/CodeCoach/app/dashboard/page.tsx) (Dashboard)
- Add entry animations.
- Update layout to use the new "floating" aesthetic.

### 6. Feature Components
#### [MODIFY] [code-editor.tsx](file:///c:/Users/Gowtham/Desktop/CodeCoach/components/code-editor.tsx)
- Update font family to `JetBrains Mono`.
- Style scrollbars.
- Match background to the new card style.

#### [MODIFY] [history-panel.tsx](file:///c:/Users/Gowtham/Desktop/CodeCoach/components/history-panel.tsx)
- Convert to a "floating" panel style.
- Improve empty state with an icon/illustration.

## Verification Plan
### Automated Tests
- Build check to ensure no breaking changes in styles.

### Manual Verification
- **Visual Check**: Verify the new fonts are loading correctly.
- **Theme Check**: Toggle between Light/Dark mode to ensure the new palette looks good in both.
- **Interaction Check**: Hover over buttons, inputs, and cards to verify animations.
- **Responsiveness**: Check mobile layout with the new floating elements.
