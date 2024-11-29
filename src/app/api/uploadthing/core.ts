import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

// import { auth } from "@/auth";

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
 
const f = createUploadthing();
 
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      // const session = await auth();
      const user = await auth(req);
 
      // if (!session) throw new UploadThingError("Unauthorized");
      if (!user) throw new UploadThingError("Unauthorized");
 
      // return { userId: session.user?.id };
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
