import { useQuery } from "@tanstack/react-query";

export type ResponseType = {
  data: Array<{
    id: string;
    templateName: string;
    templateJson: any;
    templateThumbnail?: string;
    tags: string[];
  }>;
};

type RequestType = {
  page: string;
  limit: string;
};

export const useGetTemplates = () => {
  const query = useQuery({
    queryKey: ["templates", {}],
    queryFn: async () => {
      const token = localStorage.getItem("token") || "null";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/templates`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      const data = await response.json();
      return data.data;
    },
  });

  return query;
};
