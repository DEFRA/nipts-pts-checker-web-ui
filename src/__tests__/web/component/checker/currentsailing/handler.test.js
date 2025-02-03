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
import Routes from "../../../../../web/component/checker/SignIn/routes.js";

jest.mock("../../../../../api/services/currentSailingMainService.js", () => ({
  getCurrentSailingMain: jest.fn(),
}));

jest.mock("../../../../../web/component/checker/currentsailing/validate.js");

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
const ERROR_PATH = "errors/403Error";
const DASHBOARD_PATH = "/checker/dashboard";

const ERROR_MESSAGES = {
  routeOptionError: "Select if you are checking a ferry or a flight",
  routeError: "Select the ferry you are checking",
  flightNoEmptyError: "Enter the flight number. For example, RK 103",
  departureDateRequiredError: "Enter the scheduled departure date",
  departureDateFormatError: "Enter the date in the correct format",
  timeError: "Enter the scheduled sailing time",
  labelError: "Error:",
  genericError: "Validation errors occurred",
};

const sailingRoutesDefault = [
  { id: "1", value: ROUTES.BIRKENHEAD, label: ROUTES.BIRKENHEAD },
  { id: "2", value: ROUTES.CAIRNRYAN, label: ROUTES.CAIRNRYAN },
  { id: "3", value: ROUTES.LOCH_RYAN, label: ROUTES.LOCH_RYAN },
];

const routeOptionsDefault = [
  { id: "1", value: "Ferry", label: "Ferry", template: HTML.FERRY_VIEW_HTML },
  { id: "2", value: "Flight", label: "Flight", template: HTML.FLIGHT_VIEW_HTML },
];

const createMockRequest = (options = {}) => ({
  payload: options.payload,
  yar: {
    get: jest.fn().mockImplementation((key) => {
      if (key === "organisationId") {
        return options.yar?.organisationId;
      }
      if (key === "SailingRoutes") {
        return options.yar?.sailingRoutes || sailingRoutesDefault;
      }
      if (key === "CurrentSailingModel") {
        return options.yar?.currentSailingModel || {
          routeOptions: routeOptionsDefault,
          sailingRoutes: sailingRoutesDefault,
        };
      }
      return options.yar?.defaultValue;
    }),
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
  response: jest.fn((val) => ({ code: HTTP_STATUS.OK, source: val })),
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
  const defaultValidResult = { isValid: true, error: null };
  validateRouteOptionRadio.mockReturnValue(config.routeOption || defaultValidResult);
  validateRouteRadio.mockReturnValue(config.routeRadio || defaultValidResult);
  validateSailingHour.mockReturnValue(config.sailingHour || defaultValidResult);
  validateSailingMinutes.mockReturnValue(config.sailingMinutes || defaultValidResult);
  validateFlightNumber.mockReturnValue(config.flightNumber || defaultValidResult);
  validateDate.mockReturnValue(config.date || defaultValidResult);
  validateDateRange.mockReturnValue(config.dateRange || defaultValidResult);
};

// Test Suites
describe("getCurrentSailings Authorization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should return 403 for missing organisationId", async () => {
    const request = createMockRequest({ yar: { organisationId: "" } });
    const h = createMockH();

    await CurrentSailingHandlers.getCurrentSailings(request, h);

    expect(h.view).toHaveBeenCalledWith(ERROR_PATH);
    expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
    expect(h.view().code().takeover).toHaveBeenCalled();
  });

  test("should return 403 for null organisationId", async () => {
    const request = createMockRequest({ yar: { organisationId: null } });
    const h = createMockH();

    await CurrentSailingHandlers.getCurrentSailings(request, h);

    expect(h.view).toHaveBeenCalledWith(ERROR_PATH);
    expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
    expect(h.view().code().takeover).toHaveBeenCalled();
  });

  test("should return 403 for whitespace organisationId", async () => {
    const request = createMockRequest({ yar: { organisationId: "   " } });
    const h = createMockH();

    await CurrentSailingHandlers.getCurrentSailings(request, h);

    expect(h.view).toHaveBeenCalledWith(ERROR_PATH);
    expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
    expect(h.view().code().takeover).toHaveBeenCalled();
  });
});


