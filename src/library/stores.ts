import { writable } from 'svelte/store'
import { storable } from 'kitto/svelte'
import type { Format } from './sort'

export const ui = writable()
export const prefs = storable({ cookie: false }, 'prefs')
export const format = storable<Format>('hsl', 'format')
