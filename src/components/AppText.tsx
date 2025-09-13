import React from 'react';
import { Text, TextProps } from 'react-native';
import { typography, TypographyVariant } from '../theme/typography';

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
}

const AppText: React.FC<AppTextProps> = ({ variant = 'body', style, ...rest }) => {
  return <Text style={[typography[variant], style]} {...rest} />;
};

export default AppText;
