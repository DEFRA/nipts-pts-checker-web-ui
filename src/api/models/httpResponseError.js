class HttpResponseError extends Error {
    constructor(response) {
      super(`Http Error Response: ${response.status} ${response.statusText}`);
      this.response = response;
    }
  }
  
  export default { HttpResponseError };