/**
 * ResumeForge backend - Google Apps Script
 * The ResumeForge Google Sheet ID is configured below.
 */
const SHEET_ID = '1bW9ImA2vW5pgk2P3zncXuI6Kq1XlDus_sBMhejGJj8E';
const SHEET_NAME = 'Resumes';
const ADMIN_EMAIL = 'sahrxhh.in@gmail.com';
const GOOGLE_CLIENT_ID = 'PASTE_GOOGLE_WEB_CLIENT_ID_HERE';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const token = String(body.idToken || '');
    if (!token) return json({ok:false,error:'Missing Google ID token'});

    const user = verifyGoogleToken(token);
    if (!user || user.aud !== GOOGLE_CLIENT_ID || user.iss !== 'https://accounts.google.com') {
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

    MailApp.sendEmail(
      ADMIN_EMAIL,
      'ResumeForge - New Resume Generated',
      'A new ResumeForge resume was generated.\n\n' +
      'Name: ' + (user.name || '') + '\n' +
      'Email: ' + (user.email || '') + '\n' +
      'Target title: ' + (resume.title || '') + '\n' +
      'Generated: ' + now.toISOString() + '\n\n' +
      'Record saved in the ResumeForge Google Sheet.'
    );

    return json({ok:true});
  } catch (err) {
    return json({ok:false,error:String(err)});
  }
}

function verifyGoogleToken(idToken) {
  const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken);
  const res = UrlFetchApp.fetch(url, {muteHttpExceptions:true});
  if (res.getResponseCode() !== 200) return null;
  return JSON.parse(res.getContentText());
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
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
