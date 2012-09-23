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
  return function(req, res, next){
    var url = req.url, 
        ejs_path = url.replace( /\.js$/, '.ejs'),
        views_dir = options.views || req.app.set('views'),
        template_abs_path = path.join(views_dir, ejs_path);

    fs.readFile( template_abs_path, function (err, template) {
      if (err){ 
        if(err.code === "ENOENT"){
          return next();
        }       
        return next(err);
      }
      res.header('content-type', 'application/javascript');
      res.end(
        exports.wrapAmd(ejs.compile(template.toString(), {client: true}).toString())
      );
    });
  };
};

