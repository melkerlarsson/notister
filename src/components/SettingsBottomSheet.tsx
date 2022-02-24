import { View, Text, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { Portal, PortalHost } from "@gorhom/portal";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Divider from "./Divider";
import FolderIcon from "./FolderIcon";

import { Ionicons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  TouchableHighlight,
} from "react-native-gesture-handler";
import ConfirmationModal from "./ConfirmationModal";
import MenuOption from "./MenuOption";
import ColorPickerModal from "./ColorPickerModal";

interface SettingsBottomSheetProps {
  open: boolean;
  onClose: () => void;
  folder: SubFolder;
  onDeleteFolder: (folderId: string) => Promise<void>;
}

const SettingsBottomSheet = ({
  open,
  onClose,
  folder,
  onDeleteFolder,
}: SettingsBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [isConfimationModalVisible, setIsConfimationModalVisible] =
    useState(false);
  const [isColorPickerModalVisible, setIsColorPickerModalVisible] =
    useState(false);

  useEffect(() => {
    if (open) {
      bottomSheetRef.current?.close();
      onClose();
    } else {
      bottomSheetRef.current?.expand();
    }
  }, [open]);

  const snapPoints = useMemo(() => ["50%"], []);

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 400,
  });

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.2}
      />
    ),
    []
  );

  const deleteFolder = async () => {
    await onDeleteFolder(folder.id);
    setIsConfimationModalVisible(false);
  };

  const onDeleteButtonPressed = () => {
    bottomSheetRef.current?.close();
    setIsConfimationModalVisible(true);
  };

  const onColorButtonPressed = () => {
    bottomSheetRef.current?.close();
    setIsColorPickerModalVisible(true);
  }

  return (
    <>
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          animationConfigs={animationConfigs}
        >
          <View style={styles.content}>
            <View style={styles.heading}>
              <FolderIcon color={folder.color} size={24} />
              <Text style={styles.title}>{folder.name}</Text>
            </View>
            <Divider />

            <MenuOption text="Share" icon={<Ionicons name="person-add-outline" size={24} />} onPress={() => null}/>
            <MenuOption text="Color" icon={<Ionicons name="md-color-palette-outline" size={24} />} onPress={onColorButtonPressed}/>
            <MenuOption text="Delete" icon={<Ionicons name="trash-outline" size={24} />} onPress={onDeleteButtonPressed}/>
            
          </View>
        </BottomSheet>
      </Portal>
      <ColorPickerModal isVisible={isColorPickerModalVisible} onClose={() => setIsColorPickerModalVisible(false)} currentColor={folder.color} onColorSelected={(color) => console.log(color)}/>
      <ConfirmationModal
        title="Delete folder"
        description="Are you sure that you want to delete this folder and all of its content? This action is irreversible"
        isVisible={isConfimationModalVisible}
        onClose={() => setIsConfimationModalVisible(false)}
        onConfirm={deleteFolder}
      />
      <PortalHost name="settingsBottomSheet" />
    </>
  );
};

const styles = StyleSheet.create({
  content: {

  },
  heading: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: -10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  action: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionText: {
    marginLeft: 10,
  },
});

export default SettingsBottomSheet;
