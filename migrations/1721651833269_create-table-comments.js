/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "threads",
      onDelete: "CASCADE",
    },
    date: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    is_deleted: {
      type: "boolean",
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
