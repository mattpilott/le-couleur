import { colord, extend } from 'colord'
import namesPlugin from 'colord/plugins/names'
import hwbPlugin from 'colord/plugins/hwb'
import cmykPlugin from 'colord/plugins/cmyk'
import lchPlugin from 'colord/plugins/lch'

extend([namesPlugin, hwbPlugin, cmykPlugin, lchPlugin])

interface Colour {
	hue: number
	saturation: number
	lightness: number
	alpha: number
	authored: string
}

const convert = (color: string): Colour => {
	const { h: hue, s: saturation, l: lightness, a: alpha } = colord(color).toHsl()

	return {
		hue,
		saturation,
		lightness,
		alpha,
		authored: color
	}
}

const sortFn = (a: string, b: string): number => {
	const colorA = convert(a)
	const colorB = convert(b)

	// Move grey-ish values to the back
	if ((colorA.saturation === 0 || colorB.saturation === 0) && colorA.saturation !== colorB.saturation) {
		return colorB.saturation - colorA.saturation
	}

	// Sort by hue (lowest first)
	if (colorA.hue !== colorB.hue) {
		return colorA.hue - colorB.hue
	}

	// Sort by saturation (highest first)
	if (colorA.saturation !== colorB.saturation) {
		return colorA.saturation - colorB.saturation
	}

	// Comparing gray values, light before dark
	if (colorA.saturation === 0 && colorB.saturation === 0) {
		if (colorA.lightness !== colorB.lightness) {
			return colorB.lightness - colorA.lightness
		}
	}

	// Sort by transparency, least transparent first
	if (colorA.alpha === colorB.alpha) {
		return colorA.authored.toLowerCase().localeCompare(colorB.authored.toLowerCase())
	}

	return colorB.alpha - colorA.alpha
}

const sortColors = (colors: string[]): string[] => colors.sort(sortFn)

// Classify a colour into searchable "family" keywords based on its HSL values,
// so a query like "red" also matches reddish colours (crimson, tomato, etc.).
const colourFamilies = (color: string): string[] => {
	const { h, s, l } = colord(color).toHsl()
	const families: string[] = []

	if (s <= 10) {
		families.push('gray', 'grey', 'neutral')

		if (l >= 85) families.push('white')
		else if (l <= 22) families.push('black')

		return families
	}

	if ((h < 15 || h >= 345) && l < 80) families.push('red')
	if (h >= 15 && h < 45) families.push('orange')
	if (h >= 45 && h < 70) families.push('yellow')
	if (h >= 70 && h < 170) families.push('green')
	if (h >= 170 && h < 200) families.push('cyan', 'teal')
	if (h >= 200 && h < 260) families.push('blue')
	if (h >= 260 && h < 290) families.push('purple', 'violet')
	if (h >= 290 && h < 345) families.push('magenta', 'pink')

	// Brown is a dark, muted orange/red
	if (h >= 10 && h < 45 && l < 42 && s < 80) families.push('brown')

	// Pink is a light red/magenta
	if ((h < 20 || h >= 320) && l >= 75) families.push('pink')

	return families
}

// Modern CSS colour notation (space-separated, `/ alpha` only when < 1)
const alphaSuffix = (a: number): string => (a < 1 ? ` / ${a}` : '')

const round = (n: number, places = 3): number => {
	const factor = 10 ** places

	return Math.round(n * factor) / factor
}

const pct = (n: number): string => `${round(n * 100, 2)}%`

const linearise = (channel: number): number => {
	const c = channel / 255

	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

// Convert sRGB to OKLab (https://bottosson.github.io/posts/oklab/)
const toOklab = (color: string) => {
	const { r, g, b, a } = colord(color).toRgb()
	const lr = linearise(r)
	const lg = linearise(g)
	const lb = linearise(b)

	const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
	const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
	const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)

	return {
		l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
		alpha: a
	}
}

// Every CSS-string output format colord can produce (core + extended plugins).
// rgb/hsl/cmyk are built by hand because colord emits legacy commas and
// `device-cmyk(…)`; hwb/lch already use the modern space-separated syntax.
const formats = {
	hex: (color: string) => colord(color).toHex(),
	rgb: (color: string) => {
		const { r, g, b, a } = colord(color).toRgb()

		return `rgb(${r} ${g} ${b}${alphaSuffix(a)})`
	},
	hsl: (color: string) => {
		const { h, s, l, a } = colord(color).toHsl()

		return `hsl(${h} ${s}% ${l}%${alphaSuffix(a)})`
	},
	hwb: (color: string) => colord(color).toHwbString(),
	cmyk: (color: string) => {
		const { c, m, y, k } = colord(color).toCmyk()

		return `cmyk(${c}% ${m}% ${y}% ${k}%)`
	},
	lch: (color: string) => colord(color).toLchString(),
	oklab: (color: string) => {
		const { l, a, b, alpha } = toOklab(color)

		return `oklab(${pct(l)} ${round(a)} ${round(b)}${alphaSuffix(alpha)})`
	},
	oklch: (color: string) => {
		const { l, a, b, alpha } = toOklab(color)
		const c = Math.sqrt(a * a + b * b)
		const h = (Math.atan2(b, a) * 180) / Math.PI

		return `oklch(${pct(l)} ${round(c)} ${round(h < 0 ? h + 360 : h, 2)}${alphaSuffix(alpha)})`
	}
} as const

type Format = keyof typeof formats

const formatList = (Object.keys(formats) as Format[]).map((value) => ({
	value,
	label: value.toUpperCase()
}))

export { convert, sortFn, sortColors, colourFamilies, formats, formatList, colord }
export type { Format }
