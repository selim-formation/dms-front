import type { ManagedUser } from '../types/user.types'
import type { ChipItem } from './UserChipList'

/**
 * Chip lists derived from a user. Each user object keeps its identity until the
 * server returns a new one, so memoising per object keeps memoised rows stable.
 */
const cache = new WeakMap<ManagedUser, { roles: ChipItem[]; departments: ChipItem[]; sections: ChipItem[] }>()

export function userChips(user: ManagedUser) {
    let chips = cache.get(user)
    if (!chips) {
        chips = {
            roles: user.roles.map((r) => ({ id: r.id, label: r.name })),
            departments: user.departments.map((d) => ({ id: d.id, label: d.title })),
            sections: user.sections.map((s) => ({ id: s.id, label: s.name })),
        }
        cache.set(user, chips)
    }
    return chips
}
