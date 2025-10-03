export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api/v1',
    endpoints: {
        auth: {
            login: '/auth/login',
            refresh: '/auth/refresh',
            logout: '/auth/logout'
        }
    }
};