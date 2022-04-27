const ytdl = require('ytdl-core');
const ytsearch = require('yt-search');
const queue = new Map();
const volume = 1;
const Discord = require("discord.js");

module.exports = {
    name: 'music',
    aliases: ['play', 'skip', 'stop', 'queue', 'repeat'],
    cooldown: 10,
    description: 'music',
    async execute(client, message, args, cmd, Discord){
        const voice_channel = message.member.voice.channel;
        if(!voice_channel) return message.reply('You need to be in a voice channel for this command to work!');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.reply('You do not have the correct perms!');
        if(!permissions.has('SPEAK')) return message.reply('You do not have the correct perms!');

        const server_queue = queue.get(message.guild.id);

       if(cmd === 'music') {
           message.channel.send('This Is A Music Command Wich Is Used With [Prefix]Play "Song"')
       }
       if(cmd === 'play'){
           if (!args.length) return message.channel.send('You need to send a song/link!');
           let song = {};

           if (ytdl.validateURL(args[0])){
               const song_info = await ytdl.getInfo(args[0]);;
               song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url, song_desc: song_info.videoDetails.description.slice(0, 500), song_author: song_info.videoDetails.author, song_thumbnail: 'https://www.htmlcsscolor.com/preview/16x16/32363C.png', song_views: song_info.videoDetails.viewCount,}
           } else{
               const video_finder = async (query) =>{
                   const video_result = await ytsearch(query);
                   return (video_result.videos.length > 1) ? video_result.videos[0] : null;
               }

               const video = await video_finder(args.join(' '));
               if(video){
                   song = { title: video.title, url: video.url, song_desc: video.description, song_author: video.author, song_thumbnail: video.thumbnail, song_views: video.viewCount,}   
  
               } else {
                   message.channel.send('Error finding video.');
               }
           }

           if (!server_queue){
            const queue_constructor = {
                voice_channel: voice_channel,
                text_channel: message.channel,
                connection: null,
                songs:[]
            }
 
            queue.set(message.guild.id, queue_constructor);
            queue_constructor.songs.push(song);
 
            try {
                const connection = await voice_channel.join();
                queue_constructor.connection = connection;
                video_player(message.guild, queue_constructor.songs[0]);
            } catch (err) {
                queue.delete(message.guild.id);
                message.channel.send('There was an error connecting!');
                throw err;
            }
        } else{
            server_queue.songs.push(song);
            const queueembed = new Discord.MessageEmbed()
            .setColor('#3FE0D0')
            .setTitle(`**${song.title}** added to the queue!`)
            .setDescription(song.song_desc)
            .setThumbnail(song.song_thumbnail)
            .addFields(
                { name: 'Made By:', value: song.song_author.name, inline: true},
                            )
            .setTimestamp()
            .setFooter('Joshcubes Music Bot Template On Github');
 
        message.channel.send(queueembed);
        }
       }

       else if (cmd === 'skip') skip_song(message, server_queue);
       else if (cmd === 'stop') stop_song(message, server_queue);
       else if (cmd === 'queue') list_queue(message, server_queue)
       
    } 
    
    

}

const video_player = async (guild, song) =>{
    const song_queue = queue.get(guild.id);

    if(!song){
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }
        const stream = ytdl(song.url, { filter: 'audioonly' });
        song_queue.connection.play(stream, { seek: 0, volume: volume})
        .on('finish', () => {
            song_queue.songs.shift();
            video_player(guild, song_queue.songs[0]);
        });
        const nowplaying = new Discord.MessageEmbed()
        .setColor('#3FE0D0')
        .setTitle(`Now Playing **${song.title}**!`)
        .setDescription(song.song_desc)
        .setThumbnail(song.song_thumbnail)
        .addFields(
            { name: 'Made By:', value: song.song_author.name, inline: true},
                        )
        .setTimestamp()
        .setFooter('Joshcubes Music Bot Template On Github');

    song_queue.text_channel.send(nowplaying)
}

const skip_song = (message, server_queue) =>{
    if(!server_queue) return message.channel.send('There are no songs in the queue!');
    server_queue.connection.dispatcher.end();
}

const stop_song = (message, server_queue) =>{
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}

const list_queue = (message, server_queue) =>{
    if(!server_queue){
        console.log('Empty Server Queue')
        message.channel.send('Server Queue Does Not Exist')
        
    } else{

        const queuesongs = {}

        queuesongs[0] = server_queue.songs[0]
        queuesongs[1] = server_queue.songs[1]
        queuesongs[2] = server_queue.songs[2]
        queuesongs[3] = server_queue.songs[3]
        queuesongs[4] = server_queue.songs[4]
        queuesongs[5] = server_queue.songs[5]
        queuesongs[6] = server_queue.songs[6]
        queuesongs[7] = server_queue.songs[7]
        queuesongs[8] = server_queue.songs[8]
        queuesongs[9] = server_queue.songs[9]

        if(!queuesongs[1]){
            queuesongs[1] = {title: "null"}
        }
        if(!queuesongs[2]){
            queuesongs[2] = {title: "null"}
        }
        if(!queuesongs[3]){
            queuesongs[3] = {title: "null"}
        }
        if(!queuesongs[4]){
            queuesongs[4] = {title: "null"}
        }
        if(!queuesongs[5]){
            queuesongs[5] = {title: "null"}
        }
        if(!queuesongs[6]){
            queuesongs[6] = {title: "null"}
        }
        if(!queuesongs[7]){
            queuesongs[7] = {title: "null"}
        }
        if(!queuesongs[8]){
            queuesongs[8] = {title: "null"}
        }
        if(!queuesongs[9]){
            queuesongs[9] = {title: "null"}
        }

        const QueueEmbed = new Discord.MessageEmbed()
        .setColor('#5700FF')
        .setTitle('The Queue')
        .addFields(
            {name: '1', value: `${queuesongs[0].title}`},
            {name: '2', value: `${queuesongs[1].title}`},
            {name: '3', value: `${queuesongs[2].title}`},
            {name: '4', value: `${queuesongs[3].title}`},
            {name: '5', value: `${queuesongs[4].title}`},
            {name: '6', value: `${queuesongs[5].title}`},
            {name: '7', value: `${queuesongs[6].title}`},
            {name: '8', value: `${queuesongs[7].title}`},
            {name: '9', value: `${queuesongs[8].title}`},
            {name: '10', value: `${queuesongs[9].title}`},
        )
        .setFooter('Joshcubes Music Bot Template On Github!')

        message.channel.send(QueueEmbed);



    }
}
