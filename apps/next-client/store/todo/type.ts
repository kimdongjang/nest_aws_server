import { ActionType } from "typesafe-actions";
import * as actions from './todoActions'

export interface IState {
  value: number;
};

export type IStateAction = ActionType<typeof actions>;
