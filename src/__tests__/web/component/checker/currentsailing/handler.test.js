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
import { HttpStatusCode } from "axios";

jest.mock("../../../../../api/services/currentSailingMainService.js");
jest.mock("../../../../../web/component/checker/currentsailing/validate.js");

// Constants moved to separate file or kept at top level
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

// Helper functions for creating test objects
const createMockRequest = (organisationId, payload = {}) => ({
  yar: {
    get: jest.fn().mockReturnValue(organisationId),
    set: jest.fn(),
  },
  payload,
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

describe("Handler", () => {
  describe("getCurrentSailings", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("Authorization Tests", () => {
      it("should return 403 error view when organisationId is missing", async () => {
        const request = createMockRequest("");
        const h = createMockH();

        await CurrentSailingHandlers.getCurrentSailings(request, h);

        expect(request.yar.get).toHaveBeenCalledWith("organisationId");
        expect(h.view).toHaveBeenCalledWith("errors/403Error");
        expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
        expect(h.view().code().takeover).toHaveBeenCalled();
      });

      it("should return 403 error view when organisationId is null", async () => {
        const request = createMockRequest(null);
        const h = createMockH();

        await CurrentSailingHandlers.getCurrentSailings(request, h);

        expect(request.yar.get).toHaveBeenCalledWith("organisationId");
        expect(h.view).toHaveBeenCalledWith("errors/403Error");
        expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
        expect(h.view().code().takeover).toHaveBeenCalled();
      });
    });

    describe("Successful Data Retrieval Tests", () => {
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

      it("should successfully set data in session and return view with currentSailingMainModelData", async () => {
        const request = createMockRequest("validOrganizationId");
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
        expect(response.viewPath).toBe(VIEW_PATH);
        expect(response.data).toEqual({
          currentSailingMainModelData: mockMainServiceData,
          ...expectedDates,
        });
      });

      it("should handle case when getCurrentSailingMain returns null", async () => {
        const request = createMockRequest("validOrganizationId");
        const h = {
          view: jest.fn((viewPath, data) => ({ viewPath, data })),
        };

        currentSailingMainService.getCurrentSailingMain.mockResolvedValue(null);

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

        expect(request.yar.set).toHaveBeenCalledWith("CurrentSailingModel", {});
        expect(request.yar.set).toHaveBeenCalledWith(
          "SailingRoutes",
          undefined
        );
        expect(response.viewPath).toBe(VIEW_PATH);
        expect(response.data).toEqual({
          currentSailingMainModelData: {},
          ...expectedDates,
        });
      });
    });
  });

  describe("Submit Current Sailing Slot", () => {
    describe("Successful Submission", () => {
      it("should set the sailing slot in the session and redirect to the dashboard", async () => {
        const mockPayload = createMockPayload();
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

        const request = {
          payload: mockPayload,
          yar: {
            set: jest.fn(),
            get: jest.fn((key) => {
              if (key === "SailingRoutes") return sailingRoutesDefault;
              if (key === "CurrentSailingModel")
                return { sailingRoutes: sailingRoutesDefault, routeOptions };
              return null;
            }),
          },
        };

        const h = { redirect: jest.fn() };

        // Mock all validations to pass
        validateRouteOptionRadio.mockReturnValue({
          isValid: true,
          error: null,
        });
        validateRouteRadio.mockReturnValue({ isValid: true, error: null });
        validateSailingHour.mockReturnValue({ isValid: true, error: null });
        validateSailingMinutes.mockReturnValue({ isValid: true, error: null });
        validateFlightNumber.mockReturnValue({ isValid: true, error: null });
        validateDate.mockReturnValue({ isValid: true, error: null });
        validateDateRange.mockReturnValue({ isValid: true, error: null });

        await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

        expect(request.yar.set).toHaveBeenCalledWith(
          "currentSailingSlot",
          expect.objectContaining({
            sailingHour: mockPayload.sailingHour,
            sailingMinutes: mockPayload.sailingMinutes,
            selectedRoute: expect.any(Object),
            departureDate: expect.any(String),
            selectedRouteOption: expect.any(Object),
            routeFlight: mockPayload.routeFlight,
          })
        );
        expect(h.redirect).toHaveBeenCalledWith("/checker/dashboard");
      });
    });

    describe("Validation Error Cases", () => {
      const setupBaseRequest = (payload) => ({
        payload,
        yar: {
          set: jest.fn(),
          get: jest.fn().mockReturnValue({
            routeOptions: [
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
            ],
            sailingRoutes: sailingRoutesDefault,
          }),
        },
      });

      it("should handle and return error for flight or ferry radio option not selected", async () => {
        const mockPayload = createMockPayload({ routeOption: undefined });
        const request = setupBaseRequest(mockPayload);
        const h = { view: jest.fn() };

        validateRouteOptionRadio.mockReturnValue({
          isValid: false,
          error: ERROR_MESSAGES.routeOptionError,
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

      it("should handle and return error for ferry route not selected", async () => {
        const mockPayload = createMockPayload({
          routeOption: "1",
          routeRadio: null,
        });
        const request = setupBaseRequest(mockPayload);
        const h = { view: jest.fn() };

        validateRouteOptionRadio.mockReturnValue({
          isValid: true,
          error: null,
        });
        validateRouteRadio.mockReturnValue({
          isValid: false,
          error: ERROR_MESSAGES.routeError,
        });

        await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

        expect(h.view).toHaveBeenCalledWith(
          VIEW_PATH,
          expect.objectContaining({
            errorRouteRadio: ERROR_MESSAGES.routeError,
            errorSummary: [
              { fieldId: "routeRadio", message: ERROR_MESSAGES.routeError },
            ],
          })
        );
      });

      it("should handle and return error for flight when not entered", async () => {
        const mockPayload = createMockPayload({
          routeOption: "2",
          routeFlight: "",
          routeRadio: null,
        });
        const request = setupBaseRequest(mockPayload);
        const h = { view: jest.fn() };

        validateRouteOptionRadio.mockReturnValue({
          isValid: true,
          error: null,
        });
        validateRouteRadio.mockReturnValue({ isValid: true, error: null });
        validateFlightNumber.mockReturnValue({
          isValid: false,
          error: ERROR_MESSAGES.flightNoEmptyError,
        });

        await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

        expect(h.view).toHaveBeenCalledWith(
          VIEW_PATH,
          expect.objectContaining({
            errorFlight: ERROR_MESSAGES.flightNoEmptyError,
            errorSummary: [
              {
                fieldId: "routeFlight",
                message: ERROR_MESSAGES.flightNoEmptyError,
              },
            ],
          })
        );
      });

      it("should handle and return errors for ferry route not selected and departure date being empty", async () => {
        const mockPayload = createMockPayload({
          routeOption: "1",
          routeRadio: null,
          departureDateDay: "",
        });
        const request = setupBaseRequest(mockPayload);
        const h = { view: jest.fn() };

        validateRouteOptionRadio.mockReturnValue({
          isValid: true,
          error: null,
        });
        validateRouteRadio.mockReturnValue({
          isValid: false,
          error: ERROR_MESSAGES.routeError,
        });
        validateDate.mockReturnValue({
          isValid: false,
          error: ERROR_MESSAGES.departureDateRequiredError,
        });

        await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

        expect(h.view).toHaveBeenCalledWith(
          VIEW_PATH,
          expect.objectContaining({
            errorRouteRadio: ERROR_MESSAGES.routeError,
            errorDepartureDate: ERROR_MESSAGES.departureDateRequiredError,
            errorSummary: [
              { fieldId: "routeRadio", message: ERROR_MESSAGES.routeError },
              {
                fieldId: "departureDateDay",
                message: ERROR_MESSAGES.departureDateRequiredError,
              },
            ],
          })
        );
      });

      it("should handle and return errors for ferry route not selected and invalid departure date", async () => {
        const mockPayload = createMockPayload({
          routeOption: "1",
          routeRadio: null,
          departureDateDay: "33",
          departureDateMonth: "1",
          departureDateYear: "2024",
        });
        const request = setupBaseRequest(mockPayload);
        const h = { view: jest.fn() };

        validateRouteOptionRadio.mockReturnValue({
          isValid: true,
          error: null,
        });
        validateRouteRadio.mockReturnValue({
          isValid: false,
          error: ERROR_MESSAGES.routeError,
        });
        validateDate.mockReturnValue({
          isValid: false,
          error: ERROR_MESSAGES.departureDateFormatError,
        });

        await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

        expect(h.view).toHaveBeenCalledWith(
          VIEW_PATH,
          expect.objectContaining({
            errorRouteRadio: ERROR_MESSAGES.routeError,
            errorDepartureDate: ERROR_MESSAGES.departureDateFormatError,
            errorSummary: [
              { fieldId: "routeRadio", message: ERROR_MESSAGES.routeError },
              {
                fieldId: "departureDateDay",
                message: ERROR_MESSAGES.departureDateFormatError,
              },
            ],
          })
        );
      });

      it("should handle and return errors for ferry route not selected and invalid departure date and time error", async () => {
        const mockPayload = createMockPayload({
          routeOption: "1",
          routeRadio: null,
          departureDateDay: "33",
          departureDateMonth: "1",
          departureDateYear: "2024",
          sailingHour: "",
        });
        const request = setupBaseRequest(mockPayload);
        const h = { view: jest.fn() };

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
        validateDate.mockReturnValue({
          isValid: false,
          error: ERROR_MESSAGES.departureDateFormatError,
        });

        await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

        expect(h.view).toHaveBeenCalledWith(
          VIEW_PATH,
          expect.objectContaining({
            errorRouteRadio: ERROR_MESSAGES.routeError,
            errorDepartureDate: ERROR_MESSAGES.departureDateFormatError,
            errorSailingHour: ERROR_MESSAGES.timeError,
            errorSummary: [
              { fieldId: "routeRadio", message: ERROR_MESSAGES.routeError },
              {
                fieldId: "departureDateDay",
                message: ERROR_MESSAGES.departureDateFormatError,
              },
              { fieldId: "sailingHour", message: ERROR_MESSAGES.timeError },
            ],
          })
        );
      });

      it("should handle and return error for date range being invalid", async () => {
        const mockPayload = createMockPayload({
          routeOption: "1",
          routeRadio: null,
          departureDateDay: "1",
          departureDateMonth: "1",
          departureDateYear: "2024",
        });
        const request = setupBaseRequest(mockPayload);
        const h = { view: jest.fn() };

        validateRouteOptionRadio.mockReturnValue({
          isValid: true,
          error: null,
        });
        validateRouteRadio.mockReturnValue({ isValid: true, error: null });
        validateSailingHour.mockReturnValue({ isValid: true, error: null });
        validateSailingMinutes.mockReturnValue({ isValid: true, error: null });
        validateDate.mockReturnValue({ isValid: true, error: null });
        validateDateRange.mockReturnValue({
          isValid: false,
          error: ERROR_MESSAGES.errorDateRangeDate,
        });

        await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

        expect(h.view).toHaveBeenCalledWith(
          VIEW_PATH,
          expect.objectContaining({
            errorSummary: [
              {
                fieldId: "departureDateDay",
                message: ERROR_MESSAGES.errorDateRangeDate,
              },
            ],
          })
        );
      });
    });
  });

  describe("Get Current Sailing Slot", () => {
    it("should retrieve the currentSailingSlot from session", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("testSlot"),
        },
      };
      const mockResponseToolkit = {
        response: jest.fn((value) => ({
          code: HTTP_STATUS.OK,
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
      expect(response.code).toBe(HTTP_STATUS.OK);
      expect(response.source).toEqual({
        message: "Retrieved Route details slot",
        currentSailingSlot: "testSlot",
      });
    });
  });
});
