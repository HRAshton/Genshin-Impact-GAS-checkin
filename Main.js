function createConfigSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = 'Config';
  
  sheet = spreadsheet.insertSheet(sheetName);

  sheet.getRange('A1').setValue('Reports email:');
  sheet.getRange('B1').setValue('<FILL_ME>');
  sheet.getRange('B1:C1').merge();

  sheet.getRange('A2').setValue('Comment');
  sheet.getRange('B2').setValue('ltuid');
  sheet.getRange('C2').setValue('ltoken');

  sheet.setFrozenRows(2);

  sheet.deleteRows(10, sheet.getMaxRows() - 10);
  sheet.deleteColumns(4, sheet.getMaxColumns() - 3);
}

function run_me_daily() {
  const config = loadConfig();
  console.info(`Configuration read.`);
  console.log(config);

  const checkInResults = config.accounts.map(account => ({
    account,
    result: checkIn(account),
  }));
  console.info('All accounts have been checked in');

  sendEmail(config.reportEmail, checkInResults);
  console.info('Email sent.');
}

function loadConfig() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');
  const reportEmail = sheet.getRange('B1').getValue();

  const accounts = sheet.getRange('A3:C').getValues()
    .filter(acc => acc[0] && acc[1] && acc[2])
    .map(acc => ({
      comment: acc[0],
      userId: acc[1],
      token: acc[2],
    }));

  return {
    reportEmail,
    accounts,
  };
}

function checkIn({ userId, token }) {
  const url = 'https://sg-hk4e-api.hoyolab.com/event/sol/sign';

  const isV2 = token.startsWith('v2_');
  const cookie = !isV2
    ? `ltoken=${token}; ltuid=${userId}`
    : `ltuid_v2=${userId}; ltoken_v2=${token}`;
  const options = {
    method: 'post',
    headers: {
      Cookie: cookie,
    },
    payload: '{"act_id":"e202102251931481"}'
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());
  console.log(`Checked in with result ${JSON.stringify(json)}`);

  return json.message;
}

function sendEmail(email, checkInResults) {
  const subjectPrefix = checkInResults.every(res => res.result === 'OK')
    ? 'Success'
    : 'Fail';
  const subject = `[${subjectPrefix}] Genshin Impact Daily Check-in Report`;
  const body = checkInResults
    .map(({ account, result }) => `${account.comment}: ${result}`)
    .join('\n');

  MailApp.sendEmail(email, subject, body);
}