<script lang="ts" module>
	import GameState from '$lib/game-state.svelte';
	import { numGoalItems } from '$lib/game-manager.svelte';
</script>

{#if GameState.isSetup}
	<div class="flex flex-col">
		<h2 class="text-2xl font-bold">Goal Items</h2>
		<ul class="steps">
			{#each { length: GameState.requiredGoalItems }, index}
				<li class={`step ${index < $numGoalItems ? 'step-success' : ''}`}></li>
			{/each}
		</ul>
	</div>
{/if}
