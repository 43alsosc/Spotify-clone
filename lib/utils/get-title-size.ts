export function getTitleSize(length: number) {
  if (length <= 10) {
    return "text-9xl";
  } else if (length <= 20) {
    return "text-7xl";
  } else if (length <= 30) {
    return "text-6xl";
  } else if (length <= 40) {
    return "text-5xl";
  } else if (length <= 50) {
    return "text-4xl";
  } else if (length <= 60) {
    return "text-3xl";
  } else if (length <= 70) {
    return "text-2xl";
  } else if (length <= 80) {
    return "text-xl";
  } else if (length <= 90) {
    return "text-lg";
  } else if (length <= 100) {
    return "text-base";
  } else {
    return "text-sm";
  }
}
