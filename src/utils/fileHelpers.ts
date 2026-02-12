import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
// @ts-ignore
// import htmlDocx from 'html-docx-js-typescript'; // Refactored to dynamic import

/**
 * Saves content as an HTML file (Native Project Format)
 */
export const saveAsHTML = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${filename}.html`);
};

// ... (skipping saveAsTXT)

/**
 * Exports content as a Microsoft Word document (.docx)
 */
export const exportAsDOCX = async (htmlContent: string, filename: string) => {
    // Dynamic import to avoid build issues with CommonJS module in CI
    // @ts-ignore
    const htmlDocx = (await import('html-docx-js-typescript')).default;

    // Wrap content in a basic HTML structure for better Word compatibility
    const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${filename}</title>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

    const converted = await htmlDocx.asBlob(fullHtml);
    saveAs(converted as Blob, `${filename}.docx`);
};

/**
 * Imports content from a file (HTML, TXT, DOCX)
 * Returns a promise that resolves to the HTML content
 */
export const importFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const extension = file.name.split('.').pop()?.toLowerCase();

        if (extension === 'html' || extension === 'htm') {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        }
        else if (extension === 'txt') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                // Convert plain text to basic HTML (paragraphs)
                const html = text.split('\n').map(line => `<p>${line}</p>`).join('');
                resolve(html);
            };
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        }
        else if (extension === 'docx') {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    resolve(result.value);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        }
        else {
            reject(new Error('Unsupported file type'));
        }
    });
};
