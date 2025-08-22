import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface IImageItem {
  image: string;
  image_name: string;
  image_tags: string[];
}

export const useGetImages = (): UseQueryResult<IImageItem[], Error> => {
  const query = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/imagegallary/all-images`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const { imageGallary } = await response.json();

      return imageGallary;
    },
  });

  return query;
};
