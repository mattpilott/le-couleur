/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
   let url = 'https://cdn.statically.io/gh/mdn/data/38bc01a942de230a513963f643c51eb22827e738/css/syntaxes.json'

   // prettier-ignore
   const { 'named-color': { syntax: colours } } = await fetch(url).then(r => r.json())

   return { colours: colours.split(' | ') }
}
