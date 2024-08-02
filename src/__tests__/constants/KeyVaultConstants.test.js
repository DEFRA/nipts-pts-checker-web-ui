import KeyVaultConstants from "../../constants/KeyVaultConstants.js";

describe("constants", () => {
  describe("KeyVaultConstants", () => {
    it("should return correct names", () => {
      expect(KeyVaultConstants.DEFRA_ID_TENANT).toEqual("PTS-CP-B2C-TENANT");
      expect(KeyVaultConstants.DEFRA_ID_POLICY).toEqual("PTS-CP-B2C-POLICY");
      expect(KeyVaultConstants.DEFRA_ID_CLIENT_ID).toEqual(
        "PTS-CP-B2C-CLIENT-ID"
      );
      expect(KeyVaultConstants.DEFRA_ID_CLIENT_SECRET).toEqual(
        "PTS-CP-B2C-CLIENT-SECRET"
      );
      expect(KeyVaultConstants.DEFRA_ID_SERVICE_ID).toEqual(
        "PTS-CP-B2C-SERVICE-ID"
      );
      expect(KeyVaultConstants.OCP_APIM_SUBSCRIPTION_KEY).toEqual(
        "PTS-CP-OCP-APIM-SUBSCRIPTION-KEY"
      );
    });
  });
});
