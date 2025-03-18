import { goto } from "$app/navigation";
import type { SubmitFunction } from "@sveltejs/kit";

export interface FormApiError {
    field: string;
    message: string;
}

export interface InputConfig {
    name: string;
    label: string;
    type: string;
    value: string;
    required: boolean;
    placeholder: string;
    disabled: boolean;
    error: string;
    oAuthOnly?: boolean
    autocomplete?: | 'off'
    | 'on'
    // Sign-in/credentials
    | 'username'
    | 'current-password'
    | 'new-password'
    // Contact
    | 'email'
    | 'tel'
    // Personal info
    | 'name'
    | 'given-name'
    | 'family-name'
    | 'nickname'
    // Address
    | 'street-address'
    | 'address-line1'
    | 'address-line2'
    | 'address-level1'
    | 'address-level2'
    | 'postal-code'
    | 'country'
    // Payment
    | 'cc-name'
    | 'cc-number'
    | 'cc-exp'
    | 'cc-exp-month'
    | 'cc-exp-year'
    | 'cc-csc'
    // One-time code
    | 'one-time-code';
}

export function createFormHandler(
    inputConfigs: InputConfig[],
    setLoading: (isLoading: boolean) => void,
    setErrorMessage: (message: string) => void,
): SubmitFunction {
    return async function () {
        // clear errors
        setErrorMessage('')
        inputConfigs.forEach((config) => {
            config.error = '';
        });

        setLoading(true)

        return async ({ result }) => {
            setLoading(false);

            if (result.type === 'redirect') {
                goto(result.location);
                return
            }

            if (result.data) {
                if (result.data.message) {
                    setErrorMessage(result.data.message)
                }

                if (result.data.errors) {
                    result.data.errors.forEach((error) => {
                        const config = inputConfigs.find((config) => config.name === error.field);
                        if (config) config.error = error.message;
                    });
                }

                if (result.status === 200 && result?.data?.redirectTo) {
                    window.location = result.data.redirectTo;
                }
            }
        };
    }
}

export function handleAPIErrorsForm(configs: InputConfig[], ApiErrors: FormApiError[]) {
    // clear errors
    configs.forEach((config) => {
        config.error = '';
    });

    // add errors
    ApiErrors.forEach((error) => {
        const config = configs.find((config) => config.name === error.field);
        if (config) config.error = error.message;
    });

    return configs;
}