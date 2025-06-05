import type { FormConfig } from "$lib/form-types";

export const updateProfileFormConfig: FormConfig = {
    formAttributes: {
        action: '?/updateProfile',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Update Profile'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'avatar_url',
                    type: 'avatar-widget',
                    required: false,
                    disabled: false,
                    placeholder: 'Avatar',
                    value: '',
                },
                labelConfig: {
                    text: 'Avatar'
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
                    name: 'full_name',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'Name',
                    value: ''
                },
                labelConfig: {
                    text: 'Name'
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
                    placeholder: 'Email',
                    value: '',
                },
                labelConfig: {
                    text: "Email - You will need to verify your new email address after you change it.",
                    displayFormLabel: "Email"
                }
            },
            fieldState: {
                hasError: false,
                showSuccess: false,
                statusMessage: ''
            }
        },
    ]
};