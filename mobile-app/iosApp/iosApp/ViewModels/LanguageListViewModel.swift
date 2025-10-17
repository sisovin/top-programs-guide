import SwiftUI
import Combine
import shared

@MainActor
class LanguageListViewModel: ObservableObject {
    @Published var languages: [Language] = []
    @Published var searchQuery: String = ""
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    @Published var isRefreshing: Bool = false
    
    private let repository = LanguageRepository()
    private var cancellables = Set<AnyCancellable>()
    private var searchTask: Task<Void, Never>?
    
    init() {
        loadLanguages()
        setupSearchDebounce()
    }
    
    func loadLanguages() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let flow = repository.getLanguages(forceRefresh: false)
                for try await result in flow {
                    await handleResult(result)
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }
    
    func refresh() {
        isRefreshing = true
        errorMessage = nil
        
        Task {
            do {
                let flow = repository.getLanguages(forceRefresh: true)
                for try await result in flow {
                    await handleResult(result)
                    await MainActor.run {
                        self.isRefreshing = false
                    }
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isRefreshing = false
                }
            }
        }
    }
    
    func retry() {
        loadLanguages()
    }
    
    private func setupSearchDebounce() {
        $searchQuery
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { [weak self] query in
                self?.performSearch(query: query)
            }
            .store(in: &cancellables)
    }
    
    private func performSearch(query: String) {
        searchTask?.cancel()
        
        if query.isEmpty {
            loadLanguages()
            return
        }
        
        searchTask = Task {
            do {
                let flow = repository.searchLanguages(query: query)
                for try await result in flow {
                    if !Task.isCancelled {
                        await handleResult(result)
                    }
                }
            } catch {
                if !Task.isCancelled {
                    await MainActor.run {
                        self.errorMessage = error.localizedDescription
                        self.isLoading = false
                    }
                }
            }
        }
    }
    
    private func handleResult(_ result: Result) async {
        await MainActor.run {
            switch result {
            case is ResultLoading:
                self.isLoading = true
                self.errorMessage = nil
                
            case let success as ResultSuccess:
                if let languageList = success.data as? [Language] {
                    self.languages = languageList
                    self.isLoading = false
                    self.errorMessage = nil
                }
                
            case let error as ResultError:
                self.errorMessage = error.message
                self.isLoading = false
                
            default:
                break
            }
        }
    }
}
