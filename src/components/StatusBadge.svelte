<script lang="ts">
	import { Badge } from 'flowbite-svelte';

	let { status } = $props<{
		status: string;
	}>();

	function getBadgeColor(
		status: string
	): 'blue' | 'red' | 'green' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'dark' {
		switch (status.toLowerCase()) {
			case 'pending':
				return 'yellow';
			case 'approved':
				return 'green';
			case 'rejected':
				return 'red';
			case 'processing':
				return 'blue';
			case 'completed':
				return 'green';
			case 'error':
				return 'red';
			case 'new':
				return 'indigo';
			case 'review':
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
