const VIEW_PATH = "componentViews/checker/magicword/magicwordView";

const getMagicWord = async (request, h) => {
  return h.view(VIEW_PATH, { pageTitle : "Magic word" });
};

const checkMagicWord = async (request, h) => {
  let { magicword } = request.payload;
  if(magicword === "PetTravel")
  {
    request.yar.set("magicwordchecked", true);
    let navigationPath = request.yar.get("magicwordpathtonavigate");
    return h.redirect(navigationPath).takeover();
  }  
};




export const MagicWordHandlers = {
  getMagicWord,
  checkMagicWord,
};