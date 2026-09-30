export type FailedResponse = {
  success: false;
  message: string;
  fieldErros?: Record<string, string[]>;
};
export type SuccessResponse<T> = {
  success: true;
  data: T;
  fieldErros?: Record<string, string[]>;
};

export type Response<T> = FailedResponse | SuccessResponse<T>;
