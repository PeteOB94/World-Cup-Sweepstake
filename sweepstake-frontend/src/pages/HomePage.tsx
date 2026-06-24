import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import type { Game } from "../classes/Game";
import GameCard from "../components/GameCard";
import { Team } from "../classes/Team";
import type { Stadium } from "../classes/Stadium";
import { getAssignedTeamName } from "../utils/getAssignedTeamName";

function HomePage({ nextGames, currentGames, teams, stadiums }: { nextGames: Game[]; currentGames: Game[]; teams: Team[]; stadiums: Stadium[] }) {
    return (
        <Stack sx={{ width: '100%', paddingBottom: 2, paddingTop: 2, paddingLeft: 2, paddingRight: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Grid container spacing={2}>
                <Grid size={12} sx={{ textAlign: 'center' }}>
                    <Typography gutterBottom sx={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(45deg, #bf2932 30%, #23658e 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        PJ's World Cup Sweepstake 2026!
                    </Typography>
                </Grid>
            </Grid>
            {(nextGames.length > 0 || currentGames.length > 0) && teams ? (
                <Stack sx={{ width: '100%', paddingBottom: 2, paddingTop: 2, paddingLeft: 2, paddingRight: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Grid container spacing={2} sx={{ width: '100%', paddingBottom: 2, paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}>
                        <Grid size={{ xs: 0, sm: 0, md: 2 }}></Grid>
                        {currentGames.length > 0 && teams &&
                            currentGames.map((currentGame) => {
                                const currentHomeTeam = teams.find((team) => team.id == currentGame.home_team_id);
                                const currentAwayTeam = teams.find((team) => team.id == currentGame.away_team_id);
                                const currentAssignedTeamNameHome = getAssignedTeamName(currentHomeTeam?.fifa_code);
                                const currentAssignedTeamNameAway = getAssignedTeamName(currentAwayTeam?.fifa_code);
                                return <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                    <Box sx={{ width: '100%', paddingBottom: 2, paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}>
                                        <Typography variant="h5" gutterBottom>Current Game</Typography>
                                        <GameCard
                                            game={currentGame}
                                            homeTeamName={currentHomeTeam?.name_en ?? ''}
                                            homeTeamFlag={currentHomeTeam?.flag ?? ''}
                                            homeTeamAssignee={currentAssignedTeamNameHome}
                                            awayTeamFlag={currentAwayTeam?.flag ?? ''}
                                            awayTeamAssignee={currentAssignedTeamNameAway}
                                            stadiumName={stadiums.find((stadium) => stadium.id == currentGame.stadium_id)?.name_en ?? ''}
                                            awayTeamName={currentAwayTeam?.name_en ?? ''}
                                            homeTeamScorers={currentGame.home_scorers.split(',')}
                                            awayTeamScorers={currentGame.away_scorers.split(',')}
                                        />
                                    </Box>
                                </Grid>
                            })
                        }
                        <Grid size={{ xs: 0, sm: 0, md: 2 }}></Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ width: '100%', paddingBottom: 2, paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}>
                        <Grid size={{ xs: 0, sm: 0, md: 2 }}></Grid>
                        {nextGames.length > 0 && teams &&
                            nextGames.map((nextGame) => {
                                const nextHomeTeam = teams.find((team) => team.id == nextGame.home_team_id);
                                const nextAwayTeam = teams.find((team) => team.id == nextGame.away_team_id);
                                const nextAssignedTeamNameHome = getAssignedTeamName(nextHomeTeam?.fifa_code);
                                const nextAssignedTeamNameAway = getAssignedTeamName(nextAwayTeam?.fifa_code);
                                return <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                    <Box sx={{ width: '100%', paddingBottom: 2, paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}>
                                        <Typography variant="h5" gutterBottom>Next Game</Typography>
                                        <GameCard
                                            game={nextGame}
                                            homeTeamName={nextHomeTeam?.name_en ?? ''}
                                            homeTeamFlag={nextHomeTeam?.flag ?? ''}
                                            homeTeamAssignee={nextAssignedTeamNameHome}
                                            awayTeamFlag={nextAwayTeam?.flag ?? ''}
                                            awayTeamAssignee={nextAssignedTeamNameAway}
                                            stadiumName={stadiums.find((stadium) => stadium.id == nextGame.stadium_id)?.name_en ?? ''}
                                            awayTeamName={nextAwayTeam?.name_en ?? ''}
                                            homeTeamScorers={nextGame.home_scorers.split(',')}
                                            awayTeamScorers={nextGame.away_scorers.split(',')}
                                        />
                                    </Box>
                                </Grid>
                            })
                        }
                        <Grid size={{ xs: 0, sm: 0, md: 2 }}></Grid>
                    </Grid>
                </Stack>
            ) : (<CircularProgress aria-label="Loading…" />)}
        </Stack>
    )
}

export default HomePage;