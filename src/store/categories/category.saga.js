import { takeLatest, all, call, put } from "redux-saga/effects";

import { getCategoriesAndDocuments } from "../../utils/firebase/firebase.utils";

import {
  fetchCategoriesSuccess,
  fetchCategoriesFailed,
} from "./category.action";

import { CATEGORIES_ACTION_TYPES } from "./category.types";

/**
 * Creating fetchCategories Saga
 */
export function* fetchCategoriesAsync() {
  // call:  turn function into an effect or to call function in generator function
  // put: replace dispatch in generator function
  try {
    const categoriesArray = yield call(getCategoriesAndDocuments, "categories");
    yield put(fetchCategoriesSuccess(categoriesArray));
  } catch (error) {
    yield put(fetchCategoriesFailed(error));
  }
}
/**
 * Trigger when we call fetch categories Async
 */
export function* onFetchCategories() {
  // takeLatest: If you hear a bunch of the same action, give me the latest one.
  /** takeLatest take 2 arguments:
   *       The first is the actual action type that you want to respond to
   *       The next argument is what you want to actually happen
   */

  yield takeLatest(
    CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START,
    fetchCategoriesAsync
  );
}

/* The actual export from saga file that is pretty much an accumulator that holds all of sagas 
that are related to the category. */
export function* categoriesSaga() {
  // all:run everything inside and only complete when all of it is done
  yield all([call(onFetchCategories)]);
}
