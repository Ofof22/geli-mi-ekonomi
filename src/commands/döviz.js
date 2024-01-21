const { Client, Message, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

const kullaniciFilePath = "./hesaplar/kullanicilar.json";
const dovizFilePath = "./doviz.json";
module.exports = {
  slash: false,
  name: ["doviz-bilgileri"],
  /**
   * @param {Client} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  async execute(client, message, args) {
   
    const dovizAPIURL = "https://net.uptrical.xyz/api/doviz";
    const dovizBilgileri = await fetch(dovizAPIURL)
      .then(response => response.json())
      .catch(error => {
        console.error("Döviz bilgileri alınırken bir hata oluştu:", error);
        return null;
      });

    if (!dovizBilgileri) {
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Döviz bilgileri alınamadı. Lütfen daha sonra tekrar deneyin.");
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const dovizBilgileriEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Güncel Döviz Bilgileri")
      .setDescription(`\`\`\`json\n${JSON.stringify(dovizBilgileri, null, 2)}\n\`\`\``);

    await message.reply({ embeds: [dovizBilgileriEmbed] });
  },
};
