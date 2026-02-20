import { fail, type Actions } from "@sveltejs/kit"
import Anthropic from "@anthropic-ai/sdk";
import { PRIVATE_ANTHROPIC_API_KEY } from "$env/static/private";

const anthropicModel = "claude-sonnet-4-6"

const anthropic = new Anthropic({
    apiKey: PRIVATE_ANTHROPIC_API_KEY,
});

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData()
        const prompt = formData.get('prompt') as string;

        if (!prompt) return fail(400, { emptyPrompt: true })

        const msg: Anthropic.Message = await anthropic.messages.create({
            model: anthropicModel,
            max_tokens: 20000,
            temperature: 1,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt
                        }
                    ]
                }
            ]
        })

        return { msg }
    }
}