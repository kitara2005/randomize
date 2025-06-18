import Foundation
import Combine

class ListRandomViewModel: ObservableObject {
    @Published var listText: String = ""
    @Published var count: Int = 1
    @Published var allowDuplicates: Bool = true
    @Published var sortResults: Bool = false
    @Published var results: [String] = []
    @Published var errorMessage: String = ""
    @Published var isValid: Bool = false
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        setupValidation()
    }
    
    private func setupValidation() {
        Publishers.CombineLatest($listText, $count)
            .map { [weak self] text, count in
                self?.validateInputs(listText: text, count: count) ?? false
            }
            .assign(to: \.isValid, on: self)
            .store(in: &cancellables)
    }
    
    private func validateInputs(listText: String, count: Int) -> Bool {
        // Validate list input
        if listText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            errorMessage = "Vui lòng nhập danh sách"
            return false
        }
        
        // Validate count
        if count < 1 || count > 100 {
            errorMessage = "Số lượng kết quả phải từ 1 đến 100"
            return false
        }
        
        // Check if we can generate unique items
        if !allowDuplicates {
            let items = parseList(listText)
            if count > items.count {
                errorMessage = "Không thể tạo \(count) mục khác nhau từ danh sách \(items.count) mục"
                return false
            }
        }
        
        errorMessage = ""
        return true
    }
    
    private func parseList(_ text: String) -> [String] {
        return text.components(separatedBy: .newlines)
            .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
            .filter { !$0.isEmpty }
    }
    
    func generateRandom() {
        guard isValid else { return }
        
        let items = parseList(listText)
        var newResults: [String] = []
        
        if allowDuplicates {
            // Generate with duplicates allowed
            for _ in 0..<count {
                let randomIndex = Int.random(in: 0..<items.count)
                newResults.append(items[randomIndex])
            }
        } else {
            // Generate unique items
            var shuffled = items.shuffled()
            newResults = Array(shuffled.prefix(count))
        }
        
        // Sort if requested
        if sortResults {
            newResults.sort()
        }
        
        results = newResults
        saveToHistory()
    }
    
    func clearResults() {
        results = []
    }
    
    private func saveToHistory() {
        let historyItem = HistoryItem(
            type: .list,
            results: results,
            timestamp: Date(),
            settings: ListSettings(
                count: count,
                allowDuplicates: allowDuplicates,
                sortResults: sortResults
            )
        )
        
        HistoryManager.shared.addItem(historyItem)
    }
}

// MARK: - Supporting Types
struct ListSettings: Codable {
    let count: Int
    let allowDuplicates: Bool
    let sortResults: Bool
} 