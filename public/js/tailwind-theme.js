// Shared Tailwind Configuration for all Merakiies pages
// This file is loaded by index.html and html/menu.html to ensure consistent styling.
try {
  tailwind.config = {
    darkMode: "class",
    corePlugins: {
      preflight: false
    },
    theme: {
      extend: {
        colors: {
          "surface-container": "#f0eee7",
          "surface-bright": "#fcf9f2",
          "outline": "#89726d",
          "primary": "#9f402d",
          "secondary-container": "#fed9b8",
          "on-secondary-fixed-variant": "#5a422a",
          "on-tertiary-fixed-variant": "#5b403c",
          "surface-container-low": "#f6f3ec",
          "on-background": "#1c1c18",
          "on-tertiary-container": "#3c2622",
          "on-primary-fixed": "#3e0500",
          "on-primary-fixed-variant": "#802918",
          "surface-container-lowest": "#ffffff",
          "surface-tint": "#9f402d",
          "surface-dim": "#dcdad3",
          "on-surface": "#1c1c18",
          "primary-fixed": "#ffdad3",
          "surface-variant": "#e5e2db",
          "tertiary-container": "#ac8b85",
          "background": "#fcf9f2",
          "on-primary": "#ffffff",
          "outline-variant": "#ddc0ba",
          "tertiary": "#745853",
          "secondary": "#74593f",
          "on-secondary-container": "#795d43",
          "on-secondary": "#ffffff",
          "on-error-container": "#93000a",
          "on-tertiary-fixed": "#2b1613",
          "surface": "#fcf9f2",
          "inverse-on-surface": "#f3f0ea",
          "on-surface-variant": "#56423e",
          "on-secondary-fixed": "#2a1704",
          "primary-container": "#e2725b",
          "surface-container-high": "#ebe8e1",
          "inverse-surface": "#31312c",
          "tertiary-fixed": "#ffdad4",
          "tertiary-fixed-dim": "#e3beb8",
          "inverse-primary": "#ffb4a5",
          "on-tertiary": "#ffffff",
          "secondary-fixed": "#ffdcbe",
          "error": "#ba1a1a",
          "secondary-fixed-dim": "#e3c0a0",
          "on-primary-container": "#5a0d02",
          "error-container": "#ffdad6",
          "primary-fixed-dim": "#ffb4a5",
          "on-error": "#ffffff",
          "surface-container-highest": "#e5e2db"
        },
        borderRadius: {
          "DEFAULT": "0.25rem",
          "lg": "0.5rem",
          "xl": "0.75rem",
          "full": "9999px"
        },
        spacing: {
          "container-max": "1280px",
          "margin-mobile": "20px",
          "margin-desktop": "64px",
          "gutter": "24px",
          "stack-sm": "16px",
          "stack-lg": "80px",
          "base": "8px",
          "stack-md": "32px"
        },
        fontFamily: {
          "headline-lg-mobile": ["Playfair Display"],
          "headline-xl": ["Playfair Display"],
          "headline-md": ["Playfair Display"],
          "label-sm": ["Quicksand"],
          "label-md": ["Quicksand"],
          "body-lg": ["Inter"],
          "headline-lg": ["Playfair Display"],
          "body-md": ["Inter"]
        },
        fontSize: {
          "headline-lg-mobile": ["28px", {"lineHeight": "36px", "fontWeight": "700"}],
          "headline-xl": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
          "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
          "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "700"}],
          "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "600"}],
          "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
          "headline-lg": ["32px", {"lineHeight": "40px", "fontWeight": "700"}],
          "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
        }
      }
    }
  };
} catch(_e) {}
