import { CurrentSailingMainModel } from "../models/currentSailingMainModel.js";
import  CurrentSailingModel  from "../../constants/currentSailingConstant.js";

const getCurrentSailingMain = () => {
  return new CurrentSailingMainModel(CurrentSailingModel.currentSailingMainModelData)
};

export default {
    getCurrentSailingMain,
};
