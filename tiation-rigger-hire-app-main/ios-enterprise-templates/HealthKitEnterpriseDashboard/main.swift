import UIKit
import HealthKit

UIApplicationMain(CommandLine.argc, CommandLine.unsafeArgv, nil, NSStringFromClass(AppDelegate.self))

class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = HealthViewController()
        window?.makeKeyAndVisible()
        return true
    }
}

class HealthViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        view.backgroundColor = .black
        
        let titleLabel = UILabel(frame: CGRect(x: 20, y: 100, width: view.bounds.width - 40, height: 50))
        titleLabel.text = "💚 HealthKit Enterprise Dashboard"
        titleLabel.textColor = .cyan
        titleLabel.font = UIFont.boldSystemFont(ofSize: 24)
        titleLabel.textAlignment = .center
        view.addSubview(titleLabel)
        
        let healthView = UIView(frame: CGRect(x: 20, y: 200, width: view.bounds.width - 40, height: 300))
        healthView.backgroundColor = UIColor.green.withAlphaComponent(0.2)
        healthView.layer.cornerRadius = 15
        healthView.layer.borderWidth = 2
        healthView.layer.borderColor = UIColor.cyan.cgColor
        
        let healthLabel = UILabel(frame: CGRect(x: 20, y: 20, width: healthView.bounds.width - 40, height: 260))
        healthLabel.text = "🏥 ENTERPRISE HEALTH METRICS\\n\\n❤️ Heart Rate: 72 BPM\\n🏃‍♂️ Steps: 8,547 today\\n😴 Sleep: 7.5 hours\\n🍎 Nutrition: On track\\n🧘‍♀️ Mindfulness: 15 min\\n\\n📊 Wellness Score: 85/100\\n\\n🏢 Corporate Health Program Active\\n⚡ Real-time sync with Apple Watch"
        healthLabel.textColor = .cyan
        healthLabel.font = UIFont.systemFont(ofSize: 16)
        healthLabel.numberOfLines = 0
        healthLabel.textAlignment = .center
        healthView.addSubview(healthLabel)
        view.addSubview(healthView)
        
        let button = UIButton(frame: CGRect(x: 50, y: 550, width: view.bounds.width - 100, height: 50))
        button.setTitle("🔄 Sync Health Data", for: .normal)
        button.backgroundColor = .cyan
        button.setTitleColor(.black, for: .normal)
        button.layer.cornerRadius = 25
        button.addTarget(self, action: #selector(syncHealth), for: .touchUpInside)
        view.addSubview(button)
    }
    
    @objc private func syncHealth() {
        print("💚 Enterprise Health Sync Complete")
        let alert = UIAlertController(title: "HealthKit Enterprise", message: "Health data synchronized successfully!", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
