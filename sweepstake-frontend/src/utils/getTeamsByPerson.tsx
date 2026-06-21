import AssignedTeams from '../assets/AssignedTeams';

export const getTeamsByPerson = (person: string): string[] => {
    const teams: string[] = [];
    AssignedTeams.forEach((value: string, key: string) => AssignedTeams.get(key) == person ? teams.push(key) : '');
    return teams;
}