import type { FormConfig } from "$lib/form-types";

export const sendResetFormConfig: FormConfig = {
    formAttributes: {
        action: '?/sendPasswordResetRequest',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Send Password Reset Request'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'userid',
                    type: 'hidden',
                    required: true,
                    disabled: false,
                    placeholder: '',
                    value: ''
                },
                labelConfig: {
                    text: 'user id'
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