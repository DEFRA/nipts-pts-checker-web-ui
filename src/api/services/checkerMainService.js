import { CheckerMainModel } from "../models/checkerMainModel.js";

const checkerMainModelData = [
  {
    serviceName: "Testing Service 1",
  },
  {
    serviceName: "Testing Service 2",
  },
];

const getCheckerMain = () =>
  checkerMainModelData.map(
    (data) => new CheckerMainModel(...Object.values(data))
  );

export default {
  getCheckerMain,
};