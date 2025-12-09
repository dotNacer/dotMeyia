# Quick Note Taking Feature

## Overview
The Quick Note Taking feature allows users to rapidly capture notes from their mobile devices with intelligent contextual merging capabilities. The system automatically detects similar existing notes and offers to merge the new content with relevant notes.

## Features

### 1. Floating Action Button (FAB)
- **Mobile-first design**: Only visible on mobile devices (< md breakpoint)
- **Position**: Fixed at bottom-right corner
- **Accessibility**: Includes screen reader support
- **Animation**: Smooth hover and tap animations

### 2. Quick Note Sheet
- **Bottom sheet UI**: Slides up from the bottom on mobile
- **Keyboard shortcuts**: 
  - `Cmd/Ctrl + K`: Open quick note sheet
  - `Cmd/Ctrl + Enter`: Save note
- **Smart textarea**: Auto-focus with resize capabilities
- **Similarity detection**: Shows related notes in real-time

### 3. Intelligent Note Merging

#### Hybrid Similarity Detection
The system uses a two-pronged approach for detecting similar notes:

1. **Keyword Matching (40% weight)**
   - Extracts meaningful keywords from content
   - Removes common stop words
   - Calculates Jaccard similarity between keyword sets

2. **Semantic Similarity (60% weight)**
   - Uses Google Gemini AI for deep semantic understanding
   - Compares contextual meaning beyond keywords
   - Provides nuanced similarity scores

#### Similarity Threshold
- Notes with > 30% combined similarity are suggested for merging
- Top 3 most similar notes are displayed
- User can select which note to merge with, or create a new one

### 4. Auto-generated Titles
When creating a new note (not merging), the system automatically generates a descriptive title using AI, analyzing the content to create a concise, meaningful title (max 60 characters).

## Architecture

### Frontend Components

```
src/lib/components/quick-note/
├── floating-action-button.svelte   # FAB component
├── quick-note-sheet.svelte         # Bottom sheet modal
└── index.ts                        # Barrel exports
```

### Backend Services

```
src/lib/server/
└── similarity.ts                   # Similarity detection & title generation

src/lib/
└── quick-notes.remote.ts           # Remote procedures (API)
```

### Hooks

```
src/lib/hooks/
└── use-keyboard-shortcut.svelte.ts # Keyboard shortcut management
```

## API Endpoints

### `findSimilarNotes(content: string)`
**Query**: Finds similar notes based on content
- **Input**: Note content
- **Output**: Array of similar notes with similarity scores
- **Authentication**: Required

### `createQuickNote({ content, mergeWithNoteId? })`
**Command**: Creates or merges a quick note
- **Input**: 
  - `content`: Note content (required)
  - `mergeWithNoteId`: ID of note to merge with (optional)
- **Output**: Created/updated note and merge status
- **Authentication**: Required

## Usage

### For Users

1. **Mobile**: Tap the floating '+' button at the bottom-right
2. **Desktop/Mobile**: Press `Cmd/Ctrl + K` anywhere in the app
3. Type your note in the textarea
4. If similar notes are found, optionally select one to merge with
5. Press `Cmd/Ctrl + Enter` or click "Save" button

### For Developers

#### Integrating the Feature

```svelte
<script lang="ts">
	import { FloatingActionButton, QuickNoteSheet } from '$lib/components/quick-note';
	import { useKeyboardShortcut } from '$lib/hooks/use-keyboard-shortcut.svelte';
	
	let quickNoteOpen = $state(false);
	
	// Optional: Add keyboard shortcut
	useKeyboardShortcut(() => {
		quickNoteOpen = true;
	}, { key: 'k', meta: true, ctrl: true });
</script>

<FloatingActionButton onclick={() => quickNoteOpen = true} />
<QuickNoteSheet bind:open={quickNoteOpen} />
```

#### Customizing Similarity Detection

Edit `src/lib/server/similarity.ts`:

```typescript
// Adjust similarity threshold
if (combinedSimilarity > 0.3) { // Change threshold here
	similarities.push(note);
}

// Adjust keyword/semantic weight
const combinedSimilarity = 
	keywordSimilarity * 0.4 +    // Keyword weight
	semanticSimilarity * 0.6;    // Semantic weight
```

## Testing

### Run Tests
```bash
npm run test              # Run all tests
npm run test:coverage     # Run with coverage report
```

### Test Files
- `src/lib/server/__tests__/similarity.test.ts`: Tests for similarity detection
- `src/lib/components/quick-note/__tests__/floating-action-button.test.ts`: Component tests

## Performance Considerations

1. **AI API Calls**: Semantic similarity uses Gemini API
   - Only called for notes with keyword similarity > 10%
   - Limits: Top 3 results only
   - Timeout: ~2-3 seconds per call

2. **Note Limit**: For large note collections, consider:
   - Pagination
   - Caching similar note results
   - Background processing

## Future Enhancements

- [ ] Voice-to-text input
- [ ] Image/photo attachment support
- [ ] Tags suggestion based on content
- [ ] Bulk merge operations
- [ ] Note templates
- [ ] Offline support with sync
- [ ] Rich text formatting options

## Troubleshooting

### Notes not being detected as similar
- Check if notes have sufficient overlapping keywords
- Verify Gemini API is configured correctly
- Lower the similarity threshold if needed

### Keyboard shortcut not working
- Ensure focus is not in an input field
- Check browser shortcuts don't conflict
- Verify `useKeyboardShortcut` hook is properly called

### Sheet not opening on mobile
- Check viewport meta tag is set correctly
- Verify z-index conflicts with other components
- Ensure sheet component is rendered in DOM

## Related Documentation
- [Svelte 5 Runes Guide](https://svelte.dev/docs/svelte/what-are-runes)
- [Better Auth Documentation](https://better-auth.com)
- [Google AI SDK](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai)
