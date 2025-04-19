export interface PaginationMeta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor: number | null;
  previousCursor: number | null;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}
