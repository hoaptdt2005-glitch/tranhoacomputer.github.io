/**
 * ══════════════════════════════════════════════════════════════════════
 *  Code.gs — CÀ PHÊ HÒA · Backend Google Apps Script (CƠ SỞ DỮ LIỆU MỚI)
 *  ══════════════════════════════════════════════════════════════════════
 *
 *  HOÀN TOÀN MỚI & RIÊNG BIỆT — không dùng chung Sheet cũ.
 *  Khi chạy lần đầu, script TỰ TẠO một Google Spreadsheet mới
 *  "CÀ PHÊ HÒA — Database" gồm 6 bảng:
 *    Products (sản phẩm) · Orders (đơn hàng) · Reservations (đặt bàn)
 *    Testimonials (cảm nhận) · Messages (tin nhắn) · Config
 *
 *  ▶ PROTOCOL (khớp 100% với js/api.js của website):
 *    Đọc : GET {URL}?action=getProducts|getOrders|getReservations|
 *          getTestimonials|getMessages|getConfig&_=<timestamp>
 *    Ghi : GET {URL}?method=POST&body=<encodeURIComponent(JSON)>
 *          body = { action: "...", id?: "...", data: {...} }
 *
 *  ▶ CÁC ACTION HỖ TRỢ:
 *    getProducts[&includeAll=true] · createProduct · updateProduct · deleteProduct
 *    getOrders    · createOrder    · updateOrder    · deleteOrder
 *    getReservations · createReservation · updateReservation · deleteReservation
 *    getTestimonials · createTestimonial · updateTestimonial · deleteTestimonial
 *    getMessages    · createMessage    · updateMessage    · deleteMessage
 *    getConfig · saveConfig · setup (kiểm tra & trả về link Sheet)
 *
 *  ▶ TRIỂN KHAI (chi tiết trong HUONG-DAN-GAS.md):
 *    1. script.google.com → New project → dán toàn bộ file này
 *    2. Deploy → New deployment → Web app
 *       - Execute as: Me   |   Who has access: Anyone
 *    3. Copy URL kết thúc bằng /exec
 *    4. Dán URL vào admin.html → Cài đặt → Kết nối dữ liệu (hoặc js/config.js)
 *    5. Gõ trình duyệt: {URL}?action=setup để script tạo database và nhận link Sheet
 * ══════════════════════════════════════════════════════════════════════
 */

var DB_NAME     = 'CÀ PHÊ HÒA — Database';
var PROP_SSID   = 'SPREADSHEET_ID';

var SHEETS = {
  Products:      ['id','name','category','price','originalPrice','priceNote','imageUrl','description','sortOrder','isActive','isBest','updatedAt'],
  Orders:        ['id','customerName','phone','email','address','items','total','status','paymentMethod','note','createdAt','updatedAt'],
  Reservations:  ['id','customerName','phone','email','date','time','guests','tableNote','note','status','createdAt','updatedAt'],
  Testimonials:  ['id','name','role','rating','content','isActive','createdAt','updatedAt'],
  Messages:      ['id','name','email','phone','subject','content','isRead','createdAt','updatedAt'],
  Config:        ['key','value'],
};

/* ═════════════════════ KẾT NỐI DATABASE ═════════════════════ */

/** Lấy (hoặc tự tạo lần đầu) spreadsheet của dự án */
function getSS_() {
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty(PROP_SSID);
  if (ssId) {
    try { return SpreadsheetApp.openById(ssId); } catch (e) { /* đã bị xoá → tạo lại */ }
  }
  var ss = SpreadsheetApp.create(DB_NAME);
  props.setProperty(PROP_SSID, ss.getId());
  ensureSheets_(ss);
  Logger.log('Đã tạo database mới: ' + ss.getUrl());
  return ss;
}

