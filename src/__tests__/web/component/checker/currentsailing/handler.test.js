import moment from "moment-timezone";
import { CurrentSailingHandlers } from "../../../../../web/component/checker/currentsailing/handler.js";
import currentSailingMainService from "../../../../../api/services/currentSailingMainService.js";
import {
  validateRouteOptionRadio,
  validateRouteRadio,
  validateSailingHour,
  validateSailingMinutes,
  validateFlightNumber,
  validateDate,
  validateDateRange,
} from "../../../../../web/component/checker/currentsailing/validate.js";

jest.mock("../../../../../api/services/currentSailingMainService.js");
jest.mock("../../../../../web/component/checker/currentsailing/validate.js");

// Constants
const ROUTES = {
  BIRKENHEAD: "Birkenhead to Belfast (Stena)",
  CAIRNRYAN: "Cairnryan to Larne (P&O)",
  LOCH_RYAN: "Loch Ryan to Belfast (Stena)",
};

const DATE_FORMATS = {
  DAY: "DD",
  MONTH: "MM",
  YEAR: "YYYY",
  TIMEZONE: "Europe/London",
};

const HTTP_STATUS = {
  FORBIDDEN: 403,
  OK: 200,
};

const HTML = {
  FERRY_VIEW_HTML: "ferryView.html",
  FLIGHT_VIEW_HTML: "flightView.html",
};

const VIEW_PATH = "componentViews/checker/currentsailing/currentsailingView";
const ERROR_MESSAGES = {
  routeOptionError: "Select if you are checking a ferry or a flight",
  routeError: "Select the ferry you are checking",
  flightNoEmptyError: "Enter the flight number. For example, RK 103",
  departureDateRequiredError:
    "Enter the scheduled departure date, for example 27 3 2024",
  departureDateFormatError:
    "Enter the date in the correct format, for example 27 3 2024",
  timeError: "Enter the scheduled sailing time, for example 15:30",
  labelError: "Error:",
  genericError: "Validation errors occurred",
};

const sailingRoutesDefault = [
  { id: "1", value: ROUTES.BIRKENHEAD, label: ROUTES.BIRKENHEAD },
  { id: "2", value: ROUTES.CAIRNRYAN, label: ROUTES.CAIRNRYAN },
  { id: "3", value: ROUTES.LOCH_RYAN, label: ROUTES.LOCH_RYAN },
];

const createMockRequest = (organisationId) => ({
  yar: {
    get: jest.fn().mockReturnValue(organisationId),
    set: jest.fn(),
  },
});

const createMockH = () => ({
  view: jest.fn().mockReturnValue({
    code: jest.fn().mockReturnValue({
      takeover: jest.fn(),
    }),
  }),
  redirect: jest.fn(),
});

const createMockPayload = (overrides = {}) => ({
  routeOption: "1",
  routeRadio: "1",
  sailingHour: "12",
  sailingMinutes: "30",
  departureDateDay: "1",
  departureDateMonth: "1",
  departureDateYear: "2024",
  routeFlight: "",
  ...overrides,
});

const setupValidationMocks = (config = {}) => {
  validateRouteOptionRadio.mockReturnValue(
    config.routeOption || { isValid: true, error: null }
  );
  validateRouteRadio.mockReturnValue(
    config.routeRadio || { isValid: true, error: null }
  );
  validateSailingHour.mockReturnValue(
    config.sailingHour || { isValid: true, error: null }
  );
  validateSailingMinutes.mockReturnValue(
    config.sailingMinutes || { isValid: true, error: null }
  );
  validateFlightNumber.mockReturnValue(
    config.flightNumber || { isValid: true, error: null }
  );
  validateDate.mockReturnValue(config.date || { isValid: true, error: null });
  validateDateRange.mockReturnValue(
    config.dateRange || { isValid: true, error: null }
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  setupValidationMocks();
});

