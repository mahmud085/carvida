// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var loopback = require('loopback');
var boot = require('loopback-boot');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var multer  = require('multer');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname +'/pictures/')
  },
  filename: function (req, file, cb) {
    cb(null, req.params.id + path.extname(file.originalname));
  }
})

var upload = multer({ storage: storage })

var app = module.exports = loopback();
app.middleware('initial', bodyParser.urlencoded({ extended: true }));

app.post('/api/cars/:id/image', upload.single('image'), function(req, res) {
console.log('here ',req.params.id);
res.send('perfectly ok!');
  // app.models.car.findById(req.params.id, function(err, car) {
  //   if(err) return res.sendStatus(400);
  //   else {
  //     car.imageUrl = req.file.filename;
  //     car.save(function(err, car){
  //       if(err) return res.sendStatus(400);
  //       else return res.sendStatus(200);
  //     });
  //   }
  // });
  
})
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
