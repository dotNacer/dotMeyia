<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import LoginButton from '$lib/components/auth/LoginButton.svelte';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg md:text-xl">Sign In</Card.Title>

		<Card.Description class="text-xs md:text-sm">
			Select a provider to login to your account
		</Card.Description>

		<Card.Content>
			<div class="grid gap-4">
				<div class="flex w-full flex-col items-center justify-between gap-2">
					<LoginButton provider="google" />
					<LoginButton provider="apple" />
				</div>
			</div>
		</Card.Content>
	</Card.Header>
</Card.Root>
