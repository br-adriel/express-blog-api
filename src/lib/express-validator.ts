import { ErrorFormatter } from 'express-validator';

export const errorFormatter: ErrorFormatter = (error) => {
  return { msg: error.msg, param: error.param };
};
