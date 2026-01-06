<script lang="ts">
	import { connect, numGoalItems, shouldUnlockGoal } from '$lib/game-manager.svelte';
	import GameState from '$lib/game-state.svelte';
	import AlbumGrid from '../components/album-grid.svelte';
	import CheckManager from '../components/check-manager.svelte';
	import Playlog from '../components/playlog.svelte';
	import ProgressionStatus from '../components/progression-status.svelte';

	let connectionUrl = $state<string>('');
	let slotName = $state<string>('');
	const formattedLastChecked = $derived(GameState.lastChecked.toLocaleTimeString());

	async function connectAndSetup() {
		await connect(connectionUrl, slotName);
	}
</script>

<div class="prose">
	<h2>connection</h2>
	<form onsubmit={() => connectAndSetup()}>
		<input class="input" type="text" bind:value={connectionUrl} required placeholder="url" />
		<input class="input" type="text" bind:value={slotName} required placeholder="slot" />
		<input
			class="input"
			type="text"
			bind:value={GameState.mythosCode}
			required
			placeholder="mythos code"
		/>
		<button class="btn" type="submit">connect</button>
	</form>
	<h2>slot data</h2>
	<ul>
		<li>goal song: {GameState.goalSong}</li>
		<li>minimum grade: {GameState.minimumGrade}</li>
		<li>required goal items: {GameState.requiredGoalItems}</li>
		<li>current goal items: {$numGoalItems}</li>
		<li>last checked: {formattedLastChecked}</li>
		<li>should unlock goal: {$shouldUnlockGoal}</li>
	</ul>
	<hr />
	<CheckManager />
</div>

<ProgressionStatus />

<div class="flex flex-row">
	<AlbumGrid />
	<Playlog />
</div>
