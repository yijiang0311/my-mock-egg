const { Sequelize, Model } = require("sequelize");
const {
  database,
  username,
  password,
  host,
  port,
  dialect
} = require("../config/index").db;
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  port,
  logging: true,
  timezone: "+08:00",
  define: {
    //create_time  update_time delete_time
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    underscored: true,
    freezeTableName: true,
    scopes: {
      bh: {
        attributes: {
          exclude: ["updated_at", "deleted_at", "created_at"],
        },
      },
    },
  },
});

sequelize.sync({
  force: false,
});

module.exports = {
  sequelize,
};
