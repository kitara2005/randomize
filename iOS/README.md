# 🎲 Ứng dụng Random Tham số - iOS

Phiên bản iOS native của ứng dụng random tham số, được viết bằng SwiftUI.

## ✨ Tính năng

### 🔢 Random Số
- **Tạo số ngẫu nhiên**: Tạo số ngẫu nhiên trong khoảng tùy chỉnh
- **Tùy chỉnh tham số**:
  - Giá trị tối thiểu và tối đa
  - Số lượng kết quả (1-100)
  - Số chữ số thập phân (0-10)
- **Tùy chọn nâng cao**:
  - Cho phép/không cho phép trùng lặp
  - Sắp xếp kết quả

### 📝 Random từ Danh sách
- **Nhập danh sách tùy ý**: Nhập danh sách các mục (mỗi dòng một mục)
- **Random từ danh sách**: Chọn ngẫu nhiên từ danh sách đã nhập
- **Tùy chọn**:
  - Số lượng kết quả (1-100)
  - Cho phép/không cho phép trùng lặp
  - Sắp xếp kết quả theo thứ tự alphabet

### 🎯 Tính năng chung
- **Lưu lịch sử**: Tự động lưu 20 lần tạo gần nhất (cả số và danh sách)
- **Sao chép kết quả**: Copy kết quả vào clipboard
- **Giao diện đẹp**: Thiết kế iOS native với TabView
- **Hiệu ứng confetti**: Animation khi tạo thành công
- **Responsive**: Hoạt động tốt trên iPhone và iPad

## 🛠️ Công nghệ sử dụng

- **SwiftUI**: Framework UI hiện đại của Apple
- **Combine**: Reactive programming cho data binding
- **UserDefaults**: Lưu trữ lịch sử local
- **MVVM Architecture**: Pattern thiết kế clean và maintainable

## 📁 Cấu trúc file

```
iOS/
├── RandomApp.swift              # Entry point của ứng dụng
├── ContentView.swift            # Main TabView
├── NumbersRandomView.swift      # View random số
├── NumbersRandomViewModel.swift # ViewModel cho random số
├── ListRandomView.swift         # View random danh sách
├── ListRandomViewModel.swift    # ViewModel cho random danh sách
├── HistoryView.swift            # View lịch sử
├── HistoryManager.swift         # Quản lý lịch sử
├── ConfettiView.swift           # Hiệu ứng confetti
└── README.md                    # Tài liệu này
```

## 🚀 Cách build và chạy

### Yêu cầu
- Xcode 14.0+
- iOS 16.0+
- Swift 5.7+

### Các bước
1. Mở Xcode
2. Tạo project iOS mới với SwiftUI
3. Copy tất cả file Swift từ folder `iOS/` vào project
4. Build và chạy trên simulator hoặc device

## 🎨 Tính năng giao diện

- **TabView Navigation**: Chuyển đổi dễ dàng giữa 3 tab
- **SwiftUI Design**: Giao diện native iOS đẹp mắt
- **Gradient Backgrounds**: Sử dụng LinearGradient
- **Smooth Animations**: Animation mượt mà với SwiftUI
- **Confetti Effect**: Hiệu ứng confetti khi tạo thành công
- **Dark Mode Support**: Tự động hỗ trợ dark mode

## 📱 Tương thích

- ✅ iPhone (iOS 16.0+)
- ✅ iPad (iOS 16.0+)
- ✅ Dark Mode
- ✅ Portrait & Landscape
- ✅ Accessibility

## 🔧 Kiến trúc

### MVVM Pattern
- **Model**: HistoryItem, NumbersSettings, ListSettings
- **View**: NumbersRandomView, ListRandomView, HistoryView
- **ViewModel**: NumbersRandomViewModel, ListRandomViewModel, HistoryViewModel

### Data Flow
1. User tương tác với View
2. View gọi ViewModel
3. ViewModel xử lý logic và cập nhật Model
4. View tự động cập nhật UI thông qua @Published properties

## 🎯 Ví dụ sử dụng

### Random Số
- **Random số từ 1-100**: Tạo số ngẫu nhiên từ 1 đến 100
- **Random số thập phân**: Tạo số có 2 chữ số thập phân
- **Random không trùng lặp**: Tạo 10 số khác nhau từ 1-50
- **Random có sắp xếp**: Tạo 5 số và sắp xếp tăng dần

### Random từ Danh sách
- **Random tên**: Nhập danh sách tên và random chọn
- **Random món ăn**: Nhập danh sách món ăn và random chọn
- **Random màu sắc**: Nhập danh sách màu và random chọn
- **Random không trùng lặp**: Chọn 3 món khác nhau từ danh sách 10 món

## 🔄 So sánh với Web Version

| Tính năng | Web Version | iOS Version |
|-----------|-------------|-------------|
| Random số | ✅ | ✅ |
| Random danh sách | ✅ | ✅ |
| Lưu lịch sử | LocalStorage | UserDefaults |
| Giao diện | HTML/CSS | SwiftUI |
| Animation | CSS/JS | SwiftUI |
| Responsive | CSS Grid | SwiftUI Layout |
| Performance | JavaScript | Native Swift |

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa.

## 🤝 Đóng góp

Để đóng góp vào dự án:
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request 