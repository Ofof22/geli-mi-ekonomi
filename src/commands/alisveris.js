const { Client, Message, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const Config = require("../../config.json");

const dovizFilePath = "./doviz.json";
const kullaniciFilePath = "./hesaplar/kullanicilar.json";

module.exports = {
  slash: false,
  name: ["alisveris"],
  /**
   * @param {Client} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  async execute(client, message, args) {
    const dövizAdı = args[0];
    const miktar = parseFloat(args[1]);

    if (!dövizAdı || !miktar || isNaN(miktar) || miktar <= 0) {
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Lütfen geçerli bir döviz adı ve miktar girin.");
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const dovizVerileri = JSON.parse(fs.readFileSync(dovizFilePath, 'utf-8'));
    const kullaniciVerileri = JSON.parse(fs.readFileSync(kullaniciFilePath, 'utf-8')).kullanicilar;
    const kullanici = kullaniciVerileri.find(k => k.discordID === message.author.id);

    if (!kullanici) {
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Hesabınız bulunamadı. Lütfen önce bir hesap oluşturun.");
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const alisverisFiyati = dovizVerileri[dövizAdı.toLowerCase()] * miktar;

    if (kullanici.para < alisverisFiyati) {
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Yetersiz bakiye. Alışveriş yapabilmek için yeterli miktarda paraya sahip olmalısınız.");
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

   
    kullanici.para -= alisverisFiyati;

    
    if (!kullanici[dövizAdı]) {
      kullanici[dövizAdı] = 0;
    }
    kullanici[dövizAdı] += miktar;

    
    fs.writeFileSync(kullaniciFilePath, JSON.stringify({ kullanicilar: kullaniciVerileri }, null, 2));

    const successEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`${miktar} ${dövizAdı} başarıyla satın alındı. Yeni bakiye: ${kullanici.para}`);
    await message.reply({ embeds: [successEmbed] });
  },
};
