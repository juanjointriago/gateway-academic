import { MessageOptions, showMessage } from "react-native-flash-message";
import { NAME_APP } from "../constants/Constants";

interface IToast {
    description?: string;
    type?: "danger" | "info" | "success" | "warning";
    // iconType: "info" | "success" | "danger" | "warning";
    floating?: boolean;
    position?:
    | "top"
    | "bottom"
    | "center"
    | { top?: number; left?: number; bottom?: number; right?: number };
    duration?: number;
}


export const toast = (props: IToast) => {
    showMessage({
        message: NAME_APP,
        description: props.description,
        type: props.type,
        floating: props.floating ?? true,
        icon: { icon: props.type ?? "auto", position: "left", props: {} },
        position: props.position ?? "top",
        // statusBarHeight: 25,
        duration: props.duration ?? 2000,
    })
}