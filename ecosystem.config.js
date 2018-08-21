module.exports = {
    apps: [
        {
            name: 'ChatBot Api',
            script: 'bin/www',
            watch: true,
            env: {
                COMMON_VARIABLE: 'true'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        },
    ]
};
