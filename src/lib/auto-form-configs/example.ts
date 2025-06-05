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
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'name',
                    value: ''
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