<script module lang="ts">
	import { clearCheck } from '$lib/game-manager.svelte';
	import GameState from '$lib/game-state.svelte';
	import { onMount } from 'svelte';

	async function updateAndCheck() {
		if (GameState.mythosCode == null) return;
		await clearCheck(GameState.mythosCode);
	}
</script>

<script lang="ts">
	onMount(() => {
		const interval = setInterval(updateAndCheck, 30000);
		return () => clearInterval(interval);
	});

	$effect(() => {
		if (GameState.isSetup && GameState.mythosCode != null) {
			updateAndCheck();
		}
	});
</script>

<button class="btn" onclick={() => updateAndCheck()}>run checks</button>
