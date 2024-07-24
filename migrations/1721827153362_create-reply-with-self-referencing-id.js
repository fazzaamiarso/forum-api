/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addColumns("comments", {
    parent_comment_id: {
      type: "VARCHAR(50)",
      references: "comments",
      onDelete: "CASCADE",
      alowNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("comments", "parent_comment_id");
};
