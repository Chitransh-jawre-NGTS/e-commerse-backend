exports.validateGSTIN = (gstin) => {
  const allowedTempGST = "27TEMP1234G1Z5"; // You can change it later
  return gstin === allowedTempGST;
};
