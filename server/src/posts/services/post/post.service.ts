import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';
import { CreatePostInput } from 'src/posts/inputs/create-post.input';
import { UpdatePostInput } from 'src/posts/inputs/update-post.input';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async createPost(createPostInput: CreatePostInput): Promise<PostEntity> {
    const { userId, ...postInput } = createPostInput;

    const user = await this.userRepository.findOne({ where: { id: userId } });

    const post = {
      ...postInput,
      user,
    }

    return await this.postRepository.save(post);
  }

  async getOnePost(id: string): Promise<PostEntity> {
    return await this.postRepository.findOne({ where: { id } });
  }

  async getAllPosts(): Promise<PostEntity[]> {
    return await this.postRepository.find();
  }

  async removePost(id: string): Promise<string> {
    await this.postRepository.delete({ id });
    return id;
  }

  async updatePost(updatePostInput: UpdatePostInput): Promise<PostEntity> {
    await this.postRepository.update(
      {
        id: updatePostInput.id,
      },
      { ...updatePostInput },
    );
    return await this.getOnePost(updatePostInput.id);
  }
}
