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

const createMockYar = (options = {}) => ({
  get: jest.fn().mockImplementation((key) => {
    if (key === "organisationId") return options.organisationId;
    if (key === "SailingRoutes")
      return options.sailingRoutes || sailingRoutesDefault;
    if (key === "CurrentSailingModel")
      return (
        options.currentSailingModel || {
          routeOptions: options.routeOptions || [
            { id: "1", value: "Ferry", template: HTML.FERRY_VIEW_HTML },
            { id: "2", value: "Flight", template: HTML.FLIGHT_VIEW_HTML },
          ],
          sailingRoutes: sailingRoutesDefault,
        }
      );
    return options.defaultValue;
  }),
  set: jest.fn(),
});

const createMockRequest = (options = {}) => ({
  payload: options.payload,
  yar: createMockYar(options.yar),
});

const createMockH = (options = {}) => ({
  view: jest.fn().mockReturnValue({
    code: jest.fn().mockReturnValue({
      takeover: jest.fn(),
    }),
  }),
  redirect: jest.fn(),
  response:
    options.response ||
    jest.fn((val) => ({ code: HTTP_STATUS.OK, source: val })),
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
  validateRouteOptionRadio.mockReturnValue(
    config.routeOption || defaultValidResult
  );
  validateRouteRadio.mockReturnValue(config.routeRadio || defaultValidResult);
  validateSailingHour.mockReturnValue(config.sailingHour || defaultValidResult);
  validateSailingMinutes.mockReturnValue(
    config.sailingMinutes || defaultValidResult
  );
  validateFlightNumber.mockReturnValue(
    config.flightNumber || defaultValidResult
  );
  validateDate.mockReturnValue(config.date || defaultValidResult);
  validateDateRange.mockReturnValue(config.dateRange || defaultValidResult);
};

describe("getCurrentSailings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
  });

  test("should return 403 when organisationId is missing", async () => {
    const request = createMockRequest({ yar: { organisationId: "" } });
    const h = createMockH();

    await CurrentSailingHandlers.getCurrentSailings(request, h);

    expect(h.view).toHaveBeenCalledWith("errors/403Error");
    expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
  });

  test("should return 403 when organisationId is null", async () => {
    const request = createMockRequest({ yar: { organisationId: null } });
    const h = createMockH();

    await CurrentSailingHandlers.getCurrentSailings(request, h);

    expect(h.view).toHaveBeenCalledWith("errors/403Error");
    expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
  });

  test("should handle successful data retrieval", async () => {
    const mockMainServiceData = {
      pageHeading: "What route are you checking?",
      serviceName: "Pet Travel Scheme",
      routeSubHeading: "Route",
      routes: sailingRoutesDefault,
      sailingRoutes: sailingRoutesDefault,
    };

    currentSailingMainService.getCurrentSailingMain.mockResolvedValue(
      mockMainServiceData
    );

    const request = createMockRequest({ yar: { organisationId: "valid-id" } });
    const h = createMockH();

    await CurrentSailingHandlers.getCurrentSailings(request, h);

    expect(request.yar.set).toHaveBeenCalledWith(
      "CurrentSailingModel",
      mockMainServiceData
    );
    expect(request.yar.set).toHaveBeenCalledWith(
      "SailingRoutes",
      mockMainServiceData.sailingRoutes
    );
  });

  test("should handle null service response", async () => {
    currentSailingMainService.getCurrentSailingMain.mockResolvedValue(null);
    const request = createMockRequest({ yar: { organisationId: "valid-id" } });
    const h = createMockH();

    await CurrentSailingHandlers.getCurrentSailings(request, h);

    expect(request.yar.set).toHaveBeenCalledWith("CurrentSailingModel", {});
    expect(request.yar.set).toHaveBeenCalledWith("SailingRoutes", undefined);
  });
});

describe("submitCurrentSailingSlot", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
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
      })
    );
  });

  test("should validate ferry route selection", async () => {
    const request = createMockRequest({
      payload: createMockPayload({ routeRadio: null }),
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
      })
    );
  });

  test("should validate flight number", async () => {
    const request = createMockRequest({
      payload: createMockPayload({ routeOption: "2", routeFlight: "" }),
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
      })
    );
  });

  test("should validate sailing time", async () => {
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
      })
    );
  });

  test("should handle successful submission", async () => {
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

    expect(request.yar.set).toHaveBeenCalledWith(
      "currentSailingSlot",
      expect.any(Object)
    );
    expect(h.redirect).toHaveBeenCalledWith("/checker/dashboard");
  });
});

describe("getCurrentSailingSlot", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should retrieve sailing slot from session", async () => {
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

  test("should handle missing sailing slot", async () => {
    const request = createMockRequest({ yar: { defaultValue: null } });
    const h = createMockH();

    const response = await CurrentSailingHandlers.getCurrentSailingSlot(
      request,
      h
    );

    expect(response.code).toBe(HTTP_STATUS.OK);
    expect(response.source.currentSailingSlot).toBeNull();
  });
});