/** Đảm bảo đủ 6 bảng + header đúng thứ tự */
function ensureSheets_(ss) {
  var names = ss.getSheets().map(function (s) { return s.getName(); });
  Object.keys(SHEETS).forEach(function (name) {
    var sheet = names.indexOf(name) === -1 ? ss.insertSheet(name) : ss.getSheetByName(name);
    var headers = SHEETS[name];
    var row = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    var needs = !row[0] || String(row[0]).toLowerCase() !== String(headers[0]).toLowerCase();
    if (needs) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#E9DCCB');
      sheet.setFrozenRows(1);
    }
  });
  // Xoá sheet mặc định "Sheet1" nếu trống
  var def = ss.getSheetByName('Sheet1');
  if (def && ss.getSheets().length > 6 && def.getLastRow() <= 1) ss.deleteSheet(def);
}

function sheet_(name) {
  var ss = getSS_();
  ensureSheets_(ss);
  return ss.getSheetByName(name);
}

/* ═════════════════════ TIỆN ÍCH ═════════════════════ */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
function ok_(data)    { return json_({ success: true,  data: data }); }
function fail_(msg)   { return json_({ success: false, error: String(msg) }); }

function toStr_(v, def) { return v === undefined || v === null || v === '' ? (def || '') : String(v); }
function toNum_(v, def) { var n = Number(v); return isNaN(n) ? (def || 0) : n; }
function toBool_(v)    { return v === true || String(v).toLowerCase() === 'true' || v === 'TRUE' || v === 1 || v === '1'; }

/** Đọc toàn bộ bảng → mảng object theo header */
function readSheet_(name) {
  var sh = sheet_(name);
  var last = sh.getLastRow();
  if (last < 2) return [];
  var headers = SHEETS[name];
  var values = sh.getRange(2, 1, last - 1, headers.length).getValues();
  return values.map(function (row, i) {
    var o = { _row: i + 2 };
    headers.forEach(function (h, c) { o[h] = row[c]; });
    return o;
  }).filter(function (o) { return String(o.id || o.key || '') !== ''; });
}

/** Chuẩn hoá object đầu vào: chỉ giữ các key có trong header */
function pick_(name, data) {
  var out = {};
  SHEETS[name].forEach(function (h) {
    if (data.hasOwnProperty(h)) out[h] = data[h];
  });
  return out;
}

/** Ghi 1 dòng: update theo id nếu có, ngược lại append */
function upsert_(name, id, data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = sheet_(name);
    var clean = pick_(name, data);
    if (id) clean.id = id;

    // tìm theo id (cột A)
    var ids = sh.getLastRow() > 1
      ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]); })
      : [];
    var idx = id ? ids.indexOf(String(id)) : -1;

    var headers = SHEETS[name];
    var row = headers.map(function (h) {
      var v = clean[h];
      if (v === undefined || v === null) v = '';
      if (typeof v === 'object') v = JSON.stringify(v);   // items[] → JSON string
      if (typeof v === 'boolean') v = v ? 'TRUE' : 'FALSE';
      return v;
    });

    if (idx >= 0) {
      sh.getRange(idx + 2, 1, 1, headers.length).setValues([row]);
    } else {
      sh.appendRow(row);
    }
    return clean;
  } finally {
    lock.releaseLock();
  }
}

/** Xoá dòng theo id */
function deleteById_(name, id) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = sheet_(name);
    var last = sh.getLastRow();
    if (last < 2) return false;
    var ids = sh.getRange(2, 1, last - 1, 1).getValues().map(function (r) { return String(r[0]); });
    var idx = ids.indexOf(String(id));
    if (idx === -1) return false;
    sh.deleteRow(idx + 2);
    return true;
  } finally {
    lock.releaseLock();
  }
}

/* ═════════════════════ CHUẨN HOÁ THEO BẢNG ═════════════════════ */

