import type { FormConfig } from "$lib/form-types"

export const testFormConfig: FormConfig = {
    formAttributes: {
        action: '?/test',
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
                    name: 'name',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'name?',
                    value: 'ricky',
                },
                labelConfig: {
                    text: 'Full Name'
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
                    name: 'avatuar',
                    type: 'cloudinary-upload',
                    required: true,
                    disabled: false,
                    placeholder: 'avatar',
                    value: '',
                },
                labelConfig: {
                    text: 'Avatar'
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
                    name: 'phone',
                    type: 'phone',
                    required: true,
                    disabled: false,
                    placeholder: 'phone',
                    value: '9180000000',
                },
                labelConfig: {
                    text: 'Phone Number'
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
                    name: 'ethinicity',
                    type: 'radio-group',
                    required: true,
                    disabled: false,
                    placeholder: 'Ethinicity?',
                    value: 'mexican',
                    options: [{ label: 'mexican', name: 'mexican', value: 'mexican' }, { label: 'african', name: 'african', value: 'african' }, { label: 'other', name: 'other', value: 'other' }]
                },
                labelConfig: {
                    text: 'Ethinicity?'
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
                    name: 'friends',
                    type: 'checkbox-group',
                    required: true,
                    disabled: false,
                    placeholder: 'which friends?',
                    value: 'friend1, friend3',
                    options: [{ label: 'friend1', name: 'friend1', value: 'friend1' }, { label: 'friend2', name: 'friend2', value: 'friend2' }, { label: 'friend3', name: 'friend3', value: 'friend3' }]
                },
                labelConfig: {
                    text: 'which friends?'
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
                    name: 'time-slot',
                    type: 'select',
                    required: true,
                    disabled: false,
                    placeholder: 'time slot',
                    value: '9:00am',
                    options: [{ label: '9:00am', name: '9:00am', value: '9:00am' }, { label: '10:00am', name: '10:00am', value: '10:00am' }, { label: '11:00am', name: '11:00am', value: '11:00am' }]
                },
                labelConfig: {
                    text: 'Who is with friend2?'
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
                    name: 'bio',
                    type: 'textarea',
                    required: true,
                    disabled: false,
                    placeholder: 'bio',
                    value: 'web dev'
                },
                labelConfig: {
                    text: 'Bio'
                }
            },
            fieldState: {
                hasError: false,
                showSuccess: false,
                statusMessage: ''
            }
        }
    ]
}