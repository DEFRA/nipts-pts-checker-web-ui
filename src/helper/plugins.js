import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import Home from "../web/component/checker/home/index.js";

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
];

export default pluginList;
