import { all, fork } from 'redux-saga/effects';
import getApiProductsSaga from './sagaApi';

export default function* rootSaga() {
  yield all([fork(getApiProductsSaga)]);
}
