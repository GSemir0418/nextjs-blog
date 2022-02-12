import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePosts1644649306536 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "posts",
        columns: [
          {
            name: "id",
            type: "int",
            isGenerated: true,
            generationStrategy: "increment",
            isPrimary: true,
          },
          { name: "title", type: "varchar" },
          { name: "content", type: "text" },
          { name: "author_id", type: "int" },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable("posts");
    } catch (error) {}
  }
}
