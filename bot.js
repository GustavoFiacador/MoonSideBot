const Discord = require("discord.js"); //baixar a lib
const client = new Discord.Client();
const config = require("./config.json");

var id = function () {
    const weoid = "";
    const weoidArray = require('request');
    weoidArray('https://api.hgbrasil.com/geoip?key=5a0cea18&address=remote&precision=false', function (error, response, body) {
        const parsedLocate = JSON.parse(body);
        woeid = parsedLocate['results']['woeid'];
    });
    return woeid;
}
var city = function () {
    const cidade = "";
    const weoidArray = require('request');
    weoidArray('https://api.hgbrasil.com/geoip?key=5a0cea18&address=remote&precision=false', function (error, response, body) {
        const parsedLocate = JSON.parse(body);
        cidade = parsedLocate['results']['city'];
    });
    return cidade;
}

client.on("ready", () => {
    console.log(`Bot foi iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);
    client.user.setPresence({ game: { name: 'Ser programado', type: 3, url: 'https://open.spotify.com/user/gufiacador?si=LmdAhfS3TKCtYFF51MTaww' } });
    // 0 = Jogando
    //  1 = Transmitindo
    //  2 = Ouvindo
    //  3 = Assistindo
});

client.on("message", async message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    // comando ping
    if (comando === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
    }
    //comando apagar
    if (comando === "apagar") {
        const deleteCount = parseInt(args[0], 10);
        if (!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply("Por favor, forneça um número entre 2 e 100 para o número de mensagens a serem excluídas");

        const fetched = await message.channel.fetchMessages({ limit: deleteCount });
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`Não foi possível deletar mensagens devido a: ${error}`));
    }
    //Comando dolar
    if (comando === "dolar") {
        const request = require('request');
        request('https://economia.awesomeapi.com.br/all/USD-BRL', function (error, response, body) {
            const parsedDolar = JSON.parse(body);
            const dolar = message.channel.send("O dolar comercial está R$ " + parsedDolar['USD']['high']);
        });
    }

    //Comando Temperatura
    if (comando === "temp") {
        url = 'https://api.hgbrasil.com/weather?woeid=' + id();
        const request = require('request');
        request(url, function (error, response, body) {
            const parsedTemp = JSON.parse(body);
            const temp = message.channel.send("A temperatura em " + city() + " é de " + parsedTemp['results']['temp'] + "° Celsius com " + parsedTemp['results']['description']);
        });

    }
    //Comando previsao hoje
    if (comando === "previsaohoje") {
        const request = require('request');
        request('https://api.hgbrasil.com/weather?woeid=455827', function (error, response, body) {
            const parsedTemp = JSON.parse(body);
            const temp = message.channel.send("A previsão para hoje é de miníma de " + parsedTemp['results']['forecast']['0']['min'] + "° Celsius e maxima de " + parsedTemp['results']['forecast']['0']['max'] + "° Celsius, um dia " + parsedTemp['results']['forecast']['0']['description']);

        });
    }
    //Comando previsao amanha
    if (comando === "previsaoamanha") {
        const request = require('request');
        request('https://api.hgbrasil.com/weather?woeid=455827', function (error, response, body) {
            const parsedTemp = JSON.parse(body);
            const temp = message.channel.send("A previsão para amanhã é de miníma de " + parsedTemp['results']['forecast']['1']['min'] + "° Celsius e maxima de " + parsedTemp['results']['forecast']['1']['max'] + "° Celsius, um dia " + parsedTemp['results']['forecast']['1']['description']);

        });
    }


});
client.login(config.token);