describe("getCurrentSailings Authorization", () => {
  it("should return 403 when organisationId is missing", async () => {
    const request = createMockRequest("");
    const h = createMockH();

    await CurrentSailingHandlers.getCurrentSailings(request, h);

    expect(request.yar.get).toHaveBeenCalledWith("organisationId");
    expect(h.view).toHaveBeenCalledWith("errors/403Error");
    expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
    expect(h.view().code().takeover).toHaveBeenCalled();
  });

  it("should return 403 when organisationId is null", async () => {
    const request = createMockRequest(null);
    const h = createMockH();

    await CurrentSailingHandlers.getCurrentSailings(request, h);

    expect(request.yar.get).toHaveBeenCalledWith("organisationId");
    expect(h.view).toHaveBeenCalledWith("errors/403Error");
    expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
  });
});

describe("getCurrentSailings Data Handling", () => {
  const mockMainServiceData = {
    pageHeading: "What route are you checking?",
    serviceName:
      "Pet Travel Scheme: Check a pet travelling from Great Britain to Northern Ireland",
    routeSubHeading: "Route",
    routes: sailingRoutesDefault,
    sailingTimeSubHeading: "Scheduled sailing time",
    sailingHintText1: "Use the 24-hour clock - for example, 15:30.",
    sailingHintText2: "For midday, use 12:00. For midnight, use 23:59.",
    sailingTimes: ["", "00", "01"],
    sailingRoutes: sailingRoutesDefault,
  };

  it("should set data in session and return view", async () => {
    const request = createMockRequest("validId");
    const h = {
      view: jest.fn((viewPath, data) => ({ viewPath, data })),
    };

    currentSailingMainService.getCurrentSailingMain.mockResolvedValue(
      mockMainServiceData
    );

    const londonTime = moment.tz(DATE_FORMATS.TIMEZONE);
    const expectedDates = {
      departureDateDay: londonTime.format(DATE_FORMATS.DAY),
      departureDateMonth: londonTime.format(DATE_FORMATS.MONTH),
      departureDateYear: londonTime.format(DATE_FORMATS.YEAR),
    };

    const response = await CurrentSailingHandlers.getCurrentSailings(
      request,
      h
    );

    expect(request.yar.set).toHaveBeenCalledWith(
      "CurrentSailingModel",
      mockMainServiceData
    );
    expect(request.yar.set).toHaveBeenCalledWith(
      "SailingRoutes",
      mockMainServiceData.sailingRoutes
    );
    expect(response.data).toEqual({
      currentSailingMainModelData: mockMainServiceData,
      ...expectedDates,
    });
  });

  it("should handle null service response", async () => {
    const request = createMockRequest("validId");
    const h = {
      view: jest.fn((viewPath, data) => ({ viewPath, data })),
    };

    currentSailingMainService.getCurrentSailingMain.mockResolvedValue(null);

    const response = await CurrentSailingHandlers.getCurrentSailings(
      request,
      h
    );

    expect(request.yar.set).toHaveBeenCalledWith("CurrentSailingModel", {});
    expect(request.yar.set).toHaveBeenCalledWith("SailingRoutes", undefined);
    expect(response.viewPath).toBe(VIEW_PATH);
  });
});

describe("submitCurrentSailingSlot Validation OnePart", () => {
  const setupTestRequest = (payload) => ({
    payload,
    yar: {
      get: jest.fn().mockReturnValue({
        routeOptions: [
          { id: "1", value: "Ferry", template: HTML.FERRY_VIEW_HTML },
          { id: "2", value: "Flight", template: HTML.FLIGHT_VIEW_HTML },
        ],
        sailingRoutes: sailingRoutesDefault,
      }),
      set: jest.fn(),
    },
  });

  it("should validate route option selection", async () => {
    const payload = createMockPayload({ routeOption: undefined });
    const request = setupTestRequest(payload);
    const h = { view: jest.fn() };

    setupValidationMocks({
      routeOption: { isValid: false, error: ERROR_MESSAGES.routeOptionError },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorRouteOptionRadio: ERROR_MESSAGES.routeOptionError,
        errorSummary: [
          {
            fieldId: "routeOption",
            message: ERROR_MESSAGES.routeOptionError,
          },
        ],
      })
    );
  });

  it("should validate ferry route selection", async () => {
    const payload = createMockPayload({
      routeOption: "1",
      routeRadio: null,
    });
    const request = setupTestRequest(payload);
    const h = { view: jest.fn() };

    setupValidationMocks({
      routeRadio: { isValid: false, error: ERROR_MESSAGES.routeError },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorRouteRadio: ERROR_MESSAGES.routeError,
        errorSummary: [
          {
            fieldId: "routeRadio",
            message: ERROR_MESSAGES.routeError,
          },
        ],
      })
    );
  });
});

