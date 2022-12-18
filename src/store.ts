import { Instance, types } from 'mobx-state-tree';
import { createContext } from 'react';

const Integer = types.model({
  id: types.identifier,
  value: types.maybeNull(types.integer),
});

export const Store = types
  .model({
    sizes: types.optional(types.array(Integer), [{ id: '1' }]),
    zero: types.optional(Integer, { id: '1' }),
  })
  .actions(self => ({
    addSize() {
      const id = Math.max(...self.sizes.map(s => Number(s.id))) + 1;
      self.sizes.push({ id: id.toString() });
    },
    removeSize(idx: number) {
      self.sizes.splice(idx, 1);
    },
    setSize(value: string, idx: number) {
      const target = self.sizes[idx];
      const size = toInteger(value);
      const needNew = target.value === null && size !== null;
      target.value = size;
      if(needNew) { this.addSize(); }
    },
    setZero(value: string) {
      self.zero.value = toInteger(value);
    },
  }));

export interface IStore extends Instance<typeof Store> {}

export const StoreContext = createContext<IStore>({} as IStore);

function toInteger(text: string): number | null {
  const digits = text.replace(/[^0-9]/g, '');
  return digits.length > 0 ? Number(digits) : null;
}
