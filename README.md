# TÔI ĐÃ BỎ THUỐC — giao diện phổi tham khảo V3

Trên điện thoại: đồng hồ hành trình đặt đầu trang; tiếp đến là hình phổi minh họa, rồi đồng hồ không hút liên tục, các mốc, cài đặt, thống kê.

Sử dụng **ảnh tham khảo của người dùng** (file `lung-reference.webp`): hai mô hình phổi của người hút thuốc và phổi khỏe mạnh. Trạng thái giữa hai ảnh được **pha trộn theo 24 mốc mang tính biểu tượng**, không phải mô phỏng quá trình hồi phục thật.

Các tính năng cũ, tách dữ liệu riêng Nathan/Kieuquyen và bảng xếp hạng giữ nguyên. Dữ liệu `localStorage` không bị xóa. Ảnh gốc độ phân giải cao có thể thay thế asset `lung-reference.webp` mà không phải sửa code.

## V4
Đã thêm hiệu ứng hô hấp riêng cho hình phổi, phản quang, độ sâu giả lập, kéo ngón tay để nghiêng mô hình trên điện thoại, và hiển thị mốc 1–24. Các chức năng theo dõi và bộ nhớ dữ liệu không thay đổi. Hình ảnh là minh họa động lực, không phải biểu đồ hồi phục y khoa.

### Ảnh mới
File `lung-healthy-v4.webp` là hình phổi nghệ thuật do AI tạo mới, thay cho ảnh hai lá phổi mờ; ứng dụng tự đổi lớp màu tối / sáng theo mốc. Ảnh tạo cảm giác nổi khối nhưng không phải mô hình 3D giải phẫu xoay 360°. Các mốc không phản ánh diễn biến làm sạch phổi thật.

## V5 – ảnh chuẩn theo người dùng
Asset `lung-reference-original.webp` được chuyển trực tiếp từ ảnh giải phẫu phổi **do người dùng cung cấp**. Màn hình dùng 2 lớp từ cùng 1 ảnh này nên không nhảy sang hình phổi SVG hoạt hình. Chuyển màu và chuyển động chỉ là minh họa; không phải mô hình giải phẫu 3D tương tác thực sự.
