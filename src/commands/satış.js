const { Client, Message, EmbedBuilder } = require("discord.js");
const fs = require("fs");

const dovizFilePath = "./doviz.json";
const kullaniciFilePath = "./hesaplar/kullanicilar.json";
const Config = require("../../config.json");
module.exports = {
  slash: false,
  name: ["satis"],
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

    if (!kullanici || !kullanici[dövizAdı] || kullanici[dövizAdı] < miktar) {
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Döviz miktarınız yetersiz veya belirtilen döviz adı geçerli değil.");
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const satisFiyati = dovizVerileri[dövizAdı.toLowerCase()] * miktar;

   
    kullanici.para += satisFiyati;

    
    kullanici[dövizAdı] -= miktar;

    
    fs.writeFileSync(kullaniciFilePath, JSON.stringify({ kullanicilar: kullaniciVerileri }, null, 2));

    const successEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`${miktar} ${dövizAdı} başarıyla satıldı. Yeni bakiye: ${kullanici.para}`);
    await message.reply({ embeds: [successEmbed] });
  },
};
