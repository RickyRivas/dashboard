import type { FormConfig } from "$lib/form-types";

export const autoFormConfig: FormConfig = {
    formAttributes: {
        action: '?/autoFormExample',
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
                    required: false,
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
                    name: 'name',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'name',
                    value: '',
                    options: [{ label: '9:00am', name: '9:00am', value: '9:00am' }, { label: '10:00am', name: '10:00am', value: '10:00am' }, { label: '11:00am', name: '11:00am', value: '11:00am' }]
                },
                labelConfig: {
                    text: 'name'
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