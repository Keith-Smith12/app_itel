import { useColorScheme } from 'react-native';

export type Theme = {
  light?: string;
  dark?: string;
};

export type ThemeColor =
  | 'text'
  | 'background'
  | 'tint'
  | 'tabIconDefault'
  | 'tabIconSelected';

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

export function useThemeColor(
  props: Theme,
  colorName: ThemeColor,
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[theme][colorName];
}