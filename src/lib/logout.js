import session from "../session/index.js";

const logout = (request) => {
  if (request) {
    request.cookieAuth.clear();
    session.clear(request);
  }
};

export default logout;
