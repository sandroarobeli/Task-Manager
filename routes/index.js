const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'This is an INDEX Page' });
});

// USE REDIRECT AS IN LOCAL-LIBRARY. REDIRECT TO SOME GENERAL
// ROUTE THAT DISPLAYS INDEX.PUG POPULATED WITH SOME 
// GENERAL INTRO INFO. SUPPOSEDLY MAIN AUTH-LOGIN PAGE!

module.exports = router;
