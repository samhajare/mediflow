export interface ResourceResponse<T> {
  data: T;
}
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface CollectionResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
export const resourceResponse = <T>(data: T): ResourceResponse<T> => ({ data });
export const collectionResponse = <T>(
  data: T[],
  pagination: PaginationMeta,
): CollectionResponse<T> => ({ data, pagination });
