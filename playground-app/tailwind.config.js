/**
 * Tokens espelhados 1:1 de ../css/style.css (:root) para manter o
 * Playground consistente com o resto do portfólio.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#ffffff", // --color-bg
        "surface-alt": "#f6f8f8", // --color-bg-alt
        ink: "#0e1b23", // --color-dark
        "ink-alt": "#14252f", // --color-dark-alt

        body: "#16222b", // --color-text
        muted: "#5c6773", // --color-text-muted
        onDark: "#ffffff", // --color-text-on-dark
        "onDark-muted": "#9aa8b1", // --color-text-on-dark-muted

        accent: {
          DEFAULT: "#1fada0", // --color-accent
          dark: "#178a80", // --color-accent-dark
          tint: "#e3f6f3", // --color-accent-tint
        },

        line: "#e6e9ec", // --color-border
        "line-onDark": "rgba(255, 255, 255, 0.12)", // --color-border-on-dark
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"], // --font-display
        body: ["Inter", "sans-serif"], // --font-body
      },
      maxWidth: {
        container: "1120px", // --container-width
      },
      borderRadius: {
        ds: "12px", // --radius
      },
      spacing: {
        section: "clamp(4rem, 8vw, 8rem)", // --space-section
      },
    },
  },
  plugins: [],
};
