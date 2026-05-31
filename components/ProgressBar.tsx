import { View } from "react-native";

import { withAlpha } from "@/lib/color";

/**
 * A thin rounded progress bar.
 *
 * `progress` is a 0–1 fraction; values outside that range are clamped. The fill
 * is tinted with `color` (typically the selected track's accent) over a soft
 * tint of the same color, so progress reads as "more of this track done".
 */
interface ProgressBarProps {
  progress: number;
  color: string;
  /** Bar thickness in px. */
  height?: number;
}

export function ProgressBar({ progress, color, height = 8 }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: withAlpha(color, 0.15),
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height: "100%",
          borderRadius: height / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
