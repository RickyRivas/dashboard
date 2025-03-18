import type { InputConfig } from "./form-helpers";

export const forgotPasswordFormConfig: InputConfig[] = [
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        value: '',
        required: true,
        placeholder: 'Email Address',
        disabled: false,
        error: ''
    }
];

export const loginFormConfig: InputConfig[] = [
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        value: '',
        required: true,
        placeholder: 'Email Address',
        disabled: false,
        error: '',
        autocomplete: 'email'
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        value: '',
        required: true,
        placeholder: 'Password',
        disabled: false,
        error: '',
        autocomplete: 'current-password'
    }
];

export const registerFormConfig: InputConfig[] = [
    {
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        value: '',
        required: true,
        placeholder: 'Full Name',
        disabled: false,
        error: ''
    },
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        value: '',
        required: true,
        placeholder: 'Email Address',
        disabled: false,
        error: ''
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        value: '',
        required: true,
        placeholder: 'Password',
        disabled: false,
        error: '',
        autocomplete: 'off'
    },
    {
        name: 'passwordConfirmed',
        label: 'Confirm Password',
        type: 'password',
        value: '',
        required: true,
        placeholder: 'Confirm Password',
        disabled: false,
        error: '',
        autocomplete: 'off'
    }
];

export const resetPasswordFormConfig: InputConfig[] = [
    {
        name: 'newPassword',
        label: 'Password',
        type: 'text',
        value: '',
        required: true,
        placeholder: 'Password',
        disabled: false,
        error: '',
        autocomplete: 'new-password'
    },
    {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'text',
        value: '',
        required: true,
        placeholder: 'Confirm Password',
        disabled: false,
        error: ''
    }
];

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