const { existsSync, mkdirSync, appendFileSync } = require('fs');

// Using module "kleur"
// Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
class Colors {
    constructor() {
        let FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM, isTTY=true;
        if (typeof process !== 'undefined') {
            ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
                isTTY = process.stdout && process.stdout.isTTY;
        }

        this.enabled = !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== 'dumb' && (
            FORCE_COLOR != null && FORCE_COLOR !== '0' || isTTY
        )
    }
    
    init(x, y, txt) {
        let rgx = new RegExp(`\\x1b\\[${y}m`, 'g');
        let open = `\x1b[${x}m`, close = `\x1b[${y}m`;
        
        if (!this.enabled || txt == null) return txt;
        return open + (!!~(''+txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
    }
    
    black   = (txt) => { return this.init(30, 39, txt) };
    red     = (txt) => { return this.init(31, 39, txt) };
    green   = (txt) => { return this.init(32, 39, txt) };
    yellow  = (txt) => { return this.init(33, 39, txt) };
    blue    = (txt) => { return this.init(34, 39, txt) };
    magenta = (txt) => { return this.init(35, 39, txt) };
    cyan    = (txt) => { return this.init(36, 39, txt) };
    white   = (txt) => { return this.init(37, 39, txt) };
    gray    = (txt) => { return this.init(90, 39, txt) };
    grey    = (txt) => { return this.init(90, 39, txt) };
}

class Logs {
    /**
     * @param {String} path 
     */
    constructor(path) {
        this.path = path;
        this.colors = new Colors();
    }

    /**
     * @param {Json} config 
     */
    setup(config) {
        if (typeof config.pathfile == 'string') {
            if (!existsSync(`${this.path}/${config.pathfile}`)) mkdirSync(`${this.path}/${config.pathfile}`, { recursive: true });

            this.pf = config.pathfile;
        }

        if (typeof config.formatfilename == 'string') {
            this.fn = config.formatfilename;
        }

        if (typeof config.prefixlog == 'string') {
            this.pl = config.prefixlog;
        }
    }

    /**
     * @param {Number} l 
     */
    gt(l) {
        var v = {
            5: {
                type: 'CRITICAL',
                color: this.colors.red
            },
            4: {
                type: 'ERROR',
                color: this.colors.red
            },
            3: {
                type: 'WARNING',
                color: this.colors.yellow
            },
            2: {
                type: 'INFO',
                color: this.colors.green
            },
            1: {
                type: 'DEBUG',
                color: this.colors.white
            }
        }

        return v[l] ? v[l] : undefined;
    }

    /**
     * @param {String} t 
     * @returns {String}
     */
    dt(t) {
        const date = new Date();

        const formattedParts = date.toLocaleString('fr-FR', {weekday: 'long',year: 'numeric',month: '2-digit',day: '2-digit',hour: '2-digit',minute: '2-digit'}).split(/[,\/\s:]+/);
      
        const tokenReplacements = [formattedParts[4],formattedParts[5],formattedParts[2],formattedParts[3],formattedParts[1]];
      
        ['%h', '%m', '%j', '%M', '%a'].forEach((token, index) => {
            t = t.replace(token, tokenReplacements[index]);
        });
      
        return t;        
    }

    /**
     * @param {String} t 
     */
    s(t) {
        var file = `${this.path}`;
        if (this.pf) file += `/${this.pf}`;
        if (this.fn) {
            file += `/${this.dt(this.fn)}`;
        } else {
            file += 'Logs.txt';
        }

        appendFileSync(file, `${t}\n`, 'utf8');
    }

    /**
     * @param {Number} l 
     * @param {String} t 
     */
    p(l, t) {
        var level = this.gt(l);

        if (!level) return;
        if (this.pl) {
            var txt = this.dt(`${this.pl}${t}`);
        } else {
            var txt = t;
        }

        if (l > 1) this.s(txt.replace('%type', level.type));

        console.log(txt.replace('%type', level.color(level.type)));
    }

    /**
     * @param {String} text 
     */
    debug(...text) {
        this.p(1, text.join(' '));
    }
    /**
     * @param {String} text 
     */
    info(...text) {
        this.p(2, text.join(' '));
    }
    /**
     * @param {String} text 
     */
    warning(...text) {
        this.p(3, text.join(' '));
    }
    /**
     * @param {String} text 
     */
    error(...text) {
        this.p(4, text.join(' '));
    }
    /**
     * @param {String} text 
     */
    critical(...text) {
        this.p(5, text.join(' '));
    }
}

exports.Logs = Logs;
