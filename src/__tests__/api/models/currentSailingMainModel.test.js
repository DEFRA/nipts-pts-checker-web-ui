import {
  CurrentSailingMainModel
  } from "../../../api/models/currentSailingMainModel.js";;

describe("currentSailingMainModel", () => {
 describe("setValues for currentSailingMainModel", () => {
    it("should return correct data", async () => {
      const sailingTimes = ["", "00", "01"]

      const routeOptions =  [
        { id: '1', value: 'Ferry', label: 'Ferry', template: 'ferryView.html' },
        { id: '2', value: 'Flight', label: 'Flight', template: 'flightView.html' }
      ];

      const result = new CurrentSailingMainModel ({
        pageHeading: "Test Heading",
        pageTitle: "Test Title",
        routeSubHeading: "Test Route Subheading",
        sailingTimeSubHeading: "Test Sailing Time Subheading",
        sailingHintText1: "Sailing Hint Text 1",
        sailingHintText2: "Sailing Hint Text 2",
        sailingTimes: sailingTimes,
        currentSailingMainModelErrors: null, 
        routeOptions: routeOptions,
        routeOptionHeading: "Route Option Heading",
        flightSubHeading: "Flight Sub Heading",
        scheduledDepartureHeading: "Scheduled Departure Heading",
        scheduledDepartureHelpText: "Scheduled Departure Help Text",
        dayText: "Day Text",
        monthText: "Month Text",
        yearText: "Year Text",
      });

      expect(result.pageHeading).toEqual("Test Heading");
      expect(result.pageTitle).toEqual("Test Title");
      expect(result.routeSubHeading).toEqual("Test Route Subheading");
      expect(result.sailingTimeSubHeading).toEqual("Test Sailing Time Subheading");
      expect(result.sailingHintText1).toEqual("Sailing Hint Text 1");
      expect(result.sailingHintText2).toEqual("Sailing Hint Text 2");
      expect(result.sailingTimes).toEqual(sailingTimes);
      expect(result.currentSailingMainModelErrors).toEqual(null);
      expect(result.routeOptions).toEqual(routeOptions);
      expect(result.routeOptionHeading).toEqual("Route Option Heading");
      expect(result.flightSubHeading).toEqual("Flight Sub Heading");
      expect(result.scheduledDepartureHeading).toEqual("Scheduled Departure Heading");
      expect(result.scheduledDepartureHelpText).toEqual("Scheduled Departure Help Text");
      expect(result.dayText).toEqual("Day Text");
      expect(result.monthText).toEqual("Month Text");
      expect(result.yearText).toEqual("Year Text");
    });
  });

});
