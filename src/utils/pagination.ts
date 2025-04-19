import { SortOrder } from '@app/common/enums/sort-order.enum';
import { PaginatedResult } from '@app/common/interfaces/paginated-result';

interface CursorItem {
  cursor: number;
}

export function paginationResult<T extends CursorItem>(
  data: T[],
  limit: number,
  order: SortOrder,
  cursor?: number,
): PaginatedResult<T> {
  const hasNextPage = data.length > limit;
  const items = hasNextPage ? data.slice(0, -1) : data;
  const formattedData = order === SortOrder.DESC ? [...items].reverse() : items;

  const nextCursor = hasNextPage
    ? (formattedData[formattedData.length - 1]?.cursor ?? null)
    : null;
  const previousCursor =
    formattedData.length > 0 ? (formattedData[0]?.cursor ?? null) : null;

  return {
    data: formattedData,
    meta: {
      hasNextPage,
      hasPreviousPage: Boolean(cursor),
      nextCursor,
      previousCursor,
    },
  };
}
