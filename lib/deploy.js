var TOKEN = process.env.AWS_ACCESS_KEY_ID;
var SECRET = process.env.AWS_SECRET_ACCESS_KEY;
var BUCKET = "static.ooyala.com";
var PATH = "chromecast";
var GIT_STATUS = process.env.GIT_STATUS;
var VERSION = process.env.VERSION;

// deploy only on clean git
console.log("Checking for clean Git...");
if (GIT_STATUS) {
  throw "ABORT! Git is not clean";
}

var fs = require('fs'),
    mime = require('mime'),
    aws = require('aws-sdk');

aws.config.update({accessKeyId: TOKEN, secretAccessKey: SECRET});
var s3 = new aws.S3();
var localFilePath = "", remoteFilePath = "";

var files = [
  "dist/cast.min.js",
  "dist/cast.min.js.map"
];

putObject = function(destination) {
  for (var i = 0; i < files.length; i++) {
    var filePaths = files[i].split("/");
    // for staging and sandbox the cache limit will be set to 15 min and for the rest fo the env to 1 hr
    var cacheLimit = (process.env.ENVIRONMENT === "staging" || process.env.ENVIRONMENT === "sandbox") ? 900 : 3600;
    localFilePath = __dirname + "/" + files[i];
    remoteFilePath = PATH + "/" + destination + "/" + filePaths.join("/");
    remoteFilePath = remoteFilePath.replace("dist/", "");

    try {
      var fileBuffer = fs.readFileSync(localFilePath);
      var params = {
        Bucket: BUCKET,
        Key: remoteFilePath,
        Body: fileBuffer,
        ContentLength: fileBuffer.length,
        ContentType: mime.lookup(localFilePath),
        CacheControl: "max-age=" + cacheLimit,
        ACL: 'public-read'
      };

      console.log("Uploading files to: " + BUCKET + "/" + remoteFilePath);
      s3.putObject(params, function(err, data) {
        if (err) {
          throw "Error in deploy:" + err;
        }
      });
    } catch (e) {
      throw e;
    }
  }
}

switch (process.env.ENVIRONMENT) {
  case 'sandbox':
    putObject(process.env.ENVIRONMENT + "/" + process.env.SANDBOX);
    break;
  case 'staging':
  case 'latest':
    putObject(process.env.ENVIRONMENT);
    break;
  case 'version':
    putObject("v" + VERSION);  
    break;
}