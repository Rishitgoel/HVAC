import { jsPDF } from 'jspdf';
import { calculateTotals, mmToM } from './calculations.js';
import { getSettings } from './storage.js';

// ─── PREMIUM COLOUR PALETTE (Matching Reference Design) ──────────────────────
const C = {
  headerBg:   [13, 13, 13],      // #0D0D0D - Deep charcoal/black header
  headerTitle:[255, 255, 255],   // Crisp white
  headerSub:  [160, 160, 160],   // Muted grey for subtitle
  accentRed:  [220, 53, 34],     // #DC3522 - Striking red/orange accent (QTE-PROFORMA, Grand Total)
  textMain:   [20, 20, 20],      // #141414 - Dark body text
  textMuted:  [130, 130, 130],   // #828282 - Category headers / muted labels
  lineLight:  [230, 230, 230],   // #E6E6E6 - Subtle horizontal dividers
  lineDark:   [20, 20, 20],      // Thick black divider for grand total
  cardBg:     [248, 248, 248],   // #F8F8F8 - OPEX card background
  cardBorder: [220, 220, 220]    // #DCDCDC - OPEX card border
};

// ─── CURRENCY FORMATTER ───────────────────────────────────────────────────────
const fmt = (n) => {
  if (!n || isNaN(n)) return 'Rs. 0';
  const abs = Math.round(Math.abs(n));
  const str = abs.toString();
  let result = '';
  if (str.length <= 3) {
    result = str;
  } else {
    const last3 = str.slice(-3);
    const rest   = str.slice(0, -3);
    const chunks = [];
    let r = rest;
    while (r.length > 2) { chunks.unshift(r.slice(-2)); r = r.slice(0, -2); }
    if (r.length) chunks.unshift(r);
    result = chunks.join(',') + ',' + last3;
  }
  return `Rs. ${result}`;
};

