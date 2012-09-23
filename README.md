# EJS to AMD conversion helpers

This module lets you use [EJS](http://github.com/visionmedia/ejs) easily on the browser in an AMD environment - like RequireJS.

It provides:

  * connect middleware to serve the complied templates for development
  * command line utility that puts files in the right place for something like RequireJS to bundle
  * a method to compile EJS templates to AMD wrapped functions


## Installation

    npm install ejs-amd


## Components

These are the interesting bits:

### Connect middleware

The middleware is there for when you are developing. It intercepts requests for template js and compiles and serves the templates directly. This means that you don't need to make any changes to the browser-side code.

```javascript
  var ejsAmd = require('ejs-amd');
  app.use( '/js/templates/', ejsAmd.middleware({ views: "path/to/your/ejs" }) );
``` 

### Compile and wrap the templates

Goes through all the `.ejs` files and compiles them to JavaScript, and then wraps them for AMD loaders.

```
  # compile and wrap you templates
  ejs-amd --from views/ --to public/js/templates
```

### Using the Ejs templates on the browser.

Assuming that you have used RequireJS your browser JavaScript will now look something like this:

    require([ 'templates/person' ], function(personTemplate) {
      var rendered_content = personTemplate({ name: 'Joe Bloggs' });
    });

And you can use exactly the same template on the server side!


## Inspiration

 * https://github.com/mysociety/node-jade-amd
