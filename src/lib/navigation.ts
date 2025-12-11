export type RouteGroup = 'auth' | 'public' | 'protected';

export interface RouteInfo {
    path: string;
    name: string;
    iconPath: string;
    showInNav?: boolean;
    children?: RouteInfo[];
}

// RouteGroup key and an array of RouteInfos
export const routes: Record<RouteGroup, RouteInfo[]> = {
    // Auth routes. also public but different layout
    auth: [
        { path: '/login', name: 'Sign In', iconPath: '', showInNav: true },
        { path: '/register', name: 'Create Account', iconPath: '', showInNav: true },
        { path: '/forgot-password', name: 'Reset Password', iconPath: '', showInNav: false },
        { path: '/reset-password', name: 'New Password', iconPath: '', showInNav: false },
        { path: '/verify-email', name: 'Verify Email', iconPath: '', showInNav: false },
    ],

    // Public routes
    public: [
        { path: '/', name: 'Home', iconPath: '', showInNav: true },
    ],

    // Protected routes
    protected: [
        {
            path: '/app', name: 'App', iconPath: '', showInNav: true,
            children: [
                { path: '/app', name: 'App Home', iconPath: 'M23.517 13.218a2.426 2.426 0 1 0-3.033 0l-4.15 6.527a1.942 1.942 0 0 1-2.802.51l-3.61-2.7A2.426 2.426 0 1 0 5.5 16.178a2.428 2.428 0 0 0 2.378 2.426l1.978 13.194a3.883 3.883 0 0 0 3.84 3.306h16.609a3.883 3.883 0 0 0 3.84-3.306l1.977-13.194a2.428 2.428 0 1 0-2.475-2.426c0 .51.158.989.43 1.377l-3.603 2.705a1.942 1.942 0 0 1-2.802-.51l-4.155-6.532Z', showInNav: true },
                { path: '/app/library', name: 'Library', iconPath: 'M32.313 38.5H13.75a6.19 6.19 0 0 1-6.188-6.188V11.689A6.19 6.19 0 0 1 13.75 5.5h19.594a3.095 3.095 0 0 1 3.093 3.094v18.562a3.102 3.102 0 0 1-2.062 2.92v4.299a2.06 2.06 0 0 1 2.063 2.063 2.06 2.06 0 0 1-2.063 2.062h-2.063ZM13.75 30.25a2.06 2.06 0 0 0-2.063 2.063 2.06 2.06 0 0 0 2.063 2.062h16.5V30.25h-16.5Zm2.063-14.953c0 .857.69 1.547 1.546 1.547h11.344c.857 0 1.547-.69 1.547-1.547s-.69-1.547-1.547-1.547H17.36c-.857 0-1.547.69-1.547 1.547Zm1.546 4.64c-.857 0-1.547.69-1.547 1.547 0 .858.69 1.547 1.547 1.547h11.344c.857 0 1.547-.69 1.547-1.547s-.69-1.547-1.547-1.547H17.36Z', showInNav: true },
                { path: '/app/ui-blocks', name: 'UI Blocks', iconPath: '', showInNav: true },
                // { path: '/app/snippets', name: 'Snippets', iconPath: 'M30.456 2.415c.876.634 1.2 1.783.803 2.785l-5.775 14.444h10.658c.994 0 1.878.619 2.217 1.554a2.362 2.362 0 0 1-.707 2.615L16.44 41.49a2.357 2.357 0 0 1-3.698-2.688l5.775-14.444H7.858a2.354 2.354 0 0 1-2.217-1.554 2.362 2.362 0 0 1 .707-2.615L27.56 2.51a2.357 2.357 0 0 1 2.895-.096Z', showInNav: true },
                // { path: '/app/sections', name: 'Sections', iconPath: '', showInNav: true },
                // { path: '/app/components', name: 'Components', iconPath: '', showInNav: true },
                { path: '/app/file-manager', name: 'File Manager', iconPath: 'M13.75 5.5a4.129 4.129 0 0 0-4.125 4.125v24.75A4.129 4.129 0 0 0 13.75 38.5h16.5a4.129 4.129 0 0 0 4.125-4.125V16.489a4.126 4.126 0 0 0-1.205-2.92l-6.871-6.864A4.111 4.111 0 0 0 23.386 5.5H13.75Zm16.855 11.344h-6.027c-.857 0-1.547-.69-1.547-1.547V9.27l7.574 7.573Z', showInNav: true },
                { path: '/app/billable', name: 'Billable', iconPath: 'M26.64 12.719h-9.28l-2.405-4.802A1.675 1.675 0 0 1 16.451 5.5h11.098a1.67 1.67 0 0 1 1.496 2.417l-2.404 4.802Zm-10.209 3.094H27.57l3.139 2.616a18.778 18.778 0 0 1 6.76 14.431 5.642 5.642 0 0 1-5.639 5.64H12.164a5.64 5.64 0 0 1-5.633-5.64c0-5.575 2.475-10.86 6.761-14.43l3.14-2.617Zm5.827 4.124c-.71 0-1.29.58-1.29 1.29v.257a3.385 3.385 0 0 0-.521 6.723l2.687.451A.806.806 0 0 1 23 30.256l-3.577-.006c-.71 0-1.29.58-1.29 1.29 0 .708.58 1.288 1.29 1.288h1.547v.258c0 .709.58 1.289 1.289 1.289s1.289-.58 1.289-1.29v-.302a3.383 3.383 0 0 0 2.836-3.339 3.379 3.379 0 0 0-2.83-3.338l-2.687-.452A.806.806 0 0 1 21 24.056h3.061c.71 0 1.29-.58 1.29-1.289s-.58-1.29-1.29-1.29h-.515v-.257c0-.709-.58-1.289-1.29-1.289v.006Z', showInNav: true },
                { path: '/app/manager', name: 'Manager', iconPath: 'M24.357 7.857A2.355 2.355 0 0 0 22 5.5a2.355 2.355 0 0 0-2.357 2.357v11.786H7.857A2.355 2.355 0 0 0 5.5 22a2.355 2.355 0 0 0 2.357 2.357h11.786v11.786A2.355 2.355 0 0 0 22 38.5a2.355 2.355 0 0 0 2.357-2.357V24.357h11.786A2.355 2.355 0 0 0 38.5 22a2.355 2.355 0 0 0-2.357-2.357H24.357V7.857Z', showInNav: true },
                { path: '/app/sites', name: 'Sites', iconPath: 'M30.456 2.415c.876.634 1.2 1.783.803 2.785l-5.775 14.444h10.658c.994 0 1.878.619 2.217 1.554a2.362 2.362 0 0 1-.707 2.615L16.44 41.49a2.357 2.357 0 0 1-3.698-2.688l5.775-14.444H7.858a2.354 2.354 0 0 1-2.217-1.554 2.362 2.362 0 0 1 .707-2.615L27.56 2.51a2.357 2.357 0 0 1 2.895-.096Z', showInNav: true },
                { path: '/app/jpg-to-webp', name: 'JPG to Webp', iconPath: 'M30.456 2.415c.876.634 1.2 1.783.803 2.785l-5.775 14.444h10.658c.994 0 1.878.619 2.217 1.554a2.362 2.362 0 0 1-.707 2.615L16.44 41.49a2.357 2.357 0 0 1-3.698-2.688l5.775-14.444H7.858a2.354 2.354 0 0 1-2.217-1.554 2.362 2.362 0 0 1 .707-2.615L27.56 2.51a2.357 2.357 0 0 1 2.895-.096Z', showInNav: true },
                { path: '/app/builder', name: 'Builder', iconPath: 'M30.456 2.415c.876.634 1.2 1.783.803 2.785l-5.775 14.444h10.658c.994 0 1.878.619 2.217 1.554a2.362 2.362 0 0 1-.707 2.615L16.44 41.49a2.357 2.357 0 0 1-3.698-2.688l5.775-14.444H7.858a2.354 2.354 0 0 1-2.217-1.554 2.362 2.362 0 0 1 .707-2.615L27.56 2.51a2.357 2.357 0 0 1 2.895-.096Z', showInNav: true },
            ]
        },
        {
            path: '/settings', name: 'Settings', iconPath: '', showInNav: true,
            children: [
                { path: '/settings', name: 'Settings Home', iconPath: '', showInNav: true },
                { path: '/settings/profile', name: 'Profile', iconPath: '', showInNav: true },
                { path: '/settings/billing', name: 'Billing', iconPath: '', showInNav: true },
            ]
        },
    ]
};

