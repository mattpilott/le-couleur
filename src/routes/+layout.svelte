<script>
   import '../app.scss'
   import Analytics from '$components/Analytics'
   import { dev } from '$app/environment'
</script>

<svelte:head>
   <meta name="version" content={import.meta.env.version} />
</svelte:head>

<slot />

{#if !dev}
   <Analytics id="G-2Q5J7T306V" />
{/if}
