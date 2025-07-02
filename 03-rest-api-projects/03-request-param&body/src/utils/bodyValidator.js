const ERROR_MESSAGES = require('../constants/errorMessages');
const multer = require('multer');
const upload = multer();

function bodyValidator({ requiredFields = [] }) {
  return (req, res, next) => {
    res.locals.requiredFields = requiredFields;

    upload.none()(req, res, err => {
      if (err) return next(err);

      if (!req.body || Object.keys(req.body).length === 0) {
        // Try JSON parsing if form-data empty
        require('express').json()(req, res, err2 => {
          if (err2) return next(err2);
          validateBody();
        });
      } else {
        validateBody();
      }

      function validateBody() {
        if (!req.body || typeof req.body !== 'object') {
          return res.status(400).json({
            error:ERROR_MESSAGES.INVALID_REQUEST_BODY,
            requiredFields,
          });
        }
        const missing = requiredFields.filter(f => !req.body[f]);
        if (missing.length) {
          return res.status(400).json({
            error:ERROR_MESSAGES.MISSING_FIELDS(missing),
          });
        }
        next();
      }
    });
  };
}

module.exports = bodyValidator;