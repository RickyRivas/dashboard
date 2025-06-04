import type { FormConfig } from "$lib/form-types";

export const resetPasswordFormConfig: FormConfig = {
    formAttributes: {
        action: '?/resetPassword',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Reset Password'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'newPassword',
                    type: 'password',
                    required: true,
                    disabled: false,
                    placeholder: 'Password',
                    value: '',
                    autocomplete: 'new-password'
                },
                labelConfig: {
                    text: 'Password'
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
                    name: 'confirmPassword',
                    type: 'password',
                    required: true,
                    disabled: false,
                    placeholder: 'Confirm Password',
                    value: ''
                },
                labelConfig: {
                    text: 'Confirm Password'
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