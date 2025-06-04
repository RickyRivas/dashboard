import type { FormConfig } from "$lib/form-types";

export const deleteAssetConfig: FormConfig = {
    formAttributes: {
        action: '?/delete',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Delete Asset'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'id',
                    type: 'hidden',
                    required: true,
                    disabled: false,
                    placeholder: 'id',
                    value: ''
                },
                labelConfig: {
                    text: 'id'
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
                    name: 'category',
                    type: 'hidden',
                    required: true,
                    disabled: false,
                    placeholder: 'category',
                    value: ''
                },
                labelConfig: {
                    text: 'category'
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
                    name: 'type',
                    type: 'hidden',
                    required: true,
                    disabled: false,
                    placeholder: 'type',
                    value: ''
                },
                labelConfig: {
                    text: 'type'
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