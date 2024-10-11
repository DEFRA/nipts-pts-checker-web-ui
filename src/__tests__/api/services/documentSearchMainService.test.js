import documentSearchMainService from "../../../api/services/documentSearchMainService.js";
import { DocumentSearchMainModel } from "../../../api/models/documentSearchMainModel";
import DocumentSearchModel from "../../../constants/documentSearchConstant";


jest.mock("../../../api/models/documentSearchMainModel");
jest.mock("../../../constants/documentSearchConstant");

describe('getDocumentSearchMain', () => {
  beforeEach(() => {
    DocumentSearchModel.documentSearchMainModelData = {
      pageTitle: 'Search Documents',
      pageHeading: 'Find your documents',
      searchOptions: [
        { value: 'ptd', error: 'Please enter PTD number' },
        { value: 'application', error: 'Please enter application number' },
        { value: 'microchip', error: 'Please enter microchip number' },
      ],
      errorLabel: 'Error',
    };
  });

  it('should return a new DocumentSearchMainModel with the correct data', async () => {
    const mockModelInstance = {};
    
    DocumentSearchMainModel.mockImplementation(() => mockModelInstance);

    const result = await documentSearchMainService.getDocumentSearchMain("test search text");

    expect(DocumentSearchMainModel).toHaveBeenCalledWith(DocumentSearchModel.documentSearchMainModelData);
    
    expect(result).toBe(mockModelInstance);
  });
});
