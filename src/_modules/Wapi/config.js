// const config={//内部key
//     dev_key : "59346d400236ab95e95193f35f3df6a4",
//     app_key : "96a3e23a32d4b81894061fdd29e94319",
//     app_secret : "565975d7d7d01462245984408739804d"
// }


const config={
    sid:'770811593507344400'
}

let keys=W.getCookie('sid_'+config.sid);
try {
    keys=JSON.parse(keys);
    config.dev_key=keys.devKey;
    config.app_key=keys.appKey;
    config.app_secret=keys.appSecret;
} catch (error) {
    alert('app key error');
}


export default config;