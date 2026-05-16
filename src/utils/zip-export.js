import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getProject, getSheets } from './storage.js';
import { generatePDF } from './pdf-generator.js';

export const exportProjectToZip = async (pid) => {
  const project = await getProject(pid);
  if (!project) throw new Error("Project not found");

  const sheets = await getSheets(pid);
  if (sheets.length === 0) throw new Error("No sheets to export");

  const zip = new JSZip();
  const folderName = `${project.clientName}_${project.title}`.replace(/[^a-z0-9]/gi, '_');
  const projectFolder = zip.folder(folderName);

  // Generate a PDF for each sheet and add to ZIP
  for (const sheet of sheets) {
    if (sheet.status !== 'published') continue; // Optionally only export published
    const blob = await generatePDF(project, sheet, true);
    const fileName = `${sheet.title}_${sheet.id.split('-')[1]}.pdf`.replace(/[^a-z0-9.]/gi, '_');
    projectFolder.file(fileName, blob);
  }

  // Generate the ZIP
  const zipContent = await zip.generateAsync({ type: "blob" });
  
  // Save using file-saver
  saveAs(zipContent, `${folderName}_Quotes.zip`);
};
