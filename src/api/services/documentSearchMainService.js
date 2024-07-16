import { DocumentSearchMainModel } from "../models/documentSearchMainModel.js";
import DocumentSearchModel from "../../constants/documentSearchConstant.js";


const getDocumentSearchMain = (searchText) => {
  try {
    DocumentSearchModel.documentSearchMainModelData.searchText = searchText;
    return new DocumentSearchMainModel(DocumentSearchModel.documentSearchMainModelData);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export default {
    getDocumentSearchMain
}
