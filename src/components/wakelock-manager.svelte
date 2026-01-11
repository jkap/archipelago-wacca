<script lang="ts">
	import { ScreenWakeLock } from 'svelte-screen-wake-lock';
	import type { ChangeEventHandler } from 'svelte/elements';

	let ref: ScreenWakeLock;

	const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		const checked = e.currentTarget.checked;
		if (checked) {
			ref.requestWakeLock();
		} else {
			ref.release();
		}
	};
</script>

<ScreenWakeLock lockOnMountDisabled bind:this={ref} />

<div>
	<label>enable wakelock <input type="checkbox" class="checkbox" onchange={onChange} /></label>
</div>
