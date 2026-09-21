# Tháp Hà Nội

Một phiên bản Tháp Hà Nội chạy hoàn toàn trên trình duyệt, với giao diện tiếng Việt, bộ đếm bước, đồng hồ và chế độ máy giải.

## Tính năng

- Chọn từ 3 đến 7 đĩa.
- Điều khiển bằng cách chọn cột chứa đĩa trên cùng, sau đó chọn cột đích.
- Tự động kiểm tra nước đi không hợp lệ.
- Theo dõi số bước, số bước tối thiểu và thời gian chơi.
- Hoàn tác nước đi gần nhất.
- Chơi lại ván hiện tại hoặc đổi số lượng đĩa.
- Máy giải tự động bằng thuật toán đệ quy kinh điển của bài toán Tháp Hà Nội.
- Không cần cài đặt thư viện hay backend; có thể triển khai trực tiếp lên GitHub Pages.

## Luật chơi

Mục tiêu là chuyển toàn bộ đĩa từ cột A sang cột C, tuân theo hai quy tắc:

1. Mỗi lần chỉ được di chuyển một đĩa.
2. Không được đặt đĩa lớn lên trên đĩa nhỏ.

Với `n` đĩa, số bước ít nhất là `2^n - 1`. Trò chơi sẽ thông báo khi hoàn thành và cho biết bạn có giải tối ưu hay không.

## Cách chơi

1. Chọn số lượng đĩa trong ô **Số đĩa**.
2. Chọn cột đang có đĩa trên cùng.
3. Chọn cột muốn đặt đĩa vào.
4. Tiếp tục cho đến khi toàn bộ đĩa nằm ở cột C.

Các nút điều khiển:

- **Chơi lại**: đặt lại ván hiện tại.
- **Hoàn tác**: quay lại một nước đi trước đó.
- **Máy giải**: tự động thực hiện lời giải tối ưu cho số đĩa hiện tại.

## Chạy local

Không có bước build. Có thể mở trực tiếp `index.html` trong trình duyệt.

Nếu muốn chạy qua HTTP server tĩnh, dùng một trong các cách sau:

```bash
# Python
python -m http.server 8000

# Node.js, nếu đã cài serve
npx serve .
```

Sau đó mở địa chỉ server được cung cấp, thường là `http://localhost:8000`.

## Cấu trúc dự án

```text
.
├── index.html   # Cấu trúc giao diện và các nút điều khiển
├── styles.css   # Giao diện responsive và hiệu ứng
├── game.js      # Trạng thái trò chơi, luật di chuyển và máy giải
└── README.md    # Tài liệu dự án
```

## Công nghệ

- HTML5
- CSS3
- JavaScript thuần (ES2020+)
- Google Fonts: Be Vietnam Pro và Fraunces

## Triển khai GitHub Pages

Repository được thiết lập để publish từ nhánh `main`, thư mục gốc (`/`).

Trong GitHub:

1. Mở **Settings** của repository.
2. Chọn **Pages** trong phần **Code and automation**.
3. Ở **Build and deployment**, chọn **Deploy from a branch**.
4. Chọn nhánh `main` và thư mục `/ (root)`, sau đó bấm **Save**.

Sau khi GitHub hoàn tất triển khai, URL trang sẽ xuất hiện trong phần **Pages**.
