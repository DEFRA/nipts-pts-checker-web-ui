const times = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
times.unshift(""); // Add an empty string at the beginning

const errors = {
  routeOptionError: "Select if you are checking a ferry or a flight",
  routeError: "Select the ferry you are checking",
  flightNoEmptyError: "Enter the flight number. For example, RK 103",
  flightNumberFormatError: "Enter the flight number using up to 8 letters and numbers (for example, RK 103)",
  departureDateRequiredError: "Enter the scheduled departure date, for example 27 3 2024",
  departureDateFormatError: "Enter the date in the correct format, for example 27 3 2024",
  timeError: "Enter the scheduled departure time, for example 15:30",
  timeOutOfBoundsError: "The flight or ferry must have departed in the past 48 hours or departs within the next 24 hours",
  labelError: "Error:",
  genericError: "Validation errors occurred",
};

const routeOptions =  [
  { id: '1', value: 'Ferry', label: 'Ferry', template: 'ferryView.html' },
  { id: '2', value: 'Flight', label: 'Flight', template: 'flightView.html' }
];

const currentSailingMainModelData = {
    pageHeading: "What route are you checking?",
    pageTitle: "What route are you checking - Pet Travel Scheme: Check a pet travelling from Great Britain to Northern Ireland",
    routeSubHeading: "Route",
    routes: undefined,
    sailingTimeSubHeading: "Scheduled departure time",
    sailingHintText1: "Use the 24-hour clock - for example, 15:30.",
    sailingTimes: times,
    currentSailingMainModelErrors: errors,
    routeOptions: routeOptions,
    routeOptionHeading: "Are you checking a ferry or a flight?",
    flightSubHeading: "Flight number",
    scheduledDepartureHeading: 'Scheduled departure date',
    scheduledDepartureHelpText: 'For example, 27 3 2024',
    dayText: 'Day',
    monthText: 'Month',
    yearText: 'Year',
  };


  export default {
    currentSailingMainModelData,
  };

  export const CurrentSailingMainModelErrors =  errors;

  export const CurrentSailingRouteOptions =  routeOptions;



