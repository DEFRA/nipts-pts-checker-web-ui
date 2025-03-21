import { DocumentSearchMainModel } from "../models/documentSearchMainModel.js";
import DocumentSearchModel from "../../constants/documentSearchConstant.js";


const getDocumentSearchMain = async (searchText) => {
  try {
    DocumentSearchModel.documentSearchMainModelData.searchText = searchText;
    return new DocumentSearchMainModel(DocumentSearchModel.documentSearchMainModelData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return { error: error.message }; // Ensure function always returns a value
  }
};



export default {
    getDocumentSearchMain
}
