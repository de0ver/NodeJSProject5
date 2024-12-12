const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { response } = require("express");
const { validationResult } = require("express-validator");

module.exports.login = async function (req, res) {
  const {login, password} = req.body;
  const checkLogin = await User.findOne({login: login});

  if (checkLogin)
  {
    const comparePassword = await bcrypt.compare(password, checkLogin.password);
    if (comparePassword) {
        req.session.user = checkLogin;
        req.session.isAuthenticated = true;
        req.session.save(err => { if (err) throw err; res.redirect('/'); });
    }
    else
    {
        req.flash('loginError', { field: 'db', message: 'Неверный пароль' });
        return res.redirect('/login');
    }
  }
  else
  {
    req.flash('loginError', { field: 'db', message: 'Такого пользователя не существует'});
    return res.redirect('/login');
  }

};

module.exports.register = async function (req, res) {
  const { name, login, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) 
  {
    let errs = [];

    errors.array().forEach((error) => {
      errs.push({
        field: error.path,
        message: error.msg,
      });
    });

    req.flash("registerError", errs);

    return res.redirect("/register");
  }

  const checkLogin = await User.findOne({ login: login });
  const checkEmail = await User.findOne({ email: email });

  if (checkLogin || checkEmail) 
  {
    let errs = [];

    if (checkLogin) 
    {
      errs.push({
        field: "db",
        message: "Такой логин уже используется",
      });
    }

    if (checkEmail) {
      errs.push({
        field: "db",
        message: "Такой email уже используется",
      });
    }

    req.flash("registerError", errs);

    return res.redirect("/register");
  } 
  else 
  {
    const salt = bcrypt.genSaltSync(10);

    const user = new User({
      name: name,
      login: login,
      email: email,
      password: bcrypt.hashSync(password, salt),
    });

    try 
    {
      await user.save();

      res.redirect("/");
    } 
    catch (e) 
    {
      console.log(e);
    }
  }
};

module.exports.logout = async function (req, res) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
}