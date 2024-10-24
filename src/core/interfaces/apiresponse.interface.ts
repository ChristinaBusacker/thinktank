export interface PaginatedApiResponse<T> {
  data: T[];
  hasMorePages: boolean;
  page: number;
}
