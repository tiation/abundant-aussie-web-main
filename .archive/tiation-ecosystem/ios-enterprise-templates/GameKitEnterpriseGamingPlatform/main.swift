import UIKit
import GameKit

UIApplicationMain(CommandLine.argc, CommandLine.unsafeArgv, nil, NSStringFromClass(AppDelegate.self))

class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = GameViewController()
        window?.makeKeyAndVisible()
        return true
    }
}

class GameViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        view.backgroundColor = .black
        
        let titleLabel = UILabel(frame: CGRect(x: 20, y: 100, width: view.bounds.width - 40, height: 50))
        titleLabel.text = "🎮 GameKit Enterprise Gaming"
        titleLabel.textColor = .cyan
        titleLabel.font = UIFont.boldSystemFont(ofSize: 24)
        titleLabel.textAlignment = .center
        view.addSubview(titleLabel)
        
        let gameView = UIView(frame: CGRect(x: 20, y: 200, width: view.bounds.width - 40, height: 300))
        gameView.backgroundColor = UIColor.systemPurple.withAlphaComponent(0.2)
        gameView.layer.cornerRadius = 15
        gameView.layer.borderWidth = 2
        gameView.layer.borderColor = UIColor.cyan.cgColor
        
        let gameLabel = UILabel(frame: CGRect(x: 20, y: 20, width: gameView.bounds.width - 40, height: 260))
        gameLabel.text = "🏢 ENTERPRISE GAMIFICATION\n\n🎯 Training Simulations: Active\n🏆 Team Challenges: 12 ongoing\n📊 Performance Tracking: Live\n🎪 Multiplayer Sessions: 45 users\n⚡ 60fps Metal Rendering\n\n🎖️ Achievement System:\n• Safety Training: 95% complete\n• Skills Assessment: Gold level\n• Team Building: 8 badges earned\n\n🌐 Cross-platform Gaming\n🎮 Game Center Integration"
        gameLabel.textColor = .cyan
        gameLabel.font = UIFont.systemFont(ofSize: 16)
        gameLabel.numberOfLines = 0
        gameLabel.textAlignment = .center
        gameView.addSubview(gameLabel)
        view.addSubview(gameView)
        
        let button = UIButton(frame: CGRect(x: 50, y: 550, width: view.bounds.width - 100, height: 50))
        button.setTitle("🎮 Start Training Game", for: .normal)
        button.backgroundColor = .cyan
        button.setTitleColor(.black, for: .normal)
        button.layer.cornerRadius = 25
        button.addTarget(self, action: #selector(startGame), for: .touchUpInside)
        view.addSubview(button)
    }
    
    @objc private func startGame() {
        print("🎮 Enterprise Training Game Started")
        let alert = UIAlertController(title: "GameKit Enterprise", message: "Training simulation launched successfully!", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
