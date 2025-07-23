import SwiftUI
import Combine
import CoreData
import CloudKit
import CryptoKit
import Charts

// MARK: - Business Employer Enterprise App
@main
struct BusinessEmployerEnterpriseApp: App {
    let persistenceController = PersistenceController.shared
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
                .preferredColorScheme(.dark)
        }
    }
}

// MARK: - Main Content View
struct ContentView: View {
    @StateObject private var authManager = AuthenticationManager()
    @StateObject private var jobManager = JobManager()
    @StateObject private var analyticsManager = AnalyticsManager()
    
    var body: some View {
        Group {
            if authManager.isAuthenticated {
                MainTabView()
                    .environmentObject(jobManager)
                    .environmentObject(analyticsManager)
            } else {
                LoginView()
                    .environmentObject(authManager)
            }
        }
        .accentColor(.cyan)
    }
}

// MARK: - Main Tab Navigation
struct MainTabView: View {
    @EnvironmentObject var jobManager: JobManager
    @EnvironmentObject var analyticsManager: AnalyticsManager
    
    var body: some View {
        TabView {
            DashboardView()
                .tabItem {
                    Label("Dashboard", systemImage: "chart.bar.fill")
                }
            
            JobPostingView()
                .tabItem {
                    Label("Post Jobs", systemImage: "plus.circle.fill")
                }
            
            AnalyticsView()
                .tabItem {
                    Label("Analytics", systemImage: "chart.line.uptrend.xyaxis")
                }
            
            CandidatesView()
                .tabItem {
                    Label("Candidates", systemImage: "person.3.fill")
                }
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear.circle.fill")
                }
        }
        .background(
            LinearGradient(
                gradient: Gradient(colors: [Color.black, Color(red: 0.1, green: 0.1, blue: 0.2)]),
                startPoint: .top,
                endPoint: .bottom
            )
        )
    }
}

// MARK: - Dashboard View
struct DashboardView: View {
    @EnvironmentObject var analyticsManager: AnalyticsManager
    @State private var selectedTimeFrame = TimeFrame.week
    
    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: 20) {
                    // Welcome Section
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Welcome Back")
                                .font(.title2)
                                .foregroundColor(.white)
                            Text("Enterprise Recruiting Hub")
                                .font(.subheadline)
                                .foregroundColor(.cyan)
                        }
                        Spacer()
                        ProfileImageView()
                    }
                    .padding(.horizontal)
                    
                    // Key Metrics Cards
                    LazyVGrid(columns: [
                        GridItem(.flexible()),
                        GridItem(.flexible())
                    ], spacing: 15) {
                        MetricCard(
                            title: "Active Jobs",
                            value: "\(analyticsManager.activeJobs)",
                            icon: "briefcase.fill",
                            color: .cyan
                        )
                        
                        MetricCard(
                            title: "Applications",
                            value: "\(analyticsManager.totalApplications)",
                            icon: "person.crop.circle.badge.plus",
                            color: .pink
                        )
                        
                        MetricCard(
                            title: "Views This Week",
                            value: "\(analyticsManager.weeklyViews)",
                            icon: "eye.fill",
                            color: .purple
                        )
                        
                        MetricCard(
                            title: "Conversion Rate",
                            value: String(format: "%.1f%%", analyticsManager.conversionRate),
                            icon: "chart.bar.xaxis",
                            color: .green
                        )
                    }
                    .padding(.horizontal)
                    
                    // Performance Chart
                    PerformanceChartView()
                        .padding(.horizontal)
                    
                    // Recent Activity
                    RecentActivityView()
                        .padding(.horizontal)
                }
            }
            .background(Color.black.ignoresSafeArea())
            .navigationTitle("Dashboard")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}

