<script>
   import { page } from '$app/stores'

   export let id = ''

   $: {
      typeof gtag !== 'undefined' && gtag('config', id, { page_path: $page.url.path })
   }
</script>

<svelte:head>
   <link rel="preconnect" href="https://www.google-analytics.com" crossorigin />
   <script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
   <script>
      window.dataLayer = window.dataLayer || []
      function gtag() {
         dataLayer.push(arguments)
      }
      gtag('js', new Date())
   </script>
</svelte:head>
