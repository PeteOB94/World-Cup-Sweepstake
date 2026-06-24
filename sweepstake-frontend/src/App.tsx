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
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { GroupTeam } from './classes/GroupTeam';
import GroupsPage from './pages/GroupsPage';
import HomePage from './pages/HomePage';
import MatchesPage from './pages/MatchesPage';
import { ZoneTimes } from './assets/ZoneTimes';
import axiosRetry from 'axios-retry';
import teamsJson from './assets/teams.json';
import stadiumsJson from './assets/stadiums.json';
import { sortGroup } from './utils/sortGroup';
import WinnersPage from './pages/WinnersPage';

function App() {
  const allTeams: Team[] = teamsJson;
  const allStadiums: Stadium[] = stadiumsJson;
  const [games, setGames] = useState<Game[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [teamList] = useState<Team[]>(allTeams);
  const [nextGames, setNextGames] = useState<Game[]>([]);
  const [currentGames, setCurrentGames] = useState<Game[]>([]);
  const [value, setValue] = useState(0);
  const [groupNames, setGroupNames] = useState<string[]>([]);
  const [allGroupTeams, setAllGroupTeams] = useState<GroupTeam[]>([]);
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
          group = sortGroup(group);
          group.teams.forEach((team: GroupTeam) => {
            team.id = team._id
            allGroupTeams.push(team);
            setAllGroupTeams(allGroupTeams);
          });
        });
        setGroups(sortedGroups);
      })
    }

    if (!(groups.length > 0)) {
      getGroupsData();
    }
  });

  useEffect(() => {
    async function getGameData() {
      setCurrentGames([]);
      setNextGames([]);
      await axios.get('https://worldcup26.ir/get/games').then((response) => {
        response.data.games.forEach((game: Game) => {
          rounds.push(game.type);
          const gameTime = Date.parse(game.local_date);
          const stadium = allStadiums.find((stadium) => stadium.id == game.stadium_id);
          let difference = 0;
          if (stadium) {
            difference = ZoneTimes[stadium.id];
          }
          const gameTimeLocal = gameTime + (difference * 60 * 60 * 1000);
          game.date = gameTimeLocal;
          if (game.time_elapsed.toUpperCase() != "NOTSTARTED" && game.time_elapsed.toUpperCase() != "FINISHED") {
            currentGames.push(game);
            setCurrentGames(currentGames);
          }
        })
        response.data.games.sort((a: Game, b: Game) => (a.date && b.date) ? ((a.date > b.date) ? 1 : (a.date < b.date) ? -1 : 0) : 0);
        setGames(response.data.games);
      });
    }

    if (!(games.length > 0)) {
      getGameData();
    }
  }, []);

  useEffect(() => {
    if (games) {
      let closestGame = games[0];
      games.forEach((game: Game) => {
        if (nextGames.length > 0) {
          closestGame = nextGames[0];
        }
        const currentDate = new Date();
        const now = Date.parse(currentDate.toISOString());
        if (game.date && now < game.date) {
          if (closestGame && closestGame.date && closestGame.date < now) {
            nextGames[0] = game;
          }
          if (closestGame && closestGame.date && closestGame.date >= game.date) {
            if (!nextGames.includes(game)) {
              nextGames.push(game);
            }
          }
          setNextGames(nextGames);
        }
      })
    }
  }, [games, nextGames])

  return (
    <Stack sx={{ height: 1 }}>
      {value == 0 && <HomePage currentGames={currentGames} nextGames={nextGames} teams={teamList} stadiums={allStadiums} />}
      {value == 1 && <GroupsPage groups={groups} teams={teamList} />}
      {value == 2 && <MatchesPage matches={games} teams={teamList} stadiums={allStadiums} groups={groupNames} rounds={rounds} />}
      {value == 3 && <WinnersPage />}
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
            <BottomNavigationAction label="Winners" icon={<EmojiEventsOutlinedIcon />} /> 
          </BottomNavigation>
        </Box>
      </Paper>
    </Stack>
  )
}

export default App
