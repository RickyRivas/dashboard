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
                    placeholder: 'Avatar Url',
                    value: '',
                },
                labelConfig: {
                    text: 'Avatar Url'
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
                    // Note: oAuthOnly would need to be added to InputAttributes type
                    // oAuthOnly: false // You'll need to set this dynamically: !hasEmailAuthentication
                },
                labelConfig: {
                    text: "Email - You will need to verify your new email address after you change it."
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