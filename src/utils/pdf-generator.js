import html2pdf from 'html2pdf.js';
import { calculateTotals, mmToM } from './calculations.js';
import { getSettings } from './storage.js';

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

export const generatePDF = async (projectData, sheetData, returnBlob = false) => {
  const settings = await getSettings();
  const totals   = calculateTotals(sheetData, settings);
  const { sections, opexCost } = buildSections(sheetData, settings);

  // Generate HTML Template
  const dateStr = new Date(sheetData.updatedAt?.toDate?.() || new Date())
    .toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const refStr = sheetData.id?.split('-')[1] || sheetData.id || 'N/A';

  const htmlContent = `
    <div id="pdf-export-container" style="width: 800px; font-family: 'Inter', sans-serif; color: #141414; background-color: #ffffff; padding: 0;">
      <!-- Header -->
      <div style="background-color: #0D0D0D; padding: 40px; display: flex; justify-content: space-between; align-items: flex-start; color: #ffffff;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <img src="/logo.svg" alt="Nabhas Logo" style="height: 60px; filter: brightness(0) invert(1);" />
          <div style="transform: translateY(-10px);">
            <h1 style="margin: 0 0 6px 0; font-family: 'Hanken Grotesk', sans-serif; font-weight: 700; font-size: 32px; letter-spacing: -0.02em; line-height: 1;">NABHAS AIRCON</h1>
            <p style="margin: 0; color: #A0A0A0; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; line-height: 1;">HVAC COMMAND SYSTEMS // INDUSTRIAL INTELLIGENCE</p>
          </div>
        </div>
        <div style="text-align: right; font-family: 'Inter', monospace;">
          <h2 style="margin: 0; color: #DC3522; font-size: 16px; font-weight: 700; letter-spacing: 0.05em;">QTE-PROFORMA</h2>
          <p style="margin: 6px 0 0; color: #A0A0A0; font-size: 12px;">Date: ${dateStr}</p>
          <p style="margin: 4px 0 0; color: #A0A0A0; font-size: 12px;">Ref: ${refStr}</p>
        </div>
      </div>

      <!-- Project Specs -->
      <div style="padding: 20px 40px; background-color: #1A1A1A; display: flex; justify-content: space-between; border-bottom: 2px solid #333;">
        <div>
          <span style="color: #888; font-size: 11px; font-weight: 600; text-transform: uppercase;">Project Specs</span>
          <p style="margin: 6px 0 0; color: #fff; font-size: 14px; font-weight: 600;">Client: ${projectData.clientName || 'N/A'}</p>
          <p style="margin: 4px 0 0; color: #fff; font-size: 14px; font-weight: 600;">Project: ${projectData.title || 'N/A'}</p>
        </div>
        <div style="text-align: right;">
          <span style="color: #1A1A1A; font-size: 11px;">&nbsp;</span>
          <p style="margin: 6px 0 0; color: #fff; font-size: 14px; font-weight: 600;">Airflow: ${sheetData.clientInfo?.cfmRequirement || 0} CFM</p>
          <p style="margin: 4px 0 0; color: #fff; font-size: 14px; font-weight: 600;">Environment: ${sheetData.clientInfo?.roomName || 'General'}</p>
        </div>
      </div>

      <!-- Content -->
      <div style="padding: 40px;">
        <h2 style="margin: 0; font-family: 'Hanken Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: #141414;">QUOTATION SUMMARY</h2>
        <div style="width: 100%; height: 2px; background-color: #DC3522; margin: 12px 0 24px;"></div>

        ${sections.map(sec => `
          <div style="margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #828282; margin-bottom: 8px; font-family: 'Inter', monospace; text-transform: uppercase;">
              <span>${sec.title}</span>
              <span>EXT. PRICE</span>
            </div>
            <div style="width: 100%; height: 1px; background-color: #E6E6E6; margin-bottom: 12px;"></div>
            
            ${sec.rows.map(row => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <div>
                  <div style="font-size: 10px; font-weight: 700; color: #828282; margin-bottom: 4px; text-transform: uppercase;">${row.subcat}</div>
                  <div style="font-size: 14px; font-weight: 600; color: #141414;">${row.label}</div>
                </div>
                <div style="font-size: 14px; font-weight: 700; font-family: 'Inter', monospace; color: #141414; display: flex; align-items: flex-end;">
                  ${fmt(row.amt)}
                </div>
              </div>
              <div style="width: 100%; height: 1px; background-color: #F0F0F0; margin-bottom: 16px;"></div>
            `).join('')}
          </div>
        `).join('')}

        <!-- Totals -->
        <div style="margin-top: 40px; display: flex; justify-content: flex-end;">
          <div style="width: 320px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px;">
              <span style="color: #828282;">Mfg. Subtotal:</span>
              <span style="font-weight: 700; font-family: 'Inter', monospace;">${fmt(totals.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 13px;">
              <span style="color: #828282;">Taxes & Duties (${settings.taxRate || 18}%):</span>
              <span style="font-weight: 700; font-family: 'Inter', monospace;">${fmt(totals.tax)}</span>
            </div>
            <div style="width: 100%; height: 3px; background-color: #141414; margin-bottom: 16px;"></div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-family: 'Hanken Grotesk', sans-serif; font-size: 16px; font-weight: 700;">GRAND TOTAL</span>
              <span style="font-size: 24px; font-weight: 700; color: #DC3522; font-family: 'Inter', monospace;">${fmt(totals.total)}</span>
            </div>
          </div>
        </div>

        <!-- OPEX Card -->
        <div style="margin-top: 50px; background-color: #F8F8F8; border: 1px solid #DCDCDC; border-radius: 6px; padding: 20px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; bottom: 0; width: 6px; background-color: #DC3522;"></div>
          <h3 style="margin: 0 0 8px 12px; font-size: 12px; font-weight: 700; color: #141414; font-family: 'Inter', monospace; text-transform: uppercase;">OPEX ESTIMATION (ELECTRICITY & RUNNING COST)</h3>
          <p style="margin: 0 0 12px 12px; font-size: 12px; color: #666; font-weight: 500;">Estimated Operational Cost: <strong>${fmt(opexCost)}</strong> per standard operational cycle.</p>
          <p style="margin: 0 0 0 12px; font-size: 10px; color: #999; line-height: 1.4;">*Operational expenses are calculated dynamically based on system load and motor efficiency. This is a separate metric from the Capital Expenditure Grand Total above.</p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="padding: 20px 40px; margin-top: auto; border-top: 1px solid #E6E6E6; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 10px; font-weight: 700; color: #141414;">NABHAS AIRCON // INDUSTRIAL INTELLIGENCE</span>
        <span style="font-size: 10px; color: #828282;">This is a system generated quotation. Rates are valid for 30 days.</span>
      </div>
    </div>
  `;

  // Create temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  const element = document.getElementById('pdf-export-container');

  // Options for html2pdf
  const opt = {
    margin:       [0, 0, 0, 0],
    filename:     `Quotation_${(projectData.clientName || 'Client').replace(/\s+/g, '_')}_${(sheetData.title || 'Sheet').replace(/\s+/g, '_')}.pdf`,
    image:        { type: 'jpeg', quality: 1 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  try {
    if (returnBlob) {
      const worker = html2pdf().set(opt).from(element);
      const pdfBlob = await worker.output('blob');
      document.body.removeChild(container);
      return pdfBlob;
    } else {
      await html2pdf().set(opt).from(element).save();
      document.body.removeChild(container);
    }
  } catch (error) {
    console.error("PDF generation failed:", error);
    document.body.removeChild(container);
  }
};
