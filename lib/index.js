var ejs = require("ejs"),
  path = require("path"),
  fs = require("fs");

exports.wrapAmd = function(content){
    return [
      "define([], function() { ",
      "return " + content,
      "});"
    ].join("\n");
};

exports.middleware = function(options){
  var views_dir = options.views || '';
  delete options.views;

  return function(req, res, next){
    var url = req.url, 
        ejs_path = url.replace( /\.js$/, '.ejs');

    if (!views_dir && req.app && typeof req.app.get === 'function'){
      views_dir = req.app.get('views');
    }

    var template_abs_path = path.join(views_dir, ejs_path);

    options.client = options.client !== false;

    fs.readFile( template_abs_path, function (err, template) {
      if (err){ 
        if(err.code === "ENOENT"){
          return next();
        }       
        return next(err);
      }
      options.filename = template_abs_path;
      res.header('content-type', 'application/javascript');
      res.end(exports.wrapAmd(
        ejs.compile(template.toString(), options).toString()
      ));
    });
  };
};

