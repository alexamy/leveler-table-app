import { Instance, types } from 'mobx-state-tree';
import { createContext } from 'react';

export const Store = types
  .model({
    sizes: types.optional(types.array(types.maybeNull(types.integer)), [null]),
    zero: types.maybeNull(types.integer),
  })
  .actions(self => ({
    addSize() {
      self.sizes.push(null);
    },
    setSize(size: string, idx: number) {
      self.sizes[idx] = toInteger(size);
    },
    setZero(value: string) {
      self.zero = toInteger(value);
    },
  }));

export interface IStore extends Instance<typeof Store> {}

export const StoreContext = createContext<IStore>({} as IStore);

function toInteger(text: string): number | null {
  const digits = text.replace(/[^0-9]/g, '');
  return digits.length > 0 ? Number(digits) : null;
}
