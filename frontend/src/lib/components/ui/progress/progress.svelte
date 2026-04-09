<script lang="ts">
	import { Progress as ProgressPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		max = 100,
		value,
		...restProps
	}: ProgressPrimitive.RootProps = $props();
</script>

<ProgressPrimitive.Root
	bind:ref
	data-slot="progress"
	class={cn("relative h-1 w-full overflow-hidden rounded-full bg-secondary", className)}
	{value}
	{max}
	{...restProps}
>
	<div
		data-slot="progress-indicator"
		class="h-full rounded-full bg-success-solid transition-all"
		style="width: {(100 * (value ?? 0)) / (max ?? 1)}%"
	></div>
</ProgressPrimitive.Root>
