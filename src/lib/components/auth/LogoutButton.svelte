<script lang="ts">
	import { authClient } from '$lib/auth-client';

	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	async function handleLogout() {
		await authClient.signOut().then(() => {
			goto('/login');
		});
	}
</script>

<Button onclick={handleLogout} variant="destructive">Sign Out</Button>
