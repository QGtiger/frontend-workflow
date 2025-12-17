export interface DocMetadata {
  name: string;
  description: string;
  returnType: string;
  /** 是否是函数 */
  isFunction?: boolean;
  args?: {
    name: string;
    type: string;
    optional?: boolean;
    variadic?: boolean;
    description: string;
  }[];
  examples?: {
    example: string;
    evaluated: string;
    description?: string;
  }[];
  docURL?: string;
}
