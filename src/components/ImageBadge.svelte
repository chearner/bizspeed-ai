<script lang="ts">
	import { Badge } from 'flowbite-svelte';

	let { status } = $props<{
		status: string;
	}>();

	function getBadgeColor(
		status: string
	): 'blue' | 'red' | 'green' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'dark' {
		switch (status.toLowerCase()) {
			case 'damage':
				return 'yellow';
			case 'tanklocation':
				return 'green';
			case 'unsafecondition':
				return 'red';
			case 'bol':
				return 'blue';
			case 'driverlog':
				return 'green';
			case 'error':
				return 'red';
			case 'meter':
				return 'indigo';
			case 'receipt':
				return 'purple';
			default:
				return 'dark';
		}
	}
</script>

{#if status !== ''}
	<Badge color={getBadgeColor(status)}>{status}</Badge>
{:else}
	-
{/if}
