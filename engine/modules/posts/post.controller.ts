import { requireAuth } from "@/engine/core/http/auth-guard";
import { valid } from "@/engine/core/http/validator";
import { ok, created } from "@/engine/core/http/responses";
import { postService } from "./post.service";
import { CreatePostSchema } from "@/engine/core/validation/schemas/post.schema"; 
import DOMPurify from "isomorphic-dompurify";
import { ValidationError } from "@/engine/core/http/errors";
import { saveUpload } from "@/engine/utils/files";

export const postController = {
  async index(req: Request) {
    const auth = await requireAuth(req);
    const posts = await postService.listForUser(Number(auth.id));
    return ok(posts);
  },

 
  async store(req: Request) {
    try {
        const auth = await requireAuth(req);

        const form = await req.formData();   
        const title = String(form.get("title") || "");
        let content = String(form.get("content") || "");
        content = DOMPurify.sanitize(content, {
                    USE_PROFILES: { html: true },
                  });

        if (content.length > 20000)
            throw new ValidationError("Post body too large");

        if (!content.replace(/<[^>]+>/g, "").trim())
            throw new ValidationError("Post body cannot be empty");


        const file = form.get("image") as File | null;

        let image: string | null = null;

        if (file && file.size > 0) {
        image = await saveUpload(file );
        }

        const post = await postService.create(Number(auth.id), { title, content, image });

        return created(post);

    } catch (e) {
        console.log("E", e);
    }
    
  },

async update(req: Request) {
  const auth = await requireAuth(req);
  const form = await req.formData();

  const postId = Number(form.get("id"));
  const title = String(form.get("title") || "");
  let content = String(form.get("content") || "");

  content = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });

  let image: string | null = null;
  const file = form.get("image") as File | null;

  if (file && file.size > 0) {
    image = await saveUpload(file, "posts");
  }

  const post = await postService.update(auth, postId, {
    title,
    content,
    image,
  });

  return ok(post);
},

async delete(req: Request) {
  const auth = await requireAuth(req);
  const form = await req.formData(); //const body = await req.json();

  const postId = Number(form.get("id"));  //body.id

  const post = await postService.delete(auth, postId );

  return ok(post);
},
 
 

  async storex(req: Request) {
    const auth = await requireAuth(req);
    const body = await valid.schema(CreatePostSchema, await req.json());

    const post = await postService.create(Number(1), body);
    return created(post);
  },
};
