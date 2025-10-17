import SwiftUI
import shared

struct LanguageListView: View {
    @StateObject private var viewModel = LanguageListViewModel()
    
    var body: some View {
        NavigationStack {
            ZStack {
                if viewModel.isLoading && viewModel.languages.isEmpty {
                    LoadingView()
                } else if let errorMessage = viewModel.errorMessage, viewModel.languages.isEmpty {
                    ErrorView(message: errorMessage, onRetry: viewModel.retry)
                } else if viewModel.languages.isEmpty {
                    EmptyStateView()
                } else {
                    languageList
                }
            }
            .navigationTitle("Programming Languages")
            .navigationBarTitleDisplayMode(.large)
            .searchable(text: $viewModel.searchQuery, prompt: "Search languages...")
            .refreshable {
                viewModel.refresh()
            }
        }
    }
    
    private var languageList: some View {
        List(viewModel.languages, id: \.id) { language in
            NavigationLink(value: language.id) {
                LanguageRowView(language: language)
            }
            .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
        }
        .listStyle(.insetGrouped)
        .navigationDestination(for: String.self) { languageId in
            LanguageDetailView(languageId: languageId)
        }
    }
}

struct LanguageRowView: View {
    let language: Language
    
    var body: some View {
        HStack(spacing: 16) {
            // Logo
            AsyncImage(url: URL(string: language.logoUrl)) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            } placeholder: {
                ProgressView()
            }
            .frame(width: 64, height: 64)
            .background(Color.gray.opacity(0.1))
            .cornerRadius(8)
            
            // Content
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text(language.name)
                        .font(.headline)
                        .fontWeight(.bold)
                    
                    if language.popularityIndex >= 80 {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                            .font(.caption)
                    }
                }
                
                Text(language.description_)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
                
                // Use cases chips
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(Array(language.useCases.prefix(3)), id: \.self) { useCase in
                            Text(useCase)
                                .font(.caption)
                                .padding(.horizontal, 10)
                                .padding(.vertical, 4)
                                .background(Color.blue.opacity(0.1))
                                .foregroundColor(.blue)
                                .cornerRadius(12)
                        }
                    }
                }
                
                // Salary range
                if let salary = language.salaryRange {
                    Text("\(salary.currency)\(salary.min / 1000)k - \(salary.max / 1000)k")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(.green)
                }
            }
        }
        .padding(.vertical, 4)
    }
}

struct LoadingView: View {
    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.5)
            Text("Loading programming languages...")
                .font(.body)
                .foregroundColor(.secondary)
        }
    }
}

struct ErrorView: View {
    let message: String
    let onRetry: () -> Void
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 60))
                .foregroundColor(.red)
            
            Text("Oops! Something went wrong")
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

struct EmptyStateView: View {
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 60))
                .foregroundColor(.secondary)
            
            Text("No languages found")
                .font(.title3)
                .fontWeight(.bold)
            
            Text("Try adjusting your search")
                .font(.body)
                .foregroundColor(.secondary)
        }
    }
}

#Preview {
    LanguageListView()
}
