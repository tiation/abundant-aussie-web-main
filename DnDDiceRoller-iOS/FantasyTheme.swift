import SwiftUI

// MARK: - Fantasy Theme System
struct FantasyTheme {
    // MARK: - Color Palette
    struct Colors {
        // Primary fantasy colors with high contrast
        static let mysticalGold = Color(red: 1.0, green: 0.84, blue: 0.0)        // #FFD700
        static let arcaneBlue = Color(red: 0.0, green: 0.5, blue: 1.0)           // #0080FF
        static let shadowPurple = Color(red: 0.4, green: 0.0, blue: 0.8)         // #6600CC
        static let dragonRed = Color(red: 0.8, green: 0.1, blue: 0.1)            // #CC1A1A
        static let emeraldGreen = Color(red: 0.0, green: 0.7, blue: 0.3)         // #00B34D
        
        // High-contrast text colors
        static let primaryText = Color.white                                      // Pure white for maximum contrast
        static let secondaryText = Color(white: 0.85)                            // Light gray for secondary content
        static let tertiaryText = Color(white: 0.65)                             // Medium gray for timestamps/captions
        static let accentText = mysticalGold                                     // Gold for important highlights
        
        // Background colors with fantasy gradient feel
        static let deepShadow = Color(red: 0.05, green: 0.05, blue: 0.1)        // Very dark blue-black
        static let darkMystic = Color(red: 0.1, green: 0.05, blue: 0.15)        // Dark purple-black
        static let shadowGray = Color(red: 0.08, green: 0.08, blue: 0.08)       // Deep charcoal
        
