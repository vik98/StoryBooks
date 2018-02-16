var middlewareObj = {}

middlewareObj.ensureAuthenticated=function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

middlewareObj.ensureGuest = function(req, res, next){
  if(req.isAuthenticated()){
    res.redirect("/dashboard");
  }else{
    return next();
  }
}

module.exports = middlewareObj
