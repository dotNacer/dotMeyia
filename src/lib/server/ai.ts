import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { env } from '$env/dynamic/private'

const google = createGoogleGenerativeAI({
	apiKey: env.GOOGLE_API_KEY,
})

export default google
