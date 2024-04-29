# nipts-pts-checker-web-ui

## Setup

1. Download and install Node.js from (https://nodejs.org/en/download). You may need admin privileges to install this, so please call or raise a service desk ticket if necessary.

2. Download and install Visual Studio Code from (https://code.visualstudio.com/download). Again, you may need admin privileges to install this, so please call or raise a service desk ticket if necessary.

3. Install the ESLint and Jest Runner extensions in Visual Studio Code.

4. In the project root, create a `.env` file for project settings. You can start with the settings below, or copy `env.sample.txt` and rename it to `.env`.

    ```
    PORT=4000
    HOST=localhost
    ```

5. Navigate to the project path and run `npm install`.

## Running the Project

To start the project, use the command `npm run start`.

For development, use `npm run dev`. You can then browse the application at http://localhost:4000/checker/home.

## Testing

To run tests, use `npm test -- checkerMainService.test.js`. Please replace `checkerMainService.test.js` with the path to your specific test file.

For test coverage, use `npm run test:coverage`.

## Project Structure

The current project structure is as follows:


Current Project structure

nipts-pts-checker-web-ui/
├── api/ To call backend
├── assets/ For css, javascripts
├── node_modules/
├── helper/plugin.js --- Include all UI component here for web pages
├── web/
│ ├── component/checker/home --- UI components
│ ├── views --- UI views for each component
├── package.json
├── server.js --- node js server to start

This project is using node js, happi framework & nunjuks as template engine
