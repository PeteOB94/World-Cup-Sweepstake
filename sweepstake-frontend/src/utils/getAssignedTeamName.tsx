import assignedTeams from '../assets/assigned_teams.json';

export const getAssignedTeamName = (fifaCode?: string): string => {
    if (!fifaCode) {
        return '';
    }
    return assignedTeams[fifaCode as keyof typeof assignedTeams] ?? '';
}