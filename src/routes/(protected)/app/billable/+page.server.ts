import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
    const { session } = await safeGetSession();
    const { id } = session?.user

    // Fetch time entries
    const { data: timeEntries, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', id)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching time entries:', error);
        return {
            timeEntries: []
        };
    }

    return {
        timeEntries
    };
}

export const actions: Actions = {
    addTimeEntry: async ({ request, locals: { safeGetSession, supabase } }) => {
        const { session } = await safeGetSession();
        const { id } = session?.user;

        const formData = await request.formData();
        const projectName = formData.get('projectName') as string;
        const date = formData.get('date') as string;
        const startTime = formData.get('startTime') as string;
        const endTime = formData.get('endTime') as string;
        const hoursSpent = parseFloat(formData.get('hoursSpent') as string);
        const taskDescription = formData.get('taskDescription') as string;
        const taskCategory = formData.get('taskCategory') as string;
        const billableStatus = formData.get('billableStatus') === 'true' || formData.get('billableStatus') === 'on';
        const hourlyRate = parseFloat(formData.get('hourlyRate') as string);
        const clientContact = formData.get('clientContact') as string;
        const notes = formData.get('notes') as string;
        const status = formData.get('status') as string;
        const tagsInput = formData.get('tags') as string;
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];

        const { data, error } = await supabase
            .from('time_entries')
            .insert({
                project_name: projectName,
                date,
                start_time: startTime,
                end_time: endTime,
                hours_spent: hoursSpent,
                task_description: taskDescription,
                task_category: taskCategory,
                billable_status: billableStatus,
                hourly_rate: hourlyRate,
                client_contact: clientContact,
                notes,
                status,
                tags,
                user_id: id
            })
            .select();

        if (error) {
            return fail(500, { message: 'Failed to add time entry' });
        }

        return {
            success: true,
            newTimeEntry: data[0]
        };
    },
    updateStatus: async ({ request, locals: { safeGetSession, supabase } }) => {
        const { session } = await safeGetSession();
        const { id } = session?.user

        const formData = await request.formData()
        const status = formData.get('status') as string
        const entryId = formData.get('entry-id') as string

        const { error } = await supabase
            .from('time_entries')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', entryId)
            .eq('user_id', id); // Security check

        if (error) {
            return fail(500, { message: 'Failed to update status' });
        }

        return { success: true, newStatus: status };
    },
    deleteTimeEntry: async ({ request, locals: { safeGetSession, supabase } }) => {
        const { session } = await safeGetSession();
        const { id } = session?.user;

        const formData = await request.formData();
        const entryId = formData.get('id') as string;

        console.log(entryId)

        if (!entryId) {
            return fail(400, { message: 'Missing time entry ID' });
        }

        if (!id) {
            return fail(401, { message: 'You must be logged in to delete time entries' });
        }

        // Delete the time entry
        const { error } = await supabase
            .from('time_entries')
            .delete()
            .eq('id', entryId)
            .eq('user_id', id); // Security check to ensure user owns the entry

        if (error) {
            return fail(500, { message: 'Failed to delete time entry' });
        }

        return { success: true, removedEntryId: entryId };
    },
}