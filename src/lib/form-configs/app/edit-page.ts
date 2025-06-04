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
                    name: 'parent_id',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select parent page (optional)',
                    value: '',
                    options: [] // Populated with available parent pages
                },
                labelConfig: {
                    text: 'Parent Page'
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
                    name: 'page_type',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select page type',
                    value: 'standard',
                    options: [
                        { label: 'Standard Page', name: 'standard', value: 'standard' },
                        { label: 'Blog Post', name: 'blog', value: 'blog' },
                        { label: 'Landing Page', name: 'landing', value: 'landing' },
                        { label: 'Contact Page', name: 'contact', value: 'contact' },
                        { label: 'About Page', name: 'about', value: 'about' },
                        { label: 'Services Page', name: 'services', value: 'services' }
                    ]
                },
                labelConfig: {
                    text: 'Page Type'
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
                    value: '',
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
                    value: '',
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
                    placeholder: 'https://example.com/image.jpg',
                    value: '',
                },
                labelConfig: {
                    text: 'Featured Image URL'
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
                    name: 'template',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select page template',
                    value: 'default',
                    options: [
                        { label: 'Default', name: 'default', value: 'default' },
                        { label: 'Full Width', name: 'full-width', value: 'full-width' },
                        { label: 'Sidebar Left', name: 'sidebar-left', value: 'sidebar-left' },
                        { label: 'Sidebar Right', name: 'sidebar-right', value: 'sidebar-right' },
                        { label: 'Landing Page', name: 'landing', value: 'landing' },
                        { label: 'Minimal', name: 'minimal', value: 'minimal' }
                    ]
                },
                labelConfig: {
                    text: 'Page Template'
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
                    placeholder: '',
                    value: '',
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
        },
        {
            configuration: {
                inputAttributes: {
                    name: 'is_homepage',
                    type: 'checkbox',
                    required: false,
                    disabled: false,
                    placeholder: '',
                    value: false
                },
                labelConfig: {
                    text: 'Set as Homepage'
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