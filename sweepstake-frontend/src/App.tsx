import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Game } from './classes/Game';
import { Group } from './classes/Group';
import type { Team } from './classes/Team';
import type { Stadium } from './classes/Stadium';
import { BottomNavigation, BottomNavigationAction, Box, Paper, Stack } from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SportsOutlinedIcon from '@mui/icons-material/SportsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import type { GroupTeam } from './classes/GroupTeam';
import GroupsPage from './pages/GroupsPage';
import HomePage from './pages/HomePage';
import MatchesPage from './pages/MatchesPage';
import { ZoneTimes } from './assets/ZoneTimes';
import axiosRetry from 'axios-retry';

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [nextGame, setNextGame] = useState<Game>();
  const [currentGame, setCurrentGame] = useState<Game>();
  const [value, setValue] = useState(0);
  const [groupNames, setGroupNames] = useState<string[]>([]);
  const rounds: string[] = [];

  axiosRetry(axios, {
    retries: 5,
    retryDelay: (retryCount) => {
        return retryCount * 2000;
    },
    retryCondition: (error) => {
        return error ? true : false;
    },
});

  useEffect(() => {
    async function getGroupsData() {
      await axios.get('https://worldcup26.ir/get/groups').then((response) => {
        const sortedGroups = response.data.groups.sort((a: Group, b: Group) => (a.name && b.name) ? ((a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0) : 0);
        sortedGroups.forEach((group: Group) => {
          const currentGroupNames = groupNames;
          currentGroupNames.push(group.name);
          setGroupNames(currentGroupNames);
          group.teams.sort((a: GroupTeam, b: GroupTeam) => {
            const aPts = parseInt(a.pts);
            const bPts = parseInt(b.pts);
            if (aPts > bPts) {
              return -1;
            }
            if (aPts < bPts) {
              return 1;
            }
            if (aPts == bPts) {
              const aGd = parseInt(a.gd);
              const bGd = parseInt(b.gd);
              if (aGd > bGd) {
                return -1
              }
              if (aGd < bGd) {
                return 1;
              }
              if (aGd == bGd) {
                const aGf = parseInt(a.gf);
                const bGf = parseInt(b.gf);
                if (aGf > bGf) {
                  return -1;
                }
                if (aGf < bGf) {
                  return 1;
                }
              }
            }
            return 0;
          });
          group.teams.forEach((team: GroupTeam) => team.id = team._id);
        });
        setGroups(sortedGroups);
      })
    }

    if (!(groups.length > 0)) {
      getGroupsData();
    }
  }, []);

  useEffect(() => {
    async function getTeamsData() {
      await axios.get('https://worldcup26.ir/get/teams').then((response) => setTeams(response.data.teams));
    }

    if (!(teams.length > 0)) {
      getTeamsData();
    }
  }, []);

  useEffect(() => {
    async function getStadiumData() {
      await axios.get('https://worldcup26.ir/get/stadiums').then((response) => setStadiums(response.data.stadiums));
    }

    if (!(stadiums.length > 0)) {
      getStadiumData();
    }
  }, []);

  useEffect(() => {
    async function getGameData() {
      await axios.get('https://worldcup26.ir/get/games').then((response) => {
        response.data.games.forEach((game: Game) => {
          rounds.push(game.type);
          const gameTime = Date.parse(game.local_date);
          const stadium = stadiums.find((stadium) => stadium.id == game.stadium_id);
          let difference = 0;
          if (stadium) {
            difference = ZoneTimes[stadium.id];
          }
          const gameTimeLocal = gameTime + (difference * 60 * 60 * 1000);
          game.date = gameTimeLocal;
          if (game.time_elapsed != "notstarted" && game.time_elapsed != "finished") {
            setCurrentGame(game);
          }
        })
        response.data.games.sort((a: Game, b: Game) => (a.date && b.date) ? ((a.date > b.date) ? 1 : (a.date < b.date) ? -1 : 0) : 0);
        setNextGame(response.data.games[0])
        setGames(response.data.games);
      });
    }

    if (!(games.length > 0)) {
      getGameData();
    }
  }, [stadiums]);

  useEffect(() => {
    if (games && nextGame) {
      let closestGame = nextGame;
      games.forEach((game: Game) => {
        const currentDate = new Date();
        const now = Date.parse(currentDate.toISOString());
        if (game.date && now < game.date) {
          if (closestGame && closestGame.date && closestGame.date < now) {
            closestGame = game;
          }
          if (closestGame && closestGame.date && closestGame.date > game.date) {
            closestGame = game;
          }
        }
      })
      setNextGame(closestGame);
    }
  }, [games])

  return (
    <Stack>
      {value == 0 && <HomePage currentGame={currentGame} nextGame={nextGame} teams={teams} stadiums={stadiums} />}
      {value == 1 && <GroupsPage groups={groups} teams={teams} />}
      {value == 2 && <MatchesPage matches={games} teams={teams} stadiums={stadiums} groups={groupNames} rounds={rounds} />}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <Box sx={{ width: 1 }}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction label="Home" icon={<HomeOutlinedIcon />} />
            <BottomNavigationAction label="Groups" icon={<GroupsOutlinedIcon />} />
            <BottomNavigationAction label="Matches" icon={<SportsOutlinedIcon />} />
          </BottomNavigation>
        </Box>
      </Paper>
    </Stack>
  )
}

export default App
