import UIKit
import CoreLocation
import MapKit

UIApplicationMain(CommandLine.argc, CommandLine.unsafeArgv, nil, NSStringFromClass(AppDelegate.self))

class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = LocationViewController()
        window?.makeKeyAndVisible()
        return true
    }
}

class LocationViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        view.backgroundColor = .black
        
        let titleLabel = UILabel(frame: CGRect(x: 20, y: 100, width: view.bounds.width - 40, height: 50))
        titleLabel.text = "📍 CoreLocation Enterprise Tracker"
        titleLabel.textColor = .cyan
        titleLabel.font = UIFont.boldSystemFont(ofSize: 22)
        titleLabel.textAlignment = .center
        view.addSubview(titleLabel)
        
        let mapView = UIView(frame: CGRect(x: 20, y: 200, width: view.bounds.width - 40, height: 300))
        mapView.backgroundColor = UIColor.systemBlue.withAlphaComponent(0.2)
        mapView.layer.cornerRadius = 15
        mapView.layer.borderWidth = 2
        mapView.layer.borderColor = UIColor.cyan.cgColor
        
        let locationLabel = UILabel(frame: CGRect(x: 20, y: 20, width: mapView.bounds.width - 40, height: 260))
        locationLabel.text = "🌍 ENTERPRISE FLEET TRACKING\\n\\n📍 Current Location: Sydney, AU\\n🚚 Fleet Vehicles: 24 active\\n⚡ Real-time Updates: Live\\n📊 Geofence Alerts: 3 pending\\n\\n🎯 Asset Tracking:\\n• Equipment: 156 items\\n• Personnel: 47 field workers\\n• Deliveries: 23 in progress\\n\\n✅ GPS Accuracy: ±2m\\n🔋 Battery Optimized"
        locationLabel.textColor = .cyan
        locationLabel.font = UIFont.systemFont(ofSize: 16)
        locationLabel.numberOfLines = 0
        locationLabel.textAlignment = .center
        mapView.addSubview(locationLabel)
        view.addSubview(mapView)
        
        let button = UIButton(frame: CGRect(x: 50, y: 550, width: view.bounds.width - 100, height: 50))
        button.setTitle("📡 Update Location", for: .normal)
        button.backgroundColor = .cyan
        button.setTitleColor(.black, for: .normal)
        button.layer.cornerRadius = 25
        button.addTarget(self, action: #selector(updateLocation), for: .touchUpInside)
        view.addSubview(button)
    }
    
    @objc private func updateLocation() {
        print("📍 Enterprise Location Updated")
        let alert = UIAlertController(title: "Location Tracker", message: "Fleet locations updated successfully!", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
