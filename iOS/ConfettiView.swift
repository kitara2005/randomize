import SwiftUI

struct ConfettiView: View {
    @State private var particles: [ConfettiParticle] = []
    
    var body: some View {
        ZStack {
            ForEach(particles) { particle in
                Circle()
                    .fill(particle.color)
                    .frame(width: particle.size, height: particle.size)
                    .position(particle.position)
                    .opacity(particle.opacity)
            }
        }
        .onAppear {
            createParticles()
        }
    }
    
    private func createParticles() {
        particles.removeAll()
        
        let colors: [Color] = [.purple, .blue, .pink, .orange, .green]
        let screenWidth = UIScreen.main.bounds.width
        let screenHeight = UIScreen.main.bounds.height
        
        for _ in 0..<50 {
            let particle = ConfettiParticle(
                id: UUID(),
                position: CGPoint(
                    x: CGFloat.random(in: 0...screenWidth),
                    y: -20
                ),
                color: colors.randomElement() ?? .purple,
                size: CGFloat.random(in: 4...12),
                opacity: 1.0
            )
            particles.append(particle)
        }
        
        // Animate particles
        withAnimation(.easeOut(duration: 3.0)) {
            for i in particles.indices {
                particles[i].position.y = screenHeight + 50
                particles[i].opacity = 0.0
            }
        }
        
        // Remove particles after animation
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            particles.removeAll()
        }
    }
}

struct ConfettiParticle: Identifiable {
    let id: UUID
    var position: CGPoint
    let color: Color
    let size: CGFloat
    var opacity: Double
}

struct ConfettiView_Previews: PreviewProvider {
    static var previews: some View {
        ConfettiView()
    }
} 