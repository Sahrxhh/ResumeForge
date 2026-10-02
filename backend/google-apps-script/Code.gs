/**
 * ResumeForge backend - Google Apps Script
 *
 * 1. Create a Google Sheet for ResumeForge records.
 * 2. Extensions -> Apps Script.
 * 3. Paste this file into Code.gs.
 * 4. Set SHEET_ID and ADMIN_EMAIL below.
 * 5. Deploy as Web app:
 *    Execute as: Me
 *    Who has access: Anyone
 * 6. Put the deployed /exec URL into config.js BACKEND_URL.
 *
 * The browser sends a Google Identity Services ID token.
 * This backend verifies it with Google's tokeninfo endpoint before saving.
 */

const SHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Resumes';
const ADMIN_EMAIL = 'sahrxhh.in@gmail.com';
const GOOGLE_CLIENT_ID = 'PASTE_GOOGLE_WEB_CLIENT_ID_HERE';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const token = String(body.idToken || '');
    if (!token) return json({ok:false,error:'Missing Google ID token'});

    const user = verifyGoogleToken(token);
    if (!user || user.aud !== GOOGLE_CLIENT_ID) {
      return json({ok:false,error:'Invalid Google sign-in'});
    }

    const resume = body.resume || {};
    const now = new Date();
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sh.getLastRow() === 0) {
      sh.appendRow([
        'Created At','Google ID','Name','Email','Phone','City','Target Title',
        'LinkedIn/GitHub','Summary','Skills','Experience JSON','Education JSON',
        'Certifications/Projects','Template','Accent','Font'
      ]);
    }

    sh.appendRow([
      now, user.sub, user.name || '', user.email || '',
      resume.phone || '', resume.city || '', resume.title || '',
      resume.link || '', resume.summary || '',
      (resume.skills || []).join(', '),
      JSON.stringify(resume.exp || []),
      JSON.stringify(resume.edu || []),
      (resume.certs || []).join('\n'),
      body.template || '', body.accent || '', body.font || ''
    ]);

    const subject = 'ResumeForge - New Resume Generated';
    const text =
      'A new ResumeForge resume was generated.\n\n' +
      'Name: ' + (user.name || '') + '\n' +
      'Email: ' + (user.email || '') + '\n' +
      'Target title: ' + (resume.title || '') + '\n' +
      'Generated: ' + now.toISOString() + '\n\n' +
      'Record saved in the ResumeForge Google Sheet.';

    MailApp.sendEmail(ADMIN_EMAIL, subject, text);

    return json({ok:true});
  } catch (err) {
    return json({ok:false,error:String(err)});
  }
}

function verifyGoogleToken(idToken) {
  const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' +
    encodeURIComponent(idToken);
  const res = UrlFetchApp.fetch(url, {muteHttpExceptions:true});
  if (res.getResponseCode() !== 200) return null;
  return JSON.parse(res.getContentText());
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function setupSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow([
      'Created At','Google ID','Name','Email','Phone','City','Target Title',
      'LinkedIn/GitHub','Summary','Skills','Experience JSON','Education JSON',
      'Certifications/Projects','Template','Accent','Font'
    ]);
  }
}
