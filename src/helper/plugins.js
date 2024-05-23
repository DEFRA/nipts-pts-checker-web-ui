import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import Home from "../web/component/checker/home/index.js";
import StartPage from "../web/component/checker/startPage/index.js";

const pluginList = [
  {
    plugin: Inert,
  },
  {
    plugin: Vision,
  },
  {
    plugin: Home,
  },
  {
    plugin: StartPage,
  }
];

export default pluginList;