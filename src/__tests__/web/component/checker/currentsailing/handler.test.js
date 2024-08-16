import { CurrentSailingHandlers } from "../../../../../web/component/checker/currentsailing/handler.js";
import currentSailingMainService from "../../../../../api/services/currentSailingMainService.js";
import  { validateRouteRadio, validateSailingHour, validateSailingMinutes } from "../../../../../web/component/checker/currentsailing/validate.js";

jest.mock("../../../../../api/services/currentSailingMainService.js");
jest.mock("../../../../../web/component/checker/currentsailing/validate.js");

describe('Handler', () => {
  describe("index", () => {
      it('should return view with currentSailingMainModelData', async () => {
        const mockData = {
          pageHeading: "What route are you checking?",
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

        const request = {
          yar: {
            set: jest.fn(),            
          },
        };
        const h = {
          view: jest.fn((viewPath, data) => {
            return { viewPath, data };
          })
        };

        const response = await CurrentSailingHandlers.getCurrentSailings(request, h);

        expect(response.viewPath).toBe("componentViews/checker/currentsailing/currentsailingView");
        expect(response.data).toEqual({ currentSailingMainModelData: mockData });
        expect(h.view).toHaveBeenCalledWith("componentViews/checker/currentsailing/currentsailingView", { currentSailingMainModelData: mockData });
      });
  });
});

describe('submitCurrentSailingSlot', () => {
  it('should set the sailing slot in the session and redirect to the dashboard', async () => {
    // Mock payload
    const mockPayload = {
      routeRadio: '1',
      sailingHour: '12',
      sailingMinutes: '30',
    };

    // Mock sailing routes stored in session
    const sailingRoutes = [
      { id: '1', value: 'Birkenhead to Belfast (Stena)' },
      { id: '2', value: 'Cairnryan to Larne (P&O)' },
      { id: '3', value: 'Loch Ryan to Belfast (Stena)' },
    ];

    // Mock request object
    const mockRequest = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn().mockReturnValue(sailingRoutes),
      },
    };

    validateRouteRadio.mockReturnValue({
      isValid: true,
      error: null
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null
    });

    // Mock response toolkit
    const mockRedirect = jest.fn();
    const mockResponseToolkit = {
      redirect: mockRedirect,
    };

    // Expected sailing slot to be set in session
    const expectedSailingSlot = {
      sailingHour: mockPayload.sailingHour,
      sailingMinutes: mockPayload.sailingMinutes,
      selectedRoute: { id: '1', value: 'Birkenhead to Belfast (Stena)' },
    };

    // Invoke the handler
    await CurrentSailingHandlers.submitCurrentSailingSlot(mockRequest, mockResponseToolkit);

    // Assertions
    expect(mockRequest.yar.set).toHaveBeenCalledWith('CurrentSailingSlot', expectedSailingSlot);
    expect(mockRedirect).toHaveBeenCalledWith('/checker/dashboard');
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
      message: 'Retrieved Route details slot',
      currentSailingSlot: 'testSlot'
    });
    expect(response.code).toBe(200);
    expect(response.source).toEqual({
      message: 'Retrieved Route details slot',
      currentSailingSlot: 'testSlot'
    });
  });

  it("should handle route search with missing route radio selected", async () => {

    const mockData = {
      pageHeading: "What route are you checking?",
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

        // Mock sailing routes stored in session
        const sailingRoutes = [
          { id: '1', value: 'Birkenhead to Belfast (Stena)' },
          { id: '2', value: 'Cairnryan to Larne (P&O)' },
          { id: '3', value: 'Loch Ryan to Belfast (Stena)' },
        ];

    const request = {
      payload: mockData,
      yar: {
        set: jest.fn(),
        get: jest.fn().mockReturnValue(sailingRoutes),
      },
    };

    const h = {
      view: jest.fn().mockReturnValue({}),
    };

    currentSailingMainService.getCurrentSailingMain.mockResolvedValue(mockData);

    validateRouteRadio.mockReturnValue({
      isValid: false,
      error: "Select a route",
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null
    });

    const response = await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      "componentViews/checker/currentsailing/currentsailingView",
      {
        errorRouteRadio: "Select a route",
        errorSailingHour: null,
        errorSailingMinutes: null,
        errorSummary: [
          { fieldId: "routeRadio", message: "Select a route" }
        ],
        currentSailingMainModelData: [
          { id: "1", value: "Birkenhead to Belfast (Stena)" },
          { id: "2", value: "Cairnryan to Larne (P&O)" },
          { id: "3", value: "Loch Ryan to Belfast (Stena)" },
        ],
        formSubmitted: true,
        routeOption: undefined,
        routeRadio: undefined,
        sailingHour: undefined,
        sailingMinutes: undefined,
      }
    );
  });

  it("should handle route search with missing route hour", async () => {

    const mockData = {
      pageHeading: "What route are you checking?",
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

        // Mock sailing routes stored in session
        const sailingRoutes = [
          { id: '1', value: 'Birkenhead to Belfast (Stena)' },
          { id: '2', value: 'Cairnryan to Larne (P&O)' },
          { id: '3', value: 'Loch Ryan to Belfast (Stena)' },
        ];

    const request = {
      payload: mockData,
      yar: {
        set: jest.fn(),
        get: jest.fn().mockReturnValue(sailingRoutes),
      },
    };

    const h = {
      view: jest.fn().mockReturnValue({}),
    };

    currentSailingMainService.getCurrentSailingMain.mockResolvedValue(mockData);

    validateRouteRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateSailingHour.mockReturnValue({
      isValid: false,
      error: "Select the hours and minutes for a scheduled sailing time"
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null
    });

    const response = await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      "componentViews/checker/currentsailing/currentsailingView",
      {
        errorRouteRadio: null,
        errorSailingHour: "Select the hours and minutes for a scheduled sailing time",
        errorSailingMinutes: null,
        errorSummary: [
          { fieldId: "sailingHour", message: "Select the hours and minutes for a scheduled sailing time" }
        ],
        currentSailingMainModelData: [
          { id: "1", value: "Birkenhead to Belfast (Stena)" },
          { id: "2", value: "Cairnryan to Larne (P&O)" },
          { id: "3", value: "Loch Ryan to Belfast (Stena)" },
        ],
        formSubmitted: true,
        routeOption: undefined,
        routeRadio: undefined,
        sailingHour: undefined,
        sailingMinutes: undefined,
      }
    );
  });

  it("should handle route search with missing route minutes", async () => {

    const mockData = {
      pageHeading: "What route are you checking?",
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

        // Mock sailing routes stored in session
        const sailingRoutes = [
          { id: '1', value: 'Birkenhead to Belfast (Stena)' },
          { id: '2', value: 'Cairnryan to Larne (P&O)' },
          { id: '3', value: 'Loch Ryan to Belfast (Stena)' },
        ];

    const request = {
      payload: mockData,
      yar: {
        set: jest.fn(),
        get: jest.fn().mockReturnValue(sailingRoutes),
      },
    };

    const h = {
      view: jest.fn().mockReturnValue({}),
    };

    currentSailingMainService.getCurrentSailingMain.mockResolvedValue(mockData);

    validateRouteRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: false
    });

    validateSailingMinutes.mockReturnValue({
      isValid: false,
      error: "Select the hours and minutes for a scheduled sailing time"
    });

    const response = await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      "componentViews/checker/currentsailing/currentsailingView",
      {
        errorRouteRadio: null,
        errorSailingHour: false,
        errorSailingMinutes: "Select the hours and minutes for a scheduled sailing time",
        errorSummary: [
          { fieldId: "sailingHour", message: "Select the hours and minutes for a scheduled sailing time" }
        ],
        currentSailingMainModelData: [
          { id: "1", value: "Birkenhead to Belfast (Stena)" },
          { id: "2", value: "Cairnryan to Larne (P&O)" },
          { id: "3", value: "Loch Ryan to Belfast (Stena)" },
        ],
        formSubmitted: true,
        routeOption: undefined,
        routeRadio: undefined,
        sailingHour: undefined,
        sailingMinutes: undefined,
      }
    );
  });

});