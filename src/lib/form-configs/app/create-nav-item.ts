import type { FormConfig } from "$lib/form-types";

export const createNavItemFormConfig: FormConfig = {
    formAttributes: {
        action: '?/createNavItem',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Submit'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'title',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'Title',
                    value: ''
                },
                labelConfig: {
                    text: 'Title'
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
                    name: 'slug',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'slug',
                    value: ''
                },
                labelConfig: {
                    text: 'Slug (or external link)'
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
                    name: 'parent_id',
                    type: 'hidden',
                    required: true,
                    disabled: false,
                    placeholder: 'parent page id',
                    value: ''
                },
                labelConfig: {
                    text: 'parent page id'
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
                    name: 'navigation_item_type',
                    type: 'select',
                    required: true,
                    disabled: false,
                    placeholder: 'Navigation item type',
                    value: 'page',
                    options: [{ label: 'page', name: 'page', value: 'page' }, { label: 'folder', name: 'folder', value: 'folder' }, { label: 'link', name: 'link', value: 'link' }]
                },
                labelConfig: {
                    text: 'Child Type'
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