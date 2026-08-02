import type { GitHubRepositoriesResponse, GitHubRepositorySummary } from '#shared/types/github'

interface GitHubApiRepository {
  archived: boolean
  description: string | null
  forks_count: number
  homepage: string | null
  html_url: string
  id: number
  language: string | null
  name: string
  open_issues_count: number
  pushed_at: string
  stargazers_count: number
  topics: string[]
}

function getUpstreamStatus(error: unknown) {
  if (!error || typeof error !== 'object' || !('response' in error)) {
    return undefined
  }

  const response = error.response

  if (!response || typeof response !== 'object' || !('status' in response)) {
    return undefined
  }

  return typeof response.status === 'number' ? response.status : undefined
}

function toRepositorySummary(repository: GitHubApiRepository): GitHubRepositorySummary {
  return {
    archived: repository.archived,
    description: repository.description,
    forks: repository.forks_count,
    homepage: repository.homepage,
    id: repository.id,
    language: repository.language,
    name: repository.name,
    openIssues: repository.open_issues_count,
    pushedAt: repository.pushed_at,
    stars: repository.stargazers_count,
    topics: repository.topics,
    url: repository.html_url,
  }
}

export default defineCachedEventHandler(
  async (event): Promise<GitHubRepositoriesResponse> => {
    const config = useRuntimeConfig(event)
    const owner = String(config.githubOwner).trim()
    const repositoryNames = String(config.githubRepositories)
      .split(',')
      .map(name => name.trim())
      .filter(Boolean)
    const token = String(config.githubToken).trim()

    if (!owner || repositoryNames.length === 0) {
      return { fetchedAt: new Date().toISOString(), repositories: [] }
    }

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'Yeongbeen-Cloud',
      'X-GitHub-Api-Version': '2022-11-28',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const repositories: GitHubRepositorySummary[] = []

    for (const repositoryName of repositoryNames) {
      try {
        const repository = await $fetch<GitHubApiRepository>(
          `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repositoryName)}`,
          { headers, retry: 0 },
        )

        repositories.push(toRepositorySummary(repository))
      } catch (error) {
        const upstreamStatus = getUpstreamStatus(error)

        if (upstreamStatus === 404) {
          continue
        }

        if (upstreamStatus === 403 || upstreamStatus === 429) {
          throw createError({
            statusCode: 503,
            statusMessage: 'GitHub API 요청 한도에 도달했습니다.',
          })
        }

        throw createError({
          statusCode: 502,
          statusMessage: 'GitHub 저장소 정보를 불러오지 못했습니다.',
        })
      }
    }

    return {
      fetchedAt: new Date().toISOString(),
      repositories,
    }
  },
  {
    getKey: () => 'public-repositories',
    maxAge: 60 * 60,
    name: 'github-repositories',
  },
)
