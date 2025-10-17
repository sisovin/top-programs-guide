# Header Component Documentation

## Overview

The refactored Header component provides a modern, responsive navigation system following the Project Document Guide specifications.

## Layout Structure

### Desktop (≥1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo + Brand]    [Home | Languages | Career Paths | Trends |      │
│                     Resources]        [Theme] [Sign In] [Sign Up]   │
└─────────────────────────────────────────────────────────────────────┘
   LEFT (flex)         CENTER (flex-1)          RIGHT (flex gap-2)
```

### Tablet (640px - 1023px)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo + Top 10]                  [Theme] [Sign In] [Sign Up] [☰]│
└─────────────────────────────────────────────────────────────────┘
```

### Mobile (<640px)

```
┌─────────────────────────────────────────────────────┐
│  [Logo + Top 10]           [Theme] [☰]              │
└─────────────────────────────────────────────────────┘
```

## Features

### 1. **Left Section: Logo & Branding**

- Code2 icon from Lucide React
- "Top 10 Languages" text on desktop/tablet
- "Top 10" abbreviated text on mobile
- Focus ring for accessibility
- Link to homepage

### 2. **Center Section: Main Navigation**

- Hidden on mobile/tablet (< 1024px)
- Visible on desktop (≥ 1024px)
- 5 navigation items:
  - Home
  - Languages
  - Career Paths
  - Trends
  - Resources
- Active state highlighting with background accent
- Smooth hover transitions
- ARIA current page indicator

### 3. **Right Section: Actions**

- **Theme Switcher**: Always visible
  - Light/Dark/System modes
  - Dropdown menu with icons
  
- **Auth Buttons**:
  - "Sign In" - Ghost variant
  - "Sign Up" - Primary variant
  - Hidden on mobile (< 640px)
  - Visible in mobile menu

- **Mobile Menu Button**:
  - Hamburger icon (Menu)
  - Only visible < 1024px
  - Opens Sheet component from right

### 4. **Mobile Navigation Sheet**

- Slides from right side
- 280px width on mobile, 320px on tablet
- Contains:
  - Full navigation list
  - Sign In button (outline)
  - Sign Up button (primary)
  - Separated by border
- Auto-closes on navigation

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| < 640px    | Logo abbreviated, auth buttons hidden, mobile menu shown |
| 640px - 1023px | Full logo, auth buttons visible, mobile menu shown |
| ≥ 1024px   | Full layout with center navigation, mobile menu hidden |

## Accessibility Features

✅ **ARIA Labels**: All interactive elements have descriptive labels
✅ **ARIA Current**: Active page indication for screen readers
✅ **Focus Management**: Visible focus rings on all interactive elements
✅ **Keyboard Navigation**: Full keyboard support
✅ **Semantic HTML**: Proper use of nav, header, button elements
✅ **Role Attributes**: Banner role on header, navigation role on nav

## Theme Integration

The component integrates with next-themes through the ThemeSwitcher component:

- Persists user preference
- Supports system preference detection
- Smooth transitions between themes
- Dropdown menu with visual indicators

## State Management

- `pathname`: Current route from Next.js navigation
- `isOpen`: Mobile sheet open/close state
- `isActive()`: Helper function to determine active navigation item

## Dependencies

```typescript
import Link from 'next/link';                     // Next.js navigation
import { usePathname } from 'next/navigation';    // Route detection
import { Button } from './ui/button';             // Shadcn/UI
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'; // Shadcn/UI
import { Menu, Code2 } from 'lucide-react';      // Icons
import { cn } from '@/lib/utils';                // Tailwind utilities
import { ThemeSwitcher } from './theme-switcher'; // Theme toggle
```

## Usage

```tsx
import { Header } from '@/components/Header';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
```

## Customization

### Adding Navigation Items

Edit the `navigationItems` array:

```typescript
const navigationItems = [
  { name: 'New Page', href: '/new-page', ariaLabel: 'Go to new page' },
  // ...
];
```

### Styling Adjustments

- Modify Tailwind classes in the component
- Update theme colors in `tailwind.config.ts`
- Adjust container max-width via container class

## Testing Checklist

- [ ] Navigation links work correctly
- [ ] Active state highlights current page
- [ ] Mobile menu opens/closes properly
- [ ] Theme switcher functions correctly
- [ ] Sign In/Sign Up buttons navigate properly
- [ ] Responsive at all breakpoints
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Touch targets are at least 44x44px

## Performance

- Client component with minimal state
- No unnecessary re-renders
- Lazy-loaded Sheet component
- Optimized with Next.js Link prefetching
