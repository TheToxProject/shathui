import { Platform } from "react-native";

const styles = {
  buttonSizes: {
    small: {
      fontSize: 10,
      paddingHorizontal: 6,
      paddingVertical: 4
    },
    normal: {
      fontSize: 14,
      paddingHorizontal: 12,
      paddingVertical: 8
    },
    medium: {
      fontSize: 16,
      paddingHorizontal: 16,
      paddingVertical: 10
    }
  },
  button: {
    ...Platform.select({
      ios: {
        boxShadow:
          "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"
      },
      android: {
        elevation: 2
      },
      web: {
        boxShadow:
          "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
        userSelect: "none"
      }
    }),
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 3,
    width: "auto",
    flex: 0
  },
  text: {
    color: "rgba(0, 0, 0, 0.87)",
    fontWeight: "bold",
    fontSize: 12
  }
};

export default styles;
