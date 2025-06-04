import type { FormConfig } from "$lib/form-types";

export const deleteAccountFormConfig: FormConfig = {
    formAttributes: {
        action: '?/deleteAccount',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Delete Account'
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
                    text: "Please type 'confirm' to delete your account."
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