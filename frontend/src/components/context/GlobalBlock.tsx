// globalBlock.ts
let selectedBlock: string | null = null;
type Callback = (block: string | null) => void;
const subscribers: Callback[] = [];

export const getSelectedBlock = (): string | null => {
  return selectedBlock;
};

export const setSelectedBlock = (block: string | null) => {
  selectedBlock = block;
  subscribers.forEach(callback => callback(block));
};

export const subscribeToBlockChanges = (callback: Callback) => {
  subscribers.push(callback);
  callback(selectedBlock); // Call the callback immediately with the current value
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
};
