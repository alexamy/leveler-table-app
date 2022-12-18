import { Instance, types } from 'mobx-state-tree';
import { createContext } from 'react';

const Integer = types.model({
  id: types.identifier,
  value: types.maybeNull(types.integer),
});

const Zero = types.optional(Integer, { id: '1' });

const SizeMap = types.model({
  lastId: types.optional(types.integer, 1),
  map: types.optional(types.map(Integer), { '1': { id: '1' } }),
});

export const Store = types
  .model({
    sizes: types.optional(SizeMap, {}),
    zero: types.optional(Zero, { id: '1' }),
  })
  .actions(self => ({
    addSize() {
      self.sizes.lastId += 1;
      self.sizes.map.put({ id: self.sizes.lastId.toString() });
    },
    removeSize(id: string) {
      self.sizes.map.delete(id);
    },
    setSize(value: string, id: string) {
      const target = self.sizes.map.get(id);
      if(!target) return;

      const size = toInteger(value);
      const isLast = target.id === self.sizes.lastId.toString();
      const needNew = isLast && target.value === null && size !== null;

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
