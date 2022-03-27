import { deprecated } from 'typesafe-actions';
import { IState } from './type';

const { createStandardAction } = deprecated;

// 액션 타입
export const ADD_TODO = "todo/ADD_TODO";
export const DELETE_TODO = "todo/DELETE_TODO";

// 액션 함수
// 1. action type
// 2. payload
export const addTodo = createStandardAction(ADD_TODO)<{ value: string }>();
export const deleteTodo = createStandardAction(DELETE_TODO)();
