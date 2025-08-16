const fs = require('fs');

const pdf = require('pdf-parse');

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    const text = data.text;
    const pages = text.split('\n\n').filter((page) => page.trim());

    return {
      totalPages: data.numpages,
      fullText: text,
      pageTexts: pages,
      metadata: data.info,
    };
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};

module.exports = { extractTextFromPDF };
