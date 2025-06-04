import type { InputConfig } from "./form-helpers";

export const deleteAccountFormConfig: InputConfig[] = [
    {
        name: 'confirm',
        label: "Please type 'confirm' to delete your account.",
        type: 'confirm',
        value: '',
        required: true,
        placeholder: '',
        disabled: false,
        error: '',
        autocomplete: 'off'
    }
];

export const profileSettingsInputConfigs: InputConfig[] = [
    {
        name: 'full_name',
        label: 'Name',
        type: 'text',
        value: '',
        required: true,
        placeholder: 'Name',
        disabled: false,
        error: ''
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        value: '',
        required: true,
        placeholder: 'Email',
        disabled: true,
        error: '',
    }
];