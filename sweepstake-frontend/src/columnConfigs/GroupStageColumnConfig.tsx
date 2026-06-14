import type { GridColDef } from "@mui/x-data-grid";
import type { Team } from "../classes/Team";
import Grid from "@mui/material/Grid";
import { getAssignedTeamName } from "../utils/getAssignedTeamName";


const GroupStageColumnConfig = (teams: Team[]): GridColDef[] => [
    {
        field: 'flag',
        headerName: '',
        width: 60,
        editable: false,
        resizable: false,
        sortable: false,
        renderCell: (params) => {
            const team = teams.find((team) => team.id == params.row.team_id); 
            return team ? 
                <Grid container sx={{ width: 1, height: 1, justifyContent: "center", alignItems: "center" }}>
                    <img src={team.flag} alt={team.name_en} style={{ width: '3.125rem', height: '1.875rem' }} />
                </Grid> 
            : <></> ;
        }
    },
    {
        field: 'team_id', 
        headerName: '', 
        width: 200, 
        editable: false,
        resizable: false,
        sortable: false,
        valueGetter: (value) => {
            const team = teams.find((team) => team.id == value);
            const assignedTeamName = getAssignedTeamName(team?.fifa_code);
            return { team: team?.name_en, assignedTeamName };
        },
        renderCell: (params) => {
            return (<span>{params.value.team} <i>({params.value.assignedTeamName})</i></span>);
        }
    },
    {
        field: 'pts', 
        headerName: 'Pts', 
        width: 50, 
        editable: false,
        resizable: false,
        sortable: false,
    },
    {
        field: 'gd', 
        headerName: 'GD', 
        width: 50, 
        editable: false,
        resizable: false,
        sortable: false,
    }
];

export default GroupStageColumnConfig;