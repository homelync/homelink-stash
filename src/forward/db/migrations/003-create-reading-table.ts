import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const tableName = 'readingMessage';

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable(tableName, {
            __IDENTITY: {
                type: DataTypes.STRING,
                allowNull: false
            },
            action: {
                type: DataTypes.STRING,
                allowNull: false
            },
            actionTimestamp: {
                type: DataTypes.DATE(3),
                allowNull: false
            },
            collectionDate: {
                type: DataTypes.DATE(3),
                allowNull: false
            },
            deviceId: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true
            },
            devicePhySerialNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            deviceSerialNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            location: {
                type: DataTypes.STRING,
                allowNull: false
            },
            locationNickname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            landlordReference: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            manufacturerReference: {
                type: DataTypes.STRING,
                allowNull: false
            },
            propertyDisplayReference: {
                type: DataTypes.STRING,
                allowNull: false
            },
            propertyId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            propertyReference: {
                type: DataTypes.STRING,
                allowNull: false
            },
            readingDate: {
                type: DataTypes.DATE(3),
                allowNull: false,
                primaryKey: true
            },
            readingTypeId: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            room: {
                type: DataTypes.STRING,
                allowNull: false
            },
            sourceModel: {
                type: DataTypes.STRING,
                allowNull: false
            },
            sourceModelType: {
                type: DataTypes.STRING,
                allowNull: false
            },
            unit: {
                type: DataTypes.STRING,
                allowNull: false
            },
            value: {
                type: DataTypes.DECIMAL(25, 15),
                allowNull: false
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

    down: (queryInterface, _sequelize) => {
        return queryInterface.dropTable(tableName);
    }
};