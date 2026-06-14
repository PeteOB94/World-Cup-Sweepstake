import assignedTeams from '../assets/assigned_teams.json';

export const getPeopleList = (): string[] => {
    const keysList = Object.keys(assignedTeams);
    const people: string[] = [];
    keysList.forEach((key: string) => !people.includes(assignedTeams[key]) ? people.push(assignedTeams[key]) : '');
    return people;
}