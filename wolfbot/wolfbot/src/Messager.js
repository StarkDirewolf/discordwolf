// This file is responsible for the messages sent to the players

function ms2Mins(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

//function createNewGameMsg(player, string) {
//    player.gameMsg = player.channel.then(c => bot.createMessage(c.id, string));
//}

//function createNewMsgEach(string) {
//    players.forEach(p => createNewGameMsg(p, string));
//}

//function addLineToMessage(player, msg) {
//    player.gameMsg.then(e => player.gameMsg = e.edit(e.content + "\n" + msg));
//}

//function addLineToEachPlayer(msg) {
//    players.forEach(player => player.gameMsg.then(e => {
//        player.gameMsg = e.edit(e.content + "\n" + msg);
//    }));
//}

//function addLineToDeadAndAlive(msg) {
//    players.concat(graveyard).forEach(player => player.gameMsg.then(e => {
//        player.gameMsg = e.edit(e.content + "\n" + msg);
//    }));
//}

function createDayTimer(player) {
    player.timerMsg = player.channel.then(c => bot.createMessage(c.id, getTimeRemainingString(dayDur)));
}

function updateDayTimer(ms) {
    players.forEach(p => p.timerMsg.then(msg => msg.edit(getTimeRemainingString(ms))));
}

function getTimeRemainingString(ms) {
    return "Time remaining: " + ms2Mins(ms);
}