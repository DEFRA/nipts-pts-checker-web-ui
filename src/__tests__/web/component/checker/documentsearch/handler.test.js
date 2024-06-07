import { DocumentSearchHandlers } from "../../../../../web/component/checker/documentsearch/handler.js";
import documentSearchMainService from "../../../../../api/services/documentSearchMainService.js";

jest.mock("../../../../../api/services/documentSearchMainService.js");

describe('Handler', () => {
  describe("index", () => {
      it('should return view with documentSearchMainModelData', async () => {
        const mockData = {
            pageHeading: "Find a document",
            pageTitle: "Pet Travel Scheme: Check a pet from Great Britain to Northern Ireland",
            ptdSearchText: "GB826",
            errorLabel: "Error:",
            searchOptions: [
                        { value: 'Search by PTD number', error: 'Enter a PTD number' },
                        { value: 'Search by application number', error: 'Enter an application number' },
                        { value: 'Search by microchip number', error: 'Enter a PTD or application number' }
                      ],
          };

        documentSearchMainService.getDocumentSearchMain.mockResolvedValue(mockData);

        const request = {};
        const h = {
          view: jest.fn((viewPath, data) => {
            return { viewPath, data };
          })
        };

        const response = await DocumentSearchHandlers.getDocumentSearch.index.handler(request, h);

        expect(response.viewPath).toBe("componentViews/checker/documentsearch/documentSearchView");
        expect(response.data).toEqual({ documentSearchMainModelData: mockData });
        expect(h.view).toHaveBeenCalledWith("componentViews/checker/documentsearch/documentSearchView", { documentSearchMainModelData: mockData });
      });
  });
});

