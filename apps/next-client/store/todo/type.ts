import { ActionType } from "typesafe-actions";
import * as actions from './todoActions'

export interface IState {
  value: Array<string>;
};

export type IStateAction = ActionType<typeof actions>;
