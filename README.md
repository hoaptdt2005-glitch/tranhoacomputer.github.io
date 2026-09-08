# ☕ Cà Phê Hòa — Nền tảng cà phê trực tuyến

Website bán + quản trị cửa hàng cà phê, gọn gàng trong **4 file duy nhất**:

| File | Vai trò |
|---|---|
| `index.html` | Toàn bộ website khách hàng — **7 trang ảo** điều hướng bằng hash (`#home` `#menu` `#about` `#service` `#reservation` `#testimonial` `#contact`), CSS + JS nhúng 100%, ảnh dùng CDN |
| `admin.html` | Trang quản trị — dashboard, sản phẩm, đơn hàng, đặt bàn, cảm nhận, tin nhắn |
| `Code.gs` | Backend Google Apps Script — **cơ sở dữ liệu hoàn toàn mới & riêng biệt** |
| `README.md` | Tài liệu này |

## 🚀 Đưa lên GitHub Pages

1. Tạo repo `tenban.github.io` (hoặc repo bất kỳ → Settings → Pages → branch `main`).
2. Push 4 file lên nhánh `main`.
3. Vào `tenban.github.io/admin.html` để quản trị (mật khẩu mặc định: **`cafe123`**).

Website chạy được ngay với **dữ liệu mẫu** (chưa cần backend): giỏ hàng, thanh toán, đặt bàn, gửi cảm nhận/tin nhắn đều hoạt động và tự lưu offline.

## ☁️ Kết nối cơ sở dữ liệu GAS mới (Google Sheets)

1. Vào **[script.google.com](https://script.google.com)** → **New project** → dán toàn bộ `Code.gs` vào editor → lưu.
2. **Deploy → New deployment → Web app**:
   - Execute as: `Me` · Who has access: `Anyone`
3. Copy **Web app URL** (kết thúc `/exec`).
4. Mở trình duyệt: `{URL}?action=setup` — script **tự tạo Google Spreadsheet mới** "CÀ PHÊ HÒA — Database" gồm 6 bảng: `Products`, `Orders`, `Reservations`, `Testimonials`, `Messages`, `Config`. Phản hồi kèm link Sheet để bạn bookmark.
5. Mở `admin.html` → đăng nhập → **Cài đặt → Kết nối dữ liệu** → dán URL mới → **Lưu URL** → **Kiểm tra kết nối** (báo ✅).
6. Vào **admin → Sản phẩm → ✦ Nạp dữ liệu mẫu** để ghi 12 sản phẩm lên database mới.

> 🔐 URL `/exec` hoạt động như API key — không công khai ngoài việc nằm trong code website của bạn. Muốn reset toàn bộ: xoá Spreadsheet + project Apps Script, deploy lại từ bước 1.

## 🛍️ Tính năng khách hàng (`index.html`)

- Trang chủ: carousel 2 slide, 3 danh mục, bán chạy, teaser giới thiệu/dịch vụ/cảm nhận
- Thực đơn `#menu`: tìm kiếm, lọc giá & hương vị, giỏ hàng realtime
- Thanh toán: COD · Chuyển khoản · Ví Momo — miễn phí giao từ 100.000đ
- Đặt bàn `#reservation`: chọn ngày/giờ/số khách, mã đặt bàn tự sinh
- Cảm nhận `#testimonial`: xem đánh giá + gửi (chờ quản trị duyệt)
- Liên hệ `#contact`: thông tin + Google Maps + form tin nhắn
- Giỏ hàng + checkout dùng chung mọi trang, offline-safe (hàng đợi tự đồng bộ)

## 🧑‍💼 Quản trị (`admin.html`)

Dashboard (doanh thu ngày/tháng, biểu đồ 7 ngày, top bán chạy, đặt bàn sắp tới) · CRUD sản phẩm + upload ảnh (CDN, fallback base64) · Đơn hàng 5 trạng thái · Đặt bàn 4 trạng thái · Duyệt cảm nhận · Đọc/xoá tin nhắn · Đổi mật khẩu, đổi/test URL GAS.

## 🛠️ Tuỳ biến

Mở `index.html` / `admin.html`, tìm `window.CAFE = {` (nhúng gần đầu `<script>`) để đổi:

- `GAS_URL` — backend của bạn
- `shop` — tên, SĐT, địa chỉ, giờ mở cửa
- `categories`, `paymentMethods`, `priceRanges`, `flavors`
- `orderStatuses`, `reservationStatuses`, `reservationSlots`

Đổi xong lưu, commit, push — GitHub Pages tự cập nhật trong ~1 phút.

---
Phiên bản v2.2 · Giao diện v2.2: không dùng icon emoji — nút nhấn, nhãn, trạng thái đều là chữ sạch; hero và các khối nội dung căn giữa hài hòa. Mã đã kiểm định: cú pháp JS, HTML, 26 test backend, 10 kịch bản smoke test SPA + admin.
