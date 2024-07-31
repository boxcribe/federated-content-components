export function setAnyState(setStateFn, partialUpdatedState) {
  setStateFn((prevState) => ({
    ...prevState,
    ...partialUpdatedState,
  }));
}
