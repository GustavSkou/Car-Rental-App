import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

export function SearchBar({ style, ...props }: TextInputProps) {
  return <TextInput {...props} style={[styles.input, style]} />;
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#222',
    borderWidth: 1,
    color: '#111',
    fontSize: 16,
    height: 46,
    paddingHorizontal: 14,
  },
});