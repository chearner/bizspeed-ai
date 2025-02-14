<script lang="ts">
	import BizSpeedLogoWhite from '$lib/images/bizspeed-logo-white.svelte';
</script>

<footer class="footer gap-10 bg-base-100 p-10">
	<aside class="">
		<BizSpeedLogoWhite />
		<p class="px-2 text-sm">
			3157 Royal Drive<br />
			Suite 275<br />
			Alpharetta, GA 30022<br />
		</p>
		<p class="px-2 text-sm">
			<a href="tel:8662700541">(866) 270-0541</a>
		</p>
		<p class="px-2 text-sm">
			<a href="mailto:contact@bizspeed.com">contact@bizspeed.com</a>
		</p>
	</aside>
	<nav class="flex flex-col gap-2">
		<h6 class="text-lg font-bold">Services</h6>
		<a class="link-hover link">Branding</a>
		<a class="link-hover link">Design</a>
		<a class="link-hover link">Marketing</a>
		<a class="link-hover link">Advertisement</a>
	</nav>
	<nav class="flex flex-col gap-2">
		<h6 class="text-lg font-bold">Company</h6>
		<a class="link-hover link">About us</a>
		<a class="link-hover link">Contact</a>
		<a class="link-hover link">Jobs</a>
		<a class="link-hover link">Press kit</a>
	</nav>
	<nav class="flex flex-col gap-2">
		<h6 class="text-lg font-bold">Legal</h6>
		<a class="link-hover link">Terms of use</a>
		<a class="link-hover link">Privacy policy</a>
		<a class="link-hover link">Cookie policy</a>
	</nav>
</footer>
