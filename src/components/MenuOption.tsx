import { StyleSheet, Text } from "react-native";
import { TouchableOpacity, } from "react-native-gesture-handler";


interface MenuOptionProps {
  text: string;
  icon: React.ReactElement;
  onPress: () => void;
}


const MenuOption = ({ text, icon: Icon, onPress }: MenuOptionProps) => {

  return (

    <TouchableOpacity style={styles.container} onPress={onPress}>
      { Icon}
      <Text>{ text }</Text>
    </TouchableOpacity>
  );

  
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 10,
  },
  text: {

  }
});

export default MenuOption;