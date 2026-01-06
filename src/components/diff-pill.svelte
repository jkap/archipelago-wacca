<script lang="ts">
	import { DIFF_NAMES } from '$lib/consts';
	import type { WaccaDifficulty } from '$lib/mithical';

	let { diff }: { diff: WaccaDifficulty } = $props();

	let className = $derived.by(() => {
		switch (diff) {
			case 4:
				return '[--badge-color:var(--color-diff-inferno)]';
			case 3:
				return '[--badge-color:var(--color-diff-expert)]';
			case 2:
				return '[--badge-color:var(--color-diff-hard)]';
			default:
				return '[--badge-color:var(--color-diff-normal)]';
		}
	});
</script>

<div class={`badge ${className}`}>{DIFF_NAMES[diff]}</div>
