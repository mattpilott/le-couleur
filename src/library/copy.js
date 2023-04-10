export async function copy(text) {
   copied = false
   try {
      await navigator.clipboard.writeText(text)
      copied = true
      setTimeout(() => (copied = false), 1000)
   } catch (err) {
      console.error('Failed to copy: ', err)
   }
}
