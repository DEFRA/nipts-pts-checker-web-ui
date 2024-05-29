import Handler from "../../../../../web/component/checker/currentsailing/handler.js";
import currentSailingMainService from "../../../../../api/services/currentSailingMainService.js";

jest.mock("../../../../../api/services/currentSailingMainService.js");

describe('Handler', () => {
  describe("index", () => {
      it('should return view with currentSailingMainModelData', async () => {
        const mockData = {
          pageHeading: "Current sailing",
          serviceName: "Pet Travel Scheme: Check a pet from Great Britain to Northern Ireland",
          routeSubHeading: "Route",
          routes: [
            { id: '1', value: 'Birkenhead to Belfast (Stena)', label: 'Birkenhead to Belfast (Stena)' },
            { id: '2', value: 'Cairnryan to Larne (P&O)', label: 'Cairnryan to Larne (P&O)' },
            { id: '3', value: 'Loch Ryan to Belfast (Stena)', label: 'Loch Ryan to Belfast (Stena)' }
          ],
          sailingTimeSubHeading: "Scheduled sailing time",
          sailingHintText1: "Use the 24-hour clock - for example, 15:30.",
          sailingHintText2: "For midday, use 12:00. For midnight, use 23:59.",
          sailingTimes: ["", "00", "01"]
        };

        currentSailingMainService.getCurrentSailingMain.mockResolvedValue(mockData);

        const request = {};
        const h = {
          view: jest.fn((viewPath, data) => {
            return { viewPath, data };
          })
        };

        const response = await Handler.index.handler(request, h);

        expect(response.viewPath).toBe("componentViews/checker/currentsailing/currentsailingView");
        expect(response.data).toEqual({ currentSailingMainModelData: mockData });
        expect(h.view).toHaveBeenCalledWith("componentViews/checker/currentsailing/currentsailingView", { currentSailingMainModelData: mockData });
      });
  });
});