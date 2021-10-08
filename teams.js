var Iter = require( 'es-iter');

function teams(players, numberOfPlayersPerTeam) {
    // Calculate target team rating
    // console.log("players length: " + players.length)
    // console.log("players[8]: " + players[8].username)
    // console.log("players[9]: " + players[9].username)
    var targetTeamRating = 0;
    players.forEach(player => targetTeamRating += player.rating);
    targetTeamRating = targetTeamRating/2;

    //all possible teams
    var allPossibleTeams = new Iter(players).combinations(numberOfPlayersPerTeam).toArray();

    //find difference between target rating and each team rating
    allPossibleTeamRatings = allPossibleTeams.map(team => ({rating: Math.abs(targetTeamRating-team.reduce((teamRating, player) => teamRating + player.rating, 0)), players: team}));
    allPossibleTeamRatings.sort((a, b) => a.rating-b.rating)

    //only keep the teams that are best matched
    candidateTeams = allPossibleTeamRatings.filter(team => Math.round((team.rating-allPossibleTeamRatings[0].rating + Number.EPSILON) * 100) / 100 <= 0.01)

	console.log("candidateTeams length: " + candidateTeams.length)
    //pick a random team from the list to be red
    var redTeam = candidateTeams[Math.floor(Math.random()*candidateTeams.length)].players;
    redTeam.sort((a, b) => b.rating-a.rating)

    //work out blue team based on red team
    var blueTeam = [...players].filter(p1 => redTeam.findIndex(p2 => p1.username === p2.username) == -1)
    blueTeam.sort((a, b) => b.rating-a.rating)

    var rT = ''
    redTeam.forEach(plyr => {
        rT += "`" + plyr.username + "`" + "(" + plyr.rating + ")" + "\n"
    })
    var bT = ''
    blueTeam.forEach(plyr => {
        bT += "`" + plyr.username + "`" + "(" + plyr.rating + ")" + "\n"
    })
    const teamP = Math.floor(Math.random() * 2)
    var picker
    if (teamP == 0)
        picker = blueTeam[Math.floor(Math.random() * numberOfPlayersPerTeam)].username
    else 
        picker = redTeam[Math.floor(Math.random() * numberOfPlayersPerTeam)].username
    const teams = {
        redTeam: rT,
        redAvg: Math.round((redTeam.reduce((a,x) => a+x.rating,0)/numberOfPlayersPerTeam+ Number.EPSILON)*100)/100,
        blueTeam: bT,
        blueAvg: Math.round((blueTeam.reduce((a,x) => a+x.rating,0)/numberOfPlayersPerTeam+ Number.EPSILON)*100)/100,
        picker: picker
    }

    return teams
}

module.exports = teams
