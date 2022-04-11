import { ViewStyle } from "react-native";
import { default as ToastMessage, ToastConfig, BaseToast } from "react-native-toast-message";
import { COLORS } from "../theme/colors";

const commonToastStyle: ViewStyle = {
	width: "90%",
};

const toastConfig: ToastConfig = {
	error: (props) => <BaseToast {...props} style={{ borderLeftColor: COLORS.error, ...commonToastStyle }} />,
	success: (props) => <BaseToast {...props} style={{ borderLeftColor: COLORS.successs, ...commonToastStyle }} />,
	info: (props) => <BaseToast {...props} style={{ borderLeftColor: COLORS.info, ...commonToastStyle }} />,
};

export const ToastProvider = () => {
	return <ToastMessage config={toastConfig} />;
};

type type = "success" | "info" | "error";

type ShowProps = {
	title: string;
	description: string;
	type?: type;
	duration?: number;
};

const show = ({ title, description, type = "success", duration = 3000 }: ShowProps) => {
	ToastMessage.show({ text1: title, text2: description, type, position: "bottom", autoHide: true, visibilityTime: duration });
};

const hide = () => ToastMessage.hide();

const Toast = {
	show: show,
	hide: hide,
};

export default Toast;
