import { View, StyleSheet, Text, ViewStyle, TextStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ButtonProps {
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress: () => void;
}

const Button = ({ title, style, textStyle, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
    
      style={[styles.button, style]}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#269dff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    shadowColor: "#269dff",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 20,
  },
  text: {
    color: "#fff",
  },
});

export default Button;
