var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
var mime = require('mime');

module.exports = function(opts) {

    opts = opts ||  {};

    if (!opts.baseDir) opts.baseDir = path.dirname(module.parent.filename);

    var datauri = function(file, callback) {
        var app_path = opts.baseDir;
        var reg_exp = /inlineimg\([ '"]?(.*?)[ '"]?(|\,(.*?))\)/g;
        var isBuffer = file.contents instanceof Buffer;
        if(opts.useRelativePath){
            app_path = file.path.replace(/\/[^/]+$/, '/');
        }
        if (isBuffer) {
            var str = String(file.contents);

            var matches = [],
                found;
            while (found = reg_exp.exec(str)) {
                matches.push({
                    'txt': found[0],
                    'url': found[1],
                });
            }

            for (var i = 0, len = matches.length; i < len; i++) {
                if (matches[i].url.indexOf('data:image') === -1) { //if find -> image already decoded
                    var filepath = app_path + path.normalize(matches[i].url);
                    if (fs.existsSync(filepath)) {
                        var b = fs.readFileSync(filepath);
                        if (mime.getType) {
                            str = str.replace(matches[i].txt, 'url(' + ('data:' + mime.getType(filepath) + ';base64,' + b.toString('base64')) + ')');
                        } else {
                            str = str.replace(matches[i].txt, 'url(' + ('data:' + mime.lookup(filepath) + ';base64,' + b.toString('base64')) + ')');
                        }                        
                        gutil.log('gulp-inline-base64:', gutil.colors.green('process file') + gutil.colors.gray(' (' + filepath + ')'));
                    } else {
                        if (opts.debug) gutil.log('gulp-inline-base64:', gutil.colors.red('file not found => skip') + gutil.colors.gray(' (' + filepath + ')'));
                    }
                }
            }
            file.contents = new Buffer(str);

            return callback(null, file);
        }

        callback(null, file);
    };

    return es.map(datauri);
};
