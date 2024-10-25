export function getTag(category: string) {
  category = category.toLowerCase();
  if (
    category.includes("hotel") ||
    category.includes("resort") ||
    category.includes("accomodation")
  ) {
    return "Hotel";
  } else if (category.includes("restaurant")) {
    return "Food";
  } else {
    return "Attraction";
  }
}
