import appSettingsService from "../../../../../api/services/appSettingsService.js";
import { HomeHandlers } from "../../../../../web/component/checker/home/handler.js";
import requestAuthorizationCodeUrl from "../../../../../auth/auth-code-grant/request-authorization-code-url.js";

jest.mock("../../../../../api/services/appSettingsService.js");
jest.mock("../../../../../auth/auth-code-grant/request-authorization-code-url.js");

describe("HomeHandlers", () => {
  describe("getHome", () => {
    it("should call getAppSettings and return view", async () => {
      // Arrange
      const mockedData = {
        ptsTitle: "Pet Travel Scheme",
        ptsSubTitle: "Check a pet travelling from Great Britain to Northern Ireland",
      };
      const mockLoginUrl = "/auth/login";

      appSettingsService.getAppSettings.mockResolvedValue(mockedData);
      requestAuthorizationCodeUrl.mockReturnValue(mockLoginUrl);

      const mockView = jest.fn();
      const h = { view: mockView };
            // Mock request object with yar
            const request = {
              yar: {
                get: jest.fn(),
                set: jest.fn(),
              },
            };

      // Act
      await HomeHandlers.getHome(request, h);

      // Assert
      expect(appSettingsService.getAppSettings).toHaveBeenCalled();
      expect(mockView).toHaveBeenCalledWith(
        "componentViews/checker/home/view",
        {
          model: { ...mockedData, loginUrl: mockLoginUrl },
        }
      );
    });
  });
});
