import { Group } from '../classes/Group'
import type { GroupTeam } from '../classes/GroupTeam';

export const sortGroup = (group: Group) => {
    const teamsCopy = group.teams.slice();
    teamsCopy.sort((a: GroupTeam, b: GroupTeam) => {
        const aPts = parseInt(a.pts);
        const bPts = parseInt(b.pts);
        if (aPts > bPts) {
            return -1;
        }
        if (aPts < bPts) {
            return 1;
        }
        if (aPts == bPts) {
            const aGd = parseInt(a.gd);
            const bGd = parseInt(b.gd);
            if (aGd > bGd) {
            return -1
            }
            if (aGd < bGd) {
            return 1;
            }
            if (aGd == bGd) {
            const aGf = parseInt(a.gf);
            const bGf = parseInt(b.gf);
            if (aGf > bGf) {
                return -1;
            }
            if (aGf < bGf) {
                return 1;
            }
            }
        }
        return 0;
    });
    group.teams = teamsCopy;
    return group;
}