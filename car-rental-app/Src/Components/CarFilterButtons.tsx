import { colors } from "@/Theme";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

type CarFilterButtonsProps = {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
};

export function CarFilterButtons({
  options,
  selectedOption,
  onSelect,
}: CarFilterButtonsProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.filters}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {options.map((option) => {
        const isSelected = selectedOption === option;

        return (
          <Pressable
            accessibilityRole="button"
            key={option}
            onPress={() => onSelect(option)}
            style={[
              styles.filterButton,
              isSelected && styles.filterButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                isSelected && styles.filterTextSelected,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filters: {
    alignItems: "center",
    gap: 8,
    paddingRight: 8,
  },
  filterButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.text,
    fontSize: 14,
  },
  filterTextSelected: {
    color: colors.textOnDark,
    fontWeight: "700",
  },
});
