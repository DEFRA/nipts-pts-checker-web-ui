"use strict";

import Routes from "../../../../../web/component/checker/updateReferral/routes.js";
import { UpdateReferralHandler } from "../../../../../web/component/checker/updateReferral/handler.js";
import HttpMethod from "../../../../../constants/httpMethod.js";

describe("UpdateReferral Routes", () => {
  it("should have a POST route for /checker/update-referral", () => {
    const route = Routes.find(
      (r) => r.method === HttpMethod.GET && r.path === "/checker/update-referral"
    );

    expect(route).toBeDefined();
    expect(route.options.handler).toBe(UpdateReferralHandler.getUpdateReferralForm);
  });

  it("should have a POST route for /checker/update-referral", () => {
    const route = Routes.find(
      (r) => r.method === HttpMethod.POST && r.path === "/checker/update-referral"
    );

    expect(route).toBeDefined();
    expect(route.options.handler).toBe(UpdateReferralHandler.postUpdateReferralForm);
  });
});
