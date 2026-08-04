/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          light:   '#3B82F6',
          dark:    '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          light:   '#8B5CF6',
          dark:    '#6D28D9',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light:   '#FCD34D',
          dark:    '#D97706',
        },
        neutral: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        success: {
          DEFAULT: '#10B981',
          light:   '#34D399',
          dark:    '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light:   '#FCD34D',
          dark:    '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          light:   '#F87171',
          dark:    '#DC2626',
        },
        info: {
          DEFAULT: '#3B82F6',
          light:   '#60A5FA',
          dark:    '#2563EB',
        },
        background:    '#FFFFFF',
        surface: {
          DEFAULT: '#F9FAFB',
          raised:  '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          focus:   '#2563EB',
        },
        overlay: 'rgba(0, 0, 0, 0.5)',
        text: {
          primary:    '#111827',
          secondary:  '#6B7280',
          disabled:   '#9CA3AF',
          inverse:    '#FFFFFF',
          link:       '#2563EB',
          'link-hover': '#1D4ED8',
        },
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Cascadia Code', 'monospace'],
      },

      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1.25' }],
        sm:   ['0.875rem', { lineHeight: '1.375' }],
        base: ['1rem',     { lineHeight: '1.5' }],
        lg:   ['1.125rem', { lineHeight: '1.625' }],
        xl:   ['1.25rem',  { lineHeight: '1.5' }],
        '2xl': ['1.5rem',   { lineHeight: '1.25' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem',  { lineHeight: '1.25' }],
        '5xl': ['3rem',     { lineHeight: '1' }],
      },

      fontWeight: {
        regular:   '400',
        medium:    '500',
        semibold:  '600',
        bold:      '700',
        extrabold: '800',
      },

      lineHeight: {
        tight:   '1.25',
        snug:    '1.375',
        normal:  '1.5',
        relaxed: '1.625',
        loose:   '2',
      },

      letterSpacing: {
        tight:   '-0.025em',
        normal:  '0em',
        wide:    '0.025em',
        wider:   '0.05em',
        widest:  '0.1em',
      },

      spacing: {
        0:  '0rem',
        1:  '0.25rem',
        2:  '0.5rem',
        3:  '0.75rem',
        4:  '1rem',
        5:  '1.25rem',
        6:  '1.5rem',
        8:  '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem',
      },

      borderRadius: {
        none: '0rem',
        sm:   '0.125rem',
        base: '0.25rem',
        md:   '0.375rem',
        lg:   '0.5rem',
        xl:   '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },

      borderWidth: {
        0: '0px',
        1: '1px',
        2: '2px',
        4: '4px',
        8: '8px',
      },

      boxShadow: {
        none:  'none',
        sm:    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base:  '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
        md:    '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)',
        lg:    '0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)',
        xl:    '0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },

      opacity: {
        0:   '0',
        25:  '0.25',
        50:  '0.5',
        75:  '0.75',
        100: '1',
      },

      zIndex: {
        below:    '-1',
        base:     '0',
        raised:   '10',
        dropdown: '100',
        sticky:   '200',
        overlay:  '300',
        modal:    '400',
        popover:  '500',
        toast:    '600',
        tooltip:  '700',
      },

      transitionDuration: {
        fast:   '150ms',
        base:   '200ms',
        slow:   '300ms',
        slower: '500ms',
      },

      transitionTimingFunction: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in:      'cubic-bezier(0.4, 0, 1, 1)',
        out:     'cubic-bezier(0, 0, 0.2, 1)',
        linear:  'linear',
      },

      screens: {
        sm:  '640px',
        md:  '768px',
        lg:  '1024px',
        xl:  '1280px',
        '2xl': '1536px',
      },

      maxWidth: {
        container: '1280px',
      },

      height: {
        header:  '64px',
        footer:  '80px',
      },

      width: {
        sidebar:           '256px',
        'sidebar-collapsed': '72px',
      },
    },
  },
  plugins: [],
};
