"# nipts-pts-checker-web-ui"
Download Node Js 
https://nodejs.org/en/download
Install Node Js (Call ior raise service desk ticket as may need amin privilages to install this)

Download VS Code
https://code.visualstudio.com/download
Install VS Code (Call ior raise service desk ticket as may need amin privilages to install this)

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
Browse the URL :- http://localhost:4000/checker/home

To Test
npm test -- checkerMainService.test.js
Please replace checkerMainService.test.js with the path to your test file.

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
