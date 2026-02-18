# nipts-pts-checker-web-ui

The Pet Travel Scheme Checker Web UI is a Node.js-based frontend application used by port officials to verify Pet Travel Documents for pets traveling from Great Britain to Northern Ireland.

This application provides a secure and user-friendly interface for interacting with the Checker API.

## Prerequisites
To run this project locally, ensure you have:

- Node.js (v18+ recommended)
- Visual Studio Code (optional, for development)
- Admin rights to install dependencies (if required)
- Access to environment variables or .env configuration

## Setup
1. Clone the repository:
```
git clone https://github.com/DEFRA/nipts-pts-checker-web-ui.git
cd nipts-pts-checker-web-ui
```

2. Install dependencies:
```
npm install
```

3. Create environment config: Copy the sample environment file and update as needed:
```
cp env.sample.txt .env
```

5. Configure env
```
PORT = 5000
HOST = localhost
 
BASE_API_URL = 
OCP_APIM_SUBSCRIPTION_KEY =
 
ACCOUNT_MANAGEMENT_URL = 
 
# Yes/No
MAGIC_PASSWORD_ENABLED = "No"
MAGIC_PASSWORD =
 
# Azure B2C / IDM2 Settings
DEFRA_ID_TENANT =
DEFRA_ID_POLICY =
DEFRA_ID_REDIRECT_URI = 
DEFRA_ID_CLIENT_ID = 
DEFRA_ID_CLIENT_SECRET =
DEFRA_ID_JWT_ISSUER_ID = 
 
# CP Portal
DEFRA_ID_SERVICE_ID = 
 
# AP
#DEFRA_ID_SERVICE_ID =
 
DEFRA_ID_SIGNOUT_URI = 
 
# KeyVault Settings
DEFRA_KEYVAULT_NAME = 
AZURE_TENANT_ID = 
AZURE_CLIENT_ID =
AZURE_CLIENT_SECRET = 
 
ENABLE_CONFIGURATION_SERVER = 
AZURE_CONFIGURATION_SERVER = 
AZURE_CONFIGURATION_SERVER_ENDPOINT = 
APPINSIGHTS_CONNECTION =
```

### Development
To run the project locally:
```
npm run build
npm run dev
```
Or use Visual Studio to start debugging via F5.

### Test
Unit tests are located in the /test directory.

To run tests:
```
npm run test
```

Ensure all dependencies are restored and the test project builds successfully.

To display coverage:
```
npn jest --coverage
```



## Running in development
1. Ensure .env is configured.
2. Start the development server
3. Navigate to localhost port via browser


## Running tests
Run all tests using:
```
npm test
```

## Project structure 
nipts-pts-checker-web-ui/
├── src/
│   ├── api/                  # API calls to backend
│   ├── helper/               # UI plugins and utilities
│   ├── web/
│   │   ├── component/        # UI components
│   │   ├── views/            # Nunjucks templates
├── public/assets/           # Static assets (CSS, JS)
├── server.js                # Node.js server entry point
├── gulpfile.js              # Gulp build tasks
├── package.json             # Project metadata and scripts

## Contributing to this project

Please read the [contribution guidelines](/CONTRIBUTING.md) before submitting a pull request.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

>Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.

