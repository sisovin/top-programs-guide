import SwiftUI
import Combine
import shared

@MainActor
class LanguageDetailViewModel: ObservableObject {
    @Published var language: Language?
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    
    private let repository = LanguageRepository()
    let languageId: String
    
    init(languageId: String) {
        self.languageId = languageId
        loadLanguage()
    }
    
    func loadLanguage() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let flow = repository.getLanguageById(id: languageId)
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
    
    func retry() {
        loadLanguage()
    }
    
    private func handleResult(_ result: Result) async {
        await MainActor.run {
            switch result {
            case is ResultLoading:
                self.isLoading = true
                self.errorMessage = nil
                
            case let success as ResultSuccess:
                if let lang = success.data as? Language {
                    self.language = lang
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
