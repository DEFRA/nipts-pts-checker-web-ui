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
  validateDateRange 
} from "../../../../../web/component/checker/currentsailing/validate.js";
import { HttpStatusCode } from "axios";

jest.mock("../../../../../api/services/currentSailingMainService.js");
jest.mock("../../../../../web/component/checker/currentsailing/validate.js");


const ROUTES = {
  BIRKENHEAD: 'Birkenhead to Belfast (Stena)',
  CAIRNRYAN: 'Cairnryan to Larne (P&O)',
  LOCH_RYAN: 'Loch Ryan to Belfast (Stena)'
};


const VIEW_PATH = "componentViews/checker/currentsailing/currentsailingView";
const ERROR_MESSAGES = {
  routeOptionError: "Select if you are checking a ferry or a flight",
  routeError: "Select the ferry you are checking",
  flightNoEmptyError: "Enter the flight number. For example, RK 103",
  departureDateRequiredError: "Enter the scheduled departure date, for example 27 3 2024",
  departureDateFormatError: "Enter the date in the correct format, for example 27 3 2024",
  timeError: "Enter the scheduled departure time, for example 15:30",
  labelError: "Error:",
  genericError: "Validation errors occurred"
};

const sailingRoutesDefault = [
  { id: '1', value: ROUTES.BIRKENHEAD, label: ROUTES.BIRKENHEAD },
  { id: '2', value: ROUTES.CAIRNRYAN, label: ROUTES.CAIRNRYAN },
  { id: '3', value: ROUTES.LOCH_RYAN, label: ROUTES.LOCH_RYAN }
];

describe("Handler", () => {
  describe("getCurrentSailings", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return 403 error view when organisationId is missing", async () => {
      const request = {
        yar: {
          get: jest.fn().mockReturnValue(""),
          set: jest.fn(),
        },
      };

      const h = {
        view: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnValue({
            takeover: jest.fn(),
          }),
        }),
      };

      await CurrentSailingHandlers.getCurrentSailings(request, h);

      expect(request.yar.get).toHaveBeenCalledWith("organisationId");
      expect(h.view).toHaveBeenCalledWith("errors/403Error");
      expect(h.view().code).toHaveBeenCalledWith(403);
      expect(h.view().code().takeover).toHaveBeenCalled();
    });

    it("should return 403 error view when organisationId is null", async () => {
      const request = {
        yar: {
          get: jest.fn().mockReturnValue(null),
          set: jest.fn(),
        },
      };

      const h = {
        view: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnValue({
            takeover: jest.fn(),
          }),
        }),
      };

      await CurrentSailingHandlers.getCurrentSailings(request, h);

      expect(request.yar.get).toHaveBeenCalledWith("organisationId");
      expect(h.view).toHaveBeenCalledWith("errors/403Error");
      expect(h.view().code).toHaveBeenCalledWith(403);
      expect(h.view().code().takeover).toHaveBeenCalled();
    });

    it("should successfully set data in session and return view with currentSailingMainModelData", async () => {
      const mockData = {
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

      currentSailingMainService.getCurrentSailingMain.mockResolvedValue(
        mockData
      );

      const request = {
        yar: {
          set: jest.fn(),
          get: jest.fn(() => "mockedOrganisationId"),
        },
      };

      const h = {
        view: jest.fn((viewPath, data) => {
          return { viewPath, data };
        }),
      };

      const londonTime = moment.tz("Europe/London");
      const departureDateDay = londonTime.format("DD");
      const departureDateMonth = londonTime.format("MM");
      const departureDateYear = londonTime.format("YYYY");

      const response = await CurrentSailingHandlers.getCurrentSailings(
        request,
        h
      );

      expect(request.yar.set).toHaveBeenCalledWith(
        "CurrentSailingModel",
        mockData
      );
      expect(request.yar.set).toHaveBeenCalledWith(
        "SailingRoutes",
        mockData.sailingRoutes
      );

      expect(response.viewPath).toBe(VIEW_PATH);
      expect(response.data).toEqual({
        currentSailingMainModelData: mockData,
        departureDateDay,
        departureDateMonth,
        departureDateYear,
      });
    });

    it("should handle case when getCurrentSailingMain returns null", async () => {
      currentSailingMainService.getCurrentSailingMain.mockResolvedValue(null);

      const request = {
        yar: {
          set: jest.fn(),
          get: jest.fn(() => "mockedOrganisationId"),
        },
      };

      const h = {
        view: jest.fn((viewPath, data) => {
          return { viewPath, data };
        }),
      };

      const londonTime = moment.tz("Europe/London");
      const departureDateDay = londonTime.format("DD");
      const departureDateMonth = londonTime.format("MM");
      const departureDateYear = londonTime.format("YYYY");

      const response = await CurrentSailingHandlers.getCurrentSailings(
        request,
        h
      );

      expect(request.yar.set).toHaveBeenCalledWith("CurrentSailingModel", {});
      expect(request.yar.set).toHaveBeenCalledWith("SailingRoutes", undefined);

      expect(response.viewPath).toBe(VIEW_PATH);
      expect(response.data).toEqual({
        currentSailingMainModelData: {},
        departureDateDay,
        departureDateMonth,
        departureDateYear,
      });
    });
  });
});

