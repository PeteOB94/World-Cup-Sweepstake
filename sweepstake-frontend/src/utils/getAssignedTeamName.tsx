import AssignedTeams from '../assets/AssignedTeams';

export const getAssignedTeamName = (fifaCode?: string): string => {
    if (!fifaCode) {
        return '';
    }
    return AssignedTeams.get(fifaCode) ?? '';
}