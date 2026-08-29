import { AuthError } from "@/engine/core/http/errors";
import { postRepository } from "./post.repository";
import { requireRole } from "@/engine/core/security/permissions";
import { PostPermissions } from "./post.permissions";
import { requireAuth } from "@/engine/core/http/auth-guard";

export const postService = {
  async listForUser(userId: number) {
    return postRepository.findByUser(userId);
  },

  async create(userId: number, data: { title: string; content: string; image?: string | null  }) {
    return postRepository.create({
      user_id: userId,
      title: data.title,
      content: data.content,
      image: data.image ?? null,
    });
  },

  async update( user: any, postId: number, 
    data: { title: string; content: string; image?: string | null }  )  {

    const post = await postRepository.find(postId);
    if (!post) throw new Error("Post not found"); 

    const isOwner = post.user_id === user.id;
    if (!isOwner) {
        // requires moderator+
        requireRole(user.role, PostPermissions.EDIT_ANY);
    } else {
        // requires user+
        requireRole(user.role, PostPermissions.EDIT_OWN);
    }

    await postRepository.update(
        {
        title: data.title,
        content: data.content,
        image: data.image ?? post.image,
        },
        "id = ?",
        [postId]
    );

    return await postRepository.find(postId);
    },

    async delete(user:any, postId: Number) {
        const post = await postRepository.find(Number(postId));
        if (!post) throw new Error("Post not found");

        const isOwner = post.user_id === user.id;

        if (!isOwner) {
            requireRole(user.role, PostPermissions.DELETE_ANY); // admin+
        } else {
            requireRole(user.role, PostPermissions.DELETE_OWN); // user+
        }

        await postRepository.delete("id = ?", [postId]);
    }



};
