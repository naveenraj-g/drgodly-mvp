import { useRouter } from "@/i18n/navigation";
import qs from "query-string";

export const updateQueryParam = (
  key: string,
  value: any,
  searchParams: URLSearchParams,
  router: ReturnType<typeof useRouter>
) => {
  const currentParams = qs.parse(searchParams.toString());

  // If value is an object, nest it properly
  const newParams =
    typeof value === "object" && value !== null
      ? {
          ...currentParams,
          ...Object.entries(value).reduce((acc, [k, v]) => {
            acc[`${k}`] = v;
            return acc;
          }, {} as Record<string, any>),
        }
      : { ...currentParams, [key]: value };

  const newQuery = qs.stringify(newParams);

  router.push(`?${newQuery}`);
};
