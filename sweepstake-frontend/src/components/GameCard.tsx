import { Box, Card, CardContent, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import type { Game } from "../classes/Game";

function GameCard({
    game, 
    homeTeamName, 
    homeTeamFlag, 
    homeTeamAssignee, 
    awayTeamName, 
    awayTeamFlag, 
    awayTeamAssignee, 
    stadiumName, 
    homeTeamScorers, 
    awayTeamScorers }: { 
        game: Game; 
        homeTeamName: string; 
        homeTeamFlag: string; 
        homeTeamAssignee: string; 
        awayTeamName: string; 
        awayTeamFlag: string; 
        awayTeamAssignee: string; 
        stadiumName: string;
        homeTeamScorers: string[];
        awayTeamScorers: string[];
     }) {

    return (
        <Box>
            <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                    <Stack spacing={1}>
                        <Grid container spacing={2} sx={{ paddingBottom: 4 }}>
                            <Grid size={6} sx={{ textAlign: 'center' }}><Chip label={`Group ${game.group}`} /></Grid>
                            <Grid size={6} sx={{ textAlign: 'center' }}>Matchday {game.matchday}</Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid size={5} sx={{ textAlign: 'center' }}>
                                <img src={homeTeamFlag} alt={homeTeamName} style={{ width: '3.125rem', height: '1.875rem' }} />
                                <Typography variant="body2">{homeTeamName}</Typography>
                            </Grid>
                            <Grid size={2} sx={{ textAlign: 'center' }}>
                                <Typography variant="body2">vs</Typography>
                            </Grid>
                            <Grid size={5} sx={{ textAlign: 'center' }}>
                                <img src={awayTeamFlag} alt={awayTeamName} style={{ width: '3.125rem', height: '1.875rem' }} />
                                <Typography variant="body2">{awayTeamName}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid size={5} sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" noWrap={true}><i>({homeTeamAssignee})</i></Typography>
                            </Grid>
                            <Grid size={2} sx={{ textAlign: 'center' }}>
                                <Typography variant="body2"></Typography>
                            </Grid>
                            <Grid size={5} sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" noWrap={true}><i>({awayTeamAssignee})</i></Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid size={4}></Grid>
                            <Grid size={4} sx={{ textAlign: 'center' }}>
                                <Grid container spacing={2}>
                                    <Grid size={4} sx={{ textAlign: 'center' }}>
                                        <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(45deg, #bf2932 30%, #23658e 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} noWrap={true}>{game.home_score == 'null' ? 0 : game.home_score}</Typography>
                                    </Grid>
                                    <Grid size={4} sx={{ textAlign: 'center', display: 'inline', alignContent: 'center' }}>
                                        <Typography variant="body2" sx={{ textAlign: 'center' }}>-</Typography>
                                    </Grid>
                                    <Grid size={4} sx={{ textAlign: 'center' }}>
                                        <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(45deg, #bf2932 30%, #23658e 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} noWrap={true}>{game.away_score == 'null' ? 0 : game.away_score}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={4}></Grid>
                        </Grid>
                        <Divider sx={{ paddingBottom: 2 }} />
                        <Grid container spacing={2}>
                            <Grid size={5} sx={{ textAlign: 'center' }}>
                                {homeTeamScorers.map((scorer: string) => {
                                    if(scorer.replace(/[^\p{L}\d .']/gu, '') != 'null') {
                                        return <Typography sx={{ fontSize: '0.75rem'}}><i>{scorer.replace(/[^\p{L}\d .'+]/gu, '')}</i></Typography>
                                    }
                                })}
                            </Grid>
                            <Grid size={2} sx={{ textAlign: 'center' }}>
                                <Typography variant="body2"></Typography>
                            </Grid>
                            <Grid size={5} sx={{ textAlign: 'center' }}>
                                {awayTeamScorers.map((scorer: string) => {
                                    if(scorer.replace(/[^\p{L}\d .']/gu, '') != 'null') {
                                        return <Typography sx={{ fontSize: '0.75rem'}}><i>{scorer.replace(/[^\p{L}\d .'+]/gu, '')}</i></Typography>
                                    }
                                })}
                            </Grid>
                        </Grid>
                        <Divider sx={{ paddingBottom: 2 }} />
                        <Grid container spacing={2}>
                            {game.date ? (<Grid size={6} sx={{ textAlign: 'center' }}>{new Date(game.date).toLocaleString()}</Grid>) : <Grid size={6} sx={{ textAlign: 'center' }}>TBD</Grid>}
                            <Grid size={6} sx={{ textAlign: 'center' }}>{stadiumName}</Grid>
                        </Grid>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    )
}

export default GameCard;