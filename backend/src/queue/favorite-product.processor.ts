import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { FavoriteProductService } from "@/favorite-product/favorite-product.service";

@Processor("favorite-product")
export class FavoriteProductProcessor extends WorkerHost {
  constructor(private readonly favoriteProductService: FavoriteProductService) {
    super();
  }

  async process(
    job: Job<{ productId: number; userId: string }>,
  ): Promise<void> {
    const { productId, userId } = job.data;

    console.log(
      `Processing favorite product job for user ${userId} and product ${productId}`,
    );

    await this.favoriteProductService.executeFavoriteProduct({
      productId,
      userId,
    });
  }
}
