import SwiftUI

struct ContentView: View {
    @State private var diceResult = 0
    @State private var diceType = "d20"
    @State private var isRolling = false
    @State private var customRollDescription = ""
    
    let diceTypes = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"]
    
    var body: some View {
        VStack(spacing: 30) {
            Text("🎲 D&D Dice Roller 🎲")
                .fantasyText(.heroTitle, enableGlow: true)
            
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
                    .fill(FantasyTheme.Gradients.diceGradient)
                    .frame(width: 150, height: 150)
                    .shadow(
                        color: FantasyTheme.Shadows.elementDepth.color,
                        radius: FantasyTheme.Shadows.elementDepth.radius,
                        x: FantasyTheme.Shadows.elementDepth.x,
                        y: FantasyTheme.Shadows.elementDepth.y
                    )
                    .overlay(
                        Circle()
                            .stroke(
                                LinearGradient(
                                    gradient: Gradient(colors: [
                                        FantasyTheme.Colors.primaryText.opacity(0.3),
                                        Color.clear
                                    ]),
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ),
                                lineWidth: 2
                            )
                    )
                
                Text("\(diceResult)")
                    .font(FantasyTheme.Typography.diceResult())
                    .foregroundColor(FantasyTheme.Colors.primaryText)
                    .shadow(
                        color: Color.black.opacity(0.8),
                        radius: 2,
                        x: 1,
                        y: 1
                    )
            }
            .scaleEffect(isRolling ? 1.2 : 1.0)
            .rotationEffect(.degrees(isRolling ? 360 : 0))
            .animation(.easeInOut(duration: 0.5), value: isRolling)
            
            // Custom Roll Description TextField with High Contrast
            VStack(alignment: .leading, spacing: 8) {
                Text("Custom Roll Description:")
                    .fantasyText(.sectionTitle)
                
                TextField("Enter description for this roll...", text: $customRollDescription)
                    .fantasyField()
                    .textFieldStyle(PlainTextFieldStyle())
            }
            .padding(.horizontal)
            
            // Roll button
            Button(action: rollDice) {
                HStack {
                    Image(systemName: "dice.fill")
                    Text("Roll \(diceType)")
                }
                .fantasyButton(.dice)
            }
            .disabled(isRolling)
            
            if diceResult > 0 {
                let maxPossible = getSidesForDice(diceType)
                HStack {
                    Text("You rolled:")
                        .fantasyText(.bodyText)
                    Text("\(diceResult)")
                        .font(FantasyTheme.Typography.sectionTitle())
                        .foregroundColor(FantasyTheme.colorForDiceResult(diceResult, maxPossible: maxPossible))
                        .shadow(
                            color: Color.black.opacity(0.8),
                            radius: 1,
                            x: 1,
                            y: 1
                        )
                }
                .padding(.top)
            }
            
            Spacer()
        }
        .padding()
        .background(FantasyTheme.Gradients.appBackground)
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
