class InvalidPermissionsError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidPermissionsError";
  }
}

export default InvalidPermissionsError;
