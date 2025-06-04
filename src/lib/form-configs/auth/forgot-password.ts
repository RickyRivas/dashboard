import type { FormConfig } from "$lib/form-types";

export const forgotPasswordFormConfig: FormConfig = {
    formAttributes: {
        action: '?/passwordResetRequest',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Send Reset Link'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'email',
                    type: 'email',
                    required: true,
                    disabled: false,
                    placeholder: 'Email Address',
                    value: ''
                },
                labelConfig: {
                    text: 'Email Address'
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