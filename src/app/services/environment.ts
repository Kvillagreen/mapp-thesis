export const Environment = {
    //url: 'http://localhost/mapp-thesis/src/app/',
    url: 'https://mapp-thesis.infotech3c.com/',
    get userApi(): string {
        return this.url + 'services/php-files';
    },
    get adminApi(): string {
        return this.url + 'services/php-files-admin';
    },
    
};
