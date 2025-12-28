import { Request, Response, NextFunction } from 'express';

export interface PaginationRequest extends Request {
  pagination?: {
    page: number;
    limit: number;
    offset: number;
  };
}

export const paginationMiddleware = (
  req: PaginationRequest,
  res: Response,
  next: NextFunction
) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  req.pagination = {
    page,
    limit,
    offset
  };

  next();
};

export const paginateResults = (
  data: any[],
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage
    }
  };
};
