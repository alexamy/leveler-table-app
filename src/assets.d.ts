// metro resolves a bundled asset to an opaque id
declare module '*.wav' {
  const source: number;
  export default source;
}
