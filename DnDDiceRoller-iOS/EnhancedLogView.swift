import SwiftUI

// MARK: - Enhanced Log View with Customization
struct EnhancedLogView: View {
    @ObservedObject var rollLogger: RollHistoryLogger
    @StateObject private var settings = UserSettingsManager()
    @State private var showingSettings = false
    @State private var searchText = ""
    @State private var selectedFilter: LogFilter = .all
    @State private var showingClearAlert = false
    
    var filteredRolls: [DiceRollHistoryEntry] {
        var rolls = rollLogger.rollHistory
        
        // Apply text search filter
        if !searchText.isEmpty {
            rolls = rolls.filter { entry in
                entry.displayDescription.localizedCaseInsensitiveContains(searchText) ||
                String(entry.roll.total).contains(searchText) ||
                String(entry.roll.diceType).contains(searchText)
            }
        }
        
        // Apply category filter
        switch selectedFilter {
        case .all:
            break
        case .recent:
            let recentDate = Calendar.current.date(byAdding: .hour, value: -24, to: Date()) ?? Date()
            rolls = rolls.filter { $0.timestamp > recentDate }
        case .highRolls:
            rolls = rolls.filter { $0.roll.total > 15 }
        case .lowRolls:
            rolls = rolls.filter { $0.roll.total <= 5 }
        }
        
        return rolls
    }
    
    var body: some View {
        NavigationView {
            VStack {
                // Search and filter bar
                VStack(spacing: 10) {
                    SearchBar(text: $searchText)
                    
                    FilterPicker(selectedFilter: $selectedFilter)
                }
                .padding(.horizontal)
                .background(settings.theme.backgroundColor.opacity(settings.backgroundOpacity))
                
                if filteredRolls.isEmpty {
                    EmptyStateView(settings: settings)
                } else {
                    // Main log list
                    List {
                        ForEach(filteredRolls) { entry in
                            LogEntryRow(entry: entry, settings: settings)
                                .listRowBackground(Color.clear)
                        }
                        .onDelete { indexSet in
                            deleteRolls(at: indexSet)
                        }
                    }
                    .listStyle(PlainListStyle())
                }
            }
            .background(
                LinearGradient(
                    gradient: Gradient(colors: [
                        settings.theme.backgroundColor,
                        settings.theme.backgroundColor.opacity(0.7)
                    ]),
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .navigationTitle("📜 Roll Chronicle")
            .navigationBarItems(
                leading: HStack {
                    Button(action: {
                        showingSettings = true
                    }) {
                        Image(systemName: "gearshape.fill")
                            .foregroundColor(settings.theme.primaryColor)
                    }
                    
                    Button(action: {
                        showingClearAlert = true
                    }) {
                        Image(systemName: "trash")
                            .foregroundColor(.red)
                    }
                },
                trailing: Text("\\(filteredRolls.count) rolls")
                    .font(.caption)
                    .modifier(CustomTextModifier(settings: settings, baseFont: .caption))
            )
            .sheet(isPresented: $showingSettings) {
                SettingsView(settings: settings)
            }
            .alert("Clear All Rolls", isPresented: $showingClearAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Clear All", role: .destructive) {
                    rollLogger.clearHistory()
                }
            } message: {
                Text("This will permanently delete all roll history. This action cannot be undone.")
            }
        }
    }
    
    private func deleteRolls(at offsets: IndexSet) {
        for index in offsets {
            if index < rollLogger.rollHistory.count {
                rollLogger.rollHistory.remove(at: index)
            }
        }
    }
}

// MARK: - Supporting Views
struct SearchBar: View {
    @Binding var text: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.gray)
            
            TextField("Search rolls...", text: $text)
                .font(.body)
                .foregroundColor(.white) // High-contrast white text
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color.black.opacity(0.7),
                                    Color.gray.opacity(0.5)
                                ]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.white.opacity(0.3), lineWidth: 1)
                        )
                )
                .shadow(color: .black.opacity(0.3), radius: 2, x: 1, y: 1)
                .textFieldStyle(PlainTextFieldStyle()) // Remove default styling
            
            if !text.isEmpty {
                Button(action: {
                    text = ""
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.gray)
                }
            }
        }
    }
}

struct FilterPicker: View {
    @Binding var selectedFilter: LogFilter
    
    var body: some View {
        Picker("Filter", selection: $selectedFilter) {
            ForEach(LogFilter.allCases, id: \\.self) { filter in
                Text(filter.displayName).tag(filter)
            }
        }
        .pickerStyle(SegmentedPickerStyle())
    }
}

struct LogEntryRow: View {
    let entry: DiceRollHistoryEntry
    @ObservedObject var settings: UserSettingsManager
    @State private var showingDetails = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Main roll info
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("\\(entry.roll.numberOfDice)d\\(entry.roll.diceType)")
                        .modifier(CustomTextModifier(settings: settings, baseFont: .headline))
                    
