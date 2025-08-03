import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import type { Actions } from "@sveltejs/kit";

const redirectPath = '/app/sites'

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
    const { siteid } = params

    // 1. grab site
    const { data: site, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteid)
        .single()

    if (error) throw redirect(303, redirectPath)

    return {
        site
    };
};

export const actions: Actions = {
    createSection: async ({ request, params, locals: { supabase, safeGetSession } }) => {
        const { siteid } = params;
        const { user } = await safeGetSession();
        const formData = await request.formData();
        const data = Object.fromEntries([...formData]);

        console.log(data)

        return { success: true }
    }
}