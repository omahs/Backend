const packagejson = require('./package.json')

module.exports = {
    apps: [
        {
            name: packagejson.name,
            script: './bin/www',
            env: {
                NODE_ENV: 'local',
            },
            env_testnet: {
                NODE_ENV: 'testnet',
            },
            env_mainnet: {
                NODE_ENV: 'mainnet',
                max_memory_restart: '900M',
                cron_restart: '8 30 * * *',
            },
        },
    ],
}
