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

jest.mock("../../../../../api/services/currentSailingMainService.js", () => ({
  getCurrentSailingMain: jest.fn(),
}));

jest.mock("../../../../../web/component/checker/currentsailing/validate.js");

const ROUTES = {
  BIRKENHEAD: "Birkenhead to Belfast (Stena)",
  CAIRNRYAN: "Cairnryan to Larne (P&O)",
  LOCH_RYAN: "Loch Ryan to Belfast (Stena)",
};

const ROUTE_SLOT = {
  RET_SLOT: "Retrieved Route details slot"
};



const DATE = {
  DEP_DATE: "01/01/2024",
  RANGE: "Date range error",
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
  {
    id: "2",
    value: "Flight",
    label: "Flight",
    template: HTML.FLIGHT_VIEW_HTML,
  },
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
        return (
          options.yar?.currentSailingModel || {
            routeOptions: routeOptionsDefault,
            sailingRoutes: sailingRoutesDefault,
          }
        );
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

const createMockPayload = (overrides = {}, excludeFields=[]) => {
  
  const obj = {
    routeOption: "1",
    routeRadio: "1",
    sailingHour: "12",
    sailingMinutes: "30",
    departureDateDay: "1",
    departureDateMonth: "1",
    departureDateYear: "2024",
    routeFlight: "",
    ...overrides,
  }

  for (const field of excludeFields) {
    delete obj[field]
  }

  return obj
};

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

describe("getCurrentSailings Authorization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test("should return 403 for missing organisationId", async () => {
    const request = createMockRequest({ yar: { organisationId: "" } });
    const h = createMockH();
    await CurrentSailingHandlers.getCurrentSailings(request, h);
    expect(h.view).toHaveBeenCalledWith(ERROR_PATH);
    expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
  });

  test("should return 403 for null organisationId", async () => {
    const request = createMockRequest({ yar: { organisationId: null } });
    const h = createMockH();
    await CurrentSailingHandlers.getCurrentSailings(request, h);
    expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
  });

  test("should return 403 for whitespace organisationId", async () => {
    const request = createMockRequest({ yar: { organisationId: "   " } });
    const h = createMockH();
    await CurrentSailingHandlers.getCurrentSailings(request, h);
    expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
  });
});

describe("submitCurrentSailingSlot Route Option Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
  });

  test("should validate route option selection", async () => {
    const request = createMockRequest({
      payload: createMockPayload({}, ['routeOption']),
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
});

describe("submitCurrentSailingSlot Ferry Route Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
  });

  test("should validate ferry route selection", async () => {
    const request = createMockRequest({
      payload: createMockPayload({}, ['routeRadio']),
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
});

describe("submitCurrentSailingSlot Flight Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
  });

  test("should validate flight number", async () => {
    const request = createMockRequest({
      payload: createMockPayload({
        routeOption: "2",
        routeFlight: "",
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
      })
    );
  });
});

describe("submitCurrentSailingSlot Time Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
  });

  test("should validate sailing hours", async () => {
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

  test("should validate sailing minutes", async () => {
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
      })
    );
  });
});

describe("submitCurrentSailingSlot Date Format Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
  });

  test("should validate date format", async () => {
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
      })
    );
  });
});

describe("submitCurrentSailingSlot Date Range Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
  });

  test("should validate date range", async () => {
    const request = createMockRequest({
      payload: createMockPayload(),
    });
    const h = createMockH();
    setupValidationMocks({
      dateRange: { isValid: false, error: DATE.RANGE },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);
    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorSummary: expect.arrayContaining([
          { fieldId: "departureDateDay", message: DATE.RANGE },
        ]),
      })
    );
  });

  test("should skip date range validation for invalid date", async () => {
    const request = createMockRequest({
      payload: createMockPayload({ departureDateDay: "32" }),
    });
    const h = createMockH();
    setupValidationMocks({
      date: { isValid: false, error: ERROR_MESSAGES.departureDateFormatError },
      dateRange: { isValid: false, error: DATE.RANGE },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);
    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorDepartureDate: ERROR_MESSAGES.departureDateFormatError,
        errorDateRangeDate: null,
        errorDateRangeTime: null,
      })
    );
  });
});

describe("submitCurrentSailingSlot Ferry Success", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
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

    expect(request.yar.set).toHaveBeenCalledWith(
      "currentSailingSlot",
      expect.objectContaining({
        sailingHour: "12",
        sailingMinutes: "30",
        selectedRoute: sailingRoutesDefault[0],
        departureDate: DATE.DEP_DATE,
        selectedRouteOption: routeOptions[0],
      })
    );
    expect(h.redirect).toHaveBeenCalledWith(DASHBOARD_PATH);
  });
});

describe("submitCurrentSailingSlot Flight Success", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
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
      }, ['routeRadio']),
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
      departureDate: DATE.DEP_DATE,
      selectedRouteOption: routeOptions[1],
      routeFlight: "RK103",
    });
    expect(h.redirect).toHaveBeenCalledWith(DASHBOARD_PATH);
  });
});

