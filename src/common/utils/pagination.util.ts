import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * Common query parameters for paginated endpoints.
 *
 * Usage:
 *   @Get()
 *   findAll(@Query() pagination: PaginationDto) { ... }
 */
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 20;
}

/**
 * Shape of a paginated API response.
 */
export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Wraps a slice of items together with pagination metadata.
 *
 * @param items    - The records for the current page
 * @param total    - Total number of records across all pages
 * @param page     - Current page (1-based)
 * @param pageSize - Records per page
 */
export function paginateResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  return {
    items,
    page,
    pageSize,
    totalItems: total,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Converts PaginationDto fields to plain `skip` / `take` values.
 */
export function toPageWindow(dto: PaginationDto): { skip: number; take: number } {
  const page = dto.page ?? 1;
  const pageSize = dto.pageSize ?? 20;
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}
