const times = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
times.unshift(""); // Add an empty string at the beginning

const errors = {
  routeError: "Select a route",
  timeError: "Select the hours and minutes for a scheduled sailing time",
  labelError: "Error:",
  genericError: "Validation errors occurred",
};

const routeOptions =  [
  { id: '1', value: 'Ferry', label: 'Ferry', template: 'ferryView.html' },
  { id: '2', value: 'Flight', label: 'Flight', template: 'flightView.html' }
];

const currentSailingMainModelData = {
    pageHeading: "What route are you checking?",
    pageTitle: "What route are you checking - Pet Travel Scheme: Check a pet from Great Britain to Northern Ireland",
    routeSubHeading: "Route",
    routes: [
      { id: '1001', value: 'Birkenhead to Belfast (Stena)', label: 'Birkenhead to Belfast (Stena)' },
      { id: '1002', value: 'Cairnryan to Larne (P&O)', label: 'Cairnryan to Larne (P&O)' },
      { id: '1003', value: 'Loch Ryan to Belfast (Stena)', label: 'Loch Ryan to Belfast (Stena)' }
    ],
    sailingTimeSubHeading: "Scheduled sailing time",
    sailingHintText1: "Use the 24-hour clock - for example, 15:30.",
    sailingHintText2: "For midday, use 12:00. For midnight, use 23:59.",
    sailingTimes: times,
    currentSailingMainModelErrors: errors,
    routeOptions: routeOptions,
    routeOptionHeading: "Are you checking a sailing or a flight?",
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

  export const CurrentSailingMainModelErrors =  errors ;

