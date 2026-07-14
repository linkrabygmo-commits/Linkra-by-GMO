import "server-only";

export interface Repository<TDto, TCreateInput, TUpdateInput> {
  findById(id: string): Promise<TDto | null>;
  findMany(filter?: unknown): Promise<TDto[]>;
  create(input: TCreateInput): Promise<TDto>;
  update(id: string, input: TUpdateInput): Promise<TDto>;
  delete(id: string): Promise<void>;
}

export class UnauthorizedError extends Error {
  constructor(message = "認証されていません") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "この操作を行う権限がありません") {
    super(message);
    this.name = "ForbiddenError";
  }
}
