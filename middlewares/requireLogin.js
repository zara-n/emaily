module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: "You must be logged in" });
  } 

  next(); //move on to next middelware if user is found
};
