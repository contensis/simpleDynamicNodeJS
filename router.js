const Profile = require("./profile");
const Render = require("./render");
const querystring = require("querystring");

class Router {

  constructor() {
    this.commonHeader = {
      'Content-Type': 'html'
    };
  }

  home(req, res) {
    if (req.url === "/") {
      if (req.method.toLowerCase() === "get") {
        res.writeHead(200, this.commonHeader);
        Render.view("header", {}, res);
        Render.view("search", {}, res);
        Render.view("footer", {}, res);
        res.end();
      } else {
        req.on("data", function (postBody) {
          var query = querystring.parse(postBody.toString());
          res.writeHead(303, {
            "location": "/" + query.username
          });
          res.end();
        })
      }
    }
  }

  user(req, res) {
    let username = req.url.replace("/", "");
    if (username.length > 0) {
      let studentProfile = new Profile();
      studentProfile.get(username)
      studentProfile.on('end', function (data) {
        let values = {
          avatarUrl: data.gravatar_url,
          username: data.profile_name,
          badges: data.badges.length,
          javascript: data.points.JavaScript
        }
        res.writeHead(200, this.commonHeader);
        Render.view("header", {}, res);
        Render.view("profile", values, res);
        Render.view("footer", {}, res);
        res.end();
      });

      studentProfile.on('error', function (err) {
        Render.view("header", {}, res);
        Render.view("error", {
          errorMessage: err.message
        }, res)
        Render.view("search", {}, res);
        Render.view("footer", {}, res);
        res.end();
      });
    }
  }
}

module.exports = Router;