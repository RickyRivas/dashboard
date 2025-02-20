interface Route {
    name: string;
    path: string;
}

interface NavigationRoutes {
    protectedRoutes: Route[];
    publicRoutes: Route[];
}

export const navigationRoutes: NavigationRoutes = {
    protectedRoutes: [
        {
            name: 'App',
            path: '/app'
        },
        {
            name: 'Settings',
            path: '/settings'
        }
    ],
    publicRoutes: [
        {
            name: 'Home',
            path: '/'
        },

    ]
}

export const settingsRoutes: Route[] = [
    {
        name: 'Profile',
        path: '/settings/profile',
    },
    {
        name: 'Billing',
        path: '/settings/billing',
    }
]