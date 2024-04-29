import checkerMainService from "../../../api/services/checkerMainService.js";
import { CheckerMainModel } from "../../../api/models/checkerMainModel.js";

describe("checkerMainService", () => {
    describe("getCheckerMain", () => {
        it("should return an array of CheckerMainModel instances", () => {
            const expected = [
                new CheckerMainModel("Testing Service 1"),
                new CheckerMainModel("Testing Service 2"),
            ];

            const result = checkerMainService.getCheckerMain();

            expect(result).toEqual(expected);
        });
    });
});
