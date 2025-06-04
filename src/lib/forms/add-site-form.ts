import type { FormConfig } from "$lib/form-types";

export const addSiteFormConfig: FormConfig = {
    formAttributes: {
        action: '?/addNewSite',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Add Site'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'site_name',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'Site Name',
                    value: ''
                },
                labelConfig: {
                    text: 'Site Name'
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