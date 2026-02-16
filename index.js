
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log("Ticket Log Bot Online");
});

client.on("channelCreate", async (channel) => {
  if (!channel.name?.startsWith(config.ticketPrefix)) return;
  const logChannel = await client.channels.fetch(config.logRoom);
  const embed = new EmbedBuilder()
    .setTitle("🎫 Ticket Created")
    .setColor("Green")
    .addFields(
      { name: "الروم", value: `<#${channel.id}>` },
      { name: "الاسم", value: channel.name }
    )
    .setTimestamp();
  logChannel.send({ embeds: [embed] });
});

client.on("channelDelete", async (channel) => {
  if (!channel.name?.startsWith(config.ticketPrefix)) return;
  const logChannel = await client.channels.fetch(config.logRoom);
  const embed = new EmbedBuilder()
    .setTitle("🗑️ Ticket Closed")
    .setColor("Red")
    .addFields(
      { name: "الاسم", value: channel.name },
      { name: "ID", value: channel.id }
    )
    .setTimestamp();
  logChannel.send({ embeds: [embed] });
});

const ticketFirstMessage = new Set();

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.channel.name?.startsWith(config.ticketPrefix)) return;
  if (ticketFirstMessage.has(message.channel.id)) return;

  ticketFirstMessage.add(message.channel.id);
  const logChannel = await client.channels.fetch(config.logRoom);

  const embed = new EmbedBuilder()
    .setTitle("✉️ First Ticket Message")
    .setColor("Blue")
    .addFields(
      { name: "العضو", value: message.author.tag },
      { name: "الروم", value: `<#${message.channel.id}>` },
      { name: "الرسالة", value: message.content || "بدون نص" }
    )
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
});

client.login(config.token);
