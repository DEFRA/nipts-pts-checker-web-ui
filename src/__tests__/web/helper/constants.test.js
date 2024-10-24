import constants from "../../../web/helper/constants";


describe('Constants', () => {
  it('should have correct registrationLink', () => {
    expect(constants.registrationLink).toEqual('/v1/registration-idm2/postcode');
  });

  it('should have correct serviceVersion', () => {
    expect(constants.serviceVersion).toEqual('2.0 Silver');
  });

  it('should have correct prototypeVersion', () => {
    expect(constants.prototypeVersion).toEqual('v1');
  });

});