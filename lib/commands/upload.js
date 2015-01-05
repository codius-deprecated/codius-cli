//------------------------------------------------------------------------------
/*
    This file is part of Codius: https://github.com/codius
    Copyright (c) 2014 Ripple Labs Inc.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

var Compiler = require('codius-engine').Compiler;
var FileManager = require('codius-engine').FileManager;
var Engine = require('codius-engine').Engine;

var concat = require('concat-stream');
var fs = require('fs');
var tar = require('tar-stream');
var zlib = require('zlib');
var request = require('request');
var winston = require('winston');

var UploadCommand = function (codius) {
  this.codius = codius;
};

/**
 * Upload a contract
 */
UploadCommand.prototype.run = function () {
  var _this = this;

  var currentDir = process.cwd();

  var engineConfig = this.codius.config.getEngineConfig();

  var compiler = new Compiler(engineConfig);
  var fileManager = new FileManager(engineConfig);

  // TODO redo all of the CLI's config to clean it up a lot
  var hostUrl = this.codius.config.getCodiusHostUrl();

  if (!hostUrl || !hostUrl.hostname) {
    throw new Error('Must set CODIUS_HOST environment variable to upload contract');
  }

  var pack = tar.pack();
  var gzip = zlib.createGzip();
  compiler.on('file', function (event) {
    if (event.name.indexOf(currentDir) !== 0) {
      throw new Error('File path does not have current directory prefix: ' + event.name);
    }
    var filename = event.name.slice(currentDir.length);
    if (filename.indexOf('/') === 0) {
      filename = filename.slice(1);
    }
    pack.entry({ name: filename }, event.data);
  });

  var contractHash = compiler.compileModule(currentDir);
  pack.finalize();
  //pack.pipe(gzip).pipe(fs.createWriteStream('test.tar.gz')); return;
  
  var uploadUrl = hostUrl.apiPrefix+'/contract';

  winston.info('Uploading contract '+contractHash + ' to ' + uploadUrl);

  pack.pipe(gzip).pipe(request.post({
    url: uploadUrl,
    rejectUnauthorized: !this.codius.config.get('allowUnauthorizedSsl')
  })).on('end', function () {
    winston.info('Generating token');
    request.post({
      url: hostUrl.apiPrefix+'/token?contract='+contractHash,
      rejectUnauthorized: !_this.codius.config.get('allowUnauthorizedSsl')
    }, function (error, res, body) {
      body = JSON.parse(body);
      winston.info('Contract ready at https://'+body.token+'.'+hostUrl.tokenSuffix+'/');
      winston.info('Contract metadata available at '+hostUrl.apiPrefix+'/token/'+body.token);

      // TODO This is temporary
      //request(hostUrl+body.token+'/').pipe(process.stdout);
    });
  });
};

exports.UploadCommand = UploadCommand;
