import AssignedTeams from "../assets/AssignedTeams";


export const getPeopleList = (): string[] => {
    const people: string[] = [];
    AssignedTeams.forEach((person: string) => (!people.includes(person) ? people.push(person) : ''));
    return people;
}