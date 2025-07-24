import SwiftUI

struct ContentView: View {
    @State private var diceResult = 0
    @State private var diceType = "d20"
    @State private var isRolling = false
    
    let diceTypes = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"]
    
    var body: some View {
        VStack(spacing: 30) {
            Text("🎲 D&D Dice Roller 🎲")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            
            // Dice type selector
            Picker("Dice Type", selection: $diceType) {
                ForEach(diceTypes, id: \.self) { dice in
                    Text(dice).tag(dice)
                }
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding(.horizontal)
            
            // Result display
            ZStack {
                Circle()
                    .fill(LinearGradient(
                        gradient: Gradient(colors: [.red, .orange]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ))
                    .frame(width: 150, height: 150)
                    .shadow(radius: 10)
                
                Text("\(diceResult)")
                    .font(.system(size: 48, weight: .bold))
                    .foregroundColor(.white)
            }
            .scaleEffect(isRolling ? 1.2 : 1.0)
            .rotationEffect(.degrees(isRolling ? 360 : 0))
            .animation(.easeInOut(duration: 0.5), value: isRolling)
            
            // Roll button
            Button(action: rollDice) {
                HStack {
                    Image(systemName: "dice.fill")
                    Text("Roll \(diceType)")
                }
                .font(.title2)
                .foregroundColor(.white)
                .padding(.horizontal, 30)
                .padding(.vertical, 15)
                .background(
                    RoundedRectangle(cornerRadius: 25)
                        .fill(LinearGradient(
                            gradient: Gradient(colors: [.blue, .purple]),
                            startPoint: .leading,
                            endPoint: .trailing
                        ))
                )
                .shadow(radius: 5)
            }
            .disabled(isRolling)
            
            if diceResult > 0 {
                Text("You rolled: \(diceResult)")
                    .font(.title3)
                    .foregroundColor(.secondary)
                    .padding(.top)
            }
            
            Spacer()
        }
        .padding()
        .background(
            LinearGradient(
                gradient: Gradient(colors: [.black.opacity(0.1), .gray.opacity(0.1)]),
                startPoint: .top,
                endPoint: .bottom
            )
        )
    }
    
    private func rollDice() {
        isRolling = true
        
        // Simulate rolling animation
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            let sides = getSidesForDice(diceType)
            diceResult = Int.random(in: 1...sides)
            isRolling = false
        }
    }
    
    private func getSidesForDice(_ dice: String) -> Int {
        switch dice {
        case "d4": return 4
        case "d6": return 6
        case "d8": return 8
        case "d10": return 10
        case "d12": return 12
        case "d20": return 20
        case "d100": return 100
        default: return 20
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