// MARK: - Job Posting View
struct JobPostingView: View {
    @EnvironmentObject var jobManager: JobManager
    @State private var jobTitle = ""
    @State private var jobDescription = ""
    @State private var selectedCategory = JobCategory.technology
    @State private var salaryRange = ""
    @State private var location = ""
    @State private var remoteWork = false
    @State private var showingPreview = false
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 25) {
                    // Job Details Form
                    VStack(alignment: .leading, spacing: 20) {
                        Text("Job Details")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        CustomTextField(title: "Job Title", text: $jobTitle, icon: "briefcase")
                        CustomTextField(title: "Location", text: $location, icon: "location")
                        CustomTextField(title: "Salary Range", text: $salaryRange, icon: "dollarsign.circle")
                        
                        VStack(alignment: .leading) {
                            Label("Category", systemImage: "tag")
                                .foregroundColor(.cyan)
                                .font(.headline)
                            
                            Picker("Category", selection: $selectedCategory) {
                                ForEach(JobCategory.allCases, id: \.self) { category in
                                    Text(category.rawValue).tag(category)
                                }
                            }
                            .pickerStyle(SegmentedPickerStyle())
                        }
                        
                        Toggle(isOn: $remoteWork) {
                            Label("Remote Work Available", systemImage: "wifi")
                                .foregroundColor(.cyan)
                        }
                        .toggleStyle(SwitchToggleStyle(tint: .cyan))
                    }
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 15)
                            .fill(Color.gray.opacity(0.1))
                            .overlay(
                                RoundedRectangle(cornerRadius: 15)
                                    .stroke(
                                        LinearGradient(
                                            colors: [.cyan, .pink],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        ),
                                        lineWidth: 1
                                    )
                            )
                    )
                    
                    // Job Description
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Job Description")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        TextEditor(text: $jobDescription)
                            .frame(minHeight: 150)
                            .padding()
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(10)
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                            )
                    }
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 15)
                            .fill(Color.gray.opacity(0.1))
                            .overlay(
                                RoundedRectangle(cornerRadius: 15)
                                    .stroke(
                                        LinearGradient(
                                            colors: [.cyan, .pink],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        ),
                                        lineWidth: 1
                                    )
                            )
                    )
                    
                    // Action Buttons
                    HStack(spacing: 15) {
                        Button("Preview") {
                            showingPreview = true
                        }
                        .buttonStyle(SecondaryButtonStyle())
                        
                        Button("Post Job") {
                            postJob()
                        }
                        .buttonStyle(PrimaryButtonStyle())
                        .disabled(!isFormValid)
                    }
                }
                .padding()
            }
            .background(Color.black.ignoresSafeArea())
            .navigationTitle("Post New Job")
            .sheet(isPresented: $showingPreview) {
                JobPreviewView(
                    title: jobTitle,
                    description: jobDescription,
                    category: selectedCategory,
                    salary: salaryRange,
                    location: location,
                    isRemote: remoteWork
                )
            }
        }
    }
    
    private var isFormValid: Bool {
        !jobTitle.isEmpty && !jobDescription.isEmpty && !location.isEmpty && !salaryRange.isEmpty
    }
    
    private func postJob() {
        let newJob = JobPosting(
            title: jobTitle,
            description: jobDescription,
            category: selectedCategory,
            salary: salaryRange,
            location: location,
            isRemote: remoteWork
        )
        
        jobManager.postJob(newJob)
        
        // Reset form
        jobTitle = ""
        jobDescription = ""
        salaryRange = ""
        location = ""
        remoteWork = false
    }
}

// MARK: - Analytics View
struct AnalyticsView: View {
    @EnvironmentObject var analyticsManager: AnalyticsManager
    @State private var selectedMetric = AnalyticsMetric.views
    @State private var selectedTimeFrame = TimeFrame.month
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 25) {
                    // Metric Selector
                    VStack {
                        Picker("Metric", selection: $selectedMetric) {
                            ForEach(AnalyticsMetric.allCases, id: \.self) { metric in
                                Text(metric.displayName).tag(metric)
                            }
                        }
                        .pickerStyle(SegmentedPickerStyle())
                        
                        Picker("Time Frame", selection: $selectedTimeFrame) {
                            ForEach(TimeFrame.allCases, id: \.self) { timeFrame in
                                Text(timeFrame.displayName).tag(timeFrame)
                            }
                        }
                        .pickerStyle(MenuPickerStyle())
                    }
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 15)
                            .fill(Color.gray.opacity(0.1))
                    )
                    
                    // Main Analytics Chart
                    AnalyticsChartView(
                        metric: selectedMetric,
                        timeFrame: selectedTimeFrame,
                        data: analyticsManager.getDataForMetric(selectedMetric, timeFrame: selectedTimeFrame)
                    )
                    
                    // Insights Section
                    InsightsView()
                    
                    // Performance Breakdown
                    PerformanceBreakdownView()
                }
                .padding()
            }
            .background(Color.black.ignoresSafeArea())
            .navigationTitle("Analytics")
        }
    }
}

// MARK: - Custom Components

