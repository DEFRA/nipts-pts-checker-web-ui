import Inert, { plugin } from "@hapi/inert";
import Vision from "@hapi/vision";
import Cookie from "@hapi/cookie";
import Yar from "@hapi/yar";
import Home from "../web/component/checker/home/index.js";
import CurrentSailing from "../web/component/checker/currentsailing/index.js";
import Dashboard from "../web/component/checker/dashboard/index.js";
import DocumentSearch from "../web/component/checker/documentsearch/index.js";
import SearchResults from "../web/component/checker/searchresults/index.js";
import NonCompliance from "../web/component/checker/noncompliance/index.js";
import Referred from "../web/component/checker/referred/index.js";
import MagicPassword from "../web/component/checker/magicPassword/index.js";
import SignIn from "../web/component/checker/SignIn/index.js";
import SignOut from "../web/component/checker/SignOut/index.js";
import Account from "../web/component/checker/Account/index.js";
import CookiesPlugin from "../plugins/cookies-plugin.js";
import AuthPlugin from "../plugins/auth-plugin.js";
import HeaderPlugin from "../plugins/header.js";
import MagicPasswordPlugin from "../plugins/magic-password.js";
import CurrentSailingSlotPlugin from "../plugins/currentsailingslot.js";
import config from "../config/index.js";

const pluginList = [
  {
    plugin: Inert,
  },
  {
    plugin: Vision,
  },
  {
    plugin: Cookie,
  },
  {
    plugin: Yar,
    options: {
      name: config.cookie.cookieNameSession,
      maxCookieSize: 1024,
      storeBlank: true,
      cookieOptions: {
        isHttpOnly: true,
        isSameSite: config.cookie.isSameSite,
        isSecure: config.cookie.isSecure,
        password: config.cookie.password,
        ttl: config.cookie.ttl,
      },
    },
  },
  /*
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
  */
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
  {
    plugin: Referred,
  },
  {
    plugin: AuthPlugin,
  },
  {
    plugin: CookiesPlugin,
  },
  {
    plugin: SignIn,
  },
  {
    plugin: SignOut,
  },
  {
    plugin: Account,
  },
  {
    plugin: HeaderPlugin,
  },
  {
    plugin: MagicPassword,
  },
  {
    plugin: MagicPasswordPlugin,
  },
  {
    plugin: CurrentSailingSlotPlugin,
  },
];

export default pluginList;
