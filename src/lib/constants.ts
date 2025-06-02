// Environmental impact conversion factors
export const CO2_PER_KM = 95; // grams of CO2 saved per kilometer
export const TREES_PER_KM = 0.01; // trees equivalent per kilometer (1 tree per 100km)

// Helper functions for environmental impact calculations
export const calculateCO2Saved = (distance: number): number => {
  return (distance * CO2_PER_KM) / 1000; // Convert to kg
};

export const calculateTreesEquivalent = (distance: number): number => {
  return Math.floor(distance * TREES_PER_KM);
}; 