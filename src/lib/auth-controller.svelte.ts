import { linkProviderGoogleFormConfig } from "./form-configs/settings/link-provider-google"
import { unlinkProviderGoogleFormConfig } from "./form-configs/settings/unlink-provider-google"
import { handleTriggerUpdate } from "./form-helpers"

// providers
export const appAvailableProviders = $state([
    { name: 'Google', iconPath: '/icons/google.svg', linkConfig: linkProviderGoogleFormConfig, linkFormHander: handleTriggerUpdate(linkProviderGoogleFormConfig), unlinkConfig: unlinkProviderGoogleFormConfig, unlinkFormHander: handleTriggerUpdate(unlinkProviderGoogleFormConfig) },
])

// avatar
export const avatarPlaceholderPath = '/avatar-placeholder.jpg'