                    if !entry.customDescription.isEmpty {
                        Text(entry.customDescription)
                            .modifier(CustomTextModifier(settings: settings, baseFont: .caption))
                    }
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 2) {
                    Text("\\(entry.roll.total)")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(colorForRoll(entry.roll))
                        .modifier(settings.shadowModifier)
                    
                    Text(entry.timestamp, style: .relative)
                        .modifier(CustomTextModifier(settings: settings, baseFont: .caption))
                }
            }
            
            // Individual dice results (collapsed by default)
            if showingDetails {
                RollDetailsView(roll: entry.roll, settings: settings)
                    .transition(.slide)
            }
            
            // Tap to expand/collapse
            Button(action: {
                withAnimation(.easeInOut(duration: 0.3)) {
                    showingDetails.toggle()
                }
            }) {
                HStack {
                    Text(showingDetails ? "Hide Details" : "Show Details")
                        .modifier(CustomTextModifier(settings: settings, baseFont: .caption))
                    
                    Spacer()
                    
                    Image(systemName: showingDetails ? "chevron.up" : "chevron.down")
                        .foregroundColor(settings.effectiveTextColor)
                        .font(.caption)
                }
            }
            .buttonStyle(PlainButtonStyle())
        }
        .padding(.vertical, 4)
    }
    
    private func colorForRoll(_ roll: DiceRoll) -> Color {
        let percentage = Double(roll.total) / Double(roll.diceType * roll.numberOfDice)
        
        if percentage >= 0.8 {
            return .green
        } else if percentage >= 0.6 {
            return .yellow
        } else if percentage >= 0.4 {
            return .orange
        } else {
            return .red
        }
    }
}

struct RollDetailsView: View {
    let roll: DiceRoll
    @ObservedObject var settings: UserSettingsManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Individual Results:")
                .modifier(CustomTextModifier(settings: settings, baseFont: .subheadline))
            
            let columns = Array(repeating: GridItem(.fixed(35), spacing: 8), count: 6)
            
            LazyVGrid(columns: columns, spacing: 6) {
                ForEach(roll.results.indices, id: \\.self) { index in
                    Text("\\(roll.results[index])")
                        .font(.caption)
                        .fontWeight(.medium)
                        .frame(width: 35, height: 35)
                        .background(
                            Circle()
                                .fill(settings.theme.primaryColor.opacity(0.2))
                        )
                        .foregroundColor(settings.effectiveTextColor)
                        .modifier(settings.shadowModifier)
                }
            }
            
            // Statistics
            if roll.results.count > 1 {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Statistics:")
                        .modifier(CustomTextModifier(settings: settings, baseFont: .subheadline))
                    
                    HStack {
                        StatItem(label: "Min", value: "\\(roll.results.min() ?? 0)", settings: settings)
                        StatItem(label: "Max", value: "\\(roll.results.max() ?? 0)", settings: settings)
                        StatItem(label: "Avg", value: String(format: "%.1f", Double(roll.total) / Double(roll.results.count)), settings: settings)
                    }
                }
            }
        }
        .padding(10)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(settings.theme.backgroundColor.opacity(settings.backgroundOpacity + 0.1))
        )
    }
}

struct StatItem: View {
    let label: String
    let value: String
    @ObservedObject var settings: UserSettingsManager
    
    var body: some View {
        VStack(spacing: 2) {
            Text(label)
                .modifier(CustomTextModifier(settings: settings, baseFont: .caption))
            Text(value)
                .modifier(CustomTextModifier(settings: settings, baseFont: .caption))
                .fontWeight(.semibold)
        }
        .frame(maxWidth: .infinity)
    }
}

struct EmptyStateView: View {
    @ObservedObject var settings: UserSettingsManager
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "scroll")
                .font(.system(size: 60))
                .foregroundColor(settings.theme.primaryColor.opacity(0.5))
            
            Text("No Roll History")
                .modifier(CustomTextModifier(settings: settings, baseFont: .title2))
            
            Text("Start rolling dice to see your history here!")
                .modifier(CustomTextModifier(settings: settings, baseFont: .body))
                .multilineTextAlignment(.center)
        }
        .padding(40)
    }
}

// MARK: - Enums
enum LogFilter: String, CaseIterable {
    case all = "all"
    case recent = "recent"
    case highRolls = "high"
    case lowRolls = "low"
    
    var displayName: String {
        switch self {
        case .all: return "All"
        case .recent: return "Recent"
        case .highRolls: return "High"
        case .lowRolls: return "Low"
        }
    }
}

// MARK: - Preview
struct EnhancedLogView_Previews: PreviewProvider {
    static var previews: some View {
        EnhancedLogView(rollLogger: RollHistoryLogger())
    }
}
