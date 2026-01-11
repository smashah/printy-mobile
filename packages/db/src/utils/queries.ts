import { isNull, eq, type SQL } from "drizzle-orm";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";

/**
 * Pagination helper
 * Converts string parameters to safe integers for database queries
 */
export const withPagination = (limit?: string | number, offset?: string | number) => ({
  limit: limit ? Number.parseInt(String(limit), 10) : 20,
  offset: offset ? Number.parseInt(String(offset), 10) : 0,
});

/**
 * Page-based pagination helper
 * Converts page number to offset
 */
export const withPagePagination = (page?: string | number, limit?: string | number) => {
  const pageNum = page ? Number.parseInt(String(page), 10) : 1;
  const limitNum = limit ? Number.parseInt(String(limit), 10) : 20;
  
  return {
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
    page: pageNum,
  };
};

/**
 * Soft delete filter
 * Returns condition to filter out soft-deleted records
 */
export const withSoftDelete = <T extends { deletedAt: SQLiteColumn }>(
  table: T
): SQL => isNull(table.deletedAt);

/**
 * Find one record or throw an error
 * Useful for ensuring a record exists before proceeding
 * 
 * TODO: Replace Error with AppError from @printy-mobile/logger when it's implemented
 */
export const findOneOrThrow = async <T>(
  query: Promise<T[]>,
  errorMsg = "Resource not found"
): Promise<T> => {
  const results = await query;
  if (results.length === 0) {
    // TODO: Use AppError(errorMsg, "NOT_FOUND", 404) when @printy-mobile/logger is available
    const error = new Error(errorMsg);
    (error as any).statusCode = 404;
    (error as any).code = "NOT_FOUND";
    throw error;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return results[0]!;
};

/**
 * Find many records with total count
 * Executes both queries in parallel for efficiency
 */
export const findManyWithCount = async <T>(
  query: Promise<T[]>,
  countQuery: Promise<{ count: number }[]>
): Promise<{ data: T[]; total: number }> => {
  const [data, countResult] = await Promise.all([query, countQuery]);
  return {
    data,
    total: countResult[0]?.count ?? 0,
  };
};

/**
 * Soft delete helper
 * Sets deletedAt timestamp instead of removing the record
 * 
 * Note: Requires table to have a deletedAt column
 */
export const softDelete = async <T extends { id: SQLiteColumn; deletedAt: SQLiteColumn }>(
  db: any,
  table: T,
  id: string
) => {
  return db
    .update(table)
    .set({ deletedAt: new Date().toISOString() })
    .where(eq(table.id, id));
};

/**
 * Build ORDER BY clauses safely
 * Prevents SQL injection by validating against allowed columns
 */
export const withOrderBy = <T extends string>(
  orderBy?: string,
  allowedColumns: readonly T[] = [] as readonly T[],
  defaultColumn: T = allowedColumns[0] as T,
  defaultDirection: "asc" | "desc" = "desc"
): { column: T; direction: "asc" | "desc" } => {
  if (!orderBy) {
    return { column: defaultColumn, direction: defaultDirection };
  }

  const [column, direction] = orderBy.split(":") as [string, "asc" | "desc" | undefined];
  
  const validColumn = allowedColumns.includes(column as T) ? (column as T) : defaultColumn;
  const validDirection = direction === "asc" || direction === "desc" ? direction : defaultDirection;

  return {
    column: validColumn,
    direction: validDirection,
  };
};

/**
 * Build search conditions for multiple fields
 * Creates OR conditions for flexible text search
 * 
 * TODO: Implement with Drizzle's or() and like() helpers when needed
 */
export const buildSearchConditions = (
  _searchTerm: string,
  _columns: SQLiteColumn[]
): SQL | undefined => {
  // Placeholder for future implementation
  // Will use: or(...columns.map(col => like(col, `%${searchTerm}%`)))
  return undefined;
};

/**
 * Calculate pagination metadata
 * Useful for building paginated API responses
 */
export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number
) => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit),
  hasNext: page * limit < total,
  hasPrev: page > 1,
});

