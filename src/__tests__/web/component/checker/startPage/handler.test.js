import appSettingsService from "../../../../../api/services/appSettingsService.js";
import Handler from "../../../../../web/component/checker/startPage/handler.js";

jest.mock("../../../../../api/services/appSettingsService.js");
describe("Handler", () => {
  describe("index", () => {
    it("should call getAppSettings and return view", async () => {
      // Arrange
      const mockedData = {
        ptsTitle: "Pet Travel Scheme",
        ptsSubTitle: "Check a pet from Great Britain to Northern Ireland",
      };

      appSettingsService.getAppSettings.mockResolvedValue(mockedData);
      const mockView = jest.fn();
      const h = { view: mockView };
      const request = {};

      // Act
      await Handler.startPage.handler(request, h);

      // Assert
      expect(appSettingsService.getAppSettings).toHaveBeenCalled();
      expect(mockView).toHaveBeenCalledWith(
        "componentViews/checker/startPage/view",
        {
          model: mockedData,
        }
      );
    });
  });
});
