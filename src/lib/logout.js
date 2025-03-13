import session from "../session/index.js";

const logout = (request) => {
  if (request) {
    request.cookieAuth.clear();
    session.clear(request);
    
    request.yar.clear("isGBCheck");
    request.yar.clear("checkerId");
    request.yar.clear("organisationId");
    request.yar.clear("isAuthorized");
  }
};

export default logout;