        // Interactive element colors
        static let buttonPrimary = LinearGradient(
            gradient: Gradient(colors: [arcaneBlue, shadowPurple]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        
        static let buttonSecondary = LinearGradient(
            gradient: Gradient(colors: [mysticalGold.opacity(0.8), dragonRed.opacity(0.6)]),
            startPoint: .leading,
            endPoint: .trailing
        )
        
        static let fieldBackground = LinearGradient(
            gradient: Gradient(colors: [
                deepShadow.opacity(0.9),
                shadowPurple.opacity(0.3)
            ]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        
        // Result colors for dice rolls
        static let criticalSuccess = emeraldGreen
        static let highRoll = mysticalGold
        static let mediumRoll = arcaneBlue
        static let lowRoll = Color.orange
        static let criticalFailure = dragonRed
    }
    
    // MARK: - Typography
    struct Typography {
        static func heroTitle() -> Font {
            .system(size: 28, weight: .bold, design: .rounded)
        }
        
        static func sectionTitle() -> Font {
            .system(size: 20, weight: .semibold, design: .rounded)
        }
        
        static func bodyText() -> Font {
            .system(size: 16, weight: .medium, design: .default)
        }
        
        static func captionText() -> Font {
            .system(size: 12, weight: .regular, design: .default)
        }
        
        static func diceResult() -> Font {
            .system(size: 48, weight: .bold, design: .rounded)
        }
        
        static func buttonText() -> Font {
            .system(size: 18, weight: .semibold, design: .rounded)
        }
    }
    
    // MARK: - Shadow Effects
    struct Shadows {
        static let textGlow = Shadow(
            color: Colors.mysticalGold.opacity(0.3),
            radius: 2,
            x: 0,
            y: 0
        )
        
        static let textDepth = Shadow(
            color: Color.black.opacity(0.8),
            radius: 1,
            x: 1,
            y: 1
        )
        
        static let elementDepth = Shadow(
            color: Color.black.opacity(0.5),
            radius: 4,
            x: 2,
            y: 2
        )
        
        static let buttonElevation = Shadow(
            color: Color.black.opacity(0.3),
            radius: 6,
            x: 0,
            y: 3
        )
    }
    
    // MARK: - Gradients
    struct Gradients {
        static let appBackground = LinearGradient(
            gradient: Gradient(colors: [
                Colors.deepShadow,
                Colors.darkMystic,
                Colors.shadowGray
            ]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        
        static let cardBackground = LinearGradient(
            gradient: Gradient(colors: [
                Colors.shadowGray.opacity(0.6),
                Colors.darkMystic.opacity(0.4)
            ]),
            startPoint: .top,
            endPoint: .bottom
        )
        
        static let diceGradient = LinearGradient(
            gradient: Gradient(colors: [Colors.dragonRed, Colors.mysticalGold]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}

// MARK: - Shadow Structure
struct Shadow {
    let color: Color
    let radius: CGFloat
    let x: CGFloat
    let y: CGFloat
}

// MARK: - View Modifiers
struct FantasyTextModifier: ViewModifier {
    let textStyle: TextStyle
    let enableGlow: Bool
    
    enum TextStyle {
        case heroTitle
        case sectionTitle
        case bodyText
        case captionText
        case accentText
        case secondaryText
        case tertiaryText
    }
    
    func body(content: Content) -> some View {
        content
            .font(fontForStyle())
            .foregroundColor(colorForStyle())
            .shadow(
                color: shadowForStyle().color,
                radius: shadowForStyle().radius,
                x: shadowForStyle().x,
                y: shadowForStyle().y
            )
            .if(enableGlow && (textStyle == .heroTitle || textStyle == .accentText)) { view in
                view.shadow(
                    color: FantasyTheme.Shadows.textGlow.color,
                    radius: FantasyTheme.Shadows.textGlow.radius,
                    x: FantasyTheme.Shadows.textGlow.x,
                    y: FantasyTheme.Shadows.textGlow.y
                )
            }
    }
    
    private func fontForStyle() -> Font {
        switch textStyle {
        case .heroTitle:
            return FantasyTheme.Typography.heroTitle()
        case .sectionTitle:
            return FantasyTheme.Typography.sectionTitle()
        case .bodyText, .accentText, .secondaryText:
            return FantasyTheme.Typography.bodyText()
        case .captionText, .tertiaryText:
            return FantasyTheme.Typography.captionText()
        }
    }
    
    private func colorForStyle() -> Color {
        switch textStyle {
        case .heroTitle, .bodyText:
            return FantasyTheme.Colors.primaryText
        case .sectionTitle:
            return FantasyTheme.Colors.primaryText
        case .accentText:
            return FantasyTheme.Colors.accentText
        case .secondaryText:
            return FantasyTheme.Colors.secondaryText
        case .captionText, .tertiaryText:
            return FantasyTheme.Colors.tertiaryText
        }
    }
    
    private func shadowForStyle() -> Shadow {
        switch textStyle {
        case .heroTitle, .accentText:
            return FantasyTheme.Shadows.textDepth
        case .sectionTitle, .bodyText, .secondaryText:
            return FantasyTheme.Shadows.textDepth
        case .captionText, .tertiaryText:
            return Shadow(
                color: Color.black.opacity(0.6),
                radius: 0.5,
                x: 0.5,
                y: 0.5
            )
        }
    }
}

struct FantasyButtonModifier: ViewModifier {
    let style: ButtonStyle
    let isPressed: Bool
    
    enum ButtonStyle {
        case primary
        case secondary
        case dice
    }
    
    func body(content: Content) -> some View {
        content
            .font(FantasyTheme.Typography.buttonText())
            .foregroundColor(FantasyTheme.Colors.primaryText)
            .padding(.horizontal, 24)
            .padding(.vertical, 12)
            .background(backgroundForStyle())
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
                color: FantasyTheme.Shadows.buttonElevation.color,
                radius: FantasyTheme.Shadows.buttonElevation.radius,
                x: FantasyTheme.Shadows.buttonElevation.x,
                y: FantasyTheme.Shadows.buttonElevation.y
            )
            .scaleEffect(isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: isPressed)
    }
    
    private func backgroundForStyle() -> LinearGradient {
        switch style {
        case .primary:
            return FantasyTheme.Colors.buttonPrimary
        case .secondary:
            return FantasyTheme.Colors.buttonSecondary
        case .dice:
            return FantasyTheme.Gradients.diceGradient
        }
    }
}

struct FantasyFieldModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .font(FantasyTheme.Typography.bodyText())
            .foregroundColor(FantasyTheme.Colors.primaryText)
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(FantasyTheme.Colors.fieldBackground)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(FantasyTheme.Colors.primaryText.opacity(0.3), lineWidth: 1)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(
                        LinearGradient(
                            gradient: Gradient(colors: [
                                FantasyTheme.Colors.primaryText.opacity(0.1),
                                Color.clear
                            ]),
                            startPoint: .top,
                            endPoint: .bottom
                        ),
                        lineWidth: 0.5
                    )
            )
            .shadow(
                color: Color.black.opacity(0.5),
                radius: 4,
                x: 2,
                y: 2
            )
    }
}

// MARK: - Utility Extensions
extension View {
    func fantasyText(_ style: FantasyTextModifier.TextStyle, enableGlow: Bool = false) -> some View {
        self.modifier(FantasyTextModifier(textStyle: style, enableGlow: enableGlow))
    }
    
    func fantasyButton(_ style: FantasyButtonModifier.ButtonStyle, isPressed: Bool = false) -> some View {
        self.modifier(FantasyButtonModifier(style: style, isPressed: isPressed))
    }
    
    func fantasyField() -> some View {
        self.modifier(FantasyFieldModifier())
    }
    
    @ViewBuilder
    func `if`<Content: View>(_ condition: Bool, transform: (Self) -> Content) -> some View {
        if condition {
            transform(self)
        } else {
            self
        }
    }
}

// MARK: - Dice Roll Result Color Helper
extension FantasyTheme {
    static func colorForDiceResult(_ result: Int, maxPossible: Int) -> Color {
        let percentage = Double(result) / Double(maxPossible)
        
        switch percentage {
        case 0.9...1.0:
            return Colors.criticalSuccess
        case 0.75..<0.9:
            return Colors.highRoll
        case 0.5..<0.75:
            return Colors.mediumRoll
        case 0.25..<0.5:
            return Colors.lowRoll
        default:
            return Colors.criticalFailure
        }
    }
}
