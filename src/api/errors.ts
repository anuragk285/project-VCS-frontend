/** The one error shape every failed API call turns into. */
export class ApiError extends Error {
  /** HTTP status. 0 means the server could not be reached at all. */
  status: number
  /** Problems per form field, for 422 errors, e.g. { phone: "Enter a valid 10 digit mobile number" } */
  fieldErrors: Record<string, string>

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }

  get isNetworkError(): boolean {
    return this.status === 0
  }
  get isUnauthorized(): boolean {
    return this.status === 401
  }
  get isNotFound(): boolean {
    return this.status === 404
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

type ValidationItem = { loc?: unknown[]; msg?: string }

function fromValidationList(items: ValidationItem[]): Record<string, string> {
  const fields: Record<string, string> = {}
  for (const item of items) {
    const name = String(item.loc?.[item.loc.length - 1] ?? 'form')
    // FastAPI starts messages with "Value error, ". Customers should not see that.
    fields[name] ??= (item.msg ?? 'Invalid value').replace(/^Value error, /, '')
  }
  return fields
}

const FALLBACK_BY_STATUS: Record<number, string> = {
  401: 'Please sign in to continue.',
  403: 'You do not have permission to do that.',
  404: 'We could not find what you asked for.',
  409: 'This already exists.',
  422: 'Please check the details you entered.',
}

/** Builds an ApiError from a failed response. The backend sends { detail: "text" } or { detail: [ ... ] }. */
export async function errorFromResponse(response: Response): Promise<ApiError> {
  let detail: unknown
  try {
    detail = ((await response.json()) as { detail?: unknown }).detail
  } catch {
    detail = undefined // the body was not JSON
  }

  if (typeof detail === 'string') return new ApiError(response.status, detail)

  if (Array.isArray(detail)) {
    const fieldErrors = fromValidationList(detail as ValidationItem[])
    return new ApiError(response.status, FALLBACK_BY_STATUS[422], fieldErrors)
  }

  const message =
    FALLBACK_BY_STATUS[response.status] ??
    (response.status >= 500 ? 'Something went wrong on our side. Please try again.' : 'Something went wrong.')
  return new ApiError(response.status, message)
}
