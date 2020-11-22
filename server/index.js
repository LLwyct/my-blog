const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./routes");

mongoose.set("useFindAndModify", false);

mongoose.connect("mongodb://localhost/centosblog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());

app.use("/api", function (req, res, next) {
  res.setHeader("content-type", "application/json");
  next();
})

routes(app);

app.get(/.*/, (req, res) => {
  res.setHeader("content-type", "text/html");
  res.sendFile(path.resolve(__dirname, './build/index.html'));
  console.log("sendFile");
});

app.listen(8081, async () => {
  // await Blog.remove();
  // mongoose.connection().then().db.dropCollection('Blog');
  // Blog.remove();
  console.log('http://localhost:8081 is been listening...');
});