import { ActionType } from "typesafe-actions";
import * as actions from './actions'

export type IState = {
  value: Array<string>;
};

export type IStateAction = ActionType<typeof actions>;
