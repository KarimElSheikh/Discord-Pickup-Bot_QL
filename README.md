# Discord Pickup bot for Quake live

A Discord pickup bot that arranges pickup games for Quake Live. The games are of type tdm or ctf, and the way to add up for a game is as follows:
* Using the command "add", you add for the game type you want and you wait for the pickup game to fill up with 8 players (tdm) or 10 players (ctf).
* When the game fills up, the players' ratings are pulled up from the House of Quake API, then 2 teams arranged in a such a way that the players are balanced to get the 2 teams with the closest average ratings. The following screenshot shows the bot displaying a filled up pickup game.
![Discord Pickup Bot QL screenshot](https://user-images.githubusercontent.com/10839251/136488810-a1d6e6d0-bb75-46c4-a85e-a417d9dff69c.png)
* In addition to tagging the players in the channel, the bot sends a DM to every participating player notifying the user that the pickup game is ready.

## Information
* This project is developed in Node.js/JavaScript and uses MongoDB for the database to store the Discord and Steam IDs of the players added for pickup games (The ratings are only pulled up when the pickup game is ready and are not stored in the database). 

# License
This project is licensed under the [AGPL V3 license](https://www.gnu.org/licenses/agpl-3.0.en.html).