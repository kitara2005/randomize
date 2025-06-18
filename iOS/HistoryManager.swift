import Foundation

// MARK: - Models
enum RandomType: String, Codable {
    case numbers = "numbers"
    case list = "list"
}

struct HistoryItem: Identifiable, Codable {
    let id = UUID()
    let type: RandomType
    let results: [String]
    let timestamp: Date
    let settings: Any?
    
    var formattedTimestamp: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        formatter.locale = Locale(identifier: "vi_VN")
        return formatter.string(from: timestamp)
    }
    
    // Custom coding for settings
    enum CodingKeys: String, CodingKey {
        case type, results, timestamp, settings
    }
    
    init(type: RandomType, results: [String], timestamp: Date, settings: Any?) {
        self.type = type
        self.results = results
        self.timestamp = timestamp
        self.settings = settings
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        type = try container.decode(RandomType.self, forKey: .type)
        results = try container.decode([String].self, forKey: .results)
        timestamp = try container.decode(Date.self, forKey: .timestamp)
        
        // Decode settings based on type
        if type == .numbers {
            settings = try? container.decode(NumbersSettings.self, forKey: .settings)
        } else {
            settings = try? container.decode(ListSettings.self, forKey: .settings)
        }
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type, forKey: .type)
        try container.encode(results, forKey: .results)
        try container.encode(timestamp, forKey: .timestamp)
        
        // Encode settings based on type
        if let numbersSettings = settings as? NumbersSettings {
            try container.encode(numbersSettings, forKey: .settings)
        } else if let listSettings = settings as? ListSettings {
            try container.encode(listSettings, forKey: .settings)
        }
    }
}

// MARK: - History Manager
class HistoryManager: ObservableObject {
    static let shared = HistoryManager()
    
    @Published var historyItems: [HistoryItem] = []
    
    private let userDefaults = UserDefaults.standard
    private let historyKey = "RandomHistory"
    
    private init() {
        loadHistory()
    }
    
    func addItem(_ item: HistoryItem) {
        historyItems.insert(item, at: 0)
        
        // Keep only last 20 items
        if historyItems.count > 20 {
            historyItems = Array(historyItems.prefix(20))
        }
        
        saveHistory()
    }
    
    func deleteItem(_ item: HistoryItem) {
        historyItems.removeAll { $0.id == item.id }
        saveHistory()
    }
    
    func clearAllHistory() {
        historyItems.removeAll()
        saveHistory()
    }
    
    private func loadHistory() {
        if let data = userDefaults.data(forKey: historyKey) {
            do {
                let decoder = JSONDecoder()
                historyItems = try decoder.decode([HistoryItem].self, from: data)
            } catch {
                print("Error loading history: \(error)")
                historyItems = []
            }
        }
    }
    
    private func saveHistory() {
        do {
            let encoder = JSONEncoder()
            let data = try encoder.encode(historyItems)
            userDefaults.set(data, forKey: historyKey)
        } catch {
            print("Error saving history: \(error)")
        }
    }
}

// MARK: - History ViewModel
class HistoryViewModel: ObservableObject {
    @Published var historyItems: [HistoryItem] = []
    
    func loadHistory() {
        historyItems = HistoryManager.shared.historyItems
    }
    
    func deleteItem(_ item: HistoryItem) {
        HistoryManager.shared.deleteItem(item)
        loadHistory()
    }
    
    func clearAllHistory() {
        HistoryManager.shared.clearAllHistory()
        loadHistory()
    }
} 