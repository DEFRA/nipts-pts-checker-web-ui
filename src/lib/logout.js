import session from "../session/index.js";

const logout = (request) => {
  if (request) {
    request.cookieAuth.clear();
    request.yar.clear("magicwordchecked");
    request.yar.clear("magicwordpathtonavigate");
    session.clear(request);
  }
};

export default logout;
