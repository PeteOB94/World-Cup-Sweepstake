import { Box, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DataGridTitle } from "../components/DataGridTitle";
import { Team } from "../classes/Team";
import type { Group } from "../classes/Group";
import { sortGroup } from "../utils/sortGroup";
import WinnersPageColumnConfig from "../columnConfigs/WinnersPageColumnConfig";
import type { Scorer } from "../classes/Scorer";
import TopScorerColumnConfig from "../columnConfigs/TopScorerColumnConfig";

function WinnersPage({ groups, teams, scorers }: { groups: Group; teams: Team[], scorers: Scorer[] }) {
    const sortedGroups = sortGroup(groups);
    sortedGroups.teams.reverse();
    const topScorerColumns = TopScorerColumnConfig(teams);
    const worstTeamColumns = WinnersPageColumnConfig(teams);
    return <Stack>
        <Box>
            <DataGrid
                slots={{
                    toolbar: () => DataGridTitle("Top Scorers", 1)
                }}
                autosizeOnMount
                autosizeOptions={{
                    includeOutliers: true,
                    includeHeaders: true,
                    outliersFactor: 10,
                    expand: true
                }}
                showToolbar
                label='top_scorers_table'
                rows={scorers.slice(0, 5)}
                columns={topScorerColumns}
                disableRowSelectionOnClick
                disableColumnMenu
                hideFooterPagination
                hideFooterSelectedRowCount
                hideFooter
            />
        </Box>
        <Box sx={{ height: 1, width: 1 }}>
            <DataGrid
                slots={{
                    toolbar: () => DataGridTitle("Worst Teams", 0)
                }}
                autosizeOnMount
                autosizeOptions={{
                    includeOutliers: true,
                    includeHeaders: true,
                    outliersFactor: 10,
                    expand: true
                }}
                showToolbar
                label='worst_team_table'
                rows={sortedGroups.teams.slice(0, 4)}
                columns={worstTeamColumns}
                disableRowSelectionOnClick
                disableColumnMenu
                hideFooterPagination
                hideFooterSelectedRowCount
                hideFooter
            />
        </Box>
    </Stack>
}

export default WinnersPage;