describe('Handler', () => {
  describe("index", () => {
    it("should return view with currentSailingMainModelData", async () => {
      const mockData = {
        pageHeading: "What route are you checking?",
        serviceName: "Pet Travel Scheme: Check a pet travelling from Great Britain to Northern Ireland",
        routeSubHeading: "Route",
        routes: sailingRoutesDefault,
        sailingTimeSubHeading: "Scheduled sailing time",
        sailingHintText1: "Use the 24-hour clock - for example, 15:30.",
        sailingHintText2: "For midday, use 12:00. For midnight, use 23:59.",
        sailingTimes: ["", "00", "01"],
      };

      currentSailingMainService.getCurrentSailingMain.mockResolvedValue(mockData);

      const request = {
        yar: {
          set: jest.fn(),
          get: jest.fn(() => "mockedOrganisationId"),
        },
      };

      const h = {
        view: jest.fn((viewPath, data) => {
          return { viewPath, data };
        }),
      };

      const londonTime = moment.tz("Europe/London");
      const departureDateDay = londonTime.format("DD");
      const departureDateMonth = londonTime.format("MM");
      const departureDateYear = londonTime.format("YYYY");

      const response = await CurrentSailingHandlers.getCurrentSailings(request, h);

      expect(response.viewPath).toBe(VIEW_PATH);
      expect(response.data).toEqual({
        currentSailingMainModelData: mockData,
        departureDateDay,
        departureDateMonth,
        departureDateYear,
      });
      expect(h.view).toHaveBeenCalledWith(VIEW_PATH, {
        currentSailingMainModelData: mockData,
        departureDateDay,
        departureDateMonth,
        departureDateYear,
      });
    });
  });
});

