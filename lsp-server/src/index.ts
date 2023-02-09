import express from "express";
import { dirname } from "path";

// create the express application
const app = express();

// server the static content, i.e. index.html
app.use(express.static(dirname(import.meta.url)));

// start the server
const server = app.listen(3000);
