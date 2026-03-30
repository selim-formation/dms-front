# Document API Integration Guide

## Overview

This document describes the implementation of API-driven document retrieval using TanStack Query (React Query) with proper caching and OOP principles.

## Architecture

### Files Structure

```
src/features/documents/
├── api/
│   ├── documents-grouped.api.ts      # API service class
│   └── documentKeys.ts               # TanStack Query key factory
├── hooks/
│   ├── index.ts                      # Hooks export file
│   └── useDocumentQueries.ts          # Query hooks
├── types/
│   ├── api.types.ts                  # API response types
│   └── index.ts                      # Domain types
├── utils/
│   └── document-transformer.ts       # Data transformation utilities
└── pages/
    └── DocumentListPage.tsx          # Main page component
```

## API Endpoints

### Documents by Entity Types
**Endpoint:** `GET /api/{tenant}/documents/documents-by-types`

**Response Structure:**
```json
{
  "data": [
    {
      "entity": "Land",
      "establishment": {
        "one_time": [...],
        "renewal": [...]
      },
      "operational": {
        "one_time": [...],
        "renewal": [...]
      }
    }
  ],
  "message": "success"
}
```

### Documents by Departments
**Endpoint:** `GET /api/{tenant}/documents/documents-by-departments`

**Response Structure:**
```json
{
  "data": [
    {
      "department": "Finance",
      "one_time": [...],
      "renewal": [...]
    }
  ],
  "message": "success"
}
```

## Key Components

### 1. API Service Layer (`documents-grouped.api.ts`)

Clean, typed API service using Axios client:

```typescript
// Usage
const response = await documentApiService.getDocumentsByTypes(tenant);
const response = await documentApiService.getDocumentsByDepartments(tenant);
```

**Benefits:**
- Encapsulated API logic
- Type-safe requests and responses
- Centralized error handling
- Easy to test and maintain

### 2. Query Keys Factory (`documentKeys.ts`)

TanStack Query key factory with hierarchical structure:

```typescript
// Usage
documentKeys.byType(tenant)      // ['documents', tenant, 'by-type']
documentKeys.byDept(tenant)      // ['documents', tenant, 'by-dept']
```

**Benefits:**
- Predictable cache invalidation
- Type-safe query key generation
- Enables granular cache management

### 3. Data Transformation (`document-transformer.ts`)

Transformer class using static methods for pure data transformation:

```typescript
class DocumentTransformer {
  static toUIDocument(apiDoc, isOneTime)
  static transformByTypes(data)
  static transformByDepartments(data)
  static flattenGroupedDocuments(grouped)
  static flattenDepartmentDocuments(grouped)
}
```

**Benefits:**
- Pure functions (no side effects)
- Reusable across different contexts
- Easy to test
- Clear separation of concerns

### 4. Query Hooks (`useDocumentQueries.ts`)

Custom React hooks with TanStack Query integration:

#### Primary Hooks
- `useDocumentsByTypes()` - Fetch and transform documents by entity types
- `useDocumentsByDepartments()` - Fetch and transform documents by departments

#### Convenience Hooks
- `useDocumentsByType(entityType)` - Get a specific entity type group
- `useDocumentsByDepartment(departmentName)` - Get a specific department group
- `useAllDocumentsByType()` - Get flattened list of all documents by type
- `useAllDocumentsByDepartment()` - Get flattened list of all documents by department

**Caching Strategy:**
- `staleTime: 5 minutes` - Data remains fresh for 5 minutes
- `cacheTime: 30 minutes` - Cached data retained for 30 minutes
- `retry: 1` - Single retry on failure
- `retryDelay: 1000ms` - 1 second retry delay

## Type System

### API Types (`api.types.ts`)

**Request/Response Types:**
- `ApiDocument` - Individual document from API
- `DocumentsByTypeResponse` - Grouped by entity type
- `DocumentsByDepartmentItem` - Grouped by department
- `DocumentsByTypeApiResponse` - Full API response
- `DocumentsByDepartmentApiResponse` - Full API response

**UI Types:**
- `UIDocument` - Normalized document for UI consumption
- `GroupedDocuments` - Documents grouped by type with categories
- `DepartmentGroupedDocuments` - Documents grouped by department

**Benefits:**
- Strict separation of API and UI types
- Prevents accidental API schema leakage
- Enables smooth future migrations

