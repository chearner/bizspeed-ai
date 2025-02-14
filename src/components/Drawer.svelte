<script lang="ts">
	import { Menu } from 'lucide-svelte';
</script>

<div class="drawer">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<label for="my-drawer" class="btn btn-ghost drawer-button"><Menu color="white" /></label>
	</div>
	<div class="drawer-side">
		<label for="my-drawer" aria-label="Close Menu" class="drawer-overlay"></label>
		<ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
			<li><a>BOL Scanner</a></li>
			<li><a>Register Scanner</a></li>
		</ul>
	</div>
</div>
