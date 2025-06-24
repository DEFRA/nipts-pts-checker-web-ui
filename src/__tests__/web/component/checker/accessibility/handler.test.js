import { AccessibilityHandlers } from "../../../../../web/component/checker/accessibility/handler.js";
import headerData from "../../../../../web/helper/constants.js";

jest.mock("../../../../../web/helper/constants.js", () => ({
  section: null,
}));

describe("AccessibilityHandlers", () => {
  describe("getAccessibilityStatement", () => {
    it("should set headerData section to accessibility and return view", async () => {
      const mockView = jest.fn();
      const h = { view: mockView };
      const request = {};

      const expectedModel = {
        checkerTitle: "Pet Travel Scheme",
        checkerSubtitle: "Check a pet travelling from GB to NI",
      };

      await AccessibilityHandlers.getAccessibilityStatement(request, h);

      expect(headerData.section).toBe("accessibility");
      expect(mockView).toHaveBeenCalledWith(
        "componentViews/checker/accessibility/view",
        {
          model: expectedModel,
        }
      );
    });

    it("should return the result of h.view", async () => {
      const mockViewResult = { statusCode: 200 };
      const mockView = jest.fn().mockReturnValue(mockViewResult);
      const h = { view: mockView };
      const request = {};

      const result = await AccessibilityHandlers.getAccessibilityStatement(request, h);

      expect(result).toBe(mockViewResult);
    });
  });
});