import { CurrentSailingHandlers } from "../../../../../web/component/checker/currentsailing/handler.js";
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

        const response = await CurrentSailingHandlers.getCurrentSailings.index.handler(request, h);

        expect(response.viewPath).toBe("componentViews/checker/currentsailing/currentsailingView");
        expect(response.data).toEqual({ currentSailingMainModelData: mockData });
        expect(h.view).toHaveBeenCalledWith("componentViews/checker/currentsailing/currentsailingView", { currentSailingMainModelData: mockData });
      });
  });
});

describe('submitCurrentSailingSlot', () => {
  it('should set the CurrentSailingSlot and redirect to /dashboard', async () => {
    const mockRequest = {
      payload: { sailingSlot: 'testSlot' },
      yar: {
        set: jest.fn()
      }
    };
    const mockResponseToolkit = {
      redirect: jest.fn(() => ({ code: 302 }))
    };

    const response = await CurrentSailingHandlers.submitCurrentSailingSlot(mockRequest, mockResponseToolkit);

    expect(mockRequest.yar.set).toHaveBeenCalledWith('CurrentSailingSlot', { sailingSlot: 'testSlot' });
    expect(mockResponseToolkit.redirect).toHaveBeenCalledWith('/dashboard');
    expect(response.code).toBe(302);
  });
});


describe('getCurrentSailingSlot', () => {
  it('should retrieve the CurrentSailingSlot from session', async () => {
    const mockRequest = {
      yar: {
        get: jest.fn().mockReturnValue('testSlot')
      }
    };
    const mockResponseToolkit = {
      response: jest.fn((value) => ({
        code: 200,
        source: value
      }))
    };

    const response = await CurrentSailingHandlers.getCurrentSailingSlot(mockRequest, mockResponseToolkit);

    expect(mockRequest.yar.get).toHaveBeenCalledWith('CurrentSailingSlot');
    expect(mockResponseToolkit.response).toHaveBeenCalledWith({
      message: 'Retrieved Current sailing slot',
      currentSailingSlot: 'testSlot'
    });
    expect(response.code).toBe(200);
    expect(response.source).toEqual({
      message: 'Retrieved Current sailing slot',
      currentSailingSlot: 'testSlot'
    });
  });
});