// helper functions
function flattenRoutes(routeList: RouteInfo[]): RouteInfo[] {
    return routeList.reduce((acc, route) => {
        acc.push(route);
        if (route.children && route.children.length > 0) {
            acc.push(...flattenRoutes(route.children));
        }
        return acc;
    }, [] as RouteInfo[]);
}

/**
 * Find route information for a specific path, searching through all nested routes
 */
export function findRouteInfo(path: string): { group: RouteGroup; route: RouteInfo; parent?: RouteInfo } | undefined {
    for (const [group, routeList] of Object.entries(routes) as [RouteGroup, RouteInfo[]][]) {
        // Check direct routes first
        const exactRoute = routeList.find(r => r.path === path);
        if (exactRoute) {
            return { group: group as RouteGroup, route: exactRoute };
        }

        // Check for sub-routes in children
        for (const parentRoute of routeList) {
            if (parentRoute.children) {
                const childRoute = parentRoute.children.find(child => child.path === path);
                if (childRoute) {
                    return {
                        group: group as RouteGroup,
                        route: childRoute,
                        parent: parentRoute
                    };
                }
            }
        }

        // Check for nested routes not in the children array
        const parentRoute = routeList.find(r => path.startsWith(`${r.path}/`));
        if (parentRoute) {
            return { group: group as RouteGroup, route: parentRoute };
        }
    }

    return undefined;
}

/**
 * Determines which route group a given path belongs to
 */
export function getRouteGroup(path: string): RouteGroup | undefined {
    const routeInfo = findRouteInfo(path);
    return routeInfo?.group;
}

/**
 * Get all navigable routes for a specific group, including children
 */
export function getNavRoutes(group: RouteGroup): RouteInfo[] {
    return routes[group].filter(route => route.showInNav);
}

/**
 * Get all routes for a specific group as a flat array
 */
export function getAllRoutes(group: RouteGroup): RouteInfo[] {
    return flattenRoutes(routes[group]);
}

/**
 * Gets breadcrumb trail for a path
 */
export function getBreadcrumbs(path: string): RouteInfo[] {
    const routeInfo = findRouteInfo(path);
    if (!routeInfo) return [];

    const breadcrumbs: RouteInfo[] = [];

    // Add parent if it exists
    if (routeInfo.parent) {
        breadcrumbs.push(routeInfo.parent);
    }

    // Add current route
    breadcrumbs.push(routeInfo.route);

    return breadcrumbs;
}