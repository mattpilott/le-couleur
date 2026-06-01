import type { PageLoad } from './$types'

export const load = (async ({ fetch }) => {
	const url = 'https://cdn.jsdelivr.net/npm/mdn-data/css/syntaxes.json'

	const { 'named-color': namedColor } = await fetch(url).then((r) => r.json())

	return { colours: (namedColor.syntax as string).split(' | ') }
}) satisfies PageLoad
