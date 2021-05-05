const express = require('express');
const router = express.Router();
// enter your code here
const users = require('../model/users');

router.post('/login', (req, res) => {
  // enter your code here
  let email = req.body.email;
  let password = req.body.password;
  if (email && password) {
    const user = users.find(
      (el) => el.email === email && el.password === password
    );
    if (user) {
      req.session.userId = user.id;
      res.status(200).json({ id: user.id, name: user.name });
    } else res.status(401).send('Wrong email or password');
  } else res.status(400).send('Login failed');
});
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) res.status(400).send('You are not logged in!');
  else next();
};

router.get('/logout', redirectLogin, (req, res) => {
  // enter your code here
  req.session.destroy();
  res.clearCookie(process.env.SESSION_NAME);
  res.status(200).send('Logout');
});

router.post('/register', (req, res) => {
  // enter your code here
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  if (name != '' && password != '' && email != '') {
    if (users.find((el) => el.email == email)) {
      res.status(409).send('Email already registered');
    } else {
      let oid = 0;
      for (let i of users) {
        if (i.id > oid) {
          oid = i.id;
        }
      }
      let nid = oid + 1;

      users.push({ id: nid, name: name, email: email, password: password });
      res.status(200).send('user created');
    }
  } else {
    res.status(400).send('Registration failed');
  }
  console.log(users);
});

router.get('/secretdata', (req, res) => {
  // enter your code here
  return res.status(200).end('the prime number is 2305843009213693951');
});

module.exports = router;
