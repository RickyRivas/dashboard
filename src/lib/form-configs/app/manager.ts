import type { FormConfig } from "$lib/form-types";

import { LIBRARIES } from '$lib/utils/libraries';

const libraryOptions = Object.keys(LIBRARIES).map(key => ({
    label: key,
    value: key,
    name: key,
    disabled: false
}));

export const managerFormConfig: FormConfig = {
    formAttributes: {
        action: '?/addToLibrary',
        method: 'post'
    },
    formState: {
        hasError: false,
        showSuccess: false,
        isDisabled: false,
        isLoading: false,
        statusMessage: '',
        submitButtonText: 'Save'
    },
    fieldDefinitions: [
        {
            configuration: {
                inputAttributes: {
                    name: 'title',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'Title',
                    value: ''
                },
                labelConfig: {
                    text: 'Title*'
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
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'Description',
                    value: ''
                },
                labelConfig: {
                    text: 'Description*'
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
                    name: 'type',
                    type: 'radio-group',
                    required: true,
                    disabled: false,
                    placeholder: 'Type',
                    value: '',
                    options: [
                        { label: 'snippet', name: 'snippet', value: 'snippet' },
                        { label: 'component', name: 'component', value: 'component' },
                        { label: 'section', name: 'section', value: 'section' }
                    ]
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
                    name: 'libraries',
                    type: 'checkbox-group',
                    required: false,
                    disabled: false,
                    placeholder: '',
                    value: '',
                    options: libraryOptions
                },
                labelConfig: {
                    text: 'Required Libraries'
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
                    name: 'category',
                    type: 'text',
                    required: true,
                    disabled: false,
                    placeholder: 'Category',
                    value: ''
                },
                labelConfig: {
                    text: 'Category*'
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
                    name: 'thumbnailurl',
                    type: 'cloudinary-upload',
                    required: false,
                    disabled: false,
                    placeholder: 'Thumbnail Url',
                    value: '',
                },
                labelConfig: {
                    text: 'Thumbnail Url'
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
                    name: 'buildtime',
                    type: 'text',
                    required: false,
                    disabled: false,
                    placeholder: 'Build Time',
                    value: ''
                },
                labelConfig: {
                    text: 'Build Time'
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
                    name: 'favorite',
                    type: 'checkbox',
                    required: false,
                    disabled: false,
                    placeholder: '',
                    value: false
                },
                labelConfig: {
                    text: 'Favorite'
                }
            },
            fieldState: {
                hasError: false,
                showSuccess: false,
                statusMessage: ''
            }
        },
        // SPECIAL! tabs for a codemirror component
        {
            configuration: {
                inputAttributes: {
                    name: 'html',
                    type: 'codemirror-widget-tab',
                    required: false,
                    disabled: false,
                    placeholder: "HTML",
                    codeMirrorLang: "html",
                    value: ''
                },
                labelConfig: {
                    text: 'HTML'
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
                    name: 'css',
                    type: 'codemirror-widget-tab',
                    required: false,
                    disabled: false,
                    placeholder: "CSS",
                    codeMirrorLang: "css",
                    value: ''
                },
                labelConfig: {
                    text: 'CSS'
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
                    name: 'javascript',
                    type: 'codemirror-widget-tab',
                    required: false,
                    disabled: false,
                    placeholder: "Javascript",
                    codeMirrorLang: "javascript",
                    value: ''
                },
                labelConfig: {
                    text: 'JAVASCRIPT'
                }
            },
            fieldState: {
                hasError: false,
                showSuccess: false,
                statusMessage: ''
            }
        },
    ]
};