class InvalidStateError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidStateError";
  }
}

export default InvalidStateError;