## Usage Examples

### Basic Usage in Components

```typescript
import { useDocumentsByTypes } from '@/features/documents/hooks';

function MyComponent() {
  const { data, isLoading, error } = useDocumentsByTypes();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.grouped.map((group) => (
        <div key={group.name}>
          <h2>{group.name}</h2>
          {/* Render documents */}
        </div>
      ))}
    </div>
  );
}
```

### Accessing Specific Group

```typescript
const { data } = useDocumentsByType('Land');
// Automatically filtered from the cached data
```

### Getting Flat Document List

```typescript
const { data: flatDocs } = useAllDocumentsByType();
// Perfect for displaying all documents regardless of grouping
```

### Manual Data Transformation

```typescript
import { DocumentTransformer } from '@/features/documents/utils/document-transformer';

const apiResponse = await documentApiService.getDocumentsByTypes(tenant);
const transformed = DocumentTransformer.transformByTypes(apiResponse.data);
```

## Cache Management

### Automatic Invalidation

Clear cache when data changes:

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { documentKeys } from '@/features/documents/api/documentKeys';

function MyComponent() {
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    queryClient.invalidateQueries(documentKeys.byType(tenant));
    queryClient.invalidateQueries(documentKeys.byDept(tenant));
  };
  
  return <button onClick={handleRefresh}>Refresh</button>;
}
```

### Prefetching Data

```typescript
const queryClient = useQueryClient();

queryClient.prefetchQuery({
  queryKey: documentKeys.byType(tenant),
  queryFn: () => documentApiService.getDocumentsByTypes(tenant),
});
```

## Error Handling

The hooks inherit TanStack Query's error handling:

```typescript
const { data, isLoading, error } = useDocumentsByTypes();

if (error) {
  console.error('Error:', error.message);
  // Display error UI
}
```

Errors are caught by the API service and re-thrown for proper handling in hooks.

## Performance Optimizations

1. **Query Caching:** Data cached for 30 minutes, fresh for 5 minutes
2. **Lazy Loading:** Queries only execute when `enabled: !!tenant` is true
3. **Memoization:** Results memoized to prevent unnecessary re-renders
4. **Filtered Results:** Convenience hooks filter from parent query (no extra requests)
5. **Pure Transformations:** Data transformation doesn't cause extra components updates

## Integration with Existing Code

### Document List Page

The `DocumentListPage.tsx` has been updated to use the new API hooks:

```typescript
const { data: typeData, isLoading: typeLoading } = useDocumentsByTypes();
const { data: deptData, isLoading: deptLoading } = useDocumentsByDepartments();

// Both data sources are always loaded and cached
// Switch between them based on view mode
```

## Future Enhancements

1. **Mutation Hooks:** Add hooks for create/update/delete operations
2. **Real-time Updates:** Implement WebSocket support for live data
3. **Advanced Filtering:** Add server-side filtering parameters
4. **Pagination:** Implement pagination for large datasets
5. **Sorting:** Add configurable sorting options
6. **Export:** Add data export functionality

## Testing

### Mock API Service

```typescript
// For testing, mock the documentApiService:
jest.mock('@/features/documents/api/documents-grouped.api', () => ({
  documentApiService: {
    getDocumentsByTypes: jest.fn(),
    getDocumentsByDepartments: jest.fn(),
  },
}));
```

### Test Hook

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useDocumentsByTypes } from '@/features/documents/hooks';

test('useDocumentsByTypes loads data', async () => {
  const { result } = renderHook(() => useDocumentsByTypes());
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
  
  expect(result.current.data?.grouped).toBeDefined();
});
```

## Troubleshooting

### Query Not Fetching

- Ensure tenant is set: `useTenant()` must return a valid tenant
- Check query enabled condition: `enabled: !!tenant`
- Verify API endpoint is correct

### Stale Data

- Data is considered fresh for 5 minutes
- Use `queryClient.invalidateQueries()` to force refresh
- Adjust `staleTime` in `QUERY_CONFIG` if needed

### Memory Leaks

- TanStack Query automatically handles cleanup
- No explicit cleanup needed in components

## References

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query Design Patterns](https://tanstack.com/query/latest/docs/react/important-defaults)
- [TypeScript API Best Practices](https://www.typescriptlang.org/docs/)
