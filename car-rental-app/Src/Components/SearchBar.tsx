import { StyleSheet, TextInput, type TextInputProps } from "react-native";

import { colors } from "../Theme";

export function SearchBar({ style, ...props }: TextInputProps) {
  return <TextInput {...props} style={[styles.input, style]} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    height: 46,
    paddingHorizontal: 14,
  },
});
