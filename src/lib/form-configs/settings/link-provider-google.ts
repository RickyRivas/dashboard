import type { FormConfig } from "$lib/form-types";

export const linkProviderGoogleFormConfig: FormConfig = {
    formAttributes: {
        action: '?/linkProvider',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'link from Google'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'provider',
                    type: 'hidden',
                    required: true,
                    disabled: false,
                    placeholder: '',
                    value: 'google',
                },
                labelConfig: {
                    text: "link to provider"
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