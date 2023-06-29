import { darken, lighten } from 'polished';

/* eslint-disable import/no-anonymous-default-export */
export default function stateTheme(color: string) {
  return {
    title: 'state',

    colors: {
      primary: color,
      secondary: color,
      dark: darken(0.2, color),
      light: lighten(0.5, color),
    },

    buttons: {
      default: color,
      defaultActive: darken(0.2, color),
      defaultDisable: '#A9A9A9',

      alert: '#FF6868',
      alertActive: '#BB4646',
      alertDisable: '#A9A9A9',

      warning: '#FFC800',
      warningActive: '#BB4646',
      warningDisable: '#A9A9A9',
    },

    gradients: {
      gradientVertical: `linear-gradient(180deg, ${darken(
        0.2,
        color,
      )} 0%, ${lighten(0.2, color)} 100%)`,
      gradientHorizontal: `linear-gradient(116.82deg, ${lighten(
        0.2,
        color,
      )} 0%, ${darken(0.2, color)} 100%)`,
    },
  };
}
