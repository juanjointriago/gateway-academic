import { StyleSheet } from "react-native";

export const stylesGlobal = StyleSheet.create({
    innerSafeAreaAppBar: {
        flex: 1,
    },
    containerAppBar: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 15
    },
    containerTextWithLine: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 16, // Espaciado vertical
    },
    lineInText: {
        flex: 1, // Hace que las líneas se expandan
        height: 1, // Grosor de la línea
        backgroundColor: "#c4c4c4", // Color de la línea
    },
    spinnerView: {
        position: "absolute",
        zIndex: 999,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.83)",
    },
})