import { Box, CircularProgress, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DataGridTitle } from "../components/DataGridTitle";
import GroupStageColumnConfig from "../columnConfigs/GroupStageColumnConfig";
import type { Group } from "../classes/Group";
import type { Team } from "../classes/Team";

function GroupsPage({ groups, teams }: { groups: Group[]; teams: Team[] }) {
    const columns = GroupStageColumnConfig(teams);
    let count = 0;
    
    return (
        (groups.length > 0 && teams.length > 0 ? (
        <Grid container spacing={2} sx={{paddingBottom: 10, paddingTop: 2, paddingLeft: 2, paddingRight: 2}}>
          {groups.map((group: Group) => <Grid size={{ xs: 12, sm: 6, md: 3 }} key={group.name}>
            <Box sx={{ height: 1, width: 1 }}>
              <DataGrid
                slots={{
                  toolbar: () => DataGridTitle("Group " + group.name, count++)
                }}
                showToolbar
                label={group.name}
                rows={group.teams}
                columns={columns}
                disableRowSelectionOnClick
                disableColumnMenu
                hideFooterPagination
                hideFooterSelectedRowCount
                hideFooter
              />
            </Box>
          </Grid>)}
        </Grid>
      ) : (<CircularProgress aria-label="Loading…" />))
    )
}

export default GroupsPage;