# Documents Page - Visual Overview

## Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              NAVBAR                                      │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  Documents                                                   [+ Upload]  │
│  Browse and manage your business documents                              │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  🔍 Search documents...                                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  All | Types | Departments  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                                                         │
│  ┌──────────────────────────────────────────────┐   ┌────────────────┐│
│  │ MAIN CONTENT AREA                            │   │ FILTER SIDEBAR ││
│  │                                              │   │                ││
│  │ [View Mode 1: All Documents]                │   │ Type           ││
│  │ Shows all documents without slider tabs     │   │ □ Licenses     ││
│  │                                              │   │ □ Permits      ││
│  │ Grid of DocumentCardGrid components         │   │ □ Authorizat.  ││
│  │ Responsive: 3-4 cards per row              │   │ □ Cards        ││
│  │                                              │   │ □ Approvals    ││
│  │                                              │   │ □ Equipment    ││
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐     │   │                ││
│  │ │ Document │ │ Document │ │ Document │     │   │ Department     ││
│  │ │  Card 1  │ │  Card 2  │ │  Card 3  │     │   │ □ HR           ││
│  │ └──────────┘ └──────────┘ └──────────┘     │   │ □ Legal        ││
│  │                                              │   │ □ Engineering  ││
│  │                                              │   │ □ Finance      ││
│  │                                              │   │ □ Operations   ││
│  │                                              │   │                ││
│  │                                              │   │ Entity         ││
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐     │   │ ☑ Operational ││
│  │ │ Document │ │ Document │ │ Document │     │   │ □ Establishment││
│  │ │  Card 4  │ │  Card 5  │ │  Card 6  │     │   │                ││
│  │ └──────────┘ └──────────┘ └──────────┘     │   │ Renewal        ││
│  │                                              │   │ □ One-Time     ││
│  │                                              │   │ ☑ Renewable    ││
│  │                                              │   │                ││
│  │                                              │   │ Importance     ││
│  │ [View Mode 2: By Type]                      │   │ □ Critical     ││
│  │ Shows type slider tabs at top               │   │ □ High         ││
│  │                                              │   │ □ Medium       ││
│  │ ┌─────────────────────────────────────────┐ │   │                ││
│  │ │ < Licenses(3) Permits(2) Authori...(2) > │ │   │ [Clear Filters]││
│  │ └─────────────────────────────────────────┘ │   └────────────────┘│
│  │                                              │                     │
│  │ Showing 3 documents                         │                     │
│  │                                             │                     │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐    │                     │
│  │ │ License  │ │ License  │ │ License  │    │                     │
│  │ │  Card 1  │ │  Card 2  │ │  Card 3  │    │                     │
│  │ └──────────┘ └──────────┘ └──────────┘    │                     │
│  │                                             │                     │
│  │ [View Mode 3: By Department]               │                     │
│  │ Shows department slider tabs               │                     │
│  │                                             │                     │
│  │ ┌─────────────────────────────────────────┐│                     │
│  │ │ < HR(4) Legal(3) Engineering(2) ... > ││                     │
│  │ └─────────────────────────────────────────┘│                     │
│  │                                             │                     │
│  │ Showing 4 documents (HR department)        │                     │
│  │                                             │                     │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐    │                     │
│  │ │  HR Docs │ │  HR Docs │ │  HR Docs │    │                     │
│  │ │  Card 1  │ │  Card 2  │ │  Card 3  │    │                     │
│  │ └──────────┘ └──────────┘ └──────────┘    │                     │
│  │                                             │                     │
│  └──────────────────────────────────────────┘   └────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

## Document Card Layout

```
┌────────────────────────┐
│                        │
│       📋 (Icon)        │  ← Document Type Icon
│                        │
├────────────────────────┤
│ Business Operating ... │  ← Document Name
│                        │
│ [HR]  [Operational]    │  ← Department & Entity Labels
│                        │
│ [Renewable] [Critical] │  ← Renewal & Importance Badges
│                        │
├────────────────────────┤
│ Expiry:   Mar 15, 2026 │  ← Expiry Date
│ Status:   [Expires]    │  ← Status Badge
│                        │
│ [  View  ] [Download]  │  ← Action Buttons
└────────────────────────┘

Color Coding:
- Importance Badges:
  🔴 Critical → Red (bg-red-100, text-red-700)
  🟠 High    → Orange (bg-orange-100, text-orange-700)
  🔵 Medium  → Blue (bg-blue-100, text-blue-700)

- Renewal Badges:
  🟣 Renewable → Purple (bg-purple-100, text-purple-700)
  ⚫ One-Time → Gray (bg-gray-100, text-gray-700)
```

## Dynamic Slider Tabs

### When View = "Types" (By Type)

```
┌──────────────────────────────────────────────────────────────┐
│ Document Types                                               │
│                                                              │
│ < [Licenses(3)] [Permits(2)] [Authorizations(2)] [Cards(1)] >│
│   [Approvals(2)] [Equipment(1)]                             │
│                                                              │
│ Active Tab styling:        ┌──────────┐                     │
│                            │ Licenses │  (filled blue)      │
│                            │   (3)    │                     │
│                            └──────────┘                     │
│                                                              │
│ Inactive Tab styling:      ┌────────────┐                   │
│                            │ Permits    │  (outline border) │
│                            │   (2)      │                   │
│                            └────────────┘                   │
└──────────────────────────────────────────────────────────────┘
```

### When View = "Departments" (By Department)

