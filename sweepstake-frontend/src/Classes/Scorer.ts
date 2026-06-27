import type { Team } from "./Team";

export class Scorer {
    id!: string;
    name!: string;
    goalCount!: number;
    team!: Team;
}