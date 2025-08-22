import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface IFontItem {
  font: string;
  font_name: string;
  font_tags: string[];
}

export const useGetFonts = (): UseQueryResult<IFontItem[], Error> => {
  const query = useQuery({
    queryKey: ["fonts"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/fonts/all-fonts`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch fonts");
      }

      const { font } = await response.json();

      return font;
    },
  });

  return query;
};
