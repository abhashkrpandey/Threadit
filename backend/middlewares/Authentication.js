const jwt = require("jsonwebtoken");


function authenticator(req, res, next) {
   const token = req.headers.authorization?.split(" ")[1];
   // console.log(token);
   jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
         console.log(err.message);
         res.json({ message: "Not registered" });
      }
      else {
         // console.log(decoded);
         req.decoded = decoded;
         next();
      }
   })
}
module.exports = authenticator;