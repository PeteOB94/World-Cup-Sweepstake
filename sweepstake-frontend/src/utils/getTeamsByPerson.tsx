import assignedTeams from '../assets/assigned_teams.json';

export const getTeamsByPerson = (person: string): string[] => {
    const keysList = Object.keys(assignedTeams);
    const teams: string[] = [];
    keysList.forEach((key: string) => assignedTeams[key] == person ? teams.push(key) : '');
    return teams;
}