import type { ChipItem } from '@/shared/components/ChipList'
import type { Company } from '../types/company.types'

/** Chip items per company object: it keeps its identity until the server returns a new one. */
const cache = new WeakMap<Company, ChipItem[]>()

export function companyDomainChips(company: Company): ChipItem[] {
    let chips = cache.get(company)
    if (!chips) {
        chips = company.domains.map((d) => ({ id: d, label: d }))
        cache.set(company, chips)
    }
    return chips
}
