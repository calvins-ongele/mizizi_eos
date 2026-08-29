import { BaseModel } from "@/engine/lib/db/BaseModel";
import { db } from "@/engine/lib/db/mysql.client";
import { Post } from "./post.types";

class PostRepository extends BaseModel<Post> {
  protected table = "posts";

  async findByUser(userId: number) {
    return db.query<Post[]>(
      `SELECT * FROM ${this.table} WHERE user_id = ? ORDER BY id DESC`,
      [userId]
    );
  }
  publicList() {
    return db.query(`
      SELECT id, title, slug, image, created_at
      FROM ${this.table}
      WHERE published = '1'
      ORDER BY created_at DESC
    `);
  }

  findBySlug(slug: string) {
    return this.findBy('slug', slug); //AND published = 1 
  }

}
 

export const postRepository = new PostRepository();
