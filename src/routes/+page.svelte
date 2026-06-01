<script lang="ts">
	import { sortFn, colord } from '$library/sort'
	import colourList from '$library/colours.build.json'
	import { fly } from 'svelte/transition'

	const colours = [...colourList].sort(sortFn)

	let copied = $state(false)

	async function copy(text: string) {
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

<section class="section contain">
	<h1 class="title"><span>Le Couleur</span> <span>{colours.length}</span></h1>
	{#each colours as colour (colour)}
		{@const hsl = colord(colour).toHslString()}
		{@const dark = colord(colour).isDark()}
		<div class="item" style:--color={colour}>
			<button class="button" class:dark onclick={() => copy(colour)}>{colour}</button>
			<button class="button" class:dark onclick={() => copy(hsl)}>{hsl}</button>
		</div>
	{/each}
	<a class="small" href="https://github.com/mattpilott" target="_blank" rel="noreferrer">Made by Matt 👨🏻‍💻</a>
</section>

{#if copied}
	<div class="notice" in:fly={{ y: 50 }} out:fly={{ y: -50 }}>Copied!</div>
{/if}

<style lang="css">
	.section {
		display: grid;
		gap: 1rem;
		padding-bottom: 2rem;
		padding-top: 2rem;
	}

	.title {
		display: flex;
		justify-content: space-between;
		margin: 0;
	}

	.item {
		background-color: var(--color);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color) 80%, black);
		border-radius: 100px;
		display: flex;
		justify-content: space-between;
		padding: 0.5rem;

		@media (prefers-color-scheme: dark) {
			box-shadow: 0 2px 4px hsl(0 0% 0% / 0.2);
		}
	}

	.button {
		background: none;
		border: none;
		border-radius: 6px;
		color: hsl(0 0% 0% / 0.6);
		cursor: pointer;
		margin: 0;
		padding: 0.5rem 1rem;

		&.dark {
			color: hsl(0 0% 100% / 0.6);
		}

		&:hover {
			background-color: white;
			color: black;
			transition: all 0.25s ease;
		}
	}

	.notice {
		-webkit-backdrop-filter: blur(40px);
		backdrop-filter: blur(40px);
		background-color: hsl(0 0% 100% / 0.8);
		border-radius: 14px;
		border: 0.5px solid hsl(0 0% 0% / 0.2);
		box-shadow: 0 10px 40px hsl(0 0% 0% / 0.2);
		color: hsl(0 0% 0% / 0.8);
		font-size: 2rem;
		inset: 50% auto auto 50%;
		padding: 1.5rem 2rem;
		position: fixed;
		transform: translate(-50%, -50%);

		@media (prefers-color-scheme: dark) {
			background-color: hsl(0 0% 0% / 0.8);
			border: 0.5px solid hsl(0 0% 100% / 0.2);
			color: hsl(0 0% 100% / 0.8);
		}
	}

	.small {
		color: inherit;
		text-align: center;
		text-decoration: none;
	}
</style>
