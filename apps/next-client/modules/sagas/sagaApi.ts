import axios, { AxiosResponse } from "axios";
import { all, call, fork, put, takeEvery, takeLatest } from "redux-saga/effects";
import { productsActions } from "../reducers/productReducer";

const CallApi = () => {
  return axios.get("https://dog.ceo/api/breeds/image/random")
}

function* getApiProducts() {
    // yield과정에서 발생하는 error는 catch에서 걸린다.
    try {
      // API 요청을 한다.
      // call(fn)에서 만약 fn이 Promise를 반환한다면 resovle될 때 까지 기다리고 결과를 generate한다.
      // 따라서 response에는 API 요청 응답이 담기게 된다.
      // axios를 통해 요청하기 때문에 AxiosResponse로 타입을 명시해준다.
      const response: AxiosResponse = yield call(CallApi);
      console.log("Response" + response.data)
      // put(action)은 action을 dispatch를 한다.
      yield put(productsActions.getProductsSuccess(response.data));
    } catch (error) {
      // 위 과정에서 에러가 발생하면 여기서 다룬다.
      yield put(productsActions.getProductsError(error));
    }
  }
  
  // 그 다음 getProducts 액션을 감지하는 saga를 작성한다.
  function* watchGetProducts() {
    // 만약 getProducts액션 (패턴이라고도 하는데)이 감지되면, getProductsSaga를 호출한다.
    yield takeLatest(productsActions.getProducts, getApiProducts);
  }
  
  // watchGetProducts를 바로 export 해서 rootSaga에 넣어도 되는데 saga가 여러개 인 경우 saga로 한번더 감싸준다.
  export default function* getApiProductsSaga() {
    yield all([fork(watchGetProducts)]);
  }