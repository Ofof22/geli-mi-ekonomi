const { Client, Message, EmbedBuilder } = require("discord.js");
const Config = require("../../config.json");
module.exports = {
  slash: false,
  name: ["yardim", "help"],
  /**
   * @param {Client} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  async execute(client, message, args) {
    const yardimEmbed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle("Yardım Menüsü")
      .setDescription("Bu botun kullanılabilir komutları aşağıda listelenmiştir:");

    
    yardimEmbed.setDescription("```css\n" +
      "#hesap-aç [isim] - Yeni bir hesap oluşturur.\n" +
      "#hesabim - Hesap bilgilerinizi görüntüler.\n" +
      "#doviz-bilgileri - Güncel döviz bilgilerini gösterir.\n" +
      "#satis - Sahip oldugunuz döviz (dolar sterlin canada dolar vs.) satmanıza yarar.\n" +
      "```"
    );

    // Yardım mesajını gönder
    await message.reply({ embeds: [yardimEmbed] });
  },
};
