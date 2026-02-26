# Documents Management UI - Visual Layout Guide

## Page Layout Structure

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  NAVBAR (Navigation Bar)                                                      │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                           │
│  [← Back]        DOCUMENTS                              [+ Upload Document]              │
│                  Manage, organize, and track all your business documents                 │
│                                                                                           │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 🔍 Search documents...                                                             │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                           │
│  [Type] [Department] [Importance] [Renewal]  ← Quick Filter Chips                       │
│                                                                                           │
│  ════════════════════════════════════════════════════════════════════════════════════   │
│  │ All Documents  │ By Type (ACTIVE) │ By Department │                                 │
│  ════════════════════════════════════════════════════════════════════════════════════   │
│                                                                                           │
│  ┌──────────────────────────────────────────────────────────────────────────┐           │
│  │                                                                            │           │
│  │  11 Documents                                                             │           │
│  │  Grouped by type                                                          │           │
│  │                                                                            │           │
│  │  ┌──────────────────────────────────────────────────────────────────┐   │           │
│  │  │ ▼ تراخيص (Licenses)  [3 documents] [+ Add]                     │   │           │
│  │  ├──────────────────────────────────────────────────────────────────┤   │           │
│  │  │  ☑ Name  │ Dept │ Entity │ Renewal │ Importance │ Date │ Status │ … │           │
│  │  ├──────────────────────────────────────────────────────────────────┤   │           │
│  │  │  ☐ Business Operating License [NEW] │ HR │ Operational │ ...    │   │           │
│  │  │  ☐ Commercial License      │ Legal │ Establishment │ ...      │   │           │
│  │  │  ☐ Import-Export License   │ Ops   │ Operational  │ ...       │   │           │
│  │  └──────────────────────────────────────────────────────────────────┘   │           │
│  │                                                                            │           │
│  │  ┌──────────────────────────────────────────────────────────────────┐   │           │
│  │  │ ▶ تصاريح (Permits)  [2 documents] [+ Add]                      │   │           │
│  │  └──────────────────────────────────────────────────────────────────┘   │           │
│  │                                                                            │           │
│  │  ┌──────────────────────────────────────────────────────────────────┐   │           │
│  │  │ ▶ تفويضات (Authorizations)  [2 documents] [+ Add]              │   │           │
│  │  └──────────────────────────────────────────────────────────────────┘   │           │
│  │                                                                            │           │
│  │  ... more groups ...                                                      │           │
│  │                                                                            │           │
│  └──────────────────────────────────────────────────────────────────────────┤           │
│                                                                              │           │
│                                    ┌─────────────────────────────────────┤           │
│                                    │  ADVANCED FILTERS                  │           │
│                                    ├─────────────────────────────────────┤           │
│                                    │                                      │           │
│                                    │  Type                               │           │
│                                    │  نوع المستند                         │           │
│                                    │  ▼                                  │           │
│                                    │  ☑ Licenses (تراخيص)               │           │
│                                    │  ☐ Permits (تصاريح)                │           │
│                                    │  ☐ Authorizations (تفويضات)        │           │
│                                    │  ☐ Cards (بطاقات)                  │           │
│                                    │  ☐ Approvals (اذونات)              │           │
│                                    │  ☐ Equipment (الات)                │           │
│                                    │                                      │           │
│                                    │  Department                         │           │
│                                    │  الإدارة                              │           │
│                                    │  ▼                                  │           │
│                                    │  ☑ HR                               │           │
│                                    │  ☐ Legal                            │           │
│                                    │  ☐ Engineering                      │           │
│                                    │  ☐ Finance                          │           │
│                                    │  ☐ Operations                       │           │
│                                    │                                      │           │
│                                    │  ... more filters ...               │           │
│                                    │                                      │           │
│                                    │  [✕ Clear All Filters]              │           │
│                                    │                                      │           │
│                                    └─────────────────────────────────────┘           │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## Document Row Detail

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ ☑ │ Business Operating License [NEW] │ HR │ Operational │ Renewable │ Critical │ ...   │
│   │                                   │    │               │           │         │       │
│   └─────────────────────────────────┬─┴────┴───────────┬───┴───────────┴─────────┴────   │
│                                     │                   │                                │
│                             ┌───────▼────────┐  ┌──────▼──────────┐                    │
│                             │ Department     │  │ Renewal Status  │                    │
│                             │ badge          │  │ badge           │                    │
│                             └────────────────┘  └─────────────────┘                    │
│
│  Colors & Styles:
│  ✓ Critical:  bg-red-100,    text-red-700,    border-red-200
│  ✓ High:     bg-orange-100,  text-orange-700, border-orange-200  
│  ✓ Medium:   bg-blue-100,    text-blue-700,   border-blue-200
│
│  Actions on Hover:
│  [⬇️] [👥] [⋯] ← Download | Share | More Menu
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Group Card Structure

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ ▼  تراخيص (Licenses)          [3 documents] [+ Add]                              │  ← Header (Gray bg)
├────────────────────────────────────────────────────────────────────────────────────┤
│  ☑  Name  │ Dept  │ Entity │ Renewal │ Importance │ Expiry Date │ Status │ Actions │  ← Column Headers
├────────────────────────────────────────────────────────────────────────────────────┤
│  ☐ Business Operating License | HR | Operational | Renewable | Critical | Mar 15 | ...  │
│  ☐ Commercial License         | Legal | Establishment | Renewable | Critical | Jun 20 | ... │
│  ☐ Import-Export License      | Ops | Operational | Renewable | High | May 10 | ... │
└────────────────────────────────────────────────────────────────────────────────────┘
```

## Filter Sidebar Structure

```
┌────────────────────────────────┐
│ Advanced Filters               │  ← Header with Arabic
│ تصفية متقدمة                     │
├────────────────────────────────┤
│                                │
│ TYPE ▼                         │  ← Expandable Section
│ نوع المستند                     │
│                                │
│ ☑ Licenses (تراخيص)            │ ✓ (checked)
│ ☐ Permits (تصاريح)             │
│ ☐ Authorizations (تفويضات)    │
│ ☐ Cards (بطاقات)               │
│ ☐ Approvals (اذونات)           │
│ ☐ Equipment (الات)             │
│                                │
├────────────────────────────────┤
│                                │
│ DEPARTMENT ▼                   │  ← Expandable Section
│ الإدارة                          │
│                                │
│ ☑ HR                           │ ✓ (checked)
│ ☐ Legal                        │
│ ☐ Engineering                  │
│ ☐ Finance                      │
│ ☐ Operations                   │
│                                │
├────────────────────────────────┤
│                                │
│ ... more sections ...          │
│                                │
├────────────────────────────────┤
│ [✕ Clear All Filters]          │  ← Appears when filters active
└────────────────────────────────┘
```

## Responsive Behavior

### Desktop (1024px+)
- Two-column layout: Main content (70%) + Sidebar (30%)
- Document rows display all columns
- Column headers visible
- Sidebar sticky at top

### Tablet (768px - 1023px)
- Single column layout (sidebar below)
- Document rows simplified
- Column headers hidden on mobile
- Sidebar full width at bottom

### Mobile (< 768px)
- Full width documents
- Sidebar below content
- Minimal columns displayed
- Touch-friendly buttons

## Color System

### Importance Badges
```
Critical:  [CRITICAL]  ← Red (bg-red-100, text-red-700)
High:      [HIGH]      ← Orange (bg-orange-100, text-orange-700)
Medium:    [MEDIUM]    ← Blue (bg-blue-100, text-blue-700)
```

### Renewal Badges
```
Renewable: [RENEWABLE]  ← Purple (bg-purple-100, text-purple-700)
One-Time:  [ONE-TIME]   ← Gray (bg-gray-100, text-gray-700)
```

### Status Badges
```
Expires:  [EXPIRES]  ← Amber (bg-amber-100, text-amber-700)
Expired:  [EXPIRED]  ← Red (bg-red-100, text-red-700)
```

## Quick Filter Chips

```
[📋 Type] [🏢 Department] [⭐ Importance] [🔄 Renewal]
 ↑ inactive styles (white bg, gray border/text)

[📋 Type] ← Selected (blue bg, blue border/text)
```

## Interaction Patterns

### Expand/Collapse Groups
```
Initial State:     ▶ تصاريح (Permits) [2 documents]
Click to expand:   ▼ تصاريح (Permits) [2 documents]
                   ├─ Document 1
                   └─ Document 2
```

### Filter Selection
```
Unchecked: ☐ Item Name
Checked:   ☑ Item Name   ✓ ← Visual confirmation
```

### Hover States
```
Document Row:    Opens action buttons (Download, Share, More)
Filter Option:   Highlighted with hover background
Button:          Changes color/shade on hover
```

## Typography Sizes

- Page Title (H1): 2.25rem (36px), font-bold
- Section Title (H2): 1.125rem (18px), font-semibold
- Group Header (H3): 0.875rem (14px), font-bold
- Body Text: 0.875rem (14px), regular or semibold
- Labels: 0.75rem (12px), uppercase tracking, semibold
- Small Text: 0.75rem (12px), text-gray-500
