const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

type ApiError = {
  status: number
  message: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    let message = 'Request failed'
    try {
      const body = (await response.json()) as { message?: string }
      if (body?.message) {
        message = body.message
      }
    } catch {
      // ignore JSON parse errors
    }

    const error: ApiError = { status: response.status, message }
    throw error
  }

  return (await response.json()) as T
}

export { request }
export type { ApiError }
