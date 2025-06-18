import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            NumbersRandomView()
                .tabItem {
                    Image(systemName: "number.circle.fill")
                    Text("Random Số")
                }
            
            ListRandomView()
                .tabItem {
                    Image(systemName: "list.bullet.circle.fill")
                    Text("Random Danh sách")
                }
            
            HistoryView()
                .tabItem {
                    Image(systemName: "clock.circle.fill")
                    Text("Lịch sử")
                }
        }
        .accentColor(.purple)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
} 