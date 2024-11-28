fetch('upcoming_features.csv')
  .then(response => response.text())
  .then(data => {
    const upcomingfeaturesDiv = document.getElementById('upcoming-features');

    // Create a table element
    const table = document.createElement('table');

    // Use border-collapse to remove grid lines
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';

    // Split the text into lines
    const lines = data.split('\n');

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = lines[0].split(','); // Assuming the first line is the header
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      // Add padding for header cells
      th.style.padding = '0px 10px'; // Adjust pixel value for desired padding
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    for (let i = 1; i < lines.length; i++) {
      const row = document.createElement('tr');
      const cells = lines[i].split(',');
      cells.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        // Add padding for data cells
        td.style.padding = '0px 10px'; // Adjust pixel value for desired padding
        row.appendChild(td);
      });
      tbody.appendChild(row);
    }
    table.appendChild(tbody);

    // Append the table to the HTML element
    upcomingfeaturesDiv.appendChild(table);
  })
  .catch(error => {
    console.error('Error fetching release notes:', error);
    upcomingfeaturesDiv.textContent = "Error fetching release notes.";
  });