// Fix for the sailing routes test
describe("submitCurrentSailingSlot Success Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
  });

  test("should handle null sailing routes", async () => {
    // Create route options
    const routeOptions = [
      {
        id: "1",
        value: "Ferry",
        label: "Ferry",
        template: HTML.FERRY_VIEW_HTML,
      },
      {
        id: "2",
        value: "Flight",
        label: "Flight",
        template: HTML.FLIGHT_VIEW_HTML,
      },
    ];

    // Create request with null sailing routes
    const request = createMockRequest({
      payload: createMockPayload({
        routeOption: "1",
        routeRadio: "1",
      }),
    });

    // Override the default mock behavior for SailingRoutes
    request.yar.get.mockImplementation((key) => {
      if (key === "SailingRoutes") {
        return null;
      }
      if (key === "CurrentSailingModel") {
        return {
          routeOptions,
          sailingRoutes: null,
        };
      }
      return null;
    });

    const h = createMockH();

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(request.yar.set).toHaveBeenCalledWith(
      "currentSailingSlot",
      expect.objectContaining({
        sailingHour: "12",
        sailingMinutes: "30",
        selectedRoute: null,
        departureDate: "01/01/2024",
        selectedRouteOption: routeOptions[0],
        routeFlight: "",
      })
    );
    expect(h.redirect).toHaveBeenCalledWith(DASHBOARD_PATH);
  });
});
describe("submitCurrentSailingSlot Route Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    setupValidationMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should validate route option selection", async () => {
    const request = createMockRequest({
      payload: createMockPayload({ routeOption: undefined }),
    });
    const h = createMockH();

    setupValidationMocks({
      routeOption: { isValid: false, error: ERROR_MESSAGES.routeOptionError },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorRouteOptionRadio: ERROR_MESSAGES.routeOptionError,
        errorSummary: expect.arrayContaining([
          { fieldId: "routeOption", message: ERROR_MESSAGES.routeOptionError },
        ]),
        formSubmitted: true,
      })
    );
  });

  test("should validate ferry route for ferry option", async () => {
    const request = createMockRequest({
      payload: createMockPayload({
        routeOption: "1",
        routeRadio: undefined,
      }),
    });
    const h = createMockH();

    setupValidationMocks({
      routeRadio: { isValid: false, error: ERROR_MESSAGES.routeError },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorRouteRadio: ERROR_MESSAGES.routeError,
        errorSummary: expect.arrayContaining([
          { fieldId: "routeRadio", message: ERROR_MESSAGES.routeError },
        ]),
        formSubmitted: true,
      })
    );
  });

  test("should validate flight number for flight option", async () => {
    const request = createMockRequest({
      payload: createMockPayload({
        routeOption: "2",
        routeFlight: "",
        routeRadio: undefined,
      }),
    });
    const h = createMockH();

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
        errorSummary: expect.arrayContaining([
          {
            fieldId: "routeFlight",
            message: ERROR_MESSAGES.flightNoEmptyError,
          },
        ]),
        formSubmitted: true,
      })
    );
  });
});

describe("submitCurrentSailingSlot Time and Date Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    setupValidationMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should validate invalid sailing hours", async () => {
    const request = createMockRequest({
      payload: createMockPayload({ sailingHour: "25" }),
    });
    const h = createMockH();

    setupValidationMocks({
      sailingHour: { isValid: false, error: ERROR_MESSAGES.timeError },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorSailingHour: ERROR_MESSAGES.timeError,
        errorSummary: expect.arrayContaining([
          { fieldId: "sailingHour", message: ERROR_MESSAGES.timeError },
        ]),
        formSubmitted: true,
      })
    );
  });

  test("should validate invalid sailing minutes", async () => {
    const request = createMockRequest({
      payload: createMockPayload({ sailingMinutes: "61" }),
    });
    const h = createMockH();

    setupValidationMocks({
      sailingMinutes: { isValid: false, error: ERROR_MESSAGES.timeError },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorSailingMinutes: ERROR_MESSAGES.timeError,
        errorSummary: expect.arrayContaining([
          { fieldId: "sailingMinutes", message: ERROR_MESSAGES.timeError },
        ]),
        formSubmitted: true,
      })
    );
  });

  test("should validate departure date format", async () => {
    const request = createMockRequest({
      payload: createMockPayload({
        departureDateDay: "32",
        departureDateMonth: "13",
      }),
    });
    const h = createMockH();

    setupValidationMocks({
      date: { isValid: false, error: ERROR_MESSAGES.departureDateFormatError },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorDepartureDate: ERROR_MESSAGES.departureDateFormatError,
        errorSummary: expect.arrayContaining([
          {
            fieldId: "departureDateDay",
            message: ERROR_MESSAGES.departureDateFormatError,
          },
        ]),
        formSubmitted: true,
      })
    );
  });

  test("should validate date range with actual hour", async () => {
    const request = createMockRequest({
      payload: createMockPayload(),
    });
    const h = createMockH();

    setupValidationMocks({
      dateRange: { isValid: false, error: "Date range error" },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorSummary: expect.arrayContaining([
          { fieldId: "departureDateDay", message: "Date range error" },
        ]),
        formSubmitted: true,
      })
    );
  });

  test("should skip date range validation if date is invalid", async () => {
    const request = createMockRequest({
      payload: createMockPayload({
        departureDateDay: "32",
      }),
    });
    const h = createMockH();

    setupValidationMocks({
      date: { isValid: false, error: ERROR_MESSAGES.departureDateFormatError },
      dateRange: { isValid: false, error: "Date range error" },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorDepartureDate: ERROR_MESSAGES.departureDateFormatError,
        errorDateRangeDate: null,
        errorDateRangeTime: null,
        formSubmitted: true,
      })
    );
  });
});

