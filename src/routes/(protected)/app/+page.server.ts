import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
    const { session } = await safeGetSession();
    const { id } = session?.user

    // 1. grab checklist for cl widget
    const { data, error } = await supabase
        .from('checklist')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: true });

    return {
        checklist: error ? [] : data
    };
}

export const actions: Actions = {
    updateStatus: async ({ request, locals: { safeGetSession, supabase } }) => {
        const { session } = await safeGetSession();
        const { id } = session?.user

        const formData = await request.formData()
        // const status = formData.get('status') as string
        const checked = formData.get('checked') as string
        const itemId = formData.get('item-id') as string

        const { error } = await supabase
            .from('checklist')
            .update({
                checked,
                updated_at: new Date().toISOString()
            })
            .eq('id', itemId)
            .eq('user_id', id); // Security check

        if (error) {
            return fail(500, { message: 'Failed to update status' });
        }

        return { success: true, checked };
    },
    addItem: async ({ request, locals: { safeGetSession, supabase } }) => {
        const { session } = await safeGetSession();
        const { id } = session?.user

        const formData = await request.formData()
        const title = formData.get('title') as string
        const description = formData.get('description') as string

        const { data, error } = await supabase
            .from('checklist')
            .insert({
                title,
                description,
                user_id: id,
                status: 'pending'
            })
            .select()

        if (error) {
            return fail(500, { message: 'Failed to add checklist item' });
        }

        return {
            success: true, newItem: {
                title, description, id: data[0].id, status: 'pending'
            }
        };
    },
    deleteItem: async ({ request, locals: { safeGetSession, supabase } }) => {
        const { session } = await safeGetSession();
        const { id } = session?.user

        const formData = await request.formData()
        const itemId = formData.get('id') as string

        if (!itemId) {
            return fail(400, { message: 'Missing item ID' });
        }

        if (!id) {
            return fail(401, { message: 'You must be logged in to remove items' });
        }

        // Delete the item
        const { error } = await supabase
            .from('checklist')
            .delete()
            .eq('id', itemId)
            .eq('user_id', id); // Security check to ensure user owns the item

        if (error) {
            return fail(500, { message: 'Failed to remove item' });
        }

        return { success: true, removedItemid: itemId };
    },
    resetAllToPending: async ({ locals: { safeGetSession, supabase } }) => {
        const { session } = await safeGetSession();
        const { id } = session?.user

        if (!id) {
            return fail(401, { message: 'You must be logged in to reset items' });
        }

        try {
            // Update all items that belong to the current user
            const { error } = await supabase
                .from('checklist')
                .update({
                    checked: false,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', id);

            if (error) {
                console.error('Error resetting items:', error);
                return fail(500, { message: 'Failed to reset items' });
            }

            return { success: true, message: 'checklist resetted.' };

        } catch (error) {
            console.error('Error resetting items:', error);
            return fail(500, { message: 'An unexpected error occurred' });
        }
    }

}
