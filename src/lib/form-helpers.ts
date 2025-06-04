import type { SubmitFunction } from "@sveltejs/kit";
import type { FormConfig } from "./form-types";

export function formHandler(
    form: FormConfig,
    onSuccess?: (result: any) => void | Promise<void>
): SubmitFunction {
    return async function () {
        // clear states & set loading
        // 1. entire form
        form.formState.hasError = false
        form.formState.showSuccess = false
        form.formState.isDisabled = false
        form.formState.statusMessage = ''

        // 2. reset fields
        form.fieldDefinitions.forEach((field) => {
            field.fieldState.hasError = false
            field.fieldState.showSuccess = false
            field.fieldState.statusMessage = ""
            // disabled while loading
            field.configuration.inputAttributes.disabled = true
        });

        // 3. set loading
        form.formState.isLoading = true

        return async ({ result, update }) => {
            if (result.type === 'success' && result.status === 200) {
                form.formState.showSuccess = true
                form.formState.hasError = false

                // Call the optional success callback
                if (onSuccess) {
                    await onSuccess(result);
                }

                if (result.data) {
                    // show success/error state for a 1s
                    setTimeout(() => {
                        if (result?.data?.redirectTo) {
                            window.location = result.data.redirectTo;
                        }

                        // update({ reset: true });

                        form.formState.isLoading = false
                        form.fieldDefinitions.forEach((field) => {
                            field.configuration.inputAttributes.disabled = false
                        });
                    }, 1000)
                }
            } else {
                form.formState.showSuccess = false
                form.formState.hasError = true

                // field errors
                if (result.data.errors) {
                    result.data.errors.forEach((error) => {
                        const field = form.fieldDefinitions.find((field) => field.configuration.inputAttributes.name === error.field);
                        if (field) {
                            field.fieldState.hasError = true;
                            field.fieldState.statusMessage = error.message;
                        }
                    });
                }

                // error message
                if (result.data.message) form.formState.statusMessage = result.data.message;

                // show success/error state for a 1s
                setTimeout(() => {
                    form.formState.isLoading = false
                    form.fieldDefinitions.forEach((field) => {
                        field.configuration.inputAttributes.disabled = false
                    });
                }, 1000)
            }
        };
    }
}

export function updateValue(formConfig: FormConfig, index: number, newValue: string) {
    const fieldToUpdate = formConfig.fieldDefinitions[index];
    if (fieldToUpdate) fieldToUpdate.configuration.inputAttributes.value = newValue;
}

export function handleTriggerUpdate(config: FormConfig) {
    return (index: number, newValue: any) => {
        updateValue(config, index, newValue);
    };
}

export function updateConfigWithValues(config: FormConfig, data: Record<string, any>): void {
    config.fieldDefinitions.forEach(fieldDef => {
        const fieldName = fieldDef.configuration.inputAttributes.name;
        const dataValue = data[fieldName];

        if (dataValue !== undefined) {
            fieldDef.configuration.inputAttributes.value = dataValue === null ? '' : String(dataValue);
        }
    });
}
