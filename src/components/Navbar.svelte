<script lang="ts">
	import { page } from '$app/state';
	import { Moon, Sun } from 'lucide-svelte';
	import Drawer from '$components/Drawer.svelte';
	import BizSpeedLogo from '$lib/images/bizspeed-logo.svelte';
</script>

<navbar class="navbar sticky top-0 flex items-center justify-between bg-base-100 shadow-xl">
	<div class="flex-none">
		<Drawer />
	</div>
	<div class="flex flex-1 justify-center">
		<a href="/" title="BizSpeed" class="btn btn-ghost text-xl">
			<BizSpeedLogo size={50} />
		</a>
	</div>
	<label class="swap swap-rotate px-5">
		<input type="checkbox" class="theme-controller" value="light" />
		<Sun class="swap-off" />
		<Moon class="swap-on" />
	</label>
</navbar>

<style></style>
