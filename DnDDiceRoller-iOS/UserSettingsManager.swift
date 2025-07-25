import SwiftUI
import Foundation

// MARK: - User Settings Manager
class UserSettingsManager: ObservableObject {
    @Published var textColor: Color = .white
    @Published var textShadowEnabled: Bool = true
    @Published var textShadowColor: Color = .black
    @Published var textShadowRadius: CGFloat = 1
    @Published var textShadowX: CGFloat = 1
    @Published var textShadowY: CGFloat = 1
    @Published var backgroundOpacity: Double = 0.2
    @Published var enableHighContrast: Bool = true
    @Published var fontSize: FontSize = .medium
    @Published var theme: AppTheme = .fantasy
    
    private let userDefaults = UserDefaults.standard
    
    init() {
        loadSettings()
    }
    
    // MARK: - Save/Load Settings
    func saveSettings() {
        userDefaults.set(textColor.description, forKey: "textColor")
        userDefaults.set(textShadowEnabled, forKey: "textShadowEnabled")
        userDefaults.set(textShadowColor.description, forKey: "textShadowColor")
        userDefaults.set(textShadowRadius, forKey: "textShadowRadius")
        userDefaults.set(textShadowX, forKey: "textShadowX")
        userDefaults.set(textShadowY, forKey: "textShadowY")
        userDefaults.set(backgroundOpacity, forKey: "backgroundOpacity")
        userDefaults.set(enableHighContrast, forKey: "enableHighContrast")
        userDefaults.set(fontSize.rawValue, forKey: "fontSize")
        userDefaults.set(theme.rawValue, forKey: "theme")
    }
    
    func loadSettings() {
        if let colorString = userDefaults.object(forKey: "textColor") as? String {
            textColor = Color.fromString(colorString) ?? .white
        }
        textShadowEnabled = userDefaults.object(forKey: "textShadowEnabled") as? Bool ?? true
        if let shadowColorString = userDefaults.object(forKey: "textShadowColor") as? String {
            textShadowColor = Color.fromString(shadowColorString) ?? .black
        }
        textShadowRadius = userDefaults.object(forKey: "textShadowRadius") as? CGFloat ?? 1
        textShadowX = userDefaults.object(forKey: "textShadowX") as? CGFloat ?? 1
        textShadowY = userDefaults.object(forKey: "textShadowY") as? CGFloat ?? 1
        backgroundOpacity = userDefaults.object(forKey: "backgroundOpacity") as? Double ?? 0.2
        enableHighContrast = userDefaults.object(forKey: "enableHighContrast") as? Bool ?? true
        if let fontSizeString = userDefaults.object(forKey: "fontSize") as? String {
            fontSize = FontSize(rawValue: fontSizeString) ?? .medium
        }
        if let themeString = userDefaults.object(forKey: "theme") as? String {
            theme = AppTheme(rawValue: themeString) ?? .classic
        }
    }
    
    // MARK: - Reset to Defaults
    func resetToDefaults() {
        textColor = .white
        textShadowEnabled = true
        textShadowColor = .black
        textShadowRadius = 1
        textShadowX = 1
        textShadowY = 1
        backgroundOpacity = 0.2
        enableHighContrast = true
        fontSize = .medium
        theme = .classic
        saveSettings()
    }
    
    // MARK: - Computed Properties for Styling
    var effectiveTextColor: Color {
        return enableHighContrast ? textColor : .secondary
    }
    
    var shadowModifier: some ViewModifier {
        return ShadowModifier(
            enabled: textShadowEnabled,
            color: textShadowColor,
            radius: textShadowRadius,
            x: textShadowX,
            y: textShadowY
        )
    }
}

// MARK: - Enums for Settings
enum FontSize: String, CaseIterable {
    case small = "small"
    case medium = "medium"
    case large = "large"
    case extraLarge = "extraLarge"
    
    var scale: CGFloat {
        switch self {
        case .small: return 0.8
        case .medium: return 1.0
        case .large: return 1.2
        case .extraLarge: return 1.4
        }
    }
    
    var displayName: String {
        switch self {
        case .small: return "Small"
        case .medium: return "Medium"
        case .large: return "Large"
        case .extraLarge: return "Extra Large"
        }
    }
}

enum AppTheme: String, CaseIterable {
    case fantasy = "fantasy"
    case classic = "classic"
    case dark = "dark"
    case highContrast = "highContrast"
    
    var displayName: String {
        switch self {
        case .fantasy: return "Fantasy"
        case .classic: return "Classic"
        case .dark: return "Dark"
        case .highContrast: return "High Contrast"
        }
    }
    
    var primaryColor: Color {
        switch self {
        case .fantasy: return FantasyTheme.Colors.mysticalGold
        case .classic: return .blue
        case .dark: return .purple
        case .highContrast: return .white
        }
    }
    
    var backgroundColor: Color {
        switch self {
        case .fantasy: return FantasyTheme.Colors.deepShadow
        case .classic: return .gray.opacity(0.1)
        case .dark: return .black.opacity(0.8)
        case .highContrast: return .black
        }
    }
}

// MARK: - Custom View Modifiers
struct ShadowModifier: ViewModifier {
    let enabled: Bool
    let color: Color
    let radius: CGFloat
    let x: CGFloat
    let y: CGFloat
    
    func body(content: Content) -> some View {
        if enabled {
            content.shadow(color: color.opacity(0.2), radius: radius, x: x, y: y)
        } else {
            content
        }
    }
}

struct CustomTextModifier: ViewModifier {
    @ObservedObject var settings: UserSettingsManager
    let baseFont: Font
    
