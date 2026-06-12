import type { GroupTeam } from "./GroupTeam";

export class Group {
    _id!: string;
    createdAt!: string;
    name!: string;
    teams!: GroupTeam[];
}