// ─── LINE ITEM BUILDER (Structured like Reference Design) ────────────────────
const buildSections = (sheet, settings) => {
  const sections = [];
  const us = settings.unitSystem === 'sqft' ? 'sqft' : 'm²';

  // 1. Architecture & Casing
  const arch = sheet.architecture || {};
  const alCost  = (arch.aluminumWeight || 0) * (settings.aluminumRate || 0);
  const puffSqm = (arch.puffLength || 0) * (arch.puffWidth || 0);
  let   puffR   = settings.puffPanelRate || 0;
  if (settings.unitSystem === 'sqft') puffR *= 10.7639;
  const puffCost = puffSqm * puffR;
  const giCost   = (arch.giWeight || 0) * (settings.giRate || 0);
  
  const archRows = [];
  if (alCost)           archRows.push({ subcat: 'INTERNAL STRUCTURE', label: `Aluminium Frame (${arch.aluminumWeight || 0} kg @ Rs.${settings.aluminumRate || 0}/kg)`, amt: alCost });
  if (giCost)           archRows.push({ subcat: 'CASING PROFILE', label: `Heavy-duty GI Sheet (${arch.giWeight || 0} kg @ Rs.${settings.giRate || 0}/kg)`, amt: giCost });
  if (puffCost)         archRows.push({ subcat: 'PUF PANELS', label: `Extruded PUF Panel (${puffSqm.toFixed(2)} ${us} @ Rs.${Math.round(puffR)}/${us})`, amt: puffCost });
  if (arch.pulleyPrice) archRows.push({ subcat: 'DRIVE MECHANISM', label: 'Pulley & Transmission Accessories', amt: arch.pulleyPrice });
  if (arch.hardwarePrice) archRows.push({ subcat: 'CASING FIXTURES', label: 'Hardware & Miscellaneous Assembly', amt: arch.hardwarePrice });
  if (archRows.length) sections.push({ title: 'COMPONENT ARCHITECTURE BREAKDOWN', rows: archRows });

  // 2. Air Movement Systems
  const air = sheet.airMovement || {};
  const airRows = [];
  (air.fans || []).forEach(f => {
    const rate = settings[`${f.type}FanPrice`] || 0;
    const cost = (f.quantity || 0) * rate;
    if (cost) airRows.push({ subcat: 'FAN / BLOWER ARRAY', label: `${f.type.charAt(0).toUpperCase() + f.type.slice(1)} Blower Array x${f.quantity} (Rs.${rate} ea)`, amt: cost });
  });
  if (air.motorPrice) airRows.push({ subcat: 'DRIVE MOTORS', label: 'High Efficiency Drive Motor Unit', amt: air.motorPrice });
  if (airRows.length) sections.push({ title: 'AIR MOVEMENT & DRIVE SYSTEMS', rows: airRows });

  // 3. Thermodynamics (Coil & Pad)
  const th = sheet.thermodynamics || {};
  const coilSqm = mmToM(th.coilLength || 0) * mmToM(th.coilBreadth || 0);
  let coilR = settings.coilRate || 0;
  if (settings.unitSystem === 'sqft') coilR *= 10.7639;
  const coilCost = coilSqm * (th.coilRows || 1) * coilR;
  const padArea  = (th.padLength || 0) * (th.padWidth || 0);
  const padR     = th.padType === 'green' ? (settings.greenPadRate || 220) : (settings.brownPadRate || 190);
  const padCost  = padArea * padR;
  
  const thermoRows = [];
  if (coilCost) thermoRows.push({ subcat: 'COOLING / HEATING COILS', label: `Chilled Water / DX Coil (${th.coilRows || 1} Row, ${coilSqm.toFixed(2)} m²)`, amt: coilCost });
  if (padCost)  thermoRows.push({ subcat: 'EVAPORATIVE PADS', label: `Celdek ${th.padType === 'green' ? 'Green' : 'Brown'} Evaporative Pad (${padArea.toFixed(2)} ${us})`, amt: padCost });
  if (thermoRows.length) sections.push({ title: 'THERMODYNAMICS & HEAT TRANSFER', rows: thermoRows });

  // 4. Filtration Stages
  const fi = sheet.filtration || {};
  const filtRows = [];
  if (fi.preQty)  filtRows.push({ subcat: 'PRIMARY FILTRATION', label: `Pre-Filter Stage x${fi.preQty} (Rs.${settings.preFilterPrice || 0} ea)`, amt: (fi.preQty || 0) * (settings.preFilterPrice || 0) });
  if (fi.fineQty) filtRows.push({ subcat: 'SECONDARY FILTRATION', label: `Fine Filter Stage x${fi.fineQty} (Rs.${settings.fineFilterPrice || 0} ea)`, amt: (fi.fineQty || 0) * (settings.fineFilterPrice || 0) });
  if (fi.hepaQty) filtRows.push({ subcat: 'FINAL STAGE FILTRATION', label: `HEPA Final Stage x${fi.hepaQty} (Rs.${settings.hepaFilterPrice || 0} ea)`, amt: (fi.hepaQty || 0) * (settings.hepaFilterPrice || 0) });
  if (filtRows.length) sections.push({ title: 'FILTRATION & AIR PURIFICATION', rows: filtRows });

  // 5. Labor & Installation
  const ra = sheet.rates || {};
  const laborRows = [];
  if (ra.laborCost) laborRows.push({ subcat: 'ASSEMBLY & SKILLED LABOR', label: 'Complete System Assembly & Skilled Labor', amt: ra.laborCost });
  if (laborRows.length) sections.push({ title: 'LABOR & FABRICATION', rows: laborRows });

  return { sections, opexCost: ra.electricityCost || 0 };
};

// ─── THIN HORIZONTAL RULE HELPER ──────────────────────────────────────────────
const hline = (doc, y, x1, x2, color = C.lineLight, w = 0.2) => {
  doc.setDrawColor(...color);
  doc.setLineWidth(w);
  doc.line(x1, y, x2, y);
};

