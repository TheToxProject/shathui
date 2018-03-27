import { Platform } from "react-native";

export const noSelect = {
  ...Platform.select({
    web: {
      userSelect: "none"
    }
  })
};
