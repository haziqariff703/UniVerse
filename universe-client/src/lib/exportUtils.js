/**
 * Converts an array of objects to CSV format and triggers a file download.
 * @param {Array<Object>} data - The data to export.
 * @param {string} filename - The name of the file to save (without extension).
 * @param {Array<string>} [headers] - Optional custom headers. If not provided, keys of the first object are used.
 */
export const downloadCSV = (data, filename = "export", headers = null) => {
  if (!data || !data.length) {
    console.warn("No data to export");
    return;
  }

  // Determine headers
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Convert data to CSV string
  const csvRows = [
    csvHeaders.join(","), // Header row
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header];
        // Handle strings with commas, quotes, or newlines
        const escaped = String(value === null || value === undefined ? "" : value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(",")
    )
  ];

  const csvString = csvRows.join("\n");

  // Create a Blob and trigger download
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
