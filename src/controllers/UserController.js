function homeUser(req, res) {
  if (req.session.loggedin) {
    res.render("home_student", { name: req.session.name });
  } else {
    res.redirect("/");
  }
}
module.exports = {
  homeUser,
};
