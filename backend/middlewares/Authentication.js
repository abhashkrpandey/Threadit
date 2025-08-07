const jwt = require("jsonwebtoken");


function authenticator(req, res, next) {
   const token = req.headers.authorization?.split(" ")[1];
   jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
         res.json({ message: "Not registered" });
      }
      else {
         req.decoded = decoded;
         next();
      }
   })
}
module.exports = authenticator;