    func body(content: Content) -> some View {
        content
            .font(baseFont)
            .foregroundColor(settings.effectiveTextColor)
            .modifier(settings.shadowModifier)
            .scaleEffect(settings.fontSize.scale)
    }
}

// MARK: - Extensions
extension Color {
    static let rainbow = Color.blue // Placeholder for rainbow effect
    
    static func fromString(_ string: String) -> Color? {
        switch string.lowercased() {
        case "white": return .white
        case "black": return .black
        case "blue": return .blue
        case "red": return .red
        case "green": return .green
        case "yellow": return .yellow
        case "orange": return .orange
        case "purple": return .purple
        case "pink": return .pink
        case "gray": return .gray
        case "secondary": return .secondary
        case "primary": return .primary
        default: return nil
        }
    }
    
    var description: String {
        // Simple string representation - in a real app, you'd want proper color encoding
        if self == .white { return "white" }
        if self == .black { return "black" }
        if self == .blue { return "blue" }
        if self == .red { return "red" }
        if self == .green { return "green" }
        if self == .yellow { return "yellow" }
        if self == .orange { return "orange" }
        if self == .purple { return "purple" }
        if self == .pink { return "pink" }
        if self == .gray { return "gray" }
        return "primary"
    }
}

// MARK: - Settings View
struct SettingsView: View {
    @ObservedObject var settings: UserSettingsManager
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        NavigationView {
            Form {
                Section("Display Settings") {
                    // Theme Selection
                    Picker("Theme", selection: $settings.theme) {
                        ForEach(AppTheme.allCases, id: \.self) { theme in
                            Text(theme.displayName).tag(theme)
                        }
                    }
                    
                    // Font Size
                    Picker("Font Size", selection: $settings.fontSize) {
                        ForEach(FontSize.allCases, id: \.self) { size in
                            Text(size.displayName).tag(size)
                        }
                    }
                }
                
                Section("Text Customization") {
                    // High Contrast Toggle
                    Toggle("High Contrast Text", isOn: $settings.enableHighContrast)
                    
                    // Text Color (only if high contrast is enabled)
                    if settings.enableHighContrast {
                        ColorPicker("Text Color", selection: $settings.textColor)
                    }
                    
                    // Text Shadow Settings
                    Toggle("Text Shadow", isOn: $settings.textShadowEnabled)
                    
                    if settings.textShadowEnabled {
                        ColorPicker("Shadow Color", selection: $settings.textShadowColor)
                        
                        VStack(alignment: .leading) {
                            Text("Shadow Blur: \(String(format: "%.1f", settings.textShadowRadius))")
                            Slider(value: $settings.textShadowRadius, in: 0...5, step: 0.1)
                        }
                        
                        VStack(alignment: .leading) {
                            Text("Shadow Offset X: \(String(format: "%.1f", settings.textShadowX))")
                            Slider(value: $settings.textShadowX, in: -5...5, step: 0.1)
                        }
                        
                        VStack(alignment: .leading) {
                            Text("Shadow Offset Y: \(String(format: "%.1f", settings.textShadowY))")
                            Slider(value: $settings.textShadowY, in: -5...5, step: 0.1)
                        }
                    }
                }
                
                Section("Background") {
                    VStack(alignment: .leading) {
                        Text("Background Opacity: \(String(format: "%.1f", settings.backgroundOpacity))")
                        Slider(value: $settings.backgroundOpacity, in: 0...1, step: 0.1)
                    }
                }
                
                Section("Preview") {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Roll History Preview")
                            .modifier(CustomTextModifier(settings: settings, baseFont: .headline))
                        
                        Text("Results: 5 dice")
                            .modifier(CustomTextModifier(settings: settings, baseFont: .subheadline))
                        
                        Text("2 minutes ago")
                            .modifier(CustomTextModifier(settings: settings, baseFont: .caption))
                    }
                    .padding()
                    .background(settings.theme.backgroundColor.opacity(settings.backgroundOpacity))
                    .cornerRadius(8)
                }
                
                Section {
                    Button("Reset to Defaults") {
                        settings.resetToDefaults()
                    }
                    .foregroundColor(.red)
                }
            }
            .navigationTitle("Settings")
            .navigationBarItems(
                leading: Button("Cancel") {
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: Button("Save") {
                    settings.saveSettings()
                    presentationMode.wrappedValue.dismiss()
                }
            )
        }
    }
}

// MARK: - Roll History Logger
class RollHistoryLogger: ObservableObject {
    @Published var rollHistory: [DiceRollHistoryEntry] = []
    private let maxHistoryCount = 100
    
    func addRoll(_ roll: DiceRoll, description: String = "") {
        let historyEntry = DiceRollHistoryEntry(
            id: UUID(),
            roll: roll,
            customDescription: description,
            timestamp: Date()
        )
        
        rollHistory.insert(historyEntry, at: 0)
        
        // Keep only the most recent rolls
        if rollHistory.count > maxHistoryCount {
            rollHistory.removeLast(rollHistory.count - maxHistoryCount)
        }
        
        // Save to UserDefaults
        saveHistory()
    }
    
    func clearHistory() {
        rollHistory.removeAll()
        saveHistory()
    }
    
    private func saveHistory() {
        // In a real app, you'd implement proper persistence
        // For now, we'll just keep it in memory
    }
}

struct DiceRollHistoryEntry: Identifiable {
    let id: UUID
    let roll: DiceRoll
    let customDescription: String
    let timestamp: Date
    
    var displayDescription: String {
        if !customDescription.isEmpty {
            return customDescription
        }
        return roll.description
    }
}
