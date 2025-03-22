import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js'
import { fail } from '@sveltejs/kit';

const supabase = createClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
)

let table = 'code_snippets'
let notesTable = 'editor_contents'
const masterNoteId = 'b1533fd2-2dda-4e65-9033-46c4ccd85ee1'

export async function getNotesFromSB() {
    const { data, error } = await supabase
        .from(notesTable)
        .select('*')
        .single()

    if (error) throw error
    if (!data) {
        throw new Error('Snippet not found.')
    }
    return {
        notes: data.content,
        updated: data.updated_at
    }
}

export async function saveNotesToSB(newNotes) {
    // id will be true if we're updating an exisiting snippet
    const { data, error } = await supabase
        .from(notesTable)
        .upsert({
            id: masterNoteId,
            content: newNotes,
            updated_at: new Date()
        })

    if (error) throw error
    return { data }
}


function stripFormatting(snippet, language) {

    if (language === 'css' || language === 'less' || language === 'javascript') {
        return snippet
            .split('\n')
            .map(line => {
                line = line.trim();
                if (line.startsWith('//')) {
                    // Preserve comments
                    return line;
                } else {
                    // For non-comment lines, remove extra spaces
                    return line
                        .replace(/\s+/g, ' ')
                        .replace(/:\s/g, ':')
                        .replace(/\{\s/g, '{')
                        .replace(/\s\}/g, '}')
                        .replace(/;\s/g, ';')
                        .replace(/,\s/g, ',')
                        .trim();
                }
            })
            .join('\n')
            .replace(/\n+/g, '\n') // Replace multiple newlines with a single newline
            .trim();
    } else {
        // For HTML and JavaScript, use the original stripping logic
        return snippet
            .replace(/\s+/g, ' ')
            .replace(/:\s/g, ':')
            .replace(/\{\s/g, '{')
            .replace(/\s\}/g, '}')
            .replace(/;\s/g, ';')
            .replace(/,\s/g, ',')
            .trim();
    }
}

function flattenAndStripCodeObject(code) {
    const { fields, snippet } = code

    const fieldMap = Object.fromEntries(
        fields.map(field => [field.name, field.value])
    )

    // Define the fields to extract and process
    const fieldsToExtract = ['title', 'description', 'type', 'category', 'thumbnailurl', 'favorite', 'buildtime'];

    // Create the result object
    const result = Object.fromEntries(
        fieldsToExtract.map(fieldName => [
            fieldName,
            fieldName === 'favorite' ? fieldMap[fieldName] : (fieldMap[fieldName] || '').trim()
        ])
    )

    // Process snippet fields
    const snippetLangs = ['html', 'css', 'javascript']
    snippetLangs.forEach(lang => {
        result[lang] = stripFormatting(snippet[lang] || '', lang);
    });

    // updated
    result.updated_at = new Date()

    return result;
}

export async function saveOrUpdateCodeInSupabase(code) {
    const flattenedCode = flattenAndStripCodeObject(code)
    let result

    if (code.id) {
        // id will be true if we're updating an exisiting snippet
        const { data, error } = await supabase
            .from(table)
            .update(flattenedCode)
            .eq('id', code.id)
            .select()

        if (error) throw error

        return result = data[0]

    }
    else {
        // add a new snippet
        const { data, error } = await supabase
            .from(table)
            .insert(flattenedCode)
            .select()

        if (error) throw error
        return result = data[0]
    }

}

export async function getCodeFromSupabase(id) {
    const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    if (!data) {
        throw new Error('Snippet not found.')
    }
    return {
        fetchedId: data.id,
        fetchedFields: {
            title: data.title,
            description: data.description,
            type: data.type,
            category: data.category,
            thumbnailurl: data.thumbnailurl,
            favorite: data.favorite,
            buildtime: data.buildtime,
        },
        fetchedSnippet: {
            html: data.html,
            css: data.css,
            javascript: data.javascript,
        },
        updatedAt: data.updated_at,
        createdAt: data.created_at
    }
}

export async function fetchSnippetsByType(type) {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('type', type)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error('Error fetching snippets:', error);
        return { data: null, error };
    }
}

export async function toggleFavorite(id) {
    try {
        const { data: currentSnippet, error: fetchError } = await supabase
            .from(table)
            .select('favorite')
            .eq('id', id)
            .single()

        if (fetchError) throw fetchError

        // Toggle the favorite status
        const newFavoriteStatus = !currentSnippet.favorite

        // Update the snippet with the new favorite status
        const { data, error: updateError } = await supabase
            .from(table)
            .update({ favorite: newFavoriteStatus })
            .eq('id', id)
            .select()
            .single()

        if (updateError) throw updateError

        return { data }
    } catch (error) {
        return { error }
    }
}

export async function deleteSnippetById(id) {
    try {
        const { data, error } = await supabase
            .from(table)
            .delete()
            .match({ id: id })
            .select()

        if (error) {
            console.error('Error deleting snippet:', error)
            throw new Error(error.message)
        }

        if (data && data.length > 0) {
            console.log('Snippet deleted successfully:', data[0])
            return data[0]
        } else {
            console.warn('No snippet found with the given ID:', id)
            return null
        }
    } catch (err) {
        console.error('Unexpected error while deleting snippet:', err)
        throw err
    }
}