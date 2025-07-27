import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

const DEFAULT_SETTINGS = {
    disableBeforeInput: false,
    emptyEditor: true,
    isAutocomplete: false,
    isCharLimit: false,
    isCharLimitUtf8: false,
    isMaxLength: false,
    isRichText: true,
    measureTypingPerf: false,
    showNestedEditorTreeView: false,
    showTableOfContents: false,
    showTreeView: true,
    tableCellMerge: true,
    tableCellBackgroundColor: true,
    tableHorizontalScroll: true,
};

export type SettingName = keyof typeof DEFAULT_SETTINGS;

export type Settings = typeof DEFAULT_SETTINGS;

export type SettingsStore = {
    subscribe: Writable<Settings>['subscribe'];
    setOption: (setting: SettingName, value: boolean) => void;
};

export function createSettingsStore(): SettingsStore {
    const { subscribe, /*set,*/ update } = writable(DEFAULT_SETTINGS);

    return {
        subscribe,
        setOption: (setting: SettingName, value: boolean) => {
            update((options) => ({
                ...options,
                [setting as string]: value,
            }));
            if (DEFAULT_SETTINGS[setting] === value && browser) {
                setURLParam(setting, null);
            } else if (browser) {
                setURLParam(setting, value);
            }
        },
    };
}

function setURLParam(param: SettingName, value: null | boolean) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (value !== null) {
        if (params.has(param)) {
            params.set(param, String(value));
        } else {
            params.append(param, String(value));
        }
    } else {
        if (params.has(param)) {
            params.delete(param);
        }
    }
    url.search = params.toString();
    window.history.pushState(null, '', url.toString());
}