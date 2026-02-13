

export const printDocument = (htmlContent: string, fontFamily: string, fontSize: string) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    alert('Please allow popups to print');
    return;
  }

  // Generate the full HTML structure for the print window
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Document</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Inter:wght@400;700&family=Outfit:wght@400;700&family=Roboto:wght@400;700&display=swap');
          
          @page {
            margin: 1in;
            size: auto;
          }
          body {
            font-family: ${fontFamily}, Arial, sans-serif !important;
            font-size: ${fontSize} !important;
            line-height: 1.5;
            color: black;
            background: white;
            margin: 0; /* Margin handled by @page */
            padding: 0;
          }
          /* Basic formatting preservation */
          strong { font-weight: bold; }
          em { font-style: italic; }
          u { text-decoration: underline; }
          h1 { get-font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
          h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
          h3 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; }
          ul, ol { margin: 1em 0; padding-left: 1.5em; }
          li { margin-bottom: 0.25em; }
          p { margin-bottom: 1em; }
          
          /* Remove any dark mode or custom background artifacts */
          * {
            background-color: transparent !important;
            color: black !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  // Write content to the new window
  printWindow.document.write(html);
  printWindow.document.close(); // Finish writing

  // Wait for content to load (images etc) then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    // Optional: Close window after print (some browsers block this if print dialog is open)
    // printWindow.close(); 
  };

  // Fallback for browsers where onload matches write completion
  setTimeout(() => {
    try {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } catch (e) {
      console.error("Print error", e);
    }
  }, 500);
};
