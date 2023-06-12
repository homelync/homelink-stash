import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const tableName = 'propertyMessage';

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable(tableName, {
            __IDENTITY: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true
            },
            action: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            actionTimestamp: {
                type: DataTypes.DATE(3),
                allowNull: false,
                primaryKey: true
            },
            address1: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address2: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            addressConfidence: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            deviceCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            installedBy: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            landlordReference: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            postcode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            propertyDisplayReference: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            propertyId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            propertyReference: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE(3),
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
            },
            updatedAt: {
                type: DataTypes.DATE(3),
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
            },
        });
    },

    down: (queryInterface, _DataTypes) => {
        return queryInterface.dropTable(tableName);
    }
};