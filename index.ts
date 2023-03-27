import { Client, Message, TextChannel } from 'discord.js-selfbot-v13';
import dotenv from 'dotenv';
dotenv.config();

const token: string = process.env.TOKEN || '';
const client: Client = new Client({checkUpdate: false});

client.once('ready', async () => {
    console.log('Conctado em:', client.user?.tag);
});

client.on('messageCreate', async (message: Message) => {
    if (message.author.id !== client.user?.id) {
        return;
    }

    if (message.content !== '!nv') {
        return;
    }

    async function lots_of_messages_getter(channelId: string, limit: number = 10000000) {
        let sum_messages: Message[] = [];
        let last_id: string | undefined;

        while (true) {
            const options: { limit: number; before?: string } = { limit: 100 };
            if (last_id) {
                options.before = last_id;
            }

            const channel: TextChannel = await client.channels.fetch(channelId) as TextChannel;
            const messages: Map<string, Message> = await channel.messages.fetch(options);

            messages.forEach((message) => {
                sum_messages.push(message);
            });

            const messagesArray: Message[] = Array.from(messages.values());
            last_id = messagesArray.pop()?.id;

            if (messages.size !== 100 || sum_messages.length >= limit) {
                break;
            }
        }

        return sum_messages;
    }

    const messagesToDelete: Message[] = await lots_of_messages_getter(message.channel.id);

    for (const message of messagesToDelete) {
        if (message.deletable) {
            console.log(message.content);
            await message.delete();
        }
    }
});

client.login(token);