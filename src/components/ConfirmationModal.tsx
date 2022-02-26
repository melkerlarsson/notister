import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal, { BaseModalProps } from "./Modal";


interface ConfirmationModal extends BaseModalProps {
  title: string;
  description: string;
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