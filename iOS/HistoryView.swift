import SwiftUI

struct HistoryView: View {
    @StateObject private var viewModel = HistoryViewModel()
    
    var body: some View {
        NavigationView {
            List {
                ForEach(viewModel.historyItems) { item in
                    HistoryItemView(item: item)
                        .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                            Button(role: .destructive) {
                                viewModel.deleteItem(item)
                            } label: {
                                Label("Xóa", systemImage: "trash")
                            }
                        }
                }
            }
            .navigationTitle("Lịch sử")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Xóa tất cả") {
                        viewModel.clearAllHistory()
                    }
                    .foregroundColor(.red)
                }
            }
            .overlay(
                Group {
                    if viewModel.historyItems.isEmpty {
                        VStack(spacing: 16) {
                            Image(systemName: "clock.circle")
                                .font(.system(size: 60))
                                .foregroundColor(.gray)
                            
                            Text("Chưa có lịch sử")
                                .font(.title2)
                                .foregroundColor(.secondary)
                            
                            Text("Các lần random sẽ được lưu ở đây")
                                .font(.caption)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                        }
                    }
                }
            )
        }
        .onAppear {
            viewModel.loadHistory()
        }
    }
}

struct HistoryItemView: View {
    let item: HistoryItem
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: item.type == .numbers ? "number.circle.fill" : "list.bullet.circle.fill")
                    .foregroundColor(.purple)
                
                Text(item.type == .numbers ? "Random số" : "Random danh sách")
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Spacer()
                
                Text(item.formattedTimestamp)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 6) {
                ForEach(item.results, id: \.self) { result in
                    Text(result)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.purple.opacity(0.1))
                        .foregroundColor(.purple)
                        .cornerRadius(12)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                }
            }
            
            if let settings = item.settings {
                SettingsSummaryView(settings: settings, type: item.type)
            }
        }
        .padding(.vertical, 8)
    }
}

struct SettingsSummaryView: View {
    let settings: Any
    let type: RandomType
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Cài đặt:")
                .font(.caption)
                .foregroundColor(.secondary)
            
            if type == .numbers, let numbersSettings = settings as? NumbersSettings {
                Text("• Khoảng: \(String(format: "%.0f", numbersSettings.minValue)) - \(String(format: "%.0f", numbersSettings.maxValue))")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                Text("• Số lượng: \(numbersSettings.count)")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                Text("• Trùng lặp: \(numbersSettings.allowDuplicates ? "Có" : "Không")")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            } else if type == .list, let listSettings = settings as? ListSettings {
                Text("• Số lượng: \(listSettings.count)")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                Text("• Trùng lặp: \(listSettings.allowDuplicates ? "Có" : "Không")")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
        }
    }
}

struct HistoryView_Previews: PreviewProvider {
    static var previews: some View {
        HistoryView()
    }
} 