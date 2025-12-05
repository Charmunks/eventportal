<script>
	import { page } from '$app/stores';

	$: code = $page.params.code;
</script>

<svelte:head>
	<title>Join Club</title>
</svelte:head>

<iframe
	src="https://forms.hackclub.com/join-club?code={code}"
	title="Join Club Form"
></iframe>

<style>
	iframe {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		border: none;
	}
</style>
