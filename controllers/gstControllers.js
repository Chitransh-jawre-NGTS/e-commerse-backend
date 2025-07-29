// controllers/gstController.js
const { validateGSTIN } = require('../utils/validateGSTIN');

exports.verifyGSTIN = (req, res) => {
    console.log("Received GSTIN verification request");
  const { gstin } = req.body;

  if (!gstin) {
    return res.status(400).json({ success: false, message: 'GSTIN is required' });
  }

  const isValid = validateGSTIN(gstin);

  if (isValid) {
    return res.status(200).json({ success: true, message: 'Valid GSTIN' });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid GSTIN' });
  }
};
