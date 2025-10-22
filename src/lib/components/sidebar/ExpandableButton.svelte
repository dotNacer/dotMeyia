<script lang="ts">
	import { animate, spring } from 'animejs'
	import { innerWidth } from 'svelte/reactivity/window'
	import { Plus } from 'lucide-svelte'
	import { fade } from 'svelte/transition'
	import { onClickOutside } from 'runed'
	import type { Snippet } from 'svelte'

	// Props
	let {
		title = 'Title',
		icon: iconSnippet,
		children,
	}: {
		title?: string
		icon?: Snippet
		children: Snippet
	} = $props()

	let isOpen = $state(false)
	let backgroundRef: HTMLDivElement | undefined = $state()
	let contentRef: HTMLDivElement | undefined = $state()

	const CLOSED_WIDTH = 56
	const CLOSED_HEIGHT = 56
	const PADDING = 16
	const CONTENT_PADDING = 16

	let contentWidth = $derived(
		innerWidth.current ? innerWidth.current - PADDING * 2 - CONTENT_PADDING * 2 : 0
	)
	let measuredContentHeight = $state(0)
	let openHeight = $derived(measuredContentHeight + CONTENT_PADDING * 2)

	$effect(() => {
		if (contentRef) {
			measuredContentHeight = contentRef.scrollHeight
		}
	})

	function toggle() {
		const willOpen = !isOpen
		const screenWidth = innerWidth.current || window.innerWidth
		const openWidth = screenWidth - PADDING * 2

		if (willOpen) {
			isOpen = true
			setTimeout(() => {
				if (contentRef) {
					measuredContentHeight = contentRef.scrollHeight
				}

				animate(backgroundRef!, {
					width: openWidth,
					height: openHeight,
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
		} else {
			if (contentRef) {
				animate(contentRef!, {
					opacity: [1, 0],
					filter: ['blur(0px)', 'blur(10px)'],
					translateY: [0, 10],
					duration: 200,
				})
			}

			animate(backgroundRef!, {
				width: CLOSED_WIDTH,
				height: CLOSED_HEIGHT,
				ease: spring({
					bounce: 0.2,
					duration: 300,
				}),
			})

			setTimeout(() => {
				isOpen = false
			}, 200)
		}
	}

	onClickOutside(
		() => backgroundRef,
		() => {
			if (!isOpen) return
			toggle()
		}
	)
</script>

<div
	onclick={toggle}
	class="relative flex cursor-pointer items-center justify-center border-none bg-transparent p-0"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
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
			{#if !isOpen}
				<div
					class="flex h-full w-full flex-col items-center justify-center"
					transition:fade={{ duration: 100 }}
				>
					{#if iconSnippet}
						{@render iconSnippet()}
					{:else}
						<Plus class="size-6 text-primary-foreground" />
					{/if}
				</div>
			{:else}
				<div
					bind:this={contentRef}
					class="absolute flex flex-col gap-3 text-left opacity-0"
					style="width: {contentWidth}px; filter: blur(10px);"
				>
					<h3 class="m-0 text-xl font-semibold tracking-tight">{title}</h3>
					{@render children()}
				</div>
			{/if}
		</div>
	</div>
</div>
