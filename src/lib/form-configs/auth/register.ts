import type { FormConfig } from "$lib/form-types";

export const registerFormConfig: FormConfig = {
    formAttributes: {
        action: '?/register',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Create Account'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'fullName',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'Full Name',
                    value: ''
                },
                labelConfig: {
                    text: 'Full Name'
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
        },
        {
            configuration: {
                inputAttributes: {
                    name: 'password',
                    type: 'password',
                    required: true,
                    disabled: false,
                    placeholder: 'Password',
                    value: '',
                    autocomplete: 'off'
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
                    name: 'passwordConfirmed',
                    type: 'password',
                    required: true,
                    disabled: false,
                    placeholder: 'Confirm Password',
                    value: '',
                    autocomplete: 'off'
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