"use strict";

import { UpdateReferralHandler } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/update-referral",
    options: {
      handler: UpdateReferralHandler.getUpdateReferralForm,
    },
  },
  {
    method: HttpMethod.POST,
    path: "/checker/update-referral",
    options: {
      handler: UpdateReferralHandler.postUpdateReferralForm,
    },
  },
];

export default Routes;
