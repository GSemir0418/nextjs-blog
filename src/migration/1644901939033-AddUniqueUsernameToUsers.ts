import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddUniqueUsernameToUsers1644901939033
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      "users",
      new TableIndex({
        // 这里名字随便起，建议与列名相关
        name: "users_username",
        columnNames: ["username"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("users", "users_username");
  }
}
