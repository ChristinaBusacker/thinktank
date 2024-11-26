import { PaginatedApiResponse } from '../../core/interfaces/apiresponse.interface';
import { pageSize } from '../constants/pageSize..constrant';

export function paginate<T>(array: T[], page: number): PaginatedApiResponse<T> {
  const hasMorePages = array.length > pageSize * (page + 1);

  const start = page * pageSize;
  const end = start + pageSize;
  return {
    data: array.slice(start, end),
    hasMorePages,
    page: page,
  };
}
