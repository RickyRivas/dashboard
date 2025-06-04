import type { FormConfig } from "$lib/form-types";

export const siteInfoFormConfig: FormConfig = {
    formAttributes: {
        action: '?/updateSiteInfo',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Save Site Info'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'domain_name',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'example.com',
                    value: ''
                },
                labelConfig: {
                    text: 'Domain Name'
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
                    name: 'start_date',
                    type: 'date',
                    required: false,
                    disabled: false,
                    placeholder: '',
                    value: ''
                },
                labelConfig: {
                    text: 'Start Date'
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
                    name: 'estimated_end_date',
                    type: 'date',
                    required: false,
                    disabled: false,
                    placeholder: '',
                    value: ''
                },
                labelConfig: {
                    text: 'Estimated End Date'
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
                    name: 'launch_date',
                    type: 'date',
                    required: false,
                    disabled: false,
                    placeholder: '',
                    value: ''
                },
                labelConfig: {
                    text: 'Launch Date'
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
                    name: 'website_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Planning', name: 'planning', value: 'planning' },
                        { label: 'In Development', name: 'in_development', value: 'in_development' },
                        { label: 'Review', name: 'review', value: 'review' },
                        { label: 'Staging', name: 'staging', value: 'staging' },
                        { label: 'Launched', name: 'launched', value: 'launched' },
                        { label: 'Maintenance', name: 'maintenance', value: 'maintenance' },
                        { label: 'Archived', name: 'archived', value: 'archived' }
                    ]
                },
                labelConfig: {
                    text: 'Website Status'
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
                    name: 'spec_url',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'https://docs.google.com/document/...',
                    value: ''
                },
                labelConfig: {
                    text: 'SPEC URL'
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
                    name: 'build_link',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'https://dev.example.com',
                    value: ''
                },
                labelConfig: {
                    text: 'Build Link'
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
                    name: 'proof_link',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'https://proof.example.com',
                    value: ''
                },
                labelConfig: {
                    text: 'Proof Link'
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
                    name: 'hosting_provider',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'Vercel, Netlify, AWS, etc.',
                    value: ''
                },
                labelConfig: {
                    text: 'Hosting Provider'
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
                    name: 'cms_platform',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'WordPress, Strapi, Contentful, etc.',
                    value: ''
                },
                labelConfig: {
                    text: 'CMS Platform'
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
                    name: 'analytics_id',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'GA-12345678',
                    value: ''
                },
                labelConfig: {
                    text: 'Analytics ID'
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
                    name: 'project_notes',
                    type: 'textarea',
                    required: false,
                    disabled: false,
                    placeholder: 'Add any additional notes about this project...',
                    value: ''
                },
                labelConfig: {
                    text: 'Project Notes'
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