<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Dialog from '$lib/components/ui/dialog';
	import SettingsContainer from '$lib/components/settings/settings-content.svelte';

	import { SETTINGS_CATEGORIES } from '$lib/utils';
	let { open = $bindable() }: { open: boolean } = $props();

	let selectedCategoryID = $state(SETTINGS_CATEGORIES[0].id);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
		<Sidebar.Provider>
			<Sidebar.Root>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each SETTINGS_CATEGORIES as item}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton
											onclick={() => (selectedCategoryID = item.id)}
											isActive={selectedCategoryID === item.id}
										>
											<item.icon class="size-4" />
											{item.title}
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
			</Sidebar.Root>
			<SettingsContainer selectedID={selectedCategoryID} />
		</Sidebar.Provider>
	</Dialog.Content>
</Dialog.Root>