// ─── MAIN PDF GENERATOR ───────────────────────────────────────────────────────
export const generatePDF = async (projectData, sheetData, returnBlob = false) => {
  const settings = await getSettings();
  const totals   = calculateTotals(sheetData, settings);
  const { sections, opexCost } = buildSections(sheetData, settings);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const PW  = doc.internal.pageSize.width;   // 210mm
  const PH  = doc.internal.pageSize.height;  // 297mm
  const ML  = 16;       // Left margin
  const MR  = PW - 16;  // Right margin
  const CW  = MR - ML;  // Content width

  let totalPages = 1;
  let currentPage = 1;

  // ─── PAGE MANAGEMENT HELPER (Prevents Collapsing / Overlap) ─────────────────
  const checkPageBreak = (requiredHeight, currentY) => {
    if (currentY + requiredHeight > PH - 22) { // Leave 22mm for footer margin
      doc.addPage();
      currentPage++;
      totalPages++;
      return 20; // New Y position at top of new page
    }
    return currentY;
  };

  // ─── 1. DARK MODE HEADER BANNER (Exactly matching reference) ────────────────
  const HEADER_H = 65;
  doc.setFillColor(...C.headerBg);
  doc.rect(0, 0, PW, HEADER_H, 'F');

  // Title: NABHAS AIRCON (Bold, clean, non-italic)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...C.headerTitle);
  doc.text('NABHAS AIRCON', ML, 22);

  // Subtitle: HVAC COMMAND SYSTEMS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.headerSub);
  doc.text('HVAC COMMAND SYSTEMS  //  INDUSTRIAL INTELLIGENCE', ML, 28);

  // Top Right: QTE-PROFORMA & Date
  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...C.accentRed);
  doc.text('QTE-PROFORMA', MR, 20, { align: 'right' });

  const dateStr = new Date(sheetData.updatedAt?.toDate?.() || new Date())
    .toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...C.headerSub);
  doc.text(`Date: ${dateStr}`, MR, 26, { align: 'right' });
  doc.text(`Ref: ${sheetData.id?.split('-')[1] || sheetData.id || 'N/A'}`, MR, 31, { align: 'right' });

  // Thin divider inside dark header
  hline(doc, 36, ML, MR, [35, 35, 35], 0.3);

  // Project Specs Block inside dark header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('PROJECT SPECS', ML, 43);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...C.headerTitle);
  doc.text(`Client: ${projectData.clientName || 'N/A'}`, ML, 49);
  doc.text(`Project: ${projectData.title || 'N/A'}`, ML, 54);
  doc.text(`Airflow: ${sheetData.clientInfo?.cfmRequirement || 0} CFM`, ML + 80, 49);
  doc.text(`Environment: ${sheetData.clientInfo?.roomName || 'General'}`, ML + 80, 54);

  let y = HEADER_H + 12;

  // ─── 1b. SECTION TITLE: QUOTATION SUMMARY ───────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...C.textMain);
  doc.text('QUOTATION SUMMARY', ML, y);
  
  y += 4;
  hline(doc, y, ML, MR, C.accentRed, 0.5); // Elegant red accent line under quotation summary
  y += 8;

  // ─── 2. TABLE & LINE ITEMS ──────────────────────────────────────────────────
  const DESC_X = ML;
  const AMT_X  = MR;

  sections.forEach((sec, sIndex) => {
    // Check space for section header + at least one item (approx 25mm)
    y = checkPageBreak(25, y);

    // Section Header (e.g. COMPONENT ARCHITECTURE BREAKDOWN ... EXT. PRICE)
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.textMuted);
    doc.text(sec.title, DESC_X, y);
    if (sIndex === 0) {
      doc.text('EXT. PRICE', AMT_X, y, { align: 'right' });
    }

    y += 3;
    hline(doc, y, ML, MR, C.lineLight, 0.4);
    y += 6;

    // Items
    sec.rows.forEach(row => {
      // Check space for item row (approx 12mm)
      y = checkPageBreak(12, y);

      // Subcategory label (e.g. CABINET CASING FOUNDATION / INTERNAL STRUCTURE)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.textMuted);
      doc.text(row.subcat, DESC_X, y);
      y += 4.5;

      // Item Description & Price
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...C.textMain);
      doc.text(row.label, DESC_X, y);
      
      doc.setFont('courier', 'bold');
      doc.setFontSize(9.5);
      doc.text(fmt(row.amt), AMT_X, y, { align: 'right' });

      y += 4;
      hline(doc, y, ML, MR, C.lineLight, 0.2);
      y += 5;
    });

    y += 6; // Extra space before next major category
  });

  // ─── 3. TOTALS SUMMARY BLOCK (Exactly matching reference) ───────────────────
  // We need approx 45mm for the totals block + grand total
  y = checkPageBreak(45, y);

  const TOT_W = 85;
  const TOT_X = MR - TOT_W;
  const LBL_X = TOT_X + 5;
  const VAL_X = MR;

  // Mfg. Subtotal
  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...C.textMuted);
  doc.text('Mfg. Subtotal:', LBL_X, y);
  doc.setFont('courier', 'bold');
  doc.setTextColor(...C.textMain);
  doc.text(fmt(totals.subtotal), VAL_X, y, { align: 'right' });
  y += 6;

  // Taxes
  doc.setFont('courier', 'normal');
  doc.setTextColor(...C.textMuted);
  doc.text(`Taxes & Duties (${settings.taxRate || 18}%):`, LBL_X, y);
  doc.setFont('courier', 'bold');
  doc.setTextColor(...C.textMain);
  doc.text(fmt(totals.tax), VAL_X, y, { align: 'right' });
  y += 8;

  // Thick black line above Grand Total
  hline(doc, y, TOT_X, MR, C.lineDark, 0.8);
  y += 8;

  // GRAND TOTAL (Bold label + Striking Red/Orange large amount)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...C.textMain);
  doc.text('GRAND TOTAL', TOT_X, y + 2);

  doc.setFont('courier', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...C.accentRed);
  doc.text(fmt(totals.total), VAL_X, y + 2, { align: 'right' });
  y += 14;

  // ─── 4. OPEX / ELECTRICITY CARD (Exactly matching reference bottom card) ────
  // Needs approx 30mm
  y = checkPageBreak(30, y);

  const CARD_H = 24;
  doc.setFillColor(...C.cardBg);
  doc.setDrawColor(...C.cardBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(ML, y, CW, CARD_H, 2, 2, 'FD');

  // Red accent bar on the left edge of the card
  doc.setFillColor(...C.accentRed);
  doc.roundedRect(ML, y, 3, CARD_H, 2, 2, 'F');
  // Square off the right side of the red accent bar so it blends with the card
  doc.rect(ML + 1.5, y, 1.5, CARD_H, 'F');

  const cardY = y + 6;
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...C.textMain);
  doc.text('OPEX ESTIMATION (ELECTRICITY & RUNNING COST)', ML + 7, cardY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...C.textMuted);
  doc.text(`Estimated Operational Cost: ${fmt(opexCost)} per standard operational cycle.`, ML + 7, cardY + 6);
  
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  const opexNote = '*Operational expenses are calculated dynamically based on system load and motor efficiency. This is a separate metric from the Capital Expenditure Grand Total above.';
  const splitNote = doc.splitTextToSize(opexNote, CW - 12);
  doc.text(splitNote, ML + 7, cardY + 11);

  // ─── 5. DYNAMIC FOOTER ON ALL PAGES ─────────────────────────────────────────
  const totalCreatedPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalCreatedPages; i++) {
    doc.setPage(i);
    const footY = PH - 12;

    hline(doc, footY - 4, ML, MR, C.lineLight, 0.3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.textMain);
    doc.text('NABHAS AIRCON // INDUSTRIAL INTELLIGENCE', ML, footY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.textMuted);
    doc.text(`Page ${i} of ${totalCreatedPages}`, MR, footY, { align: 'right' });
  }

  // ─── OUTPUT ─────────────────────────────────────────────────────────────────
  if (returnBlob) return doc.output('blob');
  const name = `Quotation_${(projectData.clientName || 'Client').replace(/\s+/g, '_')}_${(sheetData.title || 'Sheet').replace(/\s+/g, '_')}.pdf`;
  doc.save(name);
};
