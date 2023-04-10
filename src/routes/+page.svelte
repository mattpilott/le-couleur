<script>
   import { sortFn, colord } from '$lib/sort'
   import { fly } from 'svelte/transition'

   let url = 'https://cdn.statically.io/gh/mdn/data/38bc01a942de230a513963f643c51eb22827e738/css/syntaxes.json'
   let copied = false

   async function getColours() {
      const {
         'named-color': { syntax: colours }
      } = await fetch(url).then(r => r.json())

      return colours.split(' | ')
   }

   async function copy(text) {
      copied = false
      try {
         await navigator.clipboard.writeText(text)
         copied = true
         setTimeout(() => (copied = false), 1000)
      } catch (err) {
         console.error('Failed to copy: ', err)
      }
   }
</script>

<h1>Named Colours</h1>

{#await getColours() then colours}
   <section>
      {#each colours.sort(sortFn) as colour}
         {@const hsl = colord(colour).toHslString()}
         <div style:background-color={colour}>
            <button on:click={() => copy(colour)}>{colour}</button>
            <button on:click={() => copy(hsl)}>{hsl}</button>
         </div>
      {/each}
   </section>
{/await}

{#if copied}
   <figure in:fly={{ y: 50 }} out:fly={{ y: -50 }}>Copied!</figure>
{/if}

<style>
   :global(body) {
      margin: 0;
      padding: 2rem;
   }

   section {
      display: grid;
      gap: 1rem;
   }

   div {
      border-radius: 10px;
      box-shadow: 0 2px 4px hsl(0 0% 0% / 0.2);
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
   }

   button {
      background: none;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin: 0;
      mix-blend-mode: difference;
      padding: 0.5rem 1rem;
   }

   button:hover {
      background-color: white;
      transition: all 0.25s ease;
      mix-blend-mode: normal;
   }

   figure {
      -webkit-backdrop-filter: blur(40px);
      backdrop-filter: blur(40px);
      background-color: hsl(0 0% 100% / 0.8);
      border-radius: 14px;
      box-shadow: 0 10px 40px hsl(0 0% 0% / 0.2);
      font-size: 2rem;
      inset: 50% auto auto 50%;
      margin: 0;
      padding: 1.5rem 2rem;
      position: fixed;
      transform: translate(-50%, -50%);
   }
</style>
