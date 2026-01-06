export const stringHelpers = {
  capitalize: (str: string) => {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};

export const colorHelpers = {
  rgb: {
    toHsl: (r: number, g: number, b: number): [number, number, number] => {
      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0,
        s = 0,
        l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }

        h /= 6;
      }

      return [h * 360, s, l];
    },
  },
  hsl: {
    darken: (
      [h, s, l]: [number, number, number],
      amount = 0.3
    ): [number, number, number] => {
      return [h, s, Math.max(0, l - amount)];
    },
    toCSS: ([h, s, l]: [number, number, number]): string => {
      return `hsl(${h.toFixed(0)}, ${(s * 100).toFixed(0)}%, ${(
        l * 100
      ).toFixed(0)}%)`;
    },
    toHex: (h: number, s: number, l: number): string => {
      // no division of s/l since they’re already 0–1
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        return l - a * Math.max(-1, Math.min(Math.min(k - 3, 9 - k), 1));
      };

      const toHexChannel = (x: number) =>
        Math.round(255 * f(x))
          .toString(16)
          .padStart(2, "0");

      const r = toHexChannel(0);
      const g = toHexChannel(8);
      const b = toHexChannel(4);

      return `#${r}${g}${b}`;
    },
  },
};
