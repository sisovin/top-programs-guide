import SwiftUI
import shared

struct LanguageDetailView: View {
    let languageId: String
    @StateObject private var viewModel: LanguageDetailViewModel
    @Environment(\.dismiss) private var dismiss
    
    init(languageId: String) {
        self.languageId = languageId
        _viewModel = StateObject(wrappedValue: LanguageDetailViewModel(languageId: languageId))
    }
    
    var body: some View {
        ZStack {
            if viewModel.isLoading {
                LoadingDetailView()
            } else if let errorMessage = viewModel.errorMessage {
                ErrorDetailView(message: errorMessage, onRetry: viewModel.retry)
            } else if let language = viewModel.language {
                LanguageContent(language: language)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct LanguageContent: View {
    let language: Language
    @State private var selectedTab = 0
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Hero Section
                HeroSection(language: language)
                
                // Quick Stats
                QuickStatsSection(language: language)
                
                // Tab Picker
                Picker("Information", selection: $selectedTab) {
                    Text("Use Cases").tag(0)
                    Text("Advantages").tag(1)
                    Text("Salary").tag(2)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)
                
                // Tab Content
                Group {
                    switch selectedTab {
                    case 0:
                        UseCasesSection(useCases: language.useCases)
                    case 1:
                        AdvantagesSection(advantages: language.advantages)
                    case 2:
                        SalarySection(language: language)
                    default:
                        EmptyView()
                    }
                }
                .transition(.opacity)
                .animation(.easeInOut, value: selectedTab)
            }
            .padding(.bottom, 20)
        }
    }
}

struct HeroSection: View {
    let language: Language
    
    var body: some View {
        VStack(spacing: 16) {
            // Logo
            AsyncImage(url: URL(string: language.logoUrl)) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            } placeholder: {
                ProgressView()
            }
            .frame(width: 120, height: 120)
            .background(Color.gray.opacity(0.1))
            .cornerRadius(16)
            
            // Name
            Text(language.name)
                .font(.largeTitle)
                .fontWeight(.bold)
            
            // Description
            Text(language.description_)
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background(Color.blue.opacity(0.1))
    }
}

struct QuickStatsSection: View {
    let language: Language
    
    var body: some View {
        HStack(spacing: 0) {
            StatItem(
                icon: "star.fill",
                label: "Popularity",
                value: "\(language.popularityIndex)/100"
            )
            
            Divider()
                .frame(height: 60)
            
            StatItem(
                icon: "calendar",
                label: "Released",
                value: String(language.releaseYear)
            )
            
            Divider()
                .frame(height: 60)
            
            StatItem(
                icon: "chart.line.uptrend.xyaxis",
                label: "Trending",
                value: language.popularityIndex >= 80 ? "High" : "Medium"
            )
        }
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(12)
        .padding(.horizontal)
    }
}

struct StatItem: View {
    let icon: String
    let label: String
    let value: String
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.blue)
            
            Text(value)
                .font(.headline)
                .fontWeight(.bold)
            
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }
}

struct UseCasesSection: View {
    let useCases: [String]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Common Use Cases")
                .font(.title3)
                .fontWeight(.bold)
                .padding(.horizontal)
            
            VStack(alignment: .leading, spacing: 12) {
                ForEach(useCases, id: \.self) { useCase in
                    HStack(spacing: 12) {
                        Image(systemName: "chevron.right.circle.fill")
                            .foregroundColor(.blue)
                        
                        Text(useCase)
                            .font(.body)
                    }
                }
            }
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.white)
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.05), radius: 5)
            .padding(.horizontal)
        }
    }
}

struct AdvantagesSection: View {
    let advantages: [String]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Key Advantages")
                .font(.title3)
                .fontWeight(.bold)
                .padding(.horizontal)
            
            VStack(alignment: .leading, spacing: 12) {
                ForEach(advantages, id: \.self) { advantage in
                    HStack(spacing: 12) {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                        
                        Text(advantage)
                            .font(.body)
                    }
                }
            }
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.white)
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.05), radius: 5)
            .padding(.horizontal)
        }
    }
}

struct SalarySection: View {
    let language: Language
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Salary Information")
                .font(.title3)
                .fontWeight(.bold)
                .padding(.horizontal)
            
            if let salary = language.salaryRange {
                VStack(spacing: 12) {
                    HStack {
                        Text("Minimum")
                            .foregroundColor(.secondary)
                        Spacer()
                        Text("\(salary.currency)\(formatSalary(salary.min))")
                            .fontWeight(.bold)
                    }
                    
                    Divider()
                    
                    HStack {
                        Text("Maximum")
                            .foregroundColor(.secondary)
                        Spacer()
                        Text("\(salary.currency)\(formatSalary(salary.max))")
                            .fontWeight(.bold)
                            .foregroundColor(.green)
                    }
                    
                    Divider()
                    
                    HStack {
                        Text("Experience Level")
                            .foregroundColor(.secondary)
                        Spacer()
                        Text(salary.experienceLevel)
                            .fontWeight(.semibold)
                    }
                }
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color.white)
                .cornerRadius(12)
                .shadow(color: .black.opacity(0.05), radius: 5)
                .padding(.horizontal)
            } else {
                Text("Salary information not available")
                    .foregroundColor(.secondary)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.white)
                    .cornerRadius(12)
                    .shadow(color: .black.opacity(0.05), radius: 5)
                    .padding(.horizontal)
            }
        }
    }
    
    private func formatSalary(_ amount: Int32) -> String {
        if amount >= 1000 {
            return "\(amount / 1000)k"
        }
        return String(amount)
    }
}

struct LoadingDetailView: View {
    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.5)
            Text("Loading language details...")
                .font(.body)
                .foregroundColor(.secondary)
        }
    }
}

struct ErrorDetailView: View {
    let message: String
    let onRetry: () -> Void
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 60))
                .foregroundColor(.red)
            
            Text("Error Loading Language")
                .font(.title2)
                .fontWeight(.bold)
            
            Text(message)
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            
            Button(action: onRetry) {
                Text("Try Again")
                    .fontWeight(.semibold)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
        }
        .padding()
    }
}

#Preview {
    NavigationStack {
        LanguageDetailView(languageId: "1")
    }
}
