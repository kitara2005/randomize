# 🎲 Ứng dụng Random Tham số

Một ứng dụng web đơn giản và đẹp mắt để tạo các số ngẫu nhiên và random từ danh sách theo tham số tùy chỉnh.

## 📱 Phiên bản có sẵn

- **🌐 Web Version**: Ứng dụng web với HTML/CSS/JavaScript
- **📱 iOS Version**: Ứng dụng iOS native với SwiftUI (trong folder `iOS/`)

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
- **Giao diện đẹp**: Thiết kế hiện đại với animation và tab navigation
- **Responsive**: Hoạt động tốt trên mọi thiết bị

## 🚀 Cách sử dụng

### 🌐 Web Version
1. Mở file `index.html` trong trình duyệt web
2. Sử dụng tab navigation để chuyển đổi giữa các chức năng
3. Nhập tham số và tạo random

### 📱 iOS Version
1. Vào folder `iOS/`
2. Mở Xcode và tạo project iOS mới với SwiftUI
3. Copy tất cả file Swift vào project
4. Build và chạy trên simulator hoặc device

## 📁 Cấu trúc dự án

```
randomize/
├── index.html                    # Web app - Giao diện chính
├── styles.css                    # Web app - CSS styling
├── script.js                     # Web app - JavaScript logic
├── README.md                     # Tài liệu chính này
├── iOS/                          # iOS Version
│   ├── RandomApp.swift           # Entry point iOS app
│   ├── ContentView.swift         # Main TabView
│   ├── NumbersRandomView.swift   # View random số
│   ├── NumbersRandomViewModel.swift # ViewModel random số
│   ├── ListRandomView.swift      # View random danh sách
│   ├── ListRandomViewModel.swift # ViewModel random danh sách
│   ├── HistoryView.swift         # View lịch sử
│   ├── HistoryManager.swift      # Quản lý lịch sử
│   ├── ConfettiView.swift        # Hiệu ứng confetti
│   └── README.md                 # Tài liệu iOS
└── .git/                         # Git repository
```

## 🛠️ Công nghệ sử dụng

### Web Version
- **HTML5**: Cấu trúc trang web với tab navigation
- **CSS3**: Styling, animation và responsive design
- **JavaScript ES6+**: Logic xử lý cho cả hai chức năng
- **LocalStorage**: Lưu lịch sử cả random số và danh sách

### iOS Version
- **SwiftUI**: Framework UI hiện đại của Apple
- **Combine**: Reactive programming cho data binding
- **UserDefaults**: Lưu trữ lịch sử local
- **MVVM Architecture**: Pattern thiết kế clean và maintainable

## 🎨 Tính năng giao diện

### Web Version
- **Tab Navigation**: Chuyển đổi dễ dàng giữa hai chức năng
- **Gradient background**: Nền gradient đẹp mắt
- **Card design**: Thiết kế card hiện đại
- **Smooth animations**: Animation mượt mà
- **Confetti effect**: Hiệu ứng confetti khi tạo thành công
- **Responsive design**: Tương thích mobile

### iOS Version
- **TabView Navigation**: Chuyển đổi dễ dàng giữa 3 tab
- **SwiftUI Design**: Giao diện native iOS đẹp mắt
- **Gradient Backgrounds**: Sử dụng LinearGradient
- **Smooth Animations**: Animation mượt mà với SwiftUI
- **Confetti Effect**: Hiệu ứng confetti khi tạo thành công
- **Dark Mode Support**: Tự động hỗ trợ dark mode

## 🔧 Tùy chỉnh

Bạn có thể dễ dàng tùy chỉnh ứng dụng:

- Thay đổi màu sắc trong `styles.css` (web) hoặc trong SwiftUI (iOS)
- Thêm các loại random khác trong `script.js` hoặc ViewModels
- Tùy chỉnh số lượng lịch sử lưu trữ
- Thêm các validation rules mới
- Thêm các tab chức năng mới

## 📱 Tương thích

### Web Version
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

### iOS Version
- ✅ iPhone (iOS 16.0+)
- ✅ iPad (iOS 16.0+)
- ✅ Dark Mode
- ✅ Portrait & Landscape
- ✅ Accessibility

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

## 🔄 So sánh hai phiên bản

| Tính năng | Web Version | iOS Version |
|-----------|-------------|-------------|
| Random số | ✅ | ✅ |
| Random danh sách | ✅ | ✅ |
| Lưu lịch sử | LocalStorage | UserDefaults |
| Giao diện | HTML/CSS | SwiftUI |
| Animation | CSS/JS | SwiftUI |
| Responsive | CSS Grid | SwiftUI Layout |
| Performance | JavaScript | Native Swift |
| Offline | Cần internet | Hoàn toàn offline |
| Platform | Cross-platform | iOS only |

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa.
