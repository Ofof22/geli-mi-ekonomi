const { Client, Message } = require("discord.js");
const fs = require("fs");
const Config = require("../../config.json");

module.exports = {
  slash: false,
  name: ["hesabim"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {string[]} args
   */
  async execute(client, message, args) {
    
    const kullaniciDosyaYolu = "./hesaplar/kullanicilar.json";
    let kullaniciVerileri = [];

    try {
      const dosyaIcerigi = fs.readFileSync(kullaniciDosyaYolu, 'utf-8');
      kullaniciVerileri = JSON.parse(dosyaIcerigi).kullanicilar;
    } catch (error) {
      console.error("Kullanıcı dosyası okunurken bir hata oluştu:", error);
    }


    const kullanici = kullaniciVerileri.find(kullanici => kullanici.discordID === message.author.id);

    if (!kullanici) {
      
      const errorMessage = "Hesabınız bulunamadı. Lütfen önce bir hesap oluşturun.";
      await message.reply(errorMessage);
      return;
    }

    
    const accountInfo = `
    **${message.author.tag}'nin Hesap Bilgileri**
    \`\`\`
    İsim: ${kullanici.isim}
    Para: ${kullanici.para}
    Dolar: ${kullanici.dolar}
    Euro: ${kullanici.euro}
    Sterlin: ${kullanici.sterlin}
    Canada Doları: ${kullanici.canada_dolar}
    \`\`\``;

    await message.reply(accountInfo);
  },
};
