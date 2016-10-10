var async = require('async');
var request = require('request');
var uuid = require('node-uuid');
var fs = require('fs');

function writeToTmp(base64) {
  var filePath = '/tmp/' + uuid.v4() + '.pdf'

  fs.writeFile(filePath, new Buffer(base64, "base64"), function (err) {
    if (err) {
      console.log('Did not write file to tmp.');
    } else {
      console.log('Wrote file to tmp directory.');
    }
  });
}

function pdfsToTmpSaver(urls, callback) {
  console.time('save pdfs to tmp directory');

  async.each(urls, function(pdfUrl, cb) {
    var requestSettings = {
      method: 'GET',
      url: pdfUrl,
      encoding: null
    };
    request(requestSettings, function(err, response, buffer) {
      var base64Pdf = new Buffer(buffer).toString('base64');
      if (!err) {
        writeToTmp(base64Pdf);
        console.log('File encoded.');
        cb();
      } else {
        cb('Error encoding file.');
      }
    });
  }, function(err) {
    if (err) {
      console.log('File did not process');
      callback(err, null);
    } else {
      console.log('All files processed');
      console.timeEnd('save pdfs to tmp directory');
      callback(null);
    }
  });
}

module.exports = pdfsToTmpSaver;
