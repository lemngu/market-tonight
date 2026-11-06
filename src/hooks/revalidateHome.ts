import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

export const HOME_CACHE_TAG = 'home-page-v1'

const invalidateHome = () => {
  revalidateTag(HOME_CACHE_TAG, 'max')
}

export const revalidateHomeAfterChange: CollectionAfterChangeHook = () => {
  invalidateHome()
}

export const revalidateHomeAfterDelete: CollectionAfterDeleteHook = () => {
  invalidateHome()
}

export const revalidateHomeGlobalAfterChange: GlobalAfterChangeHook = () => {
  invalidateHome()
}
