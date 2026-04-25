import { vars } from 'nativewind';

const lightThemeVars = {
  '--background': '0 0% 100%',
  '--foreground': '222.2 84% 4.9%',
  '--card': '0 0% 100%',
  '--card-foreground': '222.2 84% 4.9%',
  '--primary': '240 5.9% 10%',
  '--primary-foreground': '0 0% 98%',
  '--secondary': '210 40% 96.1%',
  '--secondary-foreground': '222.2 47.4% 11.2%',
  '--muted': '210 40% 96.1%',
  '--muted-foreground': '215.4 16.3% 46.9%',
  '--accent': '210 40% 96.1%',
  '--accent-foreground': '222.2 47.4% 11.2%',
  '--destructive': '0 84.2% 60.2%',
  '--destructive-foreground': '210 40% 98%',
  '--border': '214.3 31.8% 91.4%',
  '--input': '214.3 31.8% 91.4%',
  '--ring': '240 5.9% 10%',
};

const darkThemeVars = {
  '--background': '222.2 84% 4.9%',
  '--foreground': '210 40% 98%',
  '--card': '222.2 84% 4.9%',
  '--card-foreground': '210 40% 98%',
  '--primary': '60 9.1% 97.8%',
  '--primary-foreground': '222.2 47.4% 11.2%',
  '--secondary': '217.2 32.6% 17.5%',
  '--secondary-foreground': '210 40% 98%',
  '--muted': '217.2 32.6% 17.5%',
  '--muted-foreground': '215 20.2% 65.1%',
  '--accent': '217.2 32.6% 17.5%',
  '--accent-foreground': '210 40% 98%',
  '--destructive': '0 84% 60%',
  '--destructive-foreground': '210 40% 98%',
  '--border': '217.2 32.6% 17.5%',
  '--input': '217.2 32.6% 17.5%',
  '--ring': '60 9.1% 97.8%',
};

export const lightTheme = vars(lightThemeVars);
export const darkTheme = vars(darkThemeVars);

function hslToHex(hsl: string): string {
  const [h, s, l] = hsl.split(' ').map(parseFloat);
  const a = (s * Math.min(l, 100 - l)) / 10000;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round((255 * color) / 100)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function convertThemeToHex(themeVars: Record<string, string>) {
  return {
    background: hslToHex(themeVars['--background']),
    foreground: hslToHex(themeVars['--foreground']),
    card: hslToHex(themeVars['--card']),
    cardForeground: hslToHex(themeVars['--card-foreground']),
    primary: hslToHex(themeVars['--primary']),
    primaryForeground: hslToHex(themeVars['--primary-foreground']),
    secondary: hslToHex(themeVars['--secondary']),
    secondaryForeground: hslToHex(themeVars['--secondary-foreground']),
    muted: hslToHex(themeVars['--muted']),
    mutedForeground: hslToHex(themeVars['--muted-foreground']),
    accent: hslToHex(themeVars['--accent']),
    accentForeground: hslToHex(themeVars['--accent-foreground']),
    destructive: hslToHex(themeVars['--destructive']),
    destructiveForeground: hslToHex(themeVars['--destructive-foreground']),
    border: hslToHex(themeVars['--border']),
    input: hslToHex(themeVars['--input']),
    ring: hslToHex(themeVars['--ring']),
  };
}

export const lightThemeColors = convertThemeToHex(lightThemeVars);
export const darkThemeColors = convertThemeToHex(darkThemeVars);
