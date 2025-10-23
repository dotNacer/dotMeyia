<script lang="ts">
	import { animate, spring } from 'animejs'
	import { innerWidth, innerHeight } from 'svelte/reactivity/window'
	import { Plus, X, type Icon } from 'lucide-svelte'
	import type { ComponentType } from 'svelte'
	import { fade } from 'svelte/transition'
	import { onClickOutside } from 'runed'
	import type { Snippet } from 'svelte'
	import { Button } from '$lib/components/ui/button'
	// Types
	type ButtonState = 'closed' | 'open' | { expanded: number }

	export type Action = {
		label: string
		icon?: ComponentType<Icon>
		onClick?: () => void
		expandedContent?: Snippet
		expandedTitle?: string
	}

	// Props
	let {
		title = 'Title',
		icon: iconSnippet,
		actions = [],
	}: {
		title?: string
		icon?: Snippet
		actions?: Action[]
	} = $props()

	let currentState = $state<ButtonState>('closed')
	let backgroundRef: HTMLDivElement | undefined = $state()
	let contentRef: HTMLDivElement | undefined = $state()
	let isClosing = $state(false)

	const CLOSED_WIDTH = 56
	const CLOSED_HEIGHT = 56
	const PADDING = 16
	const CONTENT_PADDING = 16
	const EXPANDED_HEIGHT_RATIO = 0.85 // 85% of screen height

	let contentWidth = $derived(
		innerWidth.current ? innerWidth.current - PADDING * 2 - CONTENT_PADDING * 2 : 0
	)
	let measuredContentHeight = $state(0)
	let openHeight = $derived(measuredContentHeight + CONTENT_PADDING * 2)
	let expandedHeight = $derived(
		innerHeight.current ? innerHeight.current * EXPANDED_HEIGHT_RATIO : 400
	)

	$effect(() => {
		if (contentRef) {
			measuredContentHeight = contentRef.scrollHeight
		}
	})

	function isExpanded(state: ButtonState): boolean {
		return typeof state === 'object' && 'expanded' in state
	}

	function getExpandedIndex(state: ButtonState): number | null {
		return isExpanded(state) ? (state as { expanded: number }).expanded : null
	}

	function getDimensionsForState(state: ButtonState) {
		const screenWidth = innerWidth.current || window.innerWidth
		const openWidth = screenWidth - PADDING * 2

		if (state === 'closed') {
			return { width: CLOSED_WIDTH, height: CLOSED_HEIGHT }
		} else if (state === 'open') {
			return { width: openWidth, height: openHeight }
		} else if (isExpanded(state)) {
			return { width: openWidth, height: expandedHeight }
		}
		return { width: CLOSED_WIDTH, height: CLOSED_HEIGHT }
	}

	function openMenu() {
		if (currentState !== 'closed') return

		currentState = 'open'
		setTimeout(() => {
			if (contentRef) {
				measuredContentHeight = contentRef.scrollHeight
			}

			const dimensions = getDimensionsForState('open')
			animate(backgroundRef!, {
				width: dimensions.width,
				height: dimensions.height,
				ease: spring({
					bounce: 0.2,
					duration: 300,
				}),
			})

			setTimeout(() => {
				if (contentRef) {
					animate(contentRef!, {
						opacity: [0, 1],
						translateY: [25, 0],
						filter: ['blur(5px)', 'blur(0px)'],
						ease: 'outExpo',
						duration: 300,
						delay: 1,
					})
				}
			}, 50)
		}, 0)
	}

	function expandAction(index: number) {
		const action = actions[index]
		if (!action?.expandedContent) {
			// Si pas de contenu expanded, on exécute juste l'action et on ferme
			action?.onClick?.()
			closeMenu()
			return
		}

		// Sinon on passe à l'état expanded
		currentState = { expanded: index }
		setTimeout(() => {
			if (contentRef) {
				measuredContentHeight = contentRef.scrollHeight
			}

			const dimensions = getDimensionsForState({ expanded: index })
			animate(backgroundRef!, {
				width: dimensions.width,
				height: dimensions.height,
				ease: spring({
					bounce: 0.2,
					duration: 300,
				}),
			})

			setTimeout(() => {
				if (contentRef) {
					animate(contentRef!, {
						opacity: [0, 1],
						translateY: [25, 0],
						filter: ['blur(5px)', 'blur(0px)'],
						ease: 'outExpo',
						duration: 300,
						delay: 1,
					})
				}
			}, 50)
		}, 0)
	}

	function closeMenu() {
		if (currentState === 'closed') return

		isClosing = true

		if (contentRef) {
			animate(contentRef!, {
				opacity: [1, 0],
				filter: ['blur(0px)', 'blur(10px)'],
				translateY: [0, 10],
				duration: 200,
			})
		}

		const dimensions = getDimensionsForState('closed')
		animate(backgroundRef!, {
			width: dimensions.width,
			height: dimensions.height,
			ease: spring({
				bounce: 0.2,
				duration: 300,
			}),
		})

		setTimeout(() => {
			currentState = 'closed'
			isClosing = false
		}, 300)
	}

	function toggle() {
		if (currentState === 'closed') {
			openMenu()
		} else {
			closeMenu()
		}
	}

	function backdropClick(e: MouseEvent) {
		if (currentState === 'closed') return
		e.stopPropagation()
		closeMenu()
	}

	function isOpen(state: ButtonState): boolean {
		return state === 'open'
	}
