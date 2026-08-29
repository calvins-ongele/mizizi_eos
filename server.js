//https://bootstrapget.com/demos/meta-admin-dashboard/login.html
//https://bootstrapget.com/demos/statflow-admin-template/login.html
require('dotenv').config(); // load .env variables

const { createServer } = require("http");
const next = require("next");

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`Next.js running on port ${port}`);
  });
});
