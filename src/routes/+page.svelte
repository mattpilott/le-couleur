<script>
	import { sortFn, colord } from '$library/sort'
	import { fly } from 'svelte/transition'

	export let data

	let copied = false

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

<section class="section">
	<h1 class="title"><span>Le Couleur</span> <span>{data.colours.length}</span></h1>
	{#each data.colours.sort(sortFn) as colour}
		{@const hsl = colord(colour).toHslString()}
		{@const dark = colord(colour).isDark()}
		<div class="item" style:background-color={colour}>
			<button class="button" class:dark on:click={() => copy(colour)}>{colour}</button>
			<button class="button" class:dark on:click={() => copy(hsl)}>{hsl}</button>
		</div>
	{/each}
	<small class="small">Made by Matt 👨🏻‍💻</small>
</section>

{#if copied}
	<div class="notice" in:fly={{ y: 50 }} out:fly={{ y: -50 }}>Copied!</div>
{/if}

<style lang="scss">
	.section {
		@extend %wrap;

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
		border-radius: 10px;
		box-shadow: 0 2px 4px hsl(0 0% 0% / 0.2);
		display: flex;
		justify-content: space-between;
		padding: 0.5rem;
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
		text-align: center;
	}
</style>
