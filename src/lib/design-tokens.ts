// Design tokens for consistent UI across Simple and Fast modes
export const designTokens = {
  spacing: {
    simple: {
      xs: '0.5rem',    // 8px
      sm: '0.75rem',   // 12px
      md: '1rem',      // 16px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
      xxl: '2.5rem',   // 40px
    },
    fast: {
      xs: '0.375rem',  // 6px
      sm: '0.5rem',    // 8px
      md: '0.75rem',   // 12px
      lg: '1rem',      // 16px
      xl: '1.5rem',    // 24px
      xxl: '2rem',     // 32px
    },
  },
  typography: {
    simple: {
      h1: 'text-3xl lg:text-4xl font-bold',
      h2: 'text-2xl lg:text-3xl font-semibold',
      h3: 'text-xl lg:text-2xl font-semibold',
      body: 'text-base lg:text-lg',
      small: 'text-sm lg:text-base',
      caption: 'text-xs lg:text-sm',
    },
    fast: {
      h1: 'text-2xl lg:text-3xl font-bold',
      h2: 'text-xl lg:text-2xl font-semibold',
      h3: 'text-lg lg:text-xl font-semibold',
      body: 'text-sm lg:text-base',
      small: 'text-xs lg:text-sm',
      caption: 'text-xs',
    },
  },
  components: {
    button: {
      simple: { 
        primary: 'lg', 
        secondary: 'default',
        icon: 'default'
      },
      fast: { 
        primary: 'default', 
        secondary: 'sm',
        icon: 'sm'
      },
    },
    card: {
      simple: {
        padding: 'p-6',
        gap: 'gap-6',
        minHeight: 'min-h-[200px]',
      },
      fast: {
        padding: 'p-4',
        gap: 'gap-4',
        minHeight: 'min-h-[160px]',
      },
    },
    grid: {
      simple: {
        cols: 'grid-cols-1 md:grid-cols-2',
        gap: 'gap-6',
      },
      fast: {
        cols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        gap: 'gap-4',
      },
    },
  },
};

// Helper functions for mode-aware styling
export const getModeClasses = (mode: 'simple' | 'fast') => ({
  h1: designTokens.typography[mode].h1,
  h2: designTokens.typography[mode].h2,
  h3: designTokens.typography[mode].h3,
  body: designTokens.typography[mode].body,
  small: designTokens.typography[mode].small,
  caption: designTokens.typography[mode].caption,
  buttonPrimary: designTokens.components.button[mode].primary,
  buttonSecondary: designTokens.components.button[mode].secondary,
  buttonIcon: designTokens.components.button[mode].icon,
  cardPadding: designTokens.components.card[mode].padding,
  cardGap: designTokens.components.card[mode].gap,
  cardMinHeight: designTokens.components.card[mode].minHeight,
  gridCols: designTokens.components.grid[mode].cols,
  gridGap: designTokens.components.grid[mode].gap,
});

// Layout hook for consistent mode-aware layouts
export const useModeLayout = (mode: 'simple' | 'fast') => {
  return getModeClasses(mode);
};