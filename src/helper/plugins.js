import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import Yar from "@hapi/yar";
import Home from "../web/component/checker/home/index.js";
import CurrentSailing from "../web/component/checker/currentsailing/index.js";
import Dashboard from "../web/component/checker/dashboard/index.js";
import DocumentSearch from "../web/component/checker/documentsearch/index.js";
import SearchResults from "../web/component/checker/searchresults/index.js";
import NonCompliance from "../web/component/checker/noncompliance/index.js";

const pluginList = [
  {
    plugin: Inert,
  },
  {
    plugin: Vision,
  },
  {
    plugin: Yar,
    options: {
      storeBlank: false,
      cookieOptions: {
        password: "a_very_secure_password_that_is_at_least_32_characters_long",
        isSecure: false, // Set to true in production with HTTPS
      },
    },
  },
  {
    plugin: Home,
  },
  {
    plugin: CurrentSailing,
  },
  {
    plugin: Dashboard,
  },
  {
    plugin: DocumentSearch,
  },
  {
    plugin: SearchResults,
  },
  {
    plugin: NonCompliance,
  },
];

export default pluginList;
