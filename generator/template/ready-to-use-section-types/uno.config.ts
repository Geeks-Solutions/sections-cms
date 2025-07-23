import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      Dark: '#00131F',
      TextColor: '#E3E3E3',
      SubText: '#E7E7E7',
      Blue: '#03B1C7',
      FieldGray: '#C2C2C2',
      TextGray: '#828282',
      SmallTextGray: '#BDBDBD',
      BorderGray: '#EEEEEE',
      white: '#FFFFFF',
      darkGray: '#737373',
      error: '#BA0202',
      grayText: '#7B7B7B',
      purpleInfo: '#61035B',
      mediaGrey: '#6E6E6E',
      mediaUnLocked: '#DDEBFF',
      mediaLocked: '#FFE5DD',
      blue: '#03b1c7'
    },
    spacing: {
      '15': '3.9rem',
      '4.5': '1.1rem'
    },
    boxShadow: {
      DEFAULT: '4px 2px 10px rgba(0, 0, 0, 0.1)'
    }
  },
  presets: [
    presetWind3({
      important: true
    }),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
  ],
  preflights: [
    {
      getCSS: () => `
        *, :after, :before {
          border: 0 solid #e5e7eb;
          box-sizing: border-box;
        }
        html {
          line-height: 1.5;
          font-family: ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
          font-feature-settings: normal;
          font-variation-settings: normal;
          tab-size: 4;
        }
        button, input, optgroup, select, textarea {
          color: inherit;
          font-family: inherit;
          font-feature-settings: inherit;
          font-size: 100%;
          font-variation-settings: inherit;
          font-weight: inherit;
          letter-spacing: inherit;
          line-height: inherit;
          margin: 0;
          padding: 0
        }
        body {
          line-height: inherit;
          margin: 0;
        }
        [role=button], button {
          cursor: pointer;
        }
        audio, canvas, embed, iframe, img, object, svg, video {
          display: block;
          vertical-align: middle;
        }
        img, video {
          height: auto;
          max-width: 100%;
        }
        button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]) {
          background-color: initial;
          background-image: none
        }
        menu, ol, ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        a {
          color: inherit;
          text-decoration: inherit;
        }
        blockquote, dd, dl, figure, h1, h2, h3, h4, h5, h6, hr, p, pre {
          margin: 0;
        }
        h1, h2, h3, h4, h5, h6 {
          font-size: inherit;
          font-weight: inherit;
        }
        .section-modal-wrapper .h4.sectionTypeHeader {
          height: auto !important;
        }
        .section-modal-content .h2, .section-modal-content .h4 {
          height: auto !important;
        }
      `
    }
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
