// middleware/sanitize.js
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const domPurify = DOMPurify(window);

const sanitize = (req, res, next) => {
  if (req.body.content) {
    req.body.content = domPurify.sanitize(req.body.content);
  }
  next();
};

module.exports = sanitize;