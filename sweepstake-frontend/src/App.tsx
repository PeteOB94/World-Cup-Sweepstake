import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import type { Game } from './Classes/Game';
import { Group } from './Classes/Group';
import type { Team } from './Classes/Team';
import type { Stadium } from './Classes/Stadium';
import { Box, Grid, Stack } from '@mui/material';
import assignedTeams from './assets/assigned_teams.json';
import type { GroupTeam } from './Classes/GroupTeam';

const colours = ["#bf2932", "#589043", "#23658e"];
const zoneTimes: Record<string, number> = {
  "1": 7,
  "2": 7,
  "3": 7,
  "4": 6,
  "5": 6,
  "6": 6,
  "7": 5,
  "8": 5,
  "9": 5,
  "10": 5,
  "11": 5,
  "12": 5,
  "13": 8,
  "14": 8,
  "15": 8,
  "16": 8
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [nextGame, setNextGame] = useState<Game>();
  const [currentGame, setCurrentGame] = useState<Game>();

  useEffect(() => {
    async function getGroupsData() {
      await axios.get('https://worldcup26.ir/get/groups').then((response) => {
        const sortedGroups = response.data.groups.sort((a: Group, b: Group) => (a.name && b.name) ? ((a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0) : 0);
        sortedGroups.forEach((group: Group) => {
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
          const gameTime = Date.parse(game.local_date);
          const stadium = stadiums.find((stadium) => stadium.id == game.stadium_id);
          let difference = 0;
          if (stadium) {
            difference = zoneTimes[stadium.id];
          }
          const gameTimeLocal = gameTime + (difference * 60 * 60 * 1000);
          game.date = gameTimeLocal;
          if (game.time_elapsed != "notstarted" && game.time_elapsed != "finished") {
            setCurrentGame(game);
          }
        })
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

  function getTeamById(id: string): Team | undefined {
    if (id) {
      return teams.find((team) => team.id == id);
    }
    else {
      return undefined;
    }
  }

  function getAssignedTeamName(fifaCode?: string): string {
    if (!fifaCode) {
      return '';
    }
    return assignedTeams[fifaCode as keyof typeof assignedTeams] ?? '';
  }

  function shortenTeamName(name: string | undefined): string {
    if (name) {
      if (name.includes('Congo')) {
        return 'DR Congo';
      }
      if (name.includes('Bosnia')) {
        return 'Bosnia & Herzegovina';
      }
      return name;
    }
    else {
      return '';
    }
    return '';
  }

  let coloursIndex = 0;

  return (
    <>
      <Stack spacing={3}>
        {currentGame && <Grid container sx={{ backgroundColor: 'white', color: 'black' }}>
          <Box sx={{ width: '100%' }}>The Current Game Is:</Box>
          <Grid container sx={{ backgroundColor: 'white', color: 'black' }}>
            <Grid size={4}>{currentGame.home_team_name_en} ({getAssignedTeamName(teams.find((team) => team.name_en == currentGame.home_team_name_en)?.fifa_code)})</Grid>
            <Grid size={1}>{currentGame.home_score}</Grid>
            <Grid size={2}>vs</Grid>
            <Grid size={1}>{currentGame.away_score}</Grid>
            <Grid size={4}>{currentGame.away_team_name_en} ({getAssignedTeamName(teams.find((team) => team.name_en == currentGame.away_team_name_en)?.fifa_code)})</Grid>
          </Grid>
          <Grid container sx={{ backgroundColor: 'white', color: 'black' }}>
            <Grid size={4}>{currentGame.home_scorers?.replaceAll("”", "").replaceAll("“", "").replaceAll("{", "").replaceAll("}", "").split(',')}</Grid>
            <Grid size={1}></Grid>
            <Grid size={2}></Grid>
            <Grid size={1}></Grid>
            <Grid size={4}>{currentGame.away_scorers?.replaceAll("”", "").replaceAll("“", "").replaceAll("{", "").replaceAll("}", "").split(',')}</Grid>
          </Grid>
        </Grid>}
        {nextGame &&
          <Grid container sx={{ backgroundColor: 'white', color: 'black' }}>
            <Box sx={{ width: '100%' }}>The Next Game Is:</Box>
            <Box sx={{ width: '100%' }}>{nextGame?.home_team_name_en} ({getAssignedTeamName(teams.find((team) => team.name_en == nextGame?.home_team_name_en)?.fifa_code)}) vs {nextGame?.away_team_name_en} ({getAssignedTeamName(teams.find((team) => team.name_en == nextGame?.away_team_name_en)?.fifa_code)})</Box>
            <Box sx={{ width: '100%' }}>{nextGame.date ? new Date(nextGame.date).toLocaleString() : ''}</Box>
          </Grid>
        }
        <Grid container spacing={2}>
          {groups.map(group => {
            coloursIndex = (coloursIndex + 1) % 3;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box style={{ border: '1px solid white' }} sx={{ fontWeight: 'heavy', backgroundColor: `${colours[coloursIndex]}`, color: 'black' }}>
                  Group {group.name}
                </Box>
                <Grid container>
                  <Grid size={8} style={{ border: '1px solid white' }} sx={{ fontSize: 'default' }}></Grid>
                  <Grid size={2} style={{ border: '1px solid white' }} sx={{ fontSize: 'default' }}>PTS</Grid>
                  <Grid size={2} style={{ border: '1px solid white' }} sx={{ fontSize: 'default' }}>GD</Grid>
                </Grid>
                <Stack spacing={0}>
                  {group.teams?.map(team => {
                    const currentTeam = getTeamById(team.team_id);
                    if (currentTeam != undefined && currentTeam.fifa_code != undefined) {
                      return (<Grid container sx={{ height: '100%' }}>
                        <Grid size={8} style={{ border: '1px solid white' }} sx={{ fontSize: 'default' }}>
                          <Grid container sx={{ height: '100%' }}>
                            <Grid size={1} sx={{ height: '100%' }}><Box component='img' src={currentTeam.flag} sx={{ height: '2rem', width: '3rem' }} /></Grid>
                            <Grid size={11} sx={{ alignContent: 'center' }}>{shortenTeamName(getTeamById(team.team_id)?.name_en)} ({getAssignedTeamName(currentTeam.fifa_code)})</Grid>
                          </Grid>
                        </Grid>
                        <Grid size={2} style={{ border: '1px solid white' }} sx={{ fontSize: 'default', alignContent: 'center' }}>{team.pts}</Grid>
                        <Grid size={2} style={{ border: '1px solid white' }} sx={{ fontSize: 'default', alignContent: 'center' }}>{team.gd}</Grid>
                      </Grid>)
                    }
                  })}
                </Stack>
                <Stack spacing={0} sx={{ marginTop: '0.5rem' }}>
                  {games.map((game: Game) => {
                    if (game.group == group.name) {
                      return (
                        <Stack spacing={0}>
                          <Grid container sx={{ fontSize: 'small', height: '100%', border: '1px solid white' }}>
                            <Grid size={12} sx={{
                              marginLeft: '0.5rem',
                              display: 'inline',
                              textAlign: 'left',
                              overflow: 'auto',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {shortenTeamName(getTeamById(game.home_team_id)?.name_en)} ({getAssignedTeamName(getTeamById(game.home_team_id)?.fifa_code)}) vs {shortenTeamName(getTeamById(game.away_team_id)?.name_en)} ({getAssignedTeamName(getTeamById(game.away_team_id)?.fifa_code)})</Grid>
                          </Grid>
                          <Grid container>
                            <Grid size={8}> <Box sx={{ fontSize: 'small', fontStyle: 'italic', color: '#23658e', textAlign: 'left' }}>{game.date ? new Date(game.date).toLocaleString() : ''}</Box></Grid>
                            <Grid size={2} sx={{ borderLeft: '1px solid #589043', borderRight: '1px solid #589043' }}>{game.home_score}</Grid>
                            <Grid size={2} sx={{ borderLeft: '1px solid #589043', borderRight: '1px solid #589043' }}>{game.away_score}</Grid>
                          </Grid>
                        </Stack>
                      );
                    }
                  })}
                </Stack>
              </Grid>
            )
          })}
        </Grid>
      </Stack>
    </>
  )
}

export default App
