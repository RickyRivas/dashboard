import type { FormConfig } from "$lib/form-types";

export const timeEntryFormConfig: FormConfig = {
    formAttributes: {
        action: '?/addTimeEntry',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Save Time Entry'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'projectName',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'Enter project or account name',
                    value: ''
                },
                labelConfig: {
                    text: 'Project Name'
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
                    name: 'date',
                    type: 'date',
                    required: true,
                    disabled: false,
                    placeholder: 'Select date',
                    value: ''
                },
                labelConfig: {
                    text: 'Date'
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
                    name: 'startTime',
                    type: 'time',
                    required: true,
                    disabled: false,
                    placeholder: 'Start time',
                    value: ''
                },
                labelConfig: {
                    text: 'Start Time'
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
                    name: 'endTime',
                    type: 'time',
                    required: true,
                    disabled: false,
                    placeholder: 'End time',
                    value: ''
                },
                labelConfig: {
                    text: 'End Time'
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
                    name: 'hoursSpent',
                    type: 'number',
                    required: true,
                    disabled: false,
                    placeholder: 'Total hours',
                    value: '',
                    step: '.01'
                },
                labelConfig: {
                    text: 'Hours Spent'
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
                    name: 'taskDescription',
                    type: 'textarea',
                    required: false,
                    disabled: false,
                    placeholder: 'Describe what you worked on',
                    value: ''
                },
                labelConfig: {
                    text: 'Task Description'
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
                    name: 'taskCategory',
                    type: 'select',
                    required: true,
                    disabled: false,
                    placeholder: 'Select category',
                    value: '',
                    options: [
                        { label: 'Development', name: 'Development', value: 'Development' },
                        { label: 'Design', name: 'Design', value: 'Design' },
                        { label: 'Meetings', name: 'Meetings', value: 'Meetings' },
                        { label: 'Planning', name: 'Planning', value: 'Planning' },
                        { label: 'Research', name: 'Research', value: 'Research' },
                        { label: 'QA/Testing', name: 'QA/Testing', value: 'QA/Testing' },
                        { label: 'Other', name: 'Other', value: 'Other' }
                    ]
                },
                labelConfig: {
                    text: 'Task Category'
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
                    name: 'billableStatus',
                    type: 'checkbox',
                    required: false,
                    disabled: false,
                    placeholder: '',
                    value: false,
                },
                labelConfig: {
                    text: 'Billable'
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
                    name: 'hourlyRate',
                    type: 'number',
                    required: true,
                    disabled: false,
                    placeholder: 'Rate in $',
                    value: ''
                },
                labelConfig: {
                    text: 'Hourly Rate'
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
                    name: 'clientContact',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'Person who requested the work',
                    value: ''
                },
                labelConfig: {
                    text: 'Client Contact'
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
                    name: 'notes',
                    type: 'textarea',
                    required: false,
                    disabled: false,
                    placeholder: 'Additional context or details',
                    value: ''
                },
                labelConfig: {
                    text: 'Notes'
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
                    name: 'status',
                    type: 'select',
                    required: true,
                    disabled: false,
                    placeholder: 'Select status',
                    value: 'Pending',
                    options: [
                        { label: 'Pending', name: 'Pending', value: 'Pending' },
                        { label: 'Approved', name: 'Approved', value: 'Approved' },
                        { label: 'Billed', name: 'Billed', value: 'Billed' },
                        { label: 'Paid', name: 'Paid', value: 'Paid' }
                    ]
                },
                labelConfig: {
                    text: 'Status'
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
                    name: 'tags',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'Comma-separated tags',
                    value: ''
                },
                labelConfig: {
                    text: 'Tags'
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