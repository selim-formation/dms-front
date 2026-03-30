/**
 * RemindersDrawer Component Usage
 * 
 * Simple integration example showing how to use the RemindersDrawer component
 */

import { RemindersDrawer } from '@/features/documents';

/**
 * Example: Adding to Header/Navigation
 * 
 * Place this in your header, navbar, or any layout component:
 */
export function HeaderExample() {
    return (
        <header className="flex items-center justify-between p-4">
            <h1>Dashboard</h1>

            <div className="flex items-center gap-4">
                {/* Other header items */}

                {/* Reminders Drawer Button */}
                <RemindersDrawer />
            </div>
        </header>
    );
}

/**
 * Example: Complete Integration
 * 
 * If you want to customize the button appearance:
 */
export function CustomRemindersExample() {
    return (
        <div className="flex gap-2">
            <RemindersDrawer className="custom-class" />
        </div>
    );
}

/**
 * Features:
 * 
 * 1. Auto-fetched Data
 *    - All Reminders: GET /api/{tenant}/documents/reminder
 *    - Active Reminders: GET /api/{tenant}/documents/active-reminders
 *    - Notifications: GET /api/{tenant}/notifications
 * 
 * 2. Tabs
 *    - Active: Shows active reminders with unread badge
 *    - All Reminders: Shows all reminders
 *    - Notifications: Shows all notifications
 * 
 * 3. Performance Optimizations
 *    - TanStack Query caching: 1-2 minute stale times
 *    - React.memo for components
 *    - useMemo for computed values
 *    - Proper loading, error, and empty states
 * 
 * 4. Design
 *    - Modern card-based UI
 *    - Right-positioned drawer
 *    - Importance/priority badges with color coding
 *    - Category indicators
 *    - Uploaded by user info
 *    - Smooth transitions and hover effects
 * 
 * 5. Accessibility
 *    - Proper ARIA labels
 *    - Keyboard navigation support
 *    - Semantic HTML structure
 */
