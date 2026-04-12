export const generateTimeOptions = (intervalMinutes: number = 15): string[] => {
  const times: string[] = [];
  let minutes = 0;

  while (minutes < 24 * 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const timeString = `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
    times.push(timeString);
    minutes += intervalMinutes;
  }
  return times;
};

// Generate UUID-like ID
export const generateId = () => Math.random().toString(36).substr(2, 9);

export const validateTimeOrder = (start: string, end: string): boolean => {
  if (!start || !end) return true;
  return start < end;
};
