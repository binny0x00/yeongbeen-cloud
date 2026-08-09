export default defineEventHandler(event => {
  const path = getRequestURL(event).pathname
  const mappings: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
    [/^\/projects\/(.+)$/, match => `/ko/portfolio/${match[1]}`],
    [/^\/writing\/(.+)$/, match => `/ko/posts/${match[1]}`],
    [/^\/resume\/?$/, () => '/ko/about'],
  ]

  for (const [pattern, destination] of mappings) {
    const match = path.match(pattern)
    if (match) return sendRedirect(event, destination(match), 301)
  }
})
