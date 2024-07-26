const checkMagicWord = (request, h) => {
    const isMagicWordChecked = request.yar.get("magicwordchecked");
    if (!isMagicWordChecked) {
      request.yar.set("magicwordpathtonavigate", request.path);
      return h.redirect('/checker/magic-word').takeover();
    }
    return h.continue;
  };
  
  export default checkMagicWord;
  