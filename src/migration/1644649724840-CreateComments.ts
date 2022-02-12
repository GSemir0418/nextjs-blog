import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateComments1644649724840 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "comments",
        columns: [
          {
            name: "id",
            type: "int",
            isGenerated: true,
            generationStrategy: "increment",
            isPrimary: true,
          },
          { name: "user_id", type: "int" },
          { name: "post_id", type: "int" },
          { name: "content", type: "text" },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable("comments");
    } catch (error) {}
  }
}
