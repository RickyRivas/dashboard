import type { FormConfig } from "$lib/form-types";

export const contactsFormConfig: FormConfig = {
    formAttributes: {
        action: '?/updateContacts',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Save Contacts'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'primary_contact_name',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'John Doe',
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
                    name: 'primary_phone',
                    type: 'tel',
                    required: false,
                    disabled: false,
                    placeholder: '(555) 123-4567',
                    value: ''
                },
                labelConfig: {
                    text: 'Primary Phone'
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
                    name: 'primary_email',
                    type: 'email',
                    required: false,
                    disabled: false,
                    placeholder: 'john.doe@example.com',
                    value: ''
                },
                labelConfig: {
                    text: 'Primary Email'
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
                    name: 'secondary_contact_name',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'Jane Smith',
                    value: ''
                },
                labelConfig: {
                    text: 'Secondary Contact'
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
                    name: 'secondary_phone',
                    type: 'tel',
                    required: false,
                    disabled: false,
                    placeholder: '(555) 987-6543',
                    value: ''
                },
                labelConfig: {
                    text: 'Secondary Phone'
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
                    name: 'secondary_email',
                    type: 'email',
                    required: false,
                    disabled: false,
                    placeholder: 'jane.smith@example.com',
                    value: ''
                },
                labelConfig: {
                    text: 'Secondary Email'
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
                    name: 'business_address',
                    type: 'textarea',
                    required: false,
                    disabled: false,
                    placeholder: '123 Business St, Suite 101, City, State 12345',
                    value: ''
                },
                labelConfig: {
                    text: 'Business Address'
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
                    name: 'business_phone',
                    type: 'tel',
                    required: false,
                    disabled: false,
                    placeholder: '(555) 555-5555',
                    value: ''
                },
                labelConfig: {
                    text: 'Business Phone'
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
                    name: 'business_email',
                    type: 'email',
                    required: false,
                    disabled: false,
                    placeholder: 'contact@business.com',
                    value: ''
                },
                labelConfig: {
                    text: 'Business Email'
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
                    name: 'preferred_contact_method',
                    type: 'select',
                    required: false,
                    disabled: false,
                    placeholder: 'Select preferred contact method',
                    value: 'primary_email',
                    options: [
                        { label: 'Primary Phone', name: 'primary_phone', value: 'primary_phone' },
                        { label: 'Primary Email', name: 'primary_email', value: 'primary_email' },
                        { label: 'Secondary Phone', name: 'secondary_phone', value: 'secondary_phone' },
                        { label: 'Secondary Email', name: 'secondary_email', value: 'secondary_email' },
                        { label: 'Business Phone', name: 'business_phone', value: 'business_phone' },
                        { label: 'Business Email', name: 'business_email', value: 'business_email' }
                    ]
                },
                labelConfig: {
                    text: 'Preferred Contact Method'
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