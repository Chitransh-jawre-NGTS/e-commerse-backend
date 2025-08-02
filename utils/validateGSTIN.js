exports.validateGSTIN = (gstin) => {
  const allowedGSTs = {
    "22AAAAA0000A1Z5": {
      status: "Active",
      legalName:"Test Seller",
      name: "Test Seller",
      state: "Chhattisgarh",
      address: "Raipur, Chhattisgarh"
    },
    "27TEMP1234G1Z5": {
      status: "Inactive",
      legalName:"Test Seller",
      name: "Another Seller",
      state: "Maharashtra",
      address: "Mumbai, Maharashtra"
    }
  };

  return allowedGSTs[gstin] || null;
};
