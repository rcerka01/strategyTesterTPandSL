var statsFileController = require("./statsFileController");
var seperateSlController = require("./seperateSlController")
var combinedController = require("./combinedController")
var fileController = require("./fileController")

const fs = require('fs')

module.exports = { run: function (app) {
  app.get("/s", function(req, res) {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      var output = statsFileController.run(data)
      res.render("index", { output });
    });
  })

  app.get("/combined", function(req, res) {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      var output = combinedController.run(data)
      res.render("index", { output });
    });
  })

  app.get("/seperate", function(req, res) {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      var output = seperateSlController.run(data)
      res.render("index", { output });
    });
  })
    
  app.get("/read", async function(req, res) {
     var output = await fileController.readFiles()
     res.render("index", { output });
  });

}}
