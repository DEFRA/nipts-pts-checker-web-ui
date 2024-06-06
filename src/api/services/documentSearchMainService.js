import { DocumentSearchMainModel } from "../models/documentSearchMainModel.js";
import DocumentSearchModel from "../../constants/documentSearchConstant.js";


const getDocumentSearchMain = () => {
  try {
 
    return new DocumentSearchMainModel(DocumentSearchModel);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export default {
    getDocumentSearchMain,
};
