import { View, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function ProgressBar({ progress = 0.6 }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 8,
    borderRadius: 20,
    backgroundColor: "#DDEFE5",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
});