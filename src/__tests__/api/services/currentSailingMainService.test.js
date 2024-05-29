import currentSailingMainService from "../../../api/services/currentSailingMainService.js";
import { CurrentSailingMainModel } from "../../../api/models/currentSailingMainModel.js";
import  CurrentSailingModel  from "../../../constants/currentSailingConstant.js";

describe('currentSailingMainService', () => {
  it('getCurrentSailingMain should return a CurrentSailingMainModel with correct data', () => {
    const model = currentSailingMainService.getCurrentSailingMain();

    expect(model).toBeInstanceOf(CurrentSailingMainModel);
    const expectedData = CurrentSailingModel.currentSailingMainModelData;

    expect(model.pageHeading).toBe(expectedData.pageHeading);
    expect(model.serviceName).toBe(expectedData.serviceName);
    expect(model.routeSubHeading).toBe(expectedData.routeSubHeading);
    expect(model.sailingRoutes).toEqual(expectedData.routes);
    expect(model.sailingTimeSubHeading).toBe(expectedData.sailingTimeSubHeading);
    expect(model.sailingHintText1).toBe(expectedData.sailingHintText1);
    expect(model.sailingHintText2).toBe(expectedData.sailingHintText2);
    expect(model.sailingTimes).toEqual(expectedData.sailingTimes);
  });
});
