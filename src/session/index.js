const entries = Object.freeze({
  pkcecodes: "pkcecodes",
  tokens: "tokens",
  user: "user",
});

function set(request, entryKey, key, value) {
  const entryValue = request.yar?.get(entryKey) || {};
  entryValue[key] = typeof value === "string" ? value.trim() : value;
  request.yar.set(entryKey, entryValue);
}

function get(request, entryKey, key) {
  const value = key
    ? request.yar?.get(entryKey)?.[key]
    : request.yar?.get(entryKey);
  return value;
}

function clear(request) {
  request.yar.clear(entries.pkcecodes);
  request.yar.clear(entries.tokens);
  request.yar.clear(entries.user);
}

function setToken(request, key, value) {
  set(request, entries.tokens, key, value);
}

function getToken(request, key) {
  return get(request, entries.tokens, key);
}

function setPkcecodes(request, key, value) {
  set(request, entries.pkcecodes, key, value);
}

function getPkcecodes(request, key) {
  return get(request, entries.pkcecodes, key);
}

function setUser(request, key, value) {
  set(request, entries.user, key, value);
}

function getUser(request, key) {
  return get(request, entries.user, key);
}

export default {
  clear,
  getToken,
  setToken,
  getPkcecodes,
  setPkcecodes,
  getUser,
  setUser,
};
