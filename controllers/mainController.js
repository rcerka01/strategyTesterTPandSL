var singleController = require("./singleController")
var combinedController = require("./combinedController")
var fileController = require("./fileController")

const fs = require('fs')

module.exports = { run: function (app) {
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

  app.get("/single", function(req, res) {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      var output = singleController.run(data)
      res.render("index", { output });
    });
  })
    
  app.get("/read", async function(req, res) {
     var output = await fileController.readFiles()
     res.render("index", { output });
  });

}}