struct MetricCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(color)
                    .font(.title2)
                Spacer()
            }
            
            Text(value)
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(.white)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.gray)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 15)
                .fill(Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 15)
                        .stroke(color.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

struct CustomTextField: View {
    let title: String
    @Binding var text: String
    let icon: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label(title, systemImage: icon)
                .foregroundColor(.cyan)
                .font(.headline)
            
            TextField(title, text: $text)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .background(Color.gray.opacity(0.1))
                .cornerRadius(8)
        }
    }
}

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundColor(.white)
            .padding(.horizontal, 30)
            .padding(.vertical, 12)
            .background(
                LinearGradient(
                    gradient: Gradient(colors: [.cyan, .pink]),
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .cornerRadius(25)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundColor(.cyan)
            .padding(.horizontal, 30)
            .padding(.vertical, 12)
            .background(Color.gray.opacity(0.1))
            .overlay(
                RoundedRectangle(cornerRadius: 25)
                    .stroke(Color.cyan, lineWidth: 1)
            )
            .cornerRadius(25)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

// MARK: - Data Models

struct JobPosting: Identifiable, Codable {
    let id = UUID()
    let title: String
    let description: String
    let category: JobCategory
    let salary: String
    let location: String
    let isRemote: Bool
    let datePosted = Date()
}

enum JobCategory: String, CaseIterable, Codable {
    case technology = "Technology"
    case finance = "Finance"
    case healthcare = "Healthcare"
    case education = "Education"
    case marketing = "Marketing"
    case sales = "Sales"
    case construction = "Construction"
    case manufacturing = "Manufacturing"
}

enum AnalyticsMetric: String, CaseIterable {
    case views = "views"
    case applications = "applications"
    case clicks = "clicks"
    case conversions = "conversions"
    
    var displayName: String {
        switch self {
        case .views: return "Views"
        case .applications: return "Applications"
        case .clicks: return "Clicks"
        case .conversions: return "Conversions"
        }
    }
}

enum TimeFrame: String, CaseIterable {
    case week = "week"
    case month = "month"
    case quarter = "quarter"
    case year = "year"
    
    var displayName: String {
        switch self {
        case .week: return "This Week"
        case .month: return "This Month"
        case .quarter: return "This Quarter"
        case .year: return "This Year"
        }
    }
}

// MARK: - Managers

@MainActor
class AuthenticationManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    
    func signIn(email: String, password: String) async -> Bool {
        // Implement authentication logic with Supabase
        // For demo purposes, always return true
        isAuthenticated = true
        return true
    }
    
    func signOut() {
        isAuthenticated = false
        currentUser = nil
    }
}

@MainActor
class JobManager: ObservableObject {
    @Published var activeJobs: [JobPosting] = []
    @Published var archivedJobs: [JobPosting] = []
    
    func postJob(_ job: JobPosting) {
        activeJobs.append(job)
        // Implement job posting to backend
    }
    
    func archiveJob(_ job: JobPosting) {
        if let index = activeJobs.firstIndex(where: { $0.id == job.id }) {
            let archivedJob = activeJobs.remove(at: index)
            archivedJobs.append(archivedJob)
        }
    }
}

@MainActor
class AnalyticsManager: ObservableObject {
    @Published var activeJobs = 12
    @Published var totalApplications = 145
    @Published var weeklyViews = 1284
    @Published var conversionRate: Double = 11.3
    
    func getDataForMetric(_ metric: AnalyticsMetric, timeFrame: TimeFrame) -> [AnalyticsDataPoint] {
        // Return sample data for demo
        return generateSampleData(for: metric, timeFrame: timeFrame)
    }
    
    private func generateSampleData(for metric: AnalyticsMetric, timeFrame: TimeFrame) -> [AnalyticsDataPoint] {
        let count = timeFrame == .week ? 7 : 30
        return (0..<count).map { index in
            AnalyticsDataPoint(
                date: Calendar.current.date(byAdding: .day, value: -index, to: Date()) ?? Date(),
                value: Double.random(in: 50...200)
            )
        }.reversed()
    }
}

struct AnalyticsDataPoint {
    let date: Date
    let value: Double
}

struct User {
    let id: UUID
    let email: String
    let companyName: String
    let role: String
}

// MARK: - Additional Views (Simplified for brevity)

struct LoginView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var email = ""
    @State private var password = ""
    
    var body: some View {
        VStack(spacing: 30) {
            Text("Enterprise Login")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.white)
            
            VStack(spacing: 20) {
                TextField("Email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                SecureField("Password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                Button("Sign In") {
                    Task {
                        await authManager.signIn(email: email, password: password)
                    }
                }
                .buttonStyle(PrimaryButtonStyle())
            }
        }
        .padding()
        .background(Color.black.ignoresSafeArea())
    }
}

struct ProfileImageView: View {
    var body: some View {
        Image(systemName: "person.crop.circle.fill")
            .font(.largeTitle)
            .foregroundColor(.cyan)
    }
}

struct PerformanceChartView: View {
    var body: some View {
        VStack(alignment: .leading) {
            Text("Performance Overview")
                .font(.headline)
                .foregroundColor(.white)
            
            // Placeholder for chart
            RoundedRectangle(cornerRadius: 15)
                .fill(Color.gray.opacity(0.1))
                .frame(height: 200)
                .overlay(
                    Text("Performance Chart")
                        .foregroundColor(.gray)
                )
        }
    }
}

