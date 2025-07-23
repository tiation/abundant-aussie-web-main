import UIKit
import PassKit

UIApplicationMain(CommandLine.argc, CommandLine.unsafeArgv, nil, NSStringFromClass(AppDelegate.self))

class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = PaymentViewController()
        window?.makeKeyAndVisible()
        return true
    }
}

class PaymentViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        view.backgroundColor = .black
        
        let titleLabel = UILabel(frame: CGRect(x: 20, y: 100, width: view.bounds.width - 40, height: 50))
        titleLabel.text = "💳 Apple Pay Enterprise Wallet"
        titleLabel.textColor = .cyan
        titleLabel.font = UIFont.boldSystemFont(ofSize: 24)
        titleLabel.textAlignment = .center
        view.addSubview(titleLabel)
        
        let walletView = UIView(frame: CGRect(x: 20, y: 200, width: view.bounds.width - 40, height: 300))
        walletView.backgroundColor = UIColor.systemYellow.withAlphaComponent(0.2)
        walletView.layer.cornerRadius = 15
        walletView.layer.borderWidth = 2
        walletView.layer.borderColor = UIColor.cyan.cgColor
        
        let paymentLabel = UILabel(frame: CGRect(x: 20, y: 20, width: walletView.bounds.width - 40, height: 260))
        paymentLabel.text = "💼 ENTERPRISE PAYMENT SUITE\\n\\n💳 Corporate Card: Active\\n🔒 Face ID: Enabled\\n💰 Balance: $12,847.50\\n📊 Monthly Limit: $50,000\\n\\n🏢 Expense Categories:\\n• Travel: $3,240\\n• Meals: $856\\n• Equipment: $2,100\\n\\n⚡ Real-time Processing\\n🌍 Multi-currency Support"
        paymentLabel.textColor = .cyan
        paymentLabel.font = UIFont.systemFont(ofSize: 16)
        paymentLabel.numberOfLines = 0
        paymentLabel.textAlignment = .center
        walletView.addSubview(paymentLabel)
        view.addSubview(walletView)
        
        let button = UIButton(frame: CGRect(x: 50, y: 550, width: view.bounds.width - 100, height: 50))
        button.setTitle("💳 Process Payment", for: .normal)
        button.backgroundColor = .cyan
        button.setTitleColor(.black, for: .normal)
        button.layer.cornerRadius = 25
        button.addTarget(self, action: #selector(processPayment), for: .touchUpInside)
        view.addSubview(button)
    }
    
    @objc private func processPayment() {
        print("💳 Enterprise Payment Processed")
        let alert = UIAlertController(title: "Apple Pay Enterprise", message: "Payment processed successfully via Face ID!", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
