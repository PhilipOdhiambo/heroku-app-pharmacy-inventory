async function fetchCurrentStock() {
  // Fetch issue
  const issueAggr = await fetch('/issueAggr').then(res => { return res.json()});
  // Fetch receipt
  const receiptAggr = await fetch(`/receiptAggr`).then(res => { return res.json()});
  // Fetch inventory
  const inventory = await fetch('/inventory').then(res =>{ return res.json()});

  let currentStockArr = [];

  inventory.forEach(inventoryItem => {

    let receiptQty, issueQty, currentStock;

    const receiptArr = receiptAggr.filter(receipt => receipt._id === inventoryItem.Item_Code);
    const issueArr = issueAggr.filter(item => item._id === inventoryItem.Item_Code);

    if (receiptArr[0] && issueArr[0]) {
      receiptQty = receiptArr[0].Total;
      issueQty = issueArr[0].Total;
      currentStock = receiptQty - issueQty;
    }

    if (receiptArr[0] && !issueArr[0]) {
      receiptQty = receiptArr[0].Total;
      issueQty = 0;
      currentStock = receiptQty - issueQty;
    }

    if (!receiptArr[0] && issueArr[0]) {
      receiptQty = 0;
      issueQty = issueArr[0].Total;
      currentStock = receiptQty - issueQty;
    }

    if (!receiptArr[0] && !issueArr[0]) {
      receiptQty = 0;
      issueQty = 0;
      currentStock = receiptQty - issueQty;
    }

    currentStockArr.push({
      Item_Code: inventoryItem.Item_Code,
      Item_Name: inventoryItem.Item_Name,
      Receipt_Qty: receiptQty,
      Issue_Qty: issueQty,
      Current_Stock: currentStock
    });

  });
  return currentStockArr;
};
