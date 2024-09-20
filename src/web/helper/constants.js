import dotenv from "dotenv";
dotenv.config();

const today = new Date();
const dd = String(today.getDate()).padStart(2, "0");
const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
const yyyy = today.getFullYear();

const formattedToday = `${dd}/${mm}/${yyyy}`;
const idmLink = process.env.ACCOUNT_MANAGEMENT_URL || "https://your-account.cpdev.cui.defra.gov.uk/management/account-management";

export default {
  registrationLink: "/v1/registration-idm2/postcode",
  serviceVersion: "2.0 Silver",
  prototypeVersion: "v1",
  pageState: "empty",
  documentState: "draft",
  pageMessage: "",
  currentPage: "",
  v6cCreateTitle: "Create a new lifelong pet travel document",
  v6cEditTitle: "Revoke or edit my details in a lifelong pet travel document",
  v6cAuthoriseTitle: "Authorise someone to travel with my pet",
  v6cDownloadTitle: "Download or print an existent lifelong pet travel document",
  checkerTitle: "Pet Travel Scheme",
  checkerSubtitle: "Check a pet travelling from Great Britain to Northern Ireland",
  checkerSubtitleHome: "Check a pet from <br/> Great Britain to Northern Ireland",
  checkerShortTitle: "Check a pet travelling from GB to NI",
  currentDate: formattedToday,
  accountManagementLink:  idmLink,
  section:"",
  // session time out 30 minutes
  sessionTimeoutInSeconds: "1800",
  // session timout warning count alert: 2 minuets
  sessionTimeoutCountdownInSeconds: "120"
};