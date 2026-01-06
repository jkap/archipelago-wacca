<script lang="ts" module>
	import { collectedPlaylog } from '$lib/mithical';
	import DiffPill from './diff-pill.svelte';
</script>

<div class="flex flex-col gap-4">
	{#if $collectedPlaylog.length}
		{#each $collectedPlaylog as playlog (playlog.result.playlog_api_id)}
			<div class="card card-side bg-base-100 shadow-sm">
				<figure>
					<img
						src={`https://webui.wacca.plus/wacca/img/covers/${playlog.song.imageName}`}
						alt={playlog.song.title}
						class="max-w-32"
					/>
				</figure>
				<div class="card-body">
					<h2 class="card-title">
						{playlog.song.title}
					</h2>
					<DiffPill diff={playlog.result.info.music_difficulty} />
				</div>
			</div>
		{/each}
	{/if}
</div>
