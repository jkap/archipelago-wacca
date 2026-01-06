<script module lang="ts">
	import { PROGRESSION_ID } from '$lib/consts';
	import { richItems, shouldUnlockGoal, findGoal } from '$lib/game-manager.svelte';
	import { derived } from 'svelte/store';
</script>

<script lang="ts">
	const sortedRichItems = derived(
		[richItems, shouldUnlockGoal],
		([$richItems, $shouldUnlockGoal]) => {
			const seen: number[] = [];
			let sorted = $richItems
				.filter((item) => item.baseItem.id !== PROGRESSION_ID)
				.filter((item) => {
					if (seen.includes(item.baseItem.id)) return false;
					seen.push(item.baseItem.id);
					return true;
				})
				.toSorted((a, b) => {
					// checked values should go at the end
					if (a.checked && !b.checked) return 1;
					if (!a.checked && b.checked) return -1;

					return a.baseItem.id - b.baseItem.id;
				});

			const goalSong = findGoal();
			if ($shouldUnlockGoal && goalSong != null) {
				sorted = [goalSong, ...sorted];
			}

			return sorted;
		}
	);
</script>

<div class="grid grow auto-rows-min grid-cols-[repeat(auto-fit,16rem)] gap-4">
	{#each $sortedRichItems as richItem (richItem.baseItem.id)}
		<div
			class={`image-full card aspect-square w-64 bg-base-100 card-border ${richItem.goal ? 'shadow-lg shadow-accent' : 'shadow-sm'}`}
		>
			<figure>
				<img
					src={`https://webui.wacca.plus/wacca/img/covers/${richItem.songData?.imageName}`}
					alt={richItem.baseItem.name}
					class={{
						grayscale: richItem.checked,
						'brightness-20': richItem.checked
					}}
				/>
			</figure>
			<div class="card-body">
				<h2 class="card-title">{richItem.baseItem.name}</h2>
				<ul>
					<li>{richItem.songData?.artist}</li>
					<li>{richItem.songData?.category}</li>
				</ul>
			</div>
		</div>
	{/each}
</div>
