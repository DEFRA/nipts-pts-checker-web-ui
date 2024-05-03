switch ($("h1").attr("id")) {
  case "documents":
    $("#menu-right-0").addClass("hmrc-account-menu__link--active");
    break;
    case "authorise":
      $("#menu-right-1").addClass("hmrc-account-menu__link--active");
      break;
  case "owner":
    $("#menu-right-2").addClass("hmrc-account-menu__link--active");
    break;
  case "account":
    $("#menu-right-3").addClass("hmrc-account-menu__link--active");
    break;
  default:
}