// globalBlock.ts
let selectedClass: string | null = null;
type Callback = (block: string | null) => void;
const subscribers: Callback[] = [];

export const getSelectedClass = (): string | null => {
  return selectedClass;
};

export const setSelectedClass = (block: string | null) => {
  selectedClass = block;
  subscribers.forEach(callback => callback(block));
};

export const subscribeToClassChanges = (callback: Callback) => {
  subscribers.push(callback);
  callback(selectedClass); // Call the callback immediately with the current value
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
}
