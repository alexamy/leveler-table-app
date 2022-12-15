import { Instance, types } from 'mobx-state-tree';

const Measurment = types
  .model({
    sizes: types.array(types.number),
    zero: types.number,
  })
  .actions((self) => ({
    addSize(size: number) {
      self.sizes.push(size);
    },
    changeZero(zero: number) {
      self.zero = zero;
    },
  }));

export const Store = types.model({
  measurments: types.array(Measurment),
});

export interface IStore extends Instance<typeof Store> {}
