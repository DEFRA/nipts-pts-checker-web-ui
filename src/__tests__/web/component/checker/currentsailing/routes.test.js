import Hapi from '@hapi/hapi';
import Yar from '@hapi/yar';
import Routes from "../../../../../web/component/checker/currentsailing/routes.js";
import Handler from "../../../../../web/component/checker/currentsailing/handler.js";
import HttpMethod from '../../../../../constants/httpMethod.js';
import currentSailingMainService from '../../../../../api/services/currentSailingMainService.js';

// Mock the service call
jest.mock('../../../../../api/services/currentSailingMainService.js');

const mockCurrentSailingMainModelData = {
    // your mock data here
  };

describe('Routes', () => {

    let server;

    beforeAll(async () => {
      server = Hapi.server();
  
      await server.register([
        {
          plugin: Yar,
          options: {
            storeBlank: false,
            cookieOptions: {
              password: 'a_very_secure_password_that_is_at_least_32_characters_long',
              isSecure: false, // Set to true in production with HTTPS
            },
          },
        },
      ]);
  
      server.route(Routes);
    });
  
    afterAll(async () => {
      await server.stop();
    });

    beforeEach(() => {
        currentSailingMainService.getCurrentSailingMain.mockResolvedValue(mockCurrentSailingMainModelData);
    });

    it('should define the /Checker/CurrentSailing route correctly', () => {
        const expectedRoute = {
          method: HttpMethod.GET,
          path: '/Checker/CurrentSailing',
          config: Handler.index,
        };
    
        expect(Routes).toContainEqual(expectedRoute);
      });

    it('should handle POST /sailing-slot and set session data', async () => {
        const payload = { slot: '10:00' };

        const response = await server.inject({
        method: HttpMethod.POST,
        url: '/sailing-slot',
        payload,
        });

        expect(response.statusCode).toBe(302); // Redirection status code
        expect(response.headers.location).toBe('/'); // Redirect to home page

        const yarSession = response.request.yar;
        expect(yarSession._store.CurrentSailingSlot).toEqual(payload);
    });

    it('handler should return correct response', () => {
        const payload = { slot: '10:00' };
        const route = Routes.find(r => r.path === '/sailing-slot' && r.method === HttpMethod.GET);
        const request = {
          yar: {
            get: jest.fn().mockReturnValue(payload)
          }
        };
        const h = {
          response: jest.fn((payload) => payload)
        };
    
        const response = route.options.handler(request, h);
    
        expect(request.yar.get).toHaveBeenCalledWith('CurrentSailingSlot');
        expect(h.response).toHaveBeenCalledWith({
          message: 'Retrieved Current sailing slot',
          currentSailingSlot: payload
        });
        expect(response).toEqual({
          message: 'Retrieved Current sailing slot',
          currentSailingSlot: payload
        });
      });
});