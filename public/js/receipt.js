// Declare DOM elements and globlal variables
const saveBtn = document.querySelector('#save');
const tableDiv = document.querySelector('.table');
var displayDiv = document.querySelector('.disp');
let searchBox = document.querySelector('#search');

async function searchAndSave() {
  // get inventory data;
  const inventory = await fetch('/inventory').then(res => {return res.json()});

  // Add event listener to searchBox
  searchBox.addEventListener('input', (e) => {
    displayDiv.innerHTML = '';
    if (searchBox.value.length > 2) {

      const filter = inventory.filter(item => {
        let regex = new RegExp(searchBox.value,'i');
        return (regex.test(item.Item_Name)|| regex.test(item.Item_Code));
      });

      filter.forEach(filterItem => {
        displayDiv.innerHTML += `<div class="item"> ${filterItem.Item_Name}</div>`;
      });
    }

  });

  // 2) listen to dropdown list click
  displayDiv.addEventListener('click', e =>{
    // Search for the item that was clicked and store it in a variable
    let clickedItem = inventory.find(item => item.Item_Name === e.target.innerText);

    // Use the returned object to populate the table
    let tbody = document.querySelector('tbody');
    tbody.innerHTML += `
    <tr>
    <td class="Item_Code">${clickedItem.Item_Code}</td>
    <td class="Item_Name">${clickedItem.Item_Name}</td>
    <td><input class="Receive_Qty"></td>
    <td class="Item_Price">${clickedItem.Item_Price}</td>
    </tr>
    `;
    // Clear the search box and the dropdown list
    displayDiv.innerHTML = '';
    searchBox.value = '';
  });
}
searchAndSave();


// 3) Listen if the user click outside the dropdown list
document.addEventListener('click', e=>{
  if (e.target.className ==! 'list') displayDiv.innerHTML = "";
});


saveBtn.addEventListener('click', () =>{
  var receiptDocs = [];
  var rows = document.querySelector('tbody').rows;
  var s11 = document.querySelector('#s11');

  if (isEmpty(s11)) return;
  if (!rows) return;
  Array.from(rows).forEach(row =>{
    var inputCol = row.cells[2].querySelector('input');
    if (isInt(inputCol)) {
      receiptDocs.push({
        Receipt_Date: new Date(),
        Ref_Code: s11.value,
        Receip_From: 'kpcc',
        Item_Code: row.cells[0].innerText,
        Item_Name: row.cells[1].innerText,
        Receipt_Qty: parseInt(inputCol.value),
        Receipt_By: 'user'
      });
    }
    else {
      receiptDocs = [];
      input.setAttribute('class','qtyErr')
      return;
    }
    sendData(receiptDocs);
  });

});

// Posting data
// Make a post request to server using fetch API
function sendData(data) {
  const options = {method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(data)
};
fetch('/receipt', options).then((rawRes) => {
  return rawRes.text();
}).then(myRes => {
  console.log(myRes);
});
}
