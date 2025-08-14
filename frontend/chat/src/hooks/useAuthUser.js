import { useQuery } from "@tanstack/react-query"
import { getAuthUser } from "../lib/api"

function useAuthUser() {
  const {data: authData,isLoading,error} = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  })

  return {isLoading,authUser: authData?.user};
}

export default useAuthUser