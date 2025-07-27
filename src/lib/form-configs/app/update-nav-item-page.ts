import type { FormConfig } from "$lib/form-types";

export const updateNavItemFormConfig: FormConfig = {
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
                    value: 'page'
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
                    placeholder: 'Brief description of this page',
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
                    name: 'meta_title',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'SEO title (optional)',
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
                    placeholder: 'SEO description (150-160 characters)',
                    value: ''
                },
                labelConfig: {
                    text: 'SEO Description'
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