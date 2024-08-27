const getQueryParamFromRequest = (request, key) => {
  const queryParams = request.query;

  const normalizedQueryParams = {};
  for (const queryKey in queryParams) {
    normalizedQueryParams[queryKey.toLowerCase()] = queryParams[queryKey];
  }

  const paramValue = normalizedQueryParams[key.toLowerCase()];

  return paramValue;
};

export default {
  getQueryParamFromRequest,
};
