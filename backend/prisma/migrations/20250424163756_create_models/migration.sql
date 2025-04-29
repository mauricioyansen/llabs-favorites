-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_list" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "favorite_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_product" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "favorite_list_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_list_user_id_key" ON "favorite_list"("user_id");

-- AddForeignKey
ALTER TABLE "favorite_list" ADD CONSTRAINT "favorite_list_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_product" ADD CONSTRAINT "favorite_product_favorite_list_id_fkey" FOREIGN KEY ("favorite_list_id") REFERENCES "favorite_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
