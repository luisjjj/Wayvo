import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label.toUpperCase()}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused ? styles.inputWrapperFocused : undefined,
          error ? styles.inputWrapperError : undefined,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : undefined,
            rightIcon ? styles.inputWithRightIcon : undefined,
            style,
          ]}
          placeholderTextColor="rgba(0,0,0,0.32)"
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: colors.text.tertiary,
    marginBottom: 2,
    letterSpacing: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  inputWrapperFocused: {
    borderBottomColor: colors.black,
  },
  inputWrapperError: {
    borderBottomColor: colors.semantic.danger,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: colors.text.primary,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  inputWithLeftIcon: {
    paddingLeft: 32,
  },
  inputWithRightIcon: {
    paddingRight: 32,
  },
  iconLeft: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  iconRight: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  error: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: colors.semantic.danger,
    marginTop: 4,
  },
});
