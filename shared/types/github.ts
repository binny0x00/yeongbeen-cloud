export interface GitHubRepositoriesResponse {
  fetchedAt: string
  repositories: GitHubRepositorySummary[]
}

export interface GitHubRepositorySummary {
  archived: boolean
  description: string | null
  forks: number
  homepage: string | null
  id: number
  language: string | null
  name: string
  openIssues: number
  pushedAt: string
  stars: number
  topics: string[]
  url: string
}
