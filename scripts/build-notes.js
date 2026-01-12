const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const NOTES_DIR = path.join(__dirname, '../public/notes');
const OUTPUT_FILE = path.join(__dirname, '../public/notes.json');

async function buildNotes() {
  if (!fs.existsSync(NOTES_DIR)) {
    console.log('No notes directory found, creating empty index.');
    fs.writeFileSync(OUTPUT_FILE, '[]');
    return;
  }

  const files = fs.readdirSync(NOTES_DIR).filter(file => file.endsWith('.docx'));
  const notes = [];

  console.log(`Found ${files.length} note(s)...`);

  for (const file of files) {
    const filePath = path.join(NOTES_DIR, file);
    try {
      const { value: html } = await mammoth.convertToHtml({ path: filePath });
      // Extract summary (first 100 chars or first paragraph)
      const textContent = html.replace(/<[^>]+>/g, ' '); // simple strip tags
      const summary = textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent;

      // Get file creation time as date
      const stats = fs.statSync(filePath);
      
      notes.push({
        id: file.replace('.docx', ''), // simple id
        filename: file,
        url: `/notes/${file}`, // raw file access
        date: stats.birthtime.toISOString().split('T')[0],
        content: html,
        summary: summary
      });
      console.log(`Processed: ${file}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  // Sort by date desc
  notes.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(notes, null, 2));
  console.log(`Notes index generated at ${OUTPUT_FILE}`);
}

buildNotes();
