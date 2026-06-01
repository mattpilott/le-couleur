import type { Plugin } from 'vite'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SRC = 'https://cdn.jsdelivr.net/npm/mdn-data/css/syntaxes.json'
const OUT = fileURLToPath(new URL('./src/library/colours.build.json', import.meta.url))

export async function generateColours(): Promise<void> {
	try {
		const res = await fetch(SRC)

		if (!res.ok) throw new Error(`HTTP ${res.status}`)

		const data = await res.json()
		const colours = (data['named-color'].syntax as string).split(' | ')
		const json = `${JSON.stringify(colours, null, '\t')}\n`
		const prev = existsSync(OUT) ? readFileSync(OUT, 'utf8') : ''

		if (prev === json) {
			console.log(`[colours] up to date (${colours.length})`)
		} else {
			writeFileSync(OUT, json)
			console.log(`[colours] wrote ${colours.length} colours`)
		}
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err)

		if (existsSync(OUT)) {
			console.warn(`[colours] fetch failed (${message}); using existing snapshot`)
		} else {
			throw new Error(`[colours] fetch failed and no snapshot exists: ${message}`, { cause: err })
		}
	}
}

export function genColours(): Plugin {
	let pending: Promise<void> | undefined

	return {
		name: 'gen-colours',
		buildStart() {
			// Memoise so SvelteKit's server + client passes share a single fetch
			pending ??= generateColours()

			return pending
		}
	}
}

// Allow running standalone (e.g. CI): `bun gen-colours.vite.ts`
if (import.meta.main) await generateColours()
