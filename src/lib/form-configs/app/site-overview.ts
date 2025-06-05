import type { FormConfig } from "$lib/form-types";

export const siteOverviewFormConfig: FormConfig = {
    formAttributes: {
        action: '?/',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: ''
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'site_name',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'Account',
                    value: ''
                },
                labelConfig: {
                    text: 'Account'
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
                    name: 'primary_contact_name',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'Primary Contact',
                    value: ''
                },
                labelConfig: {
                    text: 'Primary Contact'
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
                    name: 'domain_name',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'Domain',
                    value: ''
                },
                labelConfig: {
                    text: 'Domain'
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