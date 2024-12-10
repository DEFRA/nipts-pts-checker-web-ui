import { CheckReportHandlers as ReferredHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/checkreportdetails",
    options: {
      handler: ReferredHandlers.getCheckDetails,
    },
  },
  {
    method: HttpMethod.POST,
    path: "/checker/conduct-sps-check",
    options: {
      handler: ReferredHandlers.conductSpsCheck,
    },
  },
];

export default Routes;
