  // Auto-fill today's date
  document.getElementById('currentDate').valueAsDate =
    new Date();

  // Calculate total amount
  function calculateTotal(){

    let total = 0;

    document.querySelectorAll('.amount-input')
      .forEach(input => {

      total += parseFloat(input.value) || 0;

    });

    document.getElementById('totalAmount').value =
      total.toFixed(2);

  }

  // Attach listeners
  function attachAmountListeners(){

    document.querySelectorAll('.amount-input')
      .forEach(input => {

      input.removeEventListener(
        'input',
        calculateTotal
      );

      input.addEventListener(
        'input',
        calculateTotal
      );

    });

  }

  // Add new expense row
  function addExpenseRow(){

    const tbody =
      document.querySelector('#expenseTable tbody');

    const row = tbody.insertRow();

    row.innerHTML = `

      <td>
        <input type="date" class="expense-date" />
      </td>

      <td>
        <textarea
          rows="3"
          placeholder="Property"
        ></textarea>
      </td>

      <td>
        <textarea
          rows="3"
          placeholder="Ownership"
        ></textarea>
      </td>

      <td>
        <input
          type="number"
          step="0.01"
          class="amount-input"
          placeholder="Amount"
        />
      </td>

      <td>
        <textarea
          rows="3"
          placeholder="Lot"
        ></textarea>
      </td>

      <td>
        <textarea
          rows="3"
          placeholder="Expense Type"
        ></textarea>
      </td>

      <td>
        <textarea
          rows="3"
          placeholder="Expense Description"
        ></textarea>
      </td>

      <td>
        <input
          type="file"
          class="receipt-file"
        />
      </td>

    `;

    attachAmountListeners();

  }

  attachAmountListeners();

  // Submit form
  document.getElementById('expenseForm')
    .addEventListener('submit', function(e){

    e.preventDefault();

    const cardholder =
      document.getElementById('cardholderName')
      .value
      .trim();

    if(!cardholder){

      alert('Please enter cardholder name.');

      return;

    }

    const timestamp =
      document.getElementById('currentDate')
      .value;

    const totalAmount =
      document.getElementById('totalAmount')
      .value;

    const rows =
      document.querySelectorAll(
        '#expenseTable tbody tr'
      );

    let csvRows = [];

    const headers = [

      'Sr No',
      'Cardholder',
      'Submission Timestamp',
      'Expense Date',
      'Property',
      'Ownership',
      'Amount',
      'Lot',
      'Expense Type',
      'Expense Description',
      'Receipt File Name'

    ];

    csvRows.push(headers.join(','));

    rows.forEach((row,index) => {

      const expenseDate =
        row.querySelector('.expense-date')
        .value;

      const textareas =
        row.querySelectorAll('textarea');

      const property =
        textareas[0].value;

      const ownership =
        textareas[1].value;

      const amount =
        row.querySelector('.amount-input')
        .value;

      const lot =
        "'" + (textareas[2].value || '');

      const expenseType =
        textareas[3].value;

      const expenseDescription =
        textareas[4].value;

      const receiptInput =
        row.querySelector('.receipt-file');

      let receiptFileName = '';

      // Rename and download receipts
if(receiptInput.files.length > 0){

  let receiptNames = [];

  Array.from(receiptInput.files).forEach((file,fileIndex) => {

    const extension =
      file.name.split('.').pop();

    const cleanCardholder =
      cardholder.replace(/\s+/g,'');

    const generatedName =
      `${index + 1}.${fileIndex + 1}-${cleanCardholder}-${expenseDate}_${amount}.${extension}`;

    receiptNames.push(generatedName);

    const link =
      document.createElement('a');

    link.href =
      URL.createObjectURL(file);

    link.download =
      generatedName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  });

  receiptFileName = receiptNames.join(' | ');

}

      const csvLine = [

        index + 1,

        `"${cardholder}"`,

        `"${timestamp}"`,

        `"${expenseDate}"`,

        `"${property.replace(/\n/g,' ')}"`,

        `"${ownership.replace(/\n/g,' ')}"`,

        `"'${amount}"`,

        `"${lot.replace(/\n/g,' ')}"`,

        `"${expenseType.replace(/\n/g,' ')}"`,

        `"${expenseDescription.replace(/\n/g,' ')}"`,

        `"${receiptFileName}"`

      ];

      csvRows.push(csvLine.join(','));

    });

    // Generate CSV
    const csvContent =
      csvRows.join('\n');

    const blob =
      new Blob(
        [csvContent],
        {
          type:'text/csv;charset=utf-8;'
        }
      );

    const csvLink =
      document.createElement('a');

    csvLink.href =
      URL.createObjectURL(blob);

    const cleanCardholder =
      cardholder.replace(/\s+/g,'');

    csvLink.download =
      `${cleanCardholder}-${timestamp}-${totalAmount}.csv`;

    document.body.appendChild(csvLink);

    csvLink.click();

    document.body.removeChild(csvLink);

    alert(
      'Expense report exported successfully.'
    );

    location.reload();

  });
