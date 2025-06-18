import Foundation
import Combine

class NumbersRandomViewModel: ObservableObject {
    @Published var minValue: Double = 1
    @Published var maxValue: Double = 100
    @Published var count: Int = 1
    @Published var decimalPlaces: Int = 0
    @Published var allowDuplicates: Bool = true
    @Published var sortResults: Bool = false
    @Published var results: [Double] = []
    @Published var errorMessage: String = ""
    @Published var isValid: Bool = true
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        setupValidation()
    }
    
    private func setupValidation() {
        Publishers.CombineLatest4($minValue, $maxValue, $count, $decimalPlaces)
            .map { [weak self] minVal, maxVal, count, decimals in
                self?.validateInputs(minValue: minVal, maxValue: maxVal, count: count, decimalPlaces: decimals) ?? false
            }
            .assign(to: \.isValid, on: self)
            .store(in: &cancellables)
    }
    
    private func validateInputs(minValue: Double, maxValue: Double, count: Int, decimalPlaces: Int) -> Bool {
        // Validate min and max values
        if minValue >= maxValue {
            errorMessage = "Giá trị tối thiểu phải nhỏ hơn giá trị tối đa"
            return false
        }
        
        // Validate count
        if count < 1 || count > 100 {
            errorMessage = "Số lượng kết quả phải từ 1 đến 100"
            return false
        }
        
        // Validate decimal places
        if decimalPlaces < 0 || decimalPlaces > 10 {
            errorMessage = "Số chữ số thập phân phải từ 0 đến 10"
            return false
        }
        
        // Check if we can generate unique numbers
        if !allowDuplicates {
            let range = maxValue - minValue + 1
            if Double(count) > range {
                errorMessage = "Không thể tạo \(count) số khác nhau trong khoảng từ \(minValue) đến \(maxValue)"
                return false
            }
        }
        
        errorMessage = ""
        return true
    }
    
    func generateRandom() {
        guard isValid else { return }
        
        var newResults: [Double] = []
        
        if allowDuplicates {
            // Generate with duplicates allowed
            for _ in 0..<count {
                let randomValue = getRandomNumber(min: minValue, max: maxValue, decimalPlaces: decimalPlaces)
                newResults.append(randomValue)
            }
        } else {
            // Generate unique numbers
            var usedNumbers = Set<Double>()
            while newResults.count < count {
                let randomValue = getRandomNumber(min: minValue, max: maxValue, decimalPlaces: decimalPlaces)
                if !usedNumbers.contains(randomValue) {
                    usedNumbers.insert(randomValue)
                    newResults.append(randomValue)
                }
            }
        }
        
        // Sort if requested
        if sortResults {
            newResults.sort()
        }
        
        results = newResults
        saveToHistory()
    }
    
    private func getRandomNumber(min: Double, max: Double, decimalPlaces: Int) -> Double {
        let random = Double.random(in: min...max)
        let multiplier = pow(10.0, Double(decimalPlaces))
        return round(random * multiplier) / multiplier
    }
    
    func clearResults() {
        results = []
    }
    
    private func saveToHistory() {
        let historyItem = HistoryItem(
            type: .numbers,
            results: results.map { String(format: "%.\(decimalPlaces)f", $0) },
            timestamp: Date(),
            settings: NumbersSettings(
                minValue: minValue,
                maxValue: maxValue,
                count: count,
                decimalPlaces: decimalPlaces,
                allowDuplicates: allowDuplicates,
                sortResults: sortResults
            )
        )
        
        HistoryManager.shared.addItem(historyItem)
    }
}

// MARK: - Supporting Types
struct NumbersSettings: Codable {
    let minValue: Double
    let maxValue: Double
    let count: Int
    let decimalPlaces: Int
    let allowDuplicates: Bool
    let sortResults: Bool
} 