describe("submitCurrentSailingSlot Success Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    setupValidationMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should submit valid ferry slot", async () => {
    const routeOptions = [
      {
        id: "1",
        value: "Ferry",
        label: "Ferry",
        template: HTML.FERRY_VIEW_HTML,
      },
      {
        id: "2",
        value: "Flight",
        label: "Flight",
        template: HTML.FLIGHT_VIEW_HTML,
      },
    ];

    const request = createMockRequest({
      payload: createMockPayload(),
      yar: {
        currentSailingModel: {
          routeOptions,
          sailingRoutes: sailingRoutesDefault,
        },
      },
    });

    const h = createMockH();

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(request.yar.set).toHaveBeenCalledWith("currentSailingSlot", {
      sailingHour: "12",
      sailingMinutes: "30",
      selectedRoute: sailingRoutesDefault[0],
      departureDate: "01/01/2024",
      selectedRouteOption: routeOptions[0],
      routeFlight: "",
    });
    expect(h.redirect).toHaveBeenCalledWith(DASHBOARD_PATH);
  });

  test("should submit valid flight slot", async () => {
    const routeOptions = [
      {
        id: "1",
        value: "Ferry",
        label: "Ferry",
        template: HTML.FERRY_VIEW_HTML,
      },
      {
        id: "2",
        value: "Flight",
        label: "Flight",
        template: HTML.FLIGHT_VIEW_HTML,
      },
    ];

    const request = createMockRequest({
      payload: createMockPayload({
        routeOption: "2",
        routeFlight: "RK103",
        routeRadio: undefined,
      }),
      yar: {
        currentSailingModel: {
          routeOptions,
          sailingRoutes: sailingRoutesDefault,
        },
      },
    });

    const h = createMockH();

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(request.yar.set).toHaveBeenCalledWith("currentSailingSlot", {
      sailingHour: "12",
      sailingMinutes: "30",
      selectedRoute: undefined,
      departureDate: "01/01/2024",
      selectedRouteOption: routeOptions[1],
      routeFlight: "RK103",
    });
    expect(h.redirect).toHaveBeenCalledWith(DASHBOARD_PATH);
  });

  test("should handle null sailing routes", async () => {
    const routeOptions = [
      {
        id: "1",
        value: "Ferry",
        label: "Ferry",
        template: HTML.FERRY_VIEW_HTML,
      },
      {
        id: "2",
        value: "Flight",
        label: "Flight",
        template: HTML.FLIGHT_VIEW_HTML,
      },
    ];

    const request = createMockRequest({
      payload: createMockPayload(),
      yar: {
        currentSailingModel: {
          routeOptions,
          sailingRoutes: null,
        },
        sailingRoutes: null,
      },
    });

    const h = createMockH();

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(request.yar.set).toHaveBeenCalledWith("currentSailingSlot", {
      departureDate: "01/01/2024",
      routeFlight: "",
      sailingHour: "12",
      sailingMinutes: "30",
      selectedRoute: {
        id: "1",
        label: ROUTES.BIRKENHEAD,
        value: ROUTES.BIRKENHEAD,
      },
      selectedRouteOption: {
        id: "1",
        label: "Ferry",
        template: HTML.FERRY_VIEW_HTML,
        value: "Ferry",
      },
    });
    expect(h.redirect).toHaveBeenCalledWith(DASHBOARD_PATH);
  });
});

describe("getCurrentSailingSlot", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should retrieve existing sailing slot", async () => {
    const testSlot = { id: "test" };
    const request = createMockRequest({ yar: { defaultValue: testSlot } });
    const h = createMockH();

    const response = await CurrentSailingHandlers.getCurrentSailingSlot(
      request,
      h
    );

    expect(response.code).toBe(HTTP_STATUS.OK);
    expect(response.source).toEqual({
      message: "Retrieved Route details slot",
      currentSailingSlot: testSlot,
    });
  });

  test("should handle null sailing slot", async () => {
    const request = createMockRequest({ yar: { defaultValue: null } });
    const h = createMockH();

    const response = await CurrentSailingHandlers.getCurrentSailingSlot(
      request,
      h
    );

    expect(response.code).toBe(HTTP_STATUS.OK);
    expect(response.source).toEqual({
      message: "Retrieved Route details slot",
      currentSailingSlot: null,
    });
  });

  test("should handle undefined sailing slot", async () => {
    const request = createMockRequest({ yar: { defaultValue: undefined } });
    const h = createMockH();

    const response = await CurrentSailingHandlers.getCurrentSailingSlot(
      request,
      h
    );

    expect(response.code).toBe(HTTP_STATUS.OK);
    expect(response.source).toEqual({
      message: "Retrieved Route details slot",
      currentSailingSlot: undefined,
    });
  });
});