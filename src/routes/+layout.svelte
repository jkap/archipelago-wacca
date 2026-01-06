<script lang="ts">
	import '@fontsource-variable/atkinson-hyperlegible-next/wght.css';
	import '@fontsource-variable/atkinson-hyperlegible-next/wght-italic.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="container mx-auto">
	{@render children()}
</div>
