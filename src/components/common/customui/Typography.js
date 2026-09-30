import React from 'react';
import { Text, StyleSheet } from 'react-native';
import AppStyles from '../../../styles/AppStyles';
import { Color } from '../../../styles/GlobalStyles';

const textColors = StyleSheet.create({
  primary: {
    color: Color.Black_100,
  },
  secondary: {
    color: Color.sparklightGray1,
  },
});

const TextVariant = React.forwardRef(({ children, style, variantStyle, ...props }, ref) => (
  <Text ref={ref} style={[variantStyle, style]} {...props}>
    {children}
  </Text>
));

export const Title = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.H1} style={style} {...props}>
    {children}
  </TextVariant>
);

export const Body = ({ children, style, variant = 'primary', ...props }) => (
  <TextVariant
    variantStyle={AppStyles.sectionContent}
    style={[textColors[variant] || textColors.primary, style]}
    {...props}
  >
    {children}
  </TextVariant>
);

export const Caption = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.hintText} style={style} {...props}>
    {children}
  </TextVariant>
);

export const HeadingH1 = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.H1} style={style} {...props}>
    {children}
  </TextVariant>
);

export const HeadingH2 = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.H2} style={style} {...props}>
    {children}
  </TextVariant>
);

export const HeadingH3 = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.H3} style={style} {...props}>
    {children}
  </TextVariant>
);

export const SectionTitle = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.sectionTitle} style={style} {...props}>
    {children}
  </TextVariant>
);

export const SectionContent = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.sectionContent} style={style} {...props}>
    {children}
  </TextVariant>
);

// forwardRef so screen-reader focus targets (e.g. NotificationAlert title) can reach the native Text
export const FieldTitle = React.forwardRef(({ children, style, ...props }, ref) => (
  <TextVariant ref={ref} variantStyle={AppStyles.fieldTitle} style={style} {...props}>
    {children}
  </TextVariant>
));

export const FieldContent = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.fieldContent} style={style} {...props}>
    {children}
  </TextVariant>
);

export const IndicatorText = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.indicatorText} style={style} {...props}>
    {children}
  </TextVariant>
);

export const BannerAlertText = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.bannerAlertText} style={style} {...props}>
    {children}
  </TextVariant>
);

export const MenuText = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.menuText} style={style} {...props}>
    {children}
  </TextVariant>
);

export const HintText = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.hintText} style={style} {...props}>
    {children}
  </TextVariant>
);

export const InlineHintText = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.inlineHintText} style={style} {...props}>
    {children}
  </TextVariant>
);

export const PageTitle = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.pageTitle} style={style} {...props}>
    {children}
  </TextVariant>
);
export const Hyperlink = ({ children, style, ...props }) => (
  <TextVariant variantStyle={AppStyles.hyperlink} style={style} {...props}>
    {children}
  </TextVariant>
);