describe("submitCurrentSailingSlot", () => {
  it("should set the sailing slot in the session and redirect to the dashboard", async () => {
    const mockPayload = {
      routeOption: "1",
      routeRadio: "1",
      sailingHour: "12",
      sailingMinutes: "30",
      departureDateDay: "1",
      departureDateMonth: "1",
      departureDateYear: "2024",
      routeFlight: "",
    };
    const departureDateDayPadded =
      mockPayload.departureDateDay.length === 1
        ? "0" + mockPayload.departureDateDay
        : mockPayload.departureDateDay;
    const departureDateMonthPadded =
      mockPayload.departureDateMonth.length === 1
        ? "0" + mockPayload.departureDateMonth
        : mockPayload.departureDateMonth;

    const departureDate = `${departureDateDayPadded.trim()}/${departureDateMonthPadded.trim()}/${mockPayload.departureDateYear.trim()}`;

    const sailingRoutes = sailingRoutesDefault;

    const routeOptions = [
      { id: "1", value: "Ferry", label: "Ferry", template: "ferryView.html" },
      {
        id: "2",
        value: "Flight",
        label: "Flight",
        template: "flightView.html",
      },
    ];

    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockRequest = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === "SailingRoutes") {
            return sailingRoutes;
          }
          if (key === "CurrentSailingModel") {
            return currentSailingMainModelData;
          }
          return null;
        }),
      },
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateRouteRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDate.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDateRange.mockReturnValue({
      isValid: true,
      error: null,
    });

    const mockRedirect = jest.fn();
    const mockResponseToolkit = {
      redirect: mockRedirect,
    };

    const expectedSailingSlot = {
      sailingHour: mockPayload.sailingHour,
      sailingMinutes: mockPayload.sailingMinutes,
      selectedRoute: {
        id: "1",
        value: ROUTES.BIRKENHEAD,
        label: ROUTES.BIRKENHEAD,
      },
      departureDate,
      selectedRouteOption: routeOptions[0],
      routeFlight: mockPayload.routeFlight,
    };

    await CurrentSailingHandlers.submitCurrentSailingSlot(
      mockRequest,
      mockResponseToolkit
    );

    expect(mockRequest.yar.set).toHaveBeenCalledWith(
      "currentSailingSlot",
      expectedSailingSlot
    );
    expect(mockRedirect).toHaveBeenCalledWith("/checker/dashboard");
  });

  it("should handle and return error for flight or ferry radio option not selected", async () => {
    const routeOptions = [
      { id: "1", value: "Ferry", label: "Ferry", template: "ferryView.html" },
      {
        id: "2",
        value: "Flight",
        label: "Flight",
        template: "flightView.html",
      },
    ];

    const sailingRoutes = sailingRoutesDefault;
    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockPayload = {
      routeOption: undefined,
      routeRadio: "1",
      sailingHour: "12",
      sailingMinutes: "30",
      departureDateDay: "1",
      departureDateMonth: "1",
      departureDateYear: "2024",
      routeFlight: "12345",
    };

    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === "SailingRoutes") {
            return sailingRoutes;
          }
          if (key === "CurrentSailingModel") {
            return currentSailingMainModelData;
          }
          return null;
        }),
      },
    };

    const h = {
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: false,
      error: ERROR_MESSAGES.routeOptionError,
    });

    validateRouteRadio.mockReturnValue({
      isValid: false,
      error: "Select a route",
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDate.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDateRange.mockReturnValue({
      isValid: true,
      error: null,
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(VIEW_PATH, {
      errorRouteOptionRadio: ERROR_MESSAGES.routeOptionError,
      errorRouteRadio: null,
      errorFlight: null,
      errorDepartureDate: null,
      errorSailingHour: null,
      errorSailingMinutes: null,
      errorSummary: [
        { fieldId: "routeOption", message: ERROR_MESSAGES.routeOptionError },
      ],
      formSubmitted: true,
      currentSailingMainModelData,
      routeRadio: mockPayload.routeRadio,
      sailingHour: mockPayload.sailingHour,
      sailingMinutes: mockPayload.sailingMinutes,
      routeOption: mockPayload.routeoption,
      routeFlight: mockPayload.routeFlight,
      departureDateDay: mockPayload.departureDateDay,
      departureDateMonth: mockPayload.departureDateMonth,
      departureDateYear: mockPayload.departureDateYear,
      errorDateRangeDate: null,
      errorDateRangeTime: null,
    });
  });

  it("should handle and return error for ferry route not selected", async () => {
    const routeOptions = [
      { id: "1", value: "Ferry", label: "Ferry", template: "ferryView.html" },
      {
        id: "2",
        value: "Flight",
        label: "Flight",
        template: "flightView.html",
      },
    ];

    const sailingRoutes = sailingRoutesDefault;
    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockPayload = {
      routeOption: "1",
      routeRadio: null,
      sailingHour: "12",
      sailingMinutes: "30",
      departureDateDay: "1",
      departureDateMonth: "1",
      departureDateYear: "2024",
      routeFlight: "12345",
    };

    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === "SailingRoutes") {
            return sailingRoutes;
          }
          if (key === "CurrentSailingModel") {
            return currentSailingMainModelData;
          }
          return null;
        }),
      },
    };

    const mockResponseToolkit = {
      redirect: jest.fn().mockReturnValue({}),
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateRouteRadio.mockReturnValue({
      isValid: false,
      error: ERROR_MESSAGES.routeError,
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDate.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDateRange.mockReturnValue({
      isValid: true,
      error: null,
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(
      request,
      mockResponseToolkit
    );

    expect(mockResponseToolkit.view).toHaveBeenCalledWith(VIEW_PATH, {
      currentSailingMainModelData,
      departureDateDay: mockPayload.departureDateDay,
      departureDateMonth: mockPayload.departureDateMonth,
      departureDateYear: mockPayload.departureDateYear,
      errorDateRangeDate: null,
      errorDateRangeTime: null,
      errorDepartureDate: null,
      errorFlight: null,
      errorRouteOptionRadio: null,
      errorRouteRadio: ERROR_MESSAGES.routeError,
      errorSailingHour: null,
      errorSailingMinutes: null,
      errorSummary: [
        { fieldId: "routeRadio", message: ERROR_MESSAGES.routeError },
      ],
      formSubmitted: true,
      routeFlight: mockPayload.routeFlight,
      routeOption: mockPayload.routeOption,
      routeRadio: mockPayload.routeRadio,
      sailingHour: mockPayload.sailingHour,
      sailingMinutes: mockPayload.sailingMinutes,
    });
  });

  it("should handle and return error for flight when not entered", async () => {
    const routeOptions = [
      { id: "1", value: "Ferry", label: "Ferry", template: "ferryView.html" },
      {
        id: "2",
        value: "Flight",
        label: "Flight",
        template: "flightView.html",
      },
    ];

    const sailingRoutes = sailingRoutesDefault;
    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockPayload = {
      routeOption: "2",
      routeRadio: null,
      sailingHour: "12",
      sailingMinutes: "30",
      departureDateDay: "1",
      departureDateMonth: "1",
      departureDateYear: "2024",
      routeFlight: "",
    };

    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === "SailingRoutes") {
            return sailingRoutes;
          }
          if (key === "CurrentSailingModel") {
            return currentSailingMainModelData;
          }
          return null;
        }),
      },
    };

    const mockResponseToolkit = {
      redirect: jest.fn().mockReturnValue({}),
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateRouteRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateFlightNumber.mockReturnValue({
      isValid: false,
      error: ERROR_MESSAGES.flightNoEmptyError,
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDate.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDateRange.mockReturnValue({
      isValid: true,
      error: null,
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(
      request,
      mockResponseToolkit
    );

    expect(mockResponseToolkit.view).toHaveBeenCalledWith(VIEW_PATH, {
      currentSailingMainModelData,
      departureDateDay: mockPayload.departureDateDay,
      departureDateMonth: mockPayload.departureDateMonth,
      departureDateYear: mockPayload.departureDateYear,
      errorDateRangeDate: null,
      errorDateRangeTime: null,
      errorDepartureDate: null,
      errorFlight: ERROR_MESSAGES.flightNoEmptyError,
      errorRouteOptionRadio: null,
      errorRouteRadio: null,
      errorSailingHour: null,
      errorSailingMinutes: null,
      errorSummary: [
        { fieldId: "routeFlight", message: ERROR_MESSAGES.flightNoEmptyError },
      ],
      formSubmitted: true,
      routeFlight: mockPayload.routeFlight,
      routeOption: mockPayload.routeOption,
      routeRadio: mockPayload.routeRadio,
      sailingHour: mockPayload.sailingHour,
      sailingMinutes: mockPayload.sailingMinutes,
    });
  });

  it("should handle and return errors for ferry route not selected and departure date being empty", async () => {
    const routeOptions = [
      { id: "1", value: "Ferry", label: "Ferry", template: "ferryView.html" },
      {
        id: "2",
        value: "Flight",
        label: "Flight",
        template: "flightView.html",
      },
    ];

    const sailingRoutes = sailingRoutesDefault;
    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockPayload = {
      routeOption: "1",
      routeRadio: null,
      sailingHour: "12",
      sailingMinutes: "30",
      departureDateDay: "",
      departureDateMonth: "1",
      departureDateYear: "2024",
      routeFlight: "12345",
    };

    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === "SailingRoutes") {
            return sailingRoutes;
          }
          if (key === "CurrentSailingModel") {
            return currentSailingMainModelData;
          }
          return null;
        }),
      },
    };

    const mockResponseToolkit = {
      redirect: jest.fn().mockReturnValue({}),
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateRouteRadio.mockReturnValue({
      isValid: false,
      error: ERROR_MESSAGES.routeError,
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDate.mockReturnValue({
      isValid: false,
      error: ERROR_MESSAGES.departureDateRequiredError,
    });

    validateDateRange.mockReturnValue({
      isValid: true,
      error: null,
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(
      request,
      mockResponseToolkit
    );

    expect(mockResponseToolkit.view).toHaveBeenCalledWith(VIEW_PATH, {
      currentSailingMainModelData,
      departureDateDay: mockPayload.departureDateDay,
      departureDateMonth: mockPayload.departureDateMonth,
      departureDateYear: mockPayload.departureDateYear,
      errorDepartureDate: ERROR_MESSAGES.departureDateRequiredError,
      errorDateRangeDate: null,
      errorDateRangeTime: null,
      errorFlight: null,
      errorRouteOptionRadio: null,
      errorRouteRadio: ERROR_MESSAGES.routeError,
      errorSailingHour: null,
      errorSailingMinutes: null,
      errorSummary: [
        { fieldId: "routeRadio", message: ERROR_MESSAGES.routeError },
        {
          fieldId: "departureDateDay",
          message: ERROR_MESSAGES.departureDateRequiredError,
        },
      ],
      formSubmitted: true,
      routeFlight: mockPayload.routeFlight,
      routeOption: mockPayload.routeOption,
      routeRadio: mockPayload.routeRadio,
      sailingHour: mockPayload.sailingHour,
      sailingMinutes: mockPayload.sailingMinutes,
    });
  });

  it("should handle and return errors for ferry route not selected and invalid departure date", async () => {
    const routeOptions = [
      { id: "1", value: "Ferry", label: "Ferry", template: "ferryView.html" },
      {
        id: "2",
        value: "Flight",
        label: "Flight",
        template: "flightView.html",
      },
    ];

    const sailingRoutes = sailingRoutesDefault;
    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockPayload = {
      routeOption: "1",
      routeRadio: null,
      sailingHour: "12",
      sailingMinutes: "30",
      departureDateDay: "33",
      departureDateMonth: "1",
      departureDateYear: "2024",
      routeFlight: "12345",
    };

    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === "SailingRoutes") {
            return sailingRoutes;
          }
          if (key === "CurrentSailingModel") {
            return currentSailingMainModelData;
          }
          return null;
        }),
      },
    };

    const mockResponseToolkit = {
      redirect: jest.fn().mockReturnValue({}),
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateRouteRadio.mockReturnValue({
      isValid: false,
      error: ERROR_MESSAGES.routeError,
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDate.mockReturnValue({
      isValid: false,
      error: ERROR_MESSAGES.departureDateFormatError,
    });

    validateDateRange.mockReturnValue({
      isValid: true,
      error: null,
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(
      request,
      mockResponseToolkit
    );

    expect(mockResponseToolkit.view).toHaveBeenCalledWith(VIEW_PATH, {
      currentSailingMainModelData,
      departureDateDay: mockPayload.departureDateDay,
      departureDateMonth: mockPayload.departureDateMonth,
      departureDateYear: mockPayload.departureDateYear,
      errorDepartureDate: ERROR_MESSAGES.departureDateFormatError,
      errorDateRangeDate: null,
      errorDateRangeTime: null,
      errorFlight: null,
      errorRouteOptionRadio: null,
      errorRouteRadio: ERROR_MESSAGES.routeError,
      errorSailingHour: null,
      errorSailingMinutes: null,
      errorSummary: [
        { fieldId: "routeRadio", message: ERROR_MESSAGES.routeError },
        {
          fieldId: "departureDateDay",
          message: ERROR_MESSAGES.departureDateFormatError,
        },
      ],
      formSubmitted: true,
      routeFlight: mockPayload.routeFlight,
      routeOption: mockPayload.routeOption,
      routeRadio: mockPayload.routeRadio,
      sailingHour: mockPayload.sailingHour,
      sailingMinutes: mockPayload.sailingMinutes,
    });
  });

  it("should handle and return errors for ferry route not selected and invalid departure date and time error", async () => {
    const routeOptions = [
      { id: "1", value: "Ferry", label: "Ferry", template: "ferryView.html" },
      {
        id: "2",
        value: "Flight",
        label: "Flight",
        template: "flightView.html",
      },
    ];

    const sailingRoutes = sailingRoutesDefault;
    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockPayload = {
      routeOption: "1",
      routeRadio: null,
      sailingHour: "",
      sailingMinutes: "30",
      departureDateDay: "33",
      departureDateMonth: "1",
      departureDateYear: "2024",
      routeFlight: "12345",
    };

    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === "SailingRoutes") {
            return sailingRoutes;
          }
          if (key === "CurrentSailingModel") {
            return currentSailingMainModelData;
          }
          return null;
        }),
      },
    };

    const mockResponseToolkit = {
      redirect: jest.fn().mockReturnValue({}),
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateRouteRadio.mockReturnValue({
      isValid: false,
      error: ERROR_MESSAGES.routeError,
    });

    validateSailingHour.mockReturnValue({
      isValid: false,
      error: ERROR_MESSAGES.timeError,
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDate.mockReturnValue({
      isValid: false,
      error: ERROR_MESSAGES.departureDateFormatError,
    });

    validateDateRange.mockReturnValue({
      isValid: true,
      error: null,
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(
      request,
      mockResponseToolkit
    );

    expect(mockResponseToolkit.view).toHaveBeenCalledWith(VIEW_PATH, {
      currentSailingMainModelData,
      departureDateDay: mockPayload.departureDateDay,
      departureDateMonth: mockPayload.departureDateMonth,
      departureDateYear: mockPayload.departureDateYear,
      errorDateRangeDate: null,
      errorDateRangeTime: null,
      errorDepartureDate: ERROR_MESSAGES.departureDateFormatError,
      errorFlight: null,
      errorRouteOptionRadio: null,
      errorRouteRadio: ERROR_MESSAGES.routeError,
      errorSailingHour: ERROR_MESSAGES.timeError,
      errorSailingMinutes: null,
      errorSummary: [
        { fieldId: "routeRadio", message: ERROR_MESSAGES.routeError },
        {
          fieldId: "departureDateDay",
          message: ERROR_MESSAGES.departureDateFormatError,
        },
        { fieldId: "sailingHour", message: ERROR_MESSAGES.timeError },
      ],
      formSubmitted: true,
      routeFlight: mockPayload.routeFlight,
      routeOption: mockPayload.routeOption,
      routeRadio: mockPayload.routeRadio,
      sailingHour: mockPayload.sailingHour,
      sailingMinutes: mockPayload.sailingMinutes,
    });
  });

  it("should handle and return error for date range being invalid", async () => {
    const routeOptions = [
      { id: "1", value: "Ferry", label: "Ferry", template: "ferryView.html" },
      {
        id: "2",
        value: "Flight",
        label: "Flight",
        template: "flightView.html",
      },
    ];

    const sailingRoutes = sailingRoutesDefault;
    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockPayload = {
      routeOption: "1",
      routeRadio: null,
      sailingHour: "12",
      sailingMinutes: "30",
      departureDateDay: "1",
      departureDateMonth: "1",
      departureDateYear: "2024",
      routeFlight: "12345",
    };

    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === "SailingRoutes") {
            return sailingRoutes;
          }
          if (key === "CurrentSailingModel") {
            return currentSailingMainModelData;
          }
          return null;
        }),
      },
    };

    const mockResponseToolkit = {
      redirect: jest.fn().mockReturnValue({}),
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateRouteRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDate.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateDateRange.mockReturnValue({
      isValid: false,
      error: ERROR_MESSAGES.errorDateRangeDate,
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(
      request,
      mockResponseToolkit
    );

    expect(mockResponseToolkit.view).toHaveBeenCalledWith(VIEW_PATH, {
      currentSailingMainModelData,
      departureDateDay: mockPayload.departureDateDay,
      departureDateMonth: mockPayload.departureDateMonth,
      departureDateYear: mockPayload.departureDateYear,
      errorDateRangeDate: null,
      errorDateRangeTime: null,
      errorDepartureDate: null,
      errorFlight: null,
      errorRouteOptionRadio: null,
      errorRouteRadio: null,
      errorSailingHour: null,
      errorSailingMinutes: null,
      errorSummary: [
        {
          fieldId: "departureDateDay",
          message: ERROR_MESSAGES.errorDateRangeDate,
        },
      ],
      formSubmitted: true,
      routeFlight: mockPayload.routeFlight,
      routeOption: mockPayload.routeOption,
      routeRadio: mockPayload.routeRadio,
      sailingHour: mockPayload.sailingHour,
      sailingMinutes: mockPayload.sailingMinutes,
    });
  });
});

describe("getCurrentSailingSlot", () => {
  it("should retrieve the currentSailingSlot from session", async () => {
    const mockRequest = {
      yar: {
        get: jest.fn().mockReturnValue("testSlot"),
      },
    };
    const mockResponseToolkit = {
      response: jest.fn((value) => ({
        code: 200,
        source: value,
      })),
    };

    const response = await CurrentSailingHandlers.getCurrentSailingSlot(
      mockRequest,
      mockResponseToolkit
    );

    expect(mockRequest.yar.get).toHaveBeenCalledWith("currentSailingSlot");
    expect(mockResponseToolkit.response).toHaveBeenCalledWith({
      message: "Retrieved Route details slot",
      currentSailingSlot: "testSlot",
    });
    expect(response.code).toBe(HttpStatusCode.Ok);
    expect(response.source).toEqual({
      message: "Retrieved Route details slot",
      currentSailingSlot: "testSlot",
    });
  });
});