import SwiftUI

struct ListRandomView: View {
    @StateObject private var viewModel = ListRandomViewModel()
    @State private var showingConfetti = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Header
                    VStack(spacing: 8) {
                        Text("📝 Random Danh sách")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(.purple)
                        
                        Text("Random từ danh sách tùy chỉnh")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.top)
                    
                    // Input Section
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Danh sách")
                            .font(.headline)
                            .foregroundColor(.primary)
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Nhập danh sách (mỗi dòng một mục)")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            
                            TextEditor(text: $viewModel.listText)
                                .frame(minHeight: 120)
                                .padding(8)
                                .background(Color(.systemGray6))
                                .cornerRadius(8)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(Color(.systemGray4), lineWidth: 1)
                                )
                        }
                        
                        // Count Input
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Số lượng kết quả")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            
                            TextField("1", value: $viewModel.count, format: .number)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .keyboardType(.numberPad)
                        }
                        
                        // Options
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Tùy chọn")
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            Toggle("Cho phép trùng lặp", isOn: $viewModel.allowDuplicates)
                                .toggleStyle(SwitchToggleStyle(tint: .purple))
                            
                            Toggle("Sắp xếp kết quả", isOn: $viewModel.sortResults)
                                .toggleStyle(SwitchToggleStyle(tint: .purple))
                        }
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(12)
                    
                    // Generate Button
                    Button(action: {
                        viewModel.generateRandom()
                        showingConfetti = true
                        
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                            showingConfetti = false
                        }
                    }) {
                        HStack {
                            Image(systemName: "dice.fill")
                            Text("🎯 Random từ danh sách")
                                .fontWeight(.semibold)
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(
                            LinearGradient(
                                gradient: Gradient(colors: [.purple, .blue]),
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .foregroundColor(.white)
                        .cornerRadius(12)
                    }
                    .disabled(!viewModel.isValid)
                    .opacity(viewModel.isValid ? 1.0 : 0.6)
                    
                    // Results Section
                    if !viewModel.results.isEmpty {
                        VStack(alignment: .leading, spacing: 16) {
                            HStack {
                                Text("Kết quả")
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                
                                Spacer()
                                
                                Button(action: {
                                    UIPasteboard.general.string = viewModel.results.joined(separator: ", ")
                                }) {
                                    Image(systemName: "doc.on.doc")
                                        .foregroundColor(.purple)
                                }
                                
                                Button(action: {
                                    viewModel.clearResults()
                                }) {
                                    Image(systemName: "trash")
                                        .foregroundColor(.red)
                                }
                            }
                            
                            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 8) {
                                ForEach(viewModel.results, id: \.self) { result in
                                    Text(result)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 8)
                                        .background(
                                            LinearGradient(
                                                gradient: Gradient(colors: [.purple, .blue]),
                                                startPoint: .topLeading,
                                                endPoint: .bottomTrailing
                                            )
                                        )
                                        .foregroundColor(.white)
                                        .cornerRadius(20)
                                        .font(.system(.body, design: .rounded))
                                        .fontWeight(.semibold)
                                        .lineLimit(1)
                                        .minimumScaleFactor(0.8)
                                }
                            }
                        }
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(12)
                    }
                    
                    // Error Message
                    if !viewModel.errorMessage.isEmpty {
                        Text(viewModel.errorMessage)
                            .foregroundColor(.red)
                            .font(.caption)
                            .padding()
                            .background(Color.red.opacity(0.1))
                            .cornerRadius(8)
                    }
                    
                    Spacer()
                }
                .padding()
            }
            .navigationBarHidden(true)
        }
        .overlay(
            ConfettiView()
                .opacity(showingConfetti ? 1 : 0)
                .allowsHitTesting(false)
        )
    }
}

struct ListRandomView_Previews: PreviewProvider {
    static var previews: some View {
        ListRandomView()
    }
} 