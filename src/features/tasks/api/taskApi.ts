/**
 * Task API Functions
 * 
 * Handles API calls for tasks with mock data and simulated delays
 */

import { getMockTasks } from './mockData'
import { filterTasks } from '../utils/taskFilters'
import type { Task, TaskFilters } from '../types/task.types'
import { DEFAULT_FILTERS } from '../types/task.types'

/**
 * Simulate network delay
 */
function simulateNetworkDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch tasks with optional filters
 * 
 * Simulates API call with 800ms delay for realism
 * Client-side filtering is applied to mock data
 */
export async function getTasks(filters: TaskFilters = DEFAULT_FILTERS): Promise<Task[]> {
    // Simulate network latency
    await simulateNetworkDelay(800)

    // Get mock data
    const allTasks = getMockTasks()

    // Apply filters client-side
    return filterTasks(allTasks, filters)
}

/**
 * Fetch a single task by ID
 */
export async function getTaskById(id: number): Promise<Task | null> {
    await simulateNetworkDelay(400)

    const tasks = getMockTasks()
    return tasks.find((task) => task.id === id) || null
}