describe("submitCurrentSailingSlot Edge Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
  });

  test("should handle empty route options", async () => {
    // Mock validation to simulate route option validation failure
    setupValidationMocks({
      routeOption: { isValid: false, error: ERROR_MESSAGES.routeOptionError },
    });

    const request = createMockRequest({
      payload: createMockPayload(),
      yar: {
        currentSailingModel: {
          routeOptions: [], // Empty route options
          sailingRoutes: sailingRoutesDefault,
        },
      },
    });

    const h = createMockH();

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    // Verify that the view is called with appropriate error messages
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

    expect(request.yar.set).toHaveBeenCalledWith(
      "currentSailingSlot",
      expect.objectContaining({
        departureDate: DATE.DEP_DATE,
        routeFlight: "",
        sailingHour: "12",
        sailingMinutes: "30",
        selectedRoute: expect.any(Object),
        selectedRouteOption: expect.any(Object),
      })
    );
    expect(h.redirect).toHaveBeenCalledWith(DASHBOARD_PATH);
  });
});

describe("getCurrentSailingSlot", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      message: ROUTE_SLOT.RET_SLOT,
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
      message: ROUTE_SLOT.RET_SLOT,
      currentSailingSlot: null,
    });
  });

  test("should handle undefined sailing slot", async () => {
    const request = createMockRequest({ yar: {} });
    const h = createMockH();

    const response = await CurrentSailingHandlers.getCurrentSailingSlot(
      request,
      h
    );

    expect(response.code).toBe(HTTP_STATUS.OK);
    expect(response.source).toEqual({
      message: ROUTE_SLOT.RET_SLOT,
    });
  });
});

describe("submitCurrentSailingSlot Error Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupValidationMocks();
  });

  test("should handle validation errors gracefully", async () => {
    const request = createMockRequest({
      payload: createMockPayload({
        sailingHour: "25",
        sailingMinutes: "61",
      }, ['routeOption']),
    });
    const h = createMockH();

    setupValidationMocks({
      routeOption: { isValid: false, error: ERROR_MESSAGES.routeOptionError },
      sailingHour: { isValid: false, error: ERROR_MESSAGES.timeError },
      sailingMinutes: { isValid: false, error: ERROR_MESSAGES.timeError },
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        errorRouteOptionRadio: ERROR_MESSAGES.routeOptionError,
        errorSailingHour: ERROR_MESSAGES.timeError,
        errorSailingMinutes: ERROR_MESSAGES.timeError,
        formSubmitted: true,
      })
    );
  });
});



test("should handle date range validation failure", async () => {
  const request = createMockRequest({
    payload: createMockPayload(),
  });
  const h = createMockH();

  setupValidationMocks({
    date: { isValid: true, error: null },
    dateRange: { isValid: false, error: DATE.RANGE }
  });

  await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);
  expect(h.view).toHaveBeenCalledWith(
    VIEW_PATH,
    expect.objectContaining({
      errorSummary: expect.arrayContaining([
        { fieldId: "departureDateDay", message: DATE.RANGE },
      ])
    })
  );
});


describe("getCurrentSailings Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should handle empty sailing routes", async () => {
    const request = createMockRequest({
      yar: {
        organisationId: "123",
      },
    });
    const h = createMockH();

    jest.spyOn(currentSailingMainService, 'getCurrentSailingMain')
      .mockResolvedValue({
        sailingRoutes: [],
        routeOptions: []
      });

    await CurrentSailingHandlers.getCurrentSailings(request, h);
    expect(request.yar.set).toHaveBeenCalledWith("SailingRoutes", []);
  });

  test("should handle null service response", async () => {
    const request = createMockRequest({
      yar: {
        organisationId: "123",
      },
    });
    const h = createMockH();

    jest.spyOn(currentSailingMainService, 'getCurrentSailingMain')
      .mockResolvedValue(null);

    await CurrentSailingHandlers.getCurrentSailings(request, h);
    expect(request.yar.set).toHaveBeenCalledWith("CurrentSailingModel", {});
  });
});


test("should handle invalid flight number format", async () => {
  const request = createMockRequest({
    payload: createMockPayload({
      routeOption: "2",
      routeFlight: "INVALIDFLIGHT123",
    }),
  });
  const h = createMockH();
  
  setupValidationMocks({
    flightNumber: { 
      isValid: false, 
      error: ERROR_MESSAGES.flightNoEmptyError
    },
  });

  await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);
  expect(h.view).toHaveBeenCalledWith(
    VIEW_PATH,
    expect.objectContaining({
      errorFlight: ERROR_MESSAGES.flightNoEmptyError,
      formSubmitted: true,
    })
  );
});

test("should handle invalid date format correctly", async () => {
  const request = createMockRequest({
    payload: createMockPayload({
      departureDateDay: "invalid",
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
      errorDateRangeDate: null,
      errorDateRangeTime: null,
    })
  );
});
