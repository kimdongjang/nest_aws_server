import { deprecated } from 'typesafe-actions';

const { createStandardAction } = deprecated;

export enum EApiActionTypes {
    API_INIT = 'API_INIT',
    API_REQUEST = 'API_REQUEST',
    API_SUCCESS = 'API_SUCCESS',
    API_FAIL = 'API_FAIL',
  }

  
export const actApiInit = createStandardAction(EApiActionTypes.API_INIT)();
export const actApiRequest = createStandardAction(EApiActionTypes.API_REQUEST)<number>();
export const actApiSuccess = createStandardAction(EApiActionTypes.API_SUCCESS)();
export const actApiFail = createStandardAction(EApiActionTypes.API_FAIL)<Error>();