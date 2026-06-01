<script lang="ts">
	import { sortFn, colourFamilies, formats, formatList, colord } from '$library/sort'
	import { format } from '$library/stores'
	import colourList from '$library/colours.build.json'
	import { fly } from 'svelte/transition'

	const colours = [...colourList].sort(sortFn).map((colour) => ({
		colour,
		families: colourFamilies(colour)
	}))

	let search = $state('')

	const filtered = $derived.by(() => {
		const query = search.trim().toLowerCase()

		if (!query) return colours

		return colours.filter(
			({ colour, families }) => colour.includes(query) || families.some((family) => family.includes(query))
		)
	})

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

<div class="page contain">
	<header class="header">
		<div>
			<h1 class="title">Le Couleur</h1>
			<div class="count">{filtered.length} Colours</div>
		</div>
		<input
			class="search"
			type="search"
			placeholder="Search by name or group..."
			aria-label="Search colours"
			autocomplete="off"
			bind:value={search}
		/>
		<select class="select" aria-label="Colour format" bind:value={$format}>
			{#each formatList as { value, label } (value)}
				<option {value}>{label}</option>
			{/each}
		</select>
	</header>
	<main class="main" data-empty="No colours match “{search}”.">
		{#each filtered as { colour } (colour)}
			{@const value = formats[$format](colour)}
			{@const dark = colord(colour).isDark()}
			<div class="item" style:--color={colour}>
				<button class="button" class:dark onclick={() => copy(colour)}>{colour}</button>
				<button class="button" class:dark onclick={() => copy(value)}>{value}</button>
			</div>
		{/each}
	</main>
	<footer class="footer">
		<a class="small" href="https://github.com/mattpilott" target="_blank" rel="noreferrer">Made by Matty 🤓</a>
	</footer>
</div>

{#if copied}
	<div class="notice" in:fly={{ y: 50 }} out:fly={{ y: -50 }}>Copied!</div>
{/if}

<style lang="css">
	.page {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
	}

	.header {
		align-items: center;
		background-image: linear-gradient(to bottom, var(--c-black) 50%, transparent);
		display: grid;
		gap: 0.75rem;
		grid-template-columns: 1fr auto auto;
		padding-block: 1rem;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.title {
		font: 500 var(--f-h4);
		margin: 0;
	}

	.count {
		font: 500 var(--f-excerpt);
		margin-block-start: -0.25rem;
		opacity: 0.6;
	}

	.controls {
		display: flex;
		gap: 0.75rem;
	}

	.search,
	.select {
		appearance: none;
		background-color: hsl(0 0% 0% / 0.04);
		backdrop-filter: blur(10px);
		border: 1px solid hsl(0 0% 0% / 0.15);
		border-radius: 100px;
		color: inherit;
		cursor: pointer;
		font: 500 var(--f-caption);
		height: 3rem;
		margin: 0;
		padding: 0 1rem;

		&:focus-visible {
			border-color: hsl(0 0% 0% / 0.5);
			outline: none;
		}

		@media (prefers-color-scheme: dark) {
			background-color: hsl(0 0% 100% / 0.06);
			border-color: hsl(0 0% 100% / 0.18);

			&:focus-visible {
				border-color: hsl(0 0% 100% / 0.5);
			}
		}
	}

	.search {
		cursor: text;
		font: 500 var(--f-excerpt);
		width: 26ch;
		padding-inline: 1.5rem 1rem;

		&::placeholder {
			color: hsl(0 0% 0% / 0.4);
		}

		@media (prefers-color-scheme: dark) {
			&::placeholder {
				color: hsl(0 0% 100% / 0.4);
			}
		}
	}

	.main {
		display: grid;
		gap: 1rem;

		&:empty::before {
			content: attr(data-empty);
			color: inherit;
			display: flex;
			align-items: center;
			justify-content: center;
			opacity: 0.6;
			text-align: center;
		}
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

	.footer {
		display: flex;
		justify-content: center;
		padding-block: 2rem;
	}

	.small {
		color: inherit;
		text-align: center;
		text-decoration: none;
	}
</style>
