import type { FormConfig } from "$lib/form-types";

export const siteChecklistConfig: FormConfig = {
    formAttributes: {
        action: '?/updateChecklistItem',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Update Checklist'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'opportunity_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Opportunity'
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
                    name: 'contract_signing_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Contract Signing'
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
                    name: 'questionnaire_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Questionnaire'
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
                    name: 'payment_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Payment'
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
                    name: 'design_consultation_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Design Consultation'
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
                    name: 'design_reveal_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Design Reveal'
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
                    name: 'design_approval_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Design Approval'
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
                    name: 'design_to_code_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Design To Code'
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
                    name: 'design_qa_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Design QA'
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
                    name: 'favicon_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Favicon'
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
                    name: 'sitemap_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Sitemap'
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
                    name: 'meta_tags_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Meta tags, title tag, and OG images'
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
                    name: 'google_analytics_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Google Analytics'
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
                    name: 'connect_domain_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Connect Domain'
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
                    name: 'copywriting_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Copywriting'
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
                    name: 'proofreading_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Proofreading'
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
                    name: 'submit_google_console_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Submit Website to Google Console'
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
                    name: 'technical_qa_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Technical QA'
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
                    name: 'launch_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Launch'
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
                    name: 'final_payment_status',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select status',
                    value: '',
                    options: [
                        { label: 'Not Started', name: 'not_started', value: 'not_started' },
                        { label: 'In Progress', name: 'in_progress', value: 'in_progress' },
                        { label: 'Completed', name: 'completed', value: 'completed' },
                        { label: 'Blocked', name: 'blocked', value: 'blocked' },
                        { label: 'Not Applicable', name: 'not_applicable', value: 'not_applicable' }
                    ]
                },
                labelConfig: {
                    text: 'Final Payment'
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