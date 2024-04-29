
import checkerMainService from "../../../../../api/services/checkerMainService.js";
import Handler from "../../../../../web/component/checker/home/handler.js";


jest.mock("../../../../../api/services/checkerMainService.js"); 
describe('Handler', () => {
  describe('index', () => {
    it('should call getCheckerMain and return view', async () => {
      // Arrange
      const mockCheckerMainModelData = {}; 
      checkerMainService.getCheckerMain.mockResolvedValue(mockCheckerMainModelData);
      const mockView = jest.fn();
      const h = { view: mockView };
      const request = {}; 

      // Act
      await Handler.index.handler(request, h);

      // Assert
      expect(checkerMainService.getCheckerMain).toHaveBeenCalled();
      expect(mockView).toHaveBeenCalledWith("componentViews/checker/home/homeView", {
        checkerMainModelData: mockCheckerMainModelData,
      });
    });
  });
});