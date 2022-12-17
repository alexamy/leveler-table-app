import { Instance, types } from 'mobx-state-tree';

export const Store = types
  .model({
    sizes: types.optional(types.array(types.number), []),
    zero: types.optional(types.string, ''),
  })
  .actions((self) => ({
    addSize(size: number) {
      self.sizes.push(size);
    },
    changeZero(zero: string) {
      self.zero = zero;
    },
  }));

export interface IStore extends Instance<typeof Store> {}
