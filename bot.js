const { Client, GatewayIntentBits, Events, ChannelType } = require('discord.js');
const { token, refChannelId } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.VoiceStateUpdate, (oldVoiceState, newVoiceState) => {
	try {
		if (newVoiceState.channel && newVoiceState.channel.id === refChannelId ) { // The member connected to a channel.
			console.log(`${newVoiceState.member.user.tag} connected to ${newVoiceState.channel.name}.`);
			const category = newVoiceState.channel.parent;
			category.children.create({ name: `Vocal de ${newVoiceState.member.displayName}`, type: ChannelType.GuildVoice }).then(channel => {
				newVoiceState.member.voice.setChannel(channel);
			});
		} else if (oldVoiceState.channel && oldVoiceState.channel.id !== refChannelId ) { // The member disconnected from a channel.
			if (oldVoiceState.channel.members.size === 0)
				oldVoiceState.channel.delete("Deleted temporary voice channel");
		}
	} catch (error) {
		console.error(error);
	}
});

client.login(token);