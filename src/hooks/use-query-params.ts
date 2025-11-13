"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { isNull, isUndefined } from "@/core/configs";

type QueryParamsType = {
  queryParams: ReturnType<typeof useSearchParams>;
  queryObject: Record<string, string>;
  setQueryParams: (params: Partial<unknown>) => void;
  directToPathWithQueryParams: (
    params: Partial<unknown>,
    pathName: string,
  ) => void;
};

const useQueryParams = <T>(): QueryParamsType => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams?.toString());
  const urlQueryObject = Object.fromEntries(urlSearchParams);

  const handleQueryParams = (
    params: Partial<T>,
    urlParams: URLSearchParams,
  ) => {
    Object.entries(params).forEach(([key, value]) => {
      if (isUndefined(value) || isNull(value)) {
        urlParams.delete(key);
        return;
      }
      urlParams.set(key, String(value));
    });
    return urlParams.toString();
  };

  const setQueryParams = (params: Partial<T>) => {
    const search = handleQueryParams(params, urlSearchParams);
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`);
  };

  const directToPathWithQueryParams = (
    params: Partial<T>,
    pathName: string,
  ) => {
    const search = handleQueryParams(params, new URLSearchParams());
    const query = search ? `?${search}` : "";
    router.push(`${pathName}${query}`);
  };

  return {
    queryParams: searchParams,
    queryObject: urlQueryObject,
    setQueryParams,
    directToPathWithQueryParams,
  };
};

export default useQueryParams;