</script>

{#if currentState !== 'closed'}
	<div
		onclick={backdropClick}
		class="fixed left-0 top-0 z-40 h-screen w-screen bg-black/50"
		transition:fade={{ duration: 50 }}
		role="button"
		tabindex="0"
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				backdropClick(e as unknown as MouseEvent)
			}
		}}
	></div>
{/if}

<div
	onclick={() => {
		if (currentState !== 'closed') return
		toggle()
	}}
	class="relative z-50 flex cursor-pointer select-none items-center justify-center border-none bg-transparent p-0 duration-200 {currentState ===
	'closed'
		? 'active:scale-95'
		: ''}"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			if (currentState !== 'closed') return
			toggle()
		}
	}}
	tabindex="-1"
	role="button"
	aria-label="Ajouter un élément"
>
	<div
		bind:this={backgroundRef}
		class="absolute bottom-0 right-0 z-[9999] h-14 w-14 origin-bottom-right overflow-hidden rounded-[32px] bg-primary text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
	>
		<div class="relative flex h-full w-full items-end justify-end p-4 text-primary-foreground">
			{#if currentState === 'closed' && !isClosing}
				<div
					class="flex h-full w-full flex-col items-center justify-center"
					transition:fade={{ duration: 50 }}
				>
					{#if iconSnippet}
						{@render iconSnippet()}
					{:else}
						<Plus class="size-6 text-primary-foreground" />
					{/if}
				</div>
			{:else if isOpen(currentState) || isClosing}
				<div
					bind:this={contentRef}
					class="absolute flex flex-col gap-3 text-left opacity-0"
					style="width: {contentWidth}px; filter: blur(10px);"
				>
					<div class="flex justify-between gap-2">
						<h3 class="m-0 text-2xl font-semibold tracking-tight">{title}</h3>
						<Button
							variant="outline"
							size="icon"
							class="rounded-3xl"
							onclick={() => closeMenu()}
						>
							<X class="size-4" />
						</Button>
					</div>
					{#each actions as action, index}
						<button
							type="button"
							class="flex items-center gap-2 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-2 text-left text-sm font-medium text-primary-foreground transition-[colors,transform] duration-75 hover:bg-primary-foreground/10 active:scale-[0.97]"
							onclick={(e) => {
								e.stopPropagation()
								expandAction(index)
							}}
						>
							{#if action.icon}
								<action.icon class="size-4" />
							{/if}
							{action.label}
						</button>
					{/each}
				</div>
			{:else if isExpanded(currentState) || isClosing}
				{@const expandedIndex = getExpandedIndex(currentState)}
				{@const action = expandedIndex !== null ? actions[expandedIndex] : null}
				<div
					bind:this={contentRef}
					class="absolute inset-0 flex flex-col gap-4 overflow-y-auto p-6 text-left opacity-0"
					style="filter: blur(10px);"
				>
					<div class="flex items-center justify-between gap-2">
						<h3 class="m-0 flex items-center gap-2 text-2xl font-bold tracking-tight">
							{#if action?.icon}
								<action.icon class="size-6" />
							{/if}
							{action?.expandedTitle || title}
						</h3>
						<Button
							variant="outline"
							size="icon"
							class="flex-shrink-0 rounded-3xl"
							onclick={() => closeMenu()}
						>
							<X class="size-4" />
						</Button>
					</div>
					{#if action?.expandedContent}
						{@render action.expandedContent()}
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