struct RecentActivityView: View {
    var body: some View {
        VStack(alignment: .leading) {
            Text("Recent Activity")
                .font(.headline)
                .foregroundColor(.white)
            
            ForEach(0..<3) { _ in
                HStack {
                    Image(systemName: "circle.fill")
                        .foregroundColor(.cyan)
                        .font(.caption)
                    
                    Text("New application received")
                        .foregroundColor(.white)
                    
                    Spacer()
                    
                    Text("2h ago")
                        .foregroundColor(.gray)
                        .font(.caption)
                }
                .padding(.vertical, 5)
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 15)
                .fill(Color.gray.opacity(0.1))
        )
    }
}

struct JobPreviewView: View {
    let title: String
    let description: String
    let category: JobCategory
    let salary: String
    let location: String
    let isRemote: Bool
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text(title)
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text(description)
                        .foregroundColor(.white)
                    
                    VStack(alignment: .leading, spacing: 10) {
                        Label(category.rawValue, systemImage: "tag")
                        Label(salary, systemImage: "dollarsign.circle")
                        Label(location, systemImage: "location")
                        if isRemote {
                            Label("Remote Work Available", systemImage: "wifi")
                        }
                    }
                    .foregroundColor(.cyan)
                }
                .padding()
            }
            .background(Color.black.ignoresSafeArea())
            .navigationTitle("Preview")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

struct CandidatesView: View {
    var body: some View {
        Text("Candidates View")
            .foregroundColor(.white)
    }
}

struct SettingsView: View {
    var body: some View {
        Text("Settings View")
            .foregroundColor(.white)
    }
}

struct AnalyticsChartView: View {
    let metric: AnalyticsMetric
    let timeFrame: TimeFrame
    let data: [AnalyticsDataPoint]
    
    var body: some View {
        VStack(alignment: .leading) {
            Text("\(metric.displayName) - \(timeFrame.displayName)")
                .font(.headline)
                .foregroundColor(.white)
            
            RoundedRectangle(cornerRadius: 15)
                .fill(Color.gray.opacity(0.1))
                .frame(height: 250)
                .overlay(
                    Text("Analytics Chart")
                        .foregroundColor(.gray)
                )
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 15)
                .fill(Color.gray.opacity(0.1))
        )
    }
}

struct InsightsView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 15) {
            Text("AI Insights")
                .font(.headline)
                .foregroundColor(.white)
            
            VStack(alignment: .leading, spacing: 10) {
                InsightCard(
                    icon: "lightbulb.fill",
                    title: "Optimization Opportunity",
                    description: "Consider posting jobs on Tuesday for 23% higher engagement",
                    color: .yellow
                )
                
                InsightCard(
                    icon: "chart.line.uptrend.xyaxis",
                    title: "Trending Up",
                    description: "Your job postings are performing 15% better than last month",
                    color: .green
                )
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 15)
                .fill(Color.gray.opacity(0.1))
        )
    }
}

struct InsightCard: View {
    let icon: String
    let title: String
    let description: String
    let color: Color
    
    var body: some View {
        HStack(spacing: 15) {
            Image(systemName: icon)
                .foregroundColor(color)
                .font(.title2)
            
            VStack(alignment: .leading, spacing: 5) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                
                Text(description)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
            Spacer()
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(color.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

struct PerformanceBreakdownView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 15) {
            Text("Performance Breakdown")
                .font(.headline)
                .foregroundColor(.white)
            
            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 15) {
                PerformanceMetric(title: "Click-through Rate", value: "3.2%", trend: .up)
                PerformanceMetric(title: "Application Rate", value: "11.3%", trend: .up)
                PerformanceMetric(title: "Time to Fill", value: "18 days", trend: .down)
                PerformanceMetric(title: "Cost per Hire", value: "$2,450", trend: .down)
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 15)
                .fill(Color.gray.opacity(0.1))
        )
    }
}

struct PerformanceMetric: View {
    let title: String
    let value: String
    let trend: Trend
    
    enum Trend {
        case up, down, flat
        
        var color: Color {
            switch self {
            case .up: return .green
            case .down: return .red
            case .flat: return .yellow
            }
        }
        
        var icon: String {
            switch self {
            case .up: return "arrow.up"
            case .down: return "arrow.down"
            case .flat: return "minus"
            }
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(title)
                    .font(.caption)
                    .foregroundColor(.gray)
                Spacer()
                Image(systemName: trend.icon)
                    .foregroundColor(trend.color)
                    .font(.caption)
            }
            
            Text(value)
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(.white)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(Color.gray.opacity(0.1))
        )
    }
}

// MARK: - Core Data Stack
struct PersistenceController {
    static let shared = PersistenceController()
    
    let container: NSPersistentContainer
    
    init(inMemory: Bool = false) {
        container = NSPersistentContainer(name: "DataModel")
        if inMemory {
            container.persistentStoreDescriptions.first?.url = URL(fileURLWithPath: "/dev/null")
        }
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        })
    }
}
