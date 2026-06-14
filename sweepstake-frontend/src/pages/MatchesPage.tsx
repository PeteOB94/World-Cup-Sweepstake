import { useEffect, useState } from "react";
import type { Game } from "../classes/Game";
import type { Stadium } from "../classes/Stadium";
import type { Team } from "../classes/Team";
import Grid from "@mui/material/Grid";
import GameCard from "../components/GameCard";
import { getAssignedTeamName } from "../utils/getAssignedTeamName";
import { Accordion, AccordionDetails, AccordionSummary, Chip, Stack, Typography } from "@mui/material";
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import { getPeopleList } from "../utils/getPeopleList";
import { getTeamsByPerson } from "../utils/getTeamsByPerson";

function MatchesPage({ matches, teams, stadiums, groups, rounds }: { matches: Game[]; teams: Team[]; stadiums: Stadium[], groups: string[], rounds: string[] }) {
    const [filterOnGroup, setFilterOnGroup] = useState<string>('');
    const [filterOnPersonName, setFilterOnPersonName] = useState<string>('');
    const [filteredMatches, setFilteredMatches] = useState<Game[]>(matches);
    const [selectedChip, setSelectedChip] = useState<string>('');
    const [selectedChipGroup, setSelectedChipGroup] = useState<boolean>(false);
    const people: string[] = getPeopleList();

    const colours = ["#bf2932", "#589043", "#23658e"];
    let colourIndex = 0

    useEffect(() => {
        if (filterOnGroup) {
            setFilteredMatches(matches.filter((game: Game) => game.group == filterOnGroup));
        }
        else {
            setFilteredMatches(matches);
        }
    }, [filterOnGroup])

    useEffect(() => {
        if (filterOnPersonName) {
            setFilteredMatches(matches.filter((game: Game) => {
                const teamsByPerson = getTeamsByPerson(filterOnPersonName);
                const homeTeam = teams.find((team: Team) => team.id == game.home_team_id);
                const awayTeam = teams.find((team: Team) => team.id == game.away_team_id);
                if (homeTeam) {
                    if (teamsByPerson.includes(homeTeam.fifa_code)) {
                        return true;
                    }
                }
                if (awayTeam) {
                    if (teamsByPerson.includes(awayTeam.fifa_code)) {
                        return true;
                    }
                }
                return false;
            }));
        }
        else {
            setFilteredMatches(matches);
        }
    }, [filterOnPersonName])

    function clickGroupChip(groupName: string) {
        setFilterOnGroup(groupName);
        setSelectedChip(groupName);
        setSelectedChipGroup(true);
    }

    function clickPeopleChip(personName: string) {
        setFilterOnPersonName(personName);
        setSelectedChip(personName);
        setSelectedChipGroup(false);
    }

    function deleteFilter() {
        setFilteredMatches(matches);
        setSelectedChip('');
        setSelectedChipGroup(false);
    }

    return (
        <Stack sx={{ padding: 2 }}>
            <Stack spacing={2}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography component="span">Groups</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={1} sx={{ justifyContent: 'center', alignItems: 'center ' }}>
                            {groups.map((groupName: string) => {
                                colourIndex++;
                                return <Chip
                                    clickable={true}
                                    label={`Group ${groupName}`}
                                    onClick={() => clickGroupChip(groupName)}
                                    sx={{ border: `1px solid ${colours[colourIndex % 3]}`}}
                                />
                            })}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography component="span">People</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={1} sx={{ justifyContent: 'center', alignItems: 'center ' }}>
                            {people.map((personName: string) => {
                                colourIndex++;
                                return <Chip
                                    clickable={true}
                                    label={personName}
                                    onClick={() => clickPeopleChip(personName)}
                                    sx={{ border: `1px solid ${colours[colourIndex % 3]}`}}
                                />
                            })}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                {selectedChip && (<Chip label={selectedChipGroup ? `Group ${selectedChip}` : `${selectedChip}`} onDelete={deleteFilter}/>)}
            </Stack>
            <Grid container spacing={2} sx={{ paddingBottom: 2, paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}>
                {filteredMatches.map((match: Game) => {
                    const homeTeam = teams.find((team) => team.id == match.home_team_id);
                    const awayTeam = teams.find((team) => team.id == match.away_team_id);
                    const stadium = stadiums.find((stadium) => stadium.id == match.stadium_id);
                    return <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}><GameCard
                        key={match.id}
                        game={match}
                        homeTeamName={homeTeam?.name_en ?? ''}
                        homeTeamFlag={homeTeam?.flag ?? ''}
                        homeTeamAssignee={getAssignedTeamName(homeTeam?.fifa_code)}
                        awayTeamName={awayTeam?.name_en ?? ''}
                        awayTeamFlag={awayTeam?.flag ?? ''}
                        awayTeamAssignee={getAssignedTeamName(awayTeam?.fifa_code)}
                        stadiumName={stadium?.name_en ?? ''}
                        homeTeamScorers={match.home_scorers.split(',')}
                        awayTeamScorers={match.away_scorers.split(',')}
                    />
                    </Grid>
                })}
            </Grid>
        </Stack>
    )
}

export default MatchesPage;