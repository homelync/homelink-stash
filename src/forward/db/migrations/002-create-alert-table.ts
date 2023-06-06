import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const tableName = 'alertMessage';

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable(tableName, {
            __IDENTITY: {
                type: DataTypes.UUID,
                allowNull: false
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
            category: {
                type: DataTypes.STRING,
                allowNull: false
            },
            eventId: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true
            },
            resolvedDate: {
                type: DataTypes.DATE(3),
                allowNull: true
            },
            resolvingEventId: {
                type: DataTypes.UUID,
                allowNull: true
            },
            resolvingEventTypeDescription: {
                type: DataTypes.STRING,
                allowNull: true
            },
            resolvingEventTypeId: {
                type: DataTypes.STRING,
                allowNull: true
            },
            resolvingEventTypeName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            statusId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            deviceSerialNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            devicePhySerialNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            deviceId: {
                type: DataTypes.UUID,
                allowNull: true
            },
            insightId: {
                type: DataTypes.UUID,
                allowNull: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            eventTypeId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            eventTypeName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            insightDefinitionId: {
                type: DataTypes.STRING,
                allowNull: true
            },
            landlordReference: {
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
            manufacturerReference: {
                type: DataTypes.STRING,
                allowNull: true
            },
            propertyId: {
                type: DataTypes.UUID,
                allowNull: true
            },
            propertyReference: {
                type: DataTypes.STRING,
                allowNull: false
            },
            propertyDisplayReference: {
                type: DataTypes.STRING,
                allowNull: false
            },
            raisedDate: {
                type: DataTypes.DATE(3),
                allowNull: false
            },
            room: {
                type: DataTypes.STRING,
                allowNull: false
            },
            sourceId: {
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