describe("submitCurrentSailingSlot Validation TwoPart", () => {
  const setupTestRequest = (payload) => ({
    payload,
    yar: {
      get: jest.fn().mockReturnValue({
        routeOptions: [
          { id: "1", value: "Ferry", template: HTML.FERRY_VIEW_HTML },
          { id: "2", value: "Flight", template: HTML.FLIGHT_VIEW_HTML },
        ],
        sailingRoutes: sailingRoutesDefault,
      }),
      set: jest.fn(),
    },
  });
  it("should validate flight number", async () => {
    const payload = createMockPayload({
      routeOption: "2",
      routeFlight: "",
    });
    const request = setupTestRequest(payload);
    const h = { view: jest.fn() };

    setupValidationMocks({
      flightNumber: {
        isValid: false,
        error: ERROR_MESSAGES.flightNoEmptyError,
      },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorFlight: ERROR_MESSAGES.flightNoEmptyError,
      })
    );
  });
});


describe('submitCurrentSailingSlot Success', () => {
  it("should submit valid sailing slot", async () => {
    const routeOptions = [
      { id: "1", value: "Ferry", label: "Ferry", template: HTML.FERRY_VIEW_HTML },
      { id: "2", value: "Flight", label: "Flight", template: HTML.FLIGHT_VIEW_HTML }
    ];

    const payload = createMockPayload();
    const request = {
      payload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === "SailingRoutes") {
            return sailingRoutesDefault;
          }
          if (key === "CurrentSailingModel") {
            return { 
              routeOptions,
              sailingRoutes: sailingRoutesDefault 
            };
          }
          return null;
        })
      }
    };

    const h = { redirect: jest.fn() };
    
    validateRouteOptionRadio.mockReturnValue({ isValid: true, error: null });
    validateRouteRadio.mockReturnValue({ isValid: true, error: null });
    validateSailingHour.mockReturnValue({ isValid: true, error: null });
    validateSailingMinutes.mockReturnValue({ isValid: true, error: null });
    validateFlightNumber.mockReturnValue({ isValid: true, error: null });
    validateDate.mockReturnValue({ isValid: true, error: null });
    validateDateRange.mockReturnValue({ isValid: true, error: null });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    const expectedSailingSlot = {
      sailingHour: payload.sailingHour,
      sailingMinutes: payload.sailingMinutes,
      selectedRoute: sailingRoutesDefault[0],
      departureDate: expect.any(String),
      selectedRouteOption: routeOptions[0],
      routeFlight: payload.routeFlight,
    };

    expect(request.yar.set).toHaveBeenCalledWith(
      "currentSailingSlot",
      expect.objectContaining(expectedSailingSlot)
    );
    expect(h.redirect).toHaveBeenCalledWith("/checker/dashboard");
  });
});

describe("getCurrentSailingSlot", () => {
  it("should retrieve sailing slot from session", async () => {
    const request = {
      yar: {
        get: jest.fn().mockReturnValue("testSlot"),
      },
    };

    const h = {
      response: jest.fn((value) => ({
        code: HTTP_STATUS.OK,
        source: value,
      })),
    };

    const response = await CurrentSailingHandlers.getCurrentSailingSlot(
      request,
      h
    );

    expect(request.yar.get).toHaveBeenCalledWith("currentSailingSlot");
    expect(response.code).toBe(HTTP_STATUS.OK);
    expect(response.source).toEqual({
      message: "Retrieved Route details slot",
      currentSailingSlot: "testSlot",
    });
  });
});
