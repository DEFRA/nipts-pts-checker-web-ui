"# nipts-pts-checker-web-ui"

Install Node Js
Install VS Code
Try to install eslint & jest runner extion in visial studio code

In project root
include
.env files for project settings and include below setting to start
PORT=4000
HOST=localhost

Goto project path and run
npm install

To run the project
npm run start

To run the project in development
npm run dev

To Test
npm run test

Test Coverage
num run test:coverage

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
