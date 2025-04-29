<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import LoginButton from '$lib/components/auth/LoginButton.svelte';
	import { fade } from 'svelte/transition';
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4"
>
	<div in:fade={{ duration: 300, delay: 150 }} class="w-full max-w-md">
		<Card.Root class="border-2 shadow-lg">
			<Card.Header class="space-y-2 pb-2">
				<Card.Title class="text-center text-2xl font-bold">Bienvenue</Card.Title>
				<Card.Description class="text-center text-sm">
					Connectez-vous pour accéder à votre compte
				</Card.Description>
			</Card.Header>

			<div class="px-6 py-2">
				<Card.Content class="px-0">
					<div class="grid gap-4">
						<div class="flex w-full flex-col items-center justify-between gap-3">
							<LoginButton provider="google" />
							<LoginButton provider="apple" />
						</div>

						<div class="mt-2 text-center text-xs text-muted-foreground">
							En vous connectant, vous acceptez nos <a
								href="/terms"
								class="underline hover:text-primary">Conditions d'utilisation</a
							>
						</div>
					</div>
				</Card.Content>
			</div>
		</Card.Root>
	</div>
</div>
