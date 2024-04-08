import { toValue } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import type { MaybeRefOrGetter } from '@vueuse/core'
//import type { UseApiDataOptions } from 'nuxt-api-party/dist/runtime/composables/useApiData'
import type { ApiFetchOptions } from '#nuxt-api-party'
import {userTokenStore} from "~/stores/token";
export default  async function $api<T = any>(
  path: string,
  opts: ApiFetchOptions & {
    auth?: boolean
  } = {}
) {
  const { auth = true, ..._opts } = opts

  const headers: HeadersInit = {
    ...headersToObject(_opts.headers),
  }

  if (auth) {
    if (userTokenStore().getToken) {
      //if (authStore.isTokenExpired()) await authStore.refresh()
      headers.Authorization = `Bearer ${userTokenStore().getToken}`
    }
  }

  return await $realApi<T>(path, {
    ..._opts,
    headers,
  })
}
/*
export async function useApiData<T = any>(
  path: MaybeRefOrGetter<string>,
  opts: UseApiDataOptions<T> & {
    auth?: boolean
  } = {}
) {
  const { auth, ..._opts } = opts
  const authStore = useAuthStore()
  const { isLoggedIn } = storeToRefs(authStore)

  if (
    import.meta.client &&
    auth &&
    isLoggedIn.value &&
    authStore.isTokenExpired()
  ) {
    await authStore.refresh()
  }

   const asyncData = await useRealApiData<T>(path, {
    ..._opts,
    headers: computed(() => ({
      ...headersToObject(toValue(_opts.headers)),
      ...(auth &&
        isLoggedIn.value && {
          Authorization: `Bearer ${authStore.accessToken}`,
        }),
    })),
    // Instead of watching all fetch options implicitly,
    // we watch only the ones we need
    watch: false,
  })

  // Always watch the query
  const fetchOptions = reactive({
    query: _opts.query,
  })

  watch(fetchOptions, () => asyncData.refresh())

  if (auth) {
    watch(isLoggedIn, () => asyncData.refresh())
  }

  return asyncData
} */

function headersToObject(
  headers: HeadersInit = {}
): Record<string, string> {
  if (headers instanceof Headers || Array.isArray(headers)) {
    return Object.fromEntries(headers)
  }

  return headers
}