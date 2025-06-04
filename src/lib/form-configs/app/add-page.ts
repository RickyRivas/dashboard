import type { FormConfig } from "$lib/form-types";

export const addPageFormConfig: FormConfig = {
    formAttributes: {
        action: '?/addNewPage',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Add Page'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'title',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'Title',
                    value: ''
                },
                labelConfig: {
                    text: 'Title'
                }
            },
            fieldState: {
                hasError: false,
                showSuccess: false,
                statusMessage: ''
            }
        },
        {
            configuration: {
                inputAttributes: {
                    name: 'slug',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'slug',
                    value: ''
                },
                labelConfig: {
                    text: 'Slug'
                }
            },
            fieldState: {
                hasError: false,
                showSuccess: false,
                statusMessage: ''
            }
        }
    ]
};