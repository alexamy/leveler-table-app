import { Instance, types } from 'mobx-state-tree';
import { createContext } from 'react';

interface Result {
  value: number | null;
  index: number;
  sizeId: string;
}

const Integer = types.model({
  id: types.identifier,
  value: types.maybeNull(types.integer),
});

const Zero = types.optional(Integer, { id: '1' });

const SizeMap = types.model({
  lastId: types.optional(types.integer, 1),
  map: types.optional(types.map(Integer), { '1': { id: '1' } }),
})
.actions(self => ({
  add() {
    self.lastId += 1;
    self.map.put({ id: self.lastId.toString() });
  },
  remove(id: string) {
    self.map.delete(id);
  },
  set(value: string, id: string) {
    const target = self.map.get(id);
    if(!target) return;

    target.value = toInteger(value);
  },
}));

export const Store = types.model({
  sizes: types.optional(SizeMap, {}),
  zero: types.optional(Zero, { id: '1' }),
})
.views(self => ({
  get results(): Result[] {
    return [...self.sizes.map.values()].map((size, index) => {
      const value = self.zero.value !== null && size.value !== null
        ? self.zero.value - size.value
        : null;

      return { value, index, sizeId: size.id };
    });
  },
}))
.actions(self => ({
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
