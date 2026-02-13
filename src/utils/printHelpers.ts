


export const printDocument = (htmlContent: string) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    alert('Please allow popups to print');
    return;
  }

  // Parse the font size to determine a relative scale for headings
  // If user selected "text-3xl" (large), we want headings to be even larger
  // But for simplicity, we'll apply the user's font selection to the BODY,
  // and let headings be relative (em) or just explicitly styled.

  // Tailwind map to CSS values for the print window


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
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.5;
            color: black;
            background: white;
            margin: 0;
            padding: 0;
          }
          
          /* Typography */
          p { margin-bottom: 1em; }
          strong { font-weight: bold; }
          em { font-style: italic; }
          u { text-decoration: underline; }
          
          /* Headings relative to the base font size */
          h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; margin-top: 0; }
          h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; margin-top: 1em; }
          h3 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; margin-top: 1em; }
          
          ul, ol { margin: 1em 0; padding-left: 1.5em; }
          li { margin-bottom: 0.25em; }
          
          /* Clean up artifacts */
          * {
            background-color: transparent !important;
            color: black !important;
            box-shadow: none !important;
            text-shadow: none !important;
            -webkit-print-color-adjust: exact;
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

  let hasPrinted = false;
  const triggerPrint = () => {
    if (hasPrinted) return;
    hasPrinted = true;
    try {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } catch (e) {
      console.error("Print error", e);
    }
  };

  // Wait for content to load (images etc) then print
  printWindow.onload = triggerPrint;

  // Fallback for browsers where onload matches write completion
  setTimeout(triggerPrint, 500);
};

