let isEncrypted: number;
let md5Key: string | undefined;
let DES: { Iv: string, Key: string };
const env = process.env.SP_ENV || 'test';
let baseUrl: string ;

function accordToEnvChoseConfig() {
    switch (env) {
        case 'dev':
        case 'test':
            md5Key = 'Woyouxinxi666';
            isEncrypted = 0;
            DES = {
                Iv: '12345678',
                Key: 'wywmxxkj'
            };
            baseUrl = `https://${env}.webapi.serviceplat.sunmi.com`;
            break;
        case 'uat':
            md5Key = 'Jihewobox15';
            isEncrypted = 1;
            DES = {
                Iv: '98765432',
                Key: 'jihexxkj'
            };
            baseUrl = `https://${env}.webapi.serviceplat.sunmi.com`;
            break;
        case 'pub':
            md5Key = 'Jihewobox15';
            isEncrypted = 1;
            DES = {
                Iv: '98765432',
                Key: 'jihexxkj'
            };
            baseUrl = `https://webapi.serviceplat.sunmi.com`;
            break;

        default:
            break;
    }
}

accordToEnvChoseConfig();
export {
    isEncrypted,
    env,
    md5Key,
    DES,
    baseUrl
};
