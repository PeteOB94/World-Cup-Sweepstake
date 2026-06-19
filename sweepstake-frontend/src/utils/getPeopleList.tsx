import AssignedTeams from "../assets/AssignedTeams";


export const getPeopleList = (): string[] => {
    const keysList = Object.keys(AssignedTeams);
    const people: string[] = [];
    keysList.forEach((key: string) => AssignedTeams.get(key) ? (!people.includes(AssignedTeams.get(key)) ? people.push(AssignedTeams.get(key)) : '') : '');
    return people;
}