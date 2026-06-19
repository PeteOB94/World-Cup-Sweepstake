import AssignedTeams from '../assets/AssignedTeams';

export const getTeamsByPerson = (person: string): string[] => {
    const keysList = Object.keys(AssignedTeams);
    const teams: string[] = [];
    keysList.forEach((key: string) => AssignedTeams.get(key) == person ? teams.push(key) : '');
    return teams;
}