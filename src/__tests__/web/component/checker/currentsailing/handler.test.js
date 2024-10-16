import moment from "moment-timezone";
import { CurrentSailingHandlers } from "../../../../../web/component/checker/currentsailing/handler.js";
import currentSailingMainService from "../../../../../api/services/currentSailingMainService.js";
import { validateRouteOptionRadio, validateRouteRadio, validateSailingHour, validateSailingMinutes, validateFlightNumber, validateDate } from "../../../../../web/component/checker/currentsailing/validate.js";
import { HttpStatusCode } from "axios";

jest.mock("../../../../../api/services/currentSailingMainService.js");
jest.mock("../../../../../web/component/checker/currentsailing/validate.js");

const sailingRoutesDefault = [
  { id: '1', value: 'Birkenhead to Belfast (Stena)', label: 'Birkenhead to Belfast (Stena)' },
  { id: '2', value: 'Cairnryan to Larne (P&O)', label: 'Cairnryan to Larne (P&O)' },
  { id: '3', value: 'Loch Ryan to Belfast (Stena)', label: 'Loch Ryan to Belfast (Stena)' }
];

describe('Handler', () => {
  describe("index", () => {
    it('should return view with currentSailingMainModelData', async () => {
      const mockData = {
        pageHeading: "What route are you checking?",
        serviceName: "Pet Travel Scheme: Check a pet travelling from Great Britain to Northern Ireland",
        routeSubHeading: "Route",
        routes: sailingRoutesDefault,
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


      const londonTime = moment.tz("Europe/London");
      const departureDateDay = londonTime.format('DD');
      const departureDateMonth = londonTime.format('MM');
      const departureDateYear = londonTime.format('YYYY');

      const response = await CurrentSailingHandlers.getCurrentSailings(request, h);

      expect(response.viewPath).toBe("componentViews/checker/currentsailing/currentsailingView");
      expect(response.data).toEqual({
        currentSailingMainModelData: mockData, 
        departureDateDay,
        departureDateMonth,
        departureDateYear
      });
      expect(h.view).toHaveBeenCalledWith("componentViews/checker/currentsailing/currentsailingView", {
        currentSailingMainModelData: mockData, departureDateDay,
        departureDateMonth,
        departureDateYear
      });
    });
  });
});

describe('submitCurrentSailingSlot', () => {
  it('should set the sailing slot in the session and redirect to the dashboard', async () => {
    // Mock payload
    const mockPayload = {
      routeOption: '1',
      routeRadio: '1',
      sailingHour: '12',
      sailingMinutes: '30',
      departureDateDay: '1',
      departureDateMonth: '1',
      departureDateYear: '2024',
      routeFlight: '',
    };
    const departureDateDayPadded = mockPayload.departureDateDay.length === 1 ? '0' + mockPayload.departureDateDay : mockPayload.departureDateDay;
    const departureDateMonthPadded = mockPayload.departureDateMonth.length === 1 ? '0' + mockPayload.departureDateMonth : mockPayload.departureDateMonth;

    const departureDate = `${departureDateDayPadded.trim()}/${departureDateMonthPadded.trim()}/${mockPayload.departureDateYear.trim()}`;

    // Mock sailing routes stored in session
    const sailingRoutes = sailingRoutesDefault;

    const routeOptions = [
      { id: '1', value: 'Ferry', label: 'Ferry', template: 'ferryView.html' },
      { id: '2', value: 'Flight', label: 'Flight', template: 'flightView.html' }
    ];

    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    // Mock request object
    const mockRequest = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === 'SailingRoutes') {
            return sailingRoutes;  // Return the mock sailingRoutes array
          }
          if (key === 'CurrentSailingModel') {
            return currentSailingMainModelData;
          }
          return null;
        }),
      },
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null
    });

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

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null
    });

    validateDate.mockReturnValue({
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
      selectedRoute: { id: '1', value: 'Birkenhead to Belfast (Stena)', label: 'Birkenhead to Belfast (Stena)' },
      departureDate,
      selectedRouteOption: routeOptions[0],
      routeFlight: mockPayload.routeFlight,
    };


    // Invoke the handler
    await CurrentSailingHandlers.submitCurrentSailingSlot(mockRequest, mockResponseToolkit);

    // Assertions
    expect(mockRequest.yar.set).toHaveBeenCalledWith('CurrentSailingSlot', expectedSailingSlot);
    expect(mockRedirect).toHaveBeenCalledWith('/checker/dashboard');
  });

  it("should handle and return error for flight or ferry radio option not selected", async () => {
    const errors = {
      routeOptionError: "Select if you are checking a ferry or a flight",
      routeError: "Select the ferry you are checking",
      flightError: "Enter the flight number you are checking",
      departureDateRequiredError: "Enter the scheduled departure date, for example 27 3 2024",
      departureDateFormatError: "Enter the date in the correct format, for example 27 3 2024",
      timeError: "Enter the scheduled departure time, for example 15:30",
      labelError: "Error:",
      genericError: "Validation errors occurred",
    };

    const routeOptions = [
      { id: '1', value: 'Ferry', label: 'Ferry', template: 'ferryView.html' },
      { id: '2', value: 'Flight', label: 'Flight', template: 'flightView.html' }
    ];


    // Mock sailing routes stored in session
    const sailingRoutes = sailingRoutesDefault;

    const currentSailingMainModelData = { sailingRoutes, routeOptions };
    // Mock payload
    const mockPayload = {
      routeOption: undefined,
      routeRadio: '1',
      sailingHour: '12',
      sailingMinutes: '30',
      departureDateDay: '1',
      departureDateMonth: '1',
      departureDateYear: '2024',
      routeFlight: '12345',
    };

    // Mock request object
    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === 'SailingRoutes') {
            return sailingRoutes;  // Return the mock sailingRoutes array
          }
          if (key === 'CurrentSailingModel') {
            return currentSailingMainModelData;
          }
          return null;
        }),
      },
    };

    // Mock response toolkit
    const h = {
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: false,
      error: errors.routeOptionError
    });

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

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null
    });

    validateDate.mockReturnValue({
      isValid: true,
      error: null
    });


    await CurrentSailingHandlers.submitCurrentSailingSlot(request, h);

    expect(h.view).toHaveBeenCalledWith(
      "componentViews/checker/currentsailing/currentsailingView",
      {
        errorRouteOptionRadio: errors.routeOptionError,
        errorRouteRadio: null,
        errorFlight: null,
        errorDepartureDate: null,
        errorSailingHour: null,
        errorSailingMinutes: null,
        errorSummary: [
          { fieldId: "routeOption", message: errors.routeOptionError }
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
        departureDateYear: mockPayload.departureDateYear
      }
    );
  });

  it("should handle and return error for ferry route not selected", async () => {
    const errors = {
      routeOptionError: "Select if you are checking a ferry or a flight",
      routeError: "Select the ferry you are checking",
      flightError: "Enter the flight number you are checking",
      departureDateRequiredError: "Enter the scheduled departure date, for example 27 3 2024",
      departureDateFormatError: "Enter the date in the correct format, for example 27 3 2024",
      timeError: "Enter the scheduled departure time, for example 15:30",
      labelError: "Error:",
      genericError: "Validation errors occurred",
    };

    const routeOptions = [
      { id: '1', value: 'Ferry', label: 'Ferry', template: 'ferryView.html' },
      { id: '2', value: 'Flight', label: 'Flight', template: 'flightView.html' }
    ];

    const sailingRoutes = sailingRoutesDefault;

    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockPayload = {
      routeOption: '1',
      routeRadio: null,
      sailingHour: '12',
      sailingMinutes: '30',
      departureDateDay: '1',
      departureDateMonth: '1',
      departureDateYear: '2024',
      routeFlight: '12345',
    };

    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === 'SailingRoutes') return sailingRoutes;
          if (key === 'CurrentSailingModel') return currentSailingMainModelData;
          return null;
        }),
      },
    };

    // Mock response toolkit
    const mockResponseToolkit = {
      redirect: jest.fn().mockReturnValue({}),
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null
    });

    validateRouteRadio.mockReturnValue({
      isValid: false,
      error: errors.routeError,
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null
    });

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null
    });

    validateDate.mockReturnValue({
      isValid: true,
      error: null
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, mockResponseToolkit);

    expect(mockResponseToolkit.view).toHaveBeenCalledWith(
      "componentViews/checker/currentsailing/currentsailingView",
      {
        currentSailingMainModelData,
        departureDateDay: mockPayload.departureDateDay,
        departureDateMonth: mockPayload.departureDateMonth,
        departureDateYear: mockPayload.departureDateYear,
        errorDepartureDate: null,
        errorFlight: null,
        errorRouteOptionRadio: null,
        errorRouteRadio: errors.routeError,
        errorSailingHour: null,
        errorSailingMinutes: null,
        errorSummary: [
          { fieldId: "routeRadio", message: errors.routeError }
        ],
        formSubmitted: true,
        routeFlight: mockPayload.routeFlight,
        routeOption: mockPayload.routeOption,
        routeRadio: mockPayload.routeRadio,
        sailingHour: mockPayload.sailingHour,
        sailingMinutes: mockPayload.sailingMinutes,
      }
    );
  });

  it("should handle and return error for flight when not entered", async () => {
    const errors = {
      routeOptionError: "Select if you are checking a ferry or a flight",
      routeError: "Select the ferry you are checking",
      flightError: "Enter the flight number you are checking",
      departureDateRequiredError: "Enter the scheduled departure date, for example 27 3 2024",
      departureDateFormatError: "Enter the date in the correct format, for example 27 3 2024",
      timeError: "Enter the scheduled departure time, for example 15:30",
      labelError: "Error:",
      genericError: "Validation errors occurred",
    };

    const routeOptions = [
      { id: '1', value: 'Ferry', label: 'Ferry', template: 'ferryView.html' },
      { id: '2', value: 'Flight', label: 'Flight', template: 'flightView.html' }
    ];

    const sailingRoutes = sailingRoutesDefault;

    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockPayload = {
      routeOption: '2',
      routeRadio: null,
      sailingHour: '12',
      sailingMinutes: '30',
      departureDateDay: '1',
      departureDateMonth: '1',
      departureDateYear: '2024',
      routeFlight: '',
    };

    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === 'SailingRoutes') return sailingRoutes;
          if (key === 'CurrentSailingModel') return currentSailingMainModelData;
          return null;
        }),
      },
    };

    // Mock response toolkit
    const mockResponseToolkit = {
      redirect: jest.fn().mockReturnValue({}),
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null
    });

    validateRouteRadio.mockReturnValue({
      isValid: true,
      error: null,
    });

    validateFlightNumber.mockReturnValue({
      isValid: false,
      error: errors.flightError
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null
    });



    validateDate.mockReturnValue({
      isValid: true,
      error: null
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, mockResponseToolkit);

    expect(mockResponseToolkit.view).toHaveBeenCalledWith(
      "componentViews/checker/currentsailing/currentsailingView",
      {
        currentSailingMainModelData,
        departureDateDay: mockPayload.departureDateDay,
        departureDateMonth: mockPayload.departureDateMonth,
        departureDateYear: mockPayload.departureDateYear,
        errorDepartureDate: null,
        errorFlight: errors.flightError,
        errorRouteOptionRadio: null,
        errorRouteRadio: null,
        errorSailingHour: null,
        errorSailingMinutes: null,
        errorSummary: [
          { fieldId: "routeFlight", message: errors.flightError }
        ],
        formSubmitted: true,
        routeFlight: mockPayload.routeFlight,
        routeOption: mockPayload.routeOption,
        routeRadio: mockPayload.routeRadio,
        sailingHour: mockPayload.sailingHour,
        sailingMinutes: mockPayload.sailingMinutes,
      }
    );
  });

  it("should handle and return errors for ferry route not selected and departure date being empty", async () => {
    const errors = {
      routeOptionError: "Select if you are checking a ferry or a flight",
      routeError: "Select the ferry you are checking",
      flightError: "Enter the flight number you are checking",
      departureDateRequiredError: "Enter the scheduled departure date, for example 27 3 2024",
      departureDateFormatError: "Enter the date in the correct format, for example 27 3 2024",
      timeError: "Enter the scheduled departure time, for example 15:30",
      labelError: "Error:",
      genericError: "Validation errors occurred",
    };

    const routeOptions = [
      { id: '1', value: 'Ferry', label: 'Ferry', template: 'ferryView.html' },
      { id: '2', value: 'Flight', label: 'Flight', template: 'flightView.html' }
    ];

    const sailingRoutes = sailingRoutesDefault;

    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockPayload = {
      routeOption: '1',
      routeRadio: null,
      sailingHour: '12',
      sailingMinutes: '30',
      departureDateDay: '',
      departureDateMonth: '1',
      departureDateYear: '2024',
      routeFlight: '12345',
    };

    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === 'SailingRoutes') return sailingRoutes;
          if (key === 'CurrentSailingModel') return currentSailingMainModelData;
          return null;
        }),
      },
    };

    // Mock response toolkit
    const mockResponseToolkit = {
      redirect: jest.fn().mockReturnValue({}),
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null
    });

    validateRouteRadio.mockReturnValue({
      isValid: false,
      error: errors.routeError,
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null
    });

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null
    });

    validateDate.mockReturnValue({
      isValid: false,
      error: errors.departureDateRequiredError
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, mockResponseToolkit);

    expect(mockResponseToolkit.view).toHaveBeenCalledWith(
      "componentViews/checker/currentsailing/currentsailingView",
      {
        currentSailingMainModelData,
        departureDateDay: mockPayload.departureDateDay,
        departureDateMonth: mockPayload.departureDateMonth,
        departureDateYear: mockPayload.departureDateYear,
        errorDepartureDate: errors.departureDateRequiredError,
        errorFlight: null,
        errorRouteOptionRadio: null,
        errorRouteRadio: errors.routeError,
        errorSailingHour: null,
        errorSailingMinutes: null,
        errorSummary: [
          { fieldId: "routeRadio", message: errors.routeError },
          { fieldId: "departureDateDay", message: errors.departureDateRequiredError }
        ],
        formSubmitted: true,
        routeFlight: mockPayload.routeFlight,
        routeOption: mockPayload.routeOption,
        routeRadio: mockPayload.routeRadio,
        sailingHour: mockPayload.sailingHour,
        sailingMinutes: mockPayload.sailingMinutes,
      }
    );
  });

  it("should handle and return errors for ferry route not selected and invalid departure date", async () => {
    const errors = {
      routeOptionError: "Select if you are checking a ferry or a flight",
      routeError: "Select the ferry you are checking",
      flightError: "Enter the flight number you are checking",
      departureDateRequiredError: "Enter the scheduled departure date, for example 27 3 2024",
      departureDateFormatError: "Enter the date in the correct format, for example 27 3 2024",
      timeError: "Enter the scheduled departure time, for example 15:30",
      labelError: "Error:",
      genericError: "Validation errors occurred",
    };

    const routeOptions = [
      { id: '1', value: 'Ferry', label: 'Ferry', template: 'ferryView.html' },
      { id: '2', value: 'Flight', label: 'Flight', template: 'flightView.html' }
    ];

    const sailingRoutes = sailingRoutesDefault;

    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockPayload = {
      routeOption: '1',
      routeRadio: null,
      sailingHour: '12',
      sailingMinutes: '30',
      departureDateDay: '33',
      departureDateMonth: '1',
      departureDateYear: '2024',
      routeFlight: '12345',
    };

    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === 'SailingRoutes') return sailingRoutes;
          if (key === 'CurrentSailingModel') return currentSailingMainModelData;
          return null;
        }),
      },
    };

    // Mock response toolkit
    const mockResponseToolkit = {
      redirect: jest.fn().mockReturnValue({}),
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null
    });

    validateRouteRadio.mockReturnValue({
      isValid: false,
      error: errors.routeError,
    });

    validateSailingHour.mockReturnValue({
      isValid: true,
      error: null
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null
    });

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null
    });

    validateDate.mockReturnValue({
      isValid: false,
      error: errors.departureDateFormatError
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, mockResponseToolkit);

    expect(mockResponseToolkit.view).toHaveBeenCalledWith(
      "componentViews/checker/currentsailing/currentsailingView",
      {
        currentSailingMainModelData,
        departureDateDay: mockPayload.departureDateDay,
        departureDateMonth: mockPayload.departureDateMonth,
        departureDateYear: mockPayload.departureDateYear,
        errorDepartureDate: errors.departureDateFormatError,
        errorFlight: null,
        errorRouteOptionRadio: null,
        errorRouteRadio: errors.routeError,
        errorSailingHour: null,
        errorSailingMinutes: null,
        errorSummary: [
          { fieldId: "routeRadio", message: errors.routeError },
          { fieldId: "departureDateDay", message: errors.departureDateFormatError }
        ],
        formSubmitted: true,
        routeFlight: mockPayload.routeFlight,
        routeOption: mockPayload.routeOption,
        routeRadio: mockPayload.routeRadio,
        sailingHour: mockPayload.sailingHour,
        sailingMinutes: mockPayload.sailingMinutes,
      }
    );
  });

  it("should handle and return errors for ferry route not selected and invalid departure date and time error", async () => {
    const errors = {
      routeOptionError: "Select if you are checking a ferry or a flight",
      routeError: "Select the ferry you are checking",
      flightError: "Enter the flight number you are checking",
      departureDateRequiredError: "Enter the scheduled departure date, for example 27 3 2024",
      departureDateFormatError: "Enter the date in the correct format, for example 27 3 2024",
      timeError: "Enter the scheduled departure time, for example 15:30",
      labelError: "Error:",
      genericError: "Validation errors occurred",
    };

    const routeOptions = [
      { id: '1', value: 'Ferry', label: 'Ferry', template: 'ferryView.html' },
      { id: '2', value: 'Flight', label: 'Flight', template: 'flightView.html' }
    ];

    const sailingRoutes = sailingRoutesDefault;

    const currentSailingMainModelData = { sailingRoutes, routeOptions };

    const mockPayload = {
      routeOption: '1',
      routeRadio: null,
      sailingHour: '',
      sailingMinutes: '30',
      departureDateDay: '33',
      departureDateMonth: '1',
      departureDateYear: '2024',
      routeFlight: '12345',
    };

    const request = {
      payload: mockPayload,
      yar: {
        set: jest.fn(),
        get: jest.fn((key) => {

          if (key === 'SailingRoutes') 
          {
            return sailingRoutes;
          }

          if (key === 'CurrentSailingModel') 
          {
              return currentSailingMainModelData;
          }
          return null;
        }),
      },
    };

    // Mock response toolkit
    const mockResponseToolkit = {
      redirect: jest.fn().mockReturnValue({}),
      view: jest.fn().mockReturnValue({}),
    };

    validateRouteOptionRadio.mockReturnValue({
      isValid: true,
      error: null
    });

    validateRouteRadio.mockReturnValue({
      isValid: false,
      error: errors.routeError,
    });

    validateSailingHour.mockReturnValue({
      isValid: false,
      error: errors.timeError
    });

    validateSailingMinutes.mockReturnValue({
      isValid: true,
      error: null
    });

    validateFlightNumber.mockReturnValue({
      isValid: true,
      error: null
    });

    validateDate.mockReturnValue({
      isValid: false,
      error: errors.departureDateFormatError
    });

    await CurrentSailingHandlers.submitCurrentSailingSlot(request, mockResponseToolkit);

    expect(mockResponseToolkit.view).toHaveBeenCalledWith(
      "componentViews/checker/currentsailing/currentsailingView",
      {
        currentSailingMainModelData,
        departureDateDay: mockPayload.departureDateDay,
        departureDateMonth: mockPayload.departureDateMonth,
        departureDateYear: mockPayload.departureDateYear,
        errorDepartureDate: errors.departureDateFormatError,
        errorFlight: null,
        errorRouteOptionRadio: null,
        errorRouteRadio: errors.routeError,
        errorSailingHour: errors.timeError,
        errorSailingMinutes: null,
        errorSummary: [
          { fieldId: "routeRadio", message: errors.routeError },
          { fieldId: "departureDateDay", message: errors.departureDateFormatError },
          { fieldId: "sailingHour", message: errors.timeError }
        ],
        formSubmitted: true,
        routeFlight: mockPayload.routeFlight,
        routeOption: mockPayload.routeOption,
        routeRadio: mockPayload.routeRadio,
        sailingHour: mockPayload.sailingHour,
        sailingMinutes: mockPayload.sailingMinutes,
      }
    );
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
    expect(response.code).toBe(HttpStatusCode.Ok);
    expect(response.source).toEqual({
      message: 'Retrieved Route details slot',
      currentSailingSlot: 'testSlot'
    });
  });
});