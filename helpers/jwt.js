require("dotenv/config");
const api = process.env.API_URL;
const expressJwt = require("express-jwt");
const {User} = require('../routers/users')
const secret = process.env.sec;

function auth() {
  return expressJwt
    .expressjwt({
      secret,
      algorithms: ["HS256"],
    })
    .unless({
      path: [
        { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
        { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
        { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
        `${api}/users/login`,
        `${api}/users/register`,
      ],
    });
}
module.exports = auth;
