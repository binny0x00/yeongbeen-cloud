const YOUTUBE_VIDEO_ID = /^[A-Za-z0-9_-]{11}$/

function validateVideoId(candidate?: string | null) {
  if (!candidate || !YOUTUBE_VIDEO_ID.test(candidate)) return null
  return candidate
}

export function getYouTubeVideoId(value: string) {
  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '')

    if (hostname === 'youtu.be') return validateVideoId(url.pathname.split('/')[1])
    if (hostname !== 'youtube.com' && hostname !== 'm.youtube.com') return null

    if (url.pathname === '/watch') return validateVideoId(url.searchParams.get('v'))

    const [resource, videoId] = url.pathname.split('/').filter(Boolean)
    if (resource !== 'embed' && resource !== 'shorts') return null

    return validateVideoId(videoId)
  } catch {
    return null
  }
}

export function getYouTubeEmbedUrl(value: string) {
  const videoId = getYouTubeVideoId(value)
  if (!videoId) return null

  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
}
