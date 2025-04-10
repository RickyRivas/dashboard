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
    setError: (APIError: boolean) => void,
    setSuccess: (APISuccess: boolean) => void,
    setErrorMessage: (message: string) => void,
): SubmitFunction {
    return async function () {
        // clear errors and states
        setLoading(true)
        setError(false)
        setSuccess(false)
        setErrorMessage('')
        inputConfigs.forEach((config) => {
            config.error = '';
        });

        return async ({ result }) => {
            if (result.type === 'success' && result.status === 200) {
                setSuccess(true)
                setError(false)

                if (result.data) {
                    // show success/error state for a 1s
                    setTimeout(() => {
                        if (result?.data?.redirectTo) {
                            window.location = result.data.redirectTo;
                        }
                        setLoading(false)
                    }, 1000)
                }
            } else {
                setSuccess(false)
                setError(true)

                // field errors
                if (result.data.errors) {
                    result.data.errors.forEach((error) => {
                        const config = inputConfigs.find((config) => config.name === error.field);
                        if (config) config.error = error.message;
                    });
                }

                // error message
                if (result.data.message) setErrorMessage(result.data.message)

                // show success/error state for a 1s
                setTimeout(() => {
                    setLoading(false);
                }, 1000)
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