import { ErrorHandlers } from "../../../../../web/component/checker/error/handler.js";

const ERROR_PATH = "errors/500Error";

const createMockRequest = (options = {}) => ({
  payload: options.payload,
  yar: {},
});

const HTTP_STATUS = {
  FORBIDDEN: 403,
  OK: 200,
  INTERNAL_SERVER_ERROR : 500,
};

const createMockH = () => ({
  view: jest.fn().mockReturnValue({
    code: jest.fn().mockReturnValue({
      takeover: jest.fn(),
    }),
  }),
  redirect: jest.fn(),
  response: jest.fn((val) => ({ code: HTTP_STATUS.OK, source: val })),
});


describe("get500Err0r", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test("should return 500 Error View", async () => {
    const request = createMockRequest();
    const h = createMockH();
    await ErrorHandlers.get500Error(request, h);
    expect(h.view).toHaveBeenCalledWith(ERROR_PATH);
    expect(h.view().code).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  });
});

