import { DashboardHandlers } from "../../../../../web/component/checker/dashboard/handler.js";
import DashboardMainModel from "../../../../../constants/dashBoardConstant.js"

jest.mock("../../../../../api/services/currentSailingMainService.js");

describe('Handler', () => {
    describe("index", () => {
        it('should return view with CurrentSailingSlot model', async () => {
            const mockData = {sailingHour: '15', sailingMinutes: '15', currentDate: new Date().toLocaleDateString('en-GB'), pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle};
            const mockRequest = {                
                yar: {
                    get: jest.fn().mockReturnValue( {sailingHour: '15', sailingMinutes: '15', pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle})                    
                }
            };

            const h = {
                view: jest.fn((viewPath, data) => {
                    return { viewPath, data };
                })
            };

            const response = await DashboardHandlers.getDashboard(mockRequest, h);

            expect(response.viewPath).toBe("componentViews/checker/dashboard/dashboardView");            
            expect(h.view).toHaveBeenCalledWith("componentViews/checker/dashboard/dashboardView", { currentSailingSlot: mockData });
        });
    });
});