function outProduct_(o) {
  return {
    id: toStr_(o.id), name: toStr_(o.name), category: toStr_(o.category),
    price: toNum_(o.price), originalPrice: toNum_(o.originalPrice),
    priceNote: toStr_(o.priceNote), imageUrl: toStr_(o.imageUrl),
    description: toStr_(o.description), sortOrder: toNum_(o.sortOrder),
    isActive: toBool_(o.isActive), isBest: toBool_(o.isBest),
    updatedAt: toStr_(o.updatedAt),
  };
}
function outOrder_(o) {
  var items = [];
  try { items = typeof o.items === 'string' ? JSON.parse(o.items || '[]') : (o.items || []); } catch (e) {}
  return {
    id: toStr_(o.id), customerName: toStr_(o.customerName), phone: toStr_(o.phone),
    email: toStr_(o.email), address: toStr_(o.address), items: items,
    total: toNum_(o.total), status: toStr_(o.status, 'pending'),
    paymentMethod: toStr_(o.paymentMethod), note: toStr_(o.note),
    createdAt: toStr_(o.createdAt), updatedAt: toStr_(o.updatedAt),
  };
}
function outReservation_(o) {
  return {
    id: toStr_(o.id), customerName: toStr_(o.customerName), phone: toStr_(o.phone),
    email: toStr_(o.email), date: toStr_(o.date), time: toStr_(o.time),
    guests: toNum_(o.guests, 1), tableNote: toStr_(o.tableNote), note: toStr_(o.note),
    status: toStr_(o.status, 'pending'), createdAt: toStr_(o.createdAt), updatedAt: toStr_(o.updatedAt),
  };
}
function outTestimonial_(o) {
  return {
    id: toStr_(o.id), name: toStr_(o.name), role: toStr_(o.role),
    rating: toNum_(o.rating, 5), content: toStr_(o.content),
    isActive: toBool_(o.isActive), createdAt: toStr_(o.createdAt), updatedAt: toStr_(o.updatedAt),
  };
}
function outMessage_(o) {
  return {
    id: toStr_(o.id), name: toStr_(o.name), email: toStr_(o.email), phone: toStr_(o.phone),
    subject: toStr_(o.subject), content: toStr_(o.content), isRead: toBool_(o.isRead),
    createdAt: toStr_(o.createdAt), updatedAt: toStr_(o.updatedAt),
  };
}

/* ═════════════════════ ROUTER ═════════════════════ */

function doGet(e) {
  try {
    var p = e && e.parameter ? e.parameter : {};

    /* Ghi dữ liệu: ?method=POST&body={...} */
    if (p.method === 'POST' && p.body) {
      return handleWrite_(JSON.parse(p.body));
    }

    switch (p.action) {
      /* Sản phẩm */
      case 'getProducts':
        var prods = readSheet_('Products').map(outProduct_);
        if (p.includeAll !== 'true') prods = prods.filter(function (x) { return x.isActive; });
        prods.sort(function (a, b) { return (a.sortOrder - b.sortOrder) || String(a.name).localeCompare(String(b.name)); });
        return ok_(prods);

      /* Đơn hàng */
      case 'getOrders':
        var orders = readSheet_('Orders').map(outOrder_)
          .sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
        return ok_(orders);

      /* Đặt bàn */
      case 'getReservations':
        var rsvs = readSheet_('Reservations').map(outReservation_)
          .sort(function (a, b) { return (String(b.date) + String(b.time)).localeCompare(String(a.date) + String(a.time)); });
        return ok_(rsvs);

      /* Cảm nhận */
      case 'getTestimonials':
        var tsts = readSheet_('Testimonials').map(outTestimonial_)
          .sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
        return ok_(tsts);

      /* Tin nhắn */
      case 'getMessages':
        var msgs = readSheet_('Messages').map(outMessage_)
          .sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
        return ok_(msgs);

      /* Cấu hình key/value */
      case 'getConfig':
        var cfg = {};
        readSheet_('Config').forEach(function (r) { cfg[r.key] = r.value; });
        return ok_(cfg);

      /* Kiểm tra & tạo database lần đầu */
      case 'setup':
        var ss = getSS_();
        ensureSheets_(ss);
        return ok_({
          message: 'Cơ sở dữ liệu đã sẵn sàng ✅',
          spreadsheet: ss.getUrl(),
          sheets: Object.keys(SHEETS),
        });

      default:
        return fail_('Action không được hỗ trợ: ' + (p.action || '(trống)') + ' — dùng ?action=setup để kiểm tra');
    }
  } catch (err) {
    return fail_('Lỗi hệ thống: ' + err.message);
  }
}

