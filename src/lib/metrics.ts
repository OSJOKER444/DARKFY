export const updateMetric = (key: string, increment: number) => {
  const current = parseInt(localStorage.getItem(key) || "0", 10);
  localStorage.setItem(key, (current + increment).toString());
};

export const setMetric = (key: string, value: number) => {
  localStorage.setItem(key, value.toString());
};

export const getMetric = (key: string): number => {
  return parseInt(localStorage.getItem(key) || "0", 10);
};
