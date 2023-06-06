import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const tableName = 'notificationMessage';

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable(tableName, {
            __IDENTITY: {
                type: DataTypes.UUID,
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
            landlordReference: {
                type: DataTypes.STRING,
                allowNull: false
            },
            notificationId: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true
            },
            recipientType: {
                type: DataTypes.STRING,
                allowNull: false
            },
            recipientEmail: {
                type: DataTypes.STRING,
                allowNull: true
            },
            recipientSmsNumber: {
                type: DataTypes.STRING,
                allowNull: true
            },
            recipientUsername: {
                type: DataTypes.STRING,
                allowNull: true
            },
            recipientLandlordPersonReference: {
                type: DataTypes.STRING,
                allowNull: true
            },
            channel: {
                type: DataTypes.STRING,
                allowNull: false
            },
            notificationDate: {
                type: DataTypes.STRING,
                allowNull: false
            },
            notificationDefinitionId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            notificationDefinitionName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            notificationDefinitionDescription: {
                type: DataTypes.STRING,
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