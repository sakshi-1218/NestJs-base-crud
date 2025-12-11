export interface QueryOptions<T> {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Partial<T>;
  sortBy?: keyof T | string;
  sortOrder?: 'ASC' | 'DESC';
  lastId?: number;
}
