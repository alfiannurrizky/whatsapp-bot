const { Coordinates, PrayerTimes, SunnahTimes, CalculationMethod } = require('adhan')
const qrcode = require('qrcode-terminal');
const  moment = require('moment-timezone')
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});



client.on('message', message => {


    if(message.type == 'location')
    {
      
        let latitude = message.location.latitude
        let longitude = message.location.longitude

        const coordinates = new Coordinates(latitude,longitude)
        const date = new Date()
        const params = CalculationMethod.MoonsightingCommittee()
        const prayerTimes = new PrayerTimes(coordinates, date, params)
        const current = prayerTimes.currentPrayer();
        const sunnahTimes = new SunnahTimes(prayerTimes);

        let response = message.reply(
            `Jam Sholat 5 Waktu di Daerah Anda: 
            \n-Shubuh: ${moment(prayerTimes.maghrib).tz('Asia/Jakarta').format('h:mm A')}
            \n-Dzuhur: ${moment(prayerTimes.dhuhr).tz('Asia/Jakarta').format('h:mm A')}
            \n-Ashar: ${moment(prayerTimes.asr).tz('Asia/Jakarta').format('h:mm A')}
            \n-Maghrib: ${moment(prayerTimes.maghrib).tz('Asia/Jakarta').format('h:mm A')}
            \n-Isha: ${moment(prayerTimes.isha).tz('Asia/Jakarta').format('h:mm A')}

            \nJam Sholat Sunnah di Daerah Anda:
            \n-Tahajud: ${moment(sunnahTimes.lastThirdOfTheNight).tz('Asia/Jakarta').format('h:mm A')}
            \n\n\nNOTE: Sekarang waktu nya Sholat ${current}
        `)
    }



});

client.initialize();


 


