import type { GridColDef } from "@mui/x-data-grid";
import type { Team } from "../classes/Team";
import Grid from "@mui/material/Grid";
import { getAssignedTeamName } from "../utils/getAssignedTeamName";

const TopScorerColumnConfig = (teams: Team[]): GridColDef[] => [
    {
        field: 'flag',
        headerName: '',
        editable: false,
        resizable: false,
        sortable: false,
        renderCell: (params) => {
            const team = teams.find((team) => team.id == params.row.team.id); 
            return team ? 
                <Grid container sx={{ width: 1, height: 1, justifyContent: "center", alignItems: "center" }}>
                    <img src={team.flag} alt={team.name_en} style={{ width: '3.125rem', height: '1.875rem' }} />
                </Grid> 
            : <></> ;
        }
    },
    {
        field: 'team_id', 
        headerName: 'Team',
        editable: false,
        resizable: false,
        sortable: false,
        renderCell: (params) => {
            const team = teams.find((team) => team.id == params.row.team.id);
            const assignedTeamName = getAssignedTeamName(team?.fifa_code);
            return (<span>{team?.name_en} <i>({assignedTeamName})</i></span>);
        }
    },
    {
        field: 'name', 
        headerName: 'Name',
        editable: false,
        resizable: false,
        sortable: false,
    },
    {
        field: 'goalCount', 
        headerName: 'Goals',
        editable: false,
        resizable: false,
        sortable: false,
    }
];

export default TopScorerColumnConfig;