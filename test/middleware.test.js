var ejsamd = require("../lib"),
    middleware = ejsamd.middleware({
      views: __dirname + "/fixture"
    });

function define(dependencies, func){
  return func();
}

describe("ejs middleware", function(){

  it("should set javascript in the header", function(done){
    var request = {
        url: "/test.js"
      }, response = {
        header: function(key, value){
          key.should.be.eql("content-type");
          value.should.be.eql("application/javascript");
          done();
        },
        end: function(){}
      };

    middleware(request, response);
  });


  it("should send the javascript compiled funtion", function(done){
    var request = {
        url: "/test.js"
      }, response = {
        header: function(){
        },
        end: function(content){
          eval(content)().should.eql("<p>hello world</p>");
          done();
        }
      };
    middleware(request, response);
  });

  it("should work with includes", function(done){
    var request = {
        url: "/including.js"
      }, response = {
        header: function(){
        },
        end: function(content){
          eval(content)().should.eql("<p>hello world</p>");
          done();
        }
      };
    middleware(request, response);
  });

  it("should call next if the ejs doesnt exist", function(done){
    var request = {
        url: "/testosterona.js"
      }, response = {};

    middleware(request, response, done);
  });

  it("should pass the specified options to ejs", function(done){
    var request = {
        url: "/custom.js"
      },
      response = {
        header: function(){
        },
        end: function(content){
          var template = eval(content);
          var html = template({message: "Hello World!"});

          html.trim().should.be.eql("<p>Hello World!</p>");
          done();
        }
      },
      options = {
        views: __dirname + "/fixture",
        delimiter: '?'
      };

    ejsamd.middleware(options)(request, response);
  });
});