/** Ghi dữ liệu: điều phối theo action trong body */
function handleWrite_(body) {
  try {
    if (!body || !body.action) return fail_('Thiếu action trong body');
    var action = body.action;
    var id = body.id ? String(body.id) : (body.data && body.data.id ? String(body.data.id) : null);
    var data = body.data || {};
    var res;

    switch (action) {

      /* ── Sản phẩm ── */
      case 'createProduct':
        data.id = data.id || ('P_' + Date.now());
        data.updatedAt = data.updatedAt || new Date().toISOString();
        upsert_('Products', data.id, data);
        return ok_(outProduct_(data));
      case 'updateProduct':
        if (!id) return fail_('Thiếu id sản phẩm');
        data.updatedAt = new Date().toISOString();
        upsert_('Products', id, data);
        return ok_(true);
      case 'deleteProduct':
        return ok_(deleteById_('Products', id));

      /* ── Đơn hàng ── */
      case 'createOrder':
        data.id = data.id || ('DH_' + Date.now());
        data.createdAt = data.createdAt || new Date().toISOString();
        data.updatedAt = data.updatedAt || data.createdAt;
        data.status = data.status || 'pending';
        upsert_('Orders', data.id, data);
        return ok_({ id: data.id });
      case 'updateOrder':
        data.updatedAt = new Date().toISOString();
        upsert_('Orders', id, data);
        return ok_(true);
      case 'deleteOrder':
        return ok_(deleteById_('Orders', id));

      /* ── Đặt bàn ── */
      case 'createReservation':
        data.id = data.id || ('DB_' + Date.now());
        data.createdAt = data.createdAt || new Date().toISOString();
        data.updatedAt = data.updatedAt || data.createdAt;
        data.status = data.status || 'pending';
        upsert_('Reservations', data.id, data);
        return ok_(outReservation_(data));
      case 'updateReservation':
        data.updatedAt = new Date().toISOString();
        upsert_('Reservations', id, data);
        return ok_(true);
      case 'deleteReservation':
        return ok_(deleteById_('Reservations', id));

      /* ── Cảm nhận ── */
      case 'createTestimonial':
        data.id = data.id || ('TS_' + Date.now());
        data.createdAt = data.createdAt || new Date().toISOString();
        data.updatedAt = data.updatedAt || data.createdAt;
        upsert_('Testimonials', data.id, data);
        return ok_(outTestimonial_(data));
      case 'updateTestimonial':
        data.updatedAt = new Date().toISOString();
        upsert_('Testimonials', id, data);
        return ok_(true);
      case 'deleteTestimonial':
        return ok_(deleteById_('Testimonials', id));

      /* ── Tin nhắn ── */
      case 'createMessage':
        data.id = data.id || ('MSG_' + Date.now());
        data.createdAt = data.createdAt || new Date().toISOString();
        data.updatedAt = data.updatedAt || data.createdAt;
        data.isRead = false;
        upsert_('Messages', data.id, data);
        return ok_(true);
      case 'updateMessage':
        data.updatedAt = new Date().toISOString();
        upsert_('Messages', id, data);
        return ok_(true);
      case 'deleteMessage':
        return ok_(deleteById_('Messages', id));

      /* ── Cấu hình ── */
      case 'saveConfig':
        Object.keys(data).forEach(function (k) {
          upsert_('Config', k, { key: k, value: typeof data[k] === 'object' ? JSON.stringify(data[k]) : String(data[k]) });
        });
        return ok_(true);

      /* ── Tương thích backend cũ (Booking-based) ── */
      case 'create':
      case 'update':
      case 'delete':
        return fail_('Action "' + action + '" thuộc backend cũ — database mới dùng createOrder/updateOrder/deleteOrder. Vui lòng dán URL Code.gs mới vào admin → Cài đặt.');

      default:
        return fail_('Action không hỗ trợ: ' + action);
    }
  } catch (err) {
    return fail_('Lỗi ghi dữ liệu: ' + err.message);
  }
}

/* Cho phép chạy thủ công từ editor Apps Script */
function setup() {
  var ss = getSS_();
  ensureSheets_(ss);
  Logger.log('Database: ' + ss.getUrl());
  return ss.getUrl();
}
