import type { FormConfig } from "$lib/form-types";

export const updateLinkNavItemFormConfig: FormConfig = {
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
                    placeholder: 'Enter link title',
                    value: ''
                },
                labelConfig: {
                    text: 'Link Title*'
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
                    name: 'external_url',
                    type: 'url',
                    required: true,
                    disabled: false,
                    placeholder: 'https://example.com',
                    value: ''
                },
                labelConfig: {
                    text: 'External URL*'
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
                    name: 'link_target',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select link target',
                    value: '_blank',
                    options: [
                        { label: 'New Tab (_blank)', name: '_blank', value: '_blank' },
                        { label: 'Same Tab (_self)', name: '_self', value: '_self' },
                        { label: 'Parent Frame (_parent)', name: '_parent', value: '_parent' },
                        { label: 'Top Frame (_top)', name: '_top', value: '_top' }
                    ]
                },
                labelConfig: {
                    text: 'Link Target'
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
                    value: 'link'
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
                    placeholder: 'Brief description of this external link',
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