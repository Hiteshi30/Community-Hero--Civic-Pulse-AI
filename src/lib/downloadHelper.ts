import { Complaint } from '../types';

/**
 * Formats a timestamp into a readable localized Indian standard date and time.
 */
function formatDateTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

/**
 * Compiles a beautiful, highly detailed official municipal complaint report HTML
 * and triggers an immediate download in the browser.
 */
export function downloadComplaintReport(complaint: Complaint): void {
  const receiptNum = complaint.id.substring(0, 8).toUpperCase();
  const dateFormatted = formatDateTime(complaint.createdAt);
  const statusColor = complaint.status === 'RESOLVED' ? '#10b981' : '#f59e0b';
  const priorityColor = complaint.priority === 'CRITICAL' ? '#ef4444' : complaint.priority === 'HIGH' ? '#f59e0b' : '#3b82f6';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CivicPulse Receipt - ${complaint.title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .print-actions {
      background-color: #1e1b4b;
      padding: 15px;
      text-align: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .btn {
      background-color: #4f46e5;
      color: white;
      border: none;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: background-color 0.2s;
      text-decoration: none;
    }
    .btn:hover {
      background-color: #4338ca;
    }
    .btn-secondary {
      background-color: #334155;
      margin-left: 10px;
    }
    .btn-secondary:hover {
      background-color: #1e293b;
    }
    .container {
      max-width: 800px;
      margin: 30px auto;
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 25px;
      margin-bottom: 30px;
    }
    .logo-area h1 {
      margin: 0;
      color: #4f46e5;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .logo-area p {
      margin: 2px 0 0 0;
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .receipt-meta {
      text-align: right;
    }
    .receipt-meta h2 {
      margin: 0;
      font-size: 18px;
      color: #0f172a;
      font-weight: 800;
    }
    .receipt-meta p {
      margin: 4px 0 0 0;
      font-size: 12px;
      color: #64748b;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: bold;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    .badge-status {
      background-color: ${complaint.status === 'RESOLVED' ? '#d1fae5' : '#fef3c7'};
      color: ${statusColor};
    }
    .badge-priority {
      background-color: ${complaint.priority === 'CRITICAL' ? '#fee2e2' : complaint.priority === 'HIGH' ? '#fef3c7' : '#dbeafe'};
      color: ${priorityColor};
    }
    .grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 25px;
      margin-bottom: 30px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
    }
    .card h3 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #475569;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 8px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-bottom: 10px;
    }
    .detail-row:last-child {
      margin-bottom: 0;
    }
    .detail-label {
      color: #64748b;
      font-weight: bold;
    }
    .detail-value {
      color: #0f172a;
      font-weight: 600;
    }
    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 35px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .complaint-desc {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
    }
    .ai-report {
      border: 1px dashed #4f46e5;
      background: #e0e7ff33;
    }
    .ai-report h3 {
      border-bottom: 1px dashed #c7d2fe;
      color: #3730a3;
    }
    .timeline {
      position: relative;
      padding-left: 30px;
      margin-top: 20px;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 9px;
      top: 5px;
      bottom: 5px;
      width: 2px;
      background-color: #cbd5e1;
    }
    .timeline-event {
      position: relative;
      margin-bottom: 20px;
    }
    .timeline-event:last-child {
      margin-bottom: 0;
    }
    .timeline-marker {
      position: absolute;
      left: -30px;
      top: 4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #4f46e5;
      border: 4px solid #fff;
      box-shadow: 0 0 0 1px #cbd5e1;
    }
    .timeline-marker.resolved {
      background-color: #10b981;
    }
    .timeline-content {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 12px 18px;
      border-radius: 8px;
    }
    .timeline-time {
      font-size: 11px;
      color: #64748b;
      font-weight: bold;
    }
    .timeline-status {
      font-weight: bold;
      color: #0f172a;
      font-size: 13px;
      margin-bottom: 3px;
    }
    .timeline-note {
      font-size: 12px;
      color: #475569;
    }
    .timeline-by {
      font-size: 10px;
      color: #94a3b8;
      margin-top: 5px;
      text-transform: uppercase;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      margin-top: 50px;
      padding-top: 25px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #94a3b8;
    }
    .evidence-img {
      width: 100%;
      max-height: 320px;
      object-fit: cover;
      border-radius: 12px;
      margin-top: 15px;
      border: 1px solid #cbd5e1;
    }
    @media print {
      body {
        background-color: white;
      }
      .print-actions {
        display: none !important;
      }
      .container {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>

  <div class="print-actions">
    <button class="btn" onclick="window.print()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
      Print Official PDF Receipt
    </button>
    <button class="btn btn-secondary" onclick="window.close()">
      Close Receipt Page
    </button>
  </div>

  <div class="container">
    <div class="header">
      <div class="logo-area">
        <h1>CivicPulse AI</h1>
        <p>Municipal Intelligence & Triage System</p>
      </div>
      <div class="receipt-meta">
        <h2>CASE RECEIPT</h2>
        <p>Ticket ID: #${receiptNum}</p>
        <p>Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>
    </div>

    <div class="grid">
      <!-- Section 1: Core Metadata -->
      <div class="card">
        <h3>Ticket Classification</h3>
        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span class="detail-value">
            <span class="badge badge-status">${complaint.status}</span>
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Priority Level:</span>
          <span class="detail-value">
            <span class="badge badge-priority">${complaint.priority}</span>
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Target Department:</span>
          <span class="detail-value">${complaint.department}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Reported By:</span>
          <span class="detail-value">${complaint.reporterName || 'Citizen User'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Filing Date:</span>
          <span class="detail-value">${dateFormatted}</span>
        </div>
      </div>

      <!-- Section 2: Location Grid -->
      <div class="card">
        <h3>GIS Location Data</h3>
        <div class="detail-row">
          <span class="detail-label">Assigned City:</span>
          <span class="detail-value">${complaint.city}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Landmark / Address:</span>
          <span class="detail-value" style="text-align: right; max-width: 180px; word-break: break-word;">${complaint.address}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">GPS Latitude:</span>
          <span class="detail-value">${complaint.latitude.toFixed(6)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">GPS Longitude:</span>
          <span class="detail-value">${complaint.longitude.toFixed(6)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Upvoter Validations:</span>
          <span class="detail-value">${complaint.verificationCount || complaint.upvoters.length || 0} Citizens</span>
        </div>
      </div>
    </div>

    <!-- Section 3: Title & Description -->
    <div class="section-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #4f46e5;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      Subject Statement & Details
    </div>
    <div class="complaint-desc">
      <strong style="font-size: 15px; color: #0f172a; display: block; margin-bottom: 8px;">${complaint.title}</strong>
      ${complaint.description}
      
      ${complaint.images && complaint.images.length > 0 ? `
        <img src="${complaint.images[0]}" alt="Evidence Snapshot" class="evidence-img" />
      ` : ''}
    </div>

    <!-- Section 4: AI Intel Classifier Report (if any) -->
    ${complaint.aiIntelReport ? `
      <div class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #4f46e5;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>
        Gemini AI Vision & Audit Report
      </div>
      <div class="complaint-desc ai-report">
        <strong style="color: #3730a3; display: block; margin-bottom: 6px; font-size: 14px;">${complaint.aiIntelReport.professionalTitle || 'Visual Classification Verified'}</strong>
        <p style="margin: 0 0 15px 0;">${complaint.aiIntelReport.professionalDescription}</p>
        
        <div class="grid" style="grid-template-cols: repeat(3, 1fr); gap: 12px; margin-bottom: 0;">
          <div class="card" style="padding: 10px; background: white; border: 1px dashed #c7d2fe;">
            <span style="font-size: 9px; color: #64748b; font-weight: bold; text-transform: uppercase;">Est. Repair Cost</span>
            <div style="font-size: 12px; font-weight: 800; color: #1e1b4b; margin-top: 2px;">${complaint.aiIntelReport.estimatedRepairCost || 'SLA Dependent'}</div>
          </div>
          <div class="card" style="padding: 10px; background: white; border: 1px dashed #c7d2fe;">
            <span style="font-size: 9px; color: #64748b; font-weight: bold; text-transform: uppercase;">Est. Resolution SLA</span>
            <div style="font-size: 12px; font-weight: 800; color: #1e1b4b; margin-top: 2px;">${complaint.aiIntelReport.estimatedResolutionTime || '24 Hours'}</div>
          </div>
          <div class="card" style="padding: 10px; background: white; border: 1px dashed #c7d2fe;">
            <span style="font-size: 9px; color: #64748b; font-weight: bold; text-transform: uppercase;">Risk Classification</span>
            <div style="font-size: 12px; font-weight: 800; color: #1e1b4b; margin-top: 2px;">${complaint.aiIntelReport.publicRisk || 'Standard Public Space'}</div>
          </div>
        </div>

        <div style="margin-top: 15px; font-size: 11px; color: #475569; display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
          <span><strong>Civic Authenticity:</strong> ${complaint.aiIntelReport.civicAuthenticity || 'REAL'}</span>
          <span><strong>AI Confidence Rating:</strong> ${complaint.aiIntelReport.confidenceScore || complaint.aiIntelReport.authenticityConfidenceScore || 98}%</span>
        </div>
      </div>
    ` : ''}

    <!-- Section 5: Timeline Case Log History -->
    <div class="section-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #4f46e5;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      Official Case Resolution Tracking Timeline
    </div>
    
    <div class="timeline">
      ${complaint.timeline.map((event) => `
        <div class="timeline-event">
          <div class="timeline-marker ${event.status === 'RESOLVED' ? 'resolved' : ''}"></div>
          <div class="timeline-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span class="timeline-status">${event.status}</span>
              <span class="timeline-time">${formatDateTime(event.timestamp)}</span>
            </div>
            <div class="timeline-note">${event.note}</div>
            <div class="timeline-by">Action Logged by: ${event.updatedBy || 'Municipal System Service'}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <p>This is an officially certified system record from the CivicPulse smart-city municipal routing network.</p>
      <p>&copy; 2026 CivicPulse Municipal Intelligence Network. All Rights Reserved.</p>
    </div>
  </div>

</body>
</html>`;

  // Create document download trigger
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `CivicPulse_Ticket_Receipt_${receiptNum}.html`;
  document.body.appendChild(a);
  a.click();
  
  // Cleanup resources
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
