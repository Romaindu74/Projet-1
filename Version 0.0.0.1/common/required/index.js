const { existsSync, readFileSync, writeFileSync, mkdirSync } = require('fs');
const { WebSocket } = require('ws');

class Bots {
    constructor(path) {
        this.path = path;
    }

    /**
     * @param {String} u 
     */
    bd(u) {
        function connect() {
            return new Promise((resolve, reject) => {
                var wss = new WebSocket(u);
                wss.onclose = () => {
                    return reject({ code: 1 });
                };
                wss.onerror = () => {
                    return reject({ code: 2 });
                };
                wss.onopen = () => {
                    return resolve({ code: 4, wss: wss });
                };
            });
        }

        return new Promise(async resolve => {
            for (var i = 0; i < 5; i++) {
                await connect().then(rep => {
                    return resolve(rep);
                }).catch(async () => {
                    Log.info(`Connexion échouée à la base de données, tentative n°${i}. Nouvelle tentative dans 1 seconde.`);
                    await new Promise(resolve => { setTimeout(() => { resolve() }, 1000) });
                });
            }
            return resolve({ code: 3 });
        });
    }

    /**
     * @param {String} host 
     */
    async setup(host) {
        if (!host) {
            Log.error("Les paramètres de la base de données sont incorrects.");
            return;
        }

        Log.info('Connexion à la base de données...');
        var rep = await this.bd(host);
        if (!rep.wss) {
            Log.error(`Connexion échouée`);
            process.exit(1);
        } else {
            this.wss = rep.wss;
        }
    }
}

exports.Bots = Bots;
