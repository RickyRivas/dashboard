import type { FormConfig } from "$lib/form-types";

export const updateFolderNavItemFormConfig: FormConfig = {
    formAttributes: {
        action: '?/updateNavItem',
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
                    placeholder: 'Enter folder name',
                    value: ''
                },
                labelConfig: {
                    text: 'Folder Name*'
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
                    placeholder: 'folder-slug (optional)',
                    value: ''
                },
                labelConfig: {
                    text: 'Folder Slug'
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
                    required: false,
                    disabled: false,
                    placeholder: '',
                    value: ''
                },
                labelConfig: {
                    text: 'Parent ID'
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
                    type: 'hidden',
                    required: true,
                    disabled: false,
                    placeholder: '',
                    value: 'folder'
                },
                labelConfig: {
                    text: 'Type'
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
                    name: 'description',
                    type: 'textarea',
                    required: false,
                    disabled: false,
                    placeholder: 'Brief description of this folder section',
                    value: ''
                },
                labelConfig: {
                    text: 'Description'
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
                    name: 'is_published',
                    type: 'checkbox',
                    required: false,
                    disabled: false,
                    placeholder: '',
                    value: false
                },
                labelConfig: {
                    text: 'Published'
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