import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from "./Modal";


interface ConfirmationModal {
  title: string;
  description: string;
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal = ({ title, description, isVisible, onClose, onConfirm }: ConfirmationModal) => {



  return (
    <Modal
      title={title}
      description={description}
      isVisible={isVisible}
      onClose={onClose}
      onButtonPress={onConfirm}
    />
  );
};

const styles = StyleSheet.create({});

export default ConfirmationModal;