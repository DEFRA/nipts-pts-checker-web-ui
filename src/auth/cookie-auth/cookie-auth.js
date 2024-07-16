import parseRoles from "./parse-roles.js";

const set = (request, accessToken) => {
  request.cookieAuth.set({
    scope: parseRoles(accessToken.roles),
    account: {
      email: accessToken.email,
      name: `${accessToken.firstName} ${accessToken.lastName}`,
    },
  });
};

const clear = (request) => {
  request.cookieAuth.clear();
};

// legacy support
const setAuthCookie = (request, email, userType) => {
  request.cookieAuth.set({ email, userType });
  console.log(`Logged in user of type '${userType}' with email '${email}'.`);
};

export default { set, clear, setAuthCookie };
