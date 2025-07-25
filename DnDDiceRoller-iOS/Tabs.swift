import SwiftUI

struct PlayerTabView: View {
    @ObservedObject var rollLogger: RollLogger
    @ObservedObject var quickRollManager: QuickRollManager

    var body: some View {
        NavigationView {
            PlayerView(rollLogger: rollLogger)
                .navigationTitle("⚔️ Player")
                .navigationBarTitleDisplayMode(.inline)
                .background(
                    LinearGradient(
                        gradient: Gradient(colors: [Color.red.opacity(0.05), Color.gray.opacity(0.02)]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
        }
    }
}

struct DungeonMasterTabView: View {
    @ObservedObject var rollLogger: RollLogger
    @ObservedObject var quickRollManager: QuickRollManager

    var body: some View {
        NavigationView {
            DungeonMasterView(rollLogger: rollLogger)
                .navigationTitle("🧙‍♂️ Dungeon Master")
                .navigationBarTitleDisplayMode(.inline)
                .background(
                    LinearGradient(
                        gradient: Gradient(colors: [
                            Color.black,
                            Color.purple.opacity(0.8),
                            Color.black.opacity(0.9)
                        ]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .foregroundColor(.white) // High-contrast white text
        }
    }
}

struct LogTabView: View {
    @ObservedObject var rollLogger: RollLogger

    var body: some View {
        NavigationView {
            LogView(rollLogger: rollLogger)
                .navigationTitle("📜 Chronicle")
                .navigationBarTitleDisplayMode(.inline)
                .background(
                    LinearGradient(
                        gradient: Gradient(colors: [
                            Color.black,
                            Color.purple.opacity(0.7),
                            Color.black.opacity(0.95)
                        ]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .foregroundColor(Color.white.opacity(0.95)) // High-contrast off-white text
        }
    }
}

struct GeneralDiceTabView: View {
    @ObservedObject var rollLogger: RollLogger
    @ObservedObject var quickRollManager: QuickRollManager

    var body: some View {
        NavigationView {
            EnhancedGeneralDiceView(rollLogger: rollLogger, quickRollManager: quickRollManager)
                .navigationTitle("🎲 General Dice")
                .navigationBarTitleDisplayMode(.inline)
                .background(
                    LinearGradient(
                        gradient: Gradient(colors: [Color.blue.opacity(0.05), Color.gray.opacity(0.02)]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
        }
    }
}

struct LogListView: View {
    let rolls: [DiceRoll]
    
    var body: some View {
        List(rolls) { roll in
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    VStack(alignment: .leading) {
                        Text(roll.rollType.rawValue)
                            .font(.caption)
                            .foregroundColor(Color.white.opacity(0.8)) // High-contrast secondary text
                        Text("\(roll.numberOfDice)d\(roll.diceType)\(roll.modifier != 0 ? (roll.modifier > 0 ? "+\(roll.modifier)" : "\(roll.modifier)") : "")")
                            .font(.headline)
                            .foregroundColor(.white) // High-contrast primary text
                    }
                    
                    Spacer()
                    
                    Text("\(roll.finalTotal)")
                        .fontWeight(.bold)
                        .foregroundColor(roll.rollType == .damage ? Color.red.opacity(0.9) : (roll.rollType == .healing ? Color.green.opacity(0.9) : Color.cyan.opacity(0.9)))
                        .font(.title2)
                }
                
                if !roll.description.isEmpty {
                    Text(roll.description)
                        .font(.caption)
                        .foregroundColor(Color.white.opacity(0.8)) // High-contrast secondary text
                }
                
                Text("Rolls: \(roll.results.map { String($0) }.joined(separator: ", "))")
                    .font(.body)
                    .foregroundColor(Color.white.opacity(0.9)) // High-contrast body text
                
                if roll.modifier != 0 {
                    Text("Base: \(roll.total) | Modifier: \(roll.modifier >= 0 ? "+" : "")\(roll.modifier)")
                        .font(.caption)
                        .foregroundColor(Color.white.opacity(0.8)) // High-contrast secondary text
                }
                
                Text(roll.timestamp, style: .relative)
                    .font(.caption)
                    .foregroundColor(Color.white.opacity(0.7)) // High-contrast timestamp text
            }
            .padding(.vertical, 4)
            .listRowBackground(Color.clear) // Ensure transparent row background for gradient visibility
        }
        .listStyle(PlainListStyle()) // Remove default list styling for better gradient display
    }
}

struct GeneralDiceView: View {
    @ObservedObject var quickRollManager: QuickRollManager
    
    var body: some View {
        VStack {
            Text("🎲 General Dice Roller")
                .font(.largeTitle)
                .fontWeight(.bold)
                .padding()
            
            Text("Quick access to all dice rolling functions")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .padding(.bottom)
            
            ScrollView {
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                    ForEach(DiceType.allCases, id: \.self) { diceType in
                        Button(action: {
                            // Roll action placeholder
                        }) {
                            VStack {
                                Image(systemName: "dice.fill")
                                    .font(.system(size: 30))
                                    .foregroundColor(.white)
                                Text(diceType.rawValue)
                                    .font(.headline)
                                    .foregroundColor(.white)
                            }
                            .frame(height: 80)
                            .frame(maxWidth: .infinity)
                            .background(
                                LinearGradient(
                                    gradient: Gradient(colors: [Color.blue.opacity(0.8), Color.blue.opacity(0.6)]),
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .cornerRadius(12)
                            .shadow(radius: 3)
                        }
                    }
                }
                .padding(.horizontal)
                
                Divider()
                    .padding(.vertical)
                
                Text("Custom Die Roller")
                    .font(.headline)
                    .padding(.horizontal)
                
                HStack {
                    Text("Custom Die (d\(quickRollManager.customDieSides))")
                        .font(.subheadline)
                    Spacer()
                    Button("Roll") {
                        // Custom roll action placeholder
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding(.horizontal)
            }
            
            Spacer()
        }
        .background(
            LinearGradient(
                gradient: Gradient(colors: [Color.blue.opacity(0.05), Color.gray.opacity(0.02)]),
                startPoint: .top,
                endPoint: .bottom
            )
        )
    }
}
