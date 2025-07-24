import UIKit
import ARKit
import RealityKit
import CoreHaptics

// Main entry point
UIApplicationMain(
    CommandLine.argc,
    CommandLine.unsafeArgv,
    nil,
    NSStringFromClass(AppDelegate.self)
)

class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = ARViewController()
        window?.makeKeyAndVisible()
        return true
    }
}

class ARViewController: UIViewController, ARSessionDelegate {
    @IBOutlet var arView: ARView!
    private var hapticEngine: CHHapticEngine?
    private var statusHUD: UIView!
    private var menuContainer: UIView!
    private var isMenuExpanded = false
    private var sessionStatusLabel: UILabel!
    private var metricsView: UIView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupHaptics()
        setupUI()
        setupAR()
        startUIAnimations()
    }
    
    private func setupHaptics() {
        guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else { return }
        do {
            hapticEngine = try CHHapticEngine()
            try hapticEngine?.start()
        } catch {
            print("Haptic engine creation error: \(error)")
        }
    }
    
    private func setupUI() {
        view.backgroundColor = .black
        
        // Create ARView programmatically
        arView = ARView(frame: view.bounds)
        arView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(arView)
        
        // Add enterprise UI overlay
        setupEnterpriseUI()
    }
    
    private func setupEnterpriseUI() {
        setupHeaderView()
        setupStatusHUD()
        setupMenuSystem()
        setupMetricsView()
        setupCrosshair()
    }
    
    private func setupHeaderView() {
        let headerContainer = UIView(frame: CGRect(x: 0, y: 0, width: view.bounds.width, height: 130))
        headerContainer.backgroundColor = UIColor.black.withAlphaComponent(0.85)
        
        // Add gradient overlay
        let gradientLayer = CAGradientLayer()
        gradientLayer.frame = headerContainer.bounds
        gradientLayer.colors = [UIColor.black.cgColor, UIColor.clear.cgColor]
        gradientLayer.locations = [0.7, 1.0]
        headerContainer.layer.addSublayer(gradientLayer)
        
        // Enterprise logo/title with better spacing
        let logoContainer = UIView(frame: CGRect(x: 20, y: 60, width: view.bounds.width - 40, height: 60))
        
        let titleLabel = UILabel(frame: CGRect(x: 0, y: 0, width: logoContainer.bounds.width, height: 32))
        titleLabel.text = "ENTERPRISE AR VISUALIZER"
        titleLabel.textColor = UIColor.cyan
        titleLabel.font = UIFont(name: "Menlo-Bold", size: 20) ?? UIFont.boldSystemFont(ofSize: 20)
        titleLabel.textAlignment = .center
        titleLabel.layer.shadowColor = UIColor.cyan.cgColor
        titleLabel.layer.shadowRadius = 4
        titleLabel.layer.shadowOpacity = 0.7
        titleLabel.layer.shadowOffset = CGSize(width: 0, height: 0)
        logoContainer.addSubview(titleLabel)
        
        let subtitleLabel = UILabel(frame: CGRect(x: 0, y: 35, width: logoContainer.bounds.width, height: 22))
        subtitleLabel.text = "Advanced Industrial Visualization Platform"
        subtitleLabel.textColor = UIColor.white.withAlphaComponent(0.7)
        subtitleLabel.font = UIFont(name: "Menlo", size: 14) ?? UIFont.systemFont(ofSize: 14)
        subtitleLabel.textAlignment = .center
        logoContainer.addSubview(subtitleLabel)
        
        headerContainer.addSubview(logoContainer)
        view.addSubview(headerContainer)
        
        // AR Session Status - moved to avoid overlap
        sessionStatusLabel = UILabel(frame: CGRect(x: view.bounds.width - 140, y: 65, width: 120, height: 25))
        sessionStatusLabel.text = "⚫ INITIALIZING"
        sessionStatusLabel.textColor = .orange
        sessionStatusLabel.font = UIFont(name: "Menlo-Bold", size: 12) ?? UIFont.boldSystemFont(ofSize: 12)
        sessionStatusLabel.textAlignment = .right
        headerContainer.addSubview(sessionStatusLabel)
    }
    
    private func setupStatusHUD() {
        statusHUD = UIView(frame: CGRect(x: 20, y: 150, width: 220, height: 100))
        statusHUD.backgroundColor = UIColor.black.withAlphaComponent(0.8)
        statusHUD.layer.cornerRadius = 12
        statusHUD.layer.borderWidth = 1
        statusHUD.layer.borderColor = UIColor.cyan.withAlphaComponent(0.3).cgColor
        statusHUD.alpha = 0.9
        
        // Add subtle glow effect
        statusHUD.layer.shadowColor = UIColor.cyan.cgColor
        statusHUD.layer.shadowRadius = 8
        statusHUD.layer.shadowOpacity = 0.3
        statusHUD.layer.shadowOffset = CGSize(width: 0, height: 0)
        
        let statusTitle = UILabel(frame: CGRect(x: 15, y: 12, width: 190, height: 20))
        statusTitle.text = "SYSTEM STATUS"
        statusTitle.textColor = .cyan
        statusTitle.font = UIFont(name: "Menlo-Bold", size: 13) ?? UIFont.boldSystemFont(ofSize: 13)
        statusHUD.addSubview(statusTitle)
        
        let trackingLabel = UILabel(frame: CGRect(x: 15, y: 35, width: 190, height: 18))
        trackingLabel.text = "🎯 Tracking: Normal"
        trackingLabel.textColor = .white
        trackingLabel.font = UIFont(name: "Menlo", size: 12) ?? UIFont.systemFont(ofSize: 12)
        statusHUD.addSubview(trackingLabel)
        
        let anchorsLabel = UILabel(frame: CGRect(x: 15, y: 55, width: 190, height: 18))
        anchorsLabel.text = "⚓ Anchors: 0 detected"
        anchorsLabel.textColor = .white
        anchorsLabel.font = UIFont(name: "Menlo", size: 12) ?? UIFont.systemFont(ofSize: 12)
        statusHUD.addSubview(anchorsLabel)
        
        let fpsLabel = UILabel(frame: CGRect(x: 15, y: 75, width: 190, height: 18))
        fpsLabel.text = "📊 Rendering: 60 FPS"
        fpsLabel.textColor = .white
        fpsLabel.font = UIFont(name: "Menlo", size: 12) ?? UIFont.systemFont(ofSize: 12)
        statusHUD.addSubview(fpsLabel)
        
        view.addSubview(statusHUD)
    }
    
    private func setupMenuSystem() {
        // Floating action button
        let fabButton = UIButton(frame: CGRect(x: view.bounds.width - 70, y: view.bounds.height - 150, width: 50, height: 50))
        fabButton.backgroundColor = UIColor.cyan
        fabButton.layer.cornerRadius = 25
        fabButton.setTitle("+", for: .normal)
        fabButton.setTitleColor(.black, for: .normal)
        fabButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 24)
        fabButton.addTarget(self, action: #selector(toggleMenu), for: .touchUpInside)
        
        // Add shadow
        fabButton.layer.shadowColor = UIColor.black.cgColor
        fabButton.layer.shadowRadius = 8
        fabButton.layer.shadowOpacity = 0.4
        fabButton.layer.shadowOffset = CGSize(width: 0, height: 4)
        
        view.addSubview(fabButton)
        
        // Menu container
        menuContainer = UIView(frame: CGRect(x: view.bounds.width - 250, y: view.bounds.height - 350, width: 230, height: 180))
        menuContainer.backgroundColor = UIColor.black.withAlphaComponent(0.9)
        menuContainer.layer.cornerRadius = 16
        menuContainer.layer.borderWidth = 1
        menuContainer.layer.borderColor = UIColor.cyan.withAlphaComponent(0.5).cgColor
        menuContainer.alpha = 0
        menuContainer.transform = CGAffineTransform(scaleX: 0.3, y: 0.3)
        
        // Add glow effect
        menuContainer.layer.shadowColor = UIColor.cyan.cgColor
        menuContainer.layer.shadowRadius = 12
        menuContainer.layer.shadowOpacity = 0.4
        menuContainer.layer.shadowOffset = CGSize(width: 0, height: 0)
        
        let menuButtons = [
            ("🔍", "SCAN ENVIRONMENT", #selector(startScanning)),
            ("📏", "MEASURE TOOLS", #selector(startMeasuring)),
            ("🤝", "COLLABORATION", #selector(startCollaboration))
        ]
        
        for (index, (icon, title, action)) in menuButtons.enumerated() {
            let button = createModernMenuButton(icon: icon, title: title, yPosition: 20 + (index * 50))
            button.addTarget(self, action: action, for: .touchUpInside)
            menuContainer.addSubview(button)
        }
        
        view.addSubview(menuContainer)
    }
    
    private func setupMetricsView() {
        metricsView = UIView(frame: CGRect(x: view.bounds.width - 170, y: 150, width: 150, height: 120))
        metricsView.backgroundColor = UIColor.black.withAlphaComponent(0.8)
        metricsView.layer.cornerRadius = 12
        metricsView.layer.borderWidth = 1
        metricsView.layer.borderColor = UIColor.magenta.withAlphaComponent(0.3).cgColor
        metricsView.alpha = 0.9
        
        // Add glow
        metricsView.layer.shadowColor = UIColor.magenta.cgColor
        metricsView.layer.shadowRadius = 8
        metricsView.layer.shadowOpacity = 0.3
        metricsView.layer.shadowOffset = CGSize(width: 0, height: 0)
        
        let metricsTitle = UILabel(frame: CGRect(x: 12, y: 10, width: 126, height: 20))
        metricsTitle.text = "PERFORMANCE"
        metricsTitle.textColor = .magenta
        metricsTitle.font = UIFont(name: "Menlo-Bold", size: 12) ?? UIFont.boldSystemFont(ofSize: 12)
        metricsView.addSubview(metricsTitle)
        
        let cpuLabel = UILabel(frame: CGRect(x: 12, y: 33, width: 126, height: 16))
        cpuLabel.text = "CPU: 23%"
        cpuLabel.textColor = .white
        cpuLabel.font = UIFont(name: "Menlo", size: 11) ?? UIFont.systemFont(ofSize: 11)
        metricsView.addSubview(cpuLabel)
        
        let memLabel = UILabel(frame: CGRect(x: 12, y: 52, width: 126, height: 16))
        memLabel.text = "Memory: 156MB"
        memLabel.textColor = .white
        memLabel.font = UIFont(name: "Menlo", size: 11) ?? UIFont.systemFont(ofSize: 11)
        metricsView.addSubview(memLabel)
        
        let thermalLabel = UILabel(frame: CGRect(x: 12, y: 71, width: 126, height: 16))
        thermalLabel.text = "Thermal: Normal"
        thermalLabel.textColor = .green
        thermalLabel.font = UIFont(name: "Menlo", size: 11) ?? UIFont.systemFont(ofSize: 11)
        metricsView.addSubview(thermalLabel)
        
        let batteryLabel = UILabel(frame: CGRect(x: 12, y: 90, width: 126, height: 16))
        batteryLabel.text = "Battery: 87%"
        batteryLabel.textColor = .green
        batteryLabel.font = UIFont(name: "Menlo", size: 11) ?? UIFont.systemFont(ofSize: 11)
        metricsView.addSubview(batteryLabel)
        
        view.addSubview(metricsView)
    }
    
    private func setupCrosshair() {
        let crosshair = UIView(frame: CGRect(x: (view.bounds.width / 2) - 15, y: (view.bounds.height / 2) - 15, width: 30, height: 30))
        crosshair.backgroundColor = .clear
        
        // Create crosshair lines
        let horizontalLine = UIView(frame: CGRect(x: 5, y: 14, width: 20, height: 2))
        horizontalLine.backgroundColor = UIColor.cyan.withAlphaComponent(0.8)
        horizontalLine.layer.shadowColor = UIColor.cyan.cgColor
        horizontalLine.layer.shadowRadius = 4
        horizontalLine.layer.shadowOpacity = 0.8
        crosshair.addSubview(horizontalLine)
        
        let verticalLine = UIView(frame: CGRect(x: 14, y: 5, width: 2, height: 20))
        verticalLine.backgroundColor = UIColor.cyan.withAlphaComponent(0.8)
        verticalLine.layer.shadowColor = UIColor.cyan.cgColor
        verticalLine.layer.shadowRadius = 4
        verticalLine.layer.shadowOpacity = 0.8
        crosshair.addSubview(verticalLine)
        
        // Center dot
        let centerDot = UIView(frame: CGRect(x: 13, y: 13, width: 4, height: 4))
        centerDot.backgroundColor = UIColor.cyan
        centerDot.layer.cornerRadius = 2
        centerDot.layer.shadowColor = UIColor.cyan.cgColor
        centerDot.layer.shadowRadius = 3
        centerDot.layer.shadowOpacity = 1.0
        crosshair.addSubview(centerDot)
        
        view.addSubview(crosshair)
    }
    
    private func createModernMenuButton(icon: String, title: String, yPosition: Int) -> UIButton {
        let button = UIButton(frame: CGRect(x: 15, y: yPosition, width: 200, height: 45))
        button.backgroundColor = UIColor.cyan.withAlphaComponent(0.1)
        button.layer.cornerRadius = 8
        button.layer.borderWidth = 1
        button.layer.borderColor = UIColor.cyan.withAlphaComponent(0.3).cgColor
        
        let iconLabel = UILabel(frame: CGRect(x: 15, y: 12, width: 25, height: 20))
        iconLabel.text = icon
        iconLabel.font = UIFont.systemFont(ofSize: 16)
        iconLabel.textAlignment = .center
        button.addSubview(iconLabel)
        
        let titleLabel = UILabel(frame: CGRect(x: 50, y: 12, width: 140, height: 20))
        titleLabel.text = title
        titleLabel.textColor = .cyan
        titleLabel.font = UIFont(name: "Menlo-Bold", size: 13) ?? UIFont.boldSystemFont(ofSize: 13)
        button.addSubview(titleLabel)
        
        return button
    }
    
    private func startUIAnimations() {
        // Animate status indicators
        Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { _ in
            self.updateSessionStatus()
        }
        
        // Pulse crosshair
        if let crosshair = view.subviews.last {
            UIView.animate(withDuration: 1.5, delay: 0, options: [.repeat, .autoreverse, .allowUserInteraction], animations: {
                crosshair.alpha = 0.3
            })
        }
        
        // Animate HUD elements
        animateHUDElements()
    }
    
    private func updateSessionStatus() {
        let statuses = ["🟢 TRACKING", "🟡 LIMITED", "🔴 INITIALIZING"]
        let colors: [UIColor] = [.green, .orange, .red]
        let randomIndex = Int.random(in: 0..<statuses.count)
        
        UIView.transition(with: sessionStatusLabel, duration: 0.3, options: .transitionCrossDissolve) {
            self.sessionStatusLabel.text = statuses[randomIndex]
            self.sessionStatusLabel.textColor = colors[randomIndex]
        }
    }
    
    private func animateHUDElements() {
        // Subtle breathing animation for HUD panels
        UIView.animate(withDuration: 3.0, delay: 0, options: [.repeat, .autoreverse, .allowUserInteraction], animations: {
            self.statusHUD.layer.shadowOpacity = 0.1
            self.metricsView.layer.shadowOpacity = 0.1
        })
    }
    
    @objc private func toggleMenu() {
        playHapticFeedback()
        
        isMenuExpanded.toggle()
        
        UIView.animate(withDuration: 0.4, delay: 0, usingSpringWithDamping: 0.7, initialSpringVelocity: 0.5, options: [], animations: {
            if self.isMenuExpanded {
                self.menuContainer.alpha = 1.0
                self.menuContainer.transform = .identity
            } else {
                self.menuContainer.alpha = 0.0
                self.menuContainer.transform = CGAffineTransform(scaleX: 0.3, y: 0.3)
            }
        })
    }
    
    private func playHapticFeedback() {
        guard let hapticEngine = hapticEngine else { return }
        
        var events: [CHHapticEvent] = []
        let intensity = CHHapticEventParameter(parameterID: .hapticIntensity, value: 1.0)
        let sharpness = CHHapticEventParameter(parameterID: .hapticSharpness, value: 1.0)
        let event = CHHapticEvent(eventType: .hapticTransient, parameters: [intensity, sharpness], relativeTime: 0)
        events.append(event)
        
        do {
            let pattern = try CHHapticPattern(events: events, parameters: [])
            let player = try hapticEngine.makePlayer(with: pattern)
            try player.start(atTime: 0)
        } catch {
            print("Haptic playback error: \(error)")
        }
    }
    
    private func setupAR() {
        arView.session.delegate = self
        
        // Configure AR session
        let configuration = ARWorldTrackingConfiguration()
        configuration.planeDetection = [.horizontal, .vertical]
        configuration.environmentTexturing = .automatic
        
        if ARWorldTrackingConfiguration.supportsSceneReconstruction(.mesh) {
            configuration.sceneReconstruction = .mesh
        }
        
        arView.session.run(configuration)
        
        // Add enterprise 3D content
        addEnterpriseARContent()
    }
    
    private func addEnterpriseARContent() {
        // Create enterprise-style 3D models
        let box = ModelEntity(mesh: .generateBox(size: 0.1), materials: [SimpleMaterial(color: .cyan, isMetallic: true)])
        let boxAnchor = AnchorEntity(plane: .horizontal)
        boxAnchor.addChild(box)
        arView.scene.addAnchor(boxAnchor)
        
        // Add holographic text
        let textMesh = MeshResource.generateText("ENTERPRISE AR", extrusionDepth: 0.02, font: .boldSystemFont(ofSize: 0.05))
        let textMaterial = SimpleMaterial(color: .cyan, isMetallic: false)
        let textEntity = ModelEntity(mesh: textMesh, materials: [textMaterial])
        textEntity.position = [0, 0.2, -0.5]
        
        let textAnchor = AnchorEntity(world: [0, 0, -0.5])
        textAnchor.addChild(textEntity)
        arView.scene.addAnchor(textAnchor)
    }
    
    @objc private func startScanning() {
        print("🔍 Enterprise AR Scanning Started")
        showStatusMessage("Environment Scanning Active")
    }
    
    @objc private func startMeasuring() {
        print("📏 Enterprise AR Measuring Started")
        showStatusMessage("Precision Measuring Tools Active")
    }
    
    @objc private func startCollaboration() {
        print("🤝 Enterprise AR Collaboration Started")
        showStatusMessage("Multi-User Collaboration Active")
    }
    
    private func showStatusMessage(_ message: String) {
        let alert = UIAlertController(title: "ARKit Enterprise", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
    
    // MARK: - ARSessionDelegate
    func session(_ session: ARSession, didAdd anchors: [ARAnchor]) {
        print("✅ AR Anchors Added: \(anchors.count)")
    }
    
    func session(_ session: ARSession, didFailWithError error: Error) {
        print("❌ AR Session Error: \(error)")
    }
}
