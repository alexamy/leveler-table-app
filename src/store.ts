import { Instance, types } from 'mobx-state-tree';
import { createContext } from 'react';

export const Store = types
  .model({
    sizes: types.optional(types.array(types.maybe(types.integer)), []),
    zero: types.optional(types.integer, 0),
  })
  .actions(self => ({
    addSize(size: string) {
      self.sizes.push(toInteger(size));
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

function toInteger(text: string): number {
  return Number(text.replace(/[^0-9]/g, ''));
}
