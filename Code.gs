// ฟังก์ชันหลักสำหรับสร้างหน้าเว็บ
const doGet = () => {
  var page = HtmlService.createTemplateFromFile('Index').evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('ระบบบันทึกการใช้รถ')
    .setFaviconUrl('https://cdn.jsdelivr.net/gh/EPICCODING17/image/Logo-EicCoding.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return page;
}

// ฟังก์ชันสำหรับรวมไฟล์ HTML
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ใน Code.gs
function getSheetData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CarUsage");
  var data = sheet.getDataRange().getValues();
  return data.map(row => {
    var dateTime = new Date(row[0]);
    if (isNaN(dateTime.getTime())) {
      // ถ้าวันที่ไม่ถูกต้อง ใช้เวลาปัจจุบันแทน
      dateTime = new Date();
    }
    row[0] = Utilities.formatDate(dateTime, "GMT+7", "dd-MM-yyyy HH:mm:ss");
    return row;
  });
}

// ใน Index.html
function formatDateTime(dateTimeString) {
  var date = new Date(dateTimeString);
  if (isNaN(date.getTime())) {
    date = new Date(); // ใช้เวลาปัจจุบันถ้าวันที่ไม่ถูกต้อง
  }
  return date.toLocaleString('th-TH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    timeZone: 'Asia/Bangkok'
  });
}

function addRecord(record) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('CarUsage');
  var now = new Date();
  var formattedDateTime = Utilities.formatDate(now, "GMT+7", "dd-MM-yyyy HH:mm:ss");
  sheet.appendRow([formattedDateTime, ...record]);
  return true;
}
 
function updateRecord(rowIndex, endMileage, distance) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CarUsage');
  sheet.getRange(rowIndex, 5).setValue(endMileage);
  sheet.getRange(rowIndex, 6).setValue(distance);
 
  var updatedRow = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
  return updatedRow;
}

// ฟังก์ชันตรวจสอบผู้ใช้
function authenticateUser(username, password) {
  var users = [
    {username: '506267', password: '506267', name: 'นายอนุชา ปาทาน'},
    {username: '413407', password: '413407', name: 'นายเรืองฤทธิ์ พรประเสริฐผล'},
    {username: '306715', password: '306715', name: 'นายวิรัช อ่ำเพ็ชร'},
    {username: '465399', password: '465399', name: 'นายวิบูรณ์ เธียรถาวร'},
    {username: '449856', password: '449856', name: 'นายนิรันดร์ ปานสุข'},
    {username: '114802', password: '114802', name: 'ผู้ดูแลระบบ'}
  ];
   
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      return users[i].name;
    }
  }
  return null;
}
