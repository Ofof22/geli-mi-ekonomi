const { Client, Message, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const Config = require("../../config.json");

module.exports = {
  slash: false,
  name: ["hesap-aç"],
  /**
   * @param {Client} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  async execute(client, message, args) {
   
    const isim = args[0];

    if (!isim) {
      
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Lütfen bir isim belirtin.");
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    
    const kullaniciDosyaYolu = "./hesaplar/kullanicilar.json";
    let kullaniciVerileri = [];

    try {
      const dosyaIcerigi = fs.readFileSync(kullaniciDosyaYolu, 'utf-8');
      kullaniciVerileri = JSON.parse(dosyaIcerigi).kullanicilar;
    } catch (error) {
      console.error("Kullanıcı dosyası okunurken bir hata oluştu:", error);
    }

  
    const varolanKullanici = kullaniciVerileri.find(kullanici => kullanici.discordID === message.author.id);

    if (varolanKullanici) {
     
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`Zaten bir hesabınız var. Hesabınızın ismini değiştirmek istiyorsanız farklı bir isim deneyin.`);
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

   
    const varolanIsim = kullaniciVerileri.find(kullanici => kullanici.isim.toLowerCase() === isim.toLowerCase());

    if (varolanIsim) {
      
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`${isim} adlı hesap zaten var. Başka bir isim deneyin.`);
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    
    const yeniKullanici = {
      isim: isim,
      para: 60,
      dolar: 0,
      euro: 0,
      sterlin: 0,
      canada_dolar: 0,
      discordID: message.author.id,
    };

    
    kullaniciVerileri.push(yeniKullanici);

   
    fs.writeFileSync(kullaniciDosyaYolu, JSON.stringify({ kullanicilar: kullaniciVerileri }, null, 2));

   
    const successEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`${isim} adlı hesap başarıyla oluşturuldu. Discord ID: ${message.author.id}`);
    await message.reply({ embeds: [successEmbed] });
  },
};
