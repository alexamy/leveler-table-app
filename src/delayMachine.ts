import { setup } from 'xstate';

type MachineEvent = { type: 'started' } | { type: 'stopped' };

const config = setup({
  types: {
    events: {} as MachineEvent,
  },
  actions: {
    'delayed action': () => {},
  },
  delays: {
    'action delay': 1500,
  },
});

export const delayMachine = config.createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        started: 'delaying',
      },
    },
    delaying: {
      on: {
        stopped: 'idle',
      },
      after: {
        'action delay': {
          target: 'idle',
          actions: 'delayed action',
        },
      },
    },
  },
});
