fetch('release_notes.txt')
  .then(response => response.text())
  .then(data => {
    const releaseNotesDiv = document.getElementById('release-notes');

    // Create a table element
    const table = document.createElement('table');

    // Add thin border to table
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
      th.style.border = '1px solid black'; // Thin border for header cells
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
        td.style.border = '1px solid black'; // Thin border for data cells
        row.appendChild(td);
      });
      tbody.appendChild(row);
    }
    table.appendChild(tbody);

    // Append the table to the HTML element
    releaseNotesDiv.appendChild(table);
  })
  .catch(error => {
    console.error('Error fetching release notes:', error);
    releaseNotesDiv.textContent = "Error fetching release notes.";
  });