```
┌──────────────────────────────────────────────────────────────┐
│ Departments                                                  │
│                                                              │
│ < [HR(4)] [Legal(3)] [Engineering(2)] [Finance(2)] [Ops(0)] >│
│                                                              │
│ Scrollable:  When tabs overflow, arrow buttons appear ◀ ▶   │
│              Smooth scroll on arrow click                    │
│              Auto-hide arrows when all visible              │
└──────────────────────────────────────────────────────────────┘
```

## Filter Sidebar

```
┌───────────────────────┐
│  Advanced Filters     │
│  تصفية متقدمة         │
├───────────────────────┤
│                       │
│ TYPE (نوع المستند)   │
│ ▼                     │
│ ☑ Licenses           │
│ ☐ Permits            │
│ ☐ Authorizations     │
│ ☐ Cards              │
│ ☐ Approvals          │
│ ☐ Equipment          │
│                       │
├───────────────────────┤
│                       │
│ DEPARTMENT (الإدارة)  │
│ ▼                     │
│ ☐ HR                 │
│ ☐ Legal              │
│ ☐ Engineering        │
│ ☐ Finance            │
│ ☐ Operations         │
│                       │
├───────────────────────┤
│ ENTITY (الكيان)       │
│ RENEWAL (التجديد)     │
│ IMPORTANCE (الأهمية)  │
│                       │
├───────────────────────┤
│                       │
│ [Clear All Filters]   │  ← Shows only when filters active
│                       │
└───────────────────────┘
```

## Responsive Breakpoints

### Mobile View (<768px)
```
Full width single column documents
Search bar spans full width
Tabs wrap vertically
Sidebar becomes fullscreen overlay
Cards stack single column
```

### Tablet View (768px-1023px)
```
2 column document grid
Search bar spans full width
Tabs responsive
Sidebar below main content
Cards in 2 column layout
```

### Desktop View (1024px+)
```
3 column document grid
Side-by-side layout with sticky sidebar
Smooth scrolling
All UI elements visible
Optimal readability
```

## Interaction Patterns

### Search
```
User types in search → Real-time filtering → Results update immediately
Features:
- Searches document names
- Case-insensitive
- Works with all view modes
- Combines with slider tabs filtering
```

### Tab Selection
```
User clicks tab → Documents refilter → Grid updates
Features:
- Active tab highlighted (filled blue)
- Document count displayed
- Smooth transitions
- Maintains search filter
```

### Advanced Filters
```
User checks filter checkbox → Documents refilter → Count badges update
Features:
- Multi-select within categories
- Combine filters (AND logic)
- Visual feedback (✓ indicator)
- Works with view mode and tabs
```

### View Mode Switching
```
User clicks view tab → Slider tabs appear/hide → Documents refilter
All Tab    → No slider tabs, all documents shown
Types Tab  → Type slider tabs shown, type-filtered documents
Depts Tab  → Department slider tabs shown, dept-filtered documents
```

## Document Counts

Dynamic counts shown on:
1. **Type Tabs:** Count documents in each type
   - "Licenses(3)" = 3 documents of Licenses type

2. **Department Tabs:** Count documents in each department
   - "HR(4)" = 4 documents in HR department

3. **Results Summary:** Total matching documents
   - "Showing 3 documents"

Counts update when:
- View mode changes
- Tab selection changes
- Search query changes
- Advanced filters change

## Color Palette Reference

```
Primary Elements:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Blue:          #2563EB  (Primary actions, active tabs)
Light Blue:    #DBEAFE  (Medium importance badge bg)
White:         #FFFFFF  (Cards, backgrounds)
Light Gray:    #F5F7FA  (Page background)
Dark Gray:     #1F2937  (Text)
Medium Gray:   #6B7280  (Secondary text)
Border Gray:   #E5E7EB  (Borders)

Status/Importance Colors:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Critical Red:  #EF4444  (#FEE2E2 bg)
High Orange:   #F97316  (#FFEDD5 bg)
Medium Blue:   #3B82F6  (#DBEAFE bg)
Renewable:     #9333EA  (#F3E8FF bg)
One-Time:      #6B7280  (#F3F4F6 bg)
Expires:       #B45309  (#FEF3C7 bg)
Expired:       #DC2626  (#FEE2E2 bg)
```

## Typography Hierarchy

```
Page Title:      4xl bold (text-4xl font-bold)
Section Headers: lg semibold (text-lg font-semibold)
Card Title:      sm semibold (text-sm font-semibold)
Labels:          xs semibold (text-xs font-semibold)
Body Text:       sm (text-sm)
Helper Text:     xs (text-xs)
```

## Spacing Standards

```
Page Padding:    px-4 py-8
Card Padding:    p-4 (inside cards)
Component Gaps:  gap-6 (between cards)
Tab Scroll Gap:  gap-2 (between tabs)
Border Radius:   rounded-xl (12px) for cards
                 rounded-full (999px) for pills
```

## Summary

The Documents page now provides a modern, intuitive browsing experience with:

✨ **Visual Focus:** Large card-based layout with clear document information
✨ **Smart Navigation:** Context-aware tabs that appear based on view mode
✨ **Easy Discovery:** Smooth scrolling tabs with document counts
✨ **Professional Design:** Soft colors, subtle shadows, friendly spacing
✨ **Responsive Layout:** Adapts beautifully to all screen sizes
✨ **Bilingual Support:** English labels + Arabic translations
✨ **Advanced Filtering:** Sidebar controls for detailed document discovery
