import SwiftUI

struct PlayerTabView: View {
    @ObservedObject var rollLogger: RollLogger
    @ObservedObject var quickRollManager: QuickRollManager

    var body: some View {
        NavigationView {
            PlayerView(rollLogger: rollLogger)
                .navigationTitle("⚔️ Player")
                .navigationBarTitleDisplayMode(.inline)
                .background(FantasyTheme.Gradients.appBackground)
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
                            FantasyTheme.Colors.deepShadow,
                            FantasyTheme.Colors.shadowPurple.opacity(0.8),
                            FantasyTheme.Colors.darkMystic
                        ]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .foregroundColor(FantasyTheme.Colors.primaryText)
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
                            FantasyTheme.Colors.deepShadow,
                            FantasyTheme.Colors.shadowPurple.opacity(0.7),
                            FantasyTheme.Colors.darkMystic
                        ]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .foregroundColor(FantasyTheme.Colors.primaryText)
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
                .background(FantasyTheme.Gradients.appBackground)
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
                            .fantasyText(.captionText)
                        Text("\(roll.numberOfDice)d\(roll.diceType)\(roll.modifier != 0 ? (roll.modifier > 0 ? "+\(roll.modifier)" : "\(roll.modifier)") : "")")
                            .fantasyText(.sectionTitle)
                    }
                    
                    Spacer()
                    
                    Text("\(roll.finalTotal)")
                        .font(FantasyTheme.Typography.sectionTitle())
                        .fontWeight(.bold)
                        .foregroundColor(roll.rollType == .damage ? FantasyTheme.Colors.dragonRed : (roll.rollType == .healing ? FantasyTheme.Colors.emeraldGreen : FantasyTheme.Colors.arcaneBlue))
                        .shadow(
                            color: Color.black.opacity(0.8),
                            radius: 1,
                            x: 1,
                            y: 1
                        )
                }
                
                if !roll.description.isEmpty {
                    Text(roll.description)
                        .fantasyText(.captionText)
                }
                
                Text("Rolls: \(roll.results.map { String($0) }.joined(separator: ", "))")
                    .fantasyText(.bodyText)
                
                if roll.modifier != 0 {
                    Text("Base: \(roll.total) | Modifier: \(roll.modifier >= 0 ? "+" : "")\(roll.modifier)")
                        .fantasyText(.captionText)
                }
                
                Text(roll.timestamp, style: .relative)
                    .fantasyText(.tertiaryText)
            }
            .padding(.vertical, 4)
            .listRowBackground(Color.clear)
        }
        .listStyle(PlainListStyle())
    }
}

struct GeneralDiceView: View {
    @ObservedObject var quickRollManager: QuickRollManager
    
    var body: some View {
        VStack {
            Text("🎲 General Dice Roller")
                .fantasyText(.heroTitle, enableGlow: true)
                .padding()
            
            Text("Quick access to all dice rolling functions")
                .fantasyText(.secondaryText)
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
                                    .foregroundColor(FantasyTheme.Colors.primaryText)
                                Text(diceType.rawValue)
                                    .fantasyText(.sectionTitle)
                            }
                            .frame(height: 80)
                            .frame(maxWidth: .infinity)
                            .background(FantasyTheme.Colors.buttonPrimary)
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(
                                        LinearGradient(
                                            gradient: Gradient(colors: [
                                                FantasyTheme.Colors.primaryText.opacity(0.2),
                                                Color.clear
                                            ]),
                                            startPoint: .top,
                                            endPoint: .bottom
                                        ),
                                        lineWidth: 1
                                    )
                            )
                            .shadow(
                                color: FantasyTheme.Shadows.elementDepth.color,
                                radius: FantasyTheme.Shadows.elementDepth.radius,
                                x: FantasyTheme.Shadows.elementDepth.x,
                                y: FantasyTheme.Shadows.elementDepth.y
                            )
                        }
                    }
                }
                .padding(.horizontal)
                
                Divider()
                    .background(FantasyTheme.Colors.secondaryText)
                    .padding(.vertical)
                
                Text("Custom Die Roller")
                    .fantasyText(.sectionTitle)
                    .padding(.horizontal)
                
                HStack {
                    Text("Custom Die (d\(quickRollManager.customDieSides))")
                        .fantasyText(.bodyText)
                    Spacer()
                    Button("Roll") {
                        // Custom roll action placeholder
                    }
                    .fantasyButton(.secondary)
                }
                .padding(.horizontal)
            }
            
            Spacer()
        }
        .background(FantasyTheme.Gradients.appBackground)
    }
}
