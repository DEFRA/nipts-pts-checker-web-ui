import { CurrentSailingMainModel } from "../models/currentSailingMainModel.js";
import  CurrentSailingModel  from "../../constant/currentSailingConstant.js";

const getCurrentSailingMain = () => {
  return new CurrentSailingMainModel(CurrentSailingModel.currentSailingMainModelData)
};

export default {
    getCurrentSailingMain,
};
