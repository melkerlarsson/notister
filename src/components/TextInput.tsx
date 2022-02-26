import { useState } from "react";
import { View, StyleSheet, TextInput as InputField, TextInputProps as InputFieldProps } from "react-native";
import { COLORS } from "../theme/colors";

interface TextInputProps extends InputFieldProps {}

const TextInput = ({...props}: TextInputProps) => {

  return (
    <InputField 
      style={styles.textInput} 
      selectionColor={COLORS.primary}
      { ...props }
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: 300,
    height: 50,
    borderRadius: 15,
    borderColor: COLORS.primary,
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
});

export default TextInput;