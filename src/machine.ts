import { setup } from "xstate";

type Events =
| { type: "enter zero point", value: string }
| { type: "add measurement" }
| { type: "remove measurement", index: number }
| { type: "enter measurement", index: number, value: string }
| { type: "copies data" }


type Context = {
  zero: string;
  measurements: string[];
}

export const levelerMachine = setup({
  types: {} as {
    events: Events,
    context: Context,
  },
}).createMachine({
  context: {
    zero: "",
    measurements: [],
  },
});
