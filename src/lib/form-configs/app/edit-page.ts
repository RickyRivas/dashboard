import type { FormConfig } from "$lib/form-types";

export const editPageFormConfig: FormConfig = {
    formAttributes: {
        action: '?/updatePage',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Update Page'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'title',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'Enter page title',
                    value: ''
                },
                labelConfig: {
                    text: 'Page Title*'
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
                    required: true,
                    disabled: false,
                    placeholder: 'page-url-slug',
                    value: ''
                },
                labelConfig: {
                    text: 'Page Slug*'
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
                    placeholder: 'Select item type',
                    value: 'page',
                    options: [
                        { label: 'Page', name: 'page', value: 'page' },
                        { label: 'Folder', name: 'folder', value: 'folder' },
                        { label: 'External Link', name: 'link', value: 'link' }
                    ]
                },
                labelConfig: {
                    text: 'Navigation Item Type*'
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
                    type: 'select',
                    required: false,
                    disabled: true,
                    placeholder: 'Select parent (optional)',
                    value: '',
                    options: [] // Populated dynamically with available parent pages/folders
                },
                labelConfig: {
                    text: 'Parent Item (Populated dynamically)'
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
                    name: 'content',
                    type: 'textarea',
                    required: false,
                    disabled: false,
                    placeholder: 'Enter page content (JSON format for now)',
                    value: ''
                },
                labelConfig: {
                    text: 'Page Content'
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
                    name: 'meta_title',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'Custom SEO title (optional)',
                    value: ''
                },
                labelConfig: {
                    text: 'SEO Title'
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
                    name: 'meta_description',
                    type: 'textarea',
                    required: false,
                    disabled: false,
                    placeholder: 'Brief description for search engines (150-160 characters)',
                    value: ''
                },
                labelConfig: {
                    text: 'Meta Description'
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
                    name: 'featured_image',
                    type: 'cloudinary-upload',
                    required: false,
                    disabled: false,
                    placeholder: 'Upload featured image',
                    value: ''
                },
                labelConfig: {
                    text: 'Featured Image'
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
                    name: 'display_order',
                    type: 'number',
                    required: false,
                    disabled: false,
                    placeholder: 'Order in navigation',
                    value: ''
                },
                labelConfig: {
                    text: 'Display Order'
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