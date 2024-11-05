module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./sections/**/*.{js,vue,ts}",
    "./utils/**/*.{js,vue,ts}",
    "./node_modules/@geeks.solutions/vue-components/components/**/*.{js,vue,ts}",
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        Blue: "#03B1C7",
        borderSecondary: "#B2B2A4",
        FieldGray: "#C2C2C2",
        primaryColor: "#131310",
        textGray: "#F3F4F6",
        buttonGray: "#E1E1DB",
        buttonLightGray: "#EFEDEB",
        error: "#E81C4F",
        BgGrey: "#EDEDED",
        Primary_Color_5: "#E0E0E0",
        Primary_Color_10: "#9D9D8B",
        Primary_Color_25: "#E8E8E3",
        Primary_Color_50: "#D0D0C8",
        Primary_Color_300: "#666656",
        Primary_Color_400: "#4B4B3F",
        Primary_Color_600: "#11110E",
        Primary_Color_700: "#0E0E0C",
        Primary_Color_800: "#0B0B09",
        Secondary_25: "#F7F5F2",
        Secondary_500: "#64503E",
        Secondary_800: "#201913",
        Secondary_900: "#060504",
        Gray_25: "#FCFCFD",
        Gray_50: "#F9FAFB",
        Gray_100: "#F2F4F7",
        Gray_200: "#EAECF0",
        Gray_250: "#BDBDBD",
        Gray_300: "#D0D5DD",
        Gray_400: "#98A2B3",
        Gray_500: "#667085",
        Gray_600: "#475467",
        Gray_700: "#344054",
        Gray_800: "#1D2939",
        Gray_900: "#101828",
        Gray_1000: "#B9B9AC",
        Success_25: "#F6FEF9",
        Success_50: "#ECFDF3",
        Success_300: "#6CE9A6",
        Success_600: "#039855",
        Success_700: "#027A48",
        Success_800: "#05603A",
        Error_25: "#FFFBFA",
        Error_200: "#FECDCA",
        Error_300: "#FDA29B",
        Error_500: "#F04438",
        Error_600: "#D92D20",
        Error_700: "#B42318",
        Error_800: "#912018",
        Warning_25: "#FFFCF5",
        Warning_300: "#FEC84B",
        Warning_700: "#B54708"
      },
      screens: {
        'xs': '400px',
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-pixel-dimensions')({
      width: {
        total: 900, // 900 is the default
        // startingSize: 0, // default
      },
      height: {
        total: 900, // 900 is the default
        // startingSize: 0, // default
      },
    })
  ],
}
