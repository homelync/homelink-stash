import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const tableName = 'deviceMessage';

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable(tableName, {
            __IDENTITY: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            action: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
            actionTimestamp: {
                type: DataTypes.DATE(3),
                allowNull: false,
                primaryKey: true,
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
            deviceId: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
            devicePhySerialNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            deviceSerialNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            installedBy: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            installationDate: {
                type: DataTypes.DATE(3),
                allowNull: false,
            },
            landlordReference: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            locationNickname: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            manufacturerReference: {
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
            replaceByDate: {
                type: DataTypes.DATE(3),
                allowNull: true,
            },
            room: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            sourceModel: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            sourceModelType: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            uninstallationDate: {
                type: DataTypes.DATE(3),
                allowNull: true,
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
    },
};