import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { calculateTotals, formatCurrency } from './calculations.js';
import { getSettings } from './storage.js';

// Convert image to base64 for PDF embedding
const getBase64ImageFromURL = (url) => {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = error => reject(error);
    img.src = url;
  });
};

export const generatePDF = async (projectData, sheetData, returnBlob = false) => {
  const settings = await getSettings();
  const totals = calculateTotals(sheetData, settings);

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Try to load logo
  try {
    const logoBase64 = await getBase64ImageFromURL('/src/assets/logo.svg'); // SVG might not work directly in canvas without proper viewBox/width/height, so we'll just add text fallback or try.
    // If it fails, we fall back.
  } catch (e) {
    // Logo loading failed, skip image
  }

  // Header Background
  doc.setFillColor(5, 65, 43); // #05412b (primary-container)
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Nabhas Aircon', 14, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('HVAC Estimation Engine', 14, 32);

  // Quote Details right side
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', pageWidth - 14, 20, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const dateStr = new Date(sheetData.updatedAt?.toDate() || new Date()).toLocaleDateString('en-IN');
  doc.text(`Date: ${dateStr}`, pageWidth - 14, 26, { align: 'right' });
  doc.text(`Ref: ${sheetData.id.split('-')[1] || sheetData.id}`, pageWidth - 14, 32, { align: 'right' });

  // Client Info Section
  doc.setTextColor(15, 28, 45); // on-surface
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared For:', 14, 55);
  
  doc.setFontSize(14);
  doc.text(projectData.clientName || 'Unknown Client', 14, 63);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project: ${projectData.title}`, 14, 70);
  doc.text(`Requirement: ${sheetData.clientInfo?.cfmRequirement || 0} CFM`, 14, 76);
  doc.text(`Location: ${sheetData.clientInfo?.roomName || 'General'}`, 14, 82);

  // Table
  const tableData = [
    ['Architecture & Casing', formatCurrency(totals.architecture)],
    ['Air Movement Systems', formatCurrency(totals.airMovement)],
    ['Thermodynamics (Coil & Pad)', formatCurrency(totals.thermodynamics)],
    ['Filtration Stages', formatCurrency(totals.filtration)],
    ['Labor & Installation', formatCurrency(totals.labor)]
  ];

  doc.autoTable({
    startY: 95,
    head: [['Description', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [5, 65, 43], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 50, halign: 'right' }
    },
    styles: { fontSize: 10, cellPadding: 5 }
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // Totals
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', pageWidth - 64, finalY);
  doc.text(formatCurrency(totals.subtotal), pageWidth - 14, finalY, { align: 'right' });

  doc.text(`Tax (${settings.taxRate || 18}%):`, pageWidth - 64, finalY + 8);
  doc.text(formatCurrency(totals.tax), pageWidth - 14, finalY + 8, { align: 'right' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', pageWidth - 64, finalY + 20);
  doc.text(formatCurrency(totals.total), pageWidth - 14, finalY + 20, { align: 'right' });

  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('This is a system generated quotation. Rates are valid for 30 days.', pageWidth / 2, doc.internal.pageSize.height - 15, { align: 'center' });

  if (returnBlob) {
    return doc.output('blob');
  } else {
    doc.save(`Quote_${projectData.clientName}_${sheetData.title}.pdf`.replace(/\s+/g, '_'));
  }
};
