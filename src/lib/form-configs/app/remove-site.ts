import type { FormConfig } from "$lib/form-types";

export const removeSiteFormConfig: FormConfig = {
    formAttributes: {
        action: '?/removeSite',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Delete Website'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'confirm',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: '',
                    value: '',
                },
                labelConfig: {
                    text: "Please type 'confirm' to delete this website."
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