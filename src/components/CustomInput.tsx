import React from "react";
import { View, Text, StyleSheet, TextInput, TextInputProps } from "react-native";
import { Control, Controller, Path, FieldValues } from "react-hook-form";
import { COLORS } from "../theme/colors";

interface CustomInputProps<T extends FieldValues> extends TextInputProps {
	name: Path<T>;
	control: Control<T>;
	placeholder: string;
	label: string;
}

function CustomInput<T extends { [key: string]: string }>({ name, label, control, placeholder, ...props }: CustomInputProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
				<View style={styles.container}>
					<Text style={styles.label}>{label}</Text>

					<View>
						<TextInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder={placeholder} {...props} style={[styles.input, { borderColor: error ? COLORS.error : COLORS.primary }]} />
					</View>

					{error && <Text style={{ color: COLORS.error, alignSelf: "flex-start" }}>{error.message || "Error"}</Text>}
				</View>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		width: "100%",
	},
	inputContainer: {},
	input: {
		borderWidth: 1,
		borderRadius: 10,
		height: 50,
		backgroundColor: "#fff",
		paddingHorizontal: 10,
	},
	errorMessage: {},
	label: {
		marginBottom: 5,
	},
});

export default CustomInput;
