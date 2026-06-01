import type { PageLoad } from './$types';

export const load = (async () => {
   const url = 'https://cdn.jsdelivr.net/npm/mdn-data/css/syntaxes.json'

   // prettier-ignore
   const { 'named-color': { syntax: colours } } = await fetch(url).then(r => r.json())

   return { colours: colours.split(' | ') }
}) satisfies PageLoad;