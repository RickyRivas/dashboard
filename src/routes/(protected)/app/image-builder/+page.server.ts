import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals, fetch }) => {
    const { supabase } = locals
    const trackerTable = 'build_tracker';
    const { data, error } = await supabase.from(trackerTable).select('*').single();

    if (data.account) {
        const response = await fetch('/api/get-local-imgs', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account: data.account
            })
        });

        const imgsData = await response.json();

        return { imgsData, account: data.account }
    }
}