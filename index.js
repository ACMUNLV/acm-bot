import { config } from "dotenv";
config();

import { Client, Events, GatewayIntentBits } from "discord.js";

const token = process.env.DISCORD_TOKEN;
const roleName = "Member";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once(Events.ClientReady, async () => {
  // get the first guild the bot is in
  const guild = client.guilds.cache.first(); // should only be acm
  if (!guild) return;

  console.log(`connected to guild: ${guild.name} (${guild.id})`);

  // fetch all members
  await guild.members.fetch();

  const roleName = 'Member';
  const joinedSince = new Date(`2024-01-01`);
  updateMemberRoles(roleName, joinedSince, guild)
});

client.login(token);


const updateMemberRoles = (roleName, joinedSince, guild) => {
  const role = guild.roles.cache.find((r) => r.name === roleName);
  if (!role) {
    console.error(`role "${roleName}" not found`);
    return;
  }

  let i = 0;
  guild.members.cache.forEach(async (member) => {
    if (
      !member.user.bot &&
      member.joinedAt >= joinedSince &&
      member.roles.cache.size === 1 // no roles
    ) {
      try {
        if (!member.roles.cache.has(role.id)) {
          await member.roles.add(role);
          console.log(`assigned "${roleName}" to ${member.user.tag}`);
          i++;
        } else
          console.log(`${member.user.tag} already has the "${roleName}" role`);
      } catch (error) {
        console.error(error);
      }
    }
  });

  console.log(`done ${i} people added`);
}