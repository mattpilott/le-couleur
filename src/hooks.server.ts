import type { Handle, HandleServerError } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'

const environment = env.ENVIRONMENT ?? 'development'

export const handleError: HandleServerError = ({ error }) => {
	const err = error instanceof Error ? error : new Error('Unknown error')

	return {
		message: environment !== 'production' ? err.message : 'Whoa there!',
		code: 'code' in err && typeof err.code === 'string' ? err.code : 'UNKNOWN',
		env: environment
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event)

	response.headers.set('Cache-Control', 'no-cache')
	response.headers.set('Content-Security-Policy', "frame-ancestors 'self'")
	response.headers.set('Permissions-Policy', 'fullscreen=*')
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
	response.headers.set('X-Content-Type-Options', 'nosniff')
	response.headers.set('X-Frame-Options', 'SAMEORIGIN')

	return response
}
