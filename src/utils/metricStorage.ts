
// Utility functions to handle storing and retrieving calculated metrics from local storage

interface StoredMetric {
  value: string;
  timestamp: string;
  addedToMetrics: boolean;
}

export const saveCalculatedMetric = (metricId: number, value: string, timestamp: string, addedToMetrics: boolean): void => {
  try {
    const storedMetrics = getStoredMetrics();
    storedMetrics[metricId] = { value, timestamp, addedToMetrics };
    localStorage.setItem('calculatedMetrics', JSON.stringify(storedMetrics));
  } catch (error) {
    console.error('Error saving metric to local storage:', error);
  }
};

export const getCalculatedMetric = (metricId: number): StoredMetric | null => {
  try {
    const storedMetrics = getStoredMetrics();
    return storedMetrics[metricId] || null;
  } catch (error) {
    console.error('Error retrieving metric from local storage:', error);
    return null;
  }
};

const getStoredMetrics = (): Record<number, StoredMetric> => {
  try {
    const storedMetricsJson = localStorage.getItem('calculatedMetrics');
    return storedMetricsJson ? JSON.parse(storedMetricsJson) : {};
  } catch (error) {
    console.error('Error parsing stored metrics:', error);
    return {};
  }
};
