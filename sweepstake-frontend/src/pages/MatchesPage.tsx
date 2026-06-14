import { useEffect, useState } from "react";
import type { Game } from "../classes/Game";
import type { Stadium } from "../classes/Stadium";
import type { Team } from "../classes/Team";
import Grid from "@mui/material/Grid";
import GameCard from "../components/GameCard";
import { getAssignedTeamName } from "../utils/getAssignedTeamName";
import { Chip, Stack } from "@mui/material";
import { getPeopleList } from "../utils/getPeopleList";
import { getTeamsByPerson } from "../utils/getTeamsByPerson";

function MatchesPage({ matches, teams, stadiums, groups, rounds }: { matches: Game[]; teams: Team[]; stadiums: Stadium[], groups: string[], rounds: string[] }) {
    const [filterOnGroup, setFilterOnGroup] = useState<string>('');
    const [filterOnPersonName, setFilterOnPersonName] = useState<string>('');
    const [filteredMatches, setFilteredMatches] = useState<Game[]>(matches);
    const people: string[] = getPeopleList();

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
    }

    function clickPeopleChip(personName: string) {
        setFilterOnPersonName(personName);
    }

    return (
        <Stack sx={{ padding: 2 }}>
            <Grid container spacing={1} sx={{ justifyContent: 'center', alignItems: 'center ' }}>
                <Chip label="All Matches" onClick={() => clickGroupChip('')} />
                {groups.map((groupName: string) => {
                    return <Chip label={`Group ${groupName}`} onClick={() => clickGroupChip(groupName)} />
                })}
                {people.map((personName: string) => {
                    return <Chip label={personName} onClick={() => clickPeopleChip(personName)} />
                })}
            </Grid>
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