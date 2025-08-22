import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface IShapeItem {
  shape: string;
  shape_name: string;
  shape_tags: string[];
}

export const useGetShapes = (): UseQueryResult<IShapeItem[], Error> => {
  const query = useQuery({
    queryKey: ["shapes"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/shape/all-shapes`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shapes");
      }

      const { shape } = await response.json();

      return shape;
    },
  });